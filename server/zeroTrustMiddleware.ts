import { Request, Response, NextFunction } from 'express';
import { zeroTrust } from './cloudflareZeroTrust';

export interface ZeroTrustRequest extends Request {
  zeroTrustUser?: {
    id: string;
    email: string;
    name?: string;
    groups?: string[];
    identity_provider?: string;
  };
}

// Middleware to validate Cloudflare Access JWT tokens
export const validateZeroTrustToken = async (
  req: ZeroTrustRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Skip Zero Trust validation if not configured
    if (!zeroTrust) {
      return next();
    }

    // Get JWT token from Cloudflare Access header
    const accessToken = req.headers['cf-access-jwt-assertion'] as string;
    
    if (!accessToken) {
      // If no Zero Trust token but Zero Trust is enabled, check if this endpoint requires it
      const requiresZeroTrust = req.headers['x-require-zero-trust'] === 'true';
      
      if (requiresZeroTrust) {
        return res.status(401).json({ 
          error: 'Zero Trust authentication required',
          code: 'ZERO_TRUST_REQUIRED'
        });
      }
      
      return next();
    }

    // Validate the JWT token
    const audTag = process.env.CLOUDFLARE_AUD_TAG;
    const zeroTrustUser = await zeroTrust.validateAccessToken(accessToken, audTag);

    if (!zeroTrustUser) {
      return res.status(401).json({ 
        error: 'Invalid Zero Trust token',
        code: 'INVALID_ZERO_TRUST_TOKEN'
      });
    }

    // Attach Zero Trust user info to request
    req.zeroTrustUser = zeroTrustUser;
    
    // Log access for security monitoring
    
    next();
  } catch (error) {
    console.error('Zero Trust validation error:', error);
    
    // In production, you might want to fail securely
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      return res.status(401).json({ 
        error: 'Authentication verification failed',
        code: 'ZERO_TRUST_ERROR'
      });
    }
    
    // In development, continue without Zero Trust if there's an error
    next();
  }
};

// Middleware to check if user belongs to specific Zero Trust groups
export const requireZeroTrustGroup = (requiredGroups: string[]) => {
  return (req: ZeroTrustRequest, res: Response, next: NextFunction) => {
    if (!req.zeroTrustUser) {
      return res.status(401).json({ 
        error: 'Zero Trust authentication required',
        code: 'ZERO_TRUST_GROUP_REQUIRED'
      });
    }

    const userGroups = req.zeroTrustUser.groups || [];
    const hasRequiredGroup = requiredGroups.some(group => userGroups.includes(group));

    if (!hasRequiredGroup) {
      return res.status(403).json({ 
        error: 'Insufficient permissions - required group membership missing',
        code: 'INSUFFICIENT_ZERO_TRUST_PERMISSIONS',
        required_groups: requiredGroups,
        user_groups: userGroups
      });
    }

    next();
  };
};

// Middleware to validate service tokens for API access
export const validateServiceToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Skip if Zero Trust is not configured
    if (!zeroTrust) {
      return next();
    }

    const clientId = req.headers['cf-access-client-id'] as string;
    const clientSecret = req.headers['cf-access-client-secret'] as string;

    if (!clientId || !clientSecret) {
      // Check if this endpoint requires service token
      const requiresServiceToken = req.headers['x-require-service-token'] === 'true';
      
      if (requiresServiceToken) {
        return res.status(401).json({ 
          error: 'Service token required',
          code: 'SERVICE_TOKEN_REQUIRED'
        });
      }
      
      return next();
    }

    // Validate service token format and structure
    const isValid = zeroTrust.validateServiceToken(clientId, clientSecret);
    
    if (!isValid) {
      return res.status(401).json({ 
        error: 'Invalid service token',
        code: 'INVALID_SERVICE_TOKEN'
      });
    }

    // Log service token access
    
    next();
  } catch (error) {
    console.error('Service token validation error:', error);
    return res.status(401).json({ 
      error: 'Service token validation failed',
      code: 'SERVICE_TOKEN_ERROR'
    });
  }
};

// Combined middleware for comprehensive Zero Trust protection
export const zeroTrustProtection = (options?: {
  requireGroups?: string[];
  requireServiceToken?: boolean;
  bypassInDevelopment?: boolean;
}) => {
  return async (req: ZeroTrustRequest, res: Response, next: NextFunction) => {
    // Bypass in development if specified
    if (options?.bypassInDevelopment && process.env.NODE_ENV === 'development') {
      return next();
    }

    // Set requirement headers for downstream middleware
    if (options?.requireServiceToken) {
      req.headers['x-require-service-token'] = 'true';
    }
    if (options?.requireGroups && options.requireGroups.length > 0) {
      req.headers['x-require-zero-trust'] = 'true';
    }

    // Validate service token first
    if (options?.requireServiceToken) {
      await validateServiceToken(req, res, () => {});
      if (res.headersSent) return;
    }

    // Validate Zero Trust token
    await validateZeroTrustToken(req, res, () => {});
    if (res.headersSent) return;

    // Check group membership if required
    if (options?.requireGroups && options.requireGroups.length > 0) {
      return requireZeroTrustGroup(options.requireGroups)(req, res, next);
    }

    next();
  };
};

// Helper function to get Zero Trust user info from request
export const getZeroTrustUser = (req: ZeroTrustRequest) => {
  return req.zeroTrustUser || null;
};

// Helper function to check if user has specific Zero Trust permissions
export const hasZeroTrustPermission = (req: ZeroTrustRequest, requiredGroups: string[]) => {
  if (!req.zeroTrustUser) return false;
  
  const userGroups = req.zeroTrustUser.groups || [];
  return requiredGroups.some(group => userGroups.includes(group));
};
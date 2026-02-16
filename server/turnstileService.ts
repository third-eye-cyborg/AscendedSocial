interface TurnstileVerificationResult {
  success: boolean;
  challengeTs?: string;
  hostname?: string;
  errorCodes?: string[];
  action?: string;
  cdata?: string;
}

export class TurnstileService {
  private static readonly VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.TURNSTILE_SECRET_KEY || '';
    
    if (!this.secretKey) {
      console.warn('TURNSTILE_SECRET_KEY not configured. Turnstile verification will be bypassed in development.');
    }
  }

  /**
   * Verify a Turnstile token with Cloudflare
   * @param token - The Turnstile response token from the client
   * @param remoteIp - Optional remote IP address for additional validation
   * @returns Promise<TurnstileVerificationResult>
   */
  async verifyToken(token: string, remoteIp?: string): Promise<TurnstileVerificationResult> {
    // Skip verification in development if secret key is not configured
    if (!this.secretKey && process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: Bypassing Turnstile verification');
      return {
        success: true,
        hostname: 'localhost',
        action: 'development-bypass'
      };
    }

    if (!this.secretKey) {
      console.error('TURNSTILE_SECRET_KEY is required for Turnstile verification');
      return {
        success: false,
        errorCodes: ['missing-secret']
      };
    }

    if (!token) {
      return {
        success: false,
        errorCodes: ['missing-input-response']
      };
    }

    try {
      // Prepare form data for verification
      const formData = new URLSearchParams();
      formData.append('secret', this.secretKey);
      formData.append('response', token);
      
      if (remoteIp) {
        formData.append('remoteip', remoteIp);
      }

      // Send verification request to Cloudflare
      const response = await fetch(TurnstileService.VERIFY_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) {
        console.error('Turnstile verification request failed:', response.status, response.statusText);
        return {
          success: false,
          errorCodes: ['request-failed']
        };
      }

      const result = await response.json();
      
      // Transform response to our interface
      const verificationResult: TurnstileVerificationResult = {
        success: result.success || false,
        challengeTs: result.challenge_ts,
        hostname: result.hostname,
        errorCodes: result['error-codes'] || [],
        action: result.action,
        cdata: result.cdata
      };

      // Log verification result (without sensitive data)
      if (verificationResult.success) {
        console.log(`✅ Turnstile verification successful for hostname: ${verificationResult.hostname}`);
      } else {
        console.warn(`❌ Turnstile verification failed:`, verificationResult.errorCodes);
      }

      return verificationResult;
    } catch (error) {
      console.error('Turnstile verification error:', error);
      return {
        success: false,
        errorCodes: ['internal-error']
      };
    }
  }

  /**
   * Get human-readable error message for Turnstile error codes
   * @param errorCodes - Array of error codes from Turnstile
   * @returns string - User-friendly error message
   */
  getErrorMessage(errorCodes: string[]): string {
    if (!errorCodes || errorCodes.length === 0) {
      return 'Verification failed. Please try again.';
    }

    const errorCode = errorCodes[0];
    
    switch (errorCode) {
      case 'missing-input-secret':
        return 'Server configuration error. Please contact support.';
      case 'invalid-input-secret':
        return 'Server configuration error. Please contact support.';
      case 'missing-input-response':
        return 'Please complete the security verification.';
      case 'invalid-input-response':
        return 'Security verification failed. Please try again.';
      case 'timeout-or-duplicate':
        return 'Verification expired or already used. Please try again.';
      case 'internal-error':
        return 'Security service temporarily unavailable. Please try again.';
      case 'bad-request':
        return 'Invalid security verification. Please refresh the page.';
      default:
        return 'Security verification failed. Please try again.';
    }
  }

  /**
   * Middleware to verify Turnstile token in requests
   */
  createVerificationMiddleware() {
    return async (req: any, res: any, next: any) => {
      const turnstileToken = req.body.turnstileToken || req.body['cf-turnstile-response'];
      
      if (!turnstileToken) {
        return res.status(400).json({
          success: false,
          message: 'Security verification required.',
          code: 'TURNSTILE_REQUIRED'
        });
      }

      const clientIp = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
      const verification = await this.verifyToken(turnstileToken, clientIp);

      if (!verification.success) {
        return res.status(400).json({
          success: false,
          message: this.getErrorMessage(verification.errorCodes || []),
          code: 'TURNSTILE_VERIFICATION_FAILED',
          errorCodes: verification.errorCodes
        });
      }

      // Add verification info to request for downstream use
      req.turnstileVerification = verification;
      next();
    };
  }

  /**
   * Check if Turnstile is properly configured
   * @returns boolean
   */
  isConfigured(): boolean {
    return !!this.secretKey;
  }

  /**
   * Get configuration status for debugging
   */
  getStatus() {
    return {
      configured: this.isConfigured(),
      secretKeyPresent: !!this.secretKey,
      environment: process.env.NODE_ENV,
      verifyUrl: TurnstileService.VERIFY_URL
    };
  }
}

// Export singleton instance
export const turnstileService = new TurnstileService();
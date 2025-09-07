import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import passport from "passport";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

// List of admin user IDs (Replit user IDs) who can access admin functions
const ADMIN_USER_IDS = [
  "25531750", // Add your Replit user ID here
  // Add more admin user IDs as needed
];

async function upsertAdminUser(claims: any) {
  // Only create admin users if they're in the allowed list
  if (!ADMIN_USER_IDS.includes(claims["sub"])) {
    throw new Error("User is not authorized for admin access");
  }

  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
  
  return await storage.getUser(claims["sub"]);
}

export async function setupAdminAuth(app: Express) {
  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    try {
      const claims = tokens.claims();
      
      // Check if user is authorized for admin access
      if (!ADMIN_USER_IDS.includes(claims["sub"])) {
        console.warn(`❌ Unauthorized admin access attempt by user: ${claims["sub"]} (${claims["email"]})`);
        verified(new Error("User is not authorized for admin access"), null);
        return;
      }

      const dbUser = await upsertAdminUser(claims);
      const user = dbUser ? { 
        ...dbUser,
        claims,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: claims?.exp || Math.floor(Date.now() / 1000) + 3600,
        isAdmin: true
      } as any : null;
      
      if (user) {
        console.log(`✅ Admin authentication successful: ${user.email}`);
        verified(null, user);
      } else {
        verified(new Error("Failed to create admin user"), null);
      }
    } catch (error) {
      console.error("Error in admin verify function:", error);
      verified(error, null);
    }
  };

  // Create separate Passport strategy for admin authentication
  for (const domain of process.env.REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replit-admin:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/admin/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  // Admin login endpoint
  app.get("/api/admin/login", (req, res, next) => {
    console.log('🔐 Admin login attempt from:', req.ip);
    
    passport.authenticate(`replit-admin:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  // Admin callback endpoint
  app.get("/api/admin/callback", (req, res, next) => {
    passport.authenticate(`replit-admin:${req.hostname}`, (err: any, user: any, info: any) => {
      if (err) {
        console.error("Admin auth error:", err);
        return res.redirect("/api/admin/login?error=auth_failed");
      }
      if (!user) {
        console.error("No admin user returned from auth:", info);
        return res.redirect("/api/admin/login?error=unauthorized");
      }
      
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error("Admin login error:", loginErr);
          return res.redirect("/api/admin/login?error=login_failed");
        }
        
        console.log(`✅ Admin authentication successful: ${user.email}`);
        res.redirect("/admin/dashboard"); // Redirect to admin dashboard
      });
    })(req, res, next);
  });

  // Admin logout endpoint
  app.get("/api/admin/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });

  // Get current admin user endpoint
  app.get("/api/admin/user", isAdminAuthenticated, (req: any, res) => {
    const user = req.user;
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      isAdmin: true
    });
  });
}

export const isAdminAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user?.isAdmin) {
    return res.status(401).json({ message: "Admin authentication required" });
  }

  // Check if user is still in admin list
  if (!ADMIN_USER_IDS.includes(user.id)) {
    console.warn(`⚠️ Admin access revoked for user: ${user.id} (${user.email})`);
    return res.status(403).json({ message: "Admin access revoked" });
  }

  if (!user.expires_at) {
    return res.status(401).json({ message: "Invalid admin session" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  // Token refresh logic for admin users
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Admin session expired" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    
    user.claims = tokenResponse.claims();
    user.access_token = tokenResponse.access_token;
    user.refresh_token = tokenResponse.refresh_token;
    user.expires_at = user.claims?.exp;
    
    return next();
  } catch (error) {
    console.error('Admin token refresh failed:', error);
    res.status(401).json({ message: "Admin session expired" });
    return;
  }
};
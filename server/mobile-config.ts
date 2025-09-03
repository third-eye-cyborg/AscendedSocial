
export const getMobileConfig = () => {
  const requiredEnvVars = {
    REPLIT_AUTH_CLIENT_ID: process.env.REPL_ID || process.env.REPLIT_AUTH_CLIENT_ID,
    REPLIT_AUTH_SECRET: process.env.REPLIT_AUTH_SECRET,
    API_BASE_URL: process.env.API_BASE_URL || `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api`,
  };

  // Validate required environment variables
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing required environment variables for mobile app: ${missingVars.join(', ')}`);
  }

  return {
    ...requiredEnvVars,
    MOBILE_AUTH_REDIRECT_URI: process.env.MOBILE_AUTH_REDIRECT_URI || 'ascended://auth/callback',
    MOBILE_DEEP_LINK_SCHEME: process.env.MOBILE_DEEP_LINK_SCHEME || 'ascended://',
  };
};

export const validateMobileConfig = () => {
  const config = getMobileConfig();
  const isValid = !!(config.REPLIT_AUTH_CLIENT_ID && config.REPLIT_AUTH_SECRET && config.API_BASE_URL);
  
  if (!isValid) {
    console.error('❌ Mobile configuration validation failed. Please check your environment variables.');
  } else {
    console.log('✅ Mobile configuration validated successfully');
  }
  
  return isValid;
};

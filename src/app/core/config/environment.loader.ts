/**
 * Environment Configuration Loader
 * 
 * This service loads environment variables from multiple sources:
 * 1. Browser window.__env__ (injected at build time)
 * 2. process.env (for SSR)
 * 3. Fallback to compiled environment config
 * 
 * This allows credentials to be injected at runtime without hardcoding them.
 */

export interface AppConfig {
  production: boolean;
  appName: string;
  apiUrl: string;
  baseUrl: string;
  supabaseUrl: string;
  supabaseKey: string;
  authRedirectUrl: string;
  enableProfileUpsert: boolean;
  posthogKey: string;
  posthogHost: string;
  whatsappPhoneNumberId: string;
  whatsappBusinessAccountId: string;
  whatsappAppId: string;
  whatsappAccessToken?: string;
  whatsappApiUrl: string;
  contact: {
    whatsappNumber: string;
    socialMedia: {
      facebook: string;
      instagram: string;
      github: string;
      linkedin: string;
      youtube: string;
      googleMaps?: string;
    };
  };
  firebaseConfig?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}

/**
 * Get environment variable from multiple sources with priority:
 * 1. Window.__env__ (browser runtime injection)
 * 2. process.env (SSR/build time)
 * 3. Default value
 */
export function getEnvVariable(key: string, defaultValue: string = ''): string {
  // Check browser window first
  if (typeof window !== 'undefined' && window.__env__) {
    return window.__env__[key] || defaultValue;
  }

  // Check process.env for SSR
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }

  return defaultValue;
}

/**
 * Load environment configuration with fallbacks
 * Priority:
 * 1. Runtime injected variables (window.__env__)
 * 2. Compiled environment config from TypeScript
 */
export function loadEnvironmentConfig(compiledEnv: AppConfig): AppConfig {
  return {
    ...compiledEnv,
    // Override with runtime variables if available
    supabaseUrl: getEnvVariable('SUPABASE_URL', compiledEnv.supabaseUrl),
    supabaseKey: getEnvVariable('SUPABASE_ANON_KEY', compiledEnv.supabaseKey),
    apiUrl: getEnvVariable('API_URL', compiledEnv.apiUrl),
    baseUrl: getEnvVariable('BASE_URL', compiledEnv.baseUrl),
    authRedirectUrl: getEnvVariable('AUTH_REDIRECT_URL', compiledEnv.authRedirectUrl),
    posthogKey: getEnvVariable('POSTHOG_KEY', compiledEnv.posthogKey),
    posthogHost: getEnvVariable('POSTHOG_HOST', compiledEnv.posthogHost),
    whatsappPhoneNumberId: getEnvVariable('WHATSAPP_PHONE_NUMBER_ID', compiledEnv.whatsappPhoneNumberId),
    whatsappBusinessAccountId: getEnvVariable('WHATSAPP_BUSINESS_ACCOUNT_ID', compiledEnv.whatsappBusinessAccountId),
    whatsappAppId: getEnvVariable('WHATSAPP_APP_ID', compiledEnv.whatsappAppId),
    whatsappAccessToken: getEnvVariable('WHATSAPP_ACCESS_TOKEN', compiledEnv.whatsappAccessToken),
    whatsappApiUrl: getEnvVariable('WHATSAPP_API_URL', compiledEnv.whatsappApiUrl),
  };
}

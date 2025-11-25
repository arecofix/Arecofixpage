/**
 * Environment Configuration
 * Validates and provides type-safe access to environment variables
 */

export interface EnvironmentConfig {
    production: boolean;
    appName: string;
    supabaseUrl: string;
    supabaseKey: string;
    authRedirectUrl: string;
    enableProfileUpsert: boolean;
    posthogKey: string;
    posthogHost: string;
}

class EnvironmentValidator {
    /**
     * Validates that all required environment variables are present
     * Throws error if any required variable is missing
     */
    static validate(config: Partial<EnvironmentConfig>): void {
        const required: (keyof EnvironmentConfig)[] = [
            'supabaseUrl',
            'supabaseKey',
            'posthogKey',
            'posthogHost'
        ];

        const missing = required.filter(key => !config[key]);

        if (missing.length > 0) {
            throw new Error(
                `Missing required environment variables: ${missing.join(', ')}\n` +
                'Please check your environment configuration.'
            );
        }
    }

    /**
     * Validates URL format
     */
    static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}

/**
 * Creates and validates environment configuration
 */
export function createEnvironmentConfig(
    production: boolean,
    overrides: Partial<EnvironmentConfig> = {}
): EnvironmentConfig {
    const config: EnvironmentConfig = {
        production,
        appName: 'Arecofix',
        supabaseUrl: overrides.supabaseUrl || '',
        supabaseKey: overrides.supabaseKey || '',
        authRedirectUrl: overrides.authRedirectUrl ||
            (production ? 'https://arecofix.com.ar/#/login' : 'http://localhost:4200/#/login'),
        enableProfileUpsert: false,
        posthogKey: overrides.posthogKey || '',
        posthogHost: overrides.posthogHost || 'https://us.i.posthog.com',
    };

    // Validate configuration
    EnvironmentValidator.validate(config);

    // Validate URLs
    if (!EnvironmentValidator.isValidUrl(config.supabaseUrl)) {
        throw new Error(`Invalid Supabase URL: ${config.supabaseUrl}`);
    }

    if (!EnvironmentValidator.isValidUrl(config.posthogHost)) {
        throw new Error(`Invalid PostHog host: ${config.posthogHost}`);
    }

    return config;
}

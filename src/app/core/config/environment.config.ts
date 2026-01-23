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
    externalUrls: {
        gsm: {
            [key: string]: string;
        };
        portfolio: {
            cv: string;
        };
    };
    contact: {
        whatsappNumber: string;
        socialMedia: {
            facebook: string;
            instagram: string;
            github: string;
            linkedin: string;
            youtube: string;
            googleMaps: string;
        };
    };
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
        contact: overrides.contact || {
            whatsappNumber: '5491125960900',
            socialMedia: {
                facebook: 'https://www.facebook.com/ArecoFix/',
                instagram: 'https://www.instagram.com/ArecoFix/',
                github: 'https://github.com/arecofix',
                linkedin: 'https://www.linkedin.com/in/ezequiel-enrico/',
                youtube: 'https://www.youtube.com/@Arecofix',
                googleMaps: 'https://g.page/r/CQeBPqhRjbRzEAE/review'
            }
        },
        externalUrls: overrides.externalUrls || {
            gsm: {
                samsung_usb: 'https://developer.samsung.com/android-usb-driver',
                odin: 'https://odindownload.com/',
                xiaomi_adb: 'https://github.com/Szaki/XiaomiADBFastbootTools',
                platform_tools: 'https://developer.android.com/studio/releases/platform-tools',
                flexihub: 'https://www.flexihub.com/download/',
                radmin_vpn: 'https://www.radmin-vpn.com/',
                usb_redirector: 'https://www.incentivespro.com/downloads.html',
                rustdesk: 'https://rustdesk.com/',
                teamviewer: 'https://www.teamviewer.com/download/',
                ultraviewer: 'https://www.ultraviewer.net/en/download.html',
                psiphon: 'https://psiphon.ca/en/download.html',
                anydesk: 'https://anydesk.com/en/downloads',
                virtualhere: 'https://www.virtualhere.com/usb_client_software',
                samfw: 'https://samfw.com/blog/samfw-tool',
                samfirm: 'https://samfirmtool.com/',
                tres_u_tools: 'http://www.3u.com/'
            },
            portfolio: {
                cv: 'assets/img/portfolio/Ezequiel_Enrico_CV.pdf'
            }
        }
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

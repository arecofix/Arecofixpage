export interface Environment {
  production: boolean;
  appName: string;
  apiUrl: string;
  baseUrl: string;
  supabaseUrl: string;
  supabaseKey: string;
  authRedirectUrl: string;
  enableProfileUpsert: boolean;
  posthogKey?: string;
  posthogHost?: string;
  // WhatsApp Configuration (Optional as it might not be in all envs or handled differently)
  whatsappToken?: string;
  whatsappPhoneNumberId?: string;
  whatsappBusinessAccountId?: string;
  whatsappAppId?: string;
  whatsappApiUrl?: string;

  contact: {
    whatsappNumber: string;
    socialMedia: {
      facebook: string;
      instagram: string;
      github: string;
      linkedin: string;
      youtube: string;
      googleMaps: string;
    }
  };

  externalUrls: {
    gsm: {
      samsung_usb: string;
      odin: string;
      xiaomi_adb: string;
      platform_tools: string;
      flexihub: string;
      radmin_vpn: string;
      usb_redirector: string;
      rustdesk: string;
      teamviewer: string;
      ultraviewer: string;
      psiphon: string;
      anydesk: string;
      virtualhere: string;
      samfw: string;
      samfirm: string;
      tres_u_tools: string;
      // New keys
      unlocktool: string;
      chimeratool: string;
      z3x_team: string;
      sigmakey: string;
      [key: string]: string; // Allow additional keys
    };
    portfolio: {
      cv: string;
    };
  };
}

/**
 * Development Environment Configuration
 * 
 * SECURITY NOTE: API keys should be stored in .env file (not committed to Git)
 * For now, we keep the keys here but they should be moved to environment variables
 * in a production setup with proper build-time replacement.
 * 
 * TODO: Implement proper environment variable injection at build time
 */
import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  appName: 'Arecofix',
  apiUrl: 'https://arecofix.com.ar',
  baseUrl: 'https://arecofix.com.ar',

  // Supabase Configuration
  // TODO: Move to .env and use build-time replacement
  supabaseUrl: 'https://jftiyfnnaogmgvksgkbn.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0',

  authRedirectUrl: 'http://localhost:4200',
  enableProfileUpsert: false,

  // Analytics Configuration
  // TODO: Move to .env and use build-time replacement
  posthogKey: 'phc_qFqQScDE30GuuNh1UmGOcg8zQZIiHSpPXZ2761l50q4',
  posthogHost: 'https://us.i.posthog.com',

  // Contact Information
  contact: {
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

  externalUrls: {
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
      tres_u_tools: 'http://www.3u.com/',
      unlocktool: 'https://unlocktool.net',
      chimeratool: 'https://chimeratool.com',
      z3x_team: 'https://z3x-team.com',
      sigmakey: 'https://sigmakey.com'
    },
    portfolio: {
      cv: 'assets/img/portfolio/Ezequiel_Enrico_CV.pdf'
    }
  }
};
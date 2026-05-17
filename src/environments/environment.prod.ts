/**
 * Production Environment Configuration
 * 
 * SECURITY WARNING: These API keys are currently hardcoded
 * In a proper production setup, these should be:
 * 1. Stored in environment variables on the build server
 * 2. Injected at build time using Angular's file replacement
 * 3. Never committed to version control
 * 
 * Note: Supabase anon key is safe to expose on client-side as it's protected by RLS
 * However, other keys should be properly secured.
 */
import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  appName: 'Arecofix',
  apiUrl: 'https://arecofix.com.ar',
  baseUrl: 'https://arecofix.com.ar',

  // Supabase Configuration (Anon key is safe for client-side)
  supabaseUrl: 'https://jftiyfnnaogmgvksgkbn.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0', // Anon key

  authRedirectUrl: 'https://arecofix.com.ar',
  enableProfileUpsert: false,
  posthogKey: 'phc_qFqQScDE30GuuNh1UmGOcg8zQZIiHSpPXZ2761l50q4',
  posthogHost: 'https://us.i.posthog.com',
  // WhatsApp Configuration
  whatsappPhoneNumberId: '322928504245092',
  whatsappBusinessAccountId: '368379263021902',
  whatsappAppId: '1209190100450173',
  whatsappApiUrl: 'https://graph.facebook.com/v22.0',

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
  },
  firebase: {
    apiKey: "AIzaSyDyX9CdSDY8gGKetZZdcq1aOhEWMdqLWyI",
    authDomain: "arecofix-20698.firebaseapp.com",
    databaseURL: "https://arecofix-20698-default-rtdb.firebaseio.com",
    projectId: "arecofix-20698",
    storageBucket: "arecofix-20698.firebasestorage.app",
    messagingSenderId: "106654865765",
    appId: "1:106654865765:web:7dc07179d0f67536e2e98c",
    measurementId: "G-812SLQ7KEJ"
  }
};
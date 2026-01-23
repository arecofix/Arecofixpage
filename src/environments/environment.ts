/**
 * Development Environment Configuration
 * 
 * SECURITY NOTE: API keys should be stored in .env file (not committed to Git)
 * For now, we keep the keys here but they should be moved to environment variables
 * in a production setup with proper build-time replacement.
 * 
 * TODO: Implement proper environment variable injection at build time
 */
export const environment = {
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
};
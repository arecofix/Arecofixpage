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

  // Supabase Configuration
  // TODO: Move to .env and use build-time replacement
  supabaseUrl: 'https://jftiyfnnaogmgvksgkbn.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0',

  authRedirectUrl: 'http://localhost:4200/#/login',
  enableProfileUpsert: false,

  // Analytics Configuration
  // TODO: Move to .env and use build-time replacement
  posthogKey: 'phc_qFqQScDE30GuuNh1UmGOcg8zQZIiHSpPXZ2761l50q4',
  posthogHost: 'https://us.i.posthog.com',

  // WhatsApp Configuration
  whatsappToken: 'EAARLwIJnO30BQJVYYg23XHI8YlOxew5mmmNrQJT5ZCbKj27RmMxVPslyaTfYKnJA4P5JZCk80JwnzOgZCF0zR5ZC2gDRm6TidoX0jHVE9rp77QHcehimvSmZClobDmSZAGXVv7NyK5RGuSZBbh5Fie1ykDfxeGw7NZCR2DkJabcZB6odycEjRgeBjEMqA9587UPZAPzVoPZAquACqZA0et2Q0pWcZCYDX3gsZC2VY6tlJ86oM5o7AEmaKDbUtveRLRAAAZCaa77S2MOerzRZCP4c394xVYQVH0RVyf9j5plybQZDZD',
  whatsappPhoneNumberId: '322928504245092',
  whatsappBusinessAccountId: '368379263021902',
  whatsappAppId: '1209190100450173',
  whatsappApiUrl: 'https://graph.facebook.com/v22.0', // Base URL, phone ID to be appended in service
};
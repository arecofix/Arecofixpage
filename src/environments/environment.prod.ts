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
export const environment = {
  production: true,
  appName: 'Arecofix',
  apiUrl: 'https://arecofix.com.ar',

  // Supabase Configuration (Anon key is safe for client-side)
  supabaseUrl: 'https://jftiyfnnaogmgvksgkbn.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0', // Anon key

  authRedirectUrl: 'https://arecofix.com.ar/#/login',
  enableProfileUpsert: false,

  // Analytics Configuration
  posthogKey: 'phc_qFqQScDE30GuuNh1UmGOcg8zQZIiHSpPXZ2761l50q4',
  posthogHost: 'https://us.i.posthog.com',
};
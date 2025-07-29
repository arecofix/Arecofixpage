export const environment = {
  production: false, // Cambia a true en environment.prod.ts
  appName: 'Arecofix',
  apiUrl: 'http://localhost:4200', // URL local para desarrollo
  supabaseUrl: 'https://ynlwzeawbbhundpigqgy.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubHd6ZWF3YmJodW5kcGlncWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0ODkxMjQsImV4cCI6MjA2OTA2NTEyNH0.v2wfFPDy-RnDm8VV9yI3eiGZDTHpRAyCa7loBPQ_bsc', // Clave pública (anon key)
  authRedirectUrl: 'http://localhost:4200/auth/callback', // URL post-login
};
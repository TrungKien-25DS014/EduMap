const supabaseUrl = 'https://scdahirilqjfblotpqgl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjZGFoaXJpbHFqZmJsb3RwcWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMjg5ODMsImV4cCI6MjA5MzYwNDk4M30.GzpTr9JAkqxKbD2cgnECCs3uv8FrmmBYiYbg1kGcnXs';
const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: window.sessionStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
window.supabaseClient = _supabase;
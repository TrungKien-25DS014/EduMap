const supabaseUrl = 'https://scdahirilqjfblotpqgl.supabase.co';
const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
window.supabaseClient = _supabase;
console.log(window.supabaseClient);
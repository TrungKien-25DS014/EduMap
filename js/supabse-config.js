
const supabaseUrl = 'URL_CỦA_BẠN';
const supabaseKey = 'ANON_KEY_CỦA_BẠN';

const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

window.supabaseClient = _supabase;

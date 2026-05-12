
const supabaseUrl = 'sb_secret_r_q9Oi7FJvosFw-PBrVxhw_AjzOd4q3';
const supabaseKey = 'sb_publishable_6KKX2eK0AWr9nqsWTUNEpg_OzBb3XMf';

const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

window.supabaseClient = _supabase;

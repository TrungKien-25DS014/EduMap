

const supabaseUrl = 'URL_CỦA_BẠN';
const supabaseKey = 'ANON_KEY_CỦA_BẠN';

const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

window.supabaseClient = _supabase;
// js/supabase-config.js

const supabaseUrl = 'URL_CỦA_BẠN_Ở_ĐÂY';
const supabaseKey = 'ANON_KEY_CỦA_BẠN_Ở_ĐÂY';

// Khởi tạo thư viện Supabase
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
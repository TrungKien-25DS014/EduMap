// js/supabase-config.js
const supabaseUrl = 'URL_CỦA_BẠN';
const supabaseKey = 'ANON_KEY_CỦA_BẠN';

// Khởi tạo client duy nhất cho toàn bộ dự án
const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Xuất ra biến toàn cục để các file js khác sử dụng
window.supabaseClient = _supabase;

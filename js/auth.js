// js/auth.js

// Hàm Đăng ký
async function handleSignUp(email, password, fullName, role) {
    const { data, error } = await window.supabaseClient.auth.signUp({
        email: email,
        password: password,
    });

    if (error) throw error;

    if (data.user) {
        // Lưu thông tin bổ sung vào bảng profiles
        const { error: profileError } = await window.supabaseClient
            .from('profiles')
            .insert([{ id: data.user.id, full_name: fullName, role: role }]);
        
        if (profileError) throw profileError;
    }
    return data;
}

// Hàm Đăng nhập
async function handleLogin(email, password) {
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) throw error;
    return data;
}

// Hàm Đăng xuất
async function handleLogout() {
    const { error } = await window.supabaseClient.auth.signOut();
    if (error) alert("Lỗi khi đăng xuất");
    window.location.href = "index.html";
}

// Kiểm tra trạng thái đăng nhập để ẩn/hiện nút trên Navbar
async function checkAuthState() {
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    const loginBtn = document.querySelector('.btn-login');
    
    if (user && loginBtn) {
        loginBtn.innerText = "ĐĂNG XUẤT";
        loginBtn.href = "#";
        loginBtn.onclick = handleLogout;
    }
}

// Chạy kiểm tra mỗi khi tải trang
document.addEventListener('DOMContentLoaded', checkAuthState);

async function handleSignUp(email, password, fullName, role) {
    const { data, error } = await window.supabaseClient.auth.signUp({
        email: email,
        password: password,
    });
    if (error) throw error;
    if (data.user) {
        const { error: profileError } = await window.supabaseClient
            .from('profiles')
            .insert([{ id: data.user.id, full_name: fullName, role: role }]);
        if (profileError) throw profileError;
    }
    return data;
}
async function handleLogin(email, password) {
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) throw error;
    return data;
}
async function handleLogout() {
    const { error } = await window.supabaseClient.auth.signOut();
    if (error) alert("Lỗi khi đăng xuất");
    window.location.href = "index.html";
}
async function checkAuthState() {
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    const loginBtn = document.querySelector('.btn-login');
    if (user && loginBtn) {
        loginBtn.innerText = "ĐĂNG XUẤT";
        loginBtn.href = "#";
        loginBtn.onclick = handleLogout;
    }
}
document.addEventListener('DOMContentLoaded', checkAuthState);
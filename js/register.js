document.addEventListener("DOMContentLoaded", () => {
    const btnRegister = document.getElementById("btnRegister");
    if (!btnRegister) return;
    btnRegister.addEventListener("click", async () => {
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        if (!fullName || !email || !password || !confirmPassword) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        if (password.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }
        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }
        const role = "student"; 
        try {
            btnRegister.disabled = true;
            btnRegister.innerText = "Đang xử lý...";
            const { data, error: signUpError } = await window.supabaseClient.auth.signUp({
                email: email,
                password: password
            });
            if (signUpError) {
                alert("Lỗi: " + signUpError.message);
                return;
            }
            const user = data.user;
            if (user) {
                const { error: insertError } = await window.supabaseClient
                    .from('accounts')
                    .insert({
                        id: user.id,
                        email: email,
                        full_name: fullName,
                        role: role
                    });
                if (insertError) {
                    alert("Lỗi lưu hồ sơ: " + insertError.message);
                    return;
                }
            }
            alert("Đăng ký thành công!");
            window.location.href = "login.html";
        } catch (error) {
            alert("Đã có lỗi bất ngờ xảy ra: " + error.message);
        } finally {
            btnRegister.disabled = false;
            btnRegister.innerText = "Đăng ký ngay";
        }
    });
});
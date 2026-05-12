const ValidationHelper = {
    isValidGmail: (email) => {
        const cleanEmail = email.trim();
        const gmailRegex = /^[a-zA-Z0-9.]+@gmail\.com$/;
        return gmailRegex.test(cleanEmail);
    }
};
async function registerUser(email, password) {
    if (!ValidationHelper.isValidGmail(email)) {
        alert("Vui lòng nhập đúng định dạng @gmail.com");
        return;
    }

    if (password.length < 6) {
        alert("Mật khẩu phải từ 6 ký tự trở lên");
        return;
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) throw error;
        
        alert("Đăng ký thành công! Vui lòng check email để xác nhận.");
    } catch (err) {
        console.error("Lỗi đăng ký:", err.message);
    }
}
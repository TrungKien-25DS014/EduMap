const btn = document.querySelector('.auth-box button');
if (btn) {
    btn.onclick = async () => {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const role1 = document.querySelector('input[name="role"]:checked');
        if(!role1){
            alert("Vui lòng chọn vai trò!");
            return;
        }
        const role = role1.value;
        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            alert("Vui lòng xác nhận bạn không phải là người máy.");
            return;
        }

        try {
            btn.disabled = true;
            btn.innerText = "Đang xử lý...";
            if(await checkValueNotExists('email', email)) {
                await handleSignUp(email, password, fullName, role);
                alert("Đăng ký thành công!");
                window.location.href = "login.html";
            } else {
                alert("Email đã được sử dụng!");
            }
        } catch (e) {
            alert("Lỗi: " + e.message);
        } finally {
            btn.disabled = false;
            btn.innerText = "Đăng ký";
            grecaptcha.reset();
        }
    };
}

async function checkValueNotExists(column, value) {
    const { data, error } = await supabase
        .from('users') // đổi tên bảng của bạn ở đây
        .select(column)
        .eq(column, value)
        .maybeSingle();

    if (error) {
        console.error("Lỗi Supabase:", error);
        return false; // coi như fail luôn nếu lỗi
    }

    // Nếu có data => đã tồn tại => return false
    return !data;
}
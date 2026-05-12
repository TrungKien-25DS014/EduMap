const btnLogin = document.querySelector('.login-box button');
if (btnLogin) {
    btnLogin.onclick = async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (email === "" || password === "") {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        try {
            btnLogin.innerText = "Đang đăng nhập...";
            if (email === "user@gmail.com" && password === "123456") {
                await new Promise(resolve => setTimeout(resolve, 1000));
                window.location.href = "find_tutor.html";
            } else {
                alert("Sai tài khoản hoặc mật khẩu");
            }
        } catch (e) {
            alert("Lỗi: " + e.message);
        } finally {
            btnLogin.innerText = "Đăng nhập";
        }
    };
}
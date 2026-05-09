// js/login.js
const btnLogin = document.querySelector('.login-content button');
if (btnLogin) {
    btnLogin.onclick = async () => {
        const email = document.querySelector('input[type="text"]').value;
        const password = document.querySelector('input[type="password"]').value;

        try {
            btnLogin.innerText = "Đang đăng nhập...";
            await handleLogin(email, password);
            alert("Thành công!");
            window.location.href = "index.html";
        } catch (e) {
            alert("Thất bại: " + e.message);
        } finally {
            btnLogin.innerText = "Đăng nhập";
        }
    };
}

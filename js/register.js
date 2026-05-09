// js/register.js
const btn = document.querySelector('.auth-box button');
if (btn) {
    btn.onclick = async () => {
        const fullName = document.querySelector('input[placeholder="Họ và tên"]').value;
        const email = document.querySelector('input[placeholder="Email hoặc SĐT"]').value;
        const password = document.querySelectorAll('input[type="password"]')[0].value;
        const role = document.querySelector('input[name="role"]:checked').value;

        try {
            btn.innerText = "Đang xử lý...";
            await handleSignUp(email, password, fullName, role);
            alert("Đăng ký thành công!");
            window.location.href = "login.html";
        } catch (e) {
            alert("Lỗi: " + e.message);
        } finally {
            btn.innerText = "Đăng ký";
        }
    };
}

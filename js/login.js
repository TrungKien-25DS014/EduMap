const btnLogin = document.querySelector('.login-box button');
if (btnLogin) {
    btnLogin.onclick = async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (email == "" || password == "") {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        try {
            btnLogin.onclick = async (e) => {
                e.preventDefault();
                if(email =="user@gmail.com" && password == "123456"){
                    btnLogin.innerText = "Đang đăng nhập...";
                    //await handleLogin(email, password);
                    window.location.href = "find_tutor.html";
                }
            }
        } catch (e) {
            alert("Thất bại: " + e.message);
        } finally {
            btnLogin.innerText = "Đăng nhập";
        }
    };
}

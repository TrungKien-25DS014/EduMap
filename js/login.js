const btnLogin = document.getElementById("btnLogin");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

if (emailInput) {
    emailInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            passwordInput.focus();
        }
    });
}

if (passwordInput) {
    passwordInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (btnLogin) btnLogin.click();
        }
    });
}

if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        if(!email || !password){
            alert("Nhập đầy đủ thông tin");
            return;
        }
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        if(error){
            alert(error.message);
        } else {
            window.location.href = "../page/find_tutor.html";
        }
    });
}
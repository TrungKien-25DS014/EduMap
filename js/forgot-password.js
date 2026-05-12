const btnReset = document.getElementById("btnReset");

btnReset.addEventListener("click", async () => {
    const email = document.getElementById("email").value;

    if (!email) {
        alert("Nhập email!");
        return;
    }

    btnReset.innerText = "Đang gửi...";

    const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "http://127.0.0.1:5500/EduMap/page/reset-password.html"
    });

    if (error) {
        alert(error.message);
        btnReset.innerText = "Gửi liên kết";
    } else {
        alert("Đã gửi email khôi phục!");
        btnReset.innerText = "Gửi liên kết";
    }
});

console.log(window.supabaseClient);
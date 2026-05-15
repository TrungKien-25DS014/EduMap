const btnSave = document.getElementById("btnSave");
if (btnSave) {
    btnSave.addEventListener("click", async () => {
        const password = document.getElementById("newPassword").value;
        if (password.length < 6) {
            alert("Mật khẩu tối thiểu 6 ký tự");
            return;
        }
        btnSave.innerText = "Đang cập nhật...";
        const { error } = await window.supabaseClient.auth.updateUser({
            password: password
        });
        if (error) {
            alert(error.message);
            btnSave.innerText = "Cập nhật mật khẩu";
        } else {
            alert("Đổi mật khẩu thành công!");
            await window.supabaseClient.auth.signOut();
            window.location.href = "index.html";
        }
    });
}
const btnLogin =
document.getElementById("btnLogin");

btnLogin.addEventListener("click", async () => {

    const email =
    document.getElementById("email")
    .value;

    const password =
    document.getElementById("password")
    .value;

    if(!email || !password){

        alert("Nhập đầy đủ thông tin");

        return;
    }

    const { data, error } =
    await window.supabaseClient.auth
    .signInWithPassword({

        email: email,
        password: password
    });

    if(error){

        alert(error.message);

    } else {

        alert("Đăng nhập thành công!");

        window.location.href =
        "../page/find_tutor.html";
    }
});
const btn =
document.querySelector(
    '.auth-box button'
);

if(btn){

    btn.onclick = async () => {

        const fullName =
        document.getElementById(
            'fullName'
        ).value;

        const email =
        document.getElementById(
            'email'
        ).value;

        const password =
        document.getElementById(
            'password'
        ).value;

        const confirmPassword =
        document.getElementById(
            'confirmPassword'
        ).value;

        const role1 =
        document.querySelector(
            'input[name=\"role\"]:checked'
        );

        if(!role1){

            alert(
                'Vui lòng chọn vai trò!'
            );

            return;
        }

        const role = role1.value;

        if(password !== confirmPassword){

            alert(
                'Mật khẩu không khớp!'
            );

            return;
        }

        try {

            btn.disabled = true;

            btn.innerText =
            'Đang xử lý...';

            // Đăng ký auth
            const { data, error } =
            await window.supabaseClient
            .auth
            .signUp({

                email: email,

                password: password
            });

            if(error){

                alert(error.message);

                return;
            }

            const user =
            data.user;

            // Lưu profile
            const {
                error: insertError
            } =
            await window.supabaseClient
            .from('accounts')
            .insert({

                id: user.id,

                email: email,

                full_name: fullName,

                role: role
            });

            if(insertError){

                alert(
                    insertError.message
                );

                return;
            }

            alert(
                'Đăng ký thành công!'
            );

            window.location.href =
            'login.html';

        } catch(e){

            alert(e.message);

        } finally {

            btn.disabled = false;

            btn.innerText =
            'Đăng ký';
        }
    };
}
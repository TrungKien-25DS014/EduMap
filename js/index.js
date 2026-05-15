document.addEventListener('DOMContentLoaded', async () => {
    const navAuthBtn = document.getElementById('navAuthBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const loginView = document.getElementById('loginView');
    const forgotView = document.getElementById('forgotView');
    const registerView = document.getElementById('registerView');
    const showForgotBtn = document.getElementById('showForgotView');
    const showRegisterBtn = document.getElementById('showRegisterView');
    const backToLoginBtns = document.querySelectorAll('.back-to-login');

    function hideAllViews() {
        loginView.style.display = 'none';
        forgotView.style.display = 'none';
        registerView.style.display = 'none';
    }

    function showView(view) {
        hideAllViews();
        view.style.display = 'block';
    }

    const updateAuthButton = (user) => {
        if (!navAuthBtn) return;
        if (user) {
            navAuthBtn.textContent = 'Đăng xuất';
            navAuthBtn.style.background = '#ef4444';
            navAuthBtn.onclick = async (e) => {
                e.preventDefault();
                await window.supabaseClient.auth.signOut();
                window.location.reload();
            };
        } else {
            navAuthBtn.textContent = 'Đăng nhập';
            navAuthBtn.style.background = '';
            navAuthBtn.onclick = () => {
                showView(loginView);
                loginModal.classList.add('active');
            };
        }
    };

    if (window.supabaseClient) {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        updateAuthButton(session?.user);

        window.supabaseClient.auth.onAuthStateChange((event, session) => {
            updateAuthButton(session?.user);
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => loginModal.classList.remove('active'));
    }

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.classList.remove('active');
    });

    if (showForgotBtn) {
        showForgotBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showView(forgotView);
        });
    }

    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showView(registerView);
        });
    }

    backToLoginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showView(loginView);
        });
    });

    const btnReset = document.getElementById('btnResetInline');
    if (btnReset) {
        btnReset.addEventListener('click', async () => {
            const email = document.getElementById('forgotEmail').value.trim();
            if (!email) return alert("Vui lòng nhập email!");
            btnReset.innerText = "Đang gửi...";
            const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/EduMap/page/reset-password.html`
            });
            if (error) alert(error.message);
            else alert("Đã gửi email khôi phục!");
            btnReset.innerText = "Gửi liên kết";
        });
    }

    const btnRegister = document.getElementById('btnRegisterInline');
    const isValidGmail = (email) => /^[a-zA-Z0-9.]+@gmail\.com$/.test(email.trim());

    if (btnRegister) {
        btnRegister.addEventListener('click', async () => {
            const fullName = document.getElementById('regFullName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirm = document.getElementById('regConfirmPassword').value;

            if (!fullName || !email || !password) return alert("Vui lòng nhập đủ thông tin!");
            if (!isValidGmail(email)) return alert("Vui lòng dùng Gmail!");
            if (password !== confirm) return alert("Mật khẩu không khớp!");

            btnRegister.disabled = true;
            btnRegister.innerText = "Đang đăng ký...";

            try {
                const { data, error } = await window.supabaseClient.auth.signUp({
                    email: email,
                    password: password,
                    options: { data: { full_name: fullName } }
                });
                if (error) throw error;
                const { error: insErr } = await window.supabaseClient
                    .from('accounts')
                    .insert({ id: data.user.id, email: email, full_name: fullName });
                if (insErr) throw insErr;
                alert("Đăng ký thành công! Hãy đăng nhập.");
                showView(loginView);
            } catch (e) {
                alert("Lỗi: " + e.message);
            } finally {
                btnRegister.disabled = false;
                btnRegister.innerText = "Đăng ký";
            }
        });
    }

    const policyData = {
        terms: {
            title: "Điều khoản sử dụng",
            content: `Chào mừng bạn đến với EduMap. Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý với các quy định sau:
            - Sử dụng nền tảng cho mục đích học tập lành mạnh.
            - Bảo mật thông tin tài khoản cá nhân.
            - Không sao chép trái phép các học liệu có bản quyền.
            - EduMap có quyền tạm khóa tài khoản nếu phát hiện hành vi gian lận.`
        },
        privacy: {
            title: "Chính sách bảo mật",
            content: `Chúng tôi cam kết bảo vệ quyền riêng tư của bạn:
            - Thông tin cá nhân (Email, Họ tên) chỉ dùng để kết nối gia sư và người học.
            - Không cung cấp dữ liệu cho bên thứ ba khi chưa được sự đồng ý.
            - Hệ thống sử dụng công nghệ mã hóa hiện đại để bảo vệ dữ liệu người dùng.`
        },
        community: {
            title: "Quy định cộng đồng",
            content: `Để xây dựng môi trường học tập văn minh, vui lòng tuân thủ:
            1. Tôn trọng giáo viên và các học viên khác.
            2. Không đăng tải nội dung rác (spam) hoặc quảng cáo.
            3. Chia sẻ kiến thức và tài liệu dựa trên tinh thần giúp đỡ lẫn nhau.
            4. Mọi hành vi công kích, xúc phạm sẽ bị loại bỏ khỏi cộng đồng.`
        }
    };

    const policyModal = document.getElementById('policyModal');
    const policyTitle = document.getElementById('policyTitle');
    const policyContent = document.getElementById('policyContent');
    const closePolicyBtn = document.getElementById('closePolicyBtn');

    function openPolicy(type) {
        const data = policyData[type];
        if (data) {
            policyTitle.innerText = data.title;
            policyContent.innerHTML = data.content.replace(/\n/g, '<br>');
            policyModal.classList.add('active');
        }
    }

    if (closePolicyBtn) {
        closePolicyBtn.onclick = () => policyModal.classList.remove('active');
    }

    window.addEventListener('click', (e) => {
        if (e.target === policyModal) policyModal.classList.remove('active');
    });

    document.querySelectorAll('.footer-col a').forEach(link => {
        const text = link.innerText.toLowerCase();
        if (text.includes('điều khoản')) {
            link.addEventListener('click', (e) => { e.preventDefault(); openPolicy('terms'); });
        } else if (text.includes('bảo mật')) {
            link.addEventListener('click', (e) => { e.preventDefault(); openPolicy('privacy'); });
        } else if (text.includes('quy định')) {
            link.addEventListener('click', (e) => { e.preventDefault(); openPolicy('community'); });
        }
    });
});
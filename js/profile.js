const STORAGE_KEY = 'edumap_tutor_profile_v1';

const defaultProfile = {
    name: 'PGS.TS. Huỳnh Công Pháp',
    subtitle: 'Giảng viên đại học • Toán, Hóa',
    bio: 'PGS.TS Huỳnh Công Pháp có hơn 15 năm giảng dạy...',
    education: 'Tiến sĩ Toán - Đại học X',
    experience: '15 năm giảng dạy',
    languages: 'Tiếng Việt',
    formats: 'Tại nhà / Online',
    price: '200k / buổi',
    subjects: [ {subject: 'Toán', grade: 'Lớp 10-12'} ]
};

function loadProfile() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultProfile;
        return JSON.parse(raw);
    } catch (e) { return defaultProfile; }
}

function saveProfile(p) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function renderProfile(p) {
    document.getElementById('name').textContent = p.name;
    document.getElementById('subtitle').textContent = p.subtitle;
    document.getElementById('bio').textContent = p.bio;
    document.getElementById('education').textContent = p.education;
    document.getElementById('experience').textContent = p.experience;
    document.getElementById('languages').textContent = p.languages;
    document.getElementById('formats').textContent = p.formats;
    document.getElementById('price').textContent = p.price;

    const list = document.getElementById('subjectsList');
    list.innerHTML = '';
    p.subjects.forEach((s, idx) => {
        const row = document.createElement('div');
        row.className = 'subject-row';
        row.innerHTML = `<span class="sub">${escapeHtml(s.subject)}</span> <span class="grade">${escapeHtml(s.grade)}</span> <button data-i="${idx}" class="btn-small remove">Xoá</button>`;
        list.appendChild(row);
    });

    Array.from(document.querySelectorAll('.subjects-list .remove')).forEach(btn => {
        btn.addEventListener('click', () => {
            const i = Number(btn.dataset.i);
            p.subjects.splice(i,1);
            saveProfile(p);
            renderProfile(p);
        });
    });
}

function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

let profile = loadProfile();
renderProfile(profile);

const isTutor = localStorage.getItem('edumap_tutor_logged_in') === '1';
if (!isTutor) {
    const leftBox = document.querySelector('.profile-left .box');
    if (leftBox) leftBox.style.display = 'none';

    const edt = document.getElementById('editToggle');
    if (edt) edt.style.display = 'none';

    const main = document.querySelector('.profile-main');
    if (main) {
        main.innerHTML = `
            <div class="private-note">
                <h3>Trang này chỉ dành cho gia sư</h3>
                <p>Bạn cần đăng nhập với tài khoản gia sư để xem và chỉnh sửa hồ sơ cá nhân.</p>
                <div class="private-actions">
                    <button id="mockLogin" class="btn-primary">Mô phỏng đăng nhập gia sư</button>
                    <a href="find_tutor.html" class="btn-outline">Quay lại trang tìm gia sư</a>
                </div>
            </div>`;

        const mock = document.getElementById('mockLogin');
        if (mock) mock.addEventListener('click', () => {
            localStorage.setItem('edumap_tutor_logged_in', '1');
            location.reload();
        });
    }

    throw new Error('tutor-only mode: UI restricted (client-side)');
}

const editToggle = document.getElementById('editToggle');
const addBtn = document.getElementById('addSub');
const newSubject = document.getElementById('newSubject');
const newGrade = document.getElementById('newGrade');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');

let editing = false;

function enterEdit() {
    editing = true;
    editToggle.textContent = 'Đang chỉnh sửa...';
    editToggle.disabled = true;
    const fields = ['name','subtitle','bio','education','experience','languages','formats','price'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        const val = el.textContent;
        const input = document.createElement(id === 'bio' ? 'textarea' : 'input');
        input.className = 'edit-field';
        input.dataset.field = id;
        input.value = val;
        if (id === 'bio') { input.rows = 4; input.style.width = '100%'; }
        el.parentNode.replaceChild(input, el);
    });
    saveBtn.style.display = '';
    cancelBtn.style.display = '';
}

function exitEdit(cancel=false) {
    const fields = ['name','subtitle','bio','education','experience','languages','formats','price'];
    if (!cancel) {
        fields.forEach(id => {
            const input = document.querySelector(`[data-field="${id}"]`);
            if (!input) return;
            profile[id] = input.value;
        });
        saveProfile(profile);
    }

    fields.forEach(id => {
        const input = document.querySelector(`[data-field="${id}"]`);
        if (!input) return;
        const el = document.createElement(id === 'bio' ? 'p' : (id === 'price' ? 'div' : 'div'));
        el.id = id;
        el.textContent = profile[id];
        if (id === 'price') el.className = 'price';
        input.parentNode.replaceChild(el, input);
    });

    renderProfile(profile);
    editing = false;
    editToggle.textContent = 'Chỉnh sửa hồ sơ';
    editToggle.disabled = false;
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
}

editToggle.addEventListener('click', enterEdit);
addBtn.addEventListener('click', () => {
    const subj = newSubject.value.trim();
    const grade = newGrade.value.trim();
    if (!subj) return;
    profile.subjects.push({subject: subj, grade: grade || 'Tất cả'});
    saveProfile(profile);
    renderProfile(profile);
    newSubject.value = '';
    newGrade.value = '';
});

saveBtn.addEventListener('click', () => exitEdit(false));
cancelBtn.addEventListener('click', () => exitEdit(true));

newSubject.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addBtn.click(); } });

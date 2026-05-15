document.addEventListener('DOMContentLoaded', () => {
    const indexBtn = document.getElementById('indexThemeBtn');
    const dropdownToggle = document.getElementById('dropdownThemeToggle');
    const body = document.body;
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        if (dropdownToggle) dropdownToggle.checked = true;
    }
    if (indexBtn) {
        indexBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            if (body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }
        });
    }
    if (dropdownToggle) {
        dropdownToggle.addEventListener('change', () => {
            if (dropdownToggle.checked) {
                body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});
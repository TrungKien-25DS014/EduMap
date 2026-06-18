/**
 * EduMap – Theme manager (dark / light mode)
 * Pairs with css/theme.css for color tokens.
 *
 * Supported toggle elements:
 *   #indexThemeBtn       – moon/sun icon button on landing page
 *   #dropdownThemeToggle – checkbox in user dropdown (inner pages)
 */
(function () {
    var STORAGE_KEY = 'theme';
    var LIGHT_CLASS = 'light-mode';

    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add(LIGHT_CLASS);
        } else {
            document.body.classList.remove(LIGHT_CLASS);
        }
        updateIcons(theme);
    }

    function setTheme(theme) {
        localStorage.setItem(STORAGE_KEY, theme);
        applyTheme(theme);
        syncToggles(theme);
    }

    function syncToggles(theme) {
        var cb = document.getElementById('dropdownThemeToggle');
        if (cb) cb.checked = (theme === 'light');
    }

    function updateIcons(theme) {
        // Moon/sun icon on index page
        var icon = document.getElementById('themeIcon');
        if (icon) {
            icon.className = theme === 'light'
                ? 'fa-solid fa-sun'
                : 'fa-solid fa-moon';
        }
        // Label text next to checkbox
        var label = document.querySelector('.theme-toggle-row span');
        if (label) {
            label.textContent = theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng';
        }
    }

    // Apply IMMEDIATELY to prevent flash of wrong theme
    applyTheme(localStorage.getItem(STORAGE_KEY) || 'dark');

    document.addEventListener('DOMContentLoaded', function () {
        var savedTheme = localStorage.getItem(STORAGE_KEY) || 'dark';
        syncToggles(savedTheme);
        updateIcons(savedTheme);

        // ── Index page moon/sun button ──
        var indexBtn = document.getElementById('indexThemeBtn');
        if (indexBtn) {
            indexBtn.addEventListener('click', function () {
                var next = document.body.classList.contains(LIGHT_CLASS) ? 'dark' : 'light';
                setTheme(next);
            });
        }

        // ── Dropdown checkbox (inner pages) ──
        var cb = document.getElementById('dropdownThemeToggle');
        if (cb) {
            cb.addEventListener('change', function () {
                setTheme(this.checked ? 'light' : 'dark');
            });
        }
    });
})();

        (function insertSoftBreaks() {
            const MIN_LEN = 18;
            const BREAK_EVERY = 12;
            document.querySelectorAll('.name').forEach(el => {
                const txt = el.textContent.trim();
                if (/\s/.test(txt)) return;
                if (txt.length <= MIN_LEN) return;
                let out = '';
                for (let i = 0; i < txt.length; i += BREAK_EVERY) {
                    out += txt.slice(i, i + BREAK_EVERY) + (i + BREAK_EVERY < txt.length ? '<wbr>' : '');
                }
                el.innerHTML = out;
            });
        })();
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-card">
                <div class="modal-body">
                    <img src="" alt="avt" id="modalAvatar">
                    <div class="modal-content">
                        <h3 id="modalName"></h3>
                        <p id="modalSubjects"></p>
                        <p id="modalArea"></p>
                        <p id="modalPrice"></p>
                        <p id="modalPhone"></p>
                        <div class="tags" id="modalTags"></div>
                        <hr>
                        <p id="modalIntro">Giới thiệu: Gia sư tận tâm, có kinh nghiệm luyện thi và kèm học sinh từ cơ bản đến nâng cao.</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-close" id="modalClose">Đóng</button>
                </div>
            </div>`;
        document.body.appendChild(modal);

        const modalAvatar = document.getElementById('modalAvatar');
        const modalName = document.getElementById('modalName');
        const modalSubjects = document.getElementById('modalSubjects');
        const modalArea = document.getElementById('modalArea');
        const modalPrice = document.getElementById('modalPrice');
        const modalPhone = document.getElementById('modalPhone');
        const modalTags = document.getElementById('modalTags');
        const modalClose = document.getElementById('modalClose');

        function openModal(card) {
            modalAvatar.src = card.querySelector('.card-avatar').src;
            modalName.textContent = card.dataset.name;
            modalSubjects.innerHTML = '<strong>Môn:</strong> ' + (card.dataset.subjects || '');
            modalArea.innerHTML = '<strong>Khu vực:</strong> ' + (card.dataset.area || '');
            modalPrice.innerHTML = '<strong>Giá:</strong> ' + (card.dataset.price || '');
            modalPhone.innerHTML = '<strong>Phone:</strong> ' + (card.dataset.phone || '');
            modalTags.innerHTML = '<div class="tag">Kinh nghiệm: 5 năm</div><div class="tag">Hỗ trợ online</div>';
            modal.classList.add('show');
        }

        function closeModal() { modal.classList.remove('show'); }

        const tutorCards = Array.from(document.querySelectorAll('.tutor-card'));
        tutorCards.forEach(card => card.addEventListener('click', () => openModal(card)));
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

        const applyBtn = document.getElementById('applyFilter');
        const clearBtn = document.getElementById('clearFilter');

        function applyFilter() {
            const subject = document.getElementById('filterSubject').value;
            const grade = document.getElementById('filterGrade').value;
            const mode = document.getElementById('filterMode').value;
            const area = document.getElementById('filterArea').value;

            tutorCards.forEach(card => {
                let ok = true;
                const cardSubjects = card.dataset.subjects || '';
                const cardGrade = card.dataset.grade || '';
                const cardFormat = card.dataset.format || '';
                const cardArea = card.dataset.area || '';

                if (subject !== 'all' && !cardSubjects.includes(subject)) ok = false;
                if (grade !== 'all' && cardGrade !== grade) ok = false;
                if (mode !== 'all' && cardFormat !== mode) ok = false;
                if (area !== 'all' && cardArea !== area) ok = false;

                card.style.display = ok ? 'flex' : 'none';
            });
        }

        function clearFilter() {
            document.getElementById('filterSubject').value = 'all';
            document.getElementById('filterGrade').value = 'all';
            document.getElementById('filterMode').value = 'all';
            document.getElementById('filterArea').value = 'all';
            tutorCards.forEach(card => card.style.display = 'flex');
        }

        applyBtn.addEventListener('click', applyFilter);
        clearBtn.addEventListener('click', clearFilter);

        (function enableStickyFilter() {
            const panel = document.querySelector('.filter-panel');
            if (!panel) return;

            let origRect = panel.getBoundingClientRect();
            let origTop = origRect.top + window.scrollY;

            function update() {
                if (window.innerWidth <= 900) {
                    if (panel.classList.contains('fixed')) {
                        panel.classList.remove('fixed');
                        panel.style.width = '';
                        panel.style.left = '';
                    }
                    return;
                }

                const scrollY = window.scrollY || window.pageYOffset;
                if (scrollY + 16 >= origTop) {
                    if (!panel.classList.contains('fixed')) {
                        const rect = panel.getBoundingClientRect();
                        panel.style.width = rect.width + 'px';
                        panel.style.left = rect.left + 'px';
                        panel.classList.add('fixed');
                    }
                } else {
                    if (panel.classList.contains('fixed')) {
                        panel.classList.remove('fixed');
                        panel.style.width = '';
                        panel.style.left = '';
                    }
                }
            }

            window.addEventListener('scroll', update);
            window.addEventListener('resize', () => {
                origRect = panel.getBoundingClientRect();
                origTop = origRect.top + window.scrollY;
                if (panel.classList.contains('fixed')) {
                    panel.classList.remove('fixed');
                    panel.style.width = '';
                    panel.style.left = '';
                }
                update();
            });
            update();
        })();
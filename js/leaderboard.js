document.addEventListener('DOMContentLoaded', async () => {
    if (typeof UserInfo !== 'undefined') {
        const userData = await UserInfo.getUserProfile();
        const nameElements = document.querySelectorAll('#userNameDisplay, #heroUserName');
        const avatarImg = document.getElementById('userAvatarImg');

        if (userData && userData.userProfile && userData.userProfile.full_name) {
            const name = userData.userProfile.full_name;
            nameElements.forEach(el => el.textContent = name);
            if(avatarImg) {
                avatarImg.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
            }
        } else {
            nameElements.forEach(el => el.textContent = 'Khách');
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const avatarWrapper = document.getElementById('avatarWrapper');
    const userDropdown = document.getElementById('userDropdown');
    const btnLogout = document.getElementById('btnLogout');
    const dropdownFullName = document.getElementById('dropdownFullName');
    if (avatarWrapper) {
        avatarWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
    }
    document.addEventListener('click', () => {
        if (userDropdown) userDropdown.classList.remove('active');
    });
    if (btnLogout) {
        btnLogout.addEventListener('click', async (e) => {
            e.preventDefault();
            await window.supabaseClient.auth.signOut();
            window.location.href = "index.html";
        });
    }
    const updateDropdownName = async () => {
        if (typeof UserInfo !== 'undefined') {
            const profile = await UserInfo.getUserProfile();
            if (profile && profile.userProfile && dropdownFullName) {
                dropdownFullName.textContent = profile.userProfile.full_name;
            }
        }
    };
    updateDropdownName();
});
document.addEventListener('DOMContentLoaded', async () => {
    if (typeof UserInfo !== 'undefined') {
        const userData = await UserInfo.getUserProfile();
        const nameElements = document.querySelectorAll('#userNameDisplay, #heroUserName');
        const avatarImg = document.getElementById('userAvatarImg');

        if (userData && userData.userProfile && userData.userProfile.full_name) {
            const name = userData.userProfile.full_name;
            nameElements.forEach(el => el.textContent = name);
            if(avatarImg) {
                avatarImg.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
            }
        } else {
            nameElements.forEach(el => el.textContent = 'Khách');
        }
    }

    // Fetch tutors and ratings from Supabase, compute ranking, populate top-3 cards and table
    async function fetchTutorsWithRatings() {
        if (!window.supabaseClient) return [];
        try {
            const [{ data: tutors }, { data: ratings }] = await Promise.all([
                window.supabaseClient.from('tutors').select('id, name, avatar').limit(200),
                window.supabaseClient.from('tutor_ratings').select('tutor_id, rating')
            ]);

            const ratingMap = {};
            if (Array.isArray(ratings)) {
                ratings.forEach(r => {
                    if (!r || !r.tutor_id) return;
                    const id = r.tutor_id;
                    ratingMap[id] = ratingMap[id] || { sum: 0, count: 0 };
                    ratingMap[id].sum += (r.rating || 0);
                    ratingMap[id].count += 1;
                });
            }

            const normalized = (Array.isArray(tutors) ? tutors : []).map(t => {
                const id = t.id;
                const stat = ratingMap[id] || { sum: 0, count: 0 };
                const sum = stat.sum || 0; // total stars given to this tutor
                const avatar = t.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(t.name || 'anon')}`;
                return { id, name: t.name || '---', avatar, sum, count: stat.count };
            });

            // sort by total stars (sum) desc, then by count desc
            normalized.sort((a, b) => {
                if ((b.sum || 0) !== (a.sum || 0)) return (b.sum || 0) - (a.sum || 0);
                return (b.count || 0) - (a.count || 0);
            });

            return normalized;
        } catch (err) {
            console.warn('Error fetching tutors/ratings for leaderboard:', err);
            return [];
        }
    }

    function renderTopThree(top3) {
        const ranks = ['rank-1', 'rank-2', 'rank-3'];
        for (let i = 0; i < 3; i++) {
            const card = document.querySelector(`.top-three .card.${ranks[i]}`);
            if (!card) continue;
            const tutor = top3[i];
            const img = card.querySelector('img.avatar');
            const nameEl = card.querySelector('.name');
            const pointsEl = card.querySelector('.points');
            if (tutor) {
                if (img) img.src = tutor.avatar;
                if (nameEl) nameEl.textContent = tutor.name;
                const points = tutor.sum || 0; // total stars
                if (pointsEl) pointsEl.textContent = `${points.toLocaleString()} điểm`;
            } else {
                // fallback empty
                if (img) img.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=anon';
                if (nameEl) nameEl.textContent = '---';
                if (pointsEl) pointsEl.textContent = '0 điểm';
            }
        }
    }

    const renderLeaderboard = (tutors, startRank = 1) => {
        const tableBody = document.getElementById('leaderboardBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        if (!Array.isArray(tutors) || tutors.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#94a3b8">Không có dữ liệu</td></tr>';
            return;
        }

        tutors.forEach((tutor, index) => {
            const rank = startRank + index;
            const row = document.createElement('tr');
            row.className = 'user-row';
            const achievements = [
                "Gia sư năng nổ",
                "Chuyên gia hỗ trợ",
                "Tài liệu chất lượng",
                "Phản hồi nhanh",
                "Được yêu thích"
            ];
            const randomAchievement = achievements[Math.floor(Math.random() * achievements.length)];
            const points = tutor.sum || 0;

            row.innerHTML = `
                <td>${rank}</td>
                <td>
                    <img src="${tutor.avatar}" alt="avt">
                    ${tutor.name}
                </td>
                <td>${points.toLocaleString()}</td>
                <td>${randomAchievement}</td>
            `;
            tableBody.appendChild(row);
        });
    };

    // Kick off data fetch and render top-3 + table
    fetchTutorsWithRatings().then(sorted => {
        const top3 = sorted.slice(0, 3);
        const remaining = sorted.slice(3);
        renderTopThree(top3);
        renderLeaderboard(remaining, 4);
    });
});
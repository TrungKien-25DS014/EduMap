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

    const renderLeaderboard = () => {
        const tableBody = document.getElementById('leaderboardBody');
        if (!tableBody || typeof mockTutors === 'undefined') return;

        tableBody.innerHTML = '';
        const remainingTutors = mockTutors.slice(3); 

        remainingTutors.forEach((tutor, index) => {
            const rank = index + 4;
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
            const points = 1600 - (index * 15);

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
    renderLeaderboard();
});
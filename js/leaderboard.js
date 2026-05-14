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
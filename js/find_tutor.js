Document.addEventListener('DOMContentLoaded', async () => {
    const userData = await UserInfo.getUserProfile();
    if (userData && userData.userProfile) {
        const name = userData.userProfile.full_name;
        document.getElementById('userNameDisplay').textContent = name;
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
        document.getElementById('userAvatarImg').src = avatarUrl;
    } else {
        document.getElementById('userNameDisplay').textContent = 'Khách';
    }
});
Document.addEventListener('DOMContentLoaded', async () => {
    const userData = await UserInfo.getUserProfile();
});


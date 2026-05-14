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

const likeButtons = document.querySelectorAll(".like-btn");
likeButtons.forEach(button => {
    button.addEventListener("click", () => {
        const post = button.closest(".post");
        const likeCount = post.querySelector(".like-count");
        let currentLikes = parseInt(likeCount.innerText);
        const icon = button.querySelector("i");
        if (button.classList.contains("liked")) {
            currentLikes--;
            button.classList.remove("liked");
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
        } else {
            currentLikes++;
            button.classList.add("liked");
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
        }
        likeCount.innerText = currentLikes;
    });
});

const shareButtons = document.querySelectorAll(".share-btn");
shareButtons.forEach(button => {
    button.addEventListener("click", async () => {
        const post = button.closest(".post");
        const content = post.querySelector(".post-content p").innerText;
        if (navigator.share) {
            await navigator.share({
                title: "EduMap Community",
                text: content,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(content);
            alert("Đã copy nội dung bài viết!");
        }
    });
});
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
function openChat(name, avatarUrl) {
    document.getElementById('chat-name').innerText = name;
    document.getElementById('chat-avatar').src = avatarUrl;
    document.getElementById('contact-list').classList.remove('active-panel');
    document.getElementById('contact-list').classList.add('hidden-panel');
    document.getElementById('active-chat').classList.remove('hidden-panel');
    document.getElementById('active-chat').classList.add('active-panel');
}
function closeChat() {
    document.getElementById('active-chat').classList.remove('active-panel');
    document.getElementById('active-chat').classList.add('hidden-panel');
    document.getElementById('contact-list').classList.remove('hidden-panel');
    document.getElementById('contact-list').classList.add('active-panel');
}

const shareButtons = document.querySelectorAll(".share-btn");
shareButtons.forEach((button, index) => {
    button.addEventListener("click", async () => {
        const post = button.closest(".post");
        if (!post.id) {
            post.id = `post-static-${index}`; 
        }
        const postUrl = window.location.origin + window.location.pathname + '#' + post.id;
        const content = post.querySelector(".post-content p").innerText;
        if (navigator.share) {
            await navigator.share({
                title: "EduMap Community",
                text: "Xem bài viết này trên EduMap: " + content.substring(0, 50) + "...",
                url: postUrl
            });
        } else {
            navigator.clipboard.writeText(postUrl);
            alert("Đã copy link bài viết!");
        }
    });
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

document.addEventListener('DOMContentLoaded', () => {
    const commentButtons = document.querySelectorAll('.comment-btn');
    commentButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const post = btn.closest('.post');
            let commentSection = post.querySelector('.meta-comments');
            if (commentSection) {
                if (commentSection.style.display === 'none') {
                    commentSection.style.display = 'block';
                } else {
                    commentSection.style.display = 'none';
                }
            } else {
                commentSection = document.createElement('div');
                commentSection.className = 'meta-comments';
                const userAvatar = document.getElementById('userAvatarImg')?.src || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
                const userName = document.getElementById('userNameDisplay')?.textContent || 'Bạn';
                commentSection.innerHTML = `
                    <div class="comments-list">
                        <div class="comment-item">
                            <img src="https://i.pravatar.cc/150?img=32" class="comment-avatar" alt="Avatar">
                            <div class="comment-block">
                                <div class="comment-bubble">
                                    <span class="comment-author">Minh Anh</span>
                                    <span class="comment-text">Bạn tham khảo EduMap nhé, trên này nhiều gia sư xịn lắm!</span>
                                </div>
                                <div class="comment-actions-row">
                                    <span class="c-action">Thích</span> • 
                                    <span class="c-action">Phản hồi</span> • 
                                    <span class="c-time">10 phút trước</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="comment-input-wrapper">
                        <img src="${userAvatar}" class="comment-avatar" alt="Your Avatar">
                        <div class="input-box">
                            <input type="text" class="input-comment" placeholder="Viết bình luận công khai...">
                            <div class="input-actions">
                                <i class="fa-regular fa-face-smile"></i>
                                <i class="fa-solid fa-camera"></i>
                                <i class="fa-solid fa-paper-plane send-comment-btn" style="cursor: pointer; color: #38bdf8;"></i>
                            </div>
                        </div>
                    </div>
                `;
                post.appendChild(commentSection);
                const inputComment = commentSection.querySelector('.input-comment');
                const sendBtn = commentSection.querySelector('.send-comment-btn');
                const commentsList = commentSection.querySelector('.comments-list');
                
                const addComment = () => {
                    const text = inputComment.value.trim();
                    if (text) {
                        const newComment = document.createElement('div');
                        newComment.className = 'comment-item';
                        newComment.innerHTML = `
                            <img src="${userAvatar}" class="comment-avatar" alt="Avatar">
                            <div class="comment-block">
                                <div class="comment-bubble">
                                    <span class="comment-author">${userName}</span>
                                    <span class="comment-text">${text}</span>
                                </div>
                                <div class="comment-actions-row">
                                    <span class="c-action">Thích</span> • 
                                    <span class="c-action">Phản hồi</span> • 
                                    <span class="c-time">Vừa xong</span>
                                </div>
                            </div>
                        `;
                        commentsList.appendChild(newComment);
                        inputComment.value = '';
                        const statsDiv = post.querySelector('.post-stats span:last-child');
                        if (statsDiv) {
                            let currentCount = parseInt(statsDiv.innerText.replace(/[^0-9]/g, '')) || 0;
                            statsDiv.innerText = `${currentCount + 1} Bình luận`;
                        }
                    }
                };
                sendBtn.addEventListener('click', addComment);
                inputComment.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        addComment();
                    }
                });
                inputComment.focus();
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.querySelector('.chat-footer input');
    const sendBtn = document.querySelector('.btn-send');
    const chatBody = document.querySelector('.chat-body');
    if (!chatInput || !sendBtn || !chatBody) return;
    const scrollToBottom = () => {
        chatBody.scrollTop = chatBody.scrollHeight;
    };
    const sendMessage = () => {
        const text = chatInput.value.trim();
        if (text) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message sent';
            msgDiv.innerHTML = `<p>${text}</p>`;
            chatBody.appendChild(msgDiv);
            chatInput.value = '';
            scrollToBottom();
            setTimeout(() => {
                const replyDiv = document.createElement('div');
                replyDiv.className = 'message received';
                replyDiv.innerHTML = `<p>bạn đợi chút mình đang có việc có gì minh liên lạc lại sau nha</p>`;
                
                chatBody.appendChild(replyDiv);
                scrollToBottom();
            }, 1500);
        }
    };
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const postBox = document.querySelector('.post-box');
    if (!postBox) return;
    const postTextarea = postBox.querySelector('textarea');
    const submitPostBtn = postBox.querySelector('.btn-submit');
    submitPostBtn.addEventListener('click', () => {
        const content = postTextarea.value.trim();
        if (!content) {
            alert("Bạn chưa nhập nội dung bài viết!");
            return;
        }
        const userAvatar = document.getElementById('userAvatarImg')?.src || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
        const userName = document.getElementById('userNameDisplay')?.textContent || 'Bạn';
        const newPost = document.createElement('div');
        newPost.className = 'post glass-panel';
        newPost.innerHTML = `
            <div class="post-header">
                <img src="${userAvatar}" class="avatar" alt="Avatar">
                <div class="user-info">
                    <h4 class="user-trigger">${userName}</h4>
                    <span class="time">Vừa xong • <i class="fa-solid fa-earth-americas"></i></span>
                </div>
                <button class="post-options"><i class="fa-solid fa-ellipsis"></i></button>
            </div>
            <div class="post-content">
                <p>${content.replace(/\n/g, '<br>')}</p>
            </div>
            <div class="post-stats">
                <span class="like-count">0</span>
                <span>0 Bình luận</span>
            </div>
            <div class="actions">
                <button class="like-btn">
                    <i class="fa-regular fa-heart"></i>
                    <span>Thích</span>
                </button>
                <button class="comment-btn">
                    <i class="fa-regular fa-comment"></i>
                    Bình luận
                </button>
                <button class="share-btn">
                    <i class="fa-solid fa-share"></i>
                    Chia sẻ
                </button>
            </div>
        `;
        postBox.insertAdjacentElement('afterend', newPost);
        postTextarea.value = '';
        const likeBtn = newPost.querySelector('.like-btn');
        likeBtn.addEventListener('click', () => {
            const likeCount = newPost.querySelector('.like-count');
            let currentLikes = parseInt(likeCount.innerText);
            const icon = likeBtn.querySelector('i');
            if (likeBtn.classList.contains('liked')) {
                currentLikes--;
                likeBtn.classList.remove('liked');
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            } else {
                currentLikes++;
                likeBtn.classList.add('liked');
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            }
            likeCount.innerText = currentLikes;
        });

        const uniquePostId = 'post-' + Date.now();
        newPost.id = uniquePostId;
        const shareBtn = newPost.querySelector('.share-btn');
        shareBtn.addEventListener('click', async () => {
            const postUrl = window.location.origin + window.location.pathname + '#' + uniquePostId;
            const textToShare = newPost.querySelector('.post-content p').innerText;
            if (navigator.share) {
                await navigator.share({ 
                    title: "EduMap Community", 
                    text: textToShare.substring(0, 50) + "...", 
                    url: postUrl 
                });
            } else {
                navigator.clipboard.writeText(postUrl);
                alert("Đã copy link bài viết!");
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
        const targetPost = document.querySelector(window.location.hash);
        if (targetPost) {
            setTimeout(() => {
                targetPost.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetPost.style.boxShadow = "0 0 20px rgba(44, 116, 179, 0.8)";
                setTimeout(() => {
                    targetPost.style.boxShadow = "var(--glass-shadow)";
                }, 2000);
            }, 500);
        }
    }
});
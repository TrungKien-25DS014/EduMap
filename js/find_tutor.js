document.addEventListener('DOMContentLoaded', async () => {
    if (typeof UserInfo !== 'undefined') {
        const userData = await UserInfo.getUserProfile();
        const nameElements = document.querySelectorAll('#userNameDisplay, #heroUserName');
        const avatarImg = document.getElementById('userAvatarImg');
        if (userData && userData.userProfile && userData.userProfile.full_name) {
            const name = userData.userProfile.full_name;
            nameElements.forEach(el => {
                el.textContent = name;
            });
            if (avatarImg) {
                avatarImg.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
            }
        } else {
            nameElements.forEach(el => {
                el.textContent = 'Khách';
            });
        }
    }
});
let map;
let currentOpenTutorId = null;
let markerLayers = [];
// runtime tutors data (populated from Supabase if available)
let tutorsData = [];
function initMap() {
    if (!document.getElementById('map')) return;
    if (map !== undefined) return;
    map = L.map('map').setView([16.0544, 108.2022], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    map.on('click', function () {
        closeTutorProfile();
    });
    // load tutors from Supabase
    fetchTutorsFromSupabase().then(fetched => {
        tutorsData = Array.isArray(fetched) ? fetched : [];
        renderTutorsOnMap(tutorsData);
        initFilter();
    }).catch(err => {
        console.warn('Không thể lấy tutors từ Supabase.', err);
        tutorsData = [];
        renderTutorsOnMap(tutorsData);
        initFilter();
    });
    new ResizeObserver(() => {
        if (map) map.invalidateSize();
    }).observe(document.getElementById('map'));
}
function renderTutorsOnMap(tutorsToRender) {
    markerLayers.forEach(marker => map.removeLayer(marker));
    markerLayers = [];
    tutorsToRender.forEach(tutor => {
        const marker = L.marker([tutor.lat, tutor.lng]).addTo(map);
        markerLayers.push(marker);
        marker.bindTooltip(tutor.name);
        marker.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            if (currentOpenTutorId === tutor.id) {
                closeTutorProfile();
            } else {
                openTutorProfile(tutor);
            }
        });
    });
}
function initFilter() {
    const filterSelect = document.getElementById('subjectFilter');
    if (!filterSelect) return;
    filterSelect.addEventListener('change', (e) => {
        const selectedSubject = e.target.value;
        if (selectedSubject === "all") {
            renderTutorsOnMap(tutorsData);
            filterSelect.selectedIndex = 0;
        } else {
            const filteredTutors = tutorsData.filter(tutor =>
                tutor.tags && tutor.tags.includes(selectedSubject)
            );
            renderTutorsOnMap(filteredTutors);
        }
        closeTutorProfile();
    });
}
function openTutorProfile(tutorData) {
    currentOpenTutorId = tutorData.id;
    document.getElementById('name').textContent = tutorData.name;
    document.getElementById('subtitle').textContent = tutorData.subtitle;
    document.getElementById('price').textContent = tutorData.price;
    document.getElementById('bio').textContent = tutorData.bio;
    document.getElementById('education').textContent = tutorData.education;
    document.getElementById('experience').textContent = tutorData.experience;
    document.getElementById('subjects').textContent = tutorData.subjects;
    document.getElementById('formats').textContent = tutorData.formats;
    document.getElementById('avatar').src = tutorData.avatar;
    // Attach tutor id to rating widget so saving knows which tutor
    const formatsRating = document.getElementById('formatsRating');
    if (formatsRating) {
        formatsRating.dataset.tutorId = tutorData.id;
        // fetch existing ratings (avg + user's) and display
        getTutorRatings(tutorData.id).then(info => {
            if (!info) return;
            // set average as title and default displayed rating to user's rating if available
            formatsRating.title = `Đánh giá trung bình: ${info.avg.toFixed(2)} (${info.count} lượt)`;
            const displayVal = info.userRating || Math.round(info.avg) || 0;
            formatsRating.dataset.rating = displayVal;
            Array.from(formatsRating.querySelectorAll('[data-val]')).forEach(x => {
                x.classList.toggle('active', parseInt(x.dataset.val) <= displayVal);
            });
        }).catch(e => console.warn('Lỗi lấy rating:', e));
    }
    const mainContainer = document.getElementById('mainContainer');
    mainContainer.classList.add('show-profile');
    if (map) {
        map.flyTo([tutorData.lat, tutorData.lng], 14, { animate: true, duration: 0.5 });
    }
}
function closeTutorProfile() {
    currentOpenTutorId = null;
    const mainContainer = document.getElementById('mainContainer');
    if (mainContainer.classList.contains('show-profile')) {
        mainContainer.classList.remove('show-profile');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    initMap();
});

function removeVietnameseTones(str) {
    if (!str) return '';
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .toLowerCase().trim();
}

function initSearch() {
    const searchInput = document.getElementById('tutorSearchInput');
    const suggestionsBox = document.getElementById('searchSuggestions');
    const filterSelect = document.getElementById('subjectFilter');
    if (!searchInput || !suggestionsBox) {
        console.error("Lỗi: Không tìm thấy ô input hoặc hộp kết quả trong HTML!");
        return;
    }
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value;
        const normalizedQuery = removeVietnameseTones(query);
        console.log("Đang gõ tìm kiếm:", query);
        if (filterSelect && query.length > 0) {
            filterSelect.selectedIndex = 0;
        }
            if (normalizedQuery.length === 0) {
                suggestionsBox.classList.add('hidden-panel');
                renderTutorsOnMap(tutorsData);
                return;
            }
        debounceTimer = setTimeout(() => {
                const filteredTutors = tutorsData.filter(tutor => {
                const matchName = removeVietnameseTones(tutor.name).includes(normalizedQuery);
                const matchTags = tutor.tags.some(tag => removeVietnameseTones(tag).includes(normalizedQuery));
                return matchName || matchTags;
            });
            renderTutorsOnMap(filteredTutors);
            suggestionsBox.innerHTML = '';
            if (filteredTutors.length === 0) {
                suggestionsBox.innerHTML = `<li style="padding: 15px; text-align: center; color: #94a3b8; font-size: 13px;">Không tìm thấy gia sư nào phù hợp.</li>`;
            } else {
                filteredTutors.forEach(tutor => {
                    const li = document.createElement('li');
                    li.className = 'suggestion-item';
                    const displayTags = tutor.tags.map(t => t.replace('_', ' ')).join(', ');
                    li.innerHTML = `
                        <img src="${tutor.avatar}" alt="${tutor.name}">
                        <div class="suggestion-info">
                            <span class="suggestion-name">${tutor.name}</span>
                            <span class="suggestion-sub">${tutor.price} • ${displayTags}</span>
                        </div>
                    `;
                    li.addEventListener('click', () => {
                        suggestionsBox.classList.add('hidden-panel');
                        searchInput.value = tutor.name;
                        openTutorProfile(tutor);
                        renderTutorsOnMap([tutor]);
                    });
                    suggestionsBox.appendChild(li);
                });
            }
            suggestionsBox.classList.remove('hidden-panel');
        }, 300);
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) {
            suggestionsBox.classList.add('hidden-panel');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initSearch();
});
/* ==================== */
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
document.querySelectorAll('#tutorRating i').forEach(star => {
    star.onclick = function() {
        let val = parseInt(this.dataset.val);
        document.querySelectorAll('#tutorRating i').forEach(s => {
            s.classList.toggle('active', parseInt(s.dataset.val) <= val);
        });
    };
});

// Initialize all star-rating widgets (supports <i> or <span> inside .star-rating)
function initStarRatingWidgets() {
    document.querySelectorAll('.star-rating').forEach(widget => {
        const stars = Array.from(widget.querySelectorAll('[data-val]'));
        if (!stars.length) return;
        // click handler
        stars.forEach(s => {
                s.addEventListener('click', async () => {
                    const val = parseInt(s.dataset.val);
                    widget.dataset.rating = val;
                    stars.forEach(x => x.classList.toggle('active', parseInt(x.dataset.val) <= val));
                    // if widget is tied to a tutor, save rating
                    const tutorId = widget.dataset.tutorId;
                    if (tutorId && window.supabaseClient) {
                        try {
                            const res = await saveTutorRating(tutorId, val);
                            if (res && res.error && res.error.message === 'not_logged_in') {
                                // revert UI
                                const prev = parseInt(widget.dataset.rating) || 0;
                                stars.forEach(x => x.classList.toggle('active', parseInt(x.dataset.val) <= prev));
                                alert('Bạn cần đăng nhập để đánh giá. Vui lòng đăng nhập rồi thử lại.');
                                return;
                            }
                            if (res && res.error) {
                                console.warn('Lỗi lưu rating:', res.error);
                                alert('Lưu đánh giá không thành công. Vui lòng thử lại sau.');
                                return;
                            }
                            // success: refresh summary
                            const info = await getTutorRatings(tutorId);
                            if (info) widget.title = `Đánh giá trung bình: ${info.avg.toFixed(2)} (${info.count} lượt)`;
                        } catch (err) {
                            console.warn('Lỗi lưu rating:', err);
                            alert('Có lỗi xảy ra khi lưu đánh giá.');
                        }
                    }
                });
            s.addEventListener('mouseover', () => {
                const hv = parseInt(s.dataset.val);
                stars.forEach(x => x.classList.toggle('active', parseInt(x.dataset.val) <= hv));
            });
        });
        // restore on mouseleave to selected rating
        widget.addEventListener('mouseleave', () => {
            const sel = parseInt(widget.dataset.rating) || 0;
            stars.forEach(x => x.classList.toggle('active', parseInt(x.dataset.val) <= sel));
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initStarRatingWidgets();
});

/* ================= Supabase integration helpers ================= */
// Assumptions:
// - There is a `tutors` table with columns: id, name, subtitle, avatar, price, bio, education, experience, subjects, formats, lat, lng, tags
// - There is a `tutor_ratings` table with columns: id, tutor_id, user_id, rating, created_at
async function fetchTutorsFromSupabase() {
    if (!window.supabaseClient) return null;
    try {
        const { data, error } = await window.supabaseClient
            .from('tutors')
            .select('*');
        if (error) {
            console.warn('Supabase fetch tutors error:', error);
            return null;
        }
        // normalize tags if needed (text -> array)
        const normalized = data.map(t => ({
            id: t.id,
            name: t.name,
            subtitle: t.subtitle,
            avatar: t.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(t.name || 'anon')}`,
            price: t.price || '',
            bio: t.bio || '',
            education: t.education || '',
            experience: t.experience || '',
            subjects: t.subjects || '',
            formats: t.formats || '',
            lat: parseFloat(t.lat) || 0,
            lng: parseFloat(t.lng) || 0,
            tags: Array.isArray(t.tags) ? t.tags : (typeof t.tags === 'string' ? t.tags.split(',').map(x => x.trim()) : [])
        }));
        return normalized;
    } catch (err) {
        console.error('fetchTutorsFromSupabase failed', err);
        return null;
    }
}

async function saveTutorRating(tutorId, rating) {
    if (!window.supabaseClient) throw new Error('Supabase client not available');
    try {
        // Check session first (avoids AuthSessionMissingError)
        const sessionRes = await window.supabaseClient.auth.getSession();
        const session = sessionRes && sessionRes.data ? sessionRes.data.session : null;
        if (!session) {
            // Not logged in
            return { error: { message: 'not_logged_in' } };
        }
        const user = session.user;
        const userId = user ? user.id : null;
        // Upsert rating so each user has at most one rating per tutor
        const payload = [{ tutor_id: tutorId, user_id: userId, rating }];
        const { data, error } = await window.supabaseClient
            .from('tutor_ratings')
            .upsert(payload, { onConflict: 'tutor_id,user_id' });
        if (error) {
            console.warn('saveTutorRating error:', error);
            return { error };
        }
        return { data };
    } catch (err) {
        console.error('saveTutorRating failed', err);
        return { error: err };
    }
}

// get average rating and count; also fetch current user's rating if logged in
async function getTutorRatings(tutorId) {
    if (!window.supabaseClient) return null;
    try {
        // avg and count
        const { data: agg, error: aggErr } = await window.supabaseClient
            .rpc('get_tutor_rating_summary', { p_tutor_id: tutorId });
        // If RPC not available, fallback to query
        let avg = 0, count = 0;
        if (aggErr || !agg) {
            const { data, error } = await window.supabaseClient
                .from('tutor_ratings')
                .select('rating', { count: 'exact' })
                .eq('tutor_id', tutorId);
            if (error) {
                console.warn('getTutorRatings fallback error:', error);
            } else if (data && data.length) {
                count = data.length;
                avg = data.reduce((s, r) => s + (r.rating || 0), 0) / count;
            }
        } else {
            // expect rpc returns { avg, count }
            avg = parseFloat(agg.avg) || 0;
            count = parseInt(agg.count) || 0;
        }
        // user's rating
        let userRating = null;
        try {
            const userRes = await window.supabaseClient.auth.getUser();
            const user = userRes && userRes.data ? userRes.data.user : null;
            if (user) {
                const { data: ur, error: urErr } = await window.supabaseClient
                    .from('tutor_ratings')
                    .select('rating')
                    .eq('tutor_id', tutorId)
                    .eq('user_id', user.id)
                    .limit(1)
                    .order('created_at', { ascending: false });
                if (!urErr && ur && ur.length) userRating = ur[0].rating;
            }
        } catch (e) {
            // ignore
        }
        return { avg, count, userRating };
    } catch (err) {
        console.error('getTutorRatings failed', err);
        return null;
    }
}
/* ================= Supabase Realtime Presence (Đếm số người Online) ================= */
document.addEventListener('DOMContentLoaded', async () => {
    const onlineCountDisplay = document.getElementById('onlineCountDisplay');
    const locationDisplay = document.getElementById('locationDisplay');
    
    // Tiện thể điền luôn vị trí mặc định cho phần hiển thị kế bên
    if (locationDisplay) {
        locationDisplay.textContent = 'Đà Nẵng';
    }

    if (!onlineCountDisplay || !window.supabaseClient) return;

    // Tạo một ID tạm cho khách nếu chưa đăng nhập để đếm cả khách vãng lai
    let userId = 'guest-' + Math.floor(Math.random() * 1000000);
    if (typeof UserInfo !== 'undefined') {
        const id = await UserInfo.getUserID();
        if (id) userId = id;
    }

    // Tạo một kênh (channel) chung để mọi người kết nối vào
    const presenceChannel = window.supabaseClient.channel('edumap-online-users');

    presenceChannel
        // Lắng nghe sự kiện mỗi khi có người mới vào hoặc thoát ra
        .on('presence', { event: 'sync' }, () => {
            const state = presenceChannel.presenceState();
            // state là một object chứa ID của tất cả những người đang kết nối
            const onlineCount = Object.keys(state).length;
            
            // Cập nhật con số ra ngoài màn hình
            onlineCountDisplay.textContent = onlineCount;
        })
        .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                // Khi vừa kết nối thành công, "báo cáo" sự có mặt của mình lên hệ thống
                await presenceChannel.track({
                    user_id: userId,
                    online_at: new Date().toISOString(),
                });
            }
        });
});
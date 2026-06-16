const DB = window.supabaseClient;

let ME = null;
let MY_LIKES = new Set();

function esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function ago(d) {
    const s = (Date.now() - new Date(d)) / 1000;
    if (s < 60) return 'Vừa xong';
    if (s < 3600) return `${Math.floor(s/60)} phút trước`;
    if (s < 86400) return `${Math.floor(s/3600)} giờ trước`;
    return `${Math.floor(s/86400)} ngày trước`;
}

function av(name) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name||'x')}`;
}

function toast(msg, type='ok') {
    let box = document.getElementById('_toast');
    if (!box) {
        box = document.createElement('div');
        box.id = '_toast';
        box.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
        document.body.appendChild(box);
    }
    const c = {ok:'#10b981',warn:'#f59e0b',err:'#ef4444'}[type]||'#10b981';
    const t = document.createElement('div');
    t.style.cssText = `background:rgba(10,20,35,0.96);border-left:4px solid ${c};border:1px solid ${c}22;color:#f1f5f9;padding:12px 18px;border-radius:12px;font-size:14px;font-weight:600;min-width:220px;box-shadow:0 8px 24px #0005;transition:opacity .3s;`;
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => { t.style.opacity='0'; setTimeout(()=>t.remove(),300); }, 4000);
}

function dbg(label, obj) {
    console.log(`[Community] ${label}`, obj);
}

async function initMe() {
    try {
        const { data: { user }, error: authErr } = await DB.auth.getUser();
        dbg('auth.getUser', { user: user?.id, authErr });
        if (!user) { dbg('initMe', 'không có user đăng nhập'); return; }

        const { data, error } = await DB.from('accounts').select('id,full_name').eq('id', user.id).single();
        dbg('accounts query', { data, error });
        if (error || !data) return;

        ME = data;
        document.querySelectorAll('#userNameDisplay').forEach(el => el.textContent = ME.full_name);
        const ai = document.getElementById('userAvatarImg');
        if (ai) ai.src = av(ME.full_name);
        const pa = document.getElementById('postBoxAvatar');
        if (pa) pa.src = av(ME.full_name);

        const { data: likes, error: likeErr } = await DB.from('likes').select('post_id').eq('user_id', ME.id);
        dbg('likes load', { count: likes?.length, likeErr });
        MY_LIKES = new Set((likes||[]).map(r=>r.post_id));
    } catch(e) {
        dbg('initMe ERROR', e);
    }
}

async function loadPosts() {
    const { data, error } = await DB.from('posts')
        .select('*').order('created_at', { ascending: false }).limit(30);
    dbg('loadPosts', { count: data?.length, error });
    if (error) { toast('Lỗi tải bài: ' + error.message, 'err'); return; }

    const feed = document.getElementById('feedCenter');
    feed.querySelectorAll('.post[data-db]').forEach(el => el.remove());
    const postBox = document.getElementById('postBox');
    for (const p of (data||[])) {
        const el = await buildPost(p);
        postBox.insertAdjacentElement('afterend', el);
    }
}

async function getCounts(postId) {
    const [lRes, cRes] = await Promise.all([
        DB.from('likes').select('*', {count:'exact',head:true}).eq('post_id', postId),
        DB.from('comments').select('*', {count:'exact',head:true}).eq('post_id', postId)
    ]);
    return { likeCount: lRes.count||0, cmtCount: cRes.count||0 };
}

async function buildPost(p) {
    const { likeCount, cmtCount } = await getCounts(p.id);
    const isLiked  = MY_LIKES.has(p.id);
    const isOwner  = ME && ME.id === p.user_id;
    const name     = p.full_name || 'Người dùng';
    const tags     = (p.tags||[]).map(t=>`<span>#${esc(t)}</span>`).join('');

    const div = document.createElement('div');
    div.className = 'post glass-panel';
    div.dataset.db = p.id;

    div.innerHTML = `
        <div class="post-header">
            <img src="${av(name)}" class="avatar" alt="">
            <div class="user-info">
                <h4 class="user-trigger">${esc(name)}</h4>
                <span class="time">${ago(p.created_at)} • <i class="fa-solid fa-earth-americas"></i></span>
            </div>
            ${isOwner
                ? `<button class="post-options _del"><i class="fa-solid fa-trash" style="color:#ef4444;font-size:14px;"></i></button>`
                : `<button class="post-options"><i class="fa-solid fa-ellipsis"></i></button>`}
        </div>
        <div class="post-content">
            <p>${esc(p.content).replace(/\n/g,'<br>')}</p>
            ${tags ? `<div class="post-tags">${tags}</div>` : ''}
        </div>
        <div class="post-stats">
            <span class="_lc">${likeCount > 0 ? `<span class="like-icon-circle"><i class="fa-solid fa-thumbs-up" style="font-size:9px;"></i></span> ${likeCount}` : ''}</span>
            <span class="_cc">${cmtCount > 0 ? `${cmtCount} bình luận` : ''}</span>
        </div>
        <div style="border-top:1px solid rgba(255,255,255,0.08);margin:4px 0;"></div>
        <div class="actions">
            <button class="like-btn${isLiked?' liked':''}">
                <i class="${isLiked?'fa-solid':'fa-regular'} fa-heart"></i>
                <span>${isLiked?'Đã thích':'Thích'}</span>
            </button>
            <button class="comment-btn"><i class="fa-regular fa-comment"></i> Bình luận</button>
            <button class="share-btn"><i class="fa-solid fa-share"></i> Chia sẻ</button>
        </div>`;

    div.querySelector('.like-btn').onclick    = () => handleLike(div, p.id);
    div.querySelector('.comment-btn').onclick = () => toggleComments(div, p.id);
    div.querySelector('.share-btn').onclick   = () => handleShare(div, p.id);
    div.querySelector('._del')?.addEventListener('click', () => handleDelete(div, p.id));
    return div;
}

async function handleSubmit() {
    if (!ME) { toast('Bạn cần đăng nhập để đăng bài!', 'warn'); return; }
    const ta  = document.getElementById('postTextarea');
    const btn = document.getElementById('submitPostBtn');
    const content = ta?.value.trim();
    if (!content) { toast('Nhập nội dung bài viết!', 'warn'); return; }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';

    const tags = (content.match(/#[\wÀ-ỹ]+/g)||[]).map(t=>t.slice(1));
    const payload = { user_id: ME.id, full_name: ME.full_name, content, tags };
    dbg('handleSubmit payload', payload);

    const { data, error } = await DB.from('posts').insert(payload).select().single();
    dbg('handleSubmit result', { data, error });

    if (error) {
        toast('Đăng bài thất bại: ' + error.message, 'err');
    } else {
        ta.value = '';
        const el = await buildPost(data);
        document.getElementById('postBox').insertAdjacentElement('afterend', el);
        toast('Đăng bài thành công!');
    }

    btn.disabled = false;
    btn.innerHTML = 'Đăng bài <i class="fa-solid fa-paper-plane"></i>';
}

async function handleLike(div, postId) {
    if (!ME) { toast('Đăng nhập để thích bài!', 'warn'); return; }
    const btn     = div.querySelector('.like-btn');
    const icon    = btn.querySelector('i');
    const span    = btn.querySelector('span');
    const lcEl    = div.querySelector('._lc');
    const isLiked = MY_LIKES.has(postId);

    btn.disabled = true;

    if (isLiked) {
        const { error } = await DB.from('likes').delete().eq('post_id', postId).eq('user_id', ME.id);
        dbg('unlike', { postId, error });
        if (!error) {
            MY_LIKES.delete(postId);
            btn.classList.remove('liked');
            icon.className = 'fa-regular fa-heart';
            span.textContent = 'Thích';
        } else toast('Lỗi: ' + error.message, 'err');
    } else {
        const { error } = await DB.from('likes').insert({ post_id: postId, user_id: ME.id });
        dbg('like', { postId, error });
        if (!error) {
            MY_LIKES.add(postId);
            btn.classList.add('liked');
            icon.className = 'fa-solid fa-heart';
            span.textContent = 'Đã thích';
        } else toast('Lỗi: ' + error.message, 'err');
    }

    const { count } = await DB.from('likes').select('*',{count:'exact',head:true}).eq('post_id', postId);
    if (lcEl) lcEl.innerHTML = count > 0
        ? `<span class="like-icon-circle"><i class="fa-solid fa-thumbs-up" style="font-size:9px;"></i></span> ${count}`
        : '';

    btn.disabled = false;
}

async function toggleComments(div, postId) {
    let section = div.querySelector('.meta-comments');
    if (section) {
        section.style.display = section.style.display === 'none' ? 'block' : 'none';
        return;
    }

    section = document.createElement('div');
    section.className = 'meta-comments';
    section.innerHTML = `
        <div class="_cmtList"><p style="color:#94a3b8;font-size:13px;text-align:center;padding:10px;">Đang tải...</p></div>
        <div class="comment-input-wrapper">
            <img src="${av(ME?.full_name)}" class="comment-avatar" alt="">
            <div class="input-box">
                <input type="text" class="input-comment" placeholder="${ME ? 'Viết bình luận...' : 'Đăng nhập để bình luận...'}">
                <div class="input-actions">
                    <i class="fa-solid fa-paper-plane _sendCmt" style="cursor:pointer;color:#38bdf8;"></i>
                </div>
            </div>
        </div>`;
    div.appendChild(section);
    await loadComments(section, postId);

    const input = section.querySelector('.input-comment');
    const send  = section.querySelector('._sendCmt');

    const doSend = async () => {
        if (!ME) { toast('Đăng nhập để bình luận!','warn'); return; }
        const text = input.value.trim();
        if (!text) return;
        input.disabled = true;

        const payload = { post_id: postId, user_id: ME.id, full_name: ME.full_name, content: text };
        dbg('comment insert payload', payload);
        const { error } = await DB.from('comments').insert(payload);
        dbg('comment insert result', { error });

        if (error) {
            toast('Lỗi bình luận: ' + error.message, 'err');
        } else {
            input.value = '';
            await loadComments(section, postId);
            const { count } = await DB.from('comments').select('*',{count:'exact',head:true}).eq('post_id', postId);
            const ccEl = div.querySelector('._cc');
            if (ccEl) ccEl.textContent = count > 0 ? `${count} bình luận` : '';
        }
        input.disabled = false;
        input.focus();
    };

    send.onclick = doSend;
    input.onkeypress = e => { if (e.key==='Enter') { e.preventDefault(); doSend(); } };
    if (ME) input.focus();
}

async function loadComments(section, postId) {
    const list = section.querySelector('._cmtList');
    const { data, error } = await DB.from('comments').select('*')
        .eq('post_id', postId).order('created_at', { ascending: true });
    dbg('loadComments', { postId, count: data?.length, error });

    list.innerHTML = '';
    if (error) { list.innerHTML = '<p style="color:#ef4444;font-size:13px;text-align:center;padding:10px;">Lỗi: ' + error.message + '</p>'; return; }
    if (!data || data.length === 0) {
        list.innerHTML = '<p style="color:#94a3b8;font-size:13px;text-align:center;padding:10px;">Chưa có bình luận.</p>';
        return;
    }

    data.forEach(c => {
        const isOwn = ME && ME.id === c.user_id;
        const item = document.createElement('div');
        item.className = 'comment-item';
        item.innerHTML = `
            <img src="${av(c.full_name)}" class="comment-avatar" alt="">
            <div class="comment-block">
                <div class="comment-bubble">
                    <span class="comment-author">${esc(c.full_name)}</span>
                    <span class="comment-text">${esc(c.content)}</span>
                </div>
                <div class="comment-actions-row">
                    <span class="c-time">${ago(c.created_at)}</span>
                    ${isOwn ? `<span class="c-action _delCmt" style="color:#ef4444;cursor:pointer;">Xóa</span>` : ''}
                </div>
            </div>`;
        item.querySelector('._delCmt')?.addEventListener('click', async () => {
            const { error } = await DB.from('comments').delete().eq('id', c.id);
            if (!error) item.remove();
            else toast('Xóa thất bại: ' + error.message,'err');
        });
        list.appendChild(item);
    });
}

async function handleShare(div, postId) {
    const url = `${location.origin}${location.pathname}#${div.dataset.db||postId}`;
    try {
        if (navigator.share) await navigator.share({ title:'EduMap Community', url });
        else { await navigator.clipboard.writeText(url); toast('Đã sao chép link!'); }
    } catch(e) { if (e.name!=='AbortError') toast('Lỗi chia sẻ','err'); }
}

async function handleDelete(div, postId) {
    if (!confirm('Xóa bài viết này?')) return;
    const { error } = await DB.from('posts').delete().eq('id', postId);
    if (error) { toast('Xóa thất bại: ' + error.message,'err'); return; }
    div.style.transition='all .3s';
    div.style.opacity='0'; div.style.maxHeight='0';
    div.style.overflow='hidden'; div.style.padding='0'; div.style.margin='0';
    setTimeout(()=>div.remove(), 320);
    toast('Đã xóa bài viết!');
}

function initDropdown() {
    const wrapper  = document.getElementById('avatarWrapper');
    const dropdown = document.getElementById('userDropdown');
    wrapper?.addEventListener('click', e => { e.stopPropagation(); dropdown?.classList.toggle('active'); });
    document.addEventListener('click', () => dropdown?.classList.remove('active'));
    document.getElementById('btnLogout')?.addEventListener('click', async e => {
        e.preventDefault();
        await DB.auth.signOut();
        location.href = 'index.html';
    });
}

function initChat() {
    const input   = document.querySelector('.chat-footer input');
    const sendBtn = document.querySelector('.btn-send');
    const body    = document.querySelector('.chat-body');
    if (!input||!sendBtn||!body) return;
    const send = () => {
        const t = input.value.trim();
        if (!t) return;
        const m = document.createElement('div');
        m.className='message sent'; m.innerHTML=`<p>${esc(t)}</p>`;
        body.appendChild(m); input.value=''; body.scrollTop=body.scrollHeight;
        setTimeout(()=>{
            const r=document.createElement('div'); r.className='message received';
            r.innerHTML=`<p>Bạn đợi chút mình đang bận!</p>`;
            body.appendChild(r); body.scrollTop=body.scrollHeight;
        },1500);
    };
    sendBtn.onclick = send;
    input.onkeypress = e => { if(e.key==='Enter'){e.preventDefault();send();} };
}

function initStaticPosts() {
    document.querySelectorAll('.post:not([data-db])').forEach(post => {
        if (post.dataset.evInit) return;
        post.dataset.evInit = '1';

        post.querySelector('.like-btn')?.addEventListener('click', () => {
            const btn  = post.querySelector('.like-btn');
            const icon = btn.querySelector('i');
            const span = btn.querySelector('span');
            const isLiked = btn.classList.contains('liked');
            btn.classList.toggle('liked', !isLiked);
            icon.className = isLiked ? 'fa-regular fa-heart' : 'fa-solid fa-heart';
            if (span) span.textContent = isLiked ? 'Thích' : 'Đã thích';
        });

        post.querySelector('.comment-btn')?.addEventListener('click', () => {
            let s = post.querySelector('.meta-comments');
            if (s) { s.style.display = s.style.display==='none'?'block':'none'; return; }
            const ua = document.getElementById('userAvatarImg')?.src || av('');
            const un = ME?.full_name || document.getElementById('userNameDisplay')?.textContent || 'Bạn';
            s = document.createElement('div');
            s.className='meta-comments';
            s.innerHTML=`
                <div class="_cmtList">
                    <div class="comment-item">
                        <img src="https://i.pravatar.cc/150?img=32" class="comment-avatar" alt="">
                        <div class="comment-block">
                            <div class="comment-bubble">
                                <span class="comment-author">Minh Anh</span>
                                <span class="comment-text">Bạn thử tìm trên EduMap nhé!</span>
                            </div>
                            <div class="comment-actions-row"><span class="c-time">10 phút trước</span></div>
                        </div>
                    </div>
                </div>
                <div class="comment-input-wrapper">
                    <img src="${esc(ua)}" class="comment-avatar" alt="">
                    <div class="input-box">
                        <input type="text" class="input-comment" placeholder="Viết bình luận...">
                        <div class="input-actions">
                            <i class="fa-solid fa-paper-plane _sc" style="cursor:pointer;color:#38bdf8;"></i>
                        </div>
                    </div>
                </div>`;
            post.appendChild(s);
            const inp = s.querySelector('.input-comment');
            const sc  = s.querySelector('._sc');
            const add = () => {
                const t = inp.value.trim();
                if (!t) return;
                const item = document.createElement('div');
                item.className = 'comment-item';
                item.innerHTML = `<img src="${esc(ua)}" class="comment-avatar" alt=""><div class="comment-block"><div class="comment-bubble"><span class="comment-author">${esc(un)}</span><span class="comment-text">${esc(t)}</span></div></div>`;
                s.querySelector('._cmtList').appendChild(item);
                inp.value='';
            };
            sc.onclick=add;
            inp.onkeypress=e=>{if(e.key==='Enter'){e.preventDefault();add();}};
            inp.focus();
        });

        post.querySelector('.share-btn')?.addEventListener('click', async () => {
            const url = `${location.origin}${location.pathname}#${post.id}`;
            try {
                if (navigator.share) await navigator.share({title:'EduMap',url});
                else { await navigator.clipboard.writeText(url); toast('Đã sao chép link!'); }
            } catch(e) {}
        });
    });
}

function openChat(name, src) {
    document.getElementById('chat-name').innerText = name;
    document.getElementById('chat-avatar').src = src;
    document.querySelector('.chat-body').innerHTML = '';
    document.getElementById('contact-list').classList.replace('active-panel','hidden-panel');
    document.getElementById('active-chat').classList.replace('hidden-panel','active-panel');
}

function closeChat() {
    document.getElementById('active-chat').classList.replace('active-panel','hidden-panel');
    document.getElementById('contact-list').classList.replace('hidden-panel','active-panel');
}

document.addEventListener('DOMContentLoaded', async () => {
    const style = document.createElement('style');
    style.textContent=`
        .like-btn.liked{color:#ef4444;}
        .like-btn.liked i{animation:pop .3s ease;}
        @keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.4)}100%{transform:scale(1)}}
        ._lc{display:flex;align-items:center;gap:5px;}
    `;
    document.head.appendChild(style);

    initDropdown();
    initChat();
    initStaticPosts();

    document.getElementById('submitPostBtn')?.addEventListener('click', handleSubmit);
    document.getElementById('postTextarea')?.addEventListener('keydown', e => {
        if (e.key==='Enter' && e.ctrlKey) { e.preventDefault(); handleSubmit(); }
    });

    if (DB) {
        await initMe();
        await loadPosts();

        DB.channel('comm_rt').on('postgres_changes',
            { event:'INSERT', schema:'public', table:'posts' },
            async payload => {
                if (ME && payload.new.user_id === ME.id) return;
                const el = await buildPost(payload.new);
                document.getElementById('postBox').insertAdjacentElement('afterend', el);
                toast(`Bài mới từ ${payload.new.full_name||'ai đó'}`);
            }
        ).subscribe();
    }

    if (location.hash) {
        setTimeout(()=>{
            const el = document.querySelector(location.hash);
            if (!el) return;
            el.scrollIntoView({behavior:'smooth',block:'center'});
            el.style.boxShadow='0 0 0 3px rgba(44,116,179,.7)';
            setTimeout(()=>el.style.boxShadow='',2500);
        },600);
    }
});

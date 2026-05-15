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
const mockTutors = [
    {
        id: "tutor_01", name: "PGS.TS. Huỳnh Công Pháp", subtitle: "Giảng viên đại học • Toán, Hóa", avatar: "https://i.pravatar.cc/150?img=11", price: "200k / buổi",
        bio: "Thầy có hơn 15 năm kinh nghiệm giảng dạy, chuyên luyện thi đại học môn Toán và Hóa cho học sinh cấp 3. Phương pháp dạy trực quan, bám sát đề thi.",
        education: "Tiến sĩ Toán", experience: "15 năm giảng dạy", subjects: "Toán Học, Hóa Học", formats: "Tại nhà / Online",
        lat: 16.0544, lng: 108.2022, tags: ["toan", "hoa_hoc"] 
    },
    {
        id: "tutor_02", name: "Trần Mai Anh", subtitle: "Sinh viên năm 4 • Tiếng Anh giao tiếp", avatar: "https://i.pravatar.cc/150?img=5", price: "120k / buổi",
        bio: "IELTS 8.0. 3 năm kinh nghiệm làm gia sư tiếng Anh giao tiếp và luyện thi IELTS. Trẻ trung, nhiệt tình.",
        education: "Cử nhân Ngôn ngữ Anh", experience: "3 năm gia sư", subjects: "Tiếng Anh", formats: "Online",
        lat: 16.0723, lng: 108.2230, tags: ["ngoai_ngu"]
    },
    {
        id: "tutor_03", name: "Lê Văn Hùng", subtitle: "Giáo viên trung học • Lập trình cơ bản", avatar: "https://i.pravatar.cc/150?img=6", price: "100k / buổi",
        bio: "Giáo viên với hơn 10 năm kinh nghiệm giảng dạy lập trình C/C++, Scratch cho học sinh mới bắt đầu.",
        education: "Cử nhân Khoa học Máy tính", experience: "10 năm giảng dạy", subjects: "Lập trình C++, Python", formats: "Tại nhà / Online",
        lat: 16.0601, lng: 108.2154, tags: ["lap_trinh"]
    },
    {
        id: "tutor_04", name: "Nguyễn Lê Vy", subtitle: "Thạc sĩ Vật lý • Vật Lý Đại cương", avatar: "https://i.pravatar.cc/150?img=12", price: "150k / buổi",
        bio: "Chuyên giải bài tập Lý thuyết, Vật lý đại cương cho sinh viên khối kỹ thuật Bách Khoa, Sư Phạm Kỹ Thuật.",
        education: "Thạc sĩ Vật Lý", experience: "5 năm giảng dạy", subjects: "Vật Lý", formats: "Tại nhà / Online",
        lat: 16.0815, lng: 108.2415, tags: ["vat_ly"]
    },
    {
        id: "tutor_05", name: "Trương Tuấn Anh", subtitle: "Designer • UI/UX & Đồ họa", avatar: "https://i.pravatar.cc/150?img=17", price: "180k / buổi",
        bio: "Chia sẻ kinh nghiệm thiết kế giao diện Figma, tư vấn làm portfolio cho người mới bắt đầu.",
        education: "Cử nhân Thiết kế Mỹ thuật số", experience: "3 năm kinh nghiệm", subjects: "Thiết kế Đồ họa, UI/UX", formats: "Tại nhà / Online",
        lat: 16.0123, lng: 108.2456, tags: ["nghe_thuat", "lap_trinh"]
    },
    {
        id: "tutor_06", name: "Phan Minh Khôi", subtitle: "Nhà nghiên cứu Lịch Sử", avatar: "https://i.pravatar.cc/150?img=31", price: "120k / buổi",
        bio: "Giúp các em học sinh có cái nhìn mới mẻ về Lịch Sử, Địa Lý. Luyện thi THPT Quốc Gia khối C.",
        education: "Cử nhân Sư phạm Lịch Sử", experience: "4 năm luyện thi", subjects: "Lịch Sử, Địa Lý", formats: "Tại nhà / Quán Cafe",
        lat: 16.0354, lng: 108.2148, tags: ["khoa_hoc_xa_hoi"]
    },
    {
        id: "tutor_07", name: "Vũ Quốc Đạt", subtitle: "Senior Data Scientist • Machine Learning", avatar: "https://i.pravatar.cc/150?img=26", price: "350k / buổi",
        bio: "Nhận hướng dẫn sinh viên làm đồ án tốt nghiệp về Machine Learning, Deep Learning bằng Python.",
        education: "Thạc sĩ Trí tuệ Nhân tạo", experience: "6 năm làm việc", subjects: "Lập trình, Khoa học dữ liệu", formats: "Online",
        lat: 16.0512, lng: 108.2011, tags: ["lap_trinh", "toan"]
    },
    {
        id: "tutor_08", name: "Hoàng Trọng Khang", subtitle: "Trợ giảng Đại học • Cấu trúc dữ liệu", avatar: "https://i.pravatar.cc/150?img=14", price: "100k / buổi",
        bio: "Dạy kèm C++, Data Structures & Algorithms từ cơ bản đến nâng cao cho sinh viên IT.",
        education: "Sinh viên năm cuối CNTT", experience: "2 năm trợ giảng", subjects: "Lập trình C++, CTDL", formats: "Tại nhà / Quán Cafe",
        lat: 15.9780, lng: 108.2510, tags: ["lap_trinh"] 
    },
    {
        id: "tutor_09", name: "Đào Ngọc Yến", subtitle: "Giảng viên IELTS • Tiếng Anh", avatar: "https://i.pravatar.cc/150?img=29", price: "180k / buổi",
        bio: "Sở hữu IELTS 8.5. Nhận kèm riêng 1-1 các kỹ năng Speaking và Writing.",
        education: "Cử nhân Ngôn ngữ Anh", experience: "5 năm luyện thi", subjects: "Tiếng Anh (IELTS/TOEIC)", formats: "Tại nhà / Online",
        lat: 16.0689, lng: 108.1892, tags: ["ngoai_ngu"]
    },
    {
        id: "tutor_10", name: "Nguyễn Đình Sơn", subtitle: "Giảng viên Mỹ Thuật", avatar: "https://i.pravatar.cc/150?img=15", price: "250k / buổi",
        bio: "Dạy vẽ tĩnh vật, vẽ chân dung cơ bản và nâng cao để thi vào các trường Kiến trúc, Mỹ thuật.",
        education: "Thạc sĩ Mỹ thuật", experience: "7 năm giảng dạy", subjects: "Hội họa, Vẽ kỹ thuật", formats: "Tại xưởng vẽ",
        lat: 16.0755, lng: 108.1523, tags: ["nghe_thuat"]
    },
    {
        id: "tutor_11", name: "Đinh Tấn Phát", subtitle: "Database Admin • SQL", avatar: "https://i.pravatar.cc/150?img=20", price: "180k / buổi",
        bio: "Hỗ trợ thiết kế cơ sở dữ liệu cho đồ án MySQL, SQL Server.",
        education: "Cử nhân HTTT", experience: "5 năm quản trị", subjects: "Lập trình, Cơ sở dữ liệu", formats: "Online",
        lat: 16.0421, lng: 108.2205, tags: ["lap_trinh"]
    },
    {
        id: "tutor_12", name: "Lương Thị Kiều", subtitle: "Cố vấn Kinh tế & Xã hội học", avatar: "https://i.pravatar.cc/150?img=21", price: "300k / buổi",
        bio: "Dạy các môn đại cương Triết học Mác-Lênin, Kinh tế chính trị, Xã hội học cho sinh viên đại học.",
        education: "MBA", experience: "Sáng lập 2 startup", subjects: "Kinh tế học, Triết học", formats: "Online",
        lat: 16.0654, lng: 108.2211, tags: ["khoa_hoc_xa_hoi"]
    },
    {
        id: "tutor_13", name: "Hồ Bá Lộc", subtitle: "Nghệ sĩ tự do • Piano", avatar: "https://i.pravatar.cc/150?img=22", price: "200k / buổi",
        bio: "Nhận dạy đệm hát Piano cơ bản và thanh nhạc.",
        education: "Cử nhân Thanh nhạc", experience: "8 năm biểu diễn", subjects: "Âm nhạc (Piano, Thanh nhạc)", formats: "Tại phòng tập nhạc",
        lat: 16.0488, lng: 108.2355, tags: ["nghe_thuat"]
    },
    {
        id: "tutor_14", name: "Bùi Thị Mai", subtitle: "Giáo viên Hóa cấp 3", avatar: "https://i.pravatar.cc/150?img=18", price: "150k / buổi",
        bio: "Bí quyết cân bằng phương trình hóa học siêu tốc, luyện thi ĐH khối A, B.",
        education: "Cử nhân Sư phạm Hóa", experience: "2 năm giảng dạy", subjects: "Hóa Học", formats: "Tại nhà",
        lat: 16.0598, lng: 108.2301, tags: ["hoa_hoc"]
    },
    {
        id: "tutor_15", name: "Trần Thanh Thúy", subtitle: "Luyện thi khối D", avatar: "https://i.pravatar.cc/150?img=32", price: "200k / buổi",
        bio: "Gia sư chuyên Toán - Văn - Anh khối D. Giáo án riêng biệt cho học sinh mất gốc.",
        education: "Đại học Sư Phạm", experience: "5 năm gia sư", subjects: "Toán Học, Tiếng Anh, Văn", formats: "Tại nhà",
        lat: 16.0850, lng: 108.1500, tags: ["toan", "ngoai_ngu", "khoa_hoc_xa_hoi"] // Liên Chiểu
    },
    { id: "tutor_16", name: "Lê Minh Tuấn", subtitle: "Backend Dev", avatar: "https://i.pravatar.cc/150?img=13", price: "200k/buổi", bio: "Java, Spring Boot.", education: "KS", experience: "4 năm", subjects: "Lập trình", formats: "Online", lat: 16.015, lng: 108.200, tags: ["lap_trinh"] },
    { id: "tutor_17", name: "Phạm Thu Hương", subtitle: "TOEIC 900+", avatar: "https://i.pravatar.cc/150?img=16", price: "150k/buổi", bio: "Luyện TOEIC.", education: "Cử nhân", experience: "3 năm", subjects: "Ngoại ngữ", formats: "Tại nhà", lat: 16.070, lng: 108.220, tags: ["ngoai_ngu"] },
    { id: "tutor_18", name: "Đặng Văn Nam", subtitle: "Chuyên Hóa", avatar: "https://i.pravatar.cc/150?img=19", price: "130k/buổi", bio: "Ôn thi HSG Hóa.", education: "Thạc sĩ", experience: "6 năm", subjects: "Hóa Học", formats: "Tại nhà", lat: 16.060, lng: 108.240, tags: ["hoa_hoc"] },
    { id: "tutor_19", name: "Vũ Hà Linh", subtitle: "Văn học", avatar: "https://i.pravatar.cc/150?img=23", price: "100k/buổi", bio: "Dạy Văn cảm thụ.", education: "Sư phạm", experience: "2 năm", subjects: "Văn học", formats: "Online", lat: 16.040, lng: 108.210, tags: ["khoa_hoc_xa_hoi"] },
    { id: "tutor_20", name: "Thái Văn Quyết", subtitle: "Chuyên Toán", avatar: "https://i.pravatar.cc/150?img=24", price: "150k/buổi", bio: "Luyện Toán cấp 2.", education: "Sư phạm", experience: "4 năm", subjects: "Toán Học", formats: "Tại nhà", lat: 16.020, lng: 108.230, tags: ["toan"] },
    { id: "tutor_21", name: "Ngô Khắc Duy", subtitle: "Đồ họa PTS", avatar: "https://i.pravatar.cc/150?img=25", price: "220k/buổi", bio: "PTS, AI.", education: "Thiết kế", experience: "6 năm", subjects: "Nghệ thuật", formats: "Online", lat: 16.050, lng: 108.250, tags: ["nghe_thuat"] },
    { id: "tutor_22", name: "Nguyễn Thu Trang", subtitle: "Vật lý 12", avatar: "https://i.pravatar.cc/150?img=27", price: "250k/buổi", bio: "Luyện Lý đại học.", education: "Cử nhân", experience: "7 năm", subjects: "Vật Lý", formats: "Tại nhà", lat: 16.080, lng: 108.190, tags: ["vat_ly"] },
    { id: "tutor_23", name: "Bùi Tiến Dũng", subtitle: "Lập trình C", avatar: "https://i.pravatar.cc/150?img=28", price: "200k/buổi", bio: "Cơ bản C/C++.", education: "Đại học", experience: "4 năm", subjects: "Lập trình", formats: "Tại nhà", lat: 16.090, lng: 108.180, tags: ["lap_trinh"] },
    { id: "tutor_24", name: "Lê Hoàng Long", subtitle: "Lịch sử & Tiếng Anh", avatar: "https://i.pravatar.cc/150?img=30", price: "400k/buổi", bio: "Tích hợp.", education: "Thạc sĩ", experience: "10 năm", subjects: "Lịch sử, Ngoại ngữ", formats: "Online", lat: 16.010, lng: 108.240, tags: ["khoa_hoc_xa_hoi", "ngoai_ngu"] },
    { id: "tutor_25", name: "Võ Trọng Nghĩa", subtitle: "Xác suất thống kê", avatar: "https://i.pravatar.cc/150?img=33", price: "250k/buổi", bio: "Toán đại học.", education: "Tiến sĩ", experience: "12 năm", subjects: "Toán Học", formats: "Online", lat: 16.030, lng: 108.220, tags: ["toan"] },
    { id: "tutor_26", name: "Đỗ Phương Thảo", subtitle: "Cơ sở dữ liệu", avatar: "https://i.pravatar.cc/150?img=34", price: "220k/buổi", bio: "SQL, NoSQL.", education: "Kỹ sư", experience: "5 năm", subjects: "Lập trình", formats: "Online", lat: 16.045, lng: 108.195, tags: ["lap_trinh"] },
    { id: "tutor_27", name: "Ngô Quốc Bảo", subtitle: "Nghệ thuật giao tiếp", avatar: "https://i.pravatar.cc/150?img=35", price: "200k/buổi", bio: "Kỹ năng mềm.", education: "MBA", experience: "6 năm", subjects: "Kỹ năng mềm", formats: "Tại nhà", lat: 16.055, lng: 108.205, tags: ["khoa_hoc_xa_hoi"] },
    { id: "tutor_28", name: "Phạm Tấn Tài", subtitle: "Gia sư Hóa 9", avatar: "https://i.pravatar.cc/150?img=36", price: "120k/buổi", bio: "Lấy lại căn bản Hóa.", education: "Sư phạm", experience: "3 năm", subjects: "Hóa Học", formats: "Tại nhà", lat: 16.065, lng: 108.215, tags: ["hoa_hoc"] },
    { id: "tutor_29", name: "Lý Nhã Kỳ", subtitle: "Tiếng Trung HSK", avatar: "https://i.pravatar.cc/150?img=37", price: "150k/buổi", bio: "Luyện thi HSK 3,4.", education: "Ngôn ngữ", experience: "4 năm", subjects: "Ngoại ngữ", formats: "Online", lat: 16.025, lng: 108.235, tags: ["ngoai_ngu"] },
    { id: "tutor_30", name: "Vương Đình Huệ", subtitle: "Toán cao cấp", avatar: "https://i.pravatar.cc/150?img=38", price: "300k/buổi", bio: "Đại số tuyến tính.", education: "Tiến sĩ", experience: "15 năm", subjects: "Toán Học", formats: "Online", lat: 16.075, lng: 108.225, tags: ["toan"] },
    {
        id: "tutor_31", name: "Trần Bảo Sơn", subtitle: "Giảng viên IT • Hà Nội", avatar: "https://i.pravatar.cc/150?img=39", price: "200k / buổi",
        bio: "Nhận dạy Frontend (ReactJS) từ xa cho các bạn muốn chuyển ngành.", education: "Kỹ sư", experience: "5 năm", subjects: "Lập trình", formats: "Online",
        lat: 21.0285, lng: 105.8542, tags: ["lap_trinh"]
    },
    {
        id: "tutor_32", name: "Nguyễn Hải Yến", subtitle: "Luyện thi Tiếng Anh • Hà Nội", avatar: "https://i.pravatar.cc/150?img=40", price: "180k / buổi",
        bio: "Chuyên luyện thi vào lớp 10 chuyên Anh Chu Văn An, Ams.", education: "Sư phạm Anh", experience: "8 năm", subjects: "Tiếng Anh", formats: "Tại nhà / Online",
        lat: 21.0063, lng: 105.8427, tags: ["ngoai_ngu"]
    },
    { id: "tutor_33", name: "Bùi Quang Huy", subtitle: "Toán Olympic • HN", avatar: "https://i.pravatar.cc/150?img=41", price: "250k/buổi", bio: "Toán chuyên.", education: "Thạc sĩ", experience: "6 năm", subjects: "Toán Học", formats: "Online", lat: 21.0153, lng: 105.8234, tags: ["toan"] },
    { id: "tutor_34", name: "Đinh Thu Hương", subtitle: "Hóa phân tích • HN", avatar: "https://i.pravatar.cc/150?img=42", price: "150k/buổi", bio: "Hóa ĐH.", education: "Cử nhân", experience: "3 năm", subjects: "Hóa Học", formats: "Tại nhà", lat: 21.0360, lng: 105.7816, tags: ["hoa_hoc"] },
    { id: "tutor_35", name: "Lê Minh Khôi", subtitle: "Thiết kế Đồ họa • HN", avatar: "https://i.pravatar.cc/150?img=43", price: "200k/buổi", bio: "Illustrator, Photoshop.", education: "Mỹ thuật", experience: "5 năm", subjects: "Nghệ thuật", formats: "Online", lat: 20.9937, lng: 105.8055, tags: ["nghe_thuat"] },
    {
        id: "tutor_36", name: "Phạm Tường Vy", subtitle: "Gia sư Tiếng Nhật • TP.HCM", avatar: "https://i.pravatar.cc/150?img=44", price: "160k / buổi",
        bio: "Luyện thi JLPT N4, N3. Có kinh nghiệm sống và làm việc 3 năm tại Nhật.", education: "Ngôn ngữ Nhật", experience: "4 năm", subjects: "Tiếng Nhật", formats: "Online",
        lat: 10.7626, lng: 106.6601, tags: ["ngoai_ngu"]
    },
    {
        id: "tutor_37", name: "Huỳnh Tuấn Kiệt", subtitle: "Kỹ sư Điện • TP.HCM", avatar: "https://i.pravatar.cc/150?img=45", price: "180k / buổi",
        bio: "Dạy Vật lý đại cương, Mạch điện tử cho sinh viên kỹ thuật.", education: "Kỹ sư Điện tử", experience: "5 năm", subjects: "Vật Lý", formats: "Online",
        lat: 10.7769, lng: 106.7009, tags: ["vat_ly"]
    },
    { id: "tutor_38", name: "Trần Gia Hân", subtitle: "Ngữ Văn 12 • TP.HCM", avatar: "https://i.pravatar.cc/150?img=46", price: "130k/buổi", bio: "Ôn thi THPTQG.", education: "Sư phạm", experience: "4 năm", subjects: "Văn học", formats: "Tại nhà", lat: 10.7845, lng: 106.6853, tags: ["khoa_hoc_xa_hoi"] },
    { id: "tutor_39", name: "Võ Thành Luân", subtitle: "C# & .NET • TP.HCM", avatar: "https://i.pravatar.cc/150?img=47", price: "220k/buổi", bio: "Backend dev.", education: "IT", experience: "6 năm", subjects: "Lập trình", formats: "Online", lat: 10.7725, lng: 106.6675, tags: ["lap_trinh"] },
    { id: "tutor_40", name: "Đỗ Mai Anh", subtitle: "Toán tư duy • TP.HCM", avatar: "https://i.pravatar.cc/150?img=48", price: "150k/buổi", bio: "Toán cấp 1, 2.", education: "Cử nhân", experience: "3 năm", subjects: "Toán Học", formats: "Tại nhà", lat: 10.8016, lng: 106.6558, tags: ["toan"] },
    { id: "tutor_41", name: "Tôn Thất Bách", subtitle: "Văn hóa lịch sử • Huế", avatar: "https://i.pravatar.cc/150?img=49", price: "150k/buổi", bio: "Lịch sử VN.", education: "Thạc sĩ", experience: "7 năm", subjects: "Lịch sử", formats: "Online", lat: 16.4637, lng: 107.5909, tags: ["khoa_hoc_xa_hoi"] },
    { id: "tutor_42", name: "Lê Cẩm Tú", subtitle: "Piano cổ điển • Huế", avatar: "https://i.pravatar.cc/150?img=50", price: "200k/buổi", bio: "Học viện Âm nhạc.", education: "Cử nhân", experience: "5 năm", subjects: "Âm nhạc", formats: "Online", lat: 16.4700, lng: 107.5800, tags: ["nghe_thuat"] },
    { id: "tutor_43", name: "Nguyễn Vĩnh Phát", subtitle: "Sinh học 12 • Cần Thơ", avatar: "https://i.pravatar.cc/150?img=51", price: "120k/buổi", bio: "Luyện thi khối B.", education: "Sư phạm Sinh", experience: "4 năm", subjects: "Hóa, Khoa học Tự nhiên", formats: "Online", lat: 10.0452, lng: 105.7469, tags: ["hoa_hoc"] }, // Khối B thường gộp với hóa
    { id: "tutor_44", name: "Đặng Thùy Trâm", subtitle: "Tiếng Anh trẻ em • Cần Thơ", avatar: "https://i.pravatar.cc/150?img=52", price: "100k/buổi", bio: "Starters, Movers.", education: "Ngôn ngữ Anh", experience: "2 năm", subjects: "Tiếng Anh", formats: "Online", lat: 10.0350, lng: 105.7500, tags: ["ngoai_ngu"] },
    { id: "tutor_45", name: "Hoàng Minh Trí", subtitle: "Vật lý 10-11 • Nha Trang", avatar: "https://i.pravatar.cc/150?img=53", price: "130k/buổi", bio: "Vật lý cấp 3.", education: "Sư phạm", experience: "5 năm", subjects: "Vật Lý", formats: "Online", lat: 12.2388, lng: 109.1967, tags: ["vat_ly"] },
    { id: "tutor_46", name: "Vũ Ngọc Mai", subtitle: "Toán 12 • Nha Trang", avatar: "https://i.pravatar.cc/150?img=54", price: "150k/buổi", bio: "Toán ĐH.", education: "ĐH", experience: "3 năm", subjects: "Toán Học", formats: "Online", lat: 12.2450, lng: 109.1900, tags: ["toan"] },
    { id: "tutor_47", name: "Đỗ Hải Phong", subtitle: "Lập trình Web • Hải Phòng", avatar: "https://i.pravatar.cc/150?img=55", price: "180k/buổi", bio: "HTML, CSS, JS.", education: "CNTT", experience: "4 năm", subjects: "Lập trình", formats: "Online", lat: 20.8449, lng: 106.6881, tags: ["lap_trinh"] },
    { id: "tutor_48", name: "Phạm Tú Anh", subtitle: "Hóa đại cương • Hải Phòng", avatar: "https://i.pravatar.cc/150?img=56", price: "140k/buổi", bio: "Hóa phân tích.", education: "Hóa học", experience: "3 năm", subjects: "Hóa Học", formats: "Online", lat: 20.8500, lng: 106.6800, tags: ["hoa_hoc"] },
    { id: "tutor_49", name: "Trịnh Xuân Hoàng", subtitle: "Nhiếp ảnh • Đà Lạt", avatar: "https://i.pravatar.cc/150?img=57", price: "300k/buổi", bio: "Bố cục, Ánh sáng.", education: "Tự học", experience: "8 năm", subjects: "Nghệ thuật, Nhiếp ảnh", formats: "Online", lat: 11.9404, lng: 108.4583, tags: ["nghe_thuat"] },
    { id: "tutor_50", name: "Cao Thanh Tùng", subtitle: "Toán Cao cấp • TP.Vinh", avatar: "https://i.pravatar.cc/150?img=58", price: "160k/buổi", bio: "Toán sinh viên.", education: "Sư phạm", experience: "6 năm", subjects: "Toán Học", formats: "Online", lat: 18.6796, lng: 105.6813, tags: ["toan"] }
];
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
    renderTutorsOnMap(mockTutors);
    initFilter();
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
            renderTutorsOnMap(mockTutors);
            filterSelect.selectedIndex = 0;
        } else {
            const filteredTutors = mockTutors.filter(tutor =>
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
            renderTutorsOnMap(mockTutors);
            return;
        }
        debounceTimer = setTimeout(() => {
            const filteredTutors = mockTutors.filter(tutor => {
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
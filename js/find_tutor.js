document.addEventListener('DOMContentLoaded', async () => {
    if (typeof UserInfo !== 'undefined') {
        const userData = await UserInfo.getUserProfile();
        if (userData && userData.userProfile) {
            const name = userData.userProfile.full_name;
            document.getElementById('userNameDisplay').textContent = name;
            const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
            document.getElementById('userAvatarImg').src = avatarUrl;
        } else {
            document.getElementById('userNameDisplay').textContent = 'Khách';
        }
    }
});
let map;
let currentOpenTutorId = null; 
let markerLayers = []; 
const mockTutors = [
    {
        id: "tutor_01",
        name: "PGS.TS. Huỳnh Công Pháp",
        subtitle: "Giảng viên đại học • Toán, Hóa",
        avatar: "https://i.pravatar.cc/300?img=11",
        price: "200k / buổi",
        bio: "Thầy có hơn 15 năm kinh nghiệm giảng dạy, chuyên luyện thi đại học môn Toán và Hóa cho học sinh cấp 3. Phương pháp dạy trực quan, dễ hiểu, bám sát cấu trúc đề thi.",
        education: "Tiến sĩ Toán",
        experience: "15 năm giảng dạy",
        languages: "Tiếng Việt, Tiếng Anh",
        formats: "Tại nhà / Online",
        lat: 15.9753,
        lng: 108.2532,
        tags: ["toan", "hoa_hoc"]
    },
    {
        id: "tutor_02",
        name: "Trần Mai Anh",
        subtitle: "Sinh viên năm 4 • Tiếng Anh giao tiếp",
        avatar: "https://i.pravatar.cc/300?img=5",
        price: "120k / buổi",
        bio: "Sinh viên năm cuối, IELTS 8.0. Đã có 3 năm kinh nghiệm làm gia sư tiếng Anh giao tiếp và luyện thi IELTS. Trẻ trung, nhiệt tình và có phương pháp dạy hiện đại.",
        education: "Cử nhân Ngôn ngữ Anh",
        experience: "3 năm gia sư",
        languages: "Tiếng Việt, Tiếng Anh",
        formats: "Online",
        lat: 16.0544,
        lng: 108.2022,
        tags: ["tieng_anh"]
    },
    {
        id: "tutor_03",
        name: "Lê Văn Hùng",
        subtitle: "Giáo viên trung học • Lập trình cơ bản",
        avatar: "https://i.pravatar.cc/300?img=6",
        price: "100k / buổi",
        bio: "Giáo viên trung học với hơn 10 năm kinh nghiệm giảng dạy lập trình cơ bản. Phương pháp giảng dạy dễ hiểu, phù hợp với học sinh mới bắt đầu.",
        education: "Cử nhân Khoa học Máy tính",
        experience: "10 năm giảng dạy",
        languages: "Tiếng Việt, Tiếng Anh",
        formats: "Tại nhà / Online",
        lat: 17.9753,
        lng: 108.2532,
        tags: ["lap_trinh"]
    },
    {
        id: "tutor_04",
        name: "Trần Thanh Tuyến",
        subtitle: "Giảng viên trung học • Lập trình cơ bản",
        avatar: "https://i.pravatar.cc/300?img=7",
        price: "100k / buổi",
        bio: "Giảng viên trung học với hơn 10 năm kinh nghiệm giảng dạy lập trình cơ bản. Phương pháp giảng dạy dễ hiesy, phù hợp với học sinh mới bắt đau.",
        education: "Cử nhân Khoa học Máy tính",
        experience: "10 năm giảng dạy",
        languages: "Tiếng Việt, Tiếng Anh",
        formats: "Tại nhà / Online",
        lat: 11.9753,    
        lng: 108.2532,
        tags: ["lap_trinh"]
    },
    {
        id: "tutor_05",
        name: "Phạm Thị Hồng",
        subtitle: "Giảng viên trung học • Lập trình cơ bản",
        avatar: "https://i.pravatar.cc/300?img=8",
        price: "100k / buổi",
        bio: "Giảng viên trung học với hơn 10 năm kinh nghiệm giảng dạy lập trình cơ bản. Phương pháp giảng dạy dễ hiesy, phù hợp với học sinh mới bắt đau.",
        education: "Cử nhân Khoa học Máy tính",
        experience: "10 năm giảng dạy",
        languages: "Tiếng Việt, Tiếng Anh",
        formats: "Tại nhà / Online",
        lat: 15.9753,    
        lng: 107.2532,
        tags: ["lap_trinh"]
    },
    {
        id: "tutor_06",
        name: "Trần Văn Hiếu",
        subtitle: "Giảng viên Đại học • Toán cao cấp & Đại số tuyến tính",
        avatar: "https://i.pravatar.cc/300?img=11",
        price: "150k / buổi",
        bio: "Thạc sĩ Toán học, chuyên hỗ trợ sinh viên năm nhất vượt qua các môn Toán đại cương và Calculus 1 với phương pháp giải bài tập thực chiến.",
        education: "Thạc sĩ Toán học Ứng dụng",
        experience: "5 năm giảng dạy đại học",
        languages: "Tiếng Việt, Tiếng Anh",
        formats: "Tại nhà / Online",
        lat: 16.0601,    
        lng: 108.2154,
        tags: ["toan_hoc", "dai_hoc"]
    },
    {
        id: "tutor_07",
        name: "Nguyễn Lê Vy",
        subtitle: "Gia sư Ngoại ngữ • Tiếng Anh giao tiếp A1-A2",
        avatar: "https://i.pravatar.cc/300?img=12",
        price: "120k / buổi",
        bio: "Giúp bạn lấy lại gốc Tiếng Anh nhanh chóng, tự tin giao tiếp và thuyết trình tiếng Anh với lộ trình thiết kế riêng cho từng người.",
        education: "Cử nhân Ngôn ngữ Anh",
        experience: "3 năm gia sư",
        languages: "Tiếng Anh, Tiếng Việt",
        formats: "Online / Quán Cafe",
        lat: 16.0723,    
        lng: 108.2230,
        tags: ["ngoai_ngu", "tieng_anh"]
    },
    {
        id: "tutor_08",
        name: "Lê Minh Tuấn",
        subtitle: "Software Engineer • Lập trình Java & OOP",
        avatar: "https://i.pravatar.cc/300?img=13",
        price: "200k / buổi",
        bio: "Kỹ sư phần mềm đang làm việc tại FPT. Chuyên hướng dẫn làm đồ án môn học, Lập trình hướng đối tượng (OOP) và JavaFX.",
        education: "Kỹ sư Kỹ thuật phần mềm",
        experience: "4 năm làm việc thực tế",
        languages: "Tiếng Việt",
        formats: "Online",
        lat: 16.0512,    
        lng: 108.2011,
        tags: ["lap_trinh", "java", "oop"]
    },
    {
        id: "tutor_09",
        name: "Hoàng Trọng Khang",
        subtitle: "Trợ giảng • C++ & Cấu trúc dữ liệu",
        avatar: "https://i.pravatar.cc/300?img=14",
        price: "100k / buổi",
        bio: "Có kinh nghiệm tham gia các kỳ thi học sinh giỏi Tin học. Dạy kèm C++, Data Structures & Algorithms từ cơ bản đến nâng cao.",
        education: "Sinh viên năm cuối",
        experience: "2 năm trợ giảng",
        languages: "Tiếng Việt, Tiếng Anh",
        formats: "Tại nhà / Quán Cafe",
        lat: 15.9780,    
        lng: 108.2510,
        tags: ["lap_trinh", "c_plus_plus", "ctdl"]
    },
    {
        id: "tutor_10",
        name: "Nguyễn Đình Sơn",
        subtitle: "Huấn luyện viên võ thuật • Karate",
        avatar: "https://i.pravatar.cc/300?img=15",
        price: "250k / tháng",
        bio: "Nhận dạy kèm võ Karate tự vệ cơ bản cho học sinh, sinh viên giúp nâng cao sức khỏe và rèn luyện tính kỷ luật.",
        education: "Huyền đai đệ nhị đẳng",
        experience: "7 năm huấn luyện",
        languages: "Tiếng Việt",
        formats: "Tại phòng tập / Công viên",
        lat: 16.0421,    
        lng: 108.2205,
        tags: ["the_thao", "karate"]
    },
    {
        id: "tutor_11",
        name: "Phạm Thu Hương",
        subtitle: "Data Analyst • Python & Khoa học Dữ liệu",
        avatar: "https://i.pravatar.cc/300?img=16",
        price: "250k / buổi",
        bio: "Hướng dẫn phân tích dữ liệu, làm quen với Python, Pandas, Numpy và vẽ biểu đồ trực quan hóa dữ liệu.",
        education: "Thạc sĩ Khoa học Dữ liệu",
        experience: "4 năm trong ngành Data",
        languages: "Tiếng Anh, Tiếng Việt",
        formats: "Online",
        lat: 16.0689,    
        lng: 108.1892,
        tags: ["data_science", "python", "lap_trinh"]
    },
    {
        id: "tutor_12",
        name: "Trương Tuấn Anh",
        subtitle: "Product Designer • UI/UX Design",
        avatar: "https://i.pravatar.cc/300?img=17",
        price: "180k / buổi",
        bio: "Chia sẻ kinh nghiệm thiết kế giao diện ứng dụng/web thực tế trên Figma, tư vấn làm portfolio cho người mới bắt đầu.",
        education: "Cử nhân Thiết kế Mỹ thuật số",
        experience: "3 năm kinh nghiệm",
        languages: "Tiếng Việt",
        formats: "Tại nhà / Online",
        lat: 16.0815,    
        lng: 108.2415,
        tags: ["thiet_ke", "ui_ux"]
    },
    {
        id: "tutor_13",
        name: "Bùi Thị Mai",
        subtitle: "Frontend Developer • HTML/CSS/JS",
        avatar: "https://i.pravatar.cc/300?img=18",
        price: "150k / buổi",
        bio: "Chuyên kèm code web giao diện tĩnh và động cơ bản. Phù hợp cho các bạn muốn build UI/UX cho đồ án cá nhân.",
        education: "Cao đẳng CNTT",
        experience: "2 năm làm việc",
        languages: "Tiếng Việt",
        formats: "Online / Tại nhà",
        lat: 16.0354,    
        lng: 108.2148,
        tags: ["lap_trinh", "web_dev"]
    },
    {
        id: "tutor_14",
        name: "Đặng Văn Nam",
        subtitle: "Giảng viên • Vật lý Đại cương",
        avatar: "https://i.pravatar.cc/300?img=19",
        price: "130k / buổi",
        bio: "Dạy bám sát giáo trình Vật lý đại cương của các trường khối kỹ thuật. Giải thích hiện tượng trực quan, dễ hiểu.",
        education: "Thạc sĩ Vật lý",
        experience: "6 năm giảng dạy",
        languages: "Tiếng Việt",
        formats: "Tại nhà",
        lat: 16.0755,    
        lng: 108.1523,
        tags: ["vat_ly", "dai_hoc"]
    },
    {
        id: "tutor_15",
        name: "Đinh Tấn Phát",
        subtitle: "Database Admin • MySQL & SQL Server",
        avatar: "https://i.pravatar.cc/300?img=20",
        price: "180k / buổi",
        bio: "Hỗ trợ thiết kế cơ sở dữ liệu cho đồ án (như quản lý bệnh viện, khách sạn), tối ưu hóa câu truy vấn SQL.",
        education: "Cử nhân Hệ thống Thông tin",
        experience: "5 năm quản trị CSDL",
        languages: "Tiếng Việt",
        formats: "Online / Quán Cafe",
        lat: 16.0123,    
        lng: 108.2456,
        tags: ["lap_trinh", "database", "mysql"]
    },
    {
        id: "tutor_16",
        name: "Lương Thị Kiều",
        subtitle: "Founder • Khởi nghiệp & Lập kế hoạch",
        avatar: "https://i.pravatar.cc/300?img=21",
        price: "300k / buổi",
        bio: "Cố vấn định hướng dự án khởi nghiệp sinh viên, lập kế hoạch kinh doanh và xây dựng mô hình Canvas.",
        education: "MBA Quản trị Kinh doanh",
        experience: "Sáng lập 2 startup",
        languages: "Tiếng Việt, Tiếng Anh",
        formats: "Online",
        lat: 16.0654,    
        lng: 108.2211,
        tags: ["startup", "kinh_doanh"]
    },
    {
        id: "tutor_17",
        name: "Hồ Bá Lộc",
        subtitle: "Nghệ sĩ tự do • Thanh nhạc & Piano",
        avatar: "https://i.pravatar.cc/300?img=22",
        price: "200k / buổi",
        bio: "Nhận dạy đệm hát Piano cơ bản và thanh nhạc, đặc biệt các bài hát US-UK pop nhẹ nhàng.",
        education: "Cử nhân Thanh nhạc",
        experience: "8 năm biểu diễn",
        languages: "Tiếng Việt",
        formats: "Tại phòng tập nhạc",
        lat: 16.0488,    
        lng: 108.2355,
        tags: ["am_nhac", "piano"]
    },
    {
        id: "tutor_18",
        name: "Vũ Hà Linh",
        subtitle: "Designer • Thiết kế Canva & PTS",
        avatar: "https://i.pravatar.cc/300?img=23",
        price: "100k / buổi",
        bio: "Hướng dẫn tư duy thẩm mỹ, thiết kế slide thuyết trình, poster sự kiện nhanh chóng và chuyên nghiệp bằng Canva.",
        education: "Tự học",
        experience: "3 năm Freelance Designer",
        languages: "Tiếng Việt",
        formats: "Online / Tại nhà",
        lat: 16.0712,    
        lng: 108.2198,
        tags: ["thiet_ke", "canva", "đồ_họa"]
    },
    {
        id: "tutor_19",
        name: "Thái Văn Quyết",
        subtitle: "Trainer • Kỹ năng mềm & Thuyết trình",
        avatar: "https://i.pravatar.cc/300?img=24",
        price: "150k / buổi",
        bio: "Huấn luyện kỹ năng nói trước đám đông, viết kịch bản MC và quản lý thời gian hiệu quả cho sinh viên.",
        education: "Cử nhân Tâm lý học",
        experience: "4 năm đào tạo",
        languages: "Tiếng Việt",
        formats: "Online / Tại nhà",
        lat: 15.9810,    
        lng: 108.2580,
        tags: ["ky_nang_mem", "thuyet_trinh"]
    },
    {
        id: "tutor_20",
        name: "Ngô Khắc Duy",
        subtitle: "Kỹ sư Mạng • Quản trị Mạng & Bảo mật",
        avatar: "https://i.pravatar.cc/300?img=25",
        price: "220k / buổi",
        bio: "Dạy cấu hình mạng LAN/WAN, giải đáp đồ án mạng máy tính và hướng dẫn nhập môn an toàn thông tin.",
        education: "Kỹ sư Mạng máy tính",
        experience: "6 năm làm việc",
        languages: "Tiếng Việt",
        formats: "Tại nhà / Online",
        lat: 16.0598,    
        lng: 108.2301,
        tags: ["mang_may_tinh", "bao_mat"]
    },
    {
        id: "tutor_21",
        name: "Vũ Quốc Đạt",
        subtitle: "Senior Data Scientist • Machine Learning & Python",
        avatar: "https://i.pravatar.cc/300?img=26",
        price: "350k / buổi",
        bio: "Chuyên gia dữ liệu với kinh nghiệm xây dựng mô hình AI thực tế. Nhận hướng dẫn sinh viên làm đồ án tốt nghiệp về Machine Learning, Deep Learning bằng Python.",
        education: "Thạc sĩ Trí tuệ Nhân tạo",
        experience: "6 năm làm việc",
        languages: "Tiếng Việt, Tiếng Anh",
        formats: "Online / Tại nhà",
        lat: 21.0360,    
        lng: 105.7816,
        tags: ["data_science", "python", "machine_learning"]
    },
    {
        id: "tutor_22",
        name: "Nguyễn Thu Trang",
        subtitle: "Art Director • Thiết kế Đồ họa & Figma",
        avatar: "https://i.pravatar.cc/300?img=27",
        price: "250k / buổi",
        bio: "Giúp bạn làm chủ các công cụ thiết kế chuyên nghiệp như Figma, Illustrator. Hướng dẫn tư duy bố cục, màu sắc và xây dựng Portfolio ấn tượng xin việc.",
        education: "Cử nhân Thiết kế Đồ họa",
        experience: "7 năm kinh nghiệm",
        languages: "Tiếng Việt",
        formats: "Online",
        lat: 21.0153,    
        lng: 105.8234,
        tags: ["thiet_ke", "ui_ux", "do_hoa"]
    },
    {
        id: "tutor_23",
        name: "Bùi Tiến Dũng",
        subtitle: "Chuyên gia Thuật toán • Lập trình thi đấu & C++",
        avatar: "https://i.pravatar.cc/300?img=28",
        price: "200k / buổi",
        bio: "Từng đạt giải Quốc gia môn Tin học. Nhận ôn thi ICPC, Olympic Tin học và luyện thuật toán phỏng vấn vào các tập đoàn công nghệ lớn (LeetCode, HackerRank).",
        education: "Kỹ sư Khoa học Máy tính",
        experience: "4 năm giảng dạy",
        languages: "Tiếng Việt",
        formats: "Tại nhà / Quán Cafe",
        lat: 21.0063,    
        lng: 105.8427,
        tags: ["lap_trinh", "c_plus_plus", "thuat_toan"]
    },
    {
        id: "tutor_24",
        name: "Đào Ngọc Yến",
        subtitle: "Giảng viên IELTS • Tiếng Anh Giao tiếp & Học thuật",
        avatar: "https://i.pravatar.cc/300?img=29",
        price: "180k / buổi",
        bio: "Sở hữu IELTS 8.5. Nhận kèm riêng 1-1 các kỹ năng Speaking và Writing, sửa phát âm chuẩn và luyện phản xạ giao tiếp tự nhiên trong môi trường công sở.",
        education: "Cử nhân Ngôn ngữ Anh xuất sắc",
        experience: "5 năm luyện thi",
        languages: "Tiếng Anh, Tiếng Việt",
        formats: "Tại nhà / Online",
        lat: 21.0285,    
        lng: 105.8542,
        tags: ["ngoai_ngu", "tieng_anh", "ielts"]
    },
    {
        id: "tutor_25",
        name: "Lê Hoàng Long",
        subtitle: "Chuyên gia Cố vấn • Khởi nghiệp & Quản trị rủi ro",
        avatar: "https://i.pravatar.cc/300?img=30",
        price: "400k / buổi",
        bio: "Mentor cho nhiều dự án sinh viên khởi nghiệp. Tư vấn cách gọi vốn, quản lý tài chính và xây dựng mô hình kinh doanh tinh gọn (Lean Startup).",
        education: "Thạc sĩ Tài chính & Quản trị",
        experience: "10 năm làm doanh nghiệp",
        languages: "Tiếng Việt, Tiếng Anh",
        formats: "Online",
        lat: 20.9937,    
        lng: 105.8055,
        tags: ["startup", "kinh_doanh", "tai_chinh"]
    },
    {
        id: "tutor_26",
        name: "Phan Minh Khôi",
        subtitle: "Tech Lead • Lập trình Backend Java & Spring Boot",
        avatar: "https://i.pravatar.cc/300?img=31",
        price: "300k / buổi",
        bio: "Hướng dẫn xây dựng hệ thống Backend thực tế bằng Java Spring Boot, Microservices, tích hợp API cho các dự án lớn. Code review và tối ưu hiệu suất.",
        education: "Kỹ sư Phần mềm",
        experience: "8 năm làm việc thực tế",
        languages: "Tiếng Việt",
        formats: "Online / Tại nhà",
        lat: 10.7769,    
        lng: 106.7009,
        tags: ["lap_trinh", "java", "backend"]
    },
    {
        id: "tutor_27",
        name: "Trần Thanh Thúy",
        subtitle: "Huấn luyện viên • Võ tự vệ & Taekwondo",
        avatar: "https://i.pravatar.cc/300?img=32",
        price: "200k / buổi",
        bio: "Huyền đai 3 đẳng Taekwondo. Cung cấp các khóa học võ tự vệ thực chiến ngắn hạn cho nữ giới và các bạn sinh viên muốn rèn luyện thể lực.",
        education: "Đại học Thể dục Thể thao",
        experience: "5 năm huấn luyện",
        languages: "Tiếng Việt",
        formats: "Tại phòng tập",
        lat: 10.7845,    
        lng: 106.6853,
        tags: ["the_thao", "vo_thuat", "taekwondo"]
    },
    {
        id: "tutor_28",
        name: "Võ Trọng Nghĩa",
        subtitle: "Tiến sĩ Toán học • Xác suất thống kê & Đại số",
        avatar: "https://i.pravatar.cc/300?img=33",
        price: "250k / buổi",
        bio: "Dạy bù kiến thức, ôn thi cuối kỳ cấp tốc các môn Toán Đại học khó nhằn như Xác suất thống kê, Đại số tuyến tính, Phương trình vi phân.",
        education: "Tiến sĩ Toán học",
        experience: "12 năm giảng dạy",
        languages: "Tiếng Việt",
        formats: "Tại nhà / Online",
        lat: 10.7725,    
        lng: 106.6675,
        tags: ["toan_hoc", "dai_hoc"]
    },
    {
        id: "tutor_29",
        name: "Đỗ Phương Thảo",
        subtitle: "Data Engineer • Thiết kế CSDL & Tối ưu SQL",
        avatar: "https://i.pravatar.cc/300?img=34",
        price: "220k / buổi",
        bio: "Đào tạo kỹ năng Database chuyên sâu: Thiết kế Schema chuẩn, viết query phức tạp, tối ưu hóa Index trên MySQL, PostgreSQL và SQL Server.",
        education: "Cử nhân Hệ thống Thông tin",
        experience: "5 năm làm Data Engineer",
        languages: "Tiếng Việt",
        formats: "Online / Quán Cafe",
        lat: 10.8016,    
        lng: 106.6558,
        tags: ["lap_trinh", "database", "sql"]
    },
    {
        id: "tutor_30",
        name: "Ngô Quốc Bảo",
        subtitle: "Diễn giả • Nghệ thuật Thuyết trình & Lãnh đạo",
        avatar: "https://i.pravatar.cc/300?img=35",
        price: "200k / buổi",
        bio: "Giúp bạn đập tan nỗi sợ đám đông. Hướng dẫn kỹ năng xây dựng bài pitch deck, nghệ thuật kể chuyện (Storytelling) và phong thái tự tin khi thuyết trình.",
        education: "Thạc sĩ Quản trị Kinh doanh",
        experience: "6 năm diễn giả",
        languages: "Tiếng Việt, Tiếng Anh",
        formats: "Online / Tại trung tâm",
        lat: 10.8105,    
        lng: 106.7091,
        tags: ["ky_nang_mem", "thuyet_trinh", "lanh_dao"]
    }
];
function initMap() {
    if (!document.getElementById('map')) return;
    map = L.map('map').setView([16.0544, 108.2022], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    map.on('click', function() {
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
            if(currentOpenTutorId === tutor.id) {
                closeTutorProfile();
            } else {
                openTutorProfile(tutor);
            }
        });
    });
}
function initFilter() {
    const filterSelect = document.getElementById('subjectFilter');
    if(!filterSelect) return;
    filterSelect.addEventListener('change', (e) => {
        const selectedSubject = e.target.value;
        if(selectedSubject === "all") {
            renderTutorsOnMap(mockTutors);
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
    document.getElementById('languages').textContent = tutorData.languages;
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
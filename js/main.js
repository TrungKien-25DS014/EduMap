var map = L.map('map').setView([16.047, 108.206], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
const locations = [
    { name: "Trung tâm IELTS Hà Nội", lat: 21.0285, lng: 105.8542, info: "Chuyên luyện SAT/IELTS cấp tốc" },
    { name: "Gia sư Đà Nẵng", lat: 16.047, lng: 108.206, info: "Đối tác hạng Vàng" },
    { name: "Lò luyện thi HCM", lat: 10.8231, lng: 106.6297, info: "Cam kết đầu ra 7.5+" }
];
locations.forEach(loc => {
    var marker = L.circleMarker([loc.lat, loc.lng], {
        radius: 10,
        fillColor: "#2C74B3",
        color: "#FFFFFF",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
    }).addTo(map);
    marker.bindPopup(`
        <div style="color: #0A2647; font-family: sans-serif;">
            <strong style="font-size: 16px;">${loc.name}</strong><br>
            <p style="color: #444; margin: 8px 0;">${loc.info}</p>
            <button style="background: #2C74B3; border: none; padding: 6px 12px; color: white; cursor: pointer; border-radius: 5px; width: 100%;">Xem chi tiết</button>
        </div>
    `);
});
// ================= MAP =================

const map = L.map('map').setView([16.0471, 108.2068], 13);

// TILE LAYER

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; OpenStreetMap'
    }
).addTo(map);

// CUSTOM ICON

const tutorIcon = L.icon({
    iconUrl:
        'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',

    iconSize: [45, 45],
    iconAnchor: [22, 45],
    popupAnchor: [0, -40]
});

// DATA

const tutors = [

    {
        name: "Nguyễn Văn A",
        subject: "Toán - Lý",
        area: "Hải Châu",
        lat: 16.0471,
        lng: 108.2068,
        avatar: "https://i.pravatar.cc/150?u=11"
    },

    {
        name: "Trần Thị B",
        subject: "IELTS",
        area: "Thanh Khê",
        lat: 16.0555,
        lng: 108.2200,
        avatar: "https://i.pravatar.cc/150?u=22"
    },

    {
        name: "Lê Minh C",
        subject: "Lập trình Web",
        area: "Sơn Trà",
        lat: 16.0678,
        lng: 108.2310,
        avatar: "https://i.pravatar.cc/150?u=33"
    },

    {
        name: "Phạm Quốc D",
        subject: "Tiếng Anh",
        area: "Ngũ Hành Sơn",
        lat: 16.0350,
        lng: 108.2400,
        avatar: "https://i.pravatar.cc/150?u=44"
    }

];

// ADD MARKERS

tutors.forEach(tutor => {

    L.marker(
        [tutor.lat, tutor.lng],
        { icon: tutorIcon }
    )
    .addTo(map)
    .bindPopup(`

        <div class="popup-card">

            <img src="${tutor.avatar}">

            <h3>${tutor.name}</h3>

            <p>${tutor.subject}</p>

            <p>${tutor.area}</p>

        </div>

    `);

});

// USER LOCATION

if(navigator.geolocation){

    navigator.geolocation.getCurrentPosition(position => {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        L.marker([lat, lng])
            .addTo(map)
            .bindPopup("Bạn đang ở đây")
            .openPopup();

    });

}
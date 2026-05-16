// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCsEaurl1G04kTJt7XmsAGw2CxBxnbDdrA",
  authDomain: "hybridmeshalert.firebaseapp.com",
  databaseURL: "https://hybridmeshalert-default-rtdb.firebaseio.com",
  projectId: "hybridmeshalert",
  storageBucket: "hybridmeshalert.appspot.com",
  messagingSenderId: "596304767271",
  appId: "1:596304767271:web:0b88d012ca4ba944e9a102",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ✅ Initialize map
const map = L.map("map").setView([20.5937, 78.9629], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// 🔴 Show SOS alerts
db.ref("sos_alerts").on("child_added", (snapshot) => {
  const data = snapshot.val();
  if (!data) return;
  L.marker([data.latitude, data.longitude], {
    icon: L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/463/463574.png",
      iconSize: [32, 32],
    })
  }).addTo(map)
  .bindPopup(`<b>🚨 SOS Alert</b><br>Needs: ${data.needs}<br>Time: ${new Date(data.timestamp).toLocaleString()}`);
});

// 🟢 Show Volunteers
db.ref("volunteers").on("child_added", (snapshot) => {
  const v = snapshot.val();
  if (!v) return;
  L.marker([v.latitude, v.longitude], {
    icon: L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/1483/1483336.png",
      iconSize: [32, 32],
    })
  }).addTo(map)
  .bindPopup(`🟢 <b>${v.name}</b><br>📞 ${v.phone}<br>Joined: ${v.timestamp}`);
});

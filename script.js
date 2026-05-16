// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsEaurl1G04kTJt7XmsAGw2CxBxnbDdrA",
  authDomain: "hybridmeshalert.firebaseapp.com",
  databaseURL: "https://hybridmeshalert-default-rtdb.firebaseio.com",
  projectId: "hybridmeshalert",
  storageBucket: "hybridmeshalert.appspot.com",
  messagingSenderId: "596304767271",
  appId: "1:596304767271:web:0b88d012ca4ba944e9a102",
  measurementId: "G-W5D69TZFSS"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ✅ Initialize Map
const map = L.map("map").setView([20.5937, 78.9629], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// ✅ DOM elements
const sosBtn = document.getElementById("sosBtn");
const statusText = document.getElementById("sos-status");

// ✅ SOS Button Click Event
sosBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported!");
    return;
  }

  sosBtn.disabled = true;
  sosBtn.textContent = "Fetching location...";
  statusText.textContent = "";

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const needs = [];
      if (document.getElementById("needFood").checked) needs.push("Food");
      if (document.getElementById("needWater").checked) needs.push("Water");
      if (document.getElementById("needMedical").checked) needs.push("Medical Aid");
      if (document.getElementById("needShelter").checked) needs.push("Shelter");
      if (document.getElementById("needEvac").checked) needs.push("Evacuation");

      const sosData = {
        latitude: lat,
        longitude: lng,
        needs: needs.length ? needs.join(", ") : "General Help Needed",
        timestamp: new Date().toISOString(),
      };

      database.ref("sos_alerts").push(sosData)
        .then(() => {
          sosBtn.textContent = "✅ SOS Sent!";
          statusText.textContent = "Alert successfully sent!";
          L.marker([lat, lng], { icon: L.icon({
            iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            iconSize: [40, 40]
          })})
            .addTo(map)
            .bindPopup(`<b>SOS Alert!</b><br>${sosData.needs}<br>${new Date().toLocaleString()}`)
            .openPopup();
          map.setView([lat, lng], 13);
          setTimeout(() => {
            sosBtn.textContent = "🚨 SEND SOS";
            sosBtn.disabled = false;
            statusText.textContent = "";
          }, 3000);
        })
        .catch(() => {
          alert("Failed to send SOS!");
          sosBtn.textContent = "🚨 SEND SOS";
          sosBtn.disabled = false;
        });
    },
    (err) => {
      alert("Unable to get location: " + err.message);
      sosBtn.textContent = "🚨 SEND SOS";
      sosBtn.disabled = false;
    }
  );
});

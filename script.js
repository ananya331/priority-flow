
const lanes = ["north", "south", "east", "west"];
let currentIndex = 0;
let intervalId = null;
let map;
let emergencyMarker;

window.onload = () => {
  startNormalCycle();

  map = L.map('map').setView([28.6139, 77.2090], 13); // Default view

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
};

function setLight(activeLane) {
  lanes.forEach(lane => {
    const light = document.getElementById(`light-${lane}`);
    const laneBox = document.getElementById(`lane-${lane}`);

    if (lane === activeLane) {
      light.classList.add("green");
      light.classList.remove("red");
      laneBox.classList.add("active");
    } else {
      light.classList.remove("green");
      light.classList.add("red");
      laneBox.classList.remove("active");
    }
  });
}

function startNormalCycle() {
  document.getElementById("emergencyBanner").style.display = "none";
  clearInterval(intervalId);
  currentIndex = 0;
  setLight(lanes[currentIndex]);
  intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % lanes.length;
    setLight(lanes[currentIndex]);
  }, 4000);
}

function simulateEmergency(lane) {
  clearInterval(intervalId);
  document.getElementById("emergencyBanner").style.display = "block";
  setLight(lane);

  document.getElementById("siren-sound")?.play();
  document.getElementById(`voice-${lane}`)?.play();

  const coords = {
    north: [28.625, 77.209],
    south: [28.602, 77.209],
    east: [28.6139, 77.222],
    west: [28.6139, 77.195]
  };

  if (map) {
    if (emergencyMarker) map.removeLayer(emergencyMarker);
    emergencyMarker = L.marker(coords[lane]).addTo(map)
      .bindPopup(`🚨 Emergency at ${lane.toUpperCase()} lane`).openPopup();
    map.setView(coords[lane], 15);
  }

  const logs = JSON.parse(localStorage.getItem("emergencyLogs")) || [];
  logs.push({ direction: lane, timestamp: new Date().toISOString() });
  localStorage.setItem("emergencyLogs", JSON.stringify(logs));
}

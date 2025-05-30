const lanes = ["north", "south", "east", "west"];
let currentIndex = 0;
let intervalId = null;
let map;
let emergencyMarker;

window.onload = () => {
  startNormalCycle();

  map = L.map('map').setView([22.5726, 88.3639], 13); // Kolkata

  // Base tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Live traffic tile layer (optional)
  L.tileLayer('https://{s}.tile.opentrafficmap.xyz/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenTrafficMap contributors'
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
}

// --- AI-Based Routing Logic ---

function generateTrafficData() {
  return {
    north: Math.random(),
    south: Math.random(),
    east: Math.random(),
    west: Math.random()
  };
}

function getBestLane(traffic) {
  return Object.keys(traffic).reduce((best, lane) =>
    traffic[lane] < traffic[best] ? lane : best
  );
}

function simulateAIPriority() {
  const trafficData = generateTrafficData();
  const bestLane = getBestLane(trafficData);
  console.log("AI Selected Lane:", bestLane, trafficData);
  simulateEmergency(bestLane);
}

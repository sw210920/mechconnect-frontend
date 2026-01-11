// -------- LOAD USER FROM LOCAL STORAGE --------
const user = JSON.parse(localStorage.getItem("mc_user"));

if (!user) {
    window.location.href = "./signIn.html";
}

document.getElementById("userName").innerText = user.name;


// -------- GREETING --------
const hour = new Date().getHours();
let greeting = "Welcome";

if (hour < 12) greeting = "Good Morning";
else if (hour < 18) greeting = "Good Afternoon";
else greeting = "Good Evening";

document.getElementById("greetingText").innerText = greeting;


// -------- RECENT BOOKINGS --------
const bookings = JSON.parse(localStorage.getItem("mc_bookings")) || [];

const recentBox = document.getElementById("recentBookings");

if (bookings.length === 0) {
    recentBox.innerHTML = "<p class='empty'>No recent bookings.</p>";
} else {
    recentBox.innerHTML = bookings.slice(-3).map(b => `
        <div class="recent-item">
            <strong>${b.service}</strong>
            <p>${b.date} • ${b.mechanic}</p>
        </div>
    `).join("");
}


// -------- MECHANIC RECOMMENDATIONS --------
const mechanics = [
    { name: "Rajesh AutoCare", rating: 4.8, location: "Pune" },
    { name: "Sharma Bike Repair", rating: 4.7, location: "Mumbai" },
    { name: "SpeedFix Garage", rating: 4.9, location: "Nagpur" }
];

document.getElementById("mechGrid").innerHTML =
    mechanics.map(m => `
      <div class="mech-card">
          <h4>${m.name}</h4>
          <p>⭐ ${m.rating}</p>
          <p>${m.location}</p>
      </div>
    `).join("");

    
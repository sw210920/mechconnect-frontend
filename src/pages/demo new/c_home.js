// Load user from localStorage
const user = JSON.parse(localStorage.getItem("mc_user")) || null;

// Redirect if not logged in
if (!user) {
    window.location.href = "./signIn.html";
}

// Greeting logic
const hour = new Date().getHours();
let greeting = "Welcome";

if (hour < 12) greeting = "Good Morning";
else if (hour < 18) greeting = "Good Afternoon";
else greeting = "Good Evening";

document.getElementById("greetText").innerText = greeting;
document.getElementById("userName").innerText = user.name;

// Load recent bookings
const bookings = JSON.parse(localStorage.getItem("mc_bookings")) || [];

const recentBox = document.getElementById("recentBookings");

if (bookings.length === 0) {
    recentBox.innerHTML = "<p>No bookings found.</p>";
} else {
    recentBox.innerHTML = bookings.slice(-3).map(b => `
        <div class="recent-item">
            <strong>${b.service}</strong>
            <p>${b.date} — ${b.mechanic}</p>
        </div>
    `).join("");
}

// Recommended mechanics (static sample)
const mechanics = [
    { name: "Rajesh AutoCare", rating: 4.8, location: "Pune" },
    { name: "Sharma Bike Repair", rating: 4.7, location: "Mumbai" },
    { name: "SpeedFix Garage", rating: 4.9, location: "Nagpur" }
];

document.getElementById("mechGrid").innerHTML = mechanics.map(m => `
    <div class="mech-card">
        <h4>${m.name}</h4>
        <p>⭐ ${m.rating}</p>
        <p>${m.location}</p>
    </div>
`).join("");

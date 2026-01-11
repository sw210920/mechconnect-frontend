// -------------------------------
// FETCH LOGGED-IN MECHANIC
// -------------------------------
const user = JSON.parse(localStorage.getItem("mc_user"));

if (!user || user.role !== "mechanic") {
    window.location.href = "../signIn.html";
}

const mechanicId = user.id; // mechanicId from localStorage
     





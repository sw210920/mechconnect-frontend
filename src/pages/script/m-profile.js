// ===============================
// AUTH GUARD — CHECK LOGIN
// ===============================
const user = JSON.parse(localStorage.getItem("mc_user"));

if (!user || user.role !== "mechanic" || !user.mechanicId) {
    console.warn("Not logged in as mechanic → redirecting");
    window.location.href = "../signIn.html";
}

const mechanicId = user.mechanicId;

// ===============================
// DOM ELEMENTS
// ===============================
const form = document.getElementById("mechanicProfileForm");
const fields = form.querySelectorAll("input, textarea, select");

const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const locationInput = document.getElementById("location");
    
const currentPassword = document.getElementById("currentPassword");
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

// ===============================
// UI HELPERS
// ===============================
function disableEditing() {
    fields.forEach(f => f.disabled = true);
    editBtn.style.display = "inline-block";
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
}

function enableEditing() {
    fields.forEach(f => f.disabled = false);
    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";
}

// ===============================
// LOAD MECHANIC PROFILE
// ===============================
async function loadProfile() {
    try {
        console.log("Loading mechanic profile:", mechanicId);

        // 🔴 FIXED ENDPOINT (must exist in backend)
        const res = await fetch(`http://localhost:6060/api/mechanic/${mechanicId}/profile`);

        if (!res.ok) {
            throw new Error("Profile fetch failed");
        }

        const data = await res.json();
        console.log("Mechanic data received:", data);

        // Map backend fields → form fields
        document.getElementById("firstName").value = data.firstName || "";
        document.getElementById("lastName").value = data.lastName || "";
        document.getElementById("email").value = data.email || "";
        document.getElementById("phone").value = data.mobailNumber || "";
        document.getElementById("experience").value = data.yearsOfExperience || "";
        document.getElementById("specialization").value = data.specialization || "";
        document.getElementById("location").value = data.serviceLocation || "";
        document.getElementById("certifications").value = data.certifications || "";
        document.getElementById("bio").value = data.bio || "";

        disableEditing();
    } catch (err) {
        console.error("Load profile error:", err);
        alert("Unable to load profile");
    }
}

loadProfile();

// ===============================
// BUTTON HANDLERS
// ===============================
editBtn.addEventListener("click", enableEditing);

cancelBtn.addEventListener("click", () => {
    disableEditing();
    loadProfile();
});

// ===============================
// SAVE PROFILE
// ===============================
form.addEventListener("submit", async e => {
    e.preventDefault();

    const updatedData = {
        mechanicId, // 🔴 IMPORTANT
        firstName: firstName.value,
        lastName: lastName.value,
        mobailNumber: phone.value,
        yearsOfExperience: experience.value,
        specialization: specialization.value,
        serviceLocation: locationInput.value,

        certifications: certifications.value,
        bio: bio.value
    };

            console.log("UPDATE PAYLOAD:", updatedData);

    try {
        const res = await fetch(`http://localhost:6060/api/mechanic/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        if (!res.ok) throw new Error("Update failed");
            
        alert("Profile updated successfully");
        disableEditing();
        loadProfile();
    } catch (err) {
        console.error("Update error:", err);
        alert("Failed to update profile");
    }
});

// ===============================
// CHANGE PASSWORD
// ===============================
document.getElementById("changePasswordForm").addEventListener("submit", async e => {
    e.preventDefault();

    if (!currentPassword.value || !newPassword.value || newPassword.value !== confirmPassword.value) {
        alert("Password validation failed");
        return;
    }

    try {
        const res = await fetch(`http://localhost:6060/api/mechanic/change-password`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mechanicId,
                oldPassword: currentPassword.value,
                newPassword: newPassword.value
            })
        });

        if (!res.ok) throw new Error("Password change failed");

        alert("Password updated");
        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";
    } catch (err) {
        console.error(err);
        alert("Incorrect current password");
    }
});

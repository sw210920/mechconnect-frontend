// -------------------------------------------------------------
// CUSTOMER PROFILE PAGE — Dynamic Data Load, Edit & Password Update
// -------------------------------------------------------------

console.log("%c[c-profile] loaded", "color:#3b82f6; font-weight:bold;");

// 1️⃣ Get logged-in user
const sessionUser = JSON.parse(localStorage.getItem("mc_user"));

if (!sessionUser || !sessionUser.customerId) {
    window.location.href = "../pages/signIn.html";
}

// Store ID safely
const customerId = sessionUser.customerId;

// -------------------------------------------------------------
// DOM elements
// -------------------------------------------------------------
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const phoneField = document.getElementById("phone");
const addressField = document.getElementById("address");

const editBtn = document.getElementById("editProfile");
const saveBtn = document.getElementById("saveProfile");

// Password fields
const currentPassField = document.getElementById("currentPassword");
const newPassField = document.getElementById("newPassword");
const confirmPassField = document.getElementById("confirmPassword");
const changePassBtn = document.getElementById("changePasswordBtn");

// -------------------------------------------------------------
// 2️⃣ Load customer profile
// -------------------------------------------------------------
function loadProfile() {
    fetch(`http://localhost:6060/api/customer/profile/${customerId}`)
        .then(res => {
            if (!res.ok) throw new Error("Profile load failed");
            return res.json();
        })
        .then(data => {
            nameField.value = data.name || "";
            emailField.value = data.email || "";
            phoneField.value = data.phone || "";
            addressField.value = data.address || "";

            disableEditing();
            console.log("[c-profile] profile loaded");
        })
        .catch(err => {
            console.error("[c-profile] load error:", err);
            alert("Session expired. Please login again.");
            localStorage.removeItem("mc_user");
            window.location.href = "../pages/signIn.html";
        });
}

loadProfile();

// -------------------------------------------------------------
// 3️⃣ Disable editing (view mode)
// -------------------------------------------------------------
function disableEditing() {
    nameField.disabled = true;
    emailField.disabled = true;
    phoneField.disabled = true;
    addressField.disabled = true;

    saveBtn.style.display = "none";
    editBtn.style.display = "inline-flex";
}

// -------------------------------------------------------------
// 4️⃣ Enable editing
// -------------------------------------------------------------
function enableEditing() {
    nameField.disabled = false;
    phoneField.disabled = false;
    addressField.disabled = false;

    saveBtn.style.display = "inline-flex";
    editBtn.style.display = "none";
}

editBtn.addEventListener("click", enableEditing);

// -------------------------------------------------------------
// 5️⃣ Save profile
// -------------------------------------------------------------
saveBtn.addEventListener("click", () => {

    const updatedUser = {
        customerId: customerId,
        name: nameField.value.trim(),
        phone: phoneField.value.trim(),
        address: addressField.value.trim(),
        email: sessionUser.email
    };

    fetch("http://localhost:6060/api/customer/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser)
    })
    .then(res => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
    })
    .then(() => {
        alert("Profile updated successfully!");
        disableEditing();
    })
    .catch(err => {
        console.error("[c-profile] update error:", err);
        alert("Failed to update profile");
    });
});

// -------------------------------------------------------------
changePassBtn.addEventListener("click", () => {

    const oldPassword = currentPassField.value.trim();
    const newPassword = newPassField.value.trim();
    const confirmPassword = confirmPassField.value.trim();

    if (!oldPassword || !newPassword || !confirmPassword) {
        alert("All fields are required");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match");
        return;
    }

    const payload = {
        customerId: customerId,      // ✅ CORRECT
        oldPassword: oldPassword,    // ✅ CORRECT
        newPassword: newPassword     // ✅ CORRECT
    };

    fetch("http://localhost:6060/api/customer/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.text();
    })
    .then(msg => {
        alert(msg);
        currentPassField.value = "";
        newPassField.value = "";
        confirmPassField.value = "";
    })
    .catch(() => alert("Incorrect current password"));
})
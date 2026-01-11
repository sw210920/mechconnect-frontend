// ================= API CONFIG =================
const API_BASE = "http://localhost:6060/api/mechanic";

let mobileNumber = "";

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    showStep("step-mobile"); // ensure only first step is visible
});

// ================= SEND OTP =================
function sendOtp() {
    email = document.getElementById("email").value.trim();

    if (!email) {
        showMessage("Please enter Email Id");
        return;
    }

    fetch(`http://localhost:6060/api/mechanic/forgot-password/find-user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email })
    })
    .then(res => {
        if (!res.ok) throw new Error();
        showStep("step-otp");
        showMessage("OTP sent to your email id", "green");
    })
    .catch(() => {
        showMessage("Email Id not registered");
    });
}

// ================= VERIFY OTP =================
function verifyOtp() {
    const otp = document.getElementById("otp").value.trim();

    if (!otp) {
        showMessage("Please enter OTP");
        return;
    }

    fetch(`http://localhost:6060/api/mechanic/forgot-password/verify-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            otp: otp
        })
    })
    .then(res => {
        if (!res.ok) throw new Error();
        showStep("step-reset");
        showMessage("OTP verified successfully", "green");
    })
    .catch(() => {
        showMessage("Invalid or expired OTP");
    });
}

// ================= RESET PASSWORD =================
// ================= RESET PASSWORD =================
function resetPassword() {

    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // ✅ Validation
    if (!newPassword || !confirmPassword) {
        showMessage("Please fill all fields");
        return;
    }

    if (newPassword.length < 6) {
        showMessage("Password must be at least 6 characters");
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage("Passwords do not match");
        return;
    }

    // ✅ Call backend API
    fetch("http://localhost:6060/api/mechanic/forgot-password/reset-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,                // 🔐 verified email
            newPassword: newPassword     // 🔐 encrypted at backend
        })
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.text();
    })
    .then(msg => {
        alert(msg || "Password reset successful");
        window.location.href = "./signIn.html";
    })
    .catch(() => {
        showMessage("Password reset failed. Try again.");
    });
}



// ================= STEP HANDLER =================
function showStep(stepId) {
    document.querySelectorAll(".step")
        .forEach(step => step.classList.add("hidden"));

    const activeStep = document.getElementById(stepId);
    if (activeStep) {
        activeStep.classList.remove("hidden");
    }
}

// ================= MESSAGE HANDLER =================
function showMessage(message, color = "#dc3545") {
    const messageEl = document.getElementById("message");
    messageEl.innerText = message;
    messageEl.style.color = color;
}

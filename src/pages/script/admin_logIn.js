document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("adminLoginForm");
  const error = document.getElementById("errorMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch("http://localhost:6060/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const admin = await res.json();

      // 🔐 VERY IMPORTANT
      localStorage.setItem("mc_admin", JSON.stringify({
        adminId: admin.adminId,
        email: admin.email,
        role: "ADMIN"
      }));

      window.location.href = "./admin_dashboard.html";

    } catch (err) {
      error.innerText = "Invalid admin credentials";
    }
  });

});

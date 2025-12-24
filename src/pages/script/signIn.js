// -------------------- TABS SWITCHING --------------------
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-tab");

    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    tabContents.forEach(content => {
      content.classList.remove("active");
      if (content.id === target) content.classList.add("active");
    });
  });
});


// -------------------- PASSWORD SHOW / HIDE --------------------
document.querySelectorAll(".toggle-password").forEach(btn => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.getAttribute("data-target"));
    const isPassword = input.type === "password";

    input.type = isPassword ? "text" : "password";
    btn.textContent = isPassword ? "🙈" : "👁️";
  });
});


// -------------------- CUSTOMER LOGIN --------------------
// -------------------- CUSTOMER LOGIN --------------------
document.querySelector("#customerForm").addEventListener("submit", async e => {
  e.preventDefault();

  const email = e.target.email.value.trim();
  const password = e.target.password.value;

  try {
    const res = await fetch("http://localhost:6060/api/Customerlogin", {   // <-- ensure port is correct
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    // If backend returns non-2xx status, show appropriate message
    if (!res.ok) {
      // try to read message from body (text or json)
      let errText;
      try { errText = await res.text(); } catch { errText = res.statusText; }
      alert("Login failed: " + (errText || res.statusText));
      return;
    }

    // Parse JSON customer object
    const customer = await res.json();
    console.log("Customer Login Response:", customer);

    // Basic validation — make sure id/email exist
    if (!customer || !customer.customerId) {
      alert("Login failed: invalid response from server.");
      return;
    }

    // Store logged-in user object (used by dashboards)
    // store minimal info: id, email, name, role
    localStorage.setItem("mc_user", JSON.stringify({
      customerId: customer.customerId,
      name: customer.firstName || customer.name || customer.email || email,
      email: customer.email,
      role: "customer"   // keep a role for client-side guards
    }));

    // Redirect to customer dashboard (adjust path as needed)
    window.location.href = "../pages/c-dashboard.html";

  } catch (err) {
    console.error("Customer Login Error:", err);
    alert("Login error: " + err.message);
  }
});



// -------------------- MECHANIC LOGIN --------------------

document.querySelector("#mechanicForm").addEventListener("submit", async e => {
  e.preventDefault();

  const email = e.target.email.value.trim();
  const password = e.target.password.value;

  try {
    const res = await fetch("http://localhost:6060/api/Mechaniclogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const msg = await res.text();
      alert("Login failed: " + msg);
      return;
    }

    const mechanic = await res.json(); // ✅ JSON now
    console.log("Mechanic Login:", mechanic);

    localStorage.setItem("mc_user", JSON.stringify({
      mechanicId: mechanic.mechanicId,
      name: mechanic.firstName,
      email: mechanic.email,
      role: "mechanic"
    }));

    window.location.href = "../pages/m-dashboard.html";

  } catch (err) {
    console.error("Mechanic Login Error:", err);
    alert("Login error");
  }
});












// document.querySelector("#mechanicForm").addEventListener("submit", e => {
//   e.preventDefault();

//   const email = e.target.email.value;
//   const password = e.target.password.value;

//   fetch("http://localhost:6060/api/Mechaniclogin", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password })
//   })
//   .then(res => res.text())
//   .then(data => {
//     console.log("Mechanic Login Response:", data);

//     if (data.trim() === "Login successful") {

//       // Store logged-in user
//       localStorage.setItem("mc_user", JSON.stringify({  id: mechanic.mechanicId,firstName: mechanic.firstName, name: email,role: "mechanic" }));

//       // Redirect to mechanic dashboard
//       window.location.href = "../pages/m-dashboard.html";

//     } else {
//       alert("Invalid Email or Password");
//     }
//   })
//   .catch(err => console.error("Mechanic Login Error:", err));
// });


// // -------------------- LOAD FOOTER --------------------
// fetch("./footer/footer.html")
//   .then(response => response.text())
//   .then(html => {
//     document.getElementById("footer").innerHTML = html;

//     // Load footer JS after HTML loads
//     const script = document.createElement("script");
//     script.src = "./footer/f-loader.js";
//     script.defer = true;
//     document.body.appendChild(script);
//   })
//   .catch(err => console.error("Footer Load Error:", err));

// // Footer CSS
// const footerCSS = document.createElement("link");
// footerCSS.rel = "stylesheet";
// footerCSS.href = "./footer/footer.css";
// document.head.appendChild(footerCSS);

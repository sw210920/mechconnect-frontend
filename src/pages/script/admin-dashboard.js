document.addEventListener("DOMContentLoaded", () => {

  /* =============================
     LOGOUT
  ============================== */
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("mc_admin");
    window.location.href = "./admin_login.html";
  });

  const pageTitle = document.getElementById("pageTitle");
  const dashboardStats = document.getElementById("dashboardStats");
  const contentArea = document.getElementById("contentArea");

  const API = "http://localhost:6060/api/admin";

  /* =============================
     NAVIGATION
  ============================== */
  document.getElementById("nav-dashboard").onclick = showDashboard;
  document.getElementById("nav-customers").onclick = loadCustomers;
  document.getElementById("nav-mechanics").onclick = loadMechanics;
  document.getElementById("nav-orders").onclick = loadOrders;

  function setActive(id) {
    document.querySelectorAll(".sidebar li").forEach(li =>
      li.classList.remove("active")
    );
    document.getElementById(id).classList.add("active");
  }

  /* =============================
     DASHBOARD
  ============================== */
  function showDashboard() {
    setActive("nav-dashboard");
    pageTitle.textContent = "Welcome, Admin 👋";
    dashboardStats.style.display = "grid";
    contentArea.innerHTML = "";
  }

  /* =============================
     CUSTOMERS
  ============================== */
  function loadCustomers() {
    setActive("nav-customers");
    pageTitle.textContent = "Customers";
    dashboardStats.style.display = "none";

    contentArea.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
          </tr>
        </thead>
        <tbody id="customersTable">
          <tr><td colspan="4">Loading...</td></tr>
        </tbody>
      </table>
    `;

    fetch(`${API}/customers`)
      .then(res => res.json())
      .then(customers => {
        const tbody = document.getElementById("customersTable");
        tbody.innerHTML = "";

        customers.forEach(c => {
          tbody.innerHTML += `
            <tr>
              <td>${c.customerId}</td>
              <td>${c.firstName} ${c.lastName}</td>
              <td>${c.email}</td>
              <td>${c.mobailNumber}</td>
            </tr>
          `;
        });
      });
  }

  /* =============================
     MECHANICS
  ============================== */
  function loadMechanics() {
    setActive("nav-mechanics");
    pageTitle.textContent = "Mechanics";
    dashboardStats.style.display = "none";

    contentArea.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialization</th>
            <th>Experience</th>
          </tr>
        </thead>
        <tbody id="mechanicsTable">
          <tr><td colspan="4">Loading...</td></tr>
        </tbody>
      </table>
    `;

    fetch(`${API}/mechanics`)
      .then(res => res.json())
      .then(mechanics => {
        const tbody = document.getElementById("mechanicsTable");
        tbody.innerHTML = "";

        mechanics.forEach(m => {
          tbody.innerHTML += `
            <tr>
              <td>${m.mechanicId}</td>
              <td>${m.firstName} ${m.lastName}</td>
              <td>${m.specialization}</td>
              <td>${m.yearsOfExperience}</td>
            </tr>
          `;
        });
      });
  }

  /* =============================
     ORDERS
  ============================== */
  function loadOrders() {
    setActive("nav-orders");
    pageTitle.textContent = "Orders";
    dashboardStats.style.display = "none";

    contentArea.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Status</th>
            <th>Customer</th>
            <th>Mechanic</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody id="ordersTable">
          <tr><td colspan="5">Loading...</td></tr>
        </tbody>
      </table>
    `;

    fetch(`${API}/orders`)
      .then(res => res.json())
      .then(orders => {
        const tbody = document.getElementById("ordersTable");
        tbody.innerHTML = "";

        orders.forEach(o => {
          tbody.innerHTML += `
            <tr>
              <td>${o.orderNumber}</td>
              <td>${o.status}</td>
              <td>${o.customer?.firstName || "-"}</td>
              <td>${o.mechanic?.firstName || "-"}</td>
              <td>${o.serviceDate}</td>
            </tr>
          `;
        });
      });
  }

});

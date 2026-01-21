document.addEventListener("DOMContentLoaded", () => {

  /* =============================
     LOGOUT
  ============================== */
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("mc_admin");
      window.location.href = "./admin_login.html";
    });
  }

  const pageTitle = document.getElementById("pageTitle");
  const dashboardStats = document.getElementById("dashboardStats");
  const contentArea = document.getElementById("contentArea");

  const totalOrdersEl = document.getElementById("totalOrders");
  const totalCustomersEl = document.getElementById("totalCustomers");
  const totalMechanicsEl = document.getElementById("totalMechanics");

  const API = "http://localhost:6060/api/admin";

  /* =============================
     NAVIGATION EVENT HANDLERS
  ============================== */
  const navDashboard = document.getElementById("nav-dashboard");
  const navCustomers = document.getElementById("nav-customers");
  const navMechanics = document.getElementById("nav-mechanics");
  const navOrders = document.getElementById("nav-orders");

  if (navDashboard) navDashboard.addEventListener("click", showDashboard);
  if (navCustomers) navCustomers.addEventListener("click", loadCustomers);
  if (navMechanics) navMechanics.addEventListener("click", loadMechanics);
  if (navOrders) navOrders.addEventListener("click", loadOrders);

  function setActive(id) {
    document.querySelectorAll(".sidebar li").forEach(li =>
      li.classList.remove("active")
    );
    const activeItem = document.getElementById(id);
    if (activeItem) activeItem.classList.add("active");
  }

  /* =============================
     DASHBOARD (DEFAULT VIEW)
  ============================== */
  function showDashboard() {
    setActive("nav-dashboard");
    pageTitle.textContent = "Welcome, Admin 👋";

    dashboardStats.style.display = "grid";
    contentArea.innerHTML = "";

    loadDashboardStats(); // ✅ load stats from API
  }

  /* =============================
     ✅ LOAD DASHBOARD STATS
     API: GET /api/admin/stats
     Response example:
     {
       "totalCustomers": 5,
       "totalMechanics": 10,
       "totalOrders": 25
     }
  ============================== */
  function loadDashboardStats() {
    if (totalOrdersEl) totalOrdersEl.textContent = "--";
    if (totalCustomersEl) totalCustomersEl.textContent = "--";
    if (totalMechanicsEl) totalMechanicsEl.textContent = "--";

    fetch(`${API}/stats`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then(stats => {
        // ✅ this depends on your DTO field names
        if (totalOrdersEl) totalOrdersEl.textContent = stats.totalOrders ?? 0;
        if (totalCustomersEl) totalCustomersEl.textContent = stats.totalCustomers ?? 0;
        if (totalMechanicsEl) totalMechanicsEl.textContent = stats.totalMechanics ?? 0;
      })
      .catch(err => {
        console.error("Stats fetch error:", err);
        if (totalOrdersEl) totalOrdersEl.textContent = "0";
        if (totalCustomersEl) totalCustomersEl.textContent = "0";
        if (totalMechanicsEl) totalMechanicsEl.textContent = "0";
      });
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
            <th>Address</th>
          </tr>
        </thead>
        <tbody id="customersTable">
          <tr><td colspan="5">Loading...</td></tr>
        </tbody>
      </table>
    `;

    fetch(`${API}/customers`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch customers");
        return res.json();
      })
      .then(customers => {
        const tbody = document.getElementById("customersTable");
        tbody.innerHTML = "";

        if (!customers.length) {
          tbody.innerHTML = `<tr><td colspan="5">No customers found.</td></tr>`;
          return;
        }

        customers.forEach(c => {
          tbody.innerHTML += `
            <tr>
              <td>${c.customerId ?? "-"}</td>
              <td>${(c.firstName ?? "")} ${(c.lastName ?? "")}</td>
              <td>${c.email ?? "-"}</td>
              <td>${c.mobailNumber ?? "-"}</td>
              <td>${c.address ?? "-"}</td>
            </tr>
          `;
        });
      })
      .catch(err => {
        console.error("Customers fetch error:", err);
        document.getElementById("customersTable").innerHTML =
          `<tr><td colspan="5">Failed to load customers.</td></tr>`;
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
            <th>Mobile No</th>
            <th>Email</th>
            <th>Address</th>
            <th>Service Location</th>
            <th>Specialization</th>
            <th>Experience</th>
          </tr>
        </thead>
        <tbody id="mechanicsTable">
          <tr><td colspan="8">Loading...</td></tr>
        </tbody>
      </table>
    `;

    fetch(`${API}/mechanics`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch mechanics");
        return res.json();
      })
      .then(mechanics => {
        const tbody = document.getElementById("mechanicsTable");
        tbody.innerHTML = "";

        if (!mechanics.length) {
          tbody.innerHTML = `<tr><td colspan="8">No mechanics found.</td></tr>`;
          return;
        }

        mechanics.forEach(m => {
          tbody.innerHTML += `
            <tr>
              <td>${m.mechanicId ?? "-"}</td>
              <td>${(m.firstName ?? "")} ${(m.lastName ?? "")}</td>
              <td>${m.mobailNumber ?? "-"}</td>
              <td>${m.email ?? "-"}</td>
              <td>${m.address ?? "-"}</td>
              <td>${m.serviceLocation ?? "-"}</td>
              <td>${m.specialization ?? "-"}</td>
              <td>${m.yearsOfExperience ?? "-"}</td>
            </tr>
          `;
        });
      })
      .catch(err => {
        console.error("Mechanics fetch error:", err);
        document.getElementById("mechanicsTable").innerHTML =
          `<tr><td colspan="8">Failed to load mechanics.</td></tr>`;
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
            <th>Service Mode</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody id="ordersTable">
          <tr><td colspan="6">Loading...</td></tr>
        </tbody>
      </table>
    `;

    fetch(`${API}/orders`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then(orders => {
        const tbody = document.getElementById("ordersTable");
        tbody.innerHTML = "";

        if (!orders.length) {
          tbody.innerHTML = `<tr><td colspan="6">No orders found.</td></tr>`;
          return;
        }

        orders.forEach(o => {
          tbody.innerHTML += `
            <tr>
              <td>${o.orderNumber ?? "-"}</td>
              <td>${o.status ?? "-"}</td>
              <td>${o.customerName ?? "-"}</td>
              <td>${o.mechanicName ?? "-"}</td>
              <td>${o.serviceMode ?? "-"}</td>
              <td>${o.serviceDate ?? "-"}</td>
            </tr>
          `;
        });
      })
      .catch(err => {
        console.error("Orders fetch error:", err);
        document.getElementById("ordersTable").innerHTML =
          `<tr><td colspan="6">Failed to load orders.</td></tr>`;
      });
  }

  /* =============================
     ✅ AUTO LOAD DASHBOARD ON PAGE OPEN
  ============================== */
  showDashboard();

});

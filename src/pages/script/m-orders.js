document.addEventListener("DOMContentLoaded", () => {

  /* =============================
     AUTH CHECK
  ============================== */
  const user = JSON.parse(localStorage.getItem("mc_user"));

  if (!user || user.role !== "mechanic") {
    window.location.href = "./signIn.html";
    return;
  }

  const mechanicId = user.mechanicId;
  const container = document.getElementById("ordersContainer");
  const filterSelect = document.getElementById("orderStatus");

  let allOrders = [];
  const API_BASE = "http://localhost:6060/api/mechanic";

  /* =============================
     FETCH MECHANIC ORDERS
  ============================== */
  function fetchOrders() {
    container.innerHTML = `<p class="empty">Loading orders...</p>`;

    fetch(`${API_BASE}/orders?mechanicId=${mechanicId}`)
      .then(res => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then(data => {
        allOrders = data || [];
        applyFilter();
      })
      .catch(err => {
        console.error("Fetch orders error:", err);
        container.innerHTML = `<p class="empty">Failed to load orders.</p>`;
      });
  }

  fetchOrders();

  /* =============================
     FILTER
  ============================== */
  function applyFilter() {
    const val = filterSelect.value;

    if (val === "ALL") {
      renderOrders(allOrders);
    } else {
      renderOrders(allOrders.filter(o => o.status === val));
    }
  }

  filterSelect.addEventListener("change", applyFilter);

  /* =============================
     REQUEST COMPLETE
  ============================== */
  function requestComplete(orderId) {
    if (!orderId) {
      alert("OrderId missing!");
      return;
    }

    fetch(`${API_BASE}/orders/${orderId}/request-complete?mechanicId=${mechanicId}`, {
      method: "PUT"
    })
      .then(res => res.text())
      .then(msg => {
        alert(msg);
        fetchOrders(); // ✅ refresh list
      })
      .catch(err => {
        console.error("Request complete error:", err);
        alert("Failed to request completion.");
      });
  }

  /* =============================
     BUTTON CLICK (Only ONE handler)
  ============================== */
  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("complete-btn")) {
      const orderId = e.target.dataset.orderId; // ✅ FIXED
      requestComplete(orderId);
    }
  });

  /* =============================
     RENDER ORDERS
  ============================== */
  function renderOrders(orders) {
    container.innerHTML = "";

    if (!orders.length) {
      container.innerHTML = `<p class="empty">No orders found.</p>`;
      return;
    }

    orders.forEach(order => {

      const showCustomerAddress =
        String(order.serviceMode) === "DOORSTEP" &&
        (order.status === "ACCEPTED" || order.status === "COMPLETED");

      const showCompleteBtn = order.status === "ACCEPTED";

      const card = document.createElement("div");
      card.className = "recent-item";

      card.innerHTML = `
        <strong>Order #${order.orderNumber}</strong>

        <p>
          <b>Status:</b>
          <span class="status-${String(order.status).toLowerCase()}">
            ${formatStatus(order.status)}
          </span>
        </p>

        <p><b>Customer:</b> ${order.customerName || "-"}</p>
        <p><b>Service:</b> ${order.serviceType || "-"}</p>
        <p><b>Package:</b> ${order.packageName || "-"}</p>
        <p><b>Service Mode:</b> ${order.serviceMode || "-"}</p>
        <p><b>Date:</b> ${order.serviceDate || "-"} | ${order.serviceTime || "-"}</p>

        <p class="vehicle-line">
          <b>Vehicle:</b> ${order.vehicle || "-"} ${order.vehicleModel || ""} 
          (${order.registrationNumber || "-"})
        </p>

        ${
          showCustomerAddress
            ? `<p class="customer-address">
                 <b>Customer Address:</b> ${order.customerAddress || "-"}
               </p>`
            : ""
        }

        ${
          showCompleteBtn
            ? `<button class="complete-btn" data-order-id="${order.orderId}">
                 ✅ Mark Completed
               </button>`
            : ""
        }
      `;

      container.appendChild(card);
    });
  }

  /* =============================
     STATUS FORMAT
  ============================== */
  function formatStatus(status) {
    if (!status) return "-";

    if (status === "COMPLETION_REQUESTED") return "Completion Requested";
    if (status === "ACCEPTED") return "Accepted";
    if (status === "COMPLETED") return "Completed";

    return status;
  }

});

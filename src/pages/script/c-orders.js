document.addEventListener("DOMContentLoaded", () => {

  /* =============================
     AUTH CHECK
  ============================== */
  const user = JSON.parse(localStorage.getItem("mc_user"));

  if (!user || user.role !== "customer") {
    window.location.href = "./signIn.html";
    return;
  }

  const customerId = user.customerId;
  const container = document.getElementById("ordersContainer");
  const filterSelect = document.getElementById("orderStatus");

  const API_BASE = "http://localhost:6060/api/customer";

  let allOrders = [];

  /* =============================
     FETCH ORDERS
  ============================== */
  function fetchOrders() {
    container.innerHTML = `<p class="empty">Loading orders...</p>`;

    fetch(`${API_BASE}/orders?customerId=${customerId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then(data => {
        allOrders = Array.isArray(data) ? data : [];
        applyFilter();
      })
      .catch(err => {
        console.error("Orders fetch error:", err);
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
     CONFIRM COMPLETE API
  ============================== */
  function confirmComplete(orderId) {
    if (!orderId) {
      alert("OrderId missing! Please check backend DTO mapping.");
      return;
    }

    fetch(`${API_BASE}/orders/${orderId}/confirm-complete?customerId=${customerId}`, {
      method: "PUT"
    })
      .then(res => res.text())
      .then(msg => {
        alert(msg);
        fetchOrders(); // ✅ refresh list
      })
      .catch(err => {
        console.error("Confirm complete error:", err);
        alert("Failed to confirm completion.");
      });
  }

  /* =============================
     BUTTON CLICK (ONE handler)
  ============================== */
  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("confirm-complete-btn")) {
      const orderId = e.target.dataset.orderId;
      confirmComplete(orderId);
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

      const status = order.status || "UNKNOWN";

      // ✅ important: check orderId exists
      console.log("OrderId:", order.orderId, "Status:", status);

      // ✅ show garage address only for GARAGE + accepted/completed
      const showGarageAddress =
        String(order.serviceMode) === "GARAGE" &&
        (status === "ACCEPTED" || status === "COMPLETED") &&
        order.mechanicAddress;

      // ✅ show confirm button only for completion requested
      const showConfirmBtn = (status === "COMPLETION_REQUESTED");

      const card = document.createElement("div");
      card.className = "recent-item";

      card.innerHTML = `
        <strong>Order #${order.orderNumber || "-"}</strong>

        <p>
          <b>Status:</b>
          <span class="status-${String(status).toLowerCase()}">
            ${formatStatus(status)}
          </span>
        </p>

        <p><b>Mechanic:</b> ${order.mechanicName || "-"}</p>
        <p><b>Service:</b> ${order.serviceType || "-"}</p>
        <p><b>Package:</b> ${order.packageName || "-"}</p>
        <p><b>Service Mode:</b> ${order.serviceMode || "-"}</p>
        <p><b>Date:</b> ${order.serviceDate || "-"} | ${order.serviceTime || "-"}</p>

        <p class="vehicle-line">
          <b>Vehicle:</b> ${order.vehicleMake || "-"} ${order.vehicleModel || "-"} ${order.vehicleRegistrationNumber || "-"}
        </p>

        ${
          showGarageAddress
            ? `<p class="garage-address">
                 <b>Garage Address:</b> ${order.mechanicAddress}
               </p>`
            : ""
        }

        ${
          showConfirmBtn
            ? `<button class="confirm-complete-btn" data-order-id="${order.orderId || ""}">
                 ✅ Confirm Completed
               </button>`
            : ""
        }
      `;

      container.appendChild(card);
    });
  }

  /* =============================
     STATUS LABELS
  ============================== */
  function formatStatus(status) {
    switch (status) {
      case "PENDING": return "Pending";
      case "ACCEPTED": return "Accepted";
      case "REJECTED": return "Rejected";
      case "COMPLETION_REQUESTED": return "Completion Requested";
      case "COMPLETED": return "Completed";
      default: return status;
    }
  }

});

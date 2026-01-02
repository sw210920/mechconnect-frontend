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
  const filterSelect = document.getElementById("orderStatus"); // ✅ FIXED ID

  let allOrders = [];

  /* =============================
     FETCH ORDERS
  ============================== */
  fetch(`http://localhost:6060/api/customer/orders?customerId=${customerId}`)
    .then(res => {
      if (!res.ok) throw new Error("Fetch failed");
      return res.json();
    })
    .then(data => {
      allOrders = data;

      console.table(allOrders.map(o => o.status)); // ✅ DEBUG (keep once)

      renderOrders(allOrders); // default → ALL
    })
    .catch(err => {
      console.error("Orders fetch error:", err);
      container.innerHTML = `<p class="empty">Failed to load orders.</p>`;
    });

  /* =============================
     FILTER CHANGE
  ============================== */
  filterSelect.addEventListener("change", () => {
    const selectedStatus = filterSelect.value;

    console.log("Selected filter:", selectedStatus);

    if (selectedStatus === "ALL") {
      renderOrders(allOrders);
    } else {
      const filtered = allOrders.filter(
        order => order.status === selectedStatus
      );
      renderOrders(filtered);
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
      const card = document.createElement("div");
      card.className = "recent-item";

      card.innerHTML = `
        <strong>Order #${order.orderNumber}</strong>

        <p>
          <b>Status:</b>
          <span class="status-${order.status.toLowerCase()}">
            ${formatStatus(order.status)}
          </span>
        </p>

        <p><b>Service:</b> ${order.serviceType}</p>
        <p><b>Package:</b> ${order.packageName || "-"}</p>
        <p><b>Date:</b> ${order.serviceDate} | ${order.serviceTime}</p>
        <p><b>Vehicle:</b> ${order.vehicleMake} ${order.vehicleModel}</p>
      `;

      container.appendChild(card);
    });
  }

  /* =============================
     STATUS LABELS (UI ONLY)
  ============================== */
  function formatStatus(status) {
    switch (status) {
      case "ACCEPTED": return "Accepted";
      case "PENDING": return "Pending";
      case "COMPLETED": return "Completed";
      case "REJECTED": return "Rejected";
      default: return status;
    }
  }

});

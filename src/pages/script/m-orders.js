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

  /* =============================
     FETCH MECHANIC ORDERS
  ============================== */
  fetch(`http://localhost:6060/api/mechanic/orders?mechanicId=${mechanicId}`)
    .then(res => {
      if (!res.ok) throw new Error("Fetch failed");
      return res.json();
    })
    .then(data => {
      allOrders = data;
      renderOrders(allOrders);
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = `<p class="empty">Failed to load orders.</p>`;
    });

  /* =============================
     FILTER
  ============================== */
  filterSelect.addEventListener("change", () => {
    const val = filterSelect.value;
    renderOrders(val === "ALL" ? allOrders : allOrders.filter(o => o.status === val));
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
        order.serviceMode === "DOORSTEP" &&
        (order.status === "ACCEPTED" || order.status === "COMPLETED");

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

        <p><b>Customer:</b> ${order.customerName}</p>
        <p><b>Service:</b> ${order.serviceType}</p>
        <p><b>Package:</b> ${order.packageName || "-"}</p>
        <p><b>Service Mode:</b> ${order.serviceMode}</p>
        <p><b>Date:</b> ${order.serviceDate} | ${order.serviceTime}</p>

        <!-- Vehicle NEVER highlighted -->
        <p class="vehicle-line">
          <b>Vehicle:</b> ${order.vehicle} ${order.registrationNumber}
        </p>

        ${
          showCustomerAddress
            ? `<p class="customer-address">
                 <b>Customer Address:</b> ${order.customerAddress}
               </p>`
            : ""
        }
      `;

      container.appendChild(card);
    });
  }

  /* =============================
     STATUS LABEL
  ============================== */
  function formatStatus(status) {
    return status.charAt(0) + status.slice(1).toLowerCase();
  }

});

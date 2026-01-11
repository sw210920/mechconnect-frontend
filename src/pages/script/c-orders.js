document.addEventListener("DOMContentLoaded", () => {

  const user = JSON.parse(localStorage.getItem("mc_user"));
  if (!user || user.role !== "customer") {
    window.location.href = "./signIn.html";
    return;
  }

  const customerId = user.customerId;
  const container = document.getElementById("ordersContainer");
  const filterSelect = document.getElementById("orderStatus");

  let allOrders = [];

  fetch(`http://localhost:6060/api/customer/orders?customerId=${customerId}`)
    .then(res => res.json())
    .then(data => {
      allOrders = data;
      renderOrders(allOrders);
    });

  filterSelect.addEventListener("change", () => {
    const val = filterSelect.value;
    renderOrders(val === "ALL" ? allOrders : allOrders.filter(o => o.status === val));
  });

  function renderOrders(orders) {
    container.innerHTML = "";

    if (!orders.length) {
      container.innerHTML = `<p class="empty">No orders found.</p>`;
      return;
    }

    orders.forEach(order => {

      const showGarageAddress =
        order.serviceMode === "GARAGE" &&
        (order.status === "ACCEPTED" || order.status === "COMPLETED") &&
        order.mechanicAddress;

      const card = document.createElement("div");
      card.className = "recent-item";

      card.innerHTML = `
        <strong>Order #${order.orderNumber}</strong>

        <p><b>Status:</b>
          <span class="status-${order.status.toLowerCase()}">
            ${formatStatus(order.status)}
          </span>
        </p>

        <p><b>Mechanic:</b> ${order.mechanicName || "-"}</p>
        <p><b>Service:</b> ${order.serviceType}</p>
        <p><b>Package:</b> ${order.packageName || "-"}</p>
        <p><b>Service Mode:</b> ${order.serviceMode || "-"}</p>
        <p><b>Date:</b> ${order.serviceDate} | ${order.serviceTime}</p>

        <!-- ❌ Vehicle NEVER highlighted -->
        <p class="vehicle-line">
          <b>Vehicle:</b> ${order.vehicleMake} ${order.vehicleModel} ${order.vehicleRegistrationNumber}
        </p>

        ${
          showGarageAddress
            ? `<p class="garage-address">
                 <b>Garage Address:</b> ${order.mechanicAddress}
               </p>`
            : ""
        }
      `;

      container.appendChild(card);
    });
  }

  function formatStatus(status) {
    return status.charAt(0) + status.slice(1).toLowerCase();
  }

});

const API_BASE = "http://localhost:6060/api";

/* =====================================================
   AUTH GUARD (MECHANIC ONLY)
===================================================== */
const user = JSON.parse(localStorage.getItem("mc_user"));

if (!user || user.role !== "mechanic") {
  alert("Unauthorized access");
  window.location.href = "./signIn.html";
}

const mechanicId = user.mechanicId || user.id;
const container = document.getElementById("requestsContainer");
const emptyMsg = document.getElementById("emptyMsg");

/* =====================================================
   LOAD PENDING REQUESTS
===================================================== */
document.addEventListener("DOMContentLoaded", loadServiceRequests);

function loadServiceRequests() {

  container.innerHTML = "";
  emptyMsg.classList.add("hidden");

  fetch(`http://localhost:6060/api/mechanic/${mechanicId}/requests`)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch requests");
      return res.json();
    })
    .then(requests => {

      if (!requests || requests.length === 0) {
        emptyMsg.textContent = "No pending service requests";
        emptyMsg.classList.remove("hidden");
        return;
      }

      requests.forEach(req => {
        container.appendChild(createRequestCard(req));
      });
    })
    .catch(err => {
      console.error(err);
      emptyMsg.textContent = "Failed to load service requests";
      emptyMsg.classList.remove("hidden");
    });
}

/* =====================================================
   CREATE REQUEST CARD
===================================================== */
function createRequestCard(req) {

  const card = document.createElement("div");
  card.className = "request-card";
  card.dataset.id = req.requestId;

  card.innerHTML = `
    <div class="request-info">
      <h3>Customer: ${req.customerName}</h3>
      <p><strong>Service:</strong> ${req.serviceType}</p>
      
    <p><strong>Service Mode:</strong> ${req.serviceMode}</p>

    ${
      req.serviceMode === "DOORSTEP"
        ? `<p><strong>Service Address:</strong> ${req.serviceAddress}</p>`
        : ""
    }
      <p><strong>Package:</strong> ${req.packageName}</p>
      <p><strong>Location:</strong> ${req.serviceLocation}</p>
       <p><strong>Location:</strong> ${req.serviceLocation}</p>
      <p><strong>Date:</strong> ${req.serviceDate}</p>
      <p><strong>Time:</strong> ${req.time}</p>
      <p><strong>Vehicle:</strong> ${req.make} ${req.model}</p>
    <p><strong>Year:</strong> ${req.vehicleYear}</p>
    <p><strong>Reg No:</strong> ${req.registrationNumber}</p>

      </div>

    <div class="request-actions">
      <button class="accept-btn">Accept</button>
      <button class="reject-btn">Reject</button>
    </div>
  `;

  card.querySelector(".accept-btn")
      .addEventListener("click", () => acceptRequest(req.requestId));

  card.querySelector(".reject-btn")
      .addEventListener("click", () => rejectRequest(req.requestId));

  return card;
}

/* =====================================================
   ACCEPT REQUEST
===================================================== */
function acceptRequest(requestId) {

  if (!confirm("Accept this service request?")) return;

  fetch(`http://localhost:6060/api/mechanic/request/${requestId}/accept`, {
    method: "PUT"
  })
  .then(res => {
    if (!res.ok) throw new Error();
    removeRequestCard(requestId);
    alert("Request accepted ✅");
  })
  .catch(() => alert("Failed to accept request"));
}

/* =====================================================
   REJECT REQUEST
===================================================== */
// function rejectRequest(requestId) {

//   if (!confirm("Reject this service request?")) return;

//   fetch(`http://localhost:6060/api/mechanic/request/${requestId}/reject`, {
//     method: "Post"
//   })
//   .then(res => {
//     if (!res.ok) throw new Error();
//     removeRequestCard(requestId);
//     alert("Request rejected ❌");
//   })
//   .catch(() => alert("Failed to reject request"));
// }



function rejectRequest(requestId) {

    if (!confirm("Reject this service request?")) return;

    fetch("http://localhost:6060/api/mechanic/request/${requestId}/reject", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            requestId: requestId
        })
    })
    .then(res => {
        if (!res.ok) throw new Error();
        removeRequestCard(requestId);
        alert("Request rejected ❌");
    })
    .catch(() => alert("Failed to reject request"));
}

/* =====================================================
   REMOVE CARD FROM UI
===================================================== */
function removeRequestCard(requestId) {

  const card = document.querySelector(
    `.request-card[data-id="${requestId}"]`
  );

  if (card) card.remove();

  if (!document.querySelector(".request-card")) {
    emptyMsg.textContent = "No pending service requests";
    emptyMsg.classList.remove("hidden");
  }
}

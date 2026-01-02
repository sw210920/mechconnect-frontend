document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     AUTH GUARD
  ===================================================== */
  const user = JSON.parse(localStorage.getItem("mc_user"));

  if (!user || user.role !== "customer") {
    window.location.href = "../pages/signIn.html";
    return;
  }

  /* =====================================================
     GLOBAL BOOKING STATE (SINGLE SOURCE OF TRUTH)
  ===================================================== */
  const booking = {
    customerId: user.customerId || user.id,
    mechanicId: null,
    customerName: `${user.firstName} ${user.lastName}`.trim(),


    serviceType: "",
    location: "",

    packageName: "",
    date: "",
    time: "",

    serviceMode: "DOORSTEP",    
    serviceAddress: "",     


    make: "",
    model: "",
    year: "",
    registrationNumber: ""
  };

  /* =====================================================
     ELEMENT REFERENCES
  ===================================================== */
  const mechanicList = document.getElementById("mechanicList");
  const searchBtn = document.getElementById("searchBtn");

  const findSection = document.getElementById("findMechanicSection");
  const bookSection = document.getElementById("bookServiceSection");

  const addressBox = document.getElementById("addressBox");
  const serviceAddressInput = document.getElementById("serviceAddress");


  /* =====================================================
     FIND MECHANICS
  ===================================================== */
  searchBtn.addEventListener("click", fetchMechanics);

  function fetchMechanics() {
    const location = document.getElementById("location").value.trim();
    const serviceType = document.getElementById("service").value;

    if (!location || !serviceType) {
      alert("Please enter location and select service type");
      return;
    }

    booking.location = location;
    booking.serviceType = serviceType;

    mechanicList.innerHTML = "<p>Loading mechanics...</p>";
      
    fetch(
      `http://localhost:6060/api/mechanics/nearby?serviceLocation=${encodeURIComponent(location)}&serviceType=${encodeURIComponent(serviceType)}`
    )
      .then(res => {
        if (res.status === 204) return [];
        if (!res.ok) throw new Error("Failed to fetch mechanics");
        return res.json();
      })
      .then(renderMechanics)
      .catch(() => {
        mechanicList.innerHTML = "<p>No mechanics available</p>";
      });
  }

  function renderMechanics(mechanics) {
    mechanicList.innerHTML = "";

    if (!mechanics || mechanics.length === 0) {
      mechanicList.innerHTML = "<p>No mechanics available</p>";
      return;
    }

    mechanics.forEach(mechanic => {
      const card = document.createElement("div");
      card.className = "mechanic-card";

      card.innerHTML = `
        <h3>${mechanic.firstName} ${mechanic.lastName || ""}</h3>
        <p><strong>Location:</strong> ${mechanic.serviceLocation}</p>
        <p><strong>Service:</strong> ${mechanic.specialization}</p>
        <p><strong>Status:</strong> ${mechanic.available ? "Available" : "Busy"}</p>
        <button class="book-btn">Book Now</button>
      `;

      card.querySelector(".book-btn").addEventListener("click", () => {
        selectMechanic(mechanic);
      });

      mechanicList.appendChild(card);
    });
  }


/* =====================================================
   TOGGLE PACKAGES BASED ON SERVICE TYPE
===================================================== */
function togglePackagesByService(serviceType) {
  const packages = document.querySelectorAll(".package-card");

  packages.forEach(card => {
    card.style.display = "block"; // default show
  });

  // Normalize
  serviceType = serviceType.toLowerCase();

  // Bike-only packages
  if (serviceType === "bike") {
    packages.forEach(card => {
      if (card.dataset.package === "car") {
        card.style.display = "none";
      }
    });
  }

  // Car-only packages
  if (serviceType === "car") {
    packages.forEach(card => {
      if (card.dataset.package === "bike") {
        card.style.display = "none";
      }
    });
  }

  // Both → show all
}



  /* =====================================================
     MECHANIC SELECTION (MANDATORY)
  ===================================================== */
 function selectMechanic(mechanic) {
  if (!mechanic || !mechanic.mechanicId) {
    alert("Invalid mechanic selected");
    return;
  }

  booking.mechanicId = mechanic.mechanicId;
  booking.mechanicName =
    `${mechanic.firstName} ${mechanic.lastName || ""}`.trim();

  booking.serviceType = mechanic.specialization; // bike / cars / both
  booking.location = mechanic.serviceLocation;

  console.log("Selected mechanic ID:", booking.mechanicId);
  console.log("Selected service type:", booking.serviceType);

  togglePackagesByService(booking.serviceType);

  findSection.style.display = "none";
  bookSection.style.display = "block";
  showStep(1);
}


  /* =====================================================
     STEP HANDLER
  ===================================================== */
  function showStep(n) {
    document.querySelectorAll(".booking-step")
      .forEach(s => s.classList.remove("active"));

    document.getElementById(`step${n}`)?.classList.add("active");
  }

  /* =====================================================
     STEP 1 — PACKAGE
  ===================================================== */
  document.querySelectorAll(".package-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".package-card")
        .forEach(c => c.classList.remove("selected"));

      card.classList.add("selected");
      booking.packageName = card.querySelector("h3").innerText.trim();
    });
  });

  document.getElementById("step1Next").onclick = () => {
    if (!booking.packageName) {
      alert("Please select a service package");
      return;
    }
    showStep(2);
  };

  /* =====================================================
     STEP 2 — DATE & TIME
  ===================================================== */
  const dateInput = document.getElementById("serviceDate");
  dateInput.min = new Date().toISOString().split("T")[0];

  document.querySelectorAll(".time-slot").forEach(slot => {
    slot.onclick = () => {
      document.querySelectorAll(".time-slot")
        .forEach(s => s.classList.remove("selected"));

      slot.classList.add("selected");
      booking.time = slot.dataset.time;
    };
  });

  document.getElementById("step2Next").onclick = () => {
    if (!dateInput.value || !booking.time) {
      alert("Please select date and time");
      return;
    }

    if (booking.serviceMode === "DOORSTEP") {
    booking.serviceAddress = serviceAddressInput.value.trim();

    if (!booking.serviceAddress) {
      alert("Please enter service address for doorstep service");
      return;
    }
  }

    booking.date = dateInput.value;
    showStep(3);
  };

  document.getElementById("step2Back").onclick = () => showStep(1);



 

function hideAddressBox() {
  addressBox.classList.add("hidden");
  serviceAddressInput.value = "";
}

function showAddressBox() {
  addressBox.classList.remove("hidden");
}

document.querySelectorAll('input[name="serviceMode"]').forEach(radio => {
  radio.addEventListener("change", () => {
    booking.serviceMode = radio.value;

    if (radio.value === "GARAGE") {
      hideAddressBox();
      booking.serviceAddress = "";
    } else {
      showAddressBox();
    }
  });
});



if (booking.serviceMode === "GARAGE") {
  hideAddressBox();
} else {
  showAddressBox();
}



  /* =====================================================
     STEP 3 — VEHICLE
  ===================================================== */
  document.getElementById("step3Next").onclick = () => {
    booking.make = vehicleMake.value.trim();
    booking.model = vehicleModel.value.trim();
    booking.year = vehicleYear.value.trim();
    booking.registrationNumber = vehicleReg.value.trim();

    if (!booking.make || !booking.model || !booking.year || !booking.registrationNumber) {
      alert("Please fill all vehicle details");
      return;
    }

    loadSummary();
    showStep(4);
  };

  document.getElementById("step3Back").onclick = () => showStep(2);

  /* =====================================================
     STEP 4 — SUMMARY
  ===================================================== */
  function loadSummary() {
  summaryBox.innerHTML = `
    <h3>Service Summary</h3>

    <p><strong>Mechanic:</strong> ${booking.mechanicName}</p>
    <p><strong>Service:</strong> ${booking.serviceType}</p>
    <p><strong>Service Mode:</strong> ${booking.serviceMode}</p>

    ${
        booking.serviceMode === "DOORSTEP"
          ? `<p><strong>Service Address:</strong> ${booking.serviceAddress}</p>`
          : `<p><strong>Garage Address:</strong> Will be shared after acceptance</p>`
      }
    
    <p><strong>Location:</strong> ${booking.location}</p>

    <p><strong>Package:</strong> ${booking.packageName}</p>
    <p><strong>Date:</strong> ${booking.date}</p>
    <p><strong>Time:</strong> ${booking.time}</p>

    <h4>Vehicle</h4>
    <p>${booking.make} ${booking.model}</p>
    <p>Year: ${booking.year}</p>
    <p>Registration: ${booking.registrationNumber}</p>
  `;
}

  document.getElementById("step4Back").onclick = () => showStep(3);

  /* =====================================================
     STEP 5 — BACKEND CALL
  ===================================================== */
  document.getElementById("confirmBooking").onclick = async () => {

    if (!booking.mechanicId) {
      alert("Mechanic not selected. Please go back and select a mechanic.");
      return;
    }

    const payload = {
  customerId: booking.customerId,
  mechanicId: booking.mechanicId,
  customerName: booking.customerName,

  serviceType: booking.serviceType,
  serviceLocation: booking.location, 

   serviceMode: booking.serviceMode,        
    serviceAddress: booking.serviceAddress, 

  packageName: booking.packageName,
  serviceDate: booking.date,
  time: booking.time,

  make: booking.make,
  model: booking.model,
  vehicleYear: booking.year,            
  registrationNumber: booking.registrationNumber
};
    console.log("FINAL PAYLOAD:", payload);

    try {
      const res = await fetch(
        "http://localhost:6060/api/customers/sendRequest",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) throw new Error(await res.text());

      showStep(5);

    } catch (err) {
      alert(err.message || "Booking failed");
    }
  };

});

const BASE = window.API_BASE_URL;


document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     AUTH GUARD
  ===================================================== */
  const user = JSON.parse(localStorage.getItem("mc_user"));

  if (!user || user.role !== "customer") {
    window.location.href = "../signIn.html";
    return;
  }

  /* =====================================================
     GLOBAL BOOKING STATE
  ===================================================== */
  const booking = {
    customerId: user.customerId || user.id,
    mechanicId: null,
    mechanicName: "",
    customerName: `${user.firstName} ${user.lastName}`.trim(),

    serviceType: "",
    location: "",

    packageName: "",
    packagePrice: 0,

    // ✅ customization support
    isCustom: false,
    customServices: [],
    customTotalPrice: 0,

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
     CUSTOMIZE SERVICES LIST
  ===================================================== */
  const CUSTOM_SERVICE_OPTIONS = {
    bike: [
      { name: "Engine Oil Change", price: 500 },
      { name: "Chain Cleaning", price: 200 },
      { name: "Brake Check", price: 150 },
      { name: "General Checkup", price: 300 },
      { name: "Bike Wash", price: 100 }
    ],
    car: [
      { name: "Engine Oil Change", price: 1200 },
      { name: "AC Check", price: 800 },
      { name: "Wheel Alignment", price: 600 },
      { name: "Brake Service", price: 900 },
      { name: "General Checkup", price: 500 }
    ]
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

  // ✅ Customize elements
  const customizeBox = document.getElementById("customizeBox");
  const customizeOptionsDiv = document.getElementById("customizeOptions");
  const customTotalEl = document.getElementById("customTotal");
  const useCustomBtn = document.getElementById("useCustomBtn");

 

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
    booking.serviceType = serviceType; // car / bike

    mechanicList.innerHTML = "<p>Loading mechanics...</p>";

    fetch(`${BASE}/api/mechanics/nearby?serviceLocation=${encodeURIComponent(location)}&serviceType=${encodeURIComponent(serviceType)}`
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
     TOGGLE PACKAGES (CAR/BIKE)
  ===================================================== */
  function togglePackagesByService(serviceType) {
    const packages = document.querySelectorAll(".package-card");

    packages.forEach(card => {
      card.style.display = "block";
    });

    serviceType = String(serviceType || "").toLowerCase();

    if (serviceType === "bike") {
      packages.forEach(card => {
        if (card.dataset.package === "car") card.style.display = "none";
      });
    }

    if (serviceType === "car") {
      packages.forEach(card => {
        if (card.dataset.package === "bike") card.style.display = "none";
      });
    }
  }

  /* =====================================================
     MECHANIC SELECTION
  ===================================================== */
  function selectMechanic(mechanic) {
    if (!mechanic || !mechanic.mechanicId) {
      alert("Invalid mechanic selected");
      return;
    }

    booking.mechanicId = mechanic.mechanicId;
    booking.mechanicName = `${mechanic.firstName} ${mechanic.lastName || ""}`.trim();

    // ✅ keep serviceType as selected by customer (bike/car)
    // but mechanic specialization can also be "bike/car"
    // booking.serviceType is already set from dropdown.
    booking.location = mechanic.serviceLocation;

    // reset package/custom state
    booking.packageName = "";
    booking.packagePrice = 0;
    booking.isCustom = false;
    booking.customServices = [];
    booking.customTotalPrice = 0;

    document.querySelectorAll(".package-card")
      .forEach(c => c.classList.remove("selected"));

    togglePackagesByService(booking.serviceType);

    // ✅ customization should appear AFTER vehicle type selection
    setupCustomizeSection(booking.serviceType);

    findSection.style.display = "none";
    bookSection.style.display = "block";
    showStep(1);
  }

  /* =====================================================
     STEP HANDLER
  ===================================================== */
  function showStep(n) {
    document.querySelectorAll(".booking-step").forEach(s => s.classList.remove("active"));
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

      // selecting package disables custom
      booking.isCustom = false;
      booking.customServices = [];
      booking.customTotalPrice = 0;
      updateCustomTotalUI();

      booking.packageName = card.querySelector("h3")?.innerText?.trim() || "";

      // price read from <strong>₹499</strong>
      const strong = card.querySelector("strong");
      let priceText = strong ? strong.innerText : "0";
      priceText = priceText.replace(/[₹,\s]/g, "");
      booking.packagePrice = Number(priceText) || 0;
    });
  });

  document.getElementById("step1Next").onclick = () => {
    if (!booking.packageName && !booking.isCustom) {
      alert("Please select a service package OR use Customized Service");
      return;
    }
    showStep(2);
  };

  /* =====================================================
     CUSTOMIZE SECTION
  ===================================================== */
  function setupCustomizeSection(serviceType) {
    if (!customizeBox || !customizeOptionsDiv || !customTotalEl || !useCustomBtn) {
      // if customization html not added yet
      return;
    }

    const type = String(serviceType || "").toLowerCase();
    const options = CUSTOM_SERVICE_OPTIONS[type];

    if (!options) {
      customizeBox.style.display = "none";
      return;
    }

    customizeBox.style.display = "block";
    customizeOptionsDiv.innerHTML = "";

    // reset custom values
    booking.customServices = [];
    booking.customTotalPrice = 0;
    booking.isCustom = false;
    updateCustomTotalUI();

    options.forEach((opt, index) => {
      const id = `custom_${type}_${index}`;

      const row = document.createElement("label");
      row.className = "customize-option";
      row.setAttribute("for", id);

      row.innerHTML = `
        <input type="checkbox" id="${id}" data-name="${opt.name}" data-price="${opt.price}">
        <span class="customize-name">${opt.name}</span>
        <span class="customize-price">₹${opt.price}</span>
      `;

      customizeOptionsDiv.appendChild(row);
    });

    customizeOptionsDiv.querySelectorAll("input[type='checkbox']").forEach(chk => {
      chk.addEventListener("change", () => {
        const selected = [];
        let total = 0;

        customizeOptionsDiv.querySelectorAll("input[type='checkbox']:checked").forEach(c => {
          const name = c.dataset.name;
          const price = Number(c.dataset.price || 0);
          total += price;
          selected.push({ name, price });
        });

        booking.customServices = selected;
        booking.customTotalPrice = total;

        updateCustomTotalUI();
      });
    });
  }

  function updateCustomTotalUI() {
    if (!customTotalEl) return;
    customTotalEl.textContent = `₹${booking.customTotalPrice || 0}`;
  }

  if (useCustomBtn) {
    useCustomBtn.addEventListener("click", () => {
      if (!booking.customServices.length) {
        alert("Please select at least 1 service to customize");
        return;
      }

      // deselect package if any selected
      document.querySelectorAll(".package-card").forEach(c => c.classList.remove("selected"));

      booking.isCustom = true;
      booking.packageName = "Customized Service";
      booking.packagePrice = 0;

      alert("✅ Customized Service selected!");
    });
  }

  /* =====================================================
     STEP 2 — DATE & TIME
  ===================================================== */
  const dateInput = document.getElementById("serviceDate");
  dateInput.min = new Date().toISOString().split("T")[0];

  document.querySelectorAll(".time-slot").forEach(slot => {
    slot.onclick = () => {
      document.querySelectorAll(".time-slot").forEach(s => s.classList.remove("selected"));
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

  if (booking.serviceMode === "GARAGE") hideAddressBox();
  else showAddressBox();

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
    const summaryBox = document.getElementById("summaryBox");

    const customList =
      booking.customServices.map(s => `${s.name} (₹${s.price})`).join(", ");

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

      ${
        booking.isCustom
          ? `
            <p><strong>Customized Services:</strong> ${customList || "-"}</p>
            <p><strong>Expected Total:</strong> ₹${booking.customTotalPrice}</p>
          `
          : `<p><strong>Package Price:</strong> ₹${booking.packagePrice}</p>`
      }

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

    // ✅ Backend expects: customServiceNote + customPrice
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
      registrationNumber: booking.registrationNumber,

      // ✅ custom service mapping
      customServiceNote: booking.isCustom
        ? booking.customServices.map(s => `${s.name} (₹${s.price})`).join(", ")
        : null,

      customPrice: booking.isCustom ? booking.customTotalPrice : null
    };

    console.log("FINAL PAYLOAD:", payload);

    try {
      const res = await fetch(`${BASE}/api/customers/sendRequest`,
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

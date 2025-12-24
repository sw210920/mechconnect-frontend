// Simple state-less vanilla implementation of the signup behaviour

document.addEventListener('DOMContentLoaded', () => {
  // Tabs
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');

  const apiEndpoint="http://localhost:8080";

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      // toggle tab active
      tabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      // toggle panels
      panels.forEach(p => p.classList.toggle('active', p.id === target));
    });
  });

  // Password toggles (for all .toggle buttons)
  const toggles = document.querySelectorAll('.toggle');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.target;
      const input = document.getElementById(id);
      if (!input) return;
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      btn.textContent = isPwd ? '🙈' : '👁️';
    });
  });

  // Customer form submit
  const customerForm = document.getElementById('customerForm');
  customerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      mobailNumber: form.phone.value.trim(),
      address: form.address.value.trim(),
      password: form.password.value,
      confirmPassword: form.confirmPassword.value
    };

    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // placeholder: replace with real registration call
    console.log('Customer registration:', data);
    alert('Customer account created (simulated): ' + data.email);
    //apiservice.SignUpCustomer(data);

    // POST request to Spring Boot backend
fetch("http://localhost:6060/api/saveCustomer", {
  method: "POST",
  headers: {
   "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
})
  .then(response => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.text();
  })
  .then(data => console.log(data))
  .catch(error => console.error("Fetch error:", error));
    
    form.reset();
  });

  console.log("User saved");







  // Mechanic form submit
  const mechanicForm = document.getElementById('mechanicForm');
  mechanicForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      MobailNumber: form.phone.value.trim(),
    // YearsOfExperience: form.experience.value.trim(),
      YearsOfExperience: document.getElementById("mechanic-experience").value,

      Specialization: form.specialization.value.trim(),
    ServiceLocation: form.location.value.trim(),
          //ServiceLocation: document.getElementById("mechanic-location").trim,

     Certifications: form.certifications.value.trim(),
      Bio: form.bio.value.trim(),
      password: form.password.value,
      confirmPassword: form.confirmPassword.value
    };

    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
      return;
    }


      // POST request to Spring Boot backend
fetch("http://localhost:6060/api/saveMechanic", {
  method: "POST",
  headers: {
   "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
})
  .then(response => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.text();
  })
  .then(data => console.log(data))
  .catch(error => console.error("Fetch error:", error));
    
    form.reset();
  });

  console.log("Mechanic saved");



    // placeholder: replace with real registration call
    console.log('Mechanic registration:', data);
    alert('Mechanic account created (simulated): ' + data.email);
    form.reset();
  });



 // Load footer.html dynamically
  fetch("./footer/footer.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("footer").innerHTML = html;

      // Load footer.js AFTER inserting footer
      const script = document.createElement("script");
      script.src = "./footer/f-loader.js";
      script.defer = true;
      document.body.appendChild(script);
    })
    .catch(err => console.error("Footer load error:", err));


  const footerCSS = document.createElement("link");
footerCSS.rel = "stylesheet";
footerCSS.href = "./footer/footer.css/";   // correct path from signIn.html
document.head.appendChild(footerCSS);
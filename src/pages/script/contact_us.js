const form = document.getElementById("contactForm");
const successMsg = document.getElementById("successMessage");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Simple validation
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("message").value.trim();

  if (!name || !email || !msg) {
    alert("Please fill all fields!");
    return;
  }

  // Show success message
  successMsg.style.display = "block";

  // Clear form
  form.reset();

  // Hide message after 3 sec
  setTimeout(() => {
    successMsg.style.display = "none";
  }, 3000);
});

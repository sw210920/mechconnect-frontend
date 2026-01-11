(function () {

  const admin = JSON.parse(localStorage.getItem("mc_admin"));

  if (!admin || admin.role !== "ADMIN") {
    alert("Unauthorized access!");
    window.location.href = "./admin_login.html";
  }

})();

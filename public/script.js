document.addEventListener("DOMContentLoaded", function () {
console.log("JS is running");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  // Toggle menu
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Close when link clicked
  navItems.forEach(function(link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

});

document.getElementById("studentBtn").addEventListener("click", () => {
  window.location.href = "/student_dashboard/login.html";
});

document.getElementById("officerBtn").addEventListener("click", () => {
  window.location.href = "/admin_dashboard/adminlogin.html";
});


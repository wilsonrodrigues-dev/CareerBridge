const menuBtn = document.getElementById("menuToggle");
const closeBtn = document.getElementById("closeSidebar");
const sidebar = document.querySelector(".sidebar");
const overlay = document.getElementById("overlay");

function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
}

function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
}

menuBtn.addEventListener("click", openSidebar);
closeBtn.addEventListener("click", closeSidebar);
overlay.addEventListener("click", closeSidebar);


// Page switching
const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

navItems.forEach(item => {
    item.addEventListener("click", function (e) {
        e.preventDefault();
        console.log("Clicked nav item");

        const target = this.getAttribute("data-page");

        // Remove active sidebar highlight
        navItems.forEach(nav => nav.classList.remove("active"));
        this.classList.add("active");

        // Hide all pages
        pages.forEach(page => page.classList.remove("active-page"));

        // Show selected page
        document.getElementById(target).classList.add("active-page");

        // Close sidebar on mobile
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    });
});
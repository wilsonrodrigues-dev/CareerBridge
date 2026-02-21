const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token) {
  window.location.href = "/student_dashboard/login.html";
}




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

document.querySelectorAll(".viewmore-btn, .view-all").forEach(btn => {
    btn.addEventListener("click", function (e) {
        e.preventDefault();

        const targetPage = this.dataset.page;

        const sidebarLink = document.querySelector(
            `.nav-item[data-page="${targetPage}"]`
        );

        if (sidebarLink) {
            sidebarLink.click(); // simulate sidebar click
        }
    });
});

async function loadSkillGap() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/skill-gap/Software Engineer", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();

    const container = document.getElementById("skillGapContainer");

    container.innerHTML = `
      <div class="skill-icon">
        <span class="material-symbols-outlined">lightbulb</span>
      </div>

      <div class="skill-text">
        <h4>Smart Skill Gap Insight</h4>
        <p>
          Target Role: <strong>${data.role}</strong><br>
          Match Percentage: <strong>${data.matchPercentage}%</strong><br>
          Missing Skills:
          <strong>${data.missingSkills.join(", ") || "None"}</strong>
        </p>
      </div>
    `;

  } catch (err) {
    console.log("Skill gap error:", err);
  }
}

  loadSkillGap();

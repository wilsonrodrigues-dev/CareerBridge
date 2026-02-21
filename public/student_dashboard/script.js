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

let resumeform=document.getElementById("resumeForm");

let resumebtn=document.getElementById("resumegenerator").addEventListener("click",function(){
    resumeform.style.display="block";
});

document.getElementById("closeResumeForm").addEventListener("click", function(e){
    e.preventDefault();
    resumeform.style.display="none";
});

  document.getElementById("resumeForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const token = localStorage.getItem("token"); // or wherever you store it

  if (!token) {
    alert("Please login first");
    return;
  }

  const resumeData = {
    template: document.getElementById("template").value,
    summary: document.getElementById("summary").value,
    projects: [
      {
        title: document.getElementById("projectTitle").value,
        description: document.getElementById("projectDescription").value
      }
    ],
    certifications: [
      document.getElementById("certification").value
    ]
  };

  try {
    const response = await fetch("/api/resume/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(resumeData)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Resume generation failed");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
  resumeform.style.display="none";
});

// const userString = localStorage.getItem("user");

// const username = JSON.parse(userString);

// const uname = username.name;

// const display =document.querySelectorAll(".username")
// display.forEach(el => el.textContent = uname);

const userString = localStorage.getItem("user");

if (userString) {
  const username = JSON.parse(userString);
  const uname = username.name;

  const display = document.querySelectorAll(".username"); // ✅ dot for class

  display.forEach(el => el.textContent = uname);
}


document.getElementById("logoutBtn").addEventListener("click", () => {

  // Remove stored data
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Optional: clear everything
  // localStorage.clear();

  // Redirect to login page
  window.location.href = "/student_dashboard/login.html"; 
});

document.getElementById("backtohome").addEventListener("click", function(e){
    e.preventDefault();
    window.location.href = "/index.html";
});
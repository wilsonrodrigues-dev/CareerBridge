const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/admin_dashboard/adminlogin.html";
}

window.addEventListener("load", () => {
    document.body.style.visibility = "visible";
  const loader = document.getElementById("loader");
  loader.style.opacity = "0";
  loader.style.transition = "opacity 0.5s ease";
  setTimeout(() => loader.style.display = "none", 1000);
});

// ================================
// FETCH ADMIN STATS
// ================================

fetch("/api/admin/stats", {
  headers: {
    Authorization: "Bearer " + token,
  },
})
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("totalStudents").innerText = data.totalStudents;
    document.getElementById("totalDrives").innerText = data.totalDrives;
    document.getElementById("activeDrives").innerText = data.activeDrives;
    document.getElementById("totalApplications").innerText =
      data.totalApplications;
    document.getElementById("studentsPlaced").innerText = data.totalPlaced;
  });

// ================================
// FETCH OFFICER PROFILE
// ================================

fetch("/api/user/profile", {
  headers: {
    Authorization: "Bearer " + token,
  },
})
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("officerName").innerText = data.name;
  });

// ================================
// FETCH ACTIVE DRIVES
// ================================

fetch("/api/drive/all", {
  headers: {
    Authorization: "Bearer " + token,
  },
})
  .then((res) => res.json())
  .then((drives) => {
    const table = document.getElementById("drivesTableBody");

    table.innerHTML = drives
      .map(
        (drive) => `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="px-6 py-4 font-semibold">${drive.companyName}</td>
        <td class="px-6 py-4">${drive.role}</td>
        <td class="px-6 py-4 text-center">${drive.applicantCount || 0}</td>
        <td class="px-6 py-4">
          <span class="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
            ${drive.status}
          </span>
        </td>
        <td class="px-6 py-4 text-right">
      <button 
        class="viewApplicantsBtn text-primary font-bold text-sm"
        data-id="${drive._id}">
        View List
      </button>
        </td>
      </tr>
    `,
      )
      .join("");
  });

document
  .getElementById("drivesTableBody")
  .addEventListener("click", async (e) => {
    if (!e.target.classList.contains("viewApplicantsBtn")) return;

    const driveId = e.target.dataset.id;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/application/drive/${driveId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applicants");
      }

      const applicants = await response.json();

      console.log(applicants);

      showApplicantsModal(applicants);
    } catch (error) {
      console.error(error);
    //   alert("Error loading applicants");
    }
  });

  

  function showApplicantsModal(applicants) {

  const tbody = document.getElementById("applicantsTableBody");
  const modal = document.getElementById("applicantsModal");

  if (!tbody || !modal) {
    console.error("Modal elements not found");
    return;
  }

  if (applicants.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-4 text-gray-500">
          No applicants found
        </td>
      </tr>
    `;
  } else {

    tbody.innerHTML = applicants.map(app => `
      <tr class="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
        <td class="py-2 font-semibold">${app.student.name}</td>
        <td class="py-2">${app.student.email}</td>
        <td class="py-2">${app.student.academicInfo?.cgpa ?? "N/A"}</td>
        <td class="py-2">
          <span class="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">
            ${app.status}
          </span>
        </td>
      </tr>
    `).join("");

  }

  modal.classList.remove("hidden");
}

function closeApplicantsModal() {
  document.getElementById("applicantsModal")
    .classList.add("hidden");
}


// function viewApplicants(driveId) {
//   localStorage.setItem("selectedDrive", driveId);
//   window.location.href = "/applications.html";
// }

// ================================
// FETCH STUDENTS AT RISK
// ================================

fetch("/api/admin/students-at-risk", {
  headers: {
    Authorization: "Bearer " + token,
  },
})
  .then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch students");
    }
    return res.json();
  })
  .then((data) => {
    const container = document.getElementById("riskStudentsContainer");

    console.log(data);

    const studentArray = data.students; // <-- extract array

    container.innerHTML = studentArray
      .map(
        (student) => `
    <div class="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <div>
        <p class="text-sm font-bold">${student.name}</p>
        <div class="flex flex-wrap gap-1.5 mt-1">
          <span class="px-2 py-0.5 rounded text-[10px] bg-rose-100 text-rose-700 font-bold">
            CGPA ${student.cgpa ?? "N/A"}
          </span>
          <span class="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-700 font-bold">
            Backlogs ${student.backlogs ?? 0}
          </span>
        </div>
      </div>
    </div>
  `,
      )
      .join("");
  });
// ================================
// CREATE DRIVE FORM
// ================================

document.querySelector(".glass-card button").addEventListener("click", () => {
  const inputs = document.querySelectorAll(
    ".glass-card input, .glass-card select",
  );

  const companyName = inputs[0].value;
  const role = inputs[1].value;
  const minCgpa = inputs[2].value;
  const branches = inputs[3].value.split(",");

  fetch("/api/drive/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      companyName,
      role,
      criteria: {
        minCgpa: Number(minCgpa),
        allowedBranches: branches,
        maxBacklogs: 0,
      },
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Drive Created Successfully!");
      location.reload();
    });
});

// ================================
// create drive
// ================================
const createBtn = document.getElementById("createDriveBtn");

createBtn.addEventListener("click", async (e) => {
  e.preventDefault(); // prevents form submission if inside form

  try {
    createBtn.disabled = true; // prevent double click

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      return;
    }

    const companyName = document.getElementById("companyName").value.trim();
    const role = document.getElementById("jobRole").value.trim();
    const minCgpa = parseFloat(document.getElementById("minCgpa").value);
    const branchValue = document.getElementById("allowedBranches").value;

    if (!companyName || !role || isNaN(minCgpa)) {
      alert("Please fill all required fields");
      return;
    }

    const allowedBranches = branchValue.split(",").map((b) => b.trim());

    const driveData = {
      companyName,
      role,
      criteria: {
        minCgpa,
        allowedBranches,
        maxBacklogs: 0,
      },
    };

    console.log("Sending:", driveData);

    const response = await fetch("/api/admin/drives", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(driveData),
    });

    // ✅ Check status BEFORE parsing
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Drive creation failed");
    }

    const data = await response.json();

    alert(`✅ Drive created! ${data.eligibleCount} students eligible`);

    console.log("Success:", data);

    // Optional: Clear form
    document.getElementById("companyName").value = "";
    document.getElementById("jobRole").value = "";
    document.getElementById("minCgpa").value = "";
  } catch (error) {
    console.error("Error:", error);
    // alert(error.message || "Failed to create drive");
  } finally {
    createBtn.disabled = false; // re-enable button
  }
});


document.addEventListener("DOMContentLoaded", async () => {

  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/api/application/stats/applications", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const stats = await response.json();

    // Prepare 12 months default
    const monthCounts = new Array(12).fill(0);

    stats.forEach(item => {
      monthCounts[item._id - 1] = item.count;
    });

    const ctx = document.getElementById("applicationsChart");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "JAN","FEB","MAR","APR","MAY","JUN",
          "JUL","AUG","SEP","OCT","NOV","DEC"
        ],
        datasets: [{
          label: "Applications",
          data: monthCounts,
          backgroundColor: "#2D4A9E",
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  } catch (error) {
    console.error("Error loading stats:", error);
  }

});

document.getElementById("backtohome").addEventListener("click", () => {
  window.location.href = "/index.html";
});

const token = localStorage.getItem("token");

const form = document.querySelector(".btn");

form.addEventListener("submit", async (e) => {

  const cgpa = document.getElementById("cgpa").value;
  const branch = document.getElementById("branch").value;
  const backlogs = document.getElementById("backlogs").value;

  const res = await fetch("/api/user/complete-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      academicInfo: {
        cgpa,
        branch,
        backlogs
      },
      skills: ["React", "Node"]
    })
  });

  const data = await res.json();

  if (res.ok) {
    const user = JSON.parse(localStorage.getItem("user"));
    user.profileCompleted = true;
    localStorage.setItem("user", JSON.stringify(user));

    window.location.href = "/student_dashboard/student.html";
  } else {
    alert(data.message);
  }
});
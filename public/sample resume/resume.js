const token = localStorage.getItem("token");
const template = localStorage.getItem("resumeTemplate");

const styleLink = document.getElementById("template-style");

if (template === "modern") {
  styleLink.href = "modern-template.css";
} else {
  styleLink.href = "professional-template.css";
}

fetch("http://localhost:3000/api/resume/data", {
  headers: {
    Authorization: "Bearer " + token
  }
})
  .then(res => res.json())
  .then(data => renderResume(data));

function renderResume(data) {
  const container = document.getElementById("resume");

  if (template === "modern") {
    container.innerHTML = `
      <h1>${data.name}</h1>
      <p>${data.email}</p>

      <hr>

      <h3>Summary</h3>
      <p>${data.summary}</p>

      <h3>Skills</h3>
      <p>${data.skills.join(", ")}</p>

      <h3>Education</h3>
      <p>${data.branch} | CGPA: ${data.cgpa}</p>

      <h3>Projects</h3>
      ${data.projects.map(p => `
        <p><strong>${p.title}</strong><br>${p.description}</p>
      `).join("")}
    `;
  } else {
    container.innerHTML = `
      <div class="two-column">
        <div class="left">
          <h1>${data.name}</h1>
          <p>${data.email}</p>

          <h3>Summary</h3>
          <p>${data.summary}</p>

          <h3>Projects</h3>
          ${data.projects.map(p => `
            <p><strong>${p.title}</strong><br>${p.description}</p>
          `).join("")}
        </div>

        <div class="right">
          <h3>Skills</h3>
          <ul>
            ${data.skills.map(skill => `<li>${skill}</li>`).join("")}
          </ul>

          <h3>Education</h3>
          <p>${data.branch}</p>
          <p>CGPA: ${data.cgpa}</p>
        </div>
      </div>
    `;
  }
}
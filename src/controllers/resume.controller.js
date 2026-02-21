// const User = require("../models/user.model");

// exports.getResumeData = async (req, res) => {
//   try {
//     const student = await User.findById(req.user.id);

//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     res.json({
//       name: student.name,
//       email: student.email,
//       branch: student.academicInfo?.branch || "",
//       cgpa: student.academicInfo?.cgpa || "",
//       skills: student.skills || [],
//       summary: "Passionate student seeking placement opportunities.",
//       projects: [
//         {
//           title: "Placement Portal",
//           description: "Built full-stack placement management system."
//         }
//       ]
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };




const PDFDocument = require("pdfkit");
const User = require("../models/user.model");

exports.generateResume = async (req, res) => {
  try {
    const { template, summary, projects = [], certifications = [] } = req.body;

    const student = await User.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    // Set headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${student.name.replace(/\s+/g, "_")}_Resume.pdf`
    );

    doc.pipe(res);

    /* ===============================
       🟦 TEMPLATE 1 — MODERN
    =============================== */
    if (template === "modern") {
      // Name
      doc.fontSize(26).text(student.name, { align: "center" });
      doc.moveDown(0.5);

      // Contact
      doc.fontSize(12).text(student.email, { align: "center" });
      doc.moveDown(2);

      // Summary
      doc.fontSize(16).text("Professional Summary");
      doc.moveDown(0.5);
      doc.fontSize(12).text(summary || "N/A");
      doc.moveDown(1.5);

      // Skills
      doc.fontSize(16).text("Skills");
      doc.moveDown(0.5);
      doc.fontSize(12).text((student.skills || []).join(", ") || "N/A");
      doc.moveDown(1.5);

      // Education
      doc.fontSize(16).text("Education");
      doc.moveDown(0.5);
      doc.fontSize(12).text(
        `CGPA: ${student.academicInfo?.cgpa || "N/A"}`
      );
      doc.text(
        `Branch: ${student.academicInfo?.branch || "N/A"}`
      );
      doc.moveDown(1.5);

      // Projects
      doc.fontSize(16).text("Projects");
      doc.moveDown(0.5);
      projects.forEach(p => {
        doc.fontSize(12).text(`• ${p.title}`);
        doc.text(`  ${p.description}`);
        doc.moveDown(0.5);
      });

      // Certifications
      if (certifications.length > 0) {
        doc.moveDown(1);
        doc.fontSize(16).text("Certifications");
        doc.moveDown(0.5);
        certifications.forEach(c => {
          doc.fontSize(12).text(`• ${c}`);
        });
      }
    }

    /* ===============================
       🟩 TEMPLATE 2 — MINIMAL
    =============================== */
    else if (template === "minimal") {
      doc.fontSize(22).text(student.name);
      doc.fontSize(10).text(student.email);
      doc.moveDown(1.5);

      doc.fontSize(14).text("Summary");
      doc.moveDown(0.3);
      doc.fontSize(11).text(summary || "N/A");
      doc.moveDown(1);

      doc.fontSize(14).text("Skills");
      doc.moveDown(0.3);
      doc.fontSize(11).text((student.skills || []).join(", ") || "N/A");
      doc.moveDown(1);

      doc.fontSize(14).text("Academic Details");
      doc.moveDown(0.3);
      doc.fontSize(11).text(
        `CGPA: ${student.academicInfo?.cgpa || "N/A"}`
      );
      doc.text(
        `Branch: ${student.academicInfo?.branch || "N/A"}`
      );
      doc.moveDown(1);

      if (projects.length > 0) {
        doc.fontSize(14).text("Projects");
        doc.moveDown(0.3);
        projects.forEach(p => {
          doc.fontSize(11).text(`• ${p.title} - ${p.description}`);
        });
      }

      if (certifications.length > 0) {
        doc.moveDown(1);
        doc.fontSize(14).text("Certifications");
        doc.moveDown(0.3);
        certifications.forEach(c => {
          doc.fontSize(11).text(`• ${c}`);
        });
      }
    }

    /* ===============================
       ❗ If Template Invalid
    =============================== */
    else {
      doc.fontSize(16).text("Invalid template selected.");
    }

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating resume" });
  }
};






// // const PDFDocument = require("pdfkit");
// // const User = require("../models/user.model");

// // exports.generateResume = async (req, res) => {
// //   try {
// //     const { template, summary, projects, certifications } = req.body;

// //     const student = await User.findById(req.user.id);

// //     if (!student) {
// //       return res.status(404).json({ message: "Student not found" });
// //     }

// //     const doc = new PDFDocument();
// //     res.setHeader("Content-Type", "application/pdf");
// //     res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");

// //     doc.pipe(res);

// //     // ======================
// //     // TEMPLATE SWITCH
// //     // ======================

// //     if (template === "modern") {
// //       doc.fontSize(24).text(student.name, { align: "center" });
// //       doc.moveDown();
// //       doc.fontSize(12).text(student.email, { align: "center" });
// //       doc.moveDown(2);

// //       doc.fontSize(16).text("Professional Summary");
// //       doc.fontSize(12).text(summary);
// //       doc.moveDown();

// //       doc.fontSize(16).text("Skills");
// //       doc.text(student.skills.join(", "));
// //       doc.moveDown();

// //       doc.fontSize(16).text("Projects");
// //       projects.forEach(p => {
// //         doc.text(`• ${p.title}: ${p.description}`);
// //       });

// //     } else if (template === "minimal") {
// //       doc.fontSize(20).text(student.name);
// //       doc.fontSize(10).text(student.email);
// //       doc.moveDown();

// //       doc.text("Summary:");
// //       doc.text(summary);
// //       doc.moveDown();

// //       doc.text("Skills:");
// //       doc.text(student.skills.join(", "));
// //       doc.moveDown();

// //       doc.text("Certifications:");
// //       certifications.forEach(c => doc.text(`• ${c}`));
// //     }

// //     doc.end();

// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Error generating resume" });
// //   }
// // };




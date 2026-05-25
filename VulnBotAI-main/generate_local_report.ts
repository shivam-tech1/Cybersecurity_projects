import fs from "fs-extra";
import path from "path";
import { generateReportDocx } from "./reportGenerator";

async function main() {
  console.log("Generating local formal academic project report...");
  const meta = {
    studentName: "VISHWAS THUMMAR",
    rollNumber: "21BCE0456",
    guideName: "PROF. SANJAY SHARMA",
    institution: "SWARRNIM STARTUP & INNOVATION UNIVERSITY",
    academicYear: "2025-2026"
  };

  try {
    const buffer = await generateReportDocx(meta);
    const outputPath = path.join(process.cwd(), "Project_Report_VulnBot.docx");
    await fs.writeFile(outputPath, buffer);
    console.log(`Successfully compiled and saved Project Report to direct workspace: ${outputPath}`);
  } catch (error) {
    console.error("Failed to compile localized docx report:", error);
    process.exit(1);
  }
}

main();

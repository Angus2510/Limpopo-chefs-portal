import { PrismaClient } from "@prisma/client";
import puppeteer from "puppeteer";
import archiver from "archiver";
import stream from "stream";
import fs from "fs";
import path from "path";
import dbConnect from "../../../utils/dbConnect";

const prisma = new PrismaClient();
const CONCURRENT_LIMIT = 5;

// Function to round numbers as per the requirement
const round = (value) => Math.floor(value + 0.5);

// Function to convert image to base64
const imageToBase64 = (filePath) => {
  const image = fs.readFileSync(filePath);
  return `data:image/png;base64,${image.toString("base64")}`;
};

const generatePdfForStudent = async (student, results, logoBase64, archive) => {
  try {
    let studentResults = results.filter((result) =>
      result.results.some((r) => r.student.id === student.id)
    );

    // Sort the results in ascending order based on the outcome title
    studentResults.sort((a, b) => {
      const outcomeA = a.outcome ? a.outcome.title : "Unknown";
      const outcomeB = b.outcome ? b.outcome.title : "Unknown";
      return outcomeA.localeCompare(outcomeB);
    });

    // Initialize overall outcome
    let overallOutcome = "C";

    // HTML content for the PDF
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; }
            .header img { width: 300px; height: auto; }
            .title { font-size: 24px; margin-top: 20px; font-weight: bold; margin-bottom: 5px; }
            .student-details-table, .results-table, .additional-table { font-size: 12px; } 
            .qualification {margin-bottom: 30px}
            .student-details-table { margin-bottom: 20px; border-collapse: collapse; }
            .student-details-table th, .student-details-table td { padding: 4px 8px; text-align: left; border: none; }
            .student-details-table th { font-weight: normal; } 
            .student-details-table td { font-weight: bold; }
            .certification { font-size: 12px; margin-bottom: 20px; }
            .results-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .results-table th, .results-table td { border: 1px solid #ddd; padding: 4px; text-align: left; }
            .results-table th { background-color: #f2f2f2; }
            .footer { font-size: 12px; text-align: left; margin-top: 20px; margin-bottom: 40px; }
            .final-outcome { font-size: 16px; margin-top: 20px; text-align: center; }
            .additional-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .additional-table th, .additional-table td { border: 1px solid #ddd; padding: 4px; text-align: left; }
            .additional-table th { background-color: #f2f2f2; }
            h2 { text-align: left; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoBase64}" alt="Logo">
            <div class="title">Statement of Results</div>
            <div class="qualification">${student.qualification
              .map((q) => q.title)
              .join(", ")}</div>
          </div>
          <table class="student-details-table">
            <tr>
              <th>Date of Print:</th>
              <td>${new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <th>Student No:</th>
              <td>${student.admissionNumber}</td>
            </tr>
            <tr>
              <th>Student Name:</th>
              <td>${student.profile.firstName} ${student.profile.lastName}</td>
            </tr>
            <tr>
              <th>School Name:</th>
              <td>Limpopo Chefs Academy</td>
            </tr>
            <tr>
              <th>Campus:</th>
              <td>${student.campus.map((c) => c.title).join(", ")}</td>
            </tr>
          </table>
          <div class="certification">
            <p>This certifies that the above student has achieved the below results for the academic year as of the date of print of this statement of results.</p>
          </div>
          <div class="results">
            <table class="results-table">
              <tr>
                <th>Outcome</th>
                <th>Test Score</th>
                <th>Task Score</th>
                <th>Outcome Result</th>
                <th>Overall Outcome</th>
              </tr>
              ${studentResults
                .map((result) => {
                  const studentResult = result.results.find(
                    (r) => r.student.id === student.id
                  );
                  const outcomeTitle = result.outcome
                    ? result.outcome.title
                    : "Unknown";

                  if (
                    result.resultType === "Theory" &&
                    studentResult.testScore === 0 &&
                    studentResult.taskScore === 0
                  ) {
                    return "";
                  }

                  if (
                    result.resultType !== "Theory" &&
                    studentResult.score === 0
                  ) {
                    return "";
                  }

                  let testScore = "";
                  let taskScore = "";
                  let individualOutcome;
                  let competent;

                  if (result.resultType === "Theory") {
                    const averageScore =
                      (studentResult.testScore + studentResult.taskScore) / 2;
                    individualOutcome = round(averageScore);
                    testScore = `${round(studentResult.testScore)}%`;
                    taskScore = `${round(studentResult.taskScore)}%`;
                    competent = individualOutcome >= 60 ? "C" : "NYC";
                  } else if (result.resultType === "Practical") {
                    individualOutcome = round(studentResult.score);
                    competent = individualOutcome >= 70 ? "C" : "NYC";
                  } else if (result.resultType === "Exam/Well") {
                    individualOutcome = round(studentResult.score);
                    competent = individualOutcome >= 60 ? "C" : "NYC";
                  }

                  if (competent === "NYC") {
                    overallOutcome = "NYC";
                  }

                  if (individualOutcome === undefined) {
                    return "";
                  }

                  return `
                  <tr>
                    <td>${outcomeTitle}</td>
                    <td>${testScore}</td>
                    <td>${taskScore}</td>
                    <td>${individualOutcome}%</td>
                    <td>${competent}</td>
                  </tr>
                `;
                })
                .join("")}
            </table>
            <div class="final-outcome">
              <p>Final Outcome: ${overallOutcome}</p>
            </div>
          </div>
          <div class="footer">
            <p>Please note: This is a computer-generated copy. No manual alterations to be accepted.</p>
            <p>Should you wish to receive a verified and signed copy of this Statement of Results, please contact the respective campus:</p>
            <p>Mokopane (015) 491 1226 or reception@limpopochefs.co.za</p>
            <p>Polokwane (015) 292 0102 or polokwane@limpopochefs.co.za</p>
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "40px", bottom: "40px", left: "40px", right: "40px" },
      timeout: 60000, // Increase the timeout to 60 seconds
    });
    await browser.close();

    const fileName = `${student.admissionNumber}_${
      new Date().toISOString().split("T")[0]
    }_sor.pdf`;
    archive.append(pdfBuffer, { name: fileName });
  } catch (error) {
    console.error(
      "Error generating PDF for student:",
      student.admissionNumber,
      error
    );
    throw error;
  }
};

const generatePdfsInBatches = async (
  students,
  results,
  logoBase64,
  archive,
  limit
) => {
  let index = 0;
  while (index < students.length) {
    const batch = students.slice(index, index + limit);
    await Promise.all(
      batch.map((student) =>
        generatePdfForStudent(student, results, logoBase64, archive)
      )
    );
    index += limit;
  }
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }

  try {
    const { studentIds } = req.query;
    const idsArray = studentIds.split(",");

    // Validate all student IDs
    for (const id of idsArray) {
      if (!id) {
        return res.status(400).json({ message: "Invalid student ID." });
      }
    }

    // Fetch students from Prisma
    const students = await prisma.student.findMany({
      where: { id: { in: idsArray } },
      include: {
        profile: true,
        campus: true,
        qualification: true,
      },
    });

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found." });
    }

    // Fetch results from Prisma
    const results = await prisma.result.findMany({
      where: {
        results: {
          some: {
            studentId: { in: idsArray },
          },
        },
      },
      include: {
        results: {
          where: {
            studentId: { in: idsArray },
          },
        },
        outcome: true,
      },
    });

    if (results.length === 0) {
      return res.status(404).json({ message: "No results found." });
    }

    // Create a zip stream
    const zipStream = new stream.PassThrough();
    const archive = archiver("zip", { zlib: { level: 9 } });

    // Set response headers before any data is sent
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=students_results.zip"
    );

    // Pipe the zip stream to the response
    zipStream.pipe(res);

    // Path to the logo image
    const logoPath = path.join(process.cwd(), "public", "img", "logo.png");
    const logoBase64 = imageToBase64(logoPath);

    // Start archiving the PDFs for the students
    archive.on("end", () => {
      console.log("Archiving finished.");
    });

    archive.on("error", (err) => {
      res.status(500).json({ error: err.message });
    });

    archive.pipe(zipStream);

    // Generate PDFs in batches
    await generatePdfsInBatches(
      students,
      results,
      logoBase64,
      archive,
      CONCURRENT_LIMIT
    );

    // Finalize the archive and send it
    archive.finalize();
  } catch (error) {
    console.error("Error generating PDF zip:", error);
    res.status(500).json({ error: error.message });
  }
}

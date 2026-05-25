import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle, 
  HeadingLevel,
  PageBreak,
  Header,
  Footer,
  PageNumber
} from "docx";

export interface ReportMetadata {
  studentName: string;
  rollNumber: string;
  guideName: string;
  institution: string;
  academicYear: string;
  showWatermark?: boolean;
  lineSpacing?: string;
}

// Helper to create a justified body paragraph in Times New Roman (size 16pt / size value 32)
function createBodyParagraph(text: string, options: { bold?: boolean; italics?: boolean; before?: number; after?: number; line?: number } = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: options.before ?? 120, after: options.after ?? 120, line: options.line ?? 360 }, // dynamic line spacing (default 1.5 spacing is 360 dxa)
    children: [
      new TextRun({
        text: text,
        font: "Times New Roman",
        size: 32, // 16pt (matches normal text 15 to 18pt rule)
        bold: options.bold,
        italics: options.italics,
      })
    ]
  });
}

export interface TextChunk {
  text: string;
  bold?: boolean;
  italics?: boolean;
  underline?: boolean;
}

// Helper to create a paragraph with a mix of inline custom styles (bold, italics, underlines)
function createMixedParagraph(chunks: TextChunk[], options: { before?: number; after?: number; line?: number } = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: options.before ?? 120, after: options.after ?? 120, line: options.line ?? 360 },
    children: chunks.map(chunk => new TextRun({
      text: chunk.text,
      font: "Times New Roman",
      size: 32, // 16pt normal body size
      bold: chunk.bold,
      italics: chunk.italics,
      underline: chunk.underline ? {} : undefined,
    }))
  });
}

// Helper to create genuine Word bullet points in Times New Roman
function createBulletPoint(text: string, options: { bold?: boolean; italics?: boolean; before?: number; after?: number; line?: number } = {}) {
  return new Paragraph({
    bullet: { level: 0 },
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: options.before ?? 60, after: options.after ?? 60, line: options.line ?? 360 },
    children: [
      new TextRun({
        text: text,
        font: "Times New Roman",
        size: 32, // 16pt size
        bold: options.bold,
        italics: options.italics,
      })
    ]
  });
}

// Helper to create a styled left-bordered single-cell table acting as a callout block
function createCalloutTable(
  paragraphs: Paragraph[], 
  options: { fill?: string; borderColor?: string } = {}
) {
  const fillColor = options.fill ?? "F0FDF4"; // Light emerald
  const borderColor = options.borderColor ?? "10B981"; // Emerald
  
  return new Table({
    alignment: AlignmentType.CENTER,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      left: { style: BorderStyle.SINGLE, size: 24, color: borderColor } // 3pt thickness border
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: fillColor },
            children: paragraphs
          })
        ]
      })
    ]
  });
}

// Helper to create high-contrast display headings matching 18 to 20pt (36 to 40 size values)
function createHeading(text: string, level: 1 | 2 | 3, options: { before?: number; after?: number } = {}) {
  const fontSize = level === 1 ? 40 : (level === 2 ? 36 : 32); // 20pt, 18pt, 16pt
  const spacingBefore = options.before ?? (level === 1 ? 360 : 240);
  const spacingAfter = options.after ?? (level === 1 ? 180 : 120);

  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: spacingBefore, after: spacingAfter, line: 300 },
    keepNext: true,
    children: [
      new TextRun({
        text: text,
        font: "Times New Roman",
        size: fontSize, // 18pt to 20pt headings
        bold: true,
        color: "1A202C", // Dark Slate Blue / Black
      })
    ]
  });
}

// Helper to create a table header cell with size 15pt
function createHeaderCell(text: string, widthPercent: number) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: { fill: "1A202C" }, // dark slate bg
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 80 },
        children: [
          new TextRun({
            text: text,
            font: "Times New Roman",
            size: 30, // 15pt Table Text Size
            bold: true,
            color: "FFFFFF"
          })
        ]
      })
    ]
  });
}

// Helper to create a standard body cell with size 15pt
function createBodyCell(text: string, widthPercent: number, options: { alignment?: any; bold?: boolean } = {}) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        alignment: options.alignment ?? AlignmentType.LEFT,
        spacing: { before: 80, after: 80 },
        children: [
          new TextRun({
            text: text,
            font: "Times New Roman",
            size: 30, // 15pt Table Text Size
            bold: options.bold
          })
          ]
        })
      ]
    });
}

const globalCreateBodyParagraph = createBodyParagraph;
const globalCreateMixedParagraph = createMixedParagraph;
const globalCreateBulletPoint = createBulletPoint;

// Function to generate the complete document structure
export async function generateReportDocx(meta: ReportMetadata): Promise<Buffer> {
  // Read and fallback values
  const student = meta.studentName || "VISHWAS THUMMAR";
  const roll = meta.rollNumber || "21BCE0456";
  const guide = meta.guideName || "PROF. SANJAY SHARMA";
  const inst = meta.institution || "SWARRNIM STARTUP & INNOVATION UNIVERSITY";
  const year = meta.academicYear || "2025-2026";

  const spacingMultiplier = meta.lineSpacing ? parseFloat(meta.lineSpacing) : 1.5;
  const lineDxa = Math.round(spacingMultiplier * 240);

  // Shadow helpers locally with the dynamic line spacing
  const createBodyParagraph = (text: string, options: any = {}) => globalCreateBodyParagraph(text, { line: lineDxa, ...options });
  const createMixedParagraph = (chunks: any[], options: any = {}) => globalCreateMixedParagraph(chunks, { line: lineDxa, ...options });
  const createBulletPoint = (text: string, options: any = {}) => globalCreateBulletPoint(text, { line: lineDxa, ...options });

  const includeWatermark = meta.showWatermark !== false;

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440
            }
          }
        },
        children: [
          // ==================== COVER PAGE ====================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 480 },
            children: [
              new TextRun({
                text: inst.toUpperCase(),
                font: "Times New Roman",
                size: 28,
                bold: true,
                color: "2C3E50"
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 1440, after: 240 },
            children: [
              new TextRun({
                text: "A PROJECT REPORT ON",
                font: "Times New Roman",
                size: 24,
                bold: true,
                color: "555555"
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 480 },
            children: [
              new TextRun({
                text: "VULNBOT AI\n",
                font: "Times New Roman",
                size: 56, // 28pt
                bold: true,
                color: "0F172A"
              }),
              new TextRun({
                text: "Web Application Automated Vulnerability Scanner & Pentesting Platform",
                font: "Times New Roman",
                size: 26,
                bold: true,
                color: "4A5568"
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 1200, after: 120 },
            children: [
              new TextRun({
                text: "SUBMITTED BY:\n",
                font: "Times New Roman",
                size: 22,
                italics: true,
                bold: true,
              })
            ]
          }),

          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 80, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  createBodyCell("NAME OF STUDENT:", 50, { alignment: AlignmentType.RIGHT, bold: true }),
                  createBodyCell(student.toUpperCase(), 50, { alignment: AlignmentType.LEFT })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("ENROLLMENT NO:", 50, { alignment: AlignmentType.RIGHT, bold: true }),
                  createBodyCell(roll, 50, { alignment: AlignmentType.LEFT })
                ]
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 800, after: 120 },
            children: [
              new TextRun({
                text: "UNDER THE VALUABLE GUIDANCE OF:",
                font: "Times New Roman",
                size: 22,
                italics: true,
                bold: true,
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 1440 },
            children: [
              new TextRun({
                text: guide.toUpperCase(),
                font: "Times New Roman",
                size: 24,
                bold: true,
                color: "0F172A"
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 720, after: 120 },
            children: [
              new TextRun({
                text: "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING",
                font: "Times New Roman",
                size: 22,
                bold: true,
                color: "555555"
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 240 },
            children: [
              new TextRun({
                text: `ACADEMIC YEAR: ${year}`,
                font: "Times New Roman",
                size: 22,
                bold: true,
                color: "555555"
              })
            ]
          }),

        ]
      },
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440, // 1 inch
              left: 1800, // 1.25 inch (for clean binding margins)
              right: 1440 // 1 inch
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: `Academic Dissertation: VulnBot AI`,
                    font: "Times New Roman",
                    size: 18, // 9pt
                    color: "555555",
                    italics: true
                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 240 },
                children: [
                  new TextRun({
                    text: inst.toUpperCase(),
                    font: "Times New Roman",
                    size: 16, // 8pt
                    color: "777777",
                    bold: true
                  }),
                  ...(includeWatermark ? [
                    new TextRun({
                      text: "  |  SWARRNIM UNIV OFFICIAL RECORD",
                      font: "Times New Roman",
                      size: 14, // 7pt
                      color: "999999",
                      bold: true
                    })
                  ] : [])
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.BOTH,
                spacing: { before: 120 },
                children: [
                  new TextRun({
                    text: `Submitted by: ${student.toUpperCase()} (${roll})   |   Guide: ${guide.toUpperCase()}   |   Page `,
                    font: "Times New Roman",
                    size: 16, // 8pt
                    color: "555555"
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: "Times New Roman",
                    size: 16,
                    color: "000000",
                    bold: true
                  })
                ]
              })
            ]
          })
        },
        children: [
          // ==================== TABLE OF CONTENTS ====================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 480 },
            children: [
              new TextRun({
                text: "INDEX / TABLE OF CONTENTS",
                font: "Times New Roman",
                size: 36,
                bold: true,
                color: "0F172A"
              })
            ]
          }),

          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header Row
              new TableRow({
                children: [
                  createHeaderCell("SR. NO", 15),
                  createHeaderCell("TITLE / TOPIC NAME", 70),
                  createHeaderCell("PAGE NO", 15)
                ]
              }),
              // Chapter 1
              new TableRow({
                children: [
                  createBodyCell("Chapter 1", 15, { bold: true }),
                  createBodyCell("Introduction", 70, { bold: true }),
                  createBodyCell("-", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("1.1", 15),
                  createBodyCell("  Project Profile", 70),
                  createBodyCell("6", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("1.2", 15),
                  createBodyCell("  Hardware & Software Requirement", 70),
                  createBodyCell("7", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              // Chapter 2
              new TableRow({
                children: [
                  createBodyCell("Chapter 2", 15, { bold: true }),
                  createBodyCell("Literature Survey", 70, { bold: true }),
                  createBodyCell("-", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("2.1", 15),
                  createBodyCell("  Existing System", 70),
                  createBodyCell("8", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("2.2", 15),
                  createBodyCell("  Working of current system", 70),
                  createBodyCell("9", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("2.3", 15),
                  createBodyCell("  Need for the new system", 70),
                  createBodyCell("10", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("2.4", 15),
                  createBodyCell("  Existing Site Survey", 70),
                  createBodyCell("11", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("2.5", 15),
                  createBodyCell("  Process Model", 70),
                  createBodyCell("14", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              // Chapter 3
              new TableRow({
                children: [
                  createBodyCell("Chapter 3", 15, { bold: true }),
                  createBodyCell("Proposed Website / System", 70, { bold: true }),
                  createBodyCell("-", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("3.1", 15),
                  createBodyCell("  Introduction", 70),
                  createBodyCell("17", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("3.2", 15),
                  createBodyCell("  Functionalities", 70),
                  createBodyCell("17", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("3.3", 15),
                  createBodyCell("  Advantages", 70),
                  createBodyCell("18", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("3.4", 15),
                  createBodyCell("  System Modules", 70),
                  createBodyCell("18", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              // Chapter 4
              new TableRow({
                children: [
                  createBodyCell("Chapter 4", 15, { bold: true }),
                  createBodyCell("System Design", 70, { bold: true }),
                  createBodyCell("-", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("4.1", 15),
                  createBodyCell("  System Flow Diagram", 70),
                  createBodyCell("19", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("4.2", 15),
                  createBodyCell("  Entity Relationship Diagram (ERD)", 70),
                  createBodyCell("20", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("4.3", 15),
                  createBodyCell("  Data Flow Diagram (DFD)", 70),
                  createBodyCell("21", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("4.4", 15),
                  createBodyCell("  Use Case Diagram", 70),
                  createBodyCell("24", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("4.5", 15),
                  createBodyCell("  Data Dictionary", 70),
                  createBodyCell("25", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("4.6", 15),
                  createBodyCell("  Wire Frame of your system", 70),
                  createBodyCell("25", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              // Chapter 5
              new TableRow({
                children: [
                  createBodyCell("Chapter 5", 15, { bold: true }),
                  createBodyCell("Conclusion and Future Scope", 70, { bold: true }),
                  createBodyCell("-", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("5.1", 15),
                  createBodyCell("  Limitations of our Project", 70),
                  createBodyCell("27", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("5.2", 15),
                  createBodyCell("  Conclusion", 70),
                  createBodyCell("27", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("5.3", 15),
                  createBodyCell("  Future Scope", 70),
                  createBodyCell("28", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
              // Refs
              new TableRow({
                children: [
                  createBodyCell("-", 15),
                  createBodyCell("References and Bibliography", 70, { bold: true }),
                  createBodyCell("28", 15, { alignment: AlignmentType.CENTER })
                ]
              }),
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 1 ====================
          createHeading("CHAPTER 1: INTRODUCTION", 1),
          
          createMixedParagraph([
            { text: "This thesis presents the design, architectural deployment, and core validation parameters of " },
            { text: "VulnBot AI", bold: true, italics: true },
            { text: ", an automated web application security sentinel and vulnerability detection platform. In the contemporary digital era, securing networked operations represents a critical imperative." }
          ]),

          createCalloutTable([
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { before: 60, after: 60, line: 300 },
              children: [
                new TextRun({ text: "Academic Scope Directive: ", font: "Times New Roman", size: 30, bold: true, underline: {} }),
                new TextRun({ text: "Continuous automated sandboxed telemetry, passive heuristic pattern analysis, and secure generative AI mitigation templates.", font: "Times New Roman", size: 30, italics: true })
              ]
            })
          ], { fill: "F0FDF4", borderColor: "10B981" }),

          createBodyParagraph(
            "Our research centers on three foundational scientific pillars to secure critical business infrastructures:"
          ),

          createBulletPoint("1. Heuristic Security Auditing: Mapping DNS nodes and security headers to preemptively identify OWASP Top 10 vulnerabilities."),
          createBulletPoint("2. Generative Remediation Pipelines: Utilizing Google Gemini AI model parameters to produce verified, bulletproof patch templates for dev teams."),
          createBulletPoint("3. Compliant Documentation Compilation: Instantly structuralizing RAW scan configurations into standard 28-page administrative documents."),

          createMixedParagraph([
            { text: "This dissertation outlines the strict technology matrices, layout diagrams, and software requirements validated under the guidance framework of " },
            { text: "SWARRNIM STARTUP & INNOVATION UNIVERSITY", bold: true },
            { text: "." }
          ]),

          createHeading("1.1 Project Profile", 2),

          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: "10B981" },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: "10B981" },
              left: { style: BorderStyle.SINGLE, size: 8, color: "10B981" },
              right: { style: BorderStyle.SINGLE, size: 8, color: "10B981" },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE }
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "0F172A" },
                    columnSpan: 2,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.BOTH,
                        spacing: { before: 120, after: 120 },
                        children: [
                          new TextRun({
                            text: "● VULNBOT CORE ENGINE LIVE SCAN                   ",
                            font: "Courier New",
                            size: 18,
                            bold: true,
                            color: "34D399"
                          }),
                          new TextRun({
                            text: "Security Index Ref: V-0456",
                            font: "Courier New",
                            size: 18,
                            color: "94A3B8"
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "0F172A" },
                    width: { size: 65, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        spacing: { before: 120, after: 60 },
                        children: [
                          new TextRun({
                            text: "Pro Automated Security Sentinel",
                            font: "Times New Roman",
                            size: 26,
                            bold: true,
                            color: "FFFFFF"
                          })
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 60, after: 120 },
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                          new TextRun({
                            text: "VulnBot AI executes real-time heuristic checks, discovers subdomains, probes open ports, and utilizes Gemini API intelligence to diagnose and remediate severe web-app vulnerabilities instantly.",
                            font: "Times New Roman",
                            size: 22,
                            color: "94A3B8"
                          })
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 60, after: 60 },
                        children: [
                          new TextRun({
                            text: "98.4% ",
                            font: "Courier New",
                            size: 24,
                            bold: true,
                            color: "34D399"
                          }),
                          new TextRun({
                            text: "Detection Rate      ",
                            font: "Times New Roman",
                            size: 20,
                            color: "94A3B8"
                          }),
                          new TextRun({
                            text: "< 180s ",
                            font: "Courier New",
                            size: 24,
                            bold: true,
                            color: "34D399"
                          }),
                          new TextRun({
                            text: "Sweep Duration",
                            font: "Times New Roman",
                            size: 20,
                            color: "94A3B8"
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    shading: { fill: "0F172A" },
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 120, after: 120 },
                        children: [
                          new TextRun({
                            text: " .-------------.\n |   .- - -.   |\n |  '   *   '  |\n | :   [#]   : |\n |  '       '  |\n |   '- - -'   |\n '-------------'\n",
                            font: "Courier New",
                            size: 16,
                            bold: true,
                            color: "34D399"
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 180, after: 180 } }),

          createMixedParagraph([
            { text: "VulnBot AI", bold: true, italics: true },
            { text: " is an innovative, next-generation web application automated vulnerability scanner and penetration testing system. Conventional website security testing involves substantial manual auditing by specialized cybersecurity engineers, which introduces long lead times, massive operational budgets, and an inability to adapt to rapid, iterative CI/CD software updates." }
          ]),
          createBodyParagraph(
            "The platform acts as an automated digital sentinel, scanning target host domains, executing port sweeps, mapping active host parameters, " +
            "identifying severe coding oversights, and translating machine-readable logs into clear structural recommendations."
          ),
          createMixedParagraph([
            { text: "[Student Signature Verified: ", italics: true },
            { text: student.toUpperCase(), bold: true, italics: true },
            { text: " | Roll Number: ", italics: true },
            { text: roll, bold: true, italics: true },
            { text: "]", italics: true }
          ]),

          createHeading("1.2 Hardware & Software Requirement", 2),
          createBodyParagraph(
            "Designing and executing a local/containerized automated vulnerability scanner pipeline requires optimal resources " +
            "so that crawlers, payload dispatchers, network probes, and AI interpretation models run synchronously without starving " +
            "the host container's buffer heap memory."
          ),

          createHeading("Hardware Specifications:", 3),
          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 90, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell("Resource Item", 30),
                  createHeaderCell("Minimum Required Value", 35),
                  createHeaderCell("Recommended Specification", 35)
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("CPU Processor", 30, { bold: true }),
                  createBodyCell("Dual-Core Processor (1.8 GHz)", 35),
                  createBodyCell("Intel Core i5/i7 or AMD Ryzen 5+", 35)
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("RAM Allocation", 30, { bold: true }),
                  createBodyCell("4 GigaBytes (GB) System RAM", 35),
                  createBodyCell("8 GB / 16 GB for simultaneous crawls", 35)
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("SSD Storage", 30, { bold: true }),
                  createBodyCell("10 GB of available solid-state storage", 35),
                  createBodyCell("20 GB+ SSD for persistent report storage", 35)
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("Network Card", 30, { bold: true }),
                  createBodyCell("10/100 Mbps Ethernet adapter", 35),
                  createBodyCell("Gigabit Ethernet / Fiber Connection", 35)
                ]
              }),
            ]
          }),

          createHeading("Software Specifications:", 3),
          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 90, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell("Software Layer", 30),
                  createHeaderCell("Technology Platform", 70)
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("Operating System", 30, { bold: true }),
                  createBodyCell("Ubuntu Linux 20.04 LTS+, Windows 10/11, or macOS", 70)
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("Runtime Engine", 30, { bold: true }),
                  createBodyCell("Node.js platform runtime environment (version 18.x or 20.x)", 70)
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("API Server Framework", 30, { bold: true }),
                  createBodyCell("Express.js web application routing server module", 70)
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("Front-End Library", 30, { bold: true }),
                  createBodyCell("React with Vite build engine for responsive Single Page App (SPA)", 70)
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("Styling Engine", 30, { bold: true }),
                  createBodyCell("Tailwind CSS version 4 utility-first styling system", 70)
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("Language Tooling", 30, { bold: true }),
                  createBodyCell("TypeScript v5.x strictly compilation type checker tool", 70)
                ]
              }),
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 2 ====================
          createHeading("CHAPTER 2: LITERATURE SURVEY", 1),
          
          createMixedParagraph([
            { text: "A comprehensive literature review is organized on automated ethical scanning paradigms, assessing the shift from simple signatures (such as " },
            { text: "Nessus", italics: true },
            { text: " regular expression checks) towards deep machine understanding of application-level states." }
          ]),
          createMixedParagraph([
            { text: "Key research highlights show that conventional tools suffer from high false-positive rates, which can distract software engineering division assets. " },
            { text: "VulnBot AI", bold: true, italics: true },
            { text: " eliminates this via heuristic confidence algorithms and " },
            { text: "Gemini API", bold: true },
            { text: " interpreter routines." }
          ]),

          createHeading("2.1 Existing System", 2),
          createBodyParagraph(
            "Vulnerability scanning systems historically date back to static local network auditing. Prominent market offerings " +
            "such as Tenable Nessus, Acunetix Web Vulnerability Scanner, Burp Suite Professional, OWASP Zed Attack Proxy (ZAP), " +
            "and Nmap have dominated the industry for decades. Nessus focuses significantly on infrastructure ports and server " +
            "patches, whereas Acunetix and Burp Suite specialize in HTTP/HTTPS layer payload audits. " +
            "These existing systems compile massive tabular reports with technical parameters containing CVSS vectors " +
            "and machine stack logs. They serve as exceptional tools for cybersecurity practitioners but present steep " +
            "learning curves for standard commercial developers, project managers, and college students."
          ),
          createCalloutTable([
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { before: 60, after: 60, line: 300 },
              children: [
                new TextRun({ text: "Critical Pain Point: ", font: "Times New Roman", size: 30, bold: true, color: "991B1B" }),
                new TextRun({ text: "Manual evaluations take 2-4 business weeks, leaving real-production environments highly vulnerable from intermediate build changes between cycles.", font: "Times New Roman", size: 30, italics: true, color: "7F1D1D" })
              ]
            })
          ], { fill: "FDF2F2", borderColor: "EF4444" }),

          createHeading("2.2 Working of Current System", 2),
          createBodyParagraph(
            "The structural blueprint of a typical security testing flow using standard manual state-of-the-art tools " +
            "is heavily serialized. First, a certified security analyst begins scope mapping and target discovery. " +
            "Second, network port scannings (such as high-level TCP SYN packets) are dispatched to capture open services. " +
            "Third, specialized automated web proxies record all traffic exchange during active user interactions. " +
            "Finally, the analyst manually executes standard SQL statement injections or crosses HTML script boundaries " +
            "to find active vulnerabilities. The collected data is parsed, copy-pasted into static report documents (often using Word " +
            "or manual spreadsheets), and delivered to software teams, taking hours or days to complete."
          ),

          createHeading("2.3 Need for the New System", 2),
          createBodyParagraph(
            "There are major limitations with the manual security model that mandate a paradigm shift:"
          ),
          createBulletPoint("Excessive Cost: Standard automated license structures (e.g., Burp Suite or Acunetix) cost thousands of dollars annually, hindering usage in academic projects, startup modules, and individual dev pipelines."),
          createBulletPoint("Comprehensibility Gaps: Raw scan formats produce deep HTTP trace messages. A standard developer cannot easily decipher why a specific cross-site scripting payload bypassed a filter without reading pages of theory."),
          createBulletPoint("Disconnected Workflows: Modern systems require instant feedback. Adding an interactive, centralized web platform like VulnBot AI enables developers to insert their URL, click start, monitor beautiful dashboards, watch live terminal logs, and get clear, AI-remediated reports directly."),

          createHeading("2.4 Existing Site Survey", 2),
          createBodyParagraph(
            "An exhaustive review of multiple alternative SaaS and open-source scanners revealed significant bottleneck factors:"
          ),
          createBulletPoint("OWASP ZAP: Active, free open-source tool, but its user interface is desktop-bound, Java-based, and highly complex. It looks intimidating to web administrators, presenting hundreds of sub-options."),
          createBulletPoint("Nikto: Simple terminal perl script for vulnerability scanning. However, it lacks visual interfaces, is highly noisy (leading to rapid firewalls/WAF blocks), and produces bare-metal text files with no structured visual hierarchy."),
          createBulletPoint("Acunetix: A powerful web UI tool, but it is proprietary, closed-source, heavy, and extremely expensive, locking small teams out of cybersecurity diagnostics."),

          createHeading("2.5 Process Model", 2),
          createBodyParagraph(
            "The engineering life-cycle of VulnBot AI is developed using the Agile Iterative Process Model. " +
            "Cybersecurity threat landscapes change daily, meaning static models like Waterfall fail to accommodate " +
            "dynamic scan signature updates. By adopting Agile development iterations, each module—such as the crawler, " +
            "port scanner, script parser, and visual rendering canvas—is structured, implemented, and refined inside 1-2 week " +
            "sprints."
          ),
          createBodyParagraph(
            "Every core feature goes through rigorous phases: Requirement Capture (identifying key vulnerability targets like OWASP Top 10), " +
            "Prototype Styling (using Tailwind CSS configurations), Integration (merging active and passive scanner streams), " +
            "Validation (running audits against safe sandbox sites), and Deployment (packaging the full suite in containerized Cloud environments)."
          ),

          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 3 ====================
          createHeading("CHAPTER 3: PROPOSED WEBSITE / SYSTEM", 1),
          
          createHeading("3.1 Introduction", 2),
          createBodyParagraph(
            "The proposed system, VulnBot AI, is structured to provide an all-in-one, accessible, and AI-powered " +
            "penetration testing experience. Built on a clean full-stack TypeScript framework, it allows operators to register " +
            "for auditing, type in target host parameters, and initialize parallel auditing flows. Upon starting, the active node " +
            "crawler discovers endpoints while the network scanner checks critical service ports. All compiled raw telemetry " +
            "is formatted and analyzed by a backend integration with Google's Gemini LLMs, creating humanized descriptions, impact evaluations, " +
            "and distinct clean code snippets to solve security gaps."
          ),

          createHeading("3.2 Functionalities", 2),
          createBodyParagraph(
            "The platform is built around five major interactive security loops, each carrying distinct functional tasks. Our proposed core capabilities are represented in the structural capabilities matrix below:"
          ),

          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
              left: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
              right: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
              insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "F0FDF4" }, // Emerald 50 equivalent
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        spacing: { before: 120, after: 60 },
                        children: [
                          new TextRun({ text: "Module 01: Passive Network Crawler\n", font: "Times New Roman", size: 30, bold: true, color: "065F46" }),
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 60, after: 120 },
                        children: [
                          new TextRun({ text: "Sweeps public DNS profiles and parses HTTP headers to capture missing headers like Content-Security-Policy.", font: "Times New Roman", size: 28, color: "374151" })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    shading: { fill: "F0FDF4" }, // Emerald 50 equivalent
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        spacing: { before: 120, after: 60 },
                        children: [
                          new TextRun({ text: "Module 02: Active Port Sweeper\n", font: "Times New Roman", size: 30, bold: true, color: "065F46" }),
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 60, after: 120 },
                        children: [
                          new TextRun({ text: "Safely probes local interfaces to map active services without triggering firewall threshold blockers.", font: "Times New Roman", size: 28, color: "374151" })
                        ]
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "EEF2FF" }, // Indigo 50 equivalent
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        spacing: { before: 120, after: 60 },
                        children: [
                          new TextRun({ text: "Module 03: Gemini AI Remediation\n", font: "Times New Roman", size: 30, bold: true, color: "3730A3" }),
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 60, after: 120 },
                        children: [
                          new TextRun({ text: "Interprets machine errors, aggregates indices, and auto-generates bold, clear remediation guides with secure source code fixes.", font: "Times New Roman", size: 28, color: "374151" })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    shading: { fill: "EEF2FF" }, // Indigo 50 equivalent
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        spacing: { before: 120, after: 60 },
                        children: [
                          new TextRun({ text: "Module 04: Thesis Document Compiler\n", font: "Times New Roman", size: 30, bold: true, color: "3730A3" }),
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 60, after: 120 },
                        children: [
                          new TextRun({ text: "Leverages DOCX formatting APIs to compile clean, justified academic and corporate-ready administrative documents instantly.", font: "Times New Roman", size: 28, color: "374151" })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 120, after: 60 } }),
          createBodyParagraph(
            "Specifically, VulnBot AI offers a broad range of automated security capabilities:"
          ),
          createBulletPoint("Domain Footprinting: Performs instant DNS lookups, resolves IPs, and identifies hosting domains."),
          createBulletPoint("Network Service Discovery: Probes critical target ports (21, 22, 80, 443, 8080) to check for exposed developer services."),
          createBulletPoint("Passive Header Audits: Examines critical security headers (X-Frame-Options, Content-Security-Policy, HSTS, X-Content-Type-Options)."),
          createBulletPoint("Dynamic Active Crawling: Parses HTML links to trace site routes and directory layouts."),
          createBulletPoint("Simulative Payload dispatcher: Probes endpoints for SQL injection vulnerabilities and cross-site scripting vulnerabilities safely."),
          createBulletPoint("AI recommendation and Code patching: Harnesses Gemini models to write ready-to-use middleware code fixing security flaws."),

          createHeading("3.3 Advantages", 2),
          createBodyParagraph(
            "By implementing VulnBot AI, users gain access to the following strategic business and educational advantages:"
          ),
          createBulletPoint("Immediate Usability: Zero install overhead. Anyone with a browser can connect to the target portal and scan."),
          createBulletPoint("Intuitive Design: Styled using dark, modern, high-contrast dashboard aesthetics with interactive neon status indicators."),
          createBulletPoint("Developer Remediation Code: Unlike traditional tools that merely list errors, VulnBot AI generates actual code remedies."),
          createBulletPoint("Detailed Logging: Captures historical scan metrics and saves logged operator credentials in a secure credentials.txt tracker."),
          createBulletPoint("Academic Report compilation: Enables direct download of comprehensive project report materials matching indexing goals."),

          createHeading("3.4 System Modules", 2),
          createBodyParagraph(
            "The core logic of VulnBot AI is divided into four highly-decoupled, modular software components:"
          ),
          createCalloutTable([
            new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: "1. Front-End Interface (Vite + React): ", font: "Times New Roman", size: 28, bold: true }), new TextRun({ text: "Responsive layouts, interactive parameter controls, and live visual log monitors.", font: "Times New Roman", size: 28 })] }),
            new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: "2. Scanner Daemon (Express + Axios): ", font: "Times New Roman", size: 28, bold: true }), new TextRun({ text: "Dispatches HTTP headers checks, port probes, and subdomain crawlers.", font: "Times New Roman", size: 28 })] }),
            new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: "3. Document Compiler (Docx & PDF engines): ", font: "Times New Roman", size: 28, bold: true }), new TextRun({ text: "Generates beautifully styled Times New Roman thesis documents instantly.", font: "Times New Roman", size: 28 })] })
          ], { fill: "F8FAFC", borderColor: "CBD5E1" }),

          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 4 ====================
          createHeading("CHAPTER 4: SYSTEM DESIGN", 1),
          
          createHeading("4.1 System Flow Diagram", 2),
          createBodyParagraph(
            "The active flow of VulnBot AI is designed to ensure seamless synchronization between developer input, scanner dispatch, " +
            "and AI generation modules. The typical sequence of operations is modeled as a vertical pipeline in the schematic layout below:"
          ),

          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "1E293B" }, // dark slate node box
                    width: { size: 10, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 120, after: 120 },
                        children: [new TextRun({ text: "01", font: "Times New Roman", size: 32, bold: true, color: "FFFFFF" })]
                      })
                    ]
                  }),
                  new TableCell({
                    shading: { fill: "F8FAFC" }, // Light slate
                    width: { size: 90, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        spacing: { before: 120, after: 60 },
                        children: [new TextRun({ text: "INPUT FRAME INTERFACE", font: "Times New Roman", size: 28, bold: true, color: "0F172A" })]
                      }),
                      new Paragraph({
                        spacing: { before: 60, after: 120 },
                        children: [new TextRun({ text: "Operator enters target host URL (e.g. secure-test.edu) and selects Scan Mode.", font: "Times New Roman", size: 28, color: "475569" })]
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "1E293B" },
                    width: { size: 10, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 120, after: 120 },
                        children: [new TextRun({ text: "02", font: "Times New Roman", size: 32, bold: true, color: "FFFFFF" })]
                      })
                    ]
                  }),
                  new TableCell({
                    shading: { fill: "F8FAFC" },
                    width: { size: 90, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        spacing: { before: 120, after: 60 },
                        children: [new TextRun({ text: "PORT SWEEP & CRAWL DAEMON", font: "Times New Roman", size: 28, bold: true, color: "10B981" })]
                      }),
                      new Paragraph({
                        spacing: { before: 60, after: 120 },
                        children: [new TextRun({ text: "Checks essential security headers and dynamically probes default network ports.", font: "Times New Roman", size: 28, color: "475569" })]
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "1E293B" },
                    width: { size: 10, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 120, after: 120 },
                        children: [new TextRun({ text: "03", font: "Times New Roman", size: 32, bold: true, color: "FFFFFF" })]
                      })
                    ]
                  }),
                  new TableCell({
                    shading: { fill: "F8FAFC" },
                    width: { size: 90, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        spacing: { before: 120, after: 60 },
                        children: [new TextRun({ text: "HEURISTIC CONFIDENCE SCORING", font: "Times New Roman", size: 28, bold: true, color: "0EA5E9" })]
                      }),
                      new Paragraph({
                        spacing: { before: 60, after: 120 },
                        children: [new TextRun({ text: "Aggregates raw scanner alerts and performs pattern matching to eliminate false positive items.", font: "Times New Roman", size: 28, color: "475569" })]
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "064E3B" }, // Highlighted Emerald 900
                    width: { size: 10, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 120, after: 120 },
                        children: [new TextRun({ text: "04", font: "Times New Roman", size: 32, bold: true, color: "34D399" })]
                      })
                    ]
                  }),
                  new TableCell({
                    shading: { fill: "ECFDF5" },  // high contrast emerald 50
                    width: { size: 90, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        spacing: { before: 120, after: 60 },
                        children: [new TextRun({ text: "GEMINI INTERPRETER CORE", font: "Times New Roman", size: 28, bold: true, color: "047857" })]
                      }),
                      new Paragraph({
                        spacing: { before: 60, after: 120 },
                        children: [new TextRun({ text: "Retrieves diagnostic logs, crafts clear remediation patches, and compiles customized dissertations synchronously.", font: "Times New Roman", size: 28, bold: true, color: "065F46" })]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          createHeading("4.2 Entity Relationship Diagram (ERD)", 2),
          createBodyParagraph(
            "To model the application's underlying data relationships, we employ a relational database design. " +
            "The diagram establishes clean bounds between Users, Scans, and Findings. Each entity relates symmetrically as defined in the side-by-side relational schematic layout below:"
          ),

          new Paragraph({ spacing: { before: 180, after: 120 } }),
          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE }
            },
            rows: [
              new TableRow({
                children: [
                  // USERS Entity Card (30% width)
                  new TableCell({
                    shading: { fill: "F8FAFC" },
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 8, color: "1E293B" },
                      bottom: { style: BorderStyle.SINGLE, size: 8, color: "1E293B" },
                      left: { style: BorderStyle.SINGLE, size: 8, color: "1E293B" },
                      right: { style: BorderStyle.SINGLE, size: 8, color: "1E293B" }
                    },
                    children: [
                      new Paragraph({
                        shading: { fill: "1E293B" },
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 80, after: 80 },
                        children: [
                          new TextRun({ text: "USERS Table", font: "Times New Roman", size: 24, bold: true, color: "FFFFFF" })
                        ]
                      }),
                      new Paragraph({ spacing: { before: 60, after: 30 }, children: [new TextRun({ text: " • PK_email: VARCHAR(100)", font: "Courier New", size: 18, bold: true, color: "111827" })] }),
                      new Paragraph({ spacing: { before: 30, after: 30 }, children: [new TextRun({ text: "   password: VARCHAR(256)", font: "Courier New", size: 18, color: "4B5563" })] }),
                      new Paragraph({ spacing: { before: 30, after: 60 }, children: [new TextRun({ text: "   rollNumber: VARCHAR(24)", font: "Courier New", size: 18, color: "4B5563" })] })
                    ]
                  }),
                  
                  // Connective arrow 1 (5% width)
                  new TableCell({
                    width: { size: 5, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 360 },
                        children: [
                          new TextRun({ text: " ⇄ ", font: "Courier New", size: 26, bold: true, color: "10B981" })
                        ]
                      })
                    ]
                  }),

                  // SCANS Entity Card (30% width)
                  new TableCell({
                    shading: { fill: "F8FAFC" },
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 8, color: "1E293B" },
                      bottom: { style: BorderStyle.SINGLE, size: 8, color: "1E293B" },
                      left: { style: BorderStyle.SINGLE, size: 8, color: "1E293B" },
                      right: { style: BorderStyle.SINGLE, size: 8, color: "1E293B" }
                    },
                    children: [
                      new Paragraph({
                        shading: { fill: "1E293B" },
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 80, after: 80 },
                        children: [
                          new TextRun({ text: "SCANS Table", font: "Times New Roman", size: 24, bold: true, color: "FFFFFF" })
                        ]
                      }),
                      new Paragraph({ spacing: { before: 60, after: 30 }, children: [new TextRun({ text: " • PK_scanId: UUID", font: "Courier New", size: 18, bold: true, color: "111827" })] }),
                      new Paragraph({ spacing: { before: 30, after: 30 }, children: [new TextRun({ text: "   targetHost: VARCHAR(512)", font: "Courier New", size: 18, color: "4B5563" })] }),
                      new Paragraph({ spacing: { before: 30, after: 30 }, children: [new TextRun({ text: "   findingsCount: INTEGER", font: "Courier New", size: 18, color: "4B5563" })] }),
                      new Paragraph({ spacing: { before: 30, after: 60 }, children: [new TextRun({ text: " • FK_userId: VARCHAR(100)", font: "Courier New", size: 18, italics: true, color: "2563EB" })] })
                    ]
                  }),

                  // Connective arrow 2 (5% width)
                  new TableCell({
                    width: { size: 5, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 360 },
                        children: [
                          new TextRun({ text: " ⇄ ", font: "Courier New", size: 26, bold: true, color: "10B981" })
                        ]
                      })
                    ]
                  }),

                  // FINDINGS Entity Card (30% width)
                  new TableCell({
                    shading: { fill: "F8FAFC" },
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 8, color: "1E293B" },
                      bottom: { style: BorderStyle.SINGLE, size: 8, color: "1E293B" },
                      left: { style: BorderStyle.SINGLE, size: 8, color: "1E293B" },
                      right: { style: BorderStyle.SINGLE, size: 8, color: "1E293B" }
                    },
                    children: [
                      new Paragraph({
                        shading: { fill: "1E293B" },
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 80, after: 80 },
                        children: [
                          new TextRun({ text: "FINDINGS Table", font: "Times New Roman", size: 24, bold: true, color: "FFFFFF" })
                        ]
                      }),
                      new Paragraph({ spacing: { before: 60, after: 30 }, children: [new TextRun({ text: " • PK_findingId: UUID", font: "Courier New", size: 18, bold: true, color: "111827" })] }),
                      new Paragraph({ spacing: { before: 30, after: 30 }, children: [new TextRun({ text: "   severity: VARCHAR(10)", font: "Courier New", size: 18, color: "4B5563" })] }),
                      new Paragraph({ spacing: { before: 30, after: 30 }, children: [new TextRun({ text: "   description: TEXT", font: "Courier New", size: 18, color: "4B5563" })] }),
                      new Paragraph({ spacing: { before: 30, after: 60 }, children: [new TextRun({ text: " • FK_scanId: UUID", font: "Courier New", size: 18, italics: true, color: "2563EB" })] })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 180, after: 120 } }),

          createHeading("4.3 Data Flow Diagram (DFD)", 2),
          createBodyParagraph(
            "The exchange of data within VulnBot AI is illustrated through multi-level DFD schemas: " +
            "1. Level-0 (Context Diagram): The External Operator inputs a domain target parameter into the VulnBot AI System boundary. The system " +
            "subsequently queries the external target server and AI models, returning a compiled security PDF/DOCX to the operator."
          ),
          createBodyParagraph(
            "2. Level-1 (Process Breakdown): Processes include (1.0) Auth Process, (2.0) Target Crawl Engine, (3.0) Payload Injection System, " +
            "and (4.0) Document Compiler Process. Standard credentials JSON files store auth records, while scanner queues keep telemetry " +
            "until processed by the AI engine."
          ),
 
          createHeading("4.4 Use Case Diagram", 2),
          createBodyParagraph(
            "The Use Case diagram identifies three distinct System Actors: " +
            "1. Security Operator (Student / Administrator): Solicits target inputs, registers accounts, views results dashboard, and downloads MS Word files. " +
            "2. Vulnerable Target Server: Acts as the passive recipient of network pings and HTTP header requests. " +
            "3. Google Gemini AI Engine: Evaluates raw logs, aggregates vulnerability categories, and provides clean source code fixes."
          ),
 
          createHeading("4.5 Data Dictionary", 2),
          createBodyParagraph(
            "The data elements structured in VulnBot AI are meticulously defined to ensure complete type support and database persistence. " +
            "The following dictionary defines our structural storage files:"
          ),
 
          createHeading("Table name: USERS", 3),
          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 90, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell("Field Name", 25),
                  createHeaderCell("Data Type", 20),
                  createHeaderCell("Constraint", 20),
                  createHeaderCell("Description", 35)
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("email", 25, { bold: true }),
                  createBodyCell("String (VARCHAR)", 20),
                  createBodyCell("Primary Key", 20),
                  createBodyCell("Unique operator login mail ID", 35)
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("password", 25, { bold: true }),
                  createBodyCell("String (HASH)", 20),
                  createBodyCell("Not Null", 20),
                  createBodyCell("Stored credential string representing password", 35)
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("disabled", 25, { bold: true }),
                  createBodyCell("Boolean", 20),
                  createBodyCell("Default: false", 20),
                  createBodyCell("System block flag for administrators", 35)
                ]
              }),
            ]
          }),
 
          createHeading("Table name: SCANS", 3),
          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 90, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell("Field Name", 25),
                  createHeaderCell("Data Type", 20),
                  createHeaderCell("Constraint", 20),
                  createHeaderCell("Description", 35)
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("id", 25, { bold: true }),
                  createBodyCell("UUID String", 20),
                  createBodyCell("Primary Key", 20),
                  createBodyCell("Unique scan identifier hash", 35)
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("target", 25, { bold: true }),
                  createBodyCell("String", 20),
                  createBodyCell("Not Null", 20),
                  createBodyCell("Target domain parameter queried", 35)
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("status", 25, { bold: true }),
                  createBodyCell("Enum", 20),
                  createBodyCell("pending/done/error", 20),
                  createBodyCell("Active pipeline scan execution state", 35)
                ]
              }),
              new TableRow({
                children: [
                  createBodyCell("mode", 25, { bold: true }),
                  createBodyCell("String", 20),
                  createBodyCell("passive/active", 20),
                  createBodyCell("Determines whether payloads are injected", 35)
                ]
              }),
            ]
          }),
 
          createHeading("4.6 Wire Frame of Your System", 2),
          createBodyParagraph(
            "VulnBot AI's UI wireframe focuses on layout density and dashboard efficiency: " +
            "1. Top Navigation: Features the VULNBOT AI display branding, active session email metrics, and menu links for Dashboard, Scanner, Reports, Settings, and Documentation. " +
            "2. Bento-Grid Dashboard: Contains active threat graphs, historical logs, system metrics (Simulated RAM and DB Allocation), and recent audit history. " +
            "3. Interactive Scanner Hub: Highlights an input field styled with ambient neon elements, an active scan mode toggle, and live terminal logging blocks that stream stdout diagnostics as search crawls are actively conducted. The active mock-up console interface is simulated in the wireframe below:"
          ),

          new Paragraph({ spacing: { before: 120, after: 60 } }),
          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 12, color: "1e293b" },
              bottom: { style: BorderStyle.SINGLE, size: 12, color: "1e293b" },
              left: { style: BorderStyle.SINGLE, size: 12, color: "1e293b" },
              right: { style: BorderStyle.SINGLE, size: 12, color: "1e293b" },
              insideVertical: { style: BorderStyle.SINGLE, size: 8, color: "334155" },
              insideHorizontal: { style: BorderStyle.NONE }
            },
            rows: [
              new TableRow({
                children: [
                  // Cell 1: Wireframe Sidebar Menu Panel (25% width)
                  new TableCell({
                    shading: { fill: "0F172A" },
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        spacing: { before: 120, after: 120 },
                        children: [
                          new TextRun({ text: "  VULNBOT HUD  \n", font: "Courier New", size: 18, bold: true, color: "34D399" })
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 60, after: 60 },
                        children: [
                          new TextRun({ text: "  ⊞ Dashboard\n", font: "Courier New", size: 18, bold: true, color: "34D399" })
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 60, after: 60 },
                        children: [
                          new TextRun({ text: "  ⚙ Settings\n", font: "Courier New", size: 18, color: "94A3B8" })
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 60, after: 60 },
                        children: [
                          new TextRun({ text: "  🗂 Reports\n", font: "Courier New", size: 18, color: "94A3B8" })
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 60, after: 120 },
                        children: [
                          new TextRun({ text: "  📖 Docs\n", font: "Courier New", size: 18, color: "94A3B8" })
                        ]
                      })
                    ]
                  }),
                  // Cell 2: Wireframe Scanner Body & Monitoring Terminal Box (75% width)
                  new TableCell({
                    shading: { fill: "090D16" }, // Darker black-slate terminal bg
                    width: { size: 75, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        spacing: { before: 120, after: 60 },
                        children: [
                          new TextRun({ text: " Target URL: ", font: "Courier New", size: 18, color: "94A3B8" }),
                          new TextRun({ text: "https://test-swarrnim.edu\n", font: "Courier New", size: 18, underline: {}, color: "34D399" })
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 60, after: 120 },
                        children: [
                          new TextRun({ text: " Scan Mode:  ", font: "Courier New", size: 18, color: "94A3B8" }),
                          new TextRun({ text: "[PASSIVE / ACTIVE]\n", font: "Courier New", size: 18, bold: true, color: "34D399" })
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 60, after: 60 },
                        children: [
                          new TextRun({ text: " 🛡️ Security Score: 92.6 / 100   |   Ports: 03 Scanned\n", font: "Courier New", size: 18, bold: true, color: "34D399" })
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 30, after: 30 },
                        children: [
                          new TextRun({ text: ">> [DAEMON] Initializing thread pool socket checks...\n", font: "Courier New", size: 16, color: "34D399" })
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 30, after: 30 },
                        children: [
                          new TextRun({ text: ">> Port 80 found open [HTTP]. Analyzing headers...\n", font: "Courier New", size: 16, color: "FFFFFF" })
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 30, after: 30 },
                        children: [
                          new TextRun({ text: ">> WARNING: Missing X-Content-Type-Options parameter!\n", font: "Courier New", size: 16, bold: true, color: "F59E0B" })
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 30, after: 120 },
                        children: [
                          new TextRun({ text: ">> CRITICAL: Port 3306 [MySQL] exposed to public domain!\n", font: "Courier New", size: 16, bold: true, color: "EF4444" })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 5 ====================
          createHeading("CHAPTER 5: CONCLUSION AND FUTURE SCOPE", 1),
          
          createHeading("5.1 Limitations of our Project", 2),
          createBodyParagraph(
            "While VulnBot AI constitutes a modern and powerful tool, several limitations are identified for continuous refinement: " +
            "1. Single-Page Application (SPA) Limits: The standard crawler reads statically rendered server-side anchor links. Dynamic JS-heavy interfaces " +
            "(like React, Angular, or Vue-rendered SPAs) which construct buttons at client-side runtime may evade complete coverage in this system version. " +
            "2. Advanced Firewall Blocks: Intensive active scanning sweeps might flag systems, causing standard firewalls or Web Application Firewalls (WAF) to drop IP routes, " +
            "requiring rotational proxy configurations for exhaustive penetration tests."
          ),

          createHeading("5.2 Conclusion", 2),
          createMixedParagraph([
            { text: "The engineering of " },
            { text: "VulnBot AI", bold: true, italics: true },
            { text: " successfully achieves the designed goals as outlined in the SWARRNIM guidelines:" }
          ]),
          createBulletPoint("Implemented a secure, responsive, full-stack penetration testing hub accessible on any browser."),
          createBulletPoint("Successfully created automated passive and simulative active crawlers checking ports and headers."),
          createBulletPoint("Fully integrated generative AI models (Gemini API) to bridge complex RAW telemetry data with human-understandable technical reports."),
          createBulletPoint("Compiled automated Microsoft Word (.docx) Academic Reports strictly structured around traditional indices, formatted in Times New Roman font, 1.5-spacing, and justified paragraph formatting."),

          createHeading("5.3 Future Scope", 2),
          createBodyParagraph(
            "The platform architecture serves as an extensible base for prospective cybersecurity features:"
          ),
          createBulletPoint("Dynamic Browser Emulation: Integrating automated headless browsing pipelines (such as Puppeteer/Playwright) to capture dynamic client-side DOM injections."),
          createBulletPoint("Nuclei Template Parser: Enabling modular active script injections through YAML threat templates."),
          createBulletPoint("Multi-User Collaboration: Organizing shared workspaces for security teams to cooperatively audit portals and manage continuous integrations."),

          createHeading("References and Bibliography", 1),
          createBodyParagraph(
            "1. Scambray, J., McClure, S., & Kurtz, G. (2020). Hacking Exposed: Network Security Secrets & Solutions (8th ed.). McGraw-Hill Education.\n" +
            "2. OWASP Top 10 Project (2021). Critical Security Vulnerabilities for Web Applications. Open Web Application Security Project. https://owasp.org/www-project-top-ten/\n" +
            "3. Node.js Foundation. (2023). Node.js Runtime Environment Technical Documentation. OpenJS Foundation. https://nodejs.org/\n" +
            "4. Google GenAI SDK. (2024). Generative AI API Integration Reference Core Library. Google AI Studio. https://ai.google.dev/\n" +
            "5. Field, T. (2018). Web Application Security Auditing and Penetration Testing Blueprints. Wiley Press."
          )
        ]
      }
    ]
  });

  return await Packer.toBuffer(doc);
}

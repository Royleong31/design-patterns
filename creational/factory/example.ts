/**
 * FACTORY METHOD PATTERN - Example
 *
 * Demonstrates the Document Generator factory in action.
 */

import {
  DocumentCreator,
  PDFDocumentCreator,
  HTMLDocumentCreator,
  MarkdownDocumentCreator,
  DocumentFactory,
} from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("FACTORY METHOD PATTERN - Document Generator");
  console.log("=".repeat(60));
  console.log();

  // Sample report data
  const reportSections = [
    {
      heading: "Executive Summary",
      content: "This quarter showed strong growth across all metrics.",
    },
    {
      heading: "Financial Overview",
      content: "Revenue increased by 25% compared to last quarter.",
    },
    {
      heading: "Conclusions",
      content: "We recommend continuing the current strategy.",
    },
  ];

  // Using Factory Method Pattern
  console.log("1. Using Factory Method Pattern");
  console.log("-".repeat(40));
  console.log();

  // Client code works with creators through the abstract interface
  function generateAndPrintReport(creator: DocumentCreator, title: string) {
    const doc = creator.generateReport(title, reportSections);
    console.log(`Generated ${doc.type} document:\n`);
    console.log(doc.render());
    console.log();
  }

  // Generate PDF report
  console.log(">>> PDF Document:");
  const pdfCreator = new PDFDocumentCreator();
  generateAndPrintReport(pdfCreator, "Q4 Report");

  console.log("-".repeat(40));

  // Generate HTML report
  console.log(">>> HTML Document:");
  const htmlCreator = new HTMLDocumentCreator();
  generateAndPrintReport(htmlCreator, "Q4 Report");

  console.log("-".repeat(40));

  // Generate Markdown report
  console.log(">>> Markdown Document:");
  const markdownCreator = new MarkdownDocumentCreator();
  generateAndPrintReport(markdownCreator, "Q4 Report");

  // Using Simple Factory (bonus demonstration)
  console.log("=".repeat(60));
  console.log("2. Using Simple Factory (alternative approach)");
  console.log("-".repeat(40));
  console.log();

  const doc = DocumentFactory.create("html");
  doc.setTitle("Quick Note");
  doc.addHeading("Shopping List", 1);
  doc.addList(["Apples", "Bread", "Milk", "Eggs"]);
  doc.addParagraph("Don't forget the coupons!");

  console.log(doc.render());
  console.log();

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Factory Method delegates object creation to subclasses");
  console.log("- Client code works with abstract creators and products");
  console.log("- New document types can be added without changing client code");
  console.log("- Simple Factory is a lighter alternative for simpler cases");
  console.log("=".repeat(60));
}

main();


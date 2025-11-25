/**
 * VISITOR PATTERN - Example
 *
 * Demonstrates the Document Export visitor in action.
 */

import {
  Document,
  Paragraph,
  Heading,
  ImageElement,
  CodeBlock,
  ListElement,
  TableElement,
  HTMLExportVisitor,
  MarkdownExportVisitor,
  StatisticsVisitor,
  formatStatistics,
} from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("VISITOR PATTERN - Document Export System");
  console.log("=".repeat(60));
  console.log();

  // Create a document with various elements
  console.log("1. Creating document with various elements...");
  const doc = new Document("Design Patterns Guide");

  // Add elements
  doc.addElement(new Heading("Introduction to Design Patterns", 1));

  doc.addElement(
    new Paragraph(
      "Design patterns are reusable solutions to commonly occurring problems in software design. They represent best practices evolved over time by experienced developers."
    )
  );

  doc.addElement(new Heading("Benefits of Design Patterns", 2));

  doc.addElement(
    new ListElement(
      [
        "Proven solutions to common problems",
        "Shared vocabulary among developers",
        "Promote code reusability",
        "Make code more maintainable",
      ],
      false
    )
  );

  doc.addElement(new Heading("The Visitor Pattern", 2));

  doc.addElement(
    new Paragraph(
      "The Visitor pattern allows you to add new operations to existing object structures without modifying them. It separates algorithms from the objects they operate on."
    )
  );

  doc.addElement(
    new ImageElement(
      "visitor-pattern.png",
      "Visitor Pattern UML Diagram",
      "Figure 1: UML diagram of the Visitor pattern",
      600,
      400
    )
  );

  doc.addElement(new Heading("Code Example", 3));

  doc.addElement(
    new CodeBlock(
      `interface Visitor {
  visitElement(element: Element): void;
}

interface Element {
  accept(visitor: Visitor): void;
}`,
      "typescript"
    )
  );

  doc.addElement(new Heading("Pattern Comparison", 2));

  doc.addElement(
    new TableElement(
      ["Pattern", "Intent", "Use Case"],
      [
        ["Visitor", "Add operations to objects", "Document export"],
        ["Strategy", "Interchange algorithms", "Payment processing"],
        ["Observer", "Notify on state change", "Event handling"],
      ]
    )
  );

  doc.addElement(
    new Paragraph("Each pattern serves a specific purpose and should be chosen based on the problem at hand.", "center")
  );

  console.log(`   Document "${doc.getTitle()}" created with ${doc.getElements().length} elements`);
  console.log();

  // HTML Export
  console.log("2. HTML EXPORT");
  console.log("-".repeat(40));
  const htmlVisitor = new HTMLExportVisitor();
  doc.accept(htmlVisitor);
  const htmlOutput = htmlVisitor.getOutput();

  console.log("   Preview (first 500 chars):");
  console.log();
  console.log(
    htmlOutput
      .substring(0, 500)
      .split("\n")
      .map((l) => `   ${l}`)
      .join("\n")
  );
  console.log("   ...");
  console.log();
  console.log(`   Total HTML length: ${htmlOutput.length} characters`);
  console.log();

  // Markdown Export
  console.log("3. MARKDOWN EXPORT");
  console.log("-".repeat(40));
  const mdVisitor = new MarkdownExportVisitor();
  doc.accept(mdVisitor);
  const mdOutput = mdVisitor.getOutput();

  console.log("   Preview (first 400 chars):");
  console.log();
  console.log(
    mdOutput
      .substring(0, 400)
      .split("\n")
      .map((l) => `   ${l}`)
      .join("\n")
  );
  console.log("   ...");
  console.log();
  console.log(`   Total Markdown length: ${mdOutput.length} characters`);
  console.log();

  // Statistics
  console.log("4. STATISTICS VISITOR");
  console.log("-".repeat(40));
  const statsVisitor = new StatisticsVisitor();
  doc.accept(statsVisitor);
  const stats = statsVisitor.getStatistics();

  console.log(formatStatistics(stats));
  console.log();

  // Demonstrate adding new visitor without changing elements
  console.log("5. ADDING NEW VISITOR (PlainTextVisitor)");
  console.log("-".repeat(40));

  // We can create a new visitor without modifying any element classes
  class PlainTextVisitor implements import("./index").DocumentVisitor {
    private output: string[] = [];

    visitParagraph(element: Paragraph): void {
      this.output.push(element.getText());
    }
    visitHeading(element: Heading): void {
      this.output.push(element.getText().toUpperCase());
    }
    visitImage(element: ImageElement): void {
      this.output.push(`[Image: ${element.getAlt()}]`);
    }
    visitCodeBlock(element: CodeBlock): void {
      this.output.push(`--- Code (${element.getLanguage()}) ---\n${element.getCode()}\n---`);
    }
    visitList(element: ListElement): void {
      element.getItems().forEach((item, i) => {
        this.output.push(`  ${element.isOrdered() ? i + 1 + "." : "*"} ${item}`);
      });
    }
    visitTable(element: TableElement): void {
      this.output.push(`[Table: ${element.getHeaders().join(", ")}]`);
    }
    getOutput(): string {
      return this.output.join("\n\n");
    }
  }

  const plainTextVisitor = new PlainTextVisitor();
  doc.accept(plainTextVisitor);

  console.log("   Plain text export (preview):");
  console.log();
  console.log(
    plainTextVisitor
      .getOutput()
      .substring(0, 300)
      .split("\n")
      .map((l) => `   ${l}`)
      .join("\n")
  );
  console.log("   ...");
  console.log();

  // Show that elements don't change
  console.log("6. ELEMENT INDEPENDENCE");
  console.log("-".repeat(40));
  console.log("   Elements don't know about visitors:");
  console.log("   - Paragraph just has accept(visitor) method");
  console.log("   - Heading just has accept(visitor) method");
  console.log("   - Adding HTML, Markdown, Stats, PlainText visitors");
  console.log("     required NO changes to element classes!");
  console.log();

  // Multiple documents, same visitors
  console.log("7. REUSING VISITORS");
  console.log("-".repeat(40));

  const doc2 = new Document("Quick Note");
  doc2.addElement(new Heading("Meeting Notes", 1));
  doc2.addElement(new Paragraph("Discussion about the new project architecture."));
  doc2.addElement(new ListElement(["Review designs", "Assign tasks", "Set deadlines"], true));

  htmlVisitor.clear();
  doc2.accept(htmlVisitor);
  console.log(`   Document 2 HTML length: ${htmlVisitor.getOutput().length} chars`);

  statsVisitor.clear();
  doc2.accept(statsVisitor);
  const stats2 = statsVisitor.getStatistics();
  console.log(`   Document 2 word count: ${stats2.wordCount}`);
  console.log();

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Visitor adds operations without modifying element classes");
  console.log("- Elements accept visitors via double dispatch");
  console.log("- New visitors can be added freely (HTML, Markdown, Stats, etc.)");
  console.log("- All operations for an element type are in one visitor class");
  console.log("- Useful when operations change frequently but structure is stable");
  console.log("- Trade-off: adding new element types requires updating all visitors");
  console.log("=".repeat(60));
}

main();


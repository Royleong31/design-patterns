/**
 * PROTOTYPE PATTERN - Example
 *
 * Demonstrates the Document Template prototype in action.
 */

import {
  DocumentRegistry,
  TemplateFactory,
  formatDocumentInfo,
  formatSectionPreview,
} from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("PROTOTYPE PATTERN - Document Templates");
  console.log("=".repeat(60));
  console.log();

  // Create the registry and register templates
  console.log("1. Creating document template registry...");
  const registry = new DocumentRegistry();
  console.log();

  console.log("2. Registering pre-built templates...");
  registry.register("contract", TemplateFactory.createContractTemplate());
  registry.register("invoice", TemplateFactory.createInvoiceTemplate());
  registry.register("report", TemplateFactory.createReportTemplate());
  console.log();

  console.log("   Available templates:", registry.listTemplates().join(", "));
  console.log();

  // Clone a contract template
  console.log("3. Creating a new contract from template...");
  const myContract = registry.createFrom("contract");
  if (myContract) {
    myContract.setName("Acme Corp Service Agreement");
    myContract.setAuthor("John Smith");
    myContract.setWatermark(null); // Remove DRAFT watermark
    myContract.updateSection(
      1,
      "This Agreement is entered into between Acme Corp and Widget Inc..."
    );

    console.log();
    console.log(formatDocumentInfo(myContract));
    console.log("\n   Sections:");
    console.log(formatSectionPreview(myContract));
  }
  console.log();

  // Clone an invoice and customize
  console.log("4. Creating multiple invoices from template...");
  const invoice1 = registry.createFrom("invoice");
  const invoice2 = registry.createFrom("invoice");

  if (invoice1 && invoice2) {
    invoice1.setName("Invoice #2024-001");
    invoice1.setAuthor("Billing Dept");

    invoice2.setName("Invoice #2024-002");
    invoice2.setAuthor("Billing Dept");
    invoice2.setStyles({ accentColor: "#e74c3c" }); // Different accent

    console.log();
    console.log("   Invoice 1:");
    console.log(formatDocumentInfo(invoice1));
    console.log();
    console.log("   Invoice 2 (customized colors):");
    console.log(formatDocumentInfo(invoice2));
  }
  console.log();

  // Demonstrate that clones are independent
  console.log("5. Verifying clones are independent...");
  const report1 = registry.createFrom("report");
  const report2 = registry.createFrom("report");

  if (report1 && report2) {
    report1.setName("Q1 Sales Report");
    report2.setName("Q2 Sales Report");

    console.log(`   Report 1 name: ${report1.getName()}`);
    console.log(`   Report 2 name: ${report2.getName()}`);
    console.log(`   Same object? ${report1 === report2}`);
  }
  console.log();

  // Clone a clone
  console.log("6. Cloning a customized document (clone of a clone)...");
  if (myContract) {
    const contractCopy = myContract.clone();
    contractCopy.setName("Acme Corp Service Agreement - v2");
    contractCopy.addSection({
      type: "body",
      title: "Amendments",
      content: "The following amendments apply to this version...",
    });

    console.log();
    console.log("   Original contract sections:", myContract.getSections().length);
    console.log("   Amended contract sections:", contractCopy.getSections().length);
  }
  console.log();

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Objects are created by cloning prototypes, not constructing new");
  console.log("- Clones are independent - modifying one doesn't affect others");
  console.log("- Complex object setup is done once in the prototype");
  console.log("- Registry provides centralized access to prototypes");
  console.log("- Clones can themselves be cloned (clone of a clone)");
  console.log("=".repeat(60));
}

main();


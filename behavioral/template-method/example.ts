/**
 * TEMPLATE METHOD PATTERN - Example
 *
 * Demonstrates the Data Export template method in action.
 */

import {
  CSVExporter,
  JSONExporter,
  XMLExporter,
  MarkdownExporter,
  previewExport,
  DataExporter,
} from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("TEMPLATE METHOD PATTERN - Data Export System");
  console.log("=".repeat(60));
  console.log();

  const query = "SELECT * FROM employees";

  // CSV Export
  console.log("1. CSV EXPORT");
  console.log("-".repeat(40));
  const csvExporter = new CSVExporter(",", true);
  const csvResult = csvExporter.export(query);
  console.log();
  console.log(previewExport(csvResult));
  console.log();

  // JSON Export
  console.log("2. JSON EXPORT");
  console.log("-".repeat(40));
  const jsonExporter = new JSONExporter(true, true, "employees");
  const jsonResult = jsonExporter.export(query);
  console.log();
  console.log(previewExport(jsonResult, 15));
  console.log();

  // XML Export
  console.log("3. XML EXPORT");
  console.log("-".repeat(40));
  const xmlExporter = new XMLExporter("employees", "employee", true);
  const xmlResult = xmlExporter.export(query);
  console.log();
  console.log(previewExport(xmlResult, 12));
  console.log();

  // Markdown Export
  console.log("4. MARKDOWN EXPORT");
  console.log("-".repeat(40));
  const mdExporter = new MarkdownExporter("Employee Report");
  const mdResult = mdExporter.export(query);
  console.log();
  console.log(previewExport(mdResult));
  console.log();

  // Demonstrate same template, different implementations
  console.log("5. COMPARING EXPORTERS");
  console.log("-".repeat(40));
  console.log();

  const exporters: DataExporter[] = [
    new CSVExporter(),
    new JSONExporter(false),
    new XMLExporter(),
    new MarkdownExporter(),
  ];

  console.log("   All exporters use the same algorithm skeleton:");
  console.log("   connect() → fetchData() → beforeTransform() → transformData()");
  console.log("             → afterTransform() → writeOutput() → cleanup()");
  console.log();

  console.log("   Export results comparison:");
  console.log("   " + "-".repeat(45));

  for (const exporter of exporters) {
    const result = exporter.export(query);
    console.log(`   ${result.format.padEnd(10)} | ${result.recordCount} records | ${result.outputSize} bytes | ${result.duration}ms`);
  }
  console.log();

  // CSV with different delimiter
  console.log("6. CSV WITH TAB DELIMITER");
  console.log("-".repeat(40));
  const tsvExporter = new CSVExporter("\t", true);
  const tsvResult = tsvExporter.export(query);
  console.log();
  console.log(previewExport(tsvResult, 4));
  console.log();

  // JSON without pretty print
  console.log("7. JSON COMPACT (no pretty print)");
  console.log("-".repeat(40));
  const compactJsonExporter = new JSONExporter(false, false);
  const compactResult = compactJsonExporter.export(query);
  console.log();
  console.log("   Output (single line):");
  console.log(`   ${compactResult.content.substring(0, 80)}...`);
  console.log();

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Template method defines the algorithm skeleton in base class");
  console.log("- Subclasses implement specific steps (transformData, writeOutput)");
  console.log("- Common steps (connect, fetchData, cleanup) are reused");
  console.log("- Hook methods (beforeTransform, afterTransform) allow optional customization");
  console.log("- Algorithm structure cannot be changed by subclasses");
  console.log("- Promotes code reuse and enforces consistent behavior");
  console.log("=".repeat(60));
}

main();


/**
 * FLYWEIGHT PATTERN - Example
 *
 * Demonstrates the Text Editor character styling flyweight in action.
 */

import {
  CharacterStyleFactory,
  TextDocument,
  formatFactoryStats,
  formatDocumentMemory,
  formatBytes,
} from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("FLYWEIGHT PATTERN - Text Editor Character Rendering");
  console.log("=".repeat(60));
  console.log();

  // Create the style factory
  console.log("1. Creating character style factory...");
  const factory = new CharacterStyleFactory();
  console.log("   Factory initialized (no styles cached yet)");
  console.log();

  // Create a document
  console.log("2. Creating a document with various styled text...");
  const doc = new TextDocument(factory);

  // Add heading
  doc.addHeading("Introduction to Design Patterns", 1);
  doc.newLine();

  // Add normal text
  doc.addNormalText("Design patterns are ");
  doc.addBoldText("reusable solutions");
  doc.addNormalText(" to commonly occurring problems in software design. ");
  doc.addNormalText("They are templates for how to solve problems that can be used in many different situations.");
  doc.newLine();
  doc.newLine();

  // Add subheading
  doc.addHeading("The Gang of Four", 2);
  doc.newLine();

  doc.addNormalText("The term ");
  doc.addItalicText("Gang of Four");
  doc.addNormalText(" (GoF) refers to the four authors of the book ");
  doc.addItalicText("Design Patterns: Elements of Reusable Object-Oriented Software");
  doc.addNormalText(".");
  doc.newLine();
  doc.newLine();

  // Add code example
  doc.addHeading("Example Code", 3);
  doc.newLine();
  doc.addCode("const factory = new CharacterStyleFactory();");
  doc.newLine();
  doc.addCode("const style = factory.getStyle('Arial', 12);");
  doc.newLine();
  doc.newLine();

  console.log("   Document created successfully");
  console.log();

  // Show document preview
  console.log("3. Document preview:");
  console.log(`   "${doc.preview(80)}..."`);
  console.log();

  // Show factory statistics
  console.log("4. Factory statistics after document creation:");
  console.log(formatFactoryStats(factory.getStats()));
  console.log();

  console.log("   Cached styles:");
  factory.listStyles().forEach((key) => {
    console.log(`     - ${key}`);
  });
  console.log();

  // Show memory savings
  console.log("5. Memory analysis:");
  console.log(formatDocumentMemory(doc.getMemoryStats()));
  console.log();

  // Demonstrate sharing - add more text with same styles
  console.log("6. Adding more text with existing styles...");
  const charsBefore = doc.getCharacterCount();

  // Add a lot more text to show memory efficiency
  for (let i = 0; i < 10; i++) {
    doc.addNormalText("Lorem ipsum dolor sit amet, consectetur adipiscing elit. ");
    doc.addBoldText("Sed do eiusmod tempor incididunt ut labore. ");
    doc.addItalicText("Ut enim ad minim veniam. ");
  }

  const charsAfter = doc.getCharacterCount();
  console.log(`   Added ${charsAfter - charsBefore} more characters`);
  console.log();

  console.log("7. Updated factory statistics:");
  console.log(formatFactoryStats(factory.getStats()));
  console.log();

  console.log("8. Updated memory analysis:");
  console.log(formatDocumentMemory(doc.getMemoryStats()));
  console.log();

  // Demonstrate that styles are truly shared
  console.log("9. Verifying style sharing...");
  const style1 = factory.getNormalStyle();
  const style2 = factory.getNormalStyle();
  const style3 = factory.getStyle("Arial", 12, "normal", "normal", "#000000");

  console.log(`   style1 === style2: ${style1 === style2}`);
  console.log(`   style1 === style3: ${style1 === style3}`);
  console.log("   (All three reference the same flyweight object)");
  console.log();

  // Show rendering a few characters
  console.log("10. Rendering sample characters:");
  const rendered = doc.renderRange(0, 5);
  rendered.forEach((r) => console.log(`   ${r}`));
  console.log();

  // Demonstrate with large document
  console.log("11. Simulating large document (10,000 characters)...");
  const largeFactory = new CharacterStyleFactory();
  const largeDoc = new TextDocument(largeFactory);

  const loremText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor. ";

  for (let i = 0; i < 125; i++) {
    largeDoc.addNormalText(loremText);
  }

  console.log(`   Document size: ${largeDoc.getCharacterCount().toLocaleString()} characters`);
  console.log();

  const largeStats = largeDoc.getMemoryStats();
  console.log("   Memory comparison:");
  console.log(`   With flyweight:    ${formatBytes(largeStats.totalMemoryBytes)}`);
  console.log(`   Without flyweight: ${formatBytes(largeStats.memoryWithoutFlyweightBytes)}`);
  console.log(`   Savings:           ${formatBytes(largeStats.memorySavedBytes)} (${largeStats.memorySavedPercent.toFixed(1)}%)`);
  console.log();

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Intrinsic state (font, size, color) is shared via flyweights");
  console.log("- Extrinsic state (position) is stored per character");
  console.log("- Factory ensures flyweight reuse via caching");
  console.log("- Memory savings increase with more objects sharing styles");
  console.log("- Same interface whether using shared or unique objects");
  console.log("- Trade-off: slight lookup overhead for massive memory savings");
  console.log("=".repeat(60));
}

main();


/**
 * MEMENTO PATTERN - Example
 *
 * Demonstrates the Text Editor undo/redo in action.
 */

import { TextEditor, formatDocumentStatus } from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("MEMENTO PATTERN - Text Editor with Undo/Redo");
  console.log("=".repeat(60));
  console.log();

  // Create a text editor
  console.log("1. Creating text editor...");
  const editor = new TextEditor("My Document");
  console.log();

  // Type some content
  console.log("2. TYPING CONTENT");
  console.log("-".repeat(40));
  editor.type("Hello, World!");
  editor.type(" This is a test document.");
  editor.type(" Let's add some more text.");
  console.log();
  console.log(formatDocumentStatus(editor));
  console.log();

  // Change formatting
  console.log("3. FORMATTING CHANGES");
  console.log("-".repeat(40));
  editor.setFontSize(14);
  editor.setFontFamily("Times New Roman");
  editor.toggleBold();
  console.log();
  console.log(formatDocumentStatus(editor));
  console.log();

  // More edits
  console.log("4. MORE EDITS");
  console.log("-".repeat(40));
  editor.type(" Adding even more content to the document.");
  console.log();
  console.log(formatDocumentStatus(editor));
  console.log();

  // UNDO operations
  console.log("5. UNDO OPERATIONS");
  console.log("-".repeat(40));
  console.log("   Performing 3 undos...");
  console.log();

  editor.undo(); // Undo last type
  console.log(`   Content: "${editor.getDocument().getContent().substring(0, 50)}..."`);
  console.log();

  editor.undo(); // Undo bold toggle
  console.log(`   Bold: ${editor.getDocument().getFontSize()}`);
  console.log();

  editor.undo(); // Undo font family change
  console.log(`   Font: ${editor.getDocument().getFontFamily()}`);
  console.log();

  console.log(formatDocumentStatus(editor));
  console.log();

  // REDO operations
  console.log("6. REDO OPERATIONS");
  console.log("-".repeat(40));
  console.log("   Performing 2 redos...");
  console.log();

  editor.redo();
  console.log(`   Font: ${editor.getDocument().getFontFamily()}`);

  editor.redo();
  console.log(`   After redo`);
  console.log();

  console.log(formatDocumentStatus(editor));
  console.log();

  // New edit after undo (branches history)
  console.log("7. NEW EDIT AFTER UNDO (branches history)");
  console.log("-".repeat(40));
  console.log("   Making a new edit while in the middle of history...");
  editor.type(" [NEW BRANCH] Different content path.");
  console.log();
  console.log("   Note: Redo is no longer available (future states discarded)");
  console.log(formatDocumentStatus(editor));
  console.log();

  // Multiple undos to beginning
  console.log("8. UNDO TO BEGINNING");
  console.log("-".repeat(40));
  let undoCount = 0;
  while (editor.canUndo()) {
    editor.undo();
    undoCount++;
  }
  console.log(`   Performed ${undoCount} undos to reach initial state`);
  console.log();
  console.log(formatDocumentStatus(editor));
  console.log();

  // Redo all
  console.log("9. REDO TO END");
  console.log("-".repeat(40));
  let redoCount = 0;
  while (editor.canRedo()) {
    editor.redo();
    redoCount++;
  }
  console.log(`   Performed ${redoCount} redos to reach latest state`);
  console.log();
  console.log(formatDocumentStatus(editor));
  console.log();

  // Show history
  console.log("10. HISTORY LOG");
  console.log("-".repeat(40));
  const historyInfo = editor.getHistoryInfo();
  console.log(`   Total entries: ${historyInfo.total}`);
  console.log(`   Current position: ${historyInfo.current}`);
  console.log();
  console.log("   History entries:");
  historyInfo.descriptions.forEach((desc, i) => {
    const marker = i === historyInfo.current - 1 ? " ◄── current" : "";
    console.log(`     ${i + 1}. ${desc}${marker}`);
  });
  console.log();

  // Demonstrate encapsulation
  console.log("11. ENCAPSULATION DEMONSTRATION");
  console.log("-".repeat(40));
  console.log("   The Memento pattern preserves encapsulation:");
  console.log("   - History (Caretaker) stores mementos but doesn't examine them");
  console.log("   - Document (Originator) creates and restores from mementos");
  console.log("   - Memento contains state but doesn't expose modification methods");
  console.log("   - External code cannot tamper with saved states");
  console.log();

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Memento captures object state without violating encapsulation");
  console.log("- Originator (Document) creates and restores from mementos");
  console.log("- Caretaker (History) manages mementos without examining them");
  console.log("- Enables undo/redo by storing and restoring states");
  console.log("- New edits after undo can 'branch' history");
  console.log("- Memory usage can be managed with max history limits");
  console.log("=".repeat(60));
}

main();


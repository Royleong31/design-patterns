/**
 * COMMAND PATTERN - Example
 *
 * Demonstrates the Text Editor with undo/redo functionality.
 */

import {
  TextEditor,
  TextDocument,
  InsertTextCommand,
  DeleteTextCommand,
  ReplaceTextCommand,
  ToUppercaseCommand,
  MacroCommand,
} from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("COMMAND PATTERN - Text Editor with Undo/Redo");
  console.log("=".repeat(60));
  console.log();

  const editor = new TextEditor();

  // Helper to show current state
  function showState() {
    console.log(`  📄 Content: "${editor.getContent()}"`);
    console.log(`  📍 Cursor: ${editor.getDocument().getCursorPosition()}`);
    console.log();
  }

  // 1. Basic typing
  console.log("1. Basic Typing");
  console.log("-".repeat(40));

  editor.type("Hello");
  showState();

  editor.type(" World");
  showState();

  editor.type("!");
  showState();

  // 2. Undo operations
  console.log("2. Undo Operations");
  console.log("-".repeat(40));

  console.log("Undoing 3 times...\n");
  editor.undo();
  showState();

  editor.undo();
  showState();

  editor.undo();
  showState();

  // 3. Redo operations
  console.log("3. Redo Operations");
  console.log("-".repeat(40));

  console.log("Redoing 2 times...\n");
  editor.redo();
  showState();

  editor.redo();
  showState();

  // 4. Backspace
  console.log("4. Backspace");
  console.log("-".repeat(40));

  editor.backspace();
  showState();

  editor.backspace();
  showState();

  // Undo backspaces
  console.log("Undoing backspaces...\n");
  editor.undo();
  showState();

  editor.undo();
  showState();

  // 5. Delete selection
  console.log("5. Delete Selection");
  console.log("-".repeat(40));

  console.log("Deleting 'World' (positions 6-11)...\n");
  editor.deleteSelection(6, 11);
  showState();

  editor.undo();
  console.log("After undo:\n");
  showState();

  // 6. Replace text
  console.log("6. Replace Text");
  console.log("-".repeat(40));

  console.log("Replacing 'World' with 'TypeScript'...\n");
  editor.replace(6, 11, "TypeScript");
  showState();

  // 7. Text formatting (uppercase/lowercase)
  console.log("7. Text Formatting");
  console.log("-".repeat(40));

  console.log("Converting 'TypeScript' to uppercase...\n");
  editor.toUppercase(6, 16);
  showState();

  console.log("Converting back to lowercase...\n");
  editor.toLowercase(6, 16);
  showState();

  // 8. Macro command (multiple commands as one)
  console.log("8. Macro Command");
  console.log("-".repeat(40));

  // Create a new editor for macro demo
  const editor2 = new TextEditor();
  const doc2 = editor2.getDocument();

  console.log("Creating a document with macro...\n");
  editor2.type("Dear Sir/Madam,");
  editor2.type("\n\nThis is a formal letter.");
  console.log(`  📄 Before macro: "${editor2.getContent()}"`);
  console.log();

  // Create a macro that types a signature at current cursor position
  const currentPos = doc2.getCursorPosition();
  const signatureMacro = new MacroCommand("Add Signature", [
    new InsertTextCommand(doc2, "\n\n---\n", currentPos),
    new InsertTextCommand(doc2, "Best regards,\n", currentPos + 6),
    new InsertTextCommand(doc2, "John Doe", currentPos + 6 + 15),
  ]);

  editor2.executeCommand(signatureMacro);
  console.log(`  📄 After macro: "${editor2.getContent()}"`);
  console.log();

  console.log("Undoing the entire macro...\n");
  editor2.undo();
  console.log(`  📄 After undo: "${editor2.getContent()}"`);
  console.log();

  // 9. Command history
  console.log("9. Command History");
  console.log("-".repeat(40));

  console.log("History from first editor:");
  editor.getHistory().forEach((cmd, i) => {
    console.log(`  ${i + 1}. ${cmd}`);
  });
  console.log();

  if (editor.getRedoStack().length > 0) {
    console.log("Redo stack:");
    editor.getRedoStack().forEach((cmd, i) => {
      console.log(`  ${i + 1}. ${cmd}`);
    });
    console.log();
  }

  // 10. Complex editing scenario
  console.log("10. Complex Editing Scenario");
  console.log("-".repeat(40));

  const editor3 = new TextEditor();
  console.log("Writing a code comment...\n");

  editor3.type("// TODO: implement feature");
  showStateFor(editor3);

  console.log("Oops, wrong format. Let's fix it...\n");

  // Delete "// TODO: "
  editor3.deleteSelection(0, 9);
  showStateFor(editor3);

  // Add proper format
  editor3.executeCommand(
    new InsertTextCommand(editor3.getDocument(), "/* TODO:\n * ", 0)
  );
  showStateFor(editor3);

  // Add closing
  editor3.type("\n */");
  showStateFor(editor3);

  console.log("Undoing all changes to get back to original...\n");
  while (editor3.canUndo()) {
    editor3.undo();
  }
  showStateFor(editor3);

  console.log("Redoing all changes...\n");
  while (editor3.canRedo()) {
    editor3.redo();
  }
  showStateFor(editor3);

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Commands encapsulate actions as objects");
  console.log("- Each command knows how to execute AND undo itself");
  console.log("- Command history enables undo/redo functionality");
  console.log("- Macro commands can group multiple commands");
  console.log("- Commands can be logged, queued, or serialized");
  console.log("- Decouples the invoker (editor) from the receiver (document)");
  console.log("=".repeat(60));
}

function showStateFor(editor: TextEditor) {
  console.log(`  📄 Content: "${editor.getContent()}"`);
  console.log();
}

main();


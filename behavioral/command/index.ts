/**
 * COMMAND PATTERN
 *
 * Intent: Encapsulate a request as an object, thereby letting you parameterize
 * clients with different requests, queue or log requests, and support undoable
 * operations.
 *
 * Real-world example: Text Editor with Undo/Redo
 * - Each editing action (insert, delete, format) is a command
 * - Commands can be executed, undone, and redone
 * - Command history enables undo/redo functionality
 * - Commands can be queued, logged, or stored for replay
 */

/**
 * Receiver - The object that knows how to perform the operations
 */
export class TextDocument {
  private content: string = "";
  private cursorPosition: number = 0;
  private selection: { start: number; end: number } | null = null;

  getContent(): string {
    return this.content;
  }

  getCursorPosition(): number {
    return this.cursorPosition;
  }

  getSelection(): { start: number; end: number } | null {
    return this.selection;
  }

  getLength(): number {
    return this.content.length;
  }

  // Low-level operations used by commands
  insertAt(position: number, text: string): void {
    this.content =
      this.content.slice(0, position) + text + this.content.slice(position);
    this.cursorPosition = position + text.length;
    this.selection = null;
  }

  deleteRange(start: number, end: number): string {
    const deleted = this.content.slice(start, end);
    this.content = this.content.slice(0, start) + this.content.slice(end);
    this.cursorPosition = start;
    this.selection = null;
    return deleted;
  }

  replaceRange(start: number, end: number, text: string): string {
    const replaced = this.content.slice(start, end);
    this.content =
      this.content.slice(0, start) + text + this.content.slice(end);
    this.cursorPosition = start + text.length;
    this.selection = null;
    return replaced;
  }

  setCursorPosition(position: number): void {
    this.cursorPosition = Math.max(0, Math.min(position, this.content.length));
    this.selection = null;
  }

  setSelection(start: number, end: number): void {
    this.selection = {
      start: Math.max(0, Math.min(start, this.content.length)),
      end: Math.max(0, Math.min(end, this.content.length)),
    };
  }

  clearSelection(): void {
    this.selection = null;
  }
}

/**
 * Command Interface - All commands must implement this
 */
export interface Command {
  execute(): void;
  undo(): void;
  getDescription(): string;
}

/**
 * Concrete Command - Insert Text
 */
export class InsertTextCommand implements Command {
  private document: TextDocument;
  private position: number;
  private text: string;

  constructor(document: TextDocument, text: string, position?: number) {
    this.document = document;
    this.text = text;
    this.position = position ?? document.getCursorPosition();
  }

  execute(): void {
    this.document.insertAt(this.position, this.text);
  }

  undo(): void {
    this.document.deleteRange(this.position, this.position + this.text.length);
  }

  getDescription(): string {
    const preview = this.text.length > 20 ? this.text.slice(0, 20) + "..." : this.text;
    return `Insert "${preview}" at position ${this.position}`;
  }
}

/**
 * Concrete Command - Delete Text
 */
export class DeleteTextCommand implements Command {
  private document: TextDocument;
  private start: number;
  private end: number;
  private deletedText: string = "";

  constructor(document: TextDocument, start: number, end: number) {
    this.document = document;
    this.start = start;
    this.end = end;
  }

  execute(): void {
    this.deletedText = this.document.deleteRange(this.start, this.end);
  }

  undo(): void {
    this.document.insertAt(this.start, this.deletedText);
  }

  getDescription(): string {
    const preview =
      this.deletedText.length > 20
        ? this.deletedText.slice(0, 20) + "..."
        : this.deletedText;
    return `Delete "${preview}" from ${this.start} to ${this.end}`;
  }
}

/**
 * Concrete Command - Replace Text (for find & replace, etc.)
 */
export class ReplaceTextCommand implements Command {
  private document: TextDocument;
  private start: number;
  private end: number;
  private newText: string;
  private oldText: string = "";

  constructor(
    document: TextDocument,
    start: number,
    end: number,
    newText: string
  ) {
    this.document = document;
    this.start = start;
    this.end = end;
    this.newText = newText;
  }

  execute(): void {
    this.oldText = this.document.replaceRange(this.start, this.end, this.newText);
  }

  undo(): void {
    this.document.replaceRange(
      this.start,
      this.start + this.newText.length,
      this.oldText
    );
  }

  getDescription(): string {
    const oldPreview =
      this.oldText.length > 10 ? this.oldText.slice(0, 10) + "..." : this.oldText;
    const newPreview =
      this.newText.length > 10 ? this.newText.slice(0, 10) + "..." : this.newText;
    return `Replace "${oldPreview}" with "${newPreview}"`;
  }
}

/**
 * Concrete Command - Backspace (delete character before cursor)
 */
export class BackspaceCommand implements Command {
  private document: TextDocument;
  private deletedChar: string = "";
  private position: number;

  constructor(document: TextDocument) {
    this.document = document;
    this.position = document.getCursorPosition();
  }

  execute(): void {
    if (this.position > 0) {
      this.deletedChar = this.document.deleteRange(
        this.position - 1,
        this.position
      );
    }
  }

  undo(): void {
    if (this.deletedChar) {
      this.document.insertAt(this.position - 1, this.deletedChar);
    }
  }

  getDescription(): string {
    return `Backspace "${this.deletedChar}"`;
  }
}

/**
 * Concrete Command - To Uppercase (format command)
 */
export class ToUppercaseCommand implements Command {
  private document: TextDocument;
  private start: number;
  private end: number;
  private originalText: string = "";

  constructor(document: TextDocument, start: number, end: number) {
    this.document = document;
    this.start = start;
    this.end = end;
  }

  execute(): void {
    this.originalText = this.document
      .getContent()
      .slice(this.start, this.end);
    this.document.replaceRange(
      this.start,
      this.end,
      this.originalText.toUpperCase()
    );
  }

  undo(): void {
    this.document.replaceRange(
      this.start,
      this.start + this.originalText.length,
      this.originalText
    );
  }

  getDescription(): string {
    return `Uppercase "${this.originalText}"`;
  }
}

/**
 * Concrete Command - To Lowercase (format command)
 */
export class ToLowercaseCommand implements Command {
  private document: TextDocument;
  private start: number;
  private end: number;
  private originalText: string = "";

  constructor(document: TextDocument, start: number, end: number) {
    this.document = document;
    this.start = start;
    this.end = end;
  }

  execute(): void {
    this.originalText = this.document
      .getContent()
      .slice(this.start, this.end);
    this.document.replaceRange(
      this.start,
      this.end,
      this.originalText.toLowerCase()
    );
  }

  undo(): void {
    this.document.replaceRange(
      this.start,
      this.start + this.originalText.length,
      this.originalText
    );
  }

  getDescription(): string {
    return `Lowercase "${this.originalText}"`;
  }
}

/**
 * Concrete Command - Composite/Macro Command
 * Groups multiple commands to execute as one
 */
export class MacroCommand implements Command {
  private commands: Command[] = [];
  private name: string;

  constructor(name: string, commands: Command[] = []) {
    this.name = name;
    this.commands = commands;
  }

  addCommand(command: Command): void {
    this.commands.push(command);
  }

  execute(): void {
    this.commands.forEach((cmd) => cmd.execute());
  }

  undo(): void {
    // Undo in reverse order
    [...this.commands].reverse().forEach((cmd) => cmd.undo());
  }

  getDescription(): string {
    return `Macro: ${this.name} (${this.commands.length} commands)`;
  }
}

/**
 * Invoker - The Text Editor that executes commands
 */
export class TextEditor {
  private document: TextDocument;
  private history: Command[] = [];
  private redoStack: Command[] = [];
  private maxHistorySize: number;

  constructor(maxHistorySize: number = 100) {
    this.document = new TextDocument();
    this.maxHistorySize = maxHistorySize;
  }

  getDocument(): TextDocument {
    return this.document;
  }

  getContent(): string {
    return this.document.getContent();
  }

  /**
   * Execute a command and add to history
   */
  executeCommand(command: Command): void {
    command.execute();
    this.history.push(command);
    this.redoStack = []; // Clear redo stack after new command

    // Trim history if it exceeds max size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }

    console.log(`  ▶ Executed: ${command.getDescription()}`);
  }

  /**
   * Undo the last command
   */
  undo(): boolean {
    const command = this.history.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
      console.log(`  ↶ Undone: ${command.getDescription()}`);
      return true;
    }
    console.log("  ⚠ Nothing to undo");
    return false;
  }

  /**
   * Redo the last undone command
   */
  redo(): boolean {
    const command = this.redoStack.pop();
    if (command) {
      command.execute();
      this.history.push(command);
      console.log(`  ↷ Redone: ${command.getDescription()}`);
      return true;
    }
    console.log("  ⚠ Nothing to redo");
    return false;
  }

  /**
   * Check if undo is available
   */
  canUndo(): boolean {
    return this.history.length > 0;
  }

  /**
   * Check if redo is available
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /**
   * Get the command history
   */
  getHistory(): string[] {
    return this.history.map((cmd) => cmd.getDescription());
  }

  /**
   * Get the redo stack
   */
  getRedoStack(): string[] {
    return this.redoStack.map((cmd) => cmd.getDescription());
  }

  // Convenience methods that create and execute commands

  type(text: string): void {
    this.executeCommand(new InsertTextCommand(this.document, text));
  }

  backspace(): void {
    this.executeCommand(new BackspaceCommand(this.document));
  }

  deleteSelection(start: number, end: number): void {
    this.executeCommand(new DeleteTextCommand(this.document, start, end));
  }

  replace(start: number, end: number, newText: string): void {
    this.executeCommand(
      new ReplaceTextCommand(this.document, start, end, newText)
    );
  }

  toUppercase(start: number, end: number): void {
    this.executeCommand(new ToUppercaseCommand(this.document, start, end));
  }

  toLowercase(start: number, end: number): void {
    this.executeCommand(new ToLowercaseCommand(this.document, start, end));
  }
}


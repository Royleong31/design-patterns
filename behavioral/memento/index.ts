/**
 * MEMENTO PATTERN
 *
 * Intent: Without violating encapsulation, capture and externalize an object's
 * internal state so that the object can be restored to this state later.
 *
 * Real-world example: Text Editor with Undo/Redo
 * - Users make changes to a document
 * - Each state is saved as a memento
 * - Users can undo changes by restoring previous mementos
 * - Redo is possible by moving forward in the history
 * - The editor's internal state is not exposed
 */

/**
 * Memento - Stores the state of the document at a point in time
 * The memento is opaque to the caretaker (History)
 */
export class DocumentMemento {
  private readonly state: DocumentState;
  private readonly timestamp: Date;
  private readonly description: string;

  constructor(state: DocumentState, description: string) {
    // Deep clone the state
    this.state = {
      content: state.content,
      cursorPosition: state.cursorPosition,
      selectionStart: state.selectionStart,
      selectionEnd: state.selectionEnd,
      fontSize: state.fontSize,
      fontFamily: state.fontFamily,
      isBold: state.isBold,
      isItalic: state.isItalic,
    };
    this.timestamp = new Date();
    this.description = description;
  }

  getState(): DocumentState {
    // Return a copy to prevent external modification
    return { ...this.state };
  }

  getTimestamp(): Date {
    return this.timestamp;
  }

  getDescription(): string {
    return this.description;
  }
}

/**
 * Internal state structure for the document
 */
export interface DocumentState {
  content: string;
  cursorPosition: number;
  selectionStart: number | null;
  selectionEnd: number | null;
  fontSize: number;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
}

/**
 * Originator - Text Document
 * Creates mementos and can restore from them
 */
export class TextDocument {
  private content: string = "";
  private cursorPosition: number = 0;
  private selectionStart: number | null = null;
  private selectionEnd: number | null = null;
  private fontSize: number = 12;
  private fontFamily: string = "Arial";
  private isBold: boolean = false;
  private isItalic: boolean = false;
  private title: string;

  constructor(title: string) {
    this.title = title;
  }

  // Content operations
  getContent(): string {
    return this.content;
  }

  write(text: string): void {
    const before = this.content.substring(0, this.cursorPosition);
    const after = this.content.substring(this.cursorPosition);
    this.content = before + text + after;
    this.cursorPosition += text.length;
    console.log(`  [Doc] Wrote: "${text.substring(0, 30)}${text.length > 30 ? "..." : ""}"`);
  }

  deleteSelection(): void {
    if (this.selectionStart !== null && this.selectionEnd !== null) {
      const before = this.content.substring(0, this.selectionStart);
      const after = this.content.substring(this.selectionEnd);
      this.content = before + after;
      this.cursorPosition = this.selectionStart;
      this.clearSelection();
      console.log(`  [Doc] Deleted selection`);
    }
  }

  backspace(): void {
    if (this.cursorPosition > 0) {
      const before = this.content.substring(0, this.cursorPosition - 1);
      const after = this.content.substring(this.cursorPosition);
      this.content = before + after;
      this.cursorPosition--;
      console.log(`  [Doc] Backspace`);
    }
  }

  // Cursor operations
  setCursorPosition(position: number): void {
    this.cursorPosition = Math.max(0, Math.min(position, this.content.length));
  }

  getCursorPosition(): number {
    return this.cursorPosition;
  }

  moveCursorToEnd(): void {
    this.cursorPosition = this.content.length;
  }

  // Selection operations
  select(start: number, end: number): void {
    this.selectionStart = Math.max(0, start);
    this.selectionEnd = Math.min(end, this.content.length);
    console.log(`  [Doc] Selected: "${this.content.substring(this.selectionStart, this.selectionEnd)}"`);
  }

  clearSelection(): void {
    this.selectionStart = null;
    this.selectionEnd = null;
  }

  getSelection(): string | null {
    if (this.selectionStart !== null && this.selectionEnd !== null) {
      return this.content.substring(this.selectionStart, this.selectionEnd);
    }
    return null;
  }

  // Formatting operations
  setFontSize(size: number): void {
    this.fontSize = size;
    console.log(`  [Doc] Font size: ${size}pt`);
  }

  getFontSize(): number {
    return this.fontSize;
  }

  setFontFamily(family: string): void {
    this.fontFamily = family;
    console.log(`  [Doc] Font family: ${family}`);
  }

  getFontFamily(): string {
    return this.fontFamily;
  }

  toggleBold(): void {
    this.isBold = !this.isBold;
    console.log(`  [Doc] Bold: ${this.isBold ? "ON" : "OFF"}`);
  }

  toggleItalic(): void {
    this.isItalic = !this.isItalic;
    console.log(`  [Doc] Italic: ${this.isItalic ? "ON" : "OFF"}`);
  }

  // Memento operations
  save(description: string): DocumentMemento {
    console.log(`  [Doc] Saving state: "${description}"`);
    return new DocumentMemento(
      {
        content: this.content,
        cursorPosition: this.cursorPosition,
        selectionStart: this.selectionStart,
        selectionEnd: this.selectionEnd,
        fontSize: this.fontSize,
        fontFamily: this.fontFamily,
        isBold: this.isBold,
        isItalic: this.isItalic,
      },
      description
    );
  }

  restore(memento: DocumentMemento): void {
    const state = memento.getState();
    this.content = state.content;
    this.cursorPosition = state.cursorPosition;
    this.selectionStart = state.selectionStart;
    this.selectionEnd = state.selectionEnd;
    this.fontSize = state.fontSize;
    this.fontFamily = state.fontFamily;
    this.isBold = state.isBold;
    this.isItalic = state.isItalic;
    console.log(`  [Doc] Restored to: "${memento.getDescription()}"`);
  }

  getTitle(): string {
    return this.title;
  }

  getWordCount(): number {
    return this.content.trim().split(/\s+/).filter((w) => w.length > 0).length;
  }

  getCharacterCount(): number {
    return this.content.length;
  }
}

/**
 * Caretaker - Document History
 * Manages the history of mementos without examining their contents
 */
export class DocumentHistory {
  private mementos: DocumentMemento[] = [];
  private currentIndex: number = -1;
  private maxHistory: number;

  constructor(maxHistory: number = 50) {
    this.maxHistory = maxHistory;
  }

  /**
   * Push a new memento to history
   * Discards any "future" states if we're in the middle of history
   */
  push(memento: DocumentMemento): void {
    // Remove any "future" states
    this.mementos = this.mementos.slice(0, this.currentIndex + 1);

    // Add new memento
    this.mementos.push(memento);
    this.currentIndex++;

    // Trim if exceeding max
    if (this.mementos.length > this.maxHistory) {
      this.mementos.shift();
      this.currentIndex--;
    }

    console.log(`  [History] Saved (${this.currentIndex + 1}/${this.mementos.length})`);
  }

  /**
   * Undo - get previous memento
   */
  undo(): DocumentMemento | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      console.log(`  [History] Undo (${this.currentIndex + 1}/${this.mementos.length})`);
      return this.mementos[this.currentIndex];
    }
    console.log(`  [History] Nothing to undo`);
    return null;
  }

  /**
   * Redo - get next memento
   */
  redo(): DocumentMemento | null {
    if (this.currentIndex < this.mementos.length - 1) {
      this.currentIndex++;
      console.log(`  [History] Redo (${this.currentIndex + 1}/${this.mementos.length})`);
      return this.mementos[this.currentIndex];
    }
    console.log(`  [History] Nothing to redo`);
    return null;
  }

  /**
   * Check if undo is possible
   */
  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * Check if redo is possible
   */
  canRedo(): boolean {
    return this.currentIndex < this.mementos.length - 1;
  }

  /**
   * Get history info
   */
  getHistoryInfo(): { current: number; total: number; descriptions: string[] } {
    return {
      current: this.currentIndex + 1,
      total: this.mementos.length,
      descriptions: this.mementos.map((m) => m.getDescription()),
    };
  }

  /**
   * Clear history
   */
  clear(): void {
    this.mementos = [];
    this.currentIndex = -1;
    console.log(`  [History] Cleared`);
  }
}

/**
 * Text Editor - Coordinates document and history
 */
export class TextEditor {
  private document: TextDocument;
  private history: DocumentHistory;
  private autoSaveEnabled: boolean = true;

  constructor(title: string, maxHistory: number = 50) {
    this.document = new TextDocument(title);
    this.history = new DocumentHistory(maxHistory);

    // Save initial state
    this.saveState("Initial state");
  }

  getDocument(): TextDocument {
    return this.document;
  }

  // Auto-save wrapper
  private saveState(description: string): void {
    if (this.autoSaveEnabled) {
      this.history.push(this.document.save(description));
    }
  }

  // Document operations with auto-save
  type(text: string): void {
    this.document.write(text);
    this.saveState(`Typed: "${text.substring(0, 20)}${text.length > 20 ? "..." : ""}"`);
  }

  deleteSelected(): void {
    if (this.document.getSelection()) {
      this.document.deleteSelection();
      this.saveState("Deleted selection");
    }
  }

  backspace(): void {
    this.document.backspace();
    this.saveState("Backspace");
  }

  setFontSize(size: number): void {
    this.document.setFontSize(size);
    this.saveState(`Font size: ${size}pt`);
  }

  setFontFamily(family: string): void {
    this.document.setFontFamily(family);
    this.saveState(`Font family: ${family}`);
  }

  toggleBold(): void {
    this.document.toggleBold();
    this.saveState("Toggle bold");
  }

  toggleItalic(): void {
    this.document.toggleItalic();
    this.saveState("Toggle italic");
  }

  select(start: number, end: number): void {
    this.document.select(start, end);
    // Selection doesn't create a history entry
  }

  // Undo/Redo
  undo(): void {
    const memento = this.history.undo();
    if (memento) {
      this.autoSaveEnabled = false;
      this.document.restore(memento);
      this.autoSaveEnabled = true;
    }
  }

  redo(): void {
    const memento = this.history.redo();
    if (memento) {
      this.autoSaveEnabled = false;
      this.document.restore(memento);
      this.autoSaveEnabled = true;
    }
  }

  canUndo(): boolean {
    return this.history.canUndo();
  }

  canRedo(): boolean {
    return this.history.canRedo();
  }

  getHistoryInfo(): { current: number; total: number; descriptions: string[] } {
    return this.history.getHistoryInfo();
  }
}

/**
 * Format document info
 */
export function formatDocumentStatus(editor: TextEditor): string {
  const doc = editor.getDocument();
  const history = editor.getHistoryInfo();

  const lines = [
    `  📄 Document: ${doc.getTitle()}`,
    `  📝 Content: "${doc.getContent().substring(0, 40)}${doc.getContent().length > 40 ? "..." : ""}"`,
    `  📊 Words: ${doc.getWordCount()} | Characters: ${doc.getCharacterCount()}`,
    `  🔤 Font: ${doc.getFontFamily()} ${doc.getFontSize()}pt`,
    `  📜 History: ${history.current}/${history.total} | Undo: ${editor.canUndo() ? "✓" : "✗"} | Redo: ${editor.canRedo() ? "✓" : "✗"}`,
  ];

  return lines.join("\n");
}


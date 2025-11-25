/**
 * FACTORY METHOD PATTERN
 *
 * Intent: Define an interface for creating an object, but let subclasses decide
 * which class to instantiate. Factory Method lets a class defer instantiation
 * to subclasses.
 *
 * Real-world example: Document Generator
 * - Different document types (PDF, HTML, Markdown) have different generation logic
 * - The client code shouldn't know the specifics of each document type
 * - New document types can be added without changing existing code
 */

/**
 * Product Interface - Document
 * All document types must implement this interface
 */
export interface Document {
  readonly type: string;
  setTitle(title: string): void;
  addParagraph(text: string): void;
  addHeading(text: string, level: number): void;
  addList(items: string[]): void;
  render(): string;
}

/**
 * Concrete Product - PDF Document
 */
export class PDFDocument implements Document {
  readonly type = "PDF";
  private content: string[] = [];
  private title: string = "";

  setTitle(title: string): void {
    this.title = title;
  }

  addParagraph(text: string): void {
    this.content.push(`%PARAGRAPH% ${text}`);
  }

  addHeading(text: string, level: number): void {
    this.content.push(`%H${level}% ${text}`);
  }

  addList(items: string[]): void {
    this.content.push(`%LIST%`);
    items.forEach((item) => this.content.push(`  • ${item}`));
    this.content.push(`%/LIST%`);
  }

  render(): string {
    return [
      `%PDF-1.4`,
      `%TITLE% ${this.title}`,
      `%BEGIN_DOCUMENT%`,
      ...this.content,
      `%END_DOCUMENT%`,
    ].join("\n");
  }
}

/**
 * Concrete Product - HTML Document
 */
export class HTMLDocument implements Document {
  readonly type = "HTML";
  private content: string[] = [];
  private title: string = "";

  setTitle(title: string): void {
    this.title = title;
  }

  addParagraph(text: string): void {
    this.content.push(`  <p>${text}</p>`);
  }

  addHeading(text: string, level: number): void {
    this.content.push(`  <h${level}>${text}</h${level}>`);
  }

  addList(items: string[]): void {
    this.content.push(`  <ul>`);
    items.forEach((item) => this.content.push(`    <li>${item}</li>`));
    this.content.push(`  </ul>`);
  }

  render(): string {
    return [
      `<!DOCTYPE html>`,
      `<html>`,
      `<head>`,
      `  <title>${this.title}</title>`,
      `</head>`,
      `<body>`,
      ...this.content,
      `</body>`,
      `</html>`,
    ].join("\n");
  }
}

/**
 * Concrete Product - Markdown Document
 */
export class MarkdownDocument implements Document {
  readonly type = "Markdown";
  private content: string[] = [];
  private title: string = "";

  setTitle(title: string): void {
    this.title = title;
  }

  addParagraph(text: string): void {
    this.content.push(`${text}\n`);
  }

  addHeading(text: string, level: number): void {
    const prefix = "#".repeat(level);
    this.content.push(`${prefix} ${text}\n`);
  }

  addList(items: string[]): void {
    items.forEach((item) => this.content.push(`- ${item}`));
    this.content.push("");
  }

  render(): string {
    return [`# ${this.title}\n`, ...this.content].join("\n");
  }
}

/**
 * Creator - Abstract Document Creator
 * Declares the factory method that returns a Document object
 */
export abstract class DocumentCreator {
  /**
   * Factory Method - subclasses must implement this
   */
  abstract createDocument(): Document;

  /**
   * Business logic that uses the factory method
   * This method doesn't know which concrete document it's working with
   */
  generateReport(title: string, sections: { heading: string; content: string }[]): Document {
    // Create document using the factory method
    const doc = this.createDocument();

    doc.setTitle(title);

    for (const section of sections) {
      doc.addHeading(section.heading, 2);
      doc.addParagraph(section.content);
    }

    return doc;
  }
}

/**
 * Concrete Creator - PDF Document Creator
 */
export class PDFDocumentCreator extends DocumentCreator {
  createDocument(): Document {
    return new PDFDocument();
  }
}

/**
 * Concrete Creator - HTML Document Creator
 */
export class HTMLDocumentCreator extends DocumentCreator {
  createDocument(): Document {
    return new HTMLDocument();
  }
}

/**
 * Concrete Creator - Markdown Document Creator
 */
export class MarkdownDocumentCreator extends DocumentCreator {
  createDocument(): Document {
    return new MarkdownDocument();
  }
}

/**
 * Document Type Enum for the Simple Factory variant
 */
export type DocumentType = "pdf" | "html" | "markdown";

/**
 * Simple Factory (bonus) - A simpler variant that uses a single factory method
 * This is not the classic Factory Method pattern but is commonly used
 */
export class DocumentFactory {
  static create(type: DocumentType): Document {
    switch (type) {
      case "pdf":
        return new PDFDocument();
      case "html":
        return new HTMLDocument();
      case "markdown":
        return new MarkdownDocument();
      default:
        throw new Error(`Unknown document type: ${type}`);
    }
  }
}


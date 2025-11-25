/**
 * PROTOTYPE PATTERN
 *
 * Intent: Specify the kinds of objects to create using a prototypical instance,
 * and create new objects by copying this prototype.
 *
 * Real-world example: Document Templates
 * - A company has standard document templates (contracts, reports, invoices)
 * - Each template has predefined styles, headers, footers, and formatting
 * - New documents are created by cloning templates rather than building from scratch
 * - Cloned documents can then be customized without affecting the original
 */

/**
 * Prototype Interface - Declares the cloning method
 */
export interface Prototype<T> {
  clone(): T;
}

/**
 * Document metadata
 */
export interface DocumentMetadata {
  author: string;
  createdAt: Date;
  lastModified: Date;
  version: string;
}

/**
 * Document styling options
 */
export interface DocumentStyles {
  fontFamily: string;
  fontSize: number;
  headerColor: string;
  accentColor: string;
  lineSpacing: number;
  margins: { top: number; right: number; bottom: number; left: number };
}

/**
 * Section within a document
 */
export interface DocumentSection {
  title: string;
  content: string;
  type: "header" | "body" | "footer" | "signature";
}

/**
 * Concrete Prototype - Document Template
 *
 * This class can be cloned to create new documents based on the template
 */
export class DocumentTemplate implements Prototype<DocumentTemplate> {
  private name: string;
  private metadata: DocumentMetadata;
  private styles: DocumentStyles;
  private sections: DocumentSection[];
  private watermark: string | null;

  constructor(
    name: string,
    styles: DocumentStyles,
    sections: DocumentSection[] = [],
    watermark: string | null = null
  ) {
    this.name = name;
    this.metadata = {
      author: "Template System",
      createdAt: new Date(),
      lastModified: new Date(),
      version: "1.0",
    };
    this.styles = styles;
    this.sections = sections;
    this.watermark = watermark;
  }

  /**
   * Clone the document - creates a deep copy
   */
  clone(): DocumentTemplate {
    // Deep clone styles
    const clonedStyles: DocumentStyles = {
      ...this.styles,
      margins: { ...this.styles.margins },
    };

    // Deep clone sections
    const clonedSections: DocumentSection[] = this.sections.map((section) => ({
      ...section,
    }));

    // Create new instance with cloned data
    const cloned = new DocumentTemplate(
      `Copy of ${this.name}`,
      clonedStyles,
      clonedSections,
      this.watermark
    );

    // Update metadata for the clone
    cloned.metadata = {
      author: this.metadata.author,
      createdAt: new Date(),
      lastModified: new Date(),
      version: "1.0",
    };

    return cloned;
  }

  // Getters and setters
  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
    this.metadata.lastModified = new Date();
  }

  getStyles(): DocumentStyles {
    return this.styles;
  }

  setStyles(styles: Partial<DocumentStyles>): void {
    this.styles = { ...this.styles, ...styles };
    this.metadata.lastModified = new Date();
  }

  getSections(): DocumentSection[] {
    return this.sections;
  }

  addSection(section: DocumentSection): void {
    this.sections.push(section);
    this.metadata.lastModified = new Date();
  }

  updateSection(index: number, content: string): void {
    if (index >= 0 && index < this.sections.length) {
      this.sections[index].content = content;
      this.metadata.lastModified = new Date();
    }
  }

  setAuthor(author: string): void {
    this.metadata.author = author;
    this.metadata.lastModified = new Date();
  }

  getMetadata(): DocumentMetadata {
    return { ...this.metadata };
  }

  setWatermark(watermark: string | null): void {
    this.watermark = watermark;
    this.metadata.lastModified = new Date();
  }

  getWatermark(): string | null {
    return this.watermark;
  }
}

/**
 * Prototype Registry - Stores and manages document templates
 */
export class DocumentRegistry {
  private templates: Map<string, DocumentTemplate> = new Map();

  /**
   * Register a template with a key
   */
  register(key: string, template: DocumentTemplate): void {
    this.templates.set(key, template);
    console.log(`  [Registry] Registered template: "${key}"`);
  }

  /**
   * Get a clone of a template by key
   */
  createFrom(key: string): DocumentTemplate | null {
    const template = this.templates.get(key);
    if (!template) {
      console.log(`  [Registry] Template "${key}" not found`);
      return null;
    }
    console.log(`  [Registry] Cloning template: "${key}"`);
    return template.clone();
  }

  /**
   * List all available templates
   */
  listTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Check if a template exists
   */
  has(key: string): boolean {
    return this.templates.has(key);
  }
}

/**
 * Pre-built template factories
 */
export class TemplateFactory {
  /**
   * Create a contract template
   */
  static createContractTemplate(): DocumentTemplate {
    const styles: DocumentStyles = {
      fontFamily: "Times New Roman",
      fontSize: 12,
      headerColor: "#1a1a2e",
      accentColor: "#16213e",
      lineSpacing: 1.5,
      margins: { top: 72, right: 72, bottom: 72, left: 72 },
    };

    const sections: DocumentSection[] = [
      {
        type: "header",
        title: "Contract Agreement",
        content: "PROFESSIONAL SERVICES AGREEMENT",
      },
      {
        type: "body",
        title: "Parties",
        content:
          "This Agreement is entered into between [PARTY A] and [PARTY B]...",
      },
      {
        type: "body",
        title: "Terms",
        content: "The terms of this agreement shall be as follows...",
      },
      {
        type: "body",
        title: "Compensation",
        content: "In consideration of services rendered, [PARTY A] agrees to pay...",
      },
      {
        type: "signature",
        title: "Signatures",
        content: "________________________\n[PARTY A]\n\n________________________\n[PARTY B]",
      },
    ];

    return new DocumentTemplate("Contract Template", styles, sections, "DRAFT");
  }

  /**
   * Create an invoice template
   */
  static createInvoiceTemplate(): DocumentTemplate {
    const styles: DocumentStyles = {
      fontFamily: "Arial",
      fontSize: 11,
      headerColor: "#2d3436",
      accentColor: "#0984e3",
      lineSpacing: 1.2,
      margins: { top: 48, right: 48, bottom: 48, left: 48 },
    };

    const sections: DocumentSection[] = [
      {
        type: "header",
        title: "Invoice Header",
        content: "INVOICE #[NUMBER]\nDate: [DATE]\nDue Date: [DUE_DATE]",
      },
      {
        type: "body",
        title: "Bill To",
        content: "[CLIENT_NAME]\n[CLIENT_ADDRESS]\n[CLIENT_EMAIL]",
      },
      {
        type: "body",
        title: "Items",
        content: "| Description | Quantity | Unit Price | Total |\n|-------------|----------|------------|-------|",
      },
      {
        type: "footer",
        title: "Payment Info",
        content: "Please remit payment to:\nBank: [BANK]\nAccount: [ACCOUNT]",
      },
    ];

    return new DocumentTemplate("Invoice Template", styles, sections, null);
  }

  /**
   * Create a report template
   */
  static createReportTemplate(): DocumentTemplate {
    const styles: DocumentStyles = {
      fontFamily: "Calibri",
      fontSize: 11,
      headerColor: "#2c3e50",
      accentColor: "#3498db",
      lineSpacing: 1.4,
      margins: { top: 60, right: 60, bottom: 60, left: 60 },
    };

    const sections: DocumentSection[] = [
      {
        type: "header",
        title: "Report Title",
        content: "[REPORT TITLE]\n\nPrepared by: [AUTHOR]\nDate: [DATE]",
      },
      {
        type: "body",
        title: "Executive Summary",
        content: "[Executive summary content goes here...]",
      },
      {
        type: "body",
        title: "Introduction",
        content: "[Introduction content goes here...]",
      },
      {
        type: "body",
        title: "Findings",
        content: "[Main findings and analysis go here...]",
      },
      {
        type: "body",
        title: "Recommendations",
        content: "[Recommendations based on findings...]",
      },
      {
        type: "footer",
        title: "Appendix",
        content: "[Supporting data and references...]",
      },
    ];

    return new DocumentTemplate("Report Template", styles, sections, "CONFIDENTIAL");
  }
}

/**
 * Helper function to format document info for display
 */
export function formatDocumentInfo(doc: DocumentTemplate): string {
  const metadata = doc.getMetadata();
  const styles = doc.getStyles();
  const sections = doc.getSections();
  const watermark = doc.getWatermark();

  const lines = [
    `  📄 Document: ${doc.getName()}`,
    `  👤 Author: ${metadata.author}`,
    `  📅 Created: ${metadata.createdAt.toISOString().split("T")[0]}`,
    `  🔤 Font: ${styles.fontFamily} ${styles.fontSize}pt`,
    `  🎨 Colors: ${styles.headerColor} / ${styles.accentColor}`,
    `  📑 Sections: ${sections.length}`,
  ];

  if (watermark) {
    lines.push(`  💧 Watermark: ${watermark}`);
  }

  return lines.join("\n");
}

/**
 * Helper to display section preview
 */
export function formatSectionPreview(doc: DocumentTemplate): string {
  const sections = doc.getSections();
  return sections
    .map((s, i) => `    ${i + 1}. [${s.type.toUpperCase()}] ${s.title}`)
    .join("\n");
}


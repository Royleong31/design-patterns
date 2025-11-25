/**
 * TEMPLATE METHOD PATTERN
 *
 * Intent: Define the skeleton of an algorithm in an operation, deferring some steps
 * to subclasses. Template Method lets subclasses redefine certain steps of an
 * algorithm without changing the algorithm's structure.
 *
 * Real-world example: Data Export System
 * - Exporting data follows a common workflow: connect, fetch, transform, write, cleanup
 * - Different exporters (CSV, JSON, XML, PDF) implement the steps differently
 * - The overall algorithm structure remains the same
 * - Hook methods allow optional customization points
 */

/**
 * Abstract Class - Data Exporter
 * Defines the template method and abstract/hook methods
 */
export abstract class DataExporter {
  protected data: Record<string, unknown>[] = [];
  protected exportedContent: string = "";

  /**
   * TEMPLATE METHOD - Defines the algorithm skeleton
   * This method is final (not meant to be overridden)
   */
  public export(query: string): ExportResult {
    const startTime = Date.now();

    console.log(`  [${this.getExporterName()}] Starting export...`);

    // Step 1: Connect to data source
    this.connect();

    // Step 2: Fetch data
    this.fetchData(query);

    // Step 3: Hook - Pre-process data (optional)
    this.beforeTransform();

    // Step 4: Transform data to target format
    this.transformData();

    // Step 5: Hook - Post-process (optional)
    this.afterTransform();

    // Step 6: Write output
    const output = this.writeOutput();

    // Step 7: Cleanup
    this.cleanup();

    const duration = Date.now() - startTime;
    console.log(`  [${this.getExporterName()}] Export completed in ${duration}ms`);

    return {
      format: this.getFormat(),
      recordCount: this.data.length,
      outputSize: output.length,
      duration,
      content: output,
    };
  }

  // Abstract methods - MUST be implemented by subclasses
  protected abstract getExporterName(): string;
  protected abstract getFormat(): string;
  protected abstract transformData(): void;
  protected abstract writeOutput(): string;

  // Concrete methods - Common implementation for all exporters
  protected connect(): void {
    console.log(`  [${this.getExporterName()}] Connecting to data source...`);
    // Simulate connection
  }

  protected fetchData(query: string): void {
    console.log(`  [${this.getExporterName()}] Fetching data with query: "${query}"`);
    // Simulate fetching data
    this.data = [
      { id: 1, name: "Alice Johnson", email: "alice@example.com", department: "Engineering", salary: 95000 },
      { id: 2, name: "Bob Smith", email: "bob@example.com", department: "Marketing", salary: 75000 },
      { id: 3, name: "Carol White", email: "carol@example.com", department: "Engineering", salary: 105000 },
      { id: 4, name: "David Brown", email: "david@example.com", department: "Sales", salary: 85000 },
      { id: 5, name: "Eve Davis", email: "eve@example.com", department: "HR", salary: 70000 },
    ];
    console.log(`  [${this.getExporterName()}] Fetched ${this.data.length} records`);
  }

  protected cleanup(): void {
    console.log(`  [${this.getExporterName()}] Cleaning up resources...`);
    this.data = [];
    this.exportedContent = "";
  }

  // Hook methods - CAN be overridden by subclasses (default empty implementation)
  protected beforeTransform(): void {
    // Hook: subclasses can override to add pre-processing
  }

  protected afterTransform(): void {
    // Hook: subclasses can override to add post-processing
  }
}

/**
 * Export result
 */
export interface ExportResult {
  format: string;
  recordCount: number;
  outputSize: number;
  duration: number;
  content: string;
}

/**
 * Concrete Class - CSV Exporter
 */
export class CSVExporter extends DataExporter {
  private delimiter: string;
  private includeHeader: boolean;

  constructor(delimiter: string = ",", includeHeader: boolean = true) {
    super();
    this.delimiter = delimiter;
    this.includeHeader = includeHeader;
  }

  protected getExporterName(): string {
    return "CSV Exporter";
  }

  protected getFormat(): string {
    return "CSV";
  }

  protected transformData(): void {
    console.log(`  [CSV] Transforming to CSV format (delimiter: "${this.delimiter}")...`);

    if (this.data.length === 0) {
      this.exportedContent = "";
      return;
    }

    const lines: string[] = [];

    // Header row
    if (this.includeHeader) {
      const headers = Object.keys(this.data[0]);
      lines.push(headers.join(this.delimiter));
    }

    // Data rows
    for (const record of this.data) {
      const values = Object.values(record).map((v) =>
        typeof v === "string" && v.includes(this.delimiter) ? `"${v}"` : String(v)
      );
      lines.push(values.join(this.delimiter));
    }

    this.exportedContent = lines.join("\n");
  }

  protected writeOutput(): string {
    console.log(`  [CSV] Writing ${this.exportedContent.split("\n").length} lines...`);
    return this.exportedContent;
  }
}

/**
 * Concrete Class - JSON Exporter
 */
export class JSONExporter extends DataExporter {
  private prettyPrint: boolean;
  private wrapInObject: boolean;
  private rootKey: string;

  constructor(prettyPrint: boolean = true, wrapInObject: boolean = false, rootKey: string = "data") {
    super();
    this.prettyPrint = prettyPrint;
    this.wrapInObject = wrapInObject;
    this.rootKey = rootKey;
  }

  protected getExporterName(): string {
    return "JSON Exporter";
  }

  protected getFormat(): string {
    return "JSON";
  }

  protected beforeTransform(): void {
    console.log(`  [JSON] Pre-processing: Converting dates to ISO format...`);
    // Hook: Could convert dates, sanitize data, etc.
  }

  protected transformData(): void {
    console.log(`  [JSON] Transforming to JSON format...`);

    const outputData = this.wrapInObject ? { [this.rootKey]: this.data } : this.data;

    this.exportedContent = this.prettyPrint
      ? JSON.stringify(outputData, null, 2)
      : JSON.stringify(outputData);
  }

  protected writeOutput(): string {
    console.log(`  [JSON] Writing ${this.exportedContent.length} characters...`);
    return this.exportedContent;
  }

  protected afterTransform(): void {
    console.log(`  [JSON] Post-processing: Validating JSON structure...`);
    try {
      JSON.parse(this.exportedContent);
      console.log(`  [JSON] Validation passed`);
    } catch {
      console.log(`  [JSON] Validation failed!`);
    }
  }
}

/**
 * Concrete Class - XML Exporter
 */
export class XMLExporter extends DataExporter {
  private rootElement: string;
  private recordElement: string;
  private includeDeclaration: boolean;

  constructor(rootElement: string = "records", recordElement: string = "record", includeDeclaration: boolean = true) {
    super();
    this.rootElement = rootElement;
    this.recordElement = recordElement;
    this.includeDeclaration = includeDeclaration;
  }

  protected getExporterName(): string {
    return "XML Exporter";
  }

  protected getFormat(): string {
    return "XML";
  }

  protected transformData(): void {
    console.log(`  [XML] Transforming to XML format...`);

    const lines: string[] = [];

    if (this.includeDeclaration) {
      lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    }

    lines.push(`<${this.rootElement}>`);

    for (const record of this.data) {
      lines.push(`  <${this.recordElement}>`);
      for (const [key, value] of Object.entries(record)) {
        const escaped = this.escapeXml(String(value));
        lines.push(`    <${key}>${escaped}</${key}>`);
      }
      lines.push(`  </${this.recordElement}>`);
    }

    lines.push(`</${this.rootElement}>`);
    this.exportedContent = lines.join("\n");
  }

  protected writeOutput(): string {
    console.log(`  [XML] Writing ${this.exportedContent.split("\n").length} lines...`);
    return this.exportedContent;
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
}

/**
 * Concrete Class - Markdown Table Exporter
 */
export class MarkdownExporter extends DataExporter {
  private title: string | null;

  constructor(title: string | null = null) {
    super();
    this.title = title;
  }

  protected getExporterName(): string {
    return "Markdown Exporter";
  }

  protected getFormat(): string {
    return "Markdown";
  }

  protected transformData(): void {
    console.log(`  [MD] Transforming to Markdown table...`);

    if (this.data.length === 0) {
      this.exportedContent = "";
      return;
    }

    const lines: string[] = [];

    if (this.title) {
      lines.push(`# ${this.title}`);
      lines.push("");
    }

    // Header
    const headers = Object.keys(this.data[0]);
    lines.push("| " + headers.join(" | ") + " |");
    lines.push("| " + headers.map(() => "---").join(" | ") + " |");

    // Rows
    for (const record of this.data) {
      const values = Object.values(record).map((v) => String(v));
      lines.push("| " + values.join(" | ") + " |");
    }

    this.exportedContent = lines.join("\n");
  }

  protected writeOutput(): string {
    console.log(`  [MD] Writing table with ${this.data.length} rows...`);
    return this.exportedContent;
  }

  protected beforeTransform(): void {
    console.log(`  [MD] Pre-processing: Sanitizing markdown special characters...`);
  }
}

/**
 * Helper to preview export content
 */
export function previewExport(result: ExportResult, maxLines: number = 10): string {
  const lines = result.content.split("\n");
  const preview = lines.slice(0, maxLines).join("\n");
  const remaining = lines.length - maxLines;

  let output = `  Format: ${result.format}\n`;
  output += `  Records: ${result.recordCount}\n`;
  output += `  Size: ${result.outputSize} bytes\n`;
  output += `  Duration: ${result.duration}ms\n`;
  output += `  Preview:\n`;
  output += preview
    .split("\n")
    .map((l) => `    ${l}`)
    .join("\n");

  if (remaining > 0) {
    output += `\n    ... (${remaining} more lines)`;
  }

  return output;
}


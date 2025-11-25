/**
 * VISITOR PATTERN
 *
 * Intent: Represent an operation to be performed on the elements of an object
 * structure. Visitor lets you define a new operation without changing the
 * classes of the elements on which it operates.
 *
 * Real-world example: Document Export System
 * - A document contains different elements: paragraphs, headings, images, code blocks
 * - Different visitors can perform different operations: HTML export, Markdown export, Word count
 * - Adding new operations doesn't require changing the element classes
 * - Elements accept visitors and call the appropriate visit method
 */

/**
 * Visitor Interface
 * Declares visit methods for each element type
 */
export interface DocumentVisitor {
  visitParagraph(element: Paragraph): void;
  visitHeading(element: Heading): void;
  visitImage(element: ImageElement): void;
  visitCodeBlock(element: CodeBlock): void;
  visitList(element: ListElement): void;
  visitTable(element: TableElement): void;
}

/**
 * Element Interface
 * Declares accept method for visitors
 */
export interface DocumentElement {
  accept(visitor: DocumentVisitor): void;
  getType(): string;
}

/**
 * Concrete Element - Paragraph
 */
export class Paragraph implements DocumentElement {
  private text: string;
  private alignment: "left" | "center" | "right" | "justify";

  constructor(text: string, alignment: "left" | "center" | "right" | "justify" = "left") {
    this.text = text;
    this.alignment = alignment;
  }

  accept(visitor: DocumentVisitor): void {
    visitor.visitParagraph(this);
  }

  getText(): string {
    return this.text;
  }

  getAlignment(): string {
    return this.alignment;
  }

  getType(): string {
    return "paragraph";
  }
}

/**
 * Concrete Element - Heading
 */
export class Heading implements DocumentElement {
  private text: string;
  private level: 1 | 2 | 3 | 4 | 5 | 6;

  constructor(text: string, level: 1 | 2 | 3 | 4 | 5 | 6 = 1) {
    this.text = text;
    this.level = level;
  }

  accept(visitor: DocumentVisitor): void {
    visitor.visitHeading(this);
  }

  getText(): string {
    return this.text;
  }

  getLevel(): number {
    return this.level;
  }

  getType(): string {
    return "heading";
  }
}

/**
 * Concrete Element - Image
 */
export class ImageElement implements DocumentElement {
  private src: string;
  private alt: string;
  private caption: string | null;
  private width: number | null;
  private height: number | null;

  constructor(
    src: string,
    alt: string,
    caption: string | null = null,
    width: number | null = null,
    height: number | null = null
  ) {
    this.src = src;
    this.alt = alt;
    this.caption = caption;
    this.width = width;
    this.height = height;
  }

  accept(visitor: DocumentVisitor): void {
    visitor.visitImage(this);
  }

  getSrc(): string {
    return this.src;
  }

  getAlt(): string {
    return this.alt;
  }

  getCaption(): string | null {
    return this.caption;
  }

  getWidth(): number | null {
    return this.width;
  }

  getHeight(): number | null {
    return this.height;
  }

  getType(): string {
    return "image";
  }
}

/**
 * Concrete Element - Code Block
 */
export class CodeBlock implements DocumentElement {
  private code: string;
  private language: string;
  private showLineNumbers: boolean;

  constructor(code: string, language: string = "text", showLineNumbers: boolean = true) {
    this.code = code;
    this.language = language;
    this.showLineNumbers = showLineNumbers;
  }

  accept(visitor: DocumentVisitor): void {
    visitor.visitCodeBlock(this);
  }

  getCode(): string {
    return this.code;
  }

  getLanguage(): string {
    return this.language;
  }

  shouldShowLineNumbers(): boolean {
    return this.showLineNumbers;
  }

  getType(): string {
    return "codeBlock";
  }
}

/**
 * Concrete Element - List
 */
export class ListElement implements DocumentElement {
  private items: string[];
  private ordered: boolean;

  constructor(items: string[], ordered: boolean = false) {
    this.items = items;
    this.ordered = ordered;
  }

  accept(visitor: DocumentVisitor): void {
    visitor.visitList(this);
  }

  getItems(): string[] {
    return [...this.items];
  }

  isOrdered(): boolean {
    return this.ordered;
  }

  getType(): string {
    return "list";
  }
}

/**
 * Concrete Element - Table
 */
export class TableElement implements DocumentElement {
  private headers: string[];
  private rows: string[][];

  constructor(headers: string[], rows: string[][]) {
    this.headers = headers;
    this.rows = rows;
  }

  accept(visitor: DocumentVisitor): void {
    visitor.visitTable(this);
  }

  getHeaders(): string[] {
    return [...this.headers];
  }

  getRows(): string[][] {
    return this.rows.map((row) => [...row]);
  }

  getType(): string {
    return "table";
  }
}

/**
 * Concrete Visitor - HTML Exporter
 */
export class HTMLExportVisitor implements DocumentVisitor {
  private output: string[] = [];

  visitParagraph(element: Paragraph): void {
    const style = element.getAlignment() !== "left" ? ` style="text-align: ${element.getAlignment()}"` : "";
    this.output.push(`<p${style}>${element.getText()}</p>`);
  }

  visitHeading(element: Heading): void {
    const tag = `h${element.getLevel()}`;
    this.output.push(`<${tag}>${element.getText()}</${tag}>`);
  }

  visitImage(element: ImageElement): void {
    let attrs = `src="${element.getSrc()}" alt="${element.getAlt()}"`;
    if (element.getWidth()) attrs += ` width="${element.getWidth()}"`;
    if (element.getHeight()) attrs += ` height="${element.getHeight()}"`;

    let html = `<img ${attrs}>`;
    if (element.getCaption()) {
      html = `<figure>${html}<figcaption>${element.getCaption()}</figcaption></figure>`;
    }
    this.output.push(html);
  }

  visitCodeBlock(element: CodeBlock): void {
    const lines = element.getCode().split("\n");
    let code = element.getCode();

    if (element.shouldShowLineNumbers()) {
      code = lines.map((line, i) => `<span class="line-num">${i + 1}</span>${line}`).join("\n");
    }

    this.output.push(`<pre><code class="language-${element.getLanguage()}">${code}</code></pre>`);
  }

  visitList(element: ListElement): void {
    const tag = element.isOrdered() ? "ol" : "ul";
    const items = element.getItems().map((item) => `  <li>${item}</li>`).join("\n");
    this.output.push(`<${tag}>\n${items}\n</${tag}>`);
  }

  visitTable(element: TableElement): void {
    const headers = element.getHeaders().map((h) => `    <th>${h}</th>`).join("\n");
    const rows = element.getRows().map((row) => {
      const cells = row.map((c) => `    <td>${c}</td>`).join("\n");
      return `  <tr>\n${cells}\n  </tr>`;
    }).join("\n");

    this.output.push(`<table>\n  <thead>\n  <tr>\n${headers}\n  </tr>\n  </thead>\n  <tbody>\n${rows}\n  </tbody>\n</table>`);
  }

  getOutput(): string {
    return this.output.join("\n\n");
  }

  clear(): void {
    this.output = [];
  }
}

/**
 * Concrete Visitor - Markdown Exporter
 */
export class MarkdownExportVisitor implements DocumentVisitor {
  private output: string[] = [];

  visitParagraph(element: Paragraph): void {
    this.output.push(element.getText());
  }

  visitHeading(element: Heading): void {
    const prefix = "#".repeat(element.getLevel());
    this.output.push(`${prefix} ${element.getText()}`);
  }

  visitImage(element: ImageElement): void {
    let md = `![${element.getAlt()}](${element.getSrc()})`;
    if (element.getCaption()) {
      md += `\n*${element.getCaption()}*`;
    }
    this.output.push(md);
  }

  visitCodeBlock(element: CodeBlock): void {
    this.output.push(`\`\`\`${element.getLanguage()}\n${element.getCode()}\n\`\`\``);
  }

  visitList(element: ListElement): void {
    const items = element.getItems().map((item, i) => {
      const bullet = element.isOrdered() ? `${i + 1}.` : "-";
      return `${bullet} ${item}`;
    });
    this.output.push(items.join("\n"));
  }

  visitTable(element: TableElement): void {
    const headers = element.getHeaders();
    const rows = element.getRows();

    const headerRow = `| ${headers.join(" | ")} |`;
    const separator = `| ${headers.map(() => "---").join(" | ")} |`;
    const dataRows = rows.map((row) => `| ${row.join(" | ")} |`).join("\n");

    this.output.push(`${headerRow}\n${separator}\n${dataRows}`);
  }

  getOutput(): string {
    return this.output.join("\n\n");
  }

  clear(): void {
    this.output = [];
  }
}

/**
 * Concrete Visitor - Statistics Collector
 */
export class StatisticsVisitor implements DocumentVisitor {
  private wordCount: number = 0;
  private characterCount: number = 0;
  private elementCounts: Map<string, number> = new Map();
  private imageCount: number = 0;
  private codeLineCount: number = 0;

  visitParagraph(element: Paragraph): void {
    this.countWords(element.getText());
    this.incrementCount("paragraph");
  }

  visitHeading(element: Heading): void {
    this.countWords(element.getText());
    this.incrementCount(`heading-h${element.getLevel()}`);
  }

  visitImage(element: ImageElement): void {
    this.imageCount++;
    if (element.getCaption()) {
      this.countWords(element.getCaption());
    }
    this.incrementCount("image");
  }

  visitCodeBlock(element: CodeBlock): void {
    const lines = element.getCode().split("\n");
    this.codeLineCount += lines.length;
    this.incrementCount("codeBlock");
    this.incrementCount(`code-${element.getLanguage()}`);
  }

  visitList(element: ListElement): void {
    element.getItems().forEach((item) => this.countWords(item));
    this.incrementCount(element.isOrdered() ? "ordered-list" : "unordered-list");
  }

  visitTable(element: TableElement): void {
    element.getHeaders().forEach((h) => this.countWords(h));
    element.getRows().forEach((row) => row.forEach((cell) => this.countWords(cell)));
    this.incrementCount("table");
  }

  private countWords(text: string): void {
    const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
    this.wordCount += words.length;
    this.characterCount += text.length;
  }

  private incrementCount(type: string): void {
    this.elementCounts.set(type, (this.elementCounts.get(type) || 0) + 1);
  }

  getStatistics(): DocumentStatistics {
    return {
      wordCount: this.wordCount,
      characterCount: this.characterCount,
      elementCounts: Object.fromEntries(this.elementCounts),
      imageCount: this.imageCount,
      codeLineCount: this.codeLineCount,
    };
  }

  clear(): void {
    this.wordCount = 0;
    this.characterCount = 0;
    this.elementCounts.clear();
    this.imageCount = 0;
    this.codeLineCount = 0;
  }
}

export interface DocumentStatistics {
  wordCount: number;
  characterCount: number;
  elementCounts: Record<string, number>;
  imageCount: number;
  codeLineCount: number;
}

/**
 * Document - Object Structure
 */
export class Document {
  private title: string;
  private elements: DocumentElement[] = [];

  constructor(title: string) {
    this.title = title;
  }

  addElement(element: DocumentElement): void {
    this.elements.push(element);
  }

  getElements(): DocumentElement[] {
    return [...this.elements];
  }

  getTitle(): string {
    return this.title;
  }

  /**
   * Accept a visitor and apply it to all elements
   */
  accept(visitor: DocumentVisitor): void {
    for (const element of this.elements) {
      element.accept(visitor);
    }
  }
}

/**
 * Format statistics for display
 */
export function formatStatistics(stats: DocumentStatistics): string {
  const lines = [
    `  📊 Document Statistics:`,
    `     Words: ${stats.wordCount}`,
    `     Characters: ${stats.characterCount}`,
    `     Images: ${stats.imageCount}`,
    `     Code lines: ${stats.codeLineCount}`,
    `     Elements by type:`,
  ];

  for (const [type, count] of Object.entries(stats.elementCounts)) {
    lines.push(`       - ${type}: ${count}`);
  }

  return lines.join("\n");
}


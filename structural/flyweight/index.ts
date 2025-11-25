/**
 * FLYWEIGHT PATTERN
 *
 * Intent: Use sharing to support large numbers of fine-grained objects efficiently.
 *
 * Real-world example: Text Editor Character Rendering
 * - A document can have millions of characters
 * - Each character has intrinsic state (font, size, style) that can be shared
 * - Each character has extrinsic state (position in document) that is unique
 * - Instead of storing font data per character, share CharacterStyle flyweights
 */

/**
 * Flyweight Interface - Character Style
 * Contains the intrinsic (shared) state
 */
export interface CharacterStyle {
  readonly fontFamily: string;
  readonly fontSize: number;
  readonly fontWeight: "normal" | "bold";
  readonly fontStyle: "normal" | "italic";
  readonly color: string;
  readonly backgroundColor: string | null;

  getKey(): string;
  render(char: string, position: CharacterPosition): string;
  getMemorySize(): number;
}

/**
 * Extrinsic State - Position of character in document
 */
export interface CharacterPosition {
  line: number;
  column: number;
  pageNumber: number;
}

/**
 * Concrete Flyweight - Shared Character Style
 */
export class SharedCharacterStyle implements CharacterStyle {
  readonly fontFamily: string;
  readonly fontSize: number;
  readonly fontWeight: "normal" | "bold";
  readonly fontStyle: "normal" | "italic";
  readonly color: string;
  readonly backgroundColor: string | null;

  constructor(
    fontFamily: string,
    fontSize: number,
    fontWeight: "normal" | "bold" = "normal",
    fontStyle: "normal" | "italic" = "normal",
    color: string = "#000000",
    backgroundColor: string | null = null
  ) {
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.fontWeight = fontWeight;
    this.fontStyle = fontStyle;
    this.color = color;
    this.backgroundColor = backgroundColor;
  }

  getKey(): string {
    return `${this.fontFamily}-${this.fontSize}-${this.fontWeight}-${this.fontStyle}-${this.color}-${this.backgroundColor}`;
  }

  render(char: string, position: CharacterPosition): string {
    const style = `${this.fontFamily} ${this.fontSize}px ${this.fontWeight} ${this.fontStyle}`;
    return `[${char}] at (${position.line}:${position.column}) styled: ${style}`;
  }

  /**
   * Simulated memory footprint of storing style data
   */
  getMemorySize(): number {
    // Rough estimate: strings + numbers
    return (
      this.fontFamily.length * 2 +
      8 + // fontSize (number)
      this.fontWeight.length * 2 +
      this.fontStyle.length * 2 +
      this.color.length * 2 +
      (this.backgroundColor?.length || 0) * 2 +
      64 // Object overhead
    );
  }
}

/**
 * Flyweight Factory - CharacterStyleFactory
 * Manages and shares flyweight instances
 */
export class CharacterStyleFactory {
  private styles: Map<string, CharacterStyle> = new Map();
  private requestCount: number = 0;
  private cacheHits: number = 0;

  /**
   * Get or create a character style
   */
  getStyle(
    fontFamily: string,
    fontSize: number,
    fontWeight: "normal" | "bold" = "normal",
    fontStyle: "normal" | "italic" = "normal",
    color: string = "#000000",
    backgroundColor: string | null = null
  ): CharacterStyle {
    this.requestCount++;

    const key = `${fontFamily}-${fontSize}-${fontWeight}-${fontStyle}-${color}-${backgroundColor}`;

    if (this.styles.has(key)) {
      this.cacheHits++;
      return this.styles.get(key)!;
    }

    const style = new SharedCharacterStyle(
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      color,
      backgroundColor
    );

    this.styles.set(key, style);
    console.log(`  [Factory] Created new style: ${key}`);
    return style;
  }

  /**
   * Get commonly used styles
   */
  getNormalStyle(): CharacterStyle {
    return this.getStyle("Arial", 12, "normal", "normal", "#000000");
  }

  getBoldStyle(): CharacterStyle {
    return this.getStyle("Arial", 12, "bold", "normal", "#000000");
  }

  getItalicStyle(): CharacterStyle {
    return this.getStyle("Arial", 12, "normal", "italic", "#000000");
  }

  getHeadingStyle(level: 1 | 2 | 3): CharacterStyle {
    const sizes = { 1: 24, 2: 20, 3: 16 };
    return this.getStyle("Arial", sizes[level], "bold", "normal", "#1a1a2e");
  }

  getCodeStyle(): CharacterStyle {
    return this.getStyle("Consolas", 11, "normal", "normal", "#2d2d2d", "#f5f5f5");
  }

  /**
   * Get factory statistics
   */
  getStats(): FactoryStats {
    let totalMemory = 0;
    this.styles.forEach((style) => {
      totalMemory += style.getMemorySize();
    });

    return {
      uniqueStyles: this.styles.size,
      totalRequests: this.requestCount,
      cacheHits: this.cacheHits,
      cacheHitRate: this.requestCount > 0 ? (this.cacheHits / this.requestCount) * 100 : 0,
      totalMemoryBytes: totalMemory,
    };
  }

  /**
   * List all cached styles
   */
  listStyles(): string[] {
    return Array.from(this.styles.keys());
  }
}

export interface FactoryStats {
  uniqueStyles: number;
  totalRequests: number;
  cacheHits: number;
  cacheHitRate: number;
  totalMemoryBytes: number;
}

/**
 * Character - Combines flyweight (style) with extrinsic state (position, char)
 */
export class Character {
  private char: string;
  private style: CharacterStyle;
  private position: CharacterPosition;

  constructor(char: string, style: CharacterStyle, position: CharacterPosition) {
    this.char = char;
    this.style = style;
    this.position = position;
  }

  render(): string {
    return this.style.render(this.char, this.position);
  }

  getChar(): string {
    return this.char;
  }

  getPosition(): CharacterPosition {
    return this.position;
  }

  /**
   * Memory used by this character (not counting shared style)
   */
  getUniqueMemory(): number {
    // char (2 bytes) + position object (~24 bytes) + reference (~8 bytes)
    return 2 + 24 + 8;
  }
}

/**
 * Document - Uses characters with flyweight styles
 */
export class TextDocument {
  private characters: Character[] = [];
  private styleFactory: CharacterStyleFactory;
  private currentLine: number = 1;
  private currentColumn: number = 0;
  private pageNumber: number = 1;

  constructor(styleFactory: CharacterStyleFactory) {
    this.styleFactory = styleFactory;
  }

  /**
   * Add text with a specific style
   */
  addText(text: string, style: CharacterStyle): void {
    for (const char of text) {
      if (char === "\n") {
        this.currentLine++;
        this.currentColumn = 0;
        if (this.currentLine % 50 === 0) {
          this.pageNumber++;
        }
      } else {
        this.currentColumn++;
        this.characters.push(
          new Character(char, style, {
            line: this.currentLine,
            column: this.currentColumn,
            pageNumber: this.pageNumber,
          })
        );
      }
    }
  }

  /**
   * Add normal text
   */
  addNormalText(text: string): void {
    this.addText(text, this.styleFactory.getNormalStyle());
  }

  /**
   * Add bold text
   */
  addBoldText(text: string): void {
    this.addText(text, this.styleFactory.getBoldStyle());
  }

  /**
   * Add italic text
   */
  addItalicText(text: string): void {
    this.addText(text, this.styleFactory.getItalicStyle());
  }

  /**
   * Add heading
   */
  addHeading(text: string, level: 1 | 2 | 3 = 1): void {
    this.addText(text, this.styleFactory.getHeadingStyle(level));
    this.addText("\n", this.styleFactory.getNormalStyle());
  }

  /**
   * Add code block
   */
  addCode(text: string): void {
    this.addText(text, this.styleFactory.getCodeStyle());
  }

  /**
   * Add newline
   */
  newLine(): void {
    this.currentLine++;
    this.currentColumn = 0;
  }

  /**
   * Get character count
   */
  getCharacterCount(): number {
    return this.characters.length;
  }

  /**
   * Get memory statistics
   */
  getMemoryStats(): DocumentMemoryStats {
    const uniqueMemory = this.characters.reduce((sum, c) => sum + c.getUniqueMemory(), 0);
    const factoryStats = this.styleFactory.getStats();

    // Without flyweight: each character stores its own style copy
    const memoryWithoutFlyweight = this.characters.length * (34 + 128); // char data + full style copy

    return {
      characterCount: this.characters.length,
      uniqueMemoryBytes: uniqueMemory,
      sharedMemoryBytes: factoryStats.totalMemoryBytes,
      totalMemoryBytes: uniqueMemory + factoryStats.totalMemoryBytes,
      memoryWithoutFlyweightBytes: memoryWithoutFlyweight,
      memorySavedBytes: memoryWithoutFlyweight - (uniqueMemory + factoryStats.totalMemoryBytes),
      memorySavedPercent:
        ((memoryWithoutFlyweight - (uniqueMemory + factoryStats.totalMemoryBytes)) /
          memoryWithoutFlyweight) *
        100,
    };
  }

  /**
   * Preview document content
   */
  preview(limit: number = 100): string {
    return this.characters
      .slice(0, limit)
      .map((c) => c.getChar())
      .join("");
  }

  /**
   * Render specific characters
   */
  renderRange(start: number, end: number): string[] {
    return this.characters.slice(start, end).map((c) => c.render());
  }
}

export interface DocumentMemoryStats {
  characterCount: number;
  uniqueMemoryBytes: number;
  sharedMemoryBytes: number;
  totalMemoryBytes: number;
  memoryWithoutFlyweightBytes: number;
  memorySavedBytes: number;
  memorySavedPercent: number;
}

/**
 * Format factory stats for display
 */
export function formatFactoryStats(stats: FactoryStats): string {
  return [
    `  📊 Style Factory Statistics:`,
    `     Unique styles created: ${stats.uniqueStyles}`,
    `     Total style requests: ${stats.totalRequests}`,
    `     Cache hits: ${stats.cacheHits} (${stats.cacheHitRate.toFixed(1)}%)`,
    `     Shared memory: ${formatBytes(stats.totalMemoryBytes)}`,
  ].join("\n");
}

/**
 * Format document memory stats for display
 */
export function formatDocumentMemory(stats: DocumentMemoryStats): string {
  return [
    `  💾 Document Memory Statistics:`,
    `     Characters: ${stats.characterCount.toLocaleString()}`,
    `     Unique data per char: ${formatBytes(stats.uniqueMemoryBytes)}`,
    `     Shared style data: ${formatBytes(stats.sharedMemoryBytes)}`,
    `     Total with flyweight: ${formatBytes(stats.totalMemoryBytes)}`,
    `     Without flyweight: ${formatBytes(stats.memoryWithoutFlyweightBytes)}`,
    `     Memory saved: ${formatBytes(stats.memorySavedBytes)} (${stats.memorySavedPercent.toFixed(1)}%)`,
  ].join("\n");
}

/**
 * Helper to format bytes
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}


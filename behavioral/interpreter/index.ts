/**
 * INTERPRETER PATTERN
 *
 * Intent: Given a language, define a representation for its grammar along with an
 * interpreter that uses the representation to interpret sentences in the language.
 *
 * Real-world example: Search Query Parser
 * - Users enter search queries like "title:report AND author:john OR priority:high"
 * - The grammar includes field searches, AND/OR operators, and parentheses
 * - The interpreter parses and evaluates queries against data
 * - New expressions can be added without changing existing ones
 */

/**
 * Context - Contains data to be searched and variables
 */
export interface SearchContext {
  data: Record<string, unknown>[];
  variables: Map<string, unknown>;
}

/**
 * Abstract Expression
 */
export interface Expression {
  interpret(context: SearchContext): Record<string, unknown>[];
  toString(): string;
}

/**
 * Terminal Expression - Field Search (field:value)
 */
export class FieldExpression implements Expression {
  private field: string;
  private value: string;
  private operator: "equals" | "contains" | "startsWith" | "endsWith" | "greaterThan" | "lessThan";

  constructor(
    field: string,
    value: string,
    operator: "equals" | "contains" | "startsWith" | "endsWith" | "greaterThan" | "lessThan" = "contains"
  ) {
    this.field = field;
    this.value = value.toLowerCase();
    this.operator = operator;
  }

  interpret(context: SearchContext): Record<string, unknown>[] {
    return context.data.filter((item) => {
      const fieldValue = item[this.field];
      if (fieldValue === undefined) return false;

      const strValue = String(fieldValue).toLowerCase();
      const numValue = Number(fieldValue);

      switch (this.operator) {
        case "equals":
          return strValue === this.value;
        case "contains":
          return strValue.includes(this.value);
        case "startsWith":
          return strValue.startsWith(this.value);
        case "endsWith":
          return strValue.endsWith(this.value);
        case "greaterThan":
          return !isNaN(numValue) && numValue > Number(this.value);
        case "lessThan":
          return !isNaN(numValue) && numValue < Number(this.value);
        default:
          return strValue.includes(this.value);
      }
    });
  }

  toString(): string {
    const opSymbol = {
      equals: "=",
      contains: "~",
      startsWith: "^",
      endsWith: "$",
      greaterThan: ">",
      lessThan: "<",
    }[this.operator];
    return `${this.field}${opSymbol}"${this.value}"`;
  }
}

/**
 * Terminal Expression - All (matches everything)
 */
export class AllExpression implements Expression {
  interpret(context: SearchContext): Record<string, unknown>[] {
    return [...context.data];
  }

  toString(): string {
    return "*";
  }
}

/**
 * Terminal Expression - None (matches nothing)
 */
export class NoneExpression implements Expression {
  interpret(context: SearchContext): Record<string, unknown>[] {
    return [];
  }

  toString(): string {
    return "NONE";
  }
}

/**
 * Non-terminal Expression - AND
 */
export class AndExpression implements Expression {
  private left: Expression;
  private right: Expression;

  constructor(left: Expression, right: Expression) {
    this.left = left;
    this.right = right;
  }

  interpret(context: SearchContext): Record<string, unknown>[] {
    const leftResult = this.left.interpret(context);
    const rightResult = this.right.interpret(context);

    // Intersection
    return leftResult.filter((item) => rightResult.includes(item));
  }

  toString(): string {
    return `(${this.left.toString()} AND ${this.right.toString()})`;
  }
}

/**
 * Non-terminal Expression - OR
 */
export class OrExpression implements Expression {
  private left: Expression;
  private right: Expression;

  constructor(left: Expression, right: Expression) {
    this.left = left;
    this.right = right;
  }

  interpret(context: SearchContext): Record<string, unknown>[] {
    const leftResult = this.left.interpret(context);
    const rightResult = this.right.interpret(context);

    // Union (deduplicated)
    const combined = [...leftResult];
    for (const item of rightResult) {
      if (!combined.includes(item)) {
        combined.push(item);
      }
    }
    return combined;
  }

  toString(): string {
    return `(${this.left.toString()} OR ${this.right.toString()})`;
  }
}

/**
 * Non-terminal Expression - NOT
 */
export class NotExpression implements Expression {
  private expression: Expression;

  constructor(expression: Expression) {
    this.expression = expression;
  }

  interpret(context: SearchContext): Record<string, unknown>[] {
    const excluded = this.expression.interpret(context);
    return context.data.filter((item) => !excluded.includes(item));
  }

  toString(): string {
    return `NOT ${this.expression.toString()}`;
  }
}

/**
 * Non-terminal Expression - Comparison (for numeric fields)
 */
export class ComparisonExpression implements Expression {
  private field: string;
  private operator: ">" | "<" | ">=" | "<=" | "==";
  private value: number;

  constructor(field: string, operator: ">" | "<" | ">=" | "<=" | "==", value: number) {
    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  interpret(context: SearchContext): Record<string, unknown>[] {
    return context.data.filter((item) => {
      const fieldValue = Number(item[this.field]);
      if (isNaN(fieldValue)) return false;

      switch (this.operator) {
        case ">":
          return fieldValue > this.value;
        case "<":
          return fieldValue < this.value;
        case ">=":
          return fieldValue >= this.value;
        case "<=":
          return fieldValue <= this.value;
        case "==":
          return fieldValue === this.value;
        default:
          return false;
      }
    });
  }

  toString(): string {
    return `${this.field} ${this.operator} ${this.value}`;
  }
}

/**
 * Query Parser - Converts string queries to Expression trees
 * Simplified parser for demonstration
 */
export class QueryParser {
  /**
   * Parse a simple query string into an Expression
   * Supports: field:value, AND, OR, NOT, parentheses
   */
  parse(query: string): Expression {
    query = query.trim();

    if (!query || query === "*") {
      return new AllExpression();
    }

    // Handle OR (lowest precedence)
    const orParts = this.splitByOperator(query, " OR ");
    if (orParts.length > 1) {
      let expr = this.parse(orParts[0]);
      for (let i = 1; i < orParts.length; i++) {
        expr = new OrExpression(expr, this.parse(orParts[i]));
      }
      return expr;
    }

    // Handle AND
    const andParts = this.splitByOperator(query, " AND ");
    if (andParts.length > 1) {
      let expr = this.parse(andParts[0]);
      for (let i = 1; i < andParts.length; i++) {
        expr = new AndExpression(expr, this.parse(andParts[i]));
      }
      return expr;
    }

    // Handle NOT
    if (query.startsWith("NOT ")) {
      return new NotExpression(this.parse(query.substring(4)));
    }

    // Handle parentheses
    if (query.startsWith("(") && query.endsWith(")")) {
      return this.parse(query.substring(1, query.length - 1));
    }

    // Handle comparison operators
    const compMatch = query.match(/^(\w+)\s*(>=|<=|>|<|==)\s*(\d+)$/);
    if (compMatch) {
      return new ComparisonExpression(
        compMatch[1],
        compMatch[2] as ">" | "<" | ">=" | "<=" | "==",
        Number(compMatch[3])
      );
    }

    // Handle field:value
    const fieldMatch = query.match(/^(\w+):([\w\s]+)$/);
    if (fieldMatch) {
      return new FieldExpression(fieldMatch[1], fieldMatch[2].trim());
    }

    // Default: search in all text fields
    return new FieldExpression("title", query);
  }

  private splitByOperator(query: string, operator: string): string[] {
    const parts: string[] = [];
    let current = "";
    let depth = 0;

    for (let i = 0; i < query.length; i++) {
      const char = query[i];

      if (char === "(") depth++;
      if (char === ")") depth--;

      if (depth === 0 && query.substring(i, i + operator.length) === operator) {
        parts.push(current.trim());
        current = "";
        i += operator.length - 1;
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      parts.push(current.trim());
    }

    return parts;
  }
}

/**
 * Search Engine - Uses the interpreter to execute queries
 */
export class SearchEngine {
  private data: Record<string, unknown>[] = [];
  private parser: QueryParser = new QueryParser();

  loadData(data: Record<string, unknown>[]): void {
    this.data = data;
    console.log(`  [Engine] Loaded ${data.length} records`);
  }

  search(query: string): SearchResult {
    console.log(`  [Engine] Searching: "${query}"`);

    const expression = this.parser.parse(query);
    console.log(`  [Engine] Parsed as: ${expression.toString()}`);

    const context: SearchContext = {
      data: this.data,
      variables: new Map(),
    };

    const results = expression.interpret(context);
    console.log(`  [Engine] Found ${results.length} results`);

    return {
      query,
      expression: expression.toString(),
      results,
      totalRecords: this.data.length,
    };
  }

  getDataCount(): number {
    return this.data.length;
  }
}

export interface SearchResult {
  query: string;
  expression: string;
  results: Record<string, unknown>[];
  totalRecords: number;
}

/**
 * Helper to create sample data
 */
export function createSampleData(): Record<string, unknown>[] {
  return [
    { id: 1, title: "Annual Report 2023", author: "John Smith", department: "Finance", priority: "high", year: 2023 },
    { id: 2, title: "Quarterly Review Q1", author: "Jane Doe", department: "Marketing", priority: "medium", year: 2024 },
    { id: 3, title: "Project Proposal Alpha", author: "John Smith", department: "Engineering", priority: "high", year: 2024 },
    { id: 4, title: "Budget Analysis Report", author: "Alice Johnson", department: "Finance", priority: "low", year: 2023 },
    { id: 5, title: "Customer Feedback Summary", author: "Bob Wilson", department: "Marketing", priority: "medium", year: 2024 },
    { id: 6, title: "Technical Documentation", author: "Charlie Brown", department: "Engineering", priority: "low", year: 2023 },
    { id: 7, title: "Strategic Plan 2025", author: "Jane Doe", department: "Executive", priority: "critical", year: 2024 },
    { id: 8, title: "Risk Assessment Report", author: "John Smith", department: "Finance", priority: "high", year: 2024 },
    { id: 9, title: "Product Roadmap", author: "Alice Johnson", department: "Engineering", priority: "high", year: 2024 },
    { id: 10, title: "Marketing Campaign Results", author: "Bob Wilson", department: "Marketing", priority: "medium", year: 2023 },
  ];
}

/**
 * Format search results
 */
export function formatSearchResults(result: SearchResult, maxResults: number = 5): string {
  const lines = [
    `  🔍 Query: "${result.query}"`,
    `  📝 Parsed: ${result.expression}`,
    `  📊 Results: ${result.results.length} of ${result.totalRecords} records`,
  ];

  if (result.results.length > 0) {
    lines.push(`  📋 Top results:`);
    result.results.slice(0, maxResults).forEach((item, i) => {
      lines.push(`     ${i + 1}. ${item.title} (${item.author}, ${item.department})`);
    });
    if (result.results.length > maxResults) {
      lines.push(`     ... and ${result.results.length - maxResults} more`);
    }
  }

  return lines.join("\n");
}


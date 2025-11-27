/**
 * FUNCTION COMPOSITION - OOP Approach (Method Chaining)
 *
 * In OOP, composition is typically achieved through:
 * - Method Chaining (Fluent Interface): Methods return `this` to allow chaining
 * - Builder Pattern: Construct complex objects step by step
 * - Decorator Pattern: Wrap objects to add behavior
 *
 * Characteristics:
 * - Methods are bound to objects
 * - State is encapsulated within objects
 * - Chaining is achieved by returning `this`
 * - Each method call mutates or builds upon object state
 */

// Example 1: Fluent Query Builder
// ===============================

class QueryBuilder {
  private selectFields: string[] = [];
  private tableName: string = "";
  private whereConditions: string[] = [];
  private orderByField: string = "";
  private orderDirection: "ASC" | "DESC" = "ASC";
  private limitCount: number | null = null;
  private offsetCount: number | null = null;

  // Returns `this` for chaining
  select(...fields: string[]): this {
    this.selectFields = fields;
    return this;
  }

  from(table: string): this {
    this.tableName = table;
    return this;
  }

  where(condition: string): this {
    this.whereConditions.push(condition);
    return this;
  }

  orderBy(field: string, direction: "ASC" | "DESC" = "ASC"): this {
    this.orderByField = field;
    this.orderDirection = direction;
    return this;
  }

  limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  offset(count: number): this {
    this.offsetCount = count;
    return this;
  }

  build(): string {
    let query = `SELECT ${this.selectFields.join(", ") || "*"}`;
    query += ` FROM ${this.tableName}`;

    if (this.whereConditions.length > 0) {
      query += ` WHERE ${this.whereConditions.join(" AND ")}`;
    }

    if (this.orderByField) {
      query += ` ORDER BY ${this.orderByField} ${this.orderDirection}`;
    }

    if (this.limitCount !== null) {
      query += ` LIMIT ${this.limitCount}`;
    }

    if (this.offsetCount !== null) {
      query += ` OFFSET ${this.offsetCount}`;
    }

    return query;
  }
}

// Example 2: Fluent String Builder
// ================================

class StringBuilder {
  private parts: string[] = [];

  append(str: string): this {
    this.parts.push(str);
    return this;
  }

  appendLine(str: string): this {
    this.parts.push(str + "\n");
    return this;
  }

  prepend(str: string): this {
    this.parts.unshift(str);
    return this;
  }

  toUpperCase(): this {
    this.parts = this.parts.map((p) => p.toUpperCase());
    return this;
  }

  toLowerCase(): this {
    this.parts = this.parts.map((p) => p.toLowerCase());
    return this;
  }

  trim(): this {
    this.parts = this.parts.map((p) => p.trim());
    return this;
  }

  replace(search: string, replacement: string): this {
    this.parts = this.parts.map((p) => p.replace(search, replacement));
    return this;
  }

  build(): string {
    return this.parts.join("");
  }

  clear(): this {
    this.parts = [];
    return this;
  }
}

// Example 3: Fluent Validation Builder
// ====================================

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

class Validator<T> {
  private value: T;
  private errors: string[] = [];
  private fieldName: string;

  constructor(value: T, fieldName: string = "value") {
    this.value = value;
    this.fieldName = fieldName;
  }

  // String validations
  notEmpty(): this {
    if (typeof this.value === "string" && this.value.trim() === "") {
      this.errors.push(`${this.fieldName} must not be empty`);
    }
    return this;
  }

  minLength(min: number): this {
    if (typeof this.value === "string" && this.value.length < min) {
      this.errors.push(`${this.fieldName} must be at least ${min} characters`);
    }
    return this;
  }

  maxLength(max: number): this {
    if (typeof this.value === "string" && this.value.length > max) {
      this.errors.push(`${this.fieldName} must be at most ${max} characters`);
    }
    return this;
  }

  matches(pattern: RegExp, message?: string): this {
    if (typeof this.value === "string" && !pattern.test(this.value)) {
      this.errors.push(message || `${this.fieldName} has invalid format`);
    }
    return this;
  }

  // Number validations
  min(minValue: number): this {
    if (typeof this.value === "number" && this.value < minValue) {
      this.errors.push(`${this.fieldName} must be at least ${minValue}`);
    }
    return this;
  }

  max(maxValue: number): this {
    if (typeof this.value === "number" && this.value > maxValue) {
      this.errors.push(`${this.fieldName} must be at most ${maxValue}`);
    }
    return this;
  }

  isPositive(): this {
    if (typeof this.value === "number" && this.value <= 0) {
      this.errors.push(`${this.fieldName} must be positive`);
    }
    return this;
  }

  isInteger(): this {
    if (typeof this.value === "number" && !Number.isInteger(this.value)) {
      this.errors.push(`${this.fieldName} must be an integer`);
    }
    return this;
  }

  // Custom validation
  custom(predicate: (value: T) => boolean, message: string): this {
    if (!predicate(this.value)) {
      this.errors.push(message);
    }
    return this;
  }

  validate(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: [...this.errors],
    };
  }
}

// Example 4: Fluent HTTP Request Builder
// ======================================

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestConfig {
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

class RequestBuilder {
  private config: RequestConfig = {
    method: "GET",
    url: "",
    headers: {},
  };

  get(url: string): this {
    this.config.method = "GET";
    this.config.url = url;
    return this;
  }

  post(url: string): this {
    this.config.method = "POST";
    this.config.url = url;
    return this;
  }

  put(url: string): this {
    this.config.method = "PUT";
    this.config.url = url;
    return this;
  }

  delete(url: string): this {
    this.config.method = "DELETE";
    this.config.url = url;
    return this;
  }

  header(key: string, value: string): this {
    this.config.headers[key] = value;
    return this;
  }

  contentType(type: string): this {
    return this.header("Content-Type", type);
  }

  authorization(token: string): this {
    return this.header("Authorization", `Bearer ${token}`);
  }

  body(data: unknown): this {
    this.config.body = data;
    return this;
  }

  json(data: unknown): this {
    this.contentType("application/json");
    this.config.body = data;
    return this;
  }

  timeout(ms: number): this {
    this.config.timeout = ms;
    return this;
  }

  build(): RequestConfig {
    return { ...this.config };
  }

  // Simulate sending the request
  async send(): Promise<{ status: number; data: unknown }> {
    console.log(`Sending ${this.config.method} request to ${this.config.url}`);
    console.log("Headers:", this.config.headers);
    if (this.config.body) {
      console.log("Body:", this.config.body);
    }
    // Simulated response
    return { status: 200, data: { success: true } };
  }
}

// Example 5: Fluent Array Operations (Collection Class)
// =====================================================

class Collection<T> {
  private items: T[];

  constructor(items: T[] = []) {
    this.items = [...items];
  }

  // Returns new Collection for immutable-style chaining
  map<R>(fn: (item: T) => R): Collection<R> {
    return new Collection(this.items.map(fn));
  }

  filter(predicate: (item: T) => boolean): Collection<T> {
    return new Collection(this.items.filter(predicate));
  }

  sort(comparator?: (a: T, b: T) => number): Collection<T> {
    return new Collection([...this.items].sort(comparator));
  }

  take(count: number): Collection<T> {
    return new Collection(this.items.slice(0, count));
  }

  skip(count: number): Collection<T> {
    return new Collection(this.items.slice(count));
  }

  reverse(): Collection<T> {
    return new Collection([...this.items].reverse());
  }

  unique(): Collection<T> {
    return new Collection([...new Set(this.items)]);
  }

  // Terminal operations
  reduce<R>(fn: (acc: R, item: T) => R, initial: R): R {
    return this.items.reduce(fn, initial);
  }

  first(): T | undefined {
    return this.items[0];
  }

  last(): T | undefined {
    return this.items[this.items.length - 1];
  }

  count(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return [...this.items];
  }

  forEach(fn: (item: T) => void): void {
    this.items.forEach(fn);
  }
}

// Demonstration
// =============

function demonstrateMethodChaining(): void {
  console.log("=== OOP Method Chaining Demonstration ===\n");

  // Query Builder
  console.log("1. Fluent Query Builder:");
  const query = new QueryBuilder()
    .select("id", "name", "email")
    .from("users")
    .where("age > 18")
    .where("status = 'active'")
    .orderBy("name", "ASC")
    .limit(10)
    .offset(20)
    .build();
  console.log(query);

  // String Builder
  console.log("\n2. Fluent String Builder:");
  const greeting = new StringBuilder()
    .append("Hello, ")
    .append("World")
    .append("!")
    .toUpperCase()
    .build();
  console.log(greeting);

  const multiLine = new StringBuilder()
    .appendLine("Line 1")
    .appendLine("Line 2")
    .appendLine("Line 3")
    .build();
  console.log(multiLine);

  // Validator
  console.log("3. Fluent Validation:");
  const emailResult = new Validator("test@example.com", "email")
    .notEmpty()
    .minLength(5)
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    .validate();
  console.log(`Email validation: ${JSON.stringify(emailResult)}`);

  const ageResult = new Validator(15, "age")
    .min(18)
    .max(120)
    .isInteger()
    .validate();
  console.log(`Age validation: ${JSON.stringify(ageResult)}`);

  // Request Builder
  console.log("\n4. Fluent HTTP Request Builder:");
  const request = new RequestBuilder()
    .post("https://api.example.com/users")
    .contentType("application/json")
    .authorization("my-token")
    .json({ name: "John", email: "john@example.com" })
    .timeout(5000)
    .build();
  console.log("Request config:", request);

  // Collection
  console.log("\n5. Fluent Collection Operations:");
  const numbers = new Collection([5, 2, 8, 1, 9, 3, 7, 4, 6]);

  const result = numbers
    .filter((n) => n > 3)
    .map((n) => n * 2)
    .sort((a, b) => a - b)
    .take(5)
    .toArray();

  console.log(`Original: [${numbers.toArray()}]`);
  console.log(`Filtered (>3), doubled, sorted, take 5: [${result}]`);

  const sum = numbers.reduce((acc, n) => acc + n, 0);
  console.log(`Sum: ${sum}`);
}

demonstrateMethodChaining();

export {
  QueryBuilder,
  StringBuilder,
  Validator,
  RequestBuilder,
  Collection,
};

export type { ValidationResult, HttpMethod, RequestConfig };


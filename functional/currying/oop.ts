/**
 * CURRYING - OOP Approach (Builder Pattern)
 *
 * In OOP, the Builder Pattern is often used to construct complex objects
 * step by step, similar to how currying allows partial application of arguments.
 *
 * Builder Pattern characteristics:
 * - Separates construction from representation
 * - Allows step-by-step object creation
 * - Methods return `this` for chaining
 * - Final `build()` method produces the result
 *
 * This is conceptually similar to currying but with more ceremony.
 */

// Example 1: Pizza Builder
// ========================

type PizzaSize = "small" | "medium" | "large";
type CrustType = "thin" | "thick" | "stuffed";

interface Pizza {
  size: PizzaSize;
  crust: CrustType;
  cheese: boolean;
  toppings: string[];
  extraCheese: boolean;
  price: number;
}

class PizzaBuilder {
  private size: PizzaSize = "medium";
  private crust: CrustType = "thin";
  private cheese: boolean = true;
  private toppings: string[] = [];
  private extraCheese: boolean = false;

  setSize(size: PizzaSize): this {
    this.size = size;
    return this;
  }

  setCrust(crust: CrustType): this {
    this.crust = crust;
    return this;
  }

  withCheese(): this {
    this.cheese = true;
    return this;
  }

  withoutCheese(): this {
    this.cheese = false;
    return this;
  }

  addTopping(topping: string): this {
    this.toppings.push(topping);
    return this;
  }

  withExtraCheese(): this {
    this.extraCheese = true;
    return this;
  }

  private calculatePrice(): number {
    let price = 0;

    // Base price by size
    switch (this.size) {
      case "small":
        price = 8;
        break;
      case "medium":
        price = 10;
        break;
      case "large":
        price = 12;
        break;
    }

    // Crust price
    if (this.crust === "stuffed") price += 3;
    if (this.crust === "thick") price += 1;

    // Toppings
    price += this.toppings.length * 1.5;

    // Extra cheese
    if (this.extraCheese) price += 2;

    return price;
  }

  build(): Pizza {
    return {
      size: this.size,
      crust: this.crust,
      cheese: this.cheese,
      toppings: [...this.toppings],
      extraCheese: this.extraCheese,
      price: this.calculatePrice(),
    };
  }
}

// Example 2: Email Builder
// ========================

interface Email {
  from: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  isHtml: boolean;
  attachments: string[];
  priority: "low" | "normal" | "high";
}

class EmailBuilder {
  private from: string = "";
  private to: string[] = [];
  private cc: string[] = [];
  private bcc: string[] = [];
  private subject: string = "";
  private body: string = "";
  private isHtml: boolean = false;
  private attachments: string[] = [];
  private priority: "low" | "normal" | "high" = "normal";

  setFrom(email: string): this {
    this.from = email;
    return this;
  }

  addTo(email: string): this {
    this.to.push(email);
    return this;
  }

  addCc(email: string): this {
    this.cc.push(email);
    return this;
  }

  addBcc(email: string): this {
    this.bcc.push(email);
    return this;
  }

  setSubject(subject: string): this {
    this.subject = subject;
    return this;
  }

  setBody(body: string): this {
    this.body = body;
    return this;
  }

  setHtmlBody(html: string): this {
    this.body = html;
    this.isHtml = true;
    return this;
  }

  addAttachment(filename: string): this {
    this.attachments.push(filename);
    return this;
  }

  setPriority(priority: "low" | "normal" | "high"): this {
    this.priority = priority;
    return this;
  }

  build(): Email {
    if (!this.from) throw new Error("From address is required");
    if (this.to.length === 0) throw new Error("At least one recipient is required");

    return {
      from: this.from,
      to: [...this.to],
      cc: [...this.cc],
      bcc: [...this.bcc],
      subject: this.subject,
      body: this.body,
      isHtml: this.isHtml,
      attachments: [...this.attachments],
      priority: this.priority,
    };
  }
}

// Example 3: HTTP Request Builder
// ===============================

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface HttpRequest {
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  body?: unknown;
  timeout: number;
  retries: number;
}

class HttpRequestBuilder {
  private method: HttpMethod = "GET";
  private url: string = "";
  private headers: Record<string, string> = {};
  private queryParams: Record<string, string> = {};
  private body?: unknown;
  private timeout: number = 30000;
  private retries: number = 0;

  get(url: string): this {
    this.method = "GET";
    this.url = url;
    return this;
  }

  post(url: string): this {
    this.method = "POST";
    this.url = url;
    return this;
  }

  put(url: string): this {
    this.method = "PUT";
    this.url = url;
    return this;
  }

  delete(url: string): this {
    this.method = "DELETE";
    this.url = url;
    return this;
  }

  setHeader(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }

  setQueryParam(key: string, value: string): this {
    this.queryParams[key] = value;
    return this;
  }

  setBody(body: unknown): this {
    this.body = body;
    return this;
  }

  setJson(data: unknown): this {
    this.headers["Content-Type"] = "application/json";
    this.body = data;
    return this;
  }

  setBearerToken(token: string): this {
    this.headers["Authorization"] = `Bearer ${token}`;
    return this;
  }

  setTimeout(ms: number): this {
    this.timeout = ms;
    return this;
  }

  setRetries(count: number): this {
    this.retries = count;
    return this;
  }

  build(): HttpRequest {
    if (!this.url) throw new Error("URL is required");

    return {
      method: this.method,
      url: this.url,
      headers: { ...this.headers },
      queryParams: { ...this.queryParams },
      body: this.body,
      timeout: this.timeout,
      retries: this.retries,
    };
  }
}

// Example 4: Configuration Builder
// ================================

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  poolSize: number;
  connectionTimeout: number;
}

class DatabaseConfigBuilder {
  private host: string = "localhost";
  private port: number = 5432;
  private database: string = "";
  private username: string = "";
  private password: string = "";
  private ssl: boolean = false;
  private poolSize: number = 10;
  private connectionTimeout: number = 5000;

  setHost(host: string): this {
    this.host = host;
    return this;
  }

  setPort(port: number): this {
    this.port = port;
    return this;
  }

  setDatabase(database: string): this {
    this.database = database;
    return this;
  }

  setCredentials(username: string, password: string): this {
    this.username = username;
    this.password = password;
    return this;
  }

  enableSsl(): this {
    this.ssl = true;
    return this;
  }

  setPoolSize(size: number): this {
    this.poolSize = size;
    return this;
  }

  setConnectionTimeout(ms: number): this {
    this.connectionTimeout = ms;
    return this;
  }

  build(): DatabaseConfig {
    if (!this.database) throw new Error("Database name is required");
    if (!this.username) throw new Error("Username is required");

    return {
      host: this.host,
      port: this.port,
      database: this.database,
      username: this.username,
      password: this.password,
      ssl: this.ssl,
      poolSize: this.poolSize,
      connectionTimeout: this.connectionTimeout,
    };
  }
}

// Example 5: Function Configuration with Classes
// ==============================================

// In OOP, configuring functions often requires wrapper classes

class Logger {
  private prefix: string;
  private level: "debug" | "info" | "warn" | "error";
  private includeTimestamp: boolean;

  constructor(prefix: string = "") {
    this.prefix = prefix;
    this.level = "info";
    this.includeTimestamp = true;
  }

  setPrefix(prefix: string): this {
    this.prefix = prefix;
    return this;
  }

  setLevel(level: "debug" | "info" | "warn" | "error"): this {
    this.level = level;
    return this;
  }

  withTimestamp(): this {
    this.includeTimestamp = true;
    return this;
  }

  withoutTimestamp(): this {
    this.includeTimestamp = false;
    return this;
  }

  private formatMessage(message: string): string {
    let formatted = "";
    if (this.includeTimestamp) {
      formatted += `[${new Date().toISOString()}] `;
    }
    if (this.prefix) {
      formatted += `[${this.prefix}] `;
    }
    formatted += message;
    return formatted;
  }

  log(message: string): void {
    console.log(this.formatMessage(message));
  }

  debug(message: string): void {
    if (this.level === "debug") {
      console.debug(this.formatMessage(`DEBUG: ${message}`));
    }
  }

  info(message: string): void {
    if (["debug", "info"].includes(this.level)) {
      console.info(this.formatMessage(`INFO: ${message}`));
    }
  }

  warn(message: string): void {
    if (["debug", "info", "warn"].includes(this.level)) {
      console.warn(this.formatMessage(`WARN: ${message}`));
    }
  }

  error(message: string): void {
    console.error(this.formatMessage(`ERROR: ${message}`));
  }
}

// Example 6: Mathematical Operations Builder
// ==========================================

class MathOperation {
  private value: number;
  private operations: Array<{ name: string; fn: (x: number) => number }> = [];

  constructor(initialValue: number = 0) {
    this.value = initialValue;
  }

  add(n: number): this {
    this.operations.push({ name: `add(${n})`, fn: (x) => x + n });
    return this;
  }

  subtract(n: number): this {
    this.operations.push({ name: `subtract(${n})`, fn: (x) => x - n });
    return this;
  }

  multiply(n: number): this {
    this.operations.push({ name: `multiply(${n})`, fn: (x) => x * n });
    return this;
  }

  divide(n: number): this {
    this.operations.push({ name: `divide(${n})`, fn: (x) => x / n });
    return this;
  }

  power(n: number): this {
    this.operations.push({ name: `power(${n})`, fn: (x) => Math.pow(x, n) });
    return this;
  }

  execute(): number {
    return this.operations.reduce((acc, op) => op.fn(acc), this.value);
  }

  getSteps(): string {
    return this.operations.map((op) => op.name).join(" -> ");
  }
}

// Demonstration
// =============

function demonstrateBuilderPattern(): void {
  console.log("=== OOP Builder Pattern (Similar to Currying) ===\n");

  // Pizza Builder
  console.log("1. Pizza Builder:");
  const pizza = new PizzaBuilder()
    .setSize("large")
    .setCrust("stuffed")
    .addTopping("pepperoni")
    .addTopping("mushrooms")
    .addTopping("olives")
    .withExtraCheese()
    .build();
  console.log("Pizza:", pizza);

  // Email Builder
  console.log("\n2. Email Builder:");
  const email = new EmailBuilder()
    .setFrom("sender@example.com")
    .addTo("recipient1@example.com")
    .addTo("recipient2@example.com")
    .addCc("cc@example.com")
    .setSubject("Meeting Tomorrow")
    .setBody("Please join us for the meeting tomorrow at 10am.")
    .setPriority("high")
    .build();
  console.log("Email:", email);

  // HTTP Request Builder
  console.log("\n3. HTTP Request Builder:");
  const request = new HttpRequestBuilder()
    .post("https://api.example.com/users")
    .setBearerToken("my-secret-token")
    .setJson({ name: "John", email: "john@example.com" })
    .setTimeout(5000)
    .setRetries(3)
    .build();
  console.log("Request:", request);

  // Database Config Builder
  console.log("\n4. Database Config Builder:");
  const dbConfig = new DatabaseConfigBuilder()
    .setHost("db.example.com")
    .setPort(5432)
    .setDatabase("myapp")
    .setCredentials("admin", "secret")
    .enableSsl()
    .setPoolSize(20)
    .build();
  console.log("DB Config:", dbConfig);

  // Logger Configuration
  console.log("\n5. Logger Configuration:");
  const logger = new Logger()
    .setPrefix("APP")
    .setLevel("debug")
    .withTimestamp();

  logger.debug("This is a debug message");
  logger.info("This is an info message");
  logger.warn("This is a warning");
  logger.error("This is an error");

  // Math Operations
  console.log("\n6. Math Operations Builder:");
  const mathOp = new MathOperation(10)
    .add(5)
    .multiply(2)
    .subtract(10)
    .divide(2);

  console.log(`Operations: ${mathOp.getSteps()}`);
  console.log(`Result: ${mathOp.execute()}`);
}

demonstrateBuilderPattern();

export {
  PizzaBuilder,
  EmailBuilder,
  HttpRequestBuilder,
  DatabaseConfigBuilder,
  Logger,
  MathOperation,
};

export type {
  Pizza,
  PizzaSize,
  CrustType,
  Email,
  HttpMethod,
  HttpRequest,
  DatabaseConfig,
};


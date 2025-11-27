/**
 * PARTIAL APPLICATION - OOP Approach (Factory Methods & Specialized Classes)
 *
 * In OOP, partial application is typically achieved through:
 * - Factory Methods: Create objects with pre-configured parameters
 * - Specialized Subclasses: Extend base classes with fixed parameters
 * - Configuration Objects: Pass configuration to constructors
 * - Method Overloading: Provide methods with different parameter sets
 *
 * These patterns require more boilerplate but are common in OOP codebases.
 */

// Example 1: Factory Methods for HTTP Clients
// ===========================================

interface HttpClientConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

class HttpClient {
  private config: HttpClientConfig;

  constructor(config: Partial<HttpClientConfig> = {}) {
    this.config = {
      baseUrl: config.baseUrl || "",
      timeout: config.timeout || 30000,
      headers: config.headers || {},
    };
  }

  // Factory methods - create pre-configured instances
  static createForApi(baseUrl: string, apiKey: string): HttpClient {
    return new HttpClient({
      baseUrl,
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });
  }

  static createForAuth(baseUrl: string, token: string): HttpClient {
    return new HttpClient({
      baseUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }

  static createWithTimeout(baseUrl: string, timeout: number): HttpClient {
    return new HttpClient({
      baseUrl,
      timeout,
    });
  }

  async get(path: string): Promise<{ url: string; method: string; config: HttpClientConfig }> {
    const url = `${this.config.baseUrl}${path}`;
    console.log(`GET ${url}`);
    return { url, method: "GET", config: this.config };
  }

  async post(
    path: string,
    data: unknown
  ): Promise<{ url: string; method: string; data: unknown; config: HttpClientConfig }> {
    const url = `${this.config.baseUrl}${path}`;
    console.log(`POST ${url}`, data);
    return { url, method: "POST", data, config: this.config };
  }
}

// Example 2: Specialized Logger Classes
// =====================================

interface LoggerConfig {
  prefix: string;
  level: "debug" | "info" | "warn" | "error";
  includeTimestamp: boolean;
  output: (message: string) => void;
}

class Logger {
  protected config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      prefix: config.prefix || "",
      level: config.level || "info",
      includeTimestamp: config.includeTimestamp ?? true,
      output: config.output || console.log,
    };
  }

  protected formatMessage(level: string, message: string): string {
    let formatted = "";
    if (this.config.includeTimestamp) {
      formatted += `[${new Date().toISOString()}] `;
    }
    if (this.config.prefix) {
      formatted += `[${this.config.prefix}] `;
    }
    formatted += `${level}: ${message}`;
    return formatted;
  }

  log(message: string): void {
    this.config.output(this.formatMessage("LOG", message));
  }

  debug(message: string): void {
    if (this.config.level === "debug") {
      this.config.output(this.formatMessage("DEBUG", message));
    }
  }

  info(message: string): void {
    if (["debug", "info"].includes(this.config.level)) {
      this.config.output(this.formatMessage("INFO", message));
    }
  }

  warn(message: string): void {
    if (["debug", "info", "warn"].includes(this.config.level)) {
      this.config.output(this.formatMessage("WARN", message));
    }
  }

  error(message: string): void {
    this.config.output(this.formatMessage("ERROR", message));
  }
}

// Specialized subclasses - partial application through inheritance
class AppLogger extends Logger {
  constructor() {
    super({ prefix: "APP", level: "debug", includeTimestamp: true });
  }
}

class SecurityLogger extends Logger {
  constructor() {
    super({ prefix: "SECURITY", level: "info", includeTimestamp: true });
  }
}

class PerformanceLogger extends Logger {
  constructor() {
    super({ prefix: "PERF", level: "debug", includeTimestamp: true });
  }
}

// Factory class for creating loggers
class LoggerFactory {
  static createAppLogger(): Logger {
    return new Logger({ prefix: "APP", level: "debug" });
  }

  static createSecurityLogger(): Logger {
    return new Logger({ prefix: "SECURITY", level: "info" });
  }

  static createPerformanceLogger(): Logger {
    return new Logger({ prefix: "PERF", level: "debug" });
  }

  static createWithPrefix(prefix: string): Logger {
    return new Logger({ prefix });
  }

  static createSilent(): Logger {
    return new Logger({ output: () => {} });
  }
}

// Example 3: Specialized Validators
// =================================

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

abstract class Validator<T> {
  abstract validate(value: T): ValidationResult;

  protected createResult(errors: string[]): ValidationResult {
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

class StringValidator extends Validator<string> {
  private minLength: number;
  private maxLength: number;
  private pattern?: RegExp;
  private patternMessage?: string;

  constructor(
    minLength: number = 0,
    maxLength: number = Infinity,
    pattern?: RegExp,
    patternMessage?: string
  ) {
    super();
    this.minLength = minLength;
    this.maxLength = maxLength;
    this.pattern = pattern;
    this.patternMessage = patternMessage;
  }

  // Factory methods for common validators
  static email(): StringValidator {
    return new StringValidator(
      5,
      254,
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Invalid email format"
    );
  }

  static password(): StringValidator {
    return new StringValidator(8, 100);
  }

  static username(): StringValidator {
    return new StringValidator(
      3,
      20,
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    );
  }

  static phone(): StringValidator {
    return new StringValidator(
      10,
      15,
      /^\+?[0-9]+$/,
      "Invalid phone number format"
    );
  }

  validate(value: string): ValidationResult {
    const errors: string[] = [];

    if (value.length < this.minLength) {
      errors.push(`Must be at least ${this.minLength} characters`);
    }

    if (value.length > this.maxLength) {
      errors.push(`Must be at most ${this.maxLength} characters`);
    }

    if (this.pattern && !this.pattern.test(value)) {
      errors.push(this.patternMessage || "Invalid format");
    }

    return this.createResult(errors);
  }
}

class NumberValidator extends Validator<number> {
  private min: number;
  private max: number;
  private mustBeInteger: boolean;

  constructor(
    min: number = -Infinity,
    max: number = Infinity,
    mustBeInteger: boolean = false
  ) {
    super();
    this.min = min;
    this.max = max;
    this.mustBeInteger = mustBeInteger;
  }

  // Factory methods
  static age(): NumberValidator {
    return new NumberValidator(0, 150, true);
  }

  static percentage(): NumberValidator {
    return new NumberValidator(0, 100);
  }

  static positiveInteger(): NumberValidator {
    return new NumberValidator(1, Infinity, true);
  }

  static price(): NumberValidator {
    return new NumberValidator(0, Infinity);
  }

  validate(value: number): ValidationResult {
    const errors: string[] = [];

    if (value < this.min) {
      errors.push(`Must be at least ${this.min}`);
    }

    if (value > this.max) {
      errors.push(`Must be at most ${this.max}`);
    }

    if (this.mustBeInteger && !Number.isInteger(value)) {
      errors.push("Must be an integer");
    }

    return this.createResult(errors);
  }
}

// Example 4: Specialized Formatters
// =================================

class Formatter {
  private locale: string;
  private currency: string;
  private dateStyle: "short" | "medium" | "long" | "full";

  constructor(
    locale: string = "en-US",
    currency: string = "USD",
    dateStyle: "short" | "medium" | "long" | "full" = "medium"
  ) {
    this.locale = locale;
    this.currency = currency;
    this.dateStyle = dateStyle;
  }

  // Factory methods for common formatters
  static us(): Formatter {
    return new Formatter("en-US", "USD", "medium");
  }

  static uk(): Formatter {
    return new Formatter("en-GB", "GBP", "medium");
  }

  static eu(): Formatter {
    return new Formatter("de-DE", "EUR", "medium");
  }

  static japan(): Formatter {
    return new Formatter("ja-JP", "JPY", "medium");
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat(this.locale, {
      style: "currency",
      currency: this.currency,
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat(this.locale, {
      dateStyle: this.dateStyle,
    }).format(date);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat(this.locale).format(num);
  }

  formatPercent(num: number): string {
    return new Intl.NumberFormat(this.locale, {
      style: "percent",
      minimumFractionDigits: 1,
    }).format(num);
  }
}

// Example 5: Specialized Event Handlers
// =====================================

interface EventConfig {
  preventDefault: boolean;
  stopPropagation: boolean;
  debounceMs: number;
}

class EventHandler {
  private config: EventConfig;
  private handler: (event: Event) => void;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(handler: (event: Event) => void, config: Partial<EventConfig> = {}) {
    this.handler = handler;
    this.config = {
      preventDefault: config.preventDefault ?? false,
      stopPropagation: config.stopPropagation ?? false,
      debounceMs: config.debounceMs ?? 0,
    };
  }

  // Factory methods
  static clickHandler(handler: (event: Event) => void): EventHandler {
    return new EventHandler(handler, {
      preventDefault: true,
      stopPropagation: true,
    });
  }

  static submitHandler(handler: (event: Event) => void): EventHandler {
    return new EventHandler(handler, {
      preventDefault: true,
    });
  }

  static inputHandler(handler: (event: Event) => void, debounceMs: number = 300): EventHandler {
    return new EventHandler(handler, {
      debounceMs,
    });
  }

  static scrollHandler(handler: (event: Event) => void): EventHandler {
    return new EventHandler(handler, {
      debounceMs: 100,
    });
  }

  handle(event: Event): void {
    if (this.config.preventDefault) {
      event.preventDefault();
    }

    if (this.config.stopPropagation) {
      event.stopPropagation();
    }

    if (this.config.debounceMs > 0) {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        this.handler(event);
      }, this.config.debounceMs);
    } else {
      this.handler(event);
    }
  }
}

// Example 6: Specialized Database Query Builders
// ==============================================

interface QueryConfig {
  table: string;
  defaultLimit: number;
  softDelete: boolean;
  orderBy: string;
  orderDirection: "ASC" | "DESC";
}

class QueryBuilder {
  protected config: QueryConfig;
  private conditions: string[] = [];
  private selectedFields: string[] = [];
  private limitValue: number | null = null;

  constructor(config: Partial<QueryConfig>) {
    this.config = {
      table: config.table || "",
      defaultLimit: config.defaultLimit || 100,
      softDelete: config.softDelete ?? true,
      orderBy: config.orderBy || "id",
      orderDirection: config.orderDirection || "ASC",
    };
  }

  // Factory methods for common queries
  static forUsers(): QueryBuilder {
    return new QueryBuilder({
      table: "users",
      defaultLimit: 50,
      softDelete: true,
      orderBy: "created_at",
      orderDirection: "DESC",
    });
  }

  static forOrders(): QueryBuilder {
    return new QueryBuilder({
      table: "orders",
      defaultLimit: 100,
      softDelete: false,
      orderBy: "order_date",
      orderDirection: "DESC",
    });
  }

  static forProducts(): QueryBuilder {
    return new QueryBuilder({
      table: "products",
      defaultLimit: 50,
      softDelete: true,
      orderBy: "name",
      orderDirection: "ASC",
    });
  }

  select(...fields: string[]): this {
    this.selectedFields = fields;
    return this;
  }

  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }

  limit(count: number): this {
    this.limitValue = count;
    return this;
  }

  build(): string {
    const fields = this.selectedFields.length > 0 ? this.selectedFields.join(", ") : "*";
    let query = `SELECT ${fields} FROM ${this.config.table}`;

    const allConditions = [...this.conditions];
    if (this.config.softDelete) {
      allConditions.push("deleted_at IS NULL");
    }

    if (allConditions.length > 0) {
      query += ` WHERE ${allConditions.join(" AND ")}`;
    }

    query += ` ORDER BY ${this.config.orderBy} ${this.config.orderDirection}`;
    query += ` LIMIT ${this.limitValue ?? this.config.defaultLimit}`;

    return query;
  }
}

// Demonstration
// =============

function demonstrateOOPPartialApplication(): void {
  console.log("=== OOP Partial Application (Factory Methods) ===\n");

  // HTTP Clients
  console.log("1. HTTP Client Factory Methods:");
  const apiClient = HttpClient.createForApi("https://api.example.com", "my-api-key");
  const authClient = HttpClient.createForAuth("https://auth.example.com", "my-token");
  const timeoutClient = HttpClient.createWithTimeout("https://slow.example.com", 60000);

  apiClient.get("/users");
  authClient.get("/profile");
  timeoutClient.get("/large-data");

  // Loggers
  console.log("\n2. Logger Factory Methods:");
  const appLogger = LoggerFactory.createAppLogger();
  const securityLogger = LoggerFactory.createSecurityLogger();
  const customLogger = LoggerFactory.createWithPrefix("CUSTOM");

  appLogger.info("Application started");
  securityLogger.warn("Suspicious activity detected");
  customLogger.debug("Custom debug message");

  // Specialized logger classes
  const appLogger2 = new AppLogger();
  appLogger2.info("Using specialized AppLogger class");

  // Validators
  console.log("\n3. Validator Factory Methods:");
  const emailValidator = StringValidator.email();
  const passwordValidator = StringValidator.password();
  const ageValidator = NumberValidator.age();

  console.log(`Email "test@example.com": ${JSON.stringify(emailValidator.validate("test@example.com"))}`);
  console.log(`Email "invalid": ${JSON.stringify(emailValidator.validate("invalid"))}`);
  console.log(`Password "short": ${JSON.stringify(passwordValidator.validate("short"))}`);
  console.log(`Age 25: ${JSON.stringify(ageValidator.validate(25))}`);
  console.log(`Age -5: ${JSON.stringify(ageValidator.validate(-5))}`);

  // Formatters
  console.log("\n4. Formatter Factory Methods:");
  const usFormatter = Formatter.us();
  const ukFormatter = Formatter.uk();
  const euFormatter = Formatter.eu();

  const amount = 1234.56;
  const date = new Date();

  console.log(`US: ${usFormatter.formatCurrency(amount)}, ${usFormatter.formatDate(date)}`);
  console.log(`UK: ${ukFormatter.formatCurrency(amount)}, ${ukFormatter.formatDate(date)}`);
  console.log(`EU: ${euFormatter.formatCurrency(amount)}, ${euFormatter.formatDate(date)}`);

  // Query Builders
  console.log("\n5. Query Builder Factory Methods:");
  const userQuery = QueryBuilder.forUsers()
    .select("id", "name", "email")
    .where("status = 'active'")
    .limit(10)
    .build();
  console.log(`User query: ${userQuery}`);

  const orderQuery = QueryBuilder.forOrders()
    .where("total > 100")
    .build();
  console.log(`Order query: ${orderQuery}`);

  const productQuery = QueryBuilder.forProducts()
    .select("id", "name", "price")
    .where("in_stock = true")
    .build();
  console.log(`Product query: ${productQuery}`);
}

demonstrateOOPPartialApplication();

export {
  HttpClient,
  Logger,
  AppLogger,
  SecurityLogger,
  PerformanceLogger,
  LoggerFactory,
  Validator,
  StringValidator,
  NumberValidator,
  Formatter,
  EventHandler,
  QueryBuilder,
};

export type { HttpClientConfig, LoggerConfig, ValidationResult, EventConfig, QueryConfig };


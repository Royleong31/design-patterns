/**
 * PARTIAL APPLICATION - Functional Programming Approach
 *
 * Partial application is fixing a number of arguments to a function,
 * producing another function of smaller arity.
 *
 * Unlike currying (which transforms f(a,b,c) into f(a)(b)(c)),
 * partial application allows fixing any subset of arguments.
 *
 * Benefits:
 * - Create specialized functions from general ones
 * - Reduce code duplication
 * - Improve readability with meaningful function names
 * - Enable point-free programming style
 */

// Partial Application Utilities
// =============================

// Partial application for 2-argument functions
const partial2First =
  <A, B, R>(fn: (a: A, b: B) => R, a: A) =>
  (b: B): R =>
    fn(a, b);

const partial2Second =
  <A, B, R>(fn: (a: A, b: B) => R, b: B) =>
  (a: A): R =>
    fn(a, b);

// Partial application for 3-argument functions
const partial3First =
  <A, B, C, R>(fn: (a: A, b: B, c: C) => R, a: A) =>
  (b: B, c: C): R =>
    fn(a, b, c);

const partial3FirstTwo =
  <A, B, C, R>(fn: (a: A, b: B, c: C) => R, a: A, b: B) =>
  (c: C): R =>
    fn(a, b, c);

// Generic partial application (using rest parameters)
const partial =
  <T extends unknown[], R>(fn: (...args: T) => R, ...partialArgs: Partial<T>) =>
  (...remainingArgs: unknown[]): R => {
    const allArgs = [...partialArgs, ...remainingArgs] as T;
    return fn(...allArgs);
  };

// Example 1: Partially Applied HTTP Functions
// ===========================================

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestConfig = Readonly<{
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body?: unknown;
}>;

// Base request function
const makeRequest = (
  method: HttpMethod,
  baseUrl: string,
  headers: Record<string, string>,
  path: string,
  body?: unknown
): RequestConfig => ({
  method,
  url: `${baseUrl}${path}`,
  headers,
  body,
});

// Partially applied: Fix method
const get = (baseUrl: string, headers: Record<string, string>, path: string) =>
  makeRequest("GET", baseUrl, headers, path);

const post = (baseUrl: string, headers: Record<string, string>, path: string, body: unknown) =>
  makeRequest("POST", baseUrl, headers, path, body);

// Partially applied: Fix method and baseUrl
const createApiClient = (baseUrl: string) => ({
  get: (headers: Record<string, string>, path: string) =>
    makeRequest("GET", baseUrl, headers, path),
  post: (headers: Record<string, string>, path: string, body: unknown) =>
    makeRequest("POST", baseUrl, headers, path, body),
  put: (headers: Record<string, string>, path: string, body: unknown) =>
    makeRequest("PUT", baseUrl, headers, path, body),
  delete: (headers: Record<string, string>, path: string) =>
    makeRequest("DELETE", baseUrl, headers, path),
});

// Partially applied: Fix method, baseUrl, and headers
const createAuthenticatedClient = (baseUrl: string, token: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  return {
    get: (path: string) => makeRequest("GET", baseUrl, headers, path),
    post: (path: string, body: unknown) => makeRequest("POST", baseUrl, headers, path, body),
    put: (path: string, body: unknown) => makeRequest("PUT", baseUrl, headers, path, body),
    delete: (path: string) => makeRequest("DELETE", baseUrl, headers, path),
  };
};

// Example 2: Partially Applied Logging Functions
// ==============================================

type LogLevel = "debug" | "info" | "warn" | "error";

// Base log function
const log = (
  prefix: string,
  includeTimestamp: boolean,
  level: LogLevel,
  message: string
): void => {
  let formatted = "";
  if (includeTimestamp) {
    formatted += `[${new Date().toISOString()}] `;
  }
  if (prefix) {
    formatted += `[${prefix}] `;
  }
  formatted += `${level.toUpperCase()}: ${message}`;
  console.log(formatted);
};

// Partially applied: Fix prefix
const createLogger = (prefix: string) => ({
  debug: (message: string) => log(prefix, true, "debug", message),
  info: (message: string) => log(prefix, true, "info", message),
  warn: (message: string) => log(prefix, true, "warn", message),
  error: (message: string) => log(prefix, true, "error", message),
});

// Partially applied: Fix prefix and timestamp
const createSimpleLogger = (prefix: string) => ({
  debug: (message: string) => log(prefix, false, "debug", message),
  info: (message: string) => log(prefix, false, "info", message),
  warn: (message: string) => log(prefix, false, "warn", message),
  error: (message: string) => log(prefix, false, "error", message),
});

// Pre-configured loggers
const appLogger = createLogger("APP");
const securityLogger = createLogger("SECURITY");
const perfLogger = createLogger("PERF");

// Example 3: Partially Applied Validators
// =======================================

type ValidationResult = Readonly<{
  isValid: boolean;
  errors: string[];
}>;

// Base validation functions
const validateString = (
  minLength: number,
  maxLength: number,
  pattern: RegExp | null,
  patternMessage: string,
  value: string
): ValidationResult => {
  const errors: string[] = [];

  if (value.length < minLength) {
    errors.push(`Must be at least ${minLength} characters`);
  }
  if (value.length > maxLength) {
    errors.push(`Must be at most ${maxLength} characters`);
  }
  if (pattern && !pattern.test(value)) {
    errors.push(patternMessage);
  }

  return { isValid: errors.length === 0, errors };
};

const validateNumber = (
  min: number,
  max: number,
  mustBeInteger: boolean,
  value: number
): ValidationResult => {
  const errors: string[] = [];

  if (value < min) {
    errors.push(`Must be at least ${min}`);
  }
  if (value > max) {
    errors.push(`Must be at most ${max}`);
  }
  if (mustBeInteger && !Number.isInteger(value)) {
    errors.push("Must be an integer");
  }

  return { isValid: errors.length === 0, errors };
};

// Partially applied validators
const validateEmail = (value: string) =>
  validateString(5, 254, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format", value);

const validatePassword = (value: string) =>
  validateString(8, 100, null, "", value);

const validateUsername = (value: string) =>
  validateString(
    3,
    20,
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores",
    value
  );

const validatePhone = (value: string) =>
  validateString(10, 15, /^\+?[0-9]+$/, "Invalid phone number format", value);

const validateAge = (value: number) => validateNumber(0, 150, true, value);

const validatePercentage = (value: number) => validateNumber(0, 100, false, value);

const validatePositiveInteger = (value: number) => validateNumber(1, Infinity, true, value);

const validatePrice = (value: number) => validateNumber(0, Infinity, false, value);

// Higher-order validator creator
const createStringValidator =
  (minLength: number, maxLength: number, pattern: RegExp | null, patternMessage: string) =>
  (value: string): ValidationResult =>
    validateString(minLength, maxLength, pattern, patternMessage, value);

const createNumberValidator =
  (min: number, max: number, mustBeInteger: boolean) =>
  (value: number): ValidationResult =>
    validateNumber(min, max, mustBeInteger, value);

// Example 4: Partially Applied Formatters
// =======================================

// Base format functions
const formatCurrency = (
  locale: string,
  currency: string,
  amount: number
): string =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

const formatDateFn = (
  locale: string,
  style: "short" | "medium" | "long" | "full",
  date: Date
): string =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: style,
  }).format(date);

const formatNumber = (locale: string, num: number): string =>
  new Intl.NumberFormat(locale).format(num);

const formatPercent = (locale: string, decimals: number, num: number): string =>
  new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);

// Partially applied formatters
const formatUSD = (amount: number) => formatCurrency("en-US", "USD", amount);
const formatGBP = (amount: number) => formatCurrency("en-GB", "GBP", amount);
const formatEUR = (amount: number) => formatCurrency("de-DE", "EUR", amount);
const formatJPY = (amount: number) => formatCurrency("ja-JP", "JPY", amount);

const formatUSDate = (date: Date) => formatDateFn("en-US", "medium", date);
const formatUKDate = (date: Date) => formatDateFn("en-GB", "medium", date);
const formatISODate = (date: Date) => date.toISOString().split("T")[0];

const formatUSNumber = (num: number) => formatNumber("en-US", num);
const formatEUNumber = (num: number) => formatNumber("de-DE", num);

const formatUSPercent = (num: number) => formatPercent("en-US", 1, num);

// Create formatter sets for different locales
const createFormatter = (locale: string, currency: string) => ({
  currency: (amount: number) => formatCurrency(locale, currency, amount),
  date: (date: Date) => formatDateFn(locale, "medium", date),
  number: (num: number) => formatNumber(locale, num),
  percent: (num: number) => formatPercent(locale, 1, num),
});

const usFormatter = createFormatter("en-US", "USD");
const ukFormatter = createFormatter("en-GB", "GBP");
const euFormatter = createFormatter("de-DE", "EUR");

// Example 5: Partially Applied Array Operations
// =============================================

// Base array functions
const mapWith = <A, B>(fn: (item: A) => B, arr: readonly A[]): B[] => arr.map(fn);

const filterWith = <A>(predicate: (item: A) => boolean, arr: readonly A[]): A[] =>
  arr.filter(predicate);

const reduceWith = <A, B>(
  reducer: (acc: B, item: A) => B,
  initial: B,
  arr: readonly A[]
): B => arr.reduce(reducer, initial);

const sortWith = <A>(comparator: (a: A, b: A) => number, arr: readonly A[]): A[] =>
  [...arr].sort(comparator);

// Partially applied array functions
const mapDouble = (arr: readonly number[]) => mapWith((x: number) => x * 2, arr);
const mapSquare = (arr: readonly number[]) => mapWith((x: number) => x * x, arr);
const mapToString = (arr: readonly number[]) => mapWith((x: number) => String(x), arr);

const filterEven = (arr: readonly number[]) => filterWith((x: number) => x % 2 === 0, arr);
const filterOdd = (arr: readonly number[]) => filterWith((x: number) => x % 2 !== 0, arr);
const filterPositive = (arr: readonly number[]) => filterWith((x: number) => x > 0, arr);

const sum = (arr: readonly number[]) => reduceWith((acc: number, x: number) => acc + x, 0, arr);
const product = (arr: readonly number[]) =>
  reduceWith((acc: number, x: number) => acc * x, 1, arr);
const concatenate = (arr: readonly string[]) =>
  reduceWith((acc: string, x: string) => acc + x, "", arr);

const sortAscending = (arr: readonly number[]) => sortWith((a: number, b: number) => a - b, arr);
const sortDescending = (arr: readonly number[]) => sortWith((a: number, b: number) => b - a, arr);

// Higher-order array function creators
const createMapper =
  <A, B>(fn: (item: A) => B) =>
  (arr: readonly A[]): B[] =>
    mapWith(fn, arr);

const createFilter =
  <A>(predicate: (item: A) => boolean) =>
  (arr: readonly A[]): A[] =>
    filterWith(predicate, arr);

const createReducer =
  <A, B>(reducer: (acc: B, item: A) => B, initial: B) =>
  (arr: readonly A[]): B =>
    reduceWith(reducer, initial, arr);

// Example 6: Partially Applied Query Builders
// ===========================================

type QueryConfig = Readonly<{
  table: string;
  defaultLimit: number;
  softDelete: boolean;
  orderBy: string;
  orderDirection: "ASC" | "DESC";
}>;

// Base query builder function
const buildQuery = (
  config: QueryConfig,
  fields: string[],
  conditions: string[],
  limit: number | null
): string => {
  const selectedFields = fields.length > 0 ? fields.join(", ") : "*";
  let query = `SELECT ${selectedFields} FROM ${config.table}`;

  const allConditions = [...conditions];
  if (config.softDelete) {
    allConditions.push("deleted_at IS NULL");
  }

  if (allConditions.length > 0) {
    query += ` WHERE ${allConditions.join(" AND ")}`;
  }

  query += ` ORDER BY ${config.orderBy} ${config.orderDirection}`;
  query += ` LIMIT ${limit ?? config.defaultLimit}`;

  return query;
};

// Pre-configured query builders
const usersConfig: QueryConfig = {
  table: "users",
  defaultLimit: 50,
  softDelete: true,
  orderBy: "created_at",
  orderDirection: "DESC",
};

const ordersConfig: QueryConfig = {
  table: "orders",
  defaultLimit: 100,
  softDelete: false,
  orderBy: "order_date",
  orderDirection: "DESC",
};

const productsConfig: QueryConfig = {
  table: "products",
  defaultLimit: 50,
  softDelete: true,
  orderBy: "name",
  orderDirection: "ASC",
};

// Partially applied query builders
const buildUserQuery = (fields: string[], conditions: string[], limit: number | null) =>
  buildQuery(usersConfig, fields, conditions, limit);

const buildOrderQuery = (fields: string[], conditions: string[], limit: number | null) =>
  buildQuery(ordersConfig, fields, conditions, limit);

const buildProductQuery = (fields: string[], conditions: string[], limit: number | null) =>
  buildQuery(productsConfig, fields, conditions, limit);

// Create query builder for any config
const createQueryBuilder = (config: QueryConfig) => ({
  all: () => buildQuery(config, [], [], null),
  select: (...fields: string[]) => ({
    where: (...conditions: string[]) => ({
      limit: (n: number) => buildQuery(config, fields, conditions, n),
      build: () => buildQuery(config, fields, conditions, null),
    }),
    limit: (n: number) => buildQuery(config, fields, [], n),
    build: () => buildQuery(config, fields, [], null),
  }),
  where: (...conditions: string[]) => ({
    limit: (n: number) => buildQuery(config, [], conditions, n),
    build: () => buildQuery(config, [], conditions, null),
  }),
});

const userQueries = createQueryBuilder(usersConfig);
const orderQueries = createQueryBuilder(ordersConfig);
const productQueries = createQueryBuilder(productsConfig);

// Example 7: Partially Applied Event Handlers
// ===========================================

type EventOptions = Readonly<{
  preventDefault: boolean;
  stopPropagation: boolean;
  debounceMs: number;
}>;

// Base event handler
const createEventHandler = (
  options: EventOptions,
  handler: (event: Event) => void
): ((event: Event) => void) => {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  return (event: Event) => {
    if (options.preventDefault) {
      event.preventDefault();
    }
    if (options.stopPropagation) {
      event.stopPropagation();
    }

    if (options.debounceMs > 0) {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => handler(event), options.debounceMs);
    } else {
      handler(event);
    }
  };
};

// Partially applied event handler creators
const createClickHandler = (handler: (event: Event) => void) =>
  createEventHandler({ preventDefault: true, stopPropagation: true, debounceMs: 0 }, handler);

const createSubmitHandler = (handler: (event: Event) => void) =>
  createEventHandler({ preventDefault: true, stopPropagation: false, debounceMs: 0 }, handler);

const createInputHandler = (handler: (event: Event) => void, debounceMs: number = 300) =>
  createEventHandler({ preventDefault: false, stopPropagation: false, debounceMs }, handler);

const createScrollHandler = (handler: (event: Event) => void) =>
  createEventHandler({ preventDefault: false, stopPropagation: false, debounceMs: 100 }, handler);

// Demonstration
// =============

function demonstratePartialApplication(): void {
  console.log("=== FP Partial Application Demonstration ===\n");

  // HTTP Clients
  console.log("1. Partially Applied HTTP Functions:");
  const apiClient = createAuthenticatedClient("https://api.example.com", "my-token");
  console.log("GET /users:", apiClient.get("/users"));
  console.log("POST /users:", apiClient.post("/users", { name: "John" }));

  // Loggers
  console.log("\n2. Partially Applied Loggers:");
  appLogger.info("Application started");
  securityLogger.warn("Suspicious activity detected");
  perfLogger.debug("Request took 150ms");

  // Validators
  console.log("\n3. Partially Applied Validators:");
  console.log(`validateEmail("test@example.com"):`, validateEmail("test@example.com"));
  console.log(`validateEmail("invalid"):`, validateEmail("invalid"));
  console.log(`validateAge(25):`, validateAge(25));
  console.log(`validateAge(-5):`, validateAge(-5));
  console.log(`validatePercentage(50):`, validatePercentage(50));
  console.log(`validatePercentage(150):`, validatePercentage(150));

  // Formatters
  console.log("\n4. Partially Applied Formatters:");
  const amount = 1234.56;
  const date = new Date();

  console.log(`formatUSD(${amount}): ${formatUSD(amount)}`);
  console.log(`formatGBP(${amount}): ${formatGBP(amount)}`);
  console.log(`formatEUR(${amount}): ${formatEUR(amount)}`);
  console.log(`formatUSDate: ${formatUSDate(date)}`);
  console.log(`formatUKDate: ${formatUKDate(date)}`);

  console.log("\nUsing formatter objects:");
  console.log(`US: ${usFormatter.currency(amount)}, ${usFormatter.date(date)}`);
  console.log(`UK: ${ukFormatter.currency(amount)}, ${ukFormatter.date(date)}`);
  console.log(`EU: ${euFormatter.currency(amount)}, ${euFormatter.date(date)}`);

  // Array Operations
  console.log("\n5. Partially Applied Array Operations:");
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  console.log(`Original: [${numbers}]`);
  console.log(`mapDouble: [${mapDouble(numbers)}]`);
  console.log(`filterEven: [${filterEven(numbers)}]`);
  console.log(`sum: ${sum(numbers)}`);
  console.log(`sortDescending: [${sortDescending(numbers)}]`);

  // Query Builders
  console.log("\n6. Partially Applied Query Builders:");
  console.log("All users:", userQueries.all());
  console.log(
    "Active users:",
    userQueries.select("id", "name", "email").where("status = 'active'").limit(10)
  );
  console.log("Recent orders:", orderQueries.where("total > 100").build());
  console.log("Products in stock:", productQueries.select("id", "name", "price").where("in_stock = true").build());

  // Custom validators using creators
  console.log("\n7. Custom Validators using Creators:");
  const validateZipCode = createStringValidator(5, 10, /^\d+$/, "Invalid zip code");
  console.log(`validateZipCode("12345"):`, validateZipCode("12345"));
  console.log(`validateZipCode("abc"):`, validateZipCode("abc"));

  const validateRating = createNumberValidator(1, 5, true);
  console.log(`validateRating(3):`, validateRating(3));
  console.log(`validateRating(6):`, validateRating(6));
}

demonstratePartialApplication();

export {
  // Utilities
  partial2First,
  partial2Second,
  partial3First,
  partial3FirstTwo,
  partial,
  // HTTP
  makeRequest,
  get,
  post,
  createApiClient,
  createAuthenticatedClient,
  // Logging
  log,
  createLogger,
  createSimpleLogger,
  appLogger,
  securityLogger,
  perfLogger,
  // Validation
  validateString,
  validateNumber,
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhone,
  validateAge,
  validatePercentage,
  validatePositiveInteger,
  validatePrice,
  createStringValidator,
  createNumberValidator,
  // Formatting
  formatCurrency,
  formatDateFn,
  formatNumber,
  formatPercent,
  formatUSD,
  formatGBP,
  formatEUR,
  formatJPY,
  formatUSDate,
  formatUKDate,
  formatISODate,
  formatUSNumber,
  formatEUNumber,
  formatUSPercent,
  createFormatter,
  usFormatter,
  ukFormatter,
  euFormatter,
  // Array operations
  mapWith,
  filterWith,
  reduceWith,
  sortWith,
  mapDouble,
  mapSquare,
  mapToString,
  filterEven,
  filterOdd,
  filterPositive,
  sum,
  product,
  concatenate,
  sortAscending,
  sortDescending,
  createMapper,
  createFilter,
  createReducer,
  // Query builders
  buildQuery,
  buildUserQuery,
  buildOrderQuery,
  buildProductQuery,
  createQueryBuilder,
  userQueries,
  orderQueries,
  productQueries,
  // Event handlers
  createEventHandler,
  createClickHandler,
  createSubmitHandler,
  createInputHandler,
  createScrollHandler,
};

export type { HttpMethod, RequestConfig, LogLevel, ValidationResult, QueryConfig, EventOptions };


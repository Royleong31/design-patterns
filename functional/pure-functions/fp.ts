/**
 * PURE FUNCTIONS - Functional Programming Approach
 *
 * A pure function has two key properties:
 * 1. Deterministic: Given the same inputs, it always returns the same output
 * 2. No side effects: It doesn't modify any external state
 *
 * Benefits of pure functions:
 * - Easy to test (no mocking required)
 * - Easy to reason about (behavior is predictable)
 * - Safe to parallelize (no shared mutable state)
 * - Easy to cache/memoize (same input = same output)
 * - Composable (can be combined freely)
 */

// Type definitions
type CartItem = Readonly<{
  name: string;
  price: number;
  quantity: number;
}>;

type Cart = Readonly<{
  items: ReadonlyArray<CartItem>;
  discountPercent: number;
}>;

type User = Readonly<{
  id: string;
  name: string;
  email: string;
}>;

type UserDatabase = ReadonlyMap<string, User>;

// Example 1: Pure Shopping Cart Functions
// =======================================

// Pure: Creates a new empty cart
const createCart = (): Cart => ({
  items: [],
  discountPercent: 0,
});

// Pure: Returns a new cart with the item added (doesn't modify original)
const addItem = (cart: Cart, name: string, price: number, quantity: number): Cart => {
  const existingIndex = cart.items.findIndex((item) => item.name === name);

  if (existingIndex !== -1) {
    // Return new cart with updated item quantity
    return {
      ...cart,
      items: cart.items.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ),
    };
  }

  // Return new cart with new item added
  return {
    ...cart,
    items: [...cart.items, { name, price, quantity }],
  };
};

// Pure: Returns a new cart with the item removed
const removeItem = (cart: Cart, name: string): Cart => ({
  ...cart,
  items: cart.items.filter((item) => item.name !== name),
});

// Pure: Returns a new cart with discount applied
const applyDiscount = (cart: Cart, percent: number): Cart => ({
  ...cart,
  discountPercent: percent,
});

// Pure: Calculates total - same cart always gives same result
const calculateTotal = (cart: Cart): number => {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return subtotal * (1 - cart.discountPercent / 100);
};

// Pure: Returns a new empty cart
const clearCart = (): Cart => createCart();

// Example 2: Pure User Database Functions
// =======================================

// Pure: Creates a new empty database
const createDatabase = (): UserDatabase => new Map();

// Pure: Returns a new database with the user added
const addUser = (
  db: UserDatabase,
  id: string,
  name: string,
  email: string
): UserDatabase => {
  const newDb = new Map(db);
  newDb.set(id, { id, name, email });
  return newDb;
};

// Pure: Returns the user or undefined (no side effects)
const getUser = (db: UserDatabase, id: string): User | undefined => {
  return db.get(id);
};

// Pure: Returns a new database with updated user email
const updateUserEmail = (
  db: UserDatabase,
  id: string,
  newEmail: string
): UserDatabase => {
  const user = db.get(id);
  if (!user) return db;

  const newDb = new Map(db);
  newDb.set(id, { ...user, email: newEmail });
  return newDb;
};

// Pure: Returns a new database without the user
const deleteUser = (db: UserDatabase, id: string): UserDatabase => {
  const newDb = new Map(db);
  newDb.delete(id);
  return newDb;
};

// Example 3: Pure Calculator Functions
// ====================================

type CalculatorState = Readonly<{
  result: number;
  history: ReadonlyArray<string>;
}>;

// Pure: Creates initial calculator state
const createCalculator = (): CalculatorState => ({
  result: 0,
  history: [],
});

// Pure: Returns new state with addition applied
const add = (state: CalculatorState, value: number): CalculatorState => {
  const newResult = state.result + value;
  return {
    result: newResult,
    history: [...state.history, `Added ${value}, result: ${newResult}`],
  };
};

// Pure: Returns new state with multiplication applied
const multiply = (state: CalculatorState, value: number): CalculatorState => {
  const newResult = state.result * value;
  return {
    result: newResult,
    history: [...state.history, `Multiplied by ${value}, result: ${newResult}`],
  };
};

// Pure: Returns the result (always same for same state)
const getResult = (state: CalculatorState): number => state.result;

// Pure: Returns history as formatted string
const formatHistory = (state: CalculatorState): string => {
  return ["Calculation History:", ...state.history.map((entry) => `  ${entry}`)].join(
    "\n"
  );
};

// Pure: Returns fresh calculator state
const resetCalculator = (): CalculatorState => createCalculator();

// Example 4: Pure Date Formatting Functions
// =========================================

type FormatOptions = Readonly<{
  locale: string;
  timezone: string;
}>;

// Pure: Default options
const defaultFormatOptions: FormatOptions = {
  locale: "en-US",
  timezone: "UTC",
};

// Pure: Creates format options
const createFormatOptions = (
  locale: string = "en-US",
  timezone: string = "UTC"
): FormatOptions => ({
  locale,
  timezone,
});

// Pure: Formats a date with given options - same inputs = same output
const formatDate = (date: Date, options: FormatOptions): string => {
  return date.toLocaleString(options.locale, { timeZone: options.timezone });
};

// Pure: Returns new options with updated locale
const withLocale = (options: FormatOptions, locale: string): FormatOptions => ({
  ...options,
  locale,
});

// Pure: Returns new options with updated timezone
const withTimezone = (
  options: FormatOptions,
  timezone: string
): FormatOptions => ({
  ...options,
  timezone,
});

// Example 5: Simple Pure Functions
// ================================

// Pure: Always returns same output for same input
const double = (x: number): number => x * 2;

// Pure: No side effects, deterministic
const greet = (name: string): string => `Hello, ${name}!`;

// Pure: Works with arrays without mutation
const sumArray = (numbers: readonly number[]): number =>
  numbers.reduce((acc, n) => acc + n, 0);

// Pure: Filters without modifying original
const filterPositive = (numbers: readonly number[]): number[] =>
  numbers.filter((n) => n > 0);

// Pure: Transforms without modifying original
const toUpperCase = (strings: readonly string[]): string[] =>
  strings.map((s) => s.toUpperCase());

// Demonstration
// =============

function demonstratePureFunctions(): void {
  console.log("=== Pure Functions Demonstration ===\n");

  // Shopping Cart - All operations return new carts
  console.log("1. Pure Shopping Cart:");
  const cart1 = createCart();
  const cart2 = addItem(cart1, "Apple", 1.5, 3);
  const cart3 = addItem(cart2, "Banana", 0.75, 5);

  console.log(`Cart 1 total: $${calculateTotal(cart1).toFixed(2)}`); // $0.00
  console.log(`Cart 2 total: $${calculateTotal(cart2).toFixed(2)}`); // $4.50
  console.log(`Cart 3 total: $${calculateTotal(cart3).toFixed(2)}`); // $8.25

  const cart4 = applyDiscount(cart3, 10);
  console.log(`Cart 4 (with discount): $${calculateTotal(cart4).toFixed(2)}`); // $7.43
  // Original cart3 is unchanged!
  console.log(`Cart 3 still: $${calculateTotal(cart3).toFixed(2)}`); // $8.25

  const cart5 = addItem(cart4, "Apple", 1.5, 2);
  console.log(`Cart 5 (more apples): $${calculateTotal(cart5).toFixed(2)}`);

  console.log("\n2. Pure Calculator:");
  const calc1 = createCalculator();
  const calc2 = add(calc1, 5);
  const calc3 = add(calc2, 3);
  const calc4 = multiply(calc3, 2);

  console.log(`calc1 result: ${getResult(calc1)}`); // 0
  console.log(`calc2 result: ${getResult(calc2)}`); // 5
  console.log(`calc3 result: ${getResult(calc3)}`); // 8
  console.log(`calc4 result: ${getResult(calc4)}`); // 16
  console.log(formatHistory(calc4));

  console.log("\n3. Pure User Database:");
  let db = createDatabase();
  db = addUser(db, "1", "Alice", "alice@example.com");
  console.log(`User found: ${JSON.stringify(getUser(db, "1"))}`);

  const db2 = updateUserEmail(db, "1", "alice.new@example.com");
  console.log(`Original DB user: ${JSON.stringify(getUser(db, "1"))}`);
  console.log(`Updated DB user: ${JSON.stringify(getUser(db2, "1"))}`);

  console.log("\n4. Pure Date Formatting:");
  const testDate = new Date("2024-01-15T10:30:00Z");
  const usOptions = createFormatOptions("en-US", "UTC");
  const deOptions = withLocale(usOptions, "de-DE");

  console.log(`US format: ${formatDate(testDate, usOptions)}`);
  console.log(`German format: ${formatDate(testDate, deOptions)}`);
  // Same function call with same arguments always gives same result!
  console.log(`US format again: ${formatDate(testDate, usOptions)}`);

  console.log("\n5. Simple Pure Functions:");
  console.log(`double(5): ${double(5)}`); // Always 10
  console.log(`double(5): ${double(5)}`); // Still 10!
  console.log(`greet("World"): ${greet("World")}`);
  console.log(`sumArray([1, 2, 3, 4]): ${sumArray([1, 2, 3, 4])}`);
  console.log(`filterPositive([-1, 2, -3, 4]): ${filterPositive([-1, 2, -3, 4])}`);
  console.log(`toUpperCase(["a", "b"]): ${toUpperCase(["a", "b"])}`);
}

demonstratePureFunctions();

export {
  // Cart functions
  createCart,
  addItem,
  removeItem,
  applyDiscount,
  calculateTotal,
  clearCart,
  // Database functions
  createDatabase,
  addUser,
  getUser,
  updateUserEmail,
  deleteUser,
  // Calculator functions
  createCalculator,
  add,
  multiply,
  getResult,
  formatHistory,
  resetCalculator,
  // Date formatting
  createFormatOptions,
  formatDate,
  withLocale,
  withTimezone,
  defaultFormatOptions,
  // Simple functions
  double,
  greet,
  sumArray,
  filterPositive,
  toUpperCase,
};

export type { Cart, CartItem, User, UserDatabase, CalculatorState, FormatOptions };


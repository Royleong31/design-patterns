/**
 * PURE FUNCTIONS - OOP Approach
 *
 * In OOP, methods often have side effects:
 * - They modify instance state (this.property = value)
 * - They modify external state (global variables, databases, files)
 * - They depend on external state that can change
 * - They produce different outputs for the same inputs
 *
 * This makes code harder to test, debug, and reason about because
 * the behavior depends on the current state of the system.
 */

// Example 1: Shopping Cart with Side Effects
// ==========================================

class ShoppingCart {
  private items: Array<{ name: string; price: number; quantity: number }> = [];
  private discount: number = 0;

  // Side effect: Modifies internal state
  addItem(name: string, price: number, quantity: number): void {
    const existingItem = this.items.find((item) => item.name === name);
    if (existingItem) {
      existingItem.quantity += quantity; // Mutates existing object
    } else {
      this.items.push({ name, price, quantity }); // Mutates array
    }
  }

  // Side effect: Modifies internal state
  removeItem(name: string): void {
    const index = this.items.findIndex((item) => item.name === name);
    if (index !== -1) {
      this.items.splice(index, 1); // Mutates array
    }
  }

  // Side effect: Modifies internal state
  applyDiscount(percent: number): void {
    this.discount = percent; // Mutates state
  }

  // Depends on mutable state - same call can return different results
  getTotal(): number {
    const subtotal = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return subtotal * (1 - this.discount / 100);
  }

  // Side effect: Modifies internal state
  clear(): void {
    this.items = [];
    this.discount = 0;
  }
}

// Example 2: User Service with External Side Effects
// ==================================================

// Simulating a global database
const userDatabase: Map<string, { name: string; email: string }> = new Map();

class UserService {
  // Side effect: Modifies external state (database)
  createUser(id: string, name: string, email: string): void {
    userDatabase.set(id, { name, email });
    console.log(`User ${name} created`); // Side effect: I/O
  }

  // Depends on external mutable state
  getUser(id: string): { name: string; email: string } | undefined {
    return userDatabase.get(id);
  }

  // Side effect: Modifies external state
  updateUserEmail(id: string, newEmail: string): boolean {
    const user = userDatabase.get(id);
    if (user) {
      user.email = newEmail; // Mutates object in database
      return true;
    }
    return false;
  }

  // Side effect: Modifies external state
  deleteUser(id: string): boolean {
    return userDatabase.delete(id);
  }
}

// Example 3: Calculator with Hidden State
// =======================================

class Calculator {
  private lastResult: number = 0;
  private history: string[] = [];

  // Impure: depends on and modifies internal state
  add(value: number): number {
    this.lastResult += value;
    this.history.push(`Added ${value}, result: ${this.lastResult}`);
    return this.lastResult;
  }

  // Impure: depends on and modifies internal state
  multiply(value: number): number {
    this.lastResult *= value;
    this.history.push(`Multiplied by ${value}, result: ${this.lastResult}`);
    return this.lastResult;
  }

  // Same input can give different outputs depending on state
  getLastResult(): number {
    return this.lastResult;
  }

  // Side effect: console output
  printHistory(): void {
    console.log("Calculation History:");
    this.history.forEach((entry) => console.log(`  ${entry}`));
  }

  // Modifies internal state
  reset(): void {
    this.lastResult = 0;
    this.history = [];
  }
}

// Example 4: Date Formatter with Locale Side Effects
// ==================================================

class DateFormatter {
  private locale: string = "en-US";
  private timezone: string = "UTC";

  // Side effect: Modifies internal state
  setLocale(locale: string): void {
    this.locale = locale;
  }

  // Side effect: Modifies internal state
  setTimezone(timezone: string): void {
    this.timezone = timezone;
  }

  // Impure: Output depends on mutable internal state
  format(date: Date): string {
    return date.toLocaleString(this.locale, { timeZone: this.timezone });
  }

  // Impure: Depends on current system time
  formatNow(): string {
    return this.format(new Date());
  }
}

// Demonstration
// =============

function demonstrateOOPSideEffects(): void {
  console.log("=== OOP Side Effects Demonstration ===\n");

  // Shopping Cart - State mutations make behavior unpredictable
  console.log("1. Shopping Cart with Side Effects:");
  const cart = new ShoppingCart();
  cart.addItem("Apple", 1.5, 3);
  cart.addItem("Banana", 0.75, 5);
  console.log(`Total: $${cart.getTotal().toFixed(2)}`); // $8.25

  cart.applyDiscount(10);
  console.log(`Total after discount: $${cart.getTotal().toFixed(2)}`); // $7.43
  // Same getTotal() call, different result!

  cart.addItem("Apple", 1.5, 2); // Mutates existing item
  console.log(`Total after adding more apples: $${cart.getTotal().toFixed(2)}`);

  console.log("\n2. Calculator with Hidden State:");
  const calc = new Calculator();
  console.log(`add(5): ${calc.add(5)}`); // 5
  console.log(`add(3): ${calc.add(3)}`); // 8 - depends on previous state!
  console.log(`multiply(2): ${calc.multiply(2)}`); // 16
  calc.printHistory();

  console.log("\n3. User Service with External Side Effects:");
  const userService = new UserService();
  userService.createUser("1", "Alice", "alice@example.com");
  console.log(`User found: ${JSON.stringify(userService.getUser("1"))}`);
  userService.updateUserEmail("1", "alice.new@example.com");
  console.log(
    `User after update: ${JSON.stringify(userService.getUser("1"))}`
  );

  console.log("\n4. Date Formatter with Locale State:");
  const formatter = new DateFormatter();
  const testDate = new Date("2024-01-15T10:30:00Z");
  console.log(`US format: ${formatter.format(testDate)}`);
  formatter.setLocale("de-DE");
  console.log(`German format: ${formatter.format(testDate)}`);
  // Same format() call, different result due to state change!
}

demonstrateOOPSideEffects();

export { ShoppingCart, UserService, Calculator, DateFormatter };


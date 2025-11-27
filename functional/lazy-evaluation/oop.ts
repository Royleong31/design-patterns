/**
 * LAZY EVALUATION - OOP Approach (Eager Computation)
 *
 * In traditional OOP, computation is typically eager:
 * - Values are computed immediately when requested
 * - All elements of a collection are processed at once
 * - Memory is allocated for all results upfront
 *
 * This approach:
 * - Simple and predictable execution order
 * - Can be wasteful if not all results are needed
 * - May cause memory issues with large datasets
 * - Doesn't support infinite sequences
 */

// Example 1: Eager Collection Processing
// ======================================

class EagerCollection<T> {
  private items: T[];

  constructor(items: T[]) {
    this.items = [...items];
  }

  // Eagerly creates new array with all mapped values
  map<R>(fn: (item: T) => R): EagerCollection<R> {
    console.log(`  [Eager] Mapping ${this.items.length} items...`);
    const result = this.items.map((item) => {
      console.log(`    Processing: ${item}`);
      return fn(item);
    });
    return new EagerCollection(result);
  }

  // Eagerly creates new array with filtered values
  filter(predicate: (item: T) => boolean): EagerCollection<T> {
    console.log(`  [Eager] Filtering ${this.items.length} items...`);
    const result = this.items.filter((item) => {
      console.log(`    Checking: ${item}`);
      return predicate(item);
    });
    return new EagerCollection(result);
  }

  // Eagerly processes all items
  reduce<R>(reducer: (acc: R, item: T) => R, initial: R): R {
    console.log(`  [Eager] Reducing ${this.items.length} items...`);
    return this.items.reduce((acc, item) => {
      console.log(`    Reducing: ${item}`);
      return reducer(acc, item);
    }, initial);
  }

  // Get first n items (but all previous operations already ran)
  take(n: number): EagerCollection<T> {
    return new EagerCollection(this.items.slice(0, n));
  }

  // Get first item (but all previous operations already ran)
  first(): T | undefined {
    return this.items[0];
  }

  toArray(): T[] {
    return [...this.items];
  }
}

// Example 2: Eager Range Generation
// =================================

class EagerRange {
  // Creates entire array in memory immediately
  static generate(start: number, end: number): number[] {
    console.log(`[Eager] Generating range ${start} to ${end}...`);
    const result: number[] = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    console.log(`[Eager] Generated ${result.length} numbers`);
    return result;
  }

  // Generates all numbers then filters (wasteful)
  static evenNumbers(start: number, end: number): number[] {
    console.log(`[Eager] Getting even numbers ${start} to ${end}...`);
    const all = this.generate(start, end);
    return all.filter((n) => n % 2 === 0);
  }

  // Generates all numbers then takes first n (wasteful)
  static firstN(start: number, count: number): number[] {
    // We don't know the end, so we guess a large number
    const end = start + count * 10; // Wasteful!
    const all = this.generate(start, end);
    return all.slice(0, count);
  }
}

// Example 3: Eager Data Fetching
// ==============================

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserDetails extends User {
  profile: string;
  preferences: string[];
}

class EagerUserService {
  private users: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
    { id: 3, name: "Charlie", email: "charlie@example.com" },
    { id: 4, name: "Diana", email: "diana@example.com" },
    { id: 5, name: "Eve", email: "eve@example.com" },
  ];

  // Eagerly fetches ALL users with ALL their details
  getAllUsersWithDetails(): UserDetails[] {
    console.log("[Eager] Fetching all users with details...");

    return this.users.map((user) => {
      console.log(`  Fetching details for user ${user.id}...`);
      // Simulated expensive operation
      return {
        ...user,
        profile: `Profile for ${user.name}`,
        preferences: ["pref1", "pref2", "pref3"],
      };
    });
  }

  // Even if we only need one user, we fetch all
  getFirstUserWithDetails(): UserDetails | undefined {
    const allUsers = this.getAllUsersWithDetails();
    return allUsers[0];
  }

  // Fetches all, then filters (wasteful if we only need a few)
  getActiveUsersWithDetails(activeIds: number[]): UserDetails[] {
    const allUsers = this.getAllUsersWithDetails();
    return allUsers.filter((u) => activeIds.includes(u.id));
  }
}

// Example 4: Eager Computation Chain
// ==================================

class EagerProcessor {
  // Each operation creates a new array immediately
  processNumbers(numbers: number[]): number {
    console.log("\n[Eager] Starting number processing...");
    console.log(`Input: [${numbers.slice(0, 5)}${numbers.length > 5 ? "..." : ""}]`);

    // Step 1: Filter - creates new array
    console.log("Step 1: Filtering even numbers...");
    const evens = numbers.filter((n) => {
      return n % 2 === 0;
    });
    console.log(`  Result: ${evens.length} even numbers`);

    // Step 2: Map - creates another new array
    console.log("Step 2: Doubling numbers...");
    const doubled = evens.map((n) => {
      return n * 2;
    });
    console.log(`  Result: ${doubled.length} doubled numbers`);

    // Step 3: Map again - creates another new array
    console.log("Step 3: Adding 1...");
    const plusOne = doubled.map((n) => {
      return n + 1;
    });
    console.log(`  Result: ${plusOne.length} numbers`);

    // Step 4: Take first 5 - but we already processed ALL numbers!
    console.log("Step 4: Taking first 5...");
    const firstFive = plusOne.slice(0, 5);
    console.log(`  Result: [${firstFive}]`);

    // Step 5: Sum
    console.log("Step 5: Summing...");
    const sum = firstFive.reduce((acc, n) => acc + n, 0);
    console.log(`  Result: ${sum}`);

    return sum;
  }
}

// Example 5: Eager File Processing (Simulated)
// ============================================

interface FileRecord {
  id: number;
  data: string;
  size: number;
}

class EagerFileProcessor {
  // Simulates reading entire file into memory
  readAllRecords(recordCount: number): FileRecord[] {
    console.log(`[Eager] Reading all ${recordCount} records into memory...`);

    const records: FileRecord[] = [];
    for (let i = 0; i < recordCount; i++) {
      records.push({
        id: i,
        data: `Data for record ${i}`,
        size: Math.floor(Math.random() * 1000),
      });
    }

    console.log(`[Eager] Loaded ${records.length} records (${this.estimateMemory(records)} bytes)`);
    return records;
  }

  // Process all records even if we only need some
  findLargeRecords(recordCount: number, minSize: number): FileRecord[] {
    const allRecords = this.readAllRecords(recordCount);
    console.log(`[Eager] Filtering for records > ${minSize} bytes...`);
    return allRecords.filter((r) => r.size > minSize);
  }

  // Find first matching record, but loads all first
  findFirstLargeRecord(recordCount: number, minSize: number): FileRecord | undefined {
    const largeRecords = this.findLargeRecords(recordCount, minSize);
    return largeRecords[0];
  }

  private estimateMemory(records: FileRecord[]): number {
    // Rough estimate
    return records.length * 100;
  }
}

// Example 6: Eager Expensive Computations
// =======================================

class EagerCalculator {
  // Computes all values immediately, even if not all are needed
  computeExpensiveValues(inputs: number[]): Map<number, number> {
    console.log(`[Eager] Computing expensive values for ${inputs.length} inputs...`);

    const results = new Map<number, number>();

    for (const input of inputs) {
      console.log(`  Computing for input ${input}...`);
      // Simulated expensive computation
      const result = this.expensiveComputation(input);
      results.set(input, result);
    }

    console.log(`[Eager] All ${results.size} values computed`);
    return results;
  }

  private expensiveComputation(n: number): number {
    // Simulate expensive operation
    let result = 0;
    for (let i = 0; i < 1000; i++) {
      result += Math.sin(n * i);
    }
    return result;
  }

  // Get one value, but computes all
  getValueFor(inputs: number[], target: number): number | undefined {
    const allValues = this.computeExpensiveValues(inputs);
    return allValues.get(target);
  }
}

// Example 7: Eager Pagination
// ===========================

interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

class EagerPaginator<T> {
  private allItems: T[];

  constructor(items: T[]) {
    // Stores all items in memory
    this.allItems = [...items];
  }

  // Even though we only show one page, all items are in memory
  getPage(page: number, pageSize: number): PaginatedResult<T> {
    const startIndex = (page - 1) * pageSize;
    const items = this.allItems.slice(startIndex, startIndex + pageSize);

    return {
      items,
      page,
      pageSize,
      totalPages: Math.ceil(this.allItems.length / pageSize),
      totalItems: this.allItems.length,
    };
  }

  // Process all items to get count
  getFilteredCount(predicate: (item: T) => boolean): number {
    return this.allItems.filter(predicate).length;
  }
}

// Demonstration
// =============

function demonstrateEagerEvaluation(): void {
  console.log("=== OOP Eager Evaluation Demonstration ===\n");

  // Eager Collection
  console.log("1. Eager Collection Processing:");
  console.log("   (Notice: ALL items are processed even though we only take 2)\n");

  const collection = new EagerCollection([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const result = collection
    .filter((n) => n % 2 === 0)
    .map((n) => n * 2)
    .take(2)
    .toArray();

  console.log(`\n   Final result: [${result}]`);

  // Eager Range
  console.log("\n2. Eager Range Generation:");
  console.log("   (Notice: Generates entire range even though we only need first 3)\n");

  const range = EagerRange.generate(1, 100);
  console.log(`   First 3: [${range.slice(0, 3)}]`);

  // Eager User Service
  console.log("\n3. Eager Data Fetching:");
  console.log("   (Notice: Fetches ALL users even though we only need one)\n");

  const userService = new EagerUserService();
  const firstUser = userService.getFirstUserWithDetails();
  console.log(`   First user: ${firstUser?.name}`);

  // Eager Processing Chain
  console.log("\n4. Eager Processing Chain:");
  const processor = new EagerProcessor();
  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
  const sum = processor.processNumbers(numbers);
  console.log(`\n   Final sum: ${sum}`);

  // Eager File Processing
  console.log("\n5. Eager File Processing:");
  console.log("   (Notice: Loads ALL records even though we only need first match)\n");

  const fileProcessor = new EagerFileProcessor();
  const firstLarge = fileProcessor.findFirstLargeRecord(1000, 900);
  console.log(`   First large record: ${firstLarge?.id}`);

  // Eager Expensive Computations
  console.log("\n6. Eager Expensive Computations:");
  console.log("   (Notice: Computes ALL values even though we only need one)\n");

  const calculator = new EagerCalculator();
  const inputs = [1, 2, 3, 4, 5];
  const value = calculator.getValueFor(inputs, 3);
  console.log(`   Value for 3: ${value?.toFixed(4)}`);
}

demonstrateEagerEvaluation();

export {
  EagerCollection,
  EagerRange,
  EagerUserService,
  EagerProcessor,
  EagerFileProcessor,
  EagerCalculator,
  EagerPaginator,
};

export type { User, UserDetails, FileRecord, PaginatedResult };


/**
 * IMMUTABILITY - OOP Approach (Mutable Data)
 *
 * In traditional OOP, objects are typically mutable:
 * - Object properties can be changed after creation
 * - Collections (arrays, maps) are modified in place
 * - Shared references can lead to unexpected mutations
 *
 * Problems with mutable data:
 * - Shared state can be modified unexpectedly
 * - Difficult to track changes through the codebase
 * - Race conditions in concurrent code
 * - Harder to implement undo/redo functionality
 * - Defensive copying is often needed
 */

// Example 1: Mutable Person Class
// ===============================

class Person {
  public name: string;
  public age: number;
  public address: Address;
  public hobbies: string[];

  constructor(name: string, age: number, address: Address, hobbies: string[]) {
    this.name = name;
    this.age = age;
    this.address = address;
    this.hobbies = hobbies;
  }

  // Mutates the object directly
  setName(name: string): void {
    this.name = name;
  }

  // Mutates the object directly
  birthday(): void {
    this.age++;
  }

  // Mutates nested object
  moveToCity(city: string): void {
    this.address.city = city;
  }

  // Mutates array
  addHobby(hobby: string): void {
    this.hobbies.push(hobby);
  }

  // Mutates array
  removeHobby(hobby: string): void {
    const index = this.hobbies.indexOf(hobby);
    if (index !== -1) {
      this.hobbies.splice(index, 1);
    }
  }
}

class Address {
  public street: string;
  public city: string;
  public country: string;

  constructor(street: string, city: string, country: string) {
    this.street = street;
    this.city = city;
    this.country = country;
  }

  // Mutates the object
  update(street: string, city: string): void {
    this.street = street;
    this.city = city;
  }
}

// Example 2: Mutable Bank Account
// ===============================

class BankAccount {
  private balance: number;
  private transactions: Transaction[];

  constructor(initialBalance: number = 0) {
    this.balance = initialBalance;
    this.transactions = [];
  }

  // Mutates internal state
  deposit(amount: number): void {
    this.balance += amount;
    this.transactions.push({
      type: "deposit",
      amount,
      timestamp: new Date(),
      balanceAfter: this.balance,
    });
  }

  // Mutates internal state
  withdraw(amount: number): boolean {
    if (amount > this.balance) {
      return false;
    }
    this.balance -= amount;
    this.transactions.push({
      type: "withdrawal",
      amount,
      timestamp: new Date(),
      balanceAfter: this.balance,
    });
    return true;
  }

  getBalance(): number {
    return this.balance;
  }

  // Returns mutable reference - dangerous!
  getTransactions(): Transaction[] {
    return this.transactions;
  }
}

interface Transaction {
  type: "deposit" | "withdrawal";
  amount: number;
  timestamp: Date;
  balanceAfter: number;
}

// Example 3: Mutable Todo List
// ============================

class TodoList {
  private todos: Todo[];
  private nextId: number;

  constructor() {
    this.todos = [];
    this.nextId = 1;
  }

  // Mutates array
  addTodo(title: string): Todo {
    const todo: Todo = {
      id: this.nextId++,
      title,
      completed: false,
      createdAt: new Date(),
    };
    this.todos.push(todo);
    return todo;
  }

  // Mutates object in array
  toggleTodo(id: number): void {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  // Mutates object in array
  updateTitle(id: number, title: string): void {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.title = title;
    }
  }

  // Mutates array
  removeTodo(id: number): void {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
    }
  }

  // Mutates multiple objects
  markAllComplete(): void {
    this.todos.forEach((todo) => {
      todo.completed = true;
    });
  }

  // Returns mutable reference
  getTodos(): Todo[] {
    return this.todos;
  }
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// Example 4: Mutable Game State
// =============================

class GameState {
  private player: Player;
  private enemies: Enemy[];
  private score: number;
  private level: number;

  constructor(playerName: string) {
    this.player = {
      name: playerName,
      health: 100,
      position: { x: 0, y: 0 },
      inventory: [],
    };
    this.enemies = [];
    this.score = 0;
    this.level = 1;
  }

  // Mutates player position
  movePlayer(dx: number, dy: number): void {
    this.player.position.x += dx;
    this.player.position.y += dy;
  }

  // Mutates player health
  damagePlayer(amount: number): void {
    this.player.health = Math.max(0, this.player.health - amount);
  }

  // Mutates player inventory
  addToInventory(item: string): void {
    this.player.inventory.push(item);
  }

  // Mutates enemies array
  spawnEnemy(name: string, x: number, y: number): void {
    this.enemies.push({
      name,
      health: 50,
      position: { x, y },
    });
  }

  // Mutates enemy in array
  damageEnemy(index: number, amount: number): void {
    if (this.enemies[index]) {
      this.enemies[index].health -= amount;
      if (this.enemies[index].health <= 0) {
        this.enemies.splice(index, 1);
        this.score += 100;
      }
    }
  }

  // Mutates level and resets some state
  nextLevel(): void {
    this.level++;
    this.enemies = [];
    this.player.health = 100;
  }

  getState(): {
    player: Player;
    enemies: Enemy[];
    score: number;
    level: number;
  } {
    return {
      player: this.player,
      enemies: this.enemies,
      score: this.score,
      level: this.level,
    };
  }
}

interface Player {
  name: string;
  health: number;
  position: { x: number; y: number };
  inventory: string[];
}

interface Enemy {
  name: string;
  health: number;
  position: { x: number; y: number };
}

// Demonstration of Problems with Mutability
// =========================================

function demonstrateMutabilityProblems(): void {
  console.log("=== OOP Mutability Problems Demonstration ===\n");

  // Problem 1: Shared reference mutation
  console.log("1. Shared Reference Mutation:");
  const address = new Address("123 Main St", "New York", "USA");
  const person1 = new Person("Alice", 30, address, ["reading"]);
  const person2 = new Person("Bob", 25, address, ["gaming"]); // Sharing same address!

  console.log(`Person1 city: ${person1.address.city}`);
  console.log(`Person2 city: ${person2.address.city}`);

  person1.moveToCity("Los Angeles");
  console.log("After person1.moveToCity('Los Angeles'):");
  console.log(`Person1 city: ${person1.address.city}`); // Los Angeles
  console.log(`Person2 city: ${person2.address.city}`); // Also Los Angeles! Unexpected!

  // Problem 2: External mutation through returned references
  console.log("\n2. External Mutation Through References:");
  const account = new BankAccount(1000);
  account.deposit(500);
  console.log(`Balance: ${account.getBalance()}`); // 1500

  const transactions = account.getTransactions();
  console.log(`Transactions count: ${transactions.length}`); // 1

  // External code can corrupt internal state!
  transactions.push({
    type: "deposit",
    amount: 1000000,
    timestamp: new Date(),
    balanceAfter: 1001500,
  });
  console.log(`Transactions count after external push: ${account.getTransactions().length}`); // 2 - corrupted!

  // Problem 3: Difficulty tracking state changes
  console.log("\n3. State Changes Are Hard to Track:");
  const todoList = new TodoList();
  const todo = todoList.addTodo("Learn FP");
  console.log(`Todo completed: ${todo.completed}`); // false

  todoList.toggleTodo(todo.id);
  // The original todo reference is also mutated!
  console.log(`Original todo reference completed: ${todo.completed}`); // true

  // Problem 4: No history of previous states
  console.log("\n4. No History of Previous States:");
  const game = new GameState("Hero");
  console.log(`Initial health: ${game.getState().player.health}`);

  game.damagePlayer(30);
  console.log(`After damage: ${game.getState().player.health}`);
  // Cannot easily go back to previous state!

  game.damagePlayer(50);
  console.log(`After more damage: ${game.getState().player.health}`);
  // Previous states are lost forever
}

demonstrateMutabilityProblems();

export { Person, Address, BankAccount, TodoList, GameState };
export type { Transaction, Todo, Player, Enemy };


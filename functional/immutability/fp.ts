/**
 * IMMUTABILITY - Functional Programming Approach
 *
 * In FP, data is immutable by default:
 * - Once created, data cannot be changed
 * - "Changes" create new data structures
 * - Original data is preserved
 *
 * Benefits of immutability:
 * - No unexpected mutations from shared references
 * - Easy to track changes (compare old vs new)
 * - Safe for concurrent/parallel processing
 * - Natural support for undo/redo (keep history of states)
 * - Easier debugging (data doesn't change unexpectedly)
 */

// Example 1: Immutable Person
// ===========================

type Address = Readonly<{
  street: string;
  city: string;
  country: string;
}>;

type Person = Readonly<{
  name: string;
  age: number;
  address: Address;
  hobbies: ReadonlyArray<string>;
}>;

// Pure function: Creates a new person
const createPerson = (
  name: string,
  age: number,
  address: Address,
  hobbies: string[]
): Person => ({
  name,
  age,
  address,
  hobbies: [...hobbies], // Defensive copy
});

// Pure function: Creates a new address
const createAddress = (
  street: string,
  city: string,
  country: string
): Address => ({
  street,
  city,
  country,
});

// Pure function: Returns new person with updated name
const setName = (person: Person, name: string): Person => ({
  ...person,
  name,
});

// Pure function: Returns new person with incremented age
const birthday = (person: Person): Person => ({
  ...person,
  age: person.age + 1,
});

// Pure function: Returns new person with updated city
const moveToCity = (person: Person, city: string): Person => ({
  ...person,
  address: {
    ...person.address,
    city,
  },
});

// Pure function: Returns new person with added hobby
const addHobby = (person: Person, hobby: string): Person => ({
  ...person,
  hobbies: [...person.hobbies, hobby],
});

// Pure function: Returns new person with hobby removed
const removeHobby = (person: Person, hobby: string): Person => ({
  ...person,
  hobbies: person.hobbies.filter((h) => h !== hobby),
});

// Pure function: Updates address
const updateAddress = (
  address: Address,
  street: string,
  city: string
): Address => ({
  ...address,
  street,
  city,
});

// Example 2: Immutable Bank Account
// =================================

type Transaction = Readonly<{
  type: "deposit" | "withdrawal";
  amount: number;
  timestamp: Date;
  balanceAfter: number;
}>;

type BankAccount = Readonly<{
  balance: number;
  transactions: ReadonlyArray<Transaction>;
}>;

// Pure function: Creates a new account
const createAccount = (initialBalance: number = 0): BankAccount => ({
  balance: initialBalance,
  transactions: [],
});

// Pure function: Returns new account with deposit
const deposit = (account: BankAccount, amount: number): BankAccount => {
  const newBalance = account.balance + amount;
  return {
    balance: newBalance,
    transactions: [
      ...account.transactions,
      {
        type: "deposit",
        amount,
        timestamp: new Date(),
        balanceAfter: newBalance,
      },
    ],
  };
};

// Pure function: Returns new account with withdrawal (or original if insufficient funds)
const withdraw = (
  account: BankAccount,
  amount: number
): { account: BankAccount; success: boolean } => {
  if (amount > account.balance) {
    return { account, success: false };
  }

  const newBalance = account.balance - amount;
  return {
    account: {
      balance: newBalance,
      transactions: [
        ...account.transactions,
        {
          type: "withdrawal",
          amount,
          timestamp: new Date(),
          balanceAfter: newBalance,
        },
      ],
    },
    success: true,
  };
};

// Pure function: Returns balance
const getBalance = (account: BankAccount): number => account.balance;

// Pure function: Returns copy of transactions (already immutable)
const getTransactions = (
  account: BankAccount
): ReadonlyArray<Transaction> => account.transactions;

// Example 3: Immutable Todo List
// ==============================

type Todo = Readonly<{
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}>;

type TodoList = Readonly<{
  todos: ReadonlyArray<Todo>;
  nextId: number;
}>;

// Pure function: Creates empty todo list
const createTodoList = (): TodoList => ({
  todos: [],
  nextId: 1,
});

// Pure function: Returns new list with added todo
const addTodo = (
  list: TodoList,
  title: string
): { list: TodoList; todo: Todo } => {
  const todo: Todo = {
    id: list.nextId,
    title,
    completed: false,
    createdAt: new Date(),
  };

  return {
    list: {
      todos: [...list.todos, todo],
      nextId: list.nextId + 1,
    },
    todo,
  };
};

// Pure function: Returns new list with toggled todo
const toggleTodo = (list: TodoList, id: number): TodoList => ({
  ...list,
  todos: list.todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ),
});

// Pure function: Returns new list with updated title
const updateTodoTitle = (
  list: TodoList,
  id: number,
  title: string
): TodoList => ({
  ...list,
  todos: list.todos.map((todo) =>
    todo.id === id ? { ...todo, title } : todo
  ),
});

// Pure function: Returns new list without the todo
const removeTodo = (list: TodoList, id: number): TodoList => ({
  ...list,
  todos: list.todos.filter((todo) => todo.id !== id),
});

// Pure function: Returns new list with all todos completed
const markAllComplete = (list: TodoList): TodoList => ({
  ...list,
  todos: list.todos.map((todo) => ({ ...todo, completed: true })),
});

// Pure function: Returns todos (already immutable)
const getTodos = (list: TodoList): ReadonlyArray<Todo> => list.todos;

// Example 4: Immutable Game State
// ===============================

type Position = Readonly<{
  x: number;
  y: number;
}>;

type Player = Readonly<{
  name: string;
  health: number;
  position: Position;
  inventory: ReadonlyArray<string>;
}>;

type Enemy = Readonly<{
  name: string;
  health: number;
  position: Position;
}>;

type GameState = Readonly<{
  player: Player;
  enemies: ReadonlyArray<Enemy>;
  score: number;
  level: number;
}>;

// Pure function: Creates initial game state
const createGameState = (playerName: string): GameState => ({
  player: {
    name: playerName,
    health: 100,
    position: { x: 0, y: 0 },
    inventory: [],
  },
  enemies: [],
  score: 0,
  level: 1,
});

// Pure function: Returns new state with moved player
const movePlayer = (state: GameState, dx: number, dy: number): GameState => ({
  ...state,
  player: {
    ...state.player,
    position: {
      x: state.player.position.x + dx,
      y: state.player.position.y + dy,
    },
  },
});

// Pure function: Returns new state with damaged player
const damagePlayer = (state: GameState, amount: number): GameState => ({
  ...state,
  player: {
    ...state.player,
    health: Math.max(0, state.player.health - amount),
  },
});

// Pure function: Returns new state with item added to inventory
const addToInventory = (state: GameState, item: string): GameState => ({
  ...state,
  player: {
    ...state.player,
    inventory: [...state.player.inventory, item],
  },
});

// Pure function: Returns new state with spawned enemy
const spawnEnemy = (
  state: GameState,
  name: string,
  x: number,
  y: number
): GameState => ({
  ...state,
  enemies: [
    ...state.enemies,
    {
      name,
      health: 50,
      position: { x, y },
    },
  ],
});

// Pure function: Returns new state with damaged/removed enemy
const damageEnemy = (
  state: GameState,
  index: number,
  amount: number
): GameState => {
  const enemy = state.enemies[index];
  if (!enemy) return state;

  const newHealth = enemy.health - amount;

  if (newHealth <= 0) {
    // Enemy defeated - remove and add score
    return {
      ...state,
      enemies: state.enemies.filter((_, i) => i !== index),
      score: state.score + 100,
    };
  }

  // Enemy damaged but alive
  return {
    ...state,
    enemies: state.enemies.map((e, i) =>
      i === index ? { ...e, health: newHealth } : e
    ),
  };
};

// Pure function: Returns new state for next level
const nextLevel = (state: GameState): GameState => ({
  ...state,
  level: state.level + 1,
  enemies: [],
  player: {
    ...state.player,
    health: 100,
  },
});

// Demonstration of Immutability Benefits
// ======================================

function demonstrateImmutabilityBenefits(): void {
  console.log("=== FP Immutability Benefits Demonstration ===\n");

  // Benefit 1: No shared reference problems
  console.log("1. No Shared Reference Problems:");
  const address = createAddress("123 Main St", "New York", "USA");
  const person1 = createPerson("Alice", 30, address, ["reading"]);
  const person2 = createPerson("Bob", 25, address, ["gaming"]);

  console.log(`Person1 city: ${person1.address.city}`);
  console.log(`Person2 city: ${person2.address.city}`);

  const person1Moved = moveToCity(person1, "Los Angeles");
  console.log("After moveToCity(person1, 'Los Angeles'):");
  console.log(`Person1 (original) city: ${person1.address.city}`); // Still New York!
  console.log(`Person1 (moved) city: ${person1Moved.address.city}`); // Los Angeles
  console.log(`Person2 city: ${person2.address.city}`); // Still New York!

  // Benefit 2: Safe from external mutation
  console.log("\n2. Safe From External Mutation:");
  let account = createAccount(1000);
  account = deposit(account, 500);
  console.log(`Balance: ${getBalance(account)}`); // 1500

  const transactions = getTransactions(account);
  console.log(`Transactions count: ${transactions.length}`); // 1

  // Cannot mutate! TypeScript will prevent this:
  // transactions.push(...) // Error: Property 'push' does not exist on type 'readonly Transaction[]'
  console.log("Cannot push to readonly array - TypeScript prevents it!");
  console.log(`Transactions count still: ${getTransactions(account).length}`); // Still 1

  // Benefit 3: Easy to track changes
  console.log("\n3. Easy to Track Changes:");
  let todoList = createTodoList();
  const result = addTodo(todoList, "Learn FP");
  todoList = result.list;
  const originalTodo = result.todo;

  console.log(`Original todo completed: ${originalTodo.completed}`); // false

  todoList = toggleTodo(todoList, originalTodo.id);
  console.log(`Original todo still: ${originalTodo.completed}`); // Still false!
  console.log(`Updated todo: ${getTodos(todoList)[0].completed}`); // true

  // Benefit 4: Natural undo/redo support
  console.log("\n4. Natural Undo/Redo Support:");
  const stateHistory: GameState[] = [];

  let gameState = createGameState("Hero");
  stateHistory.push(gameState);
  console.log(`State 0 - Health: ${gameState.player.health}`);

  gameState = damagePlayer(gameState, 30);
  stateHistory.push(gameState);
  console.log(`State 1 - Health: ${gameState.player.health}`);

  gameState = damagePlayer(gameState, 50);
  stateHistory.push(gameState);
  console.log(`State 2 - Health: ${gameState.player.health}`);

  // Undo! Just go back to previous state
  console.log("\nUndo to State 1:");
  gameState = stateHistory[1];
  console.log(`Health after undo: ${gameState.player.health}`);

  console.log("\nUndo to State 0:");
  gameState = stateHistory[0];
  console.log(`Health after second undo: ${gameState.player.health}`);

  // Benefit 5: Predictable debugging
  console.log("\n5. Predictable Debugging:");
  const p = createPerson("Test", 25, createAddress("St", "City", "Country"), []);
  const p1 = addHobby(p, "reading");
  const p2 = addHobby(p1, "gaming");
  const p3 = removeHobby(p2, "reading");

  console.log(`Original hobbies: [${p.hobbies.join(", ")}]`);
  console.log(`After add reading: [${p1.hobbies.join(", ")}]`);
  console.log(`After add gaming: [${p2.hobbies.join(", ")}]`);
  console.log(`After remove reading: [${p3.hobbies.join(", ")}]`);
  // All states preserved - easy to see exactly what happened!
}

demonstrateImmutabilityBenefits();

export {
  // Person functions
  createPerson,
  createAddress,
  setName,
  birthday,
  moveToCity,
  addHobby,
  removeHobby,
  updateAddress,
  // Bank account functions
  createAccount,
  deposit,
  withdraw,
  getBalance,
  getTransactions,
  // Todo list functions
  createTodoList,
  addTodo,
  toggleTodo,
  updateTodoTitle,
  removeTodo,
  markAllComplete,
  getTodos,
  // Game state functions
  createGameState,
  movePlayer,
  damagePlayer,
  addToInventory,
  spawnEnemy,
  damageEnemy,
  nextLevel,
};

export type {
  Address,
  Person,
  Transaction,
  BankAccount,
  Todo,
  TodoList,
  Position,
  Player,
  Enemy,
  GameState,
};


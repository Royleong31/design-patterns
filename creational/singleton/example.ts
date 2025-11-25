/**
 * SINGLETON PATTERN - Example
 *
 * Demonstrates the Database Connection Pool singleton in action.
 */

import { DatabaseConnectionPool } from "./index";

async function main() {
  console.log("=".repeat(60));
  console.log("SINGLETON PATTERN - Database Connection Pool");
  console.log("=".repeat(60));
  console.log();

  // Get the singleton instance
  console.log("1. Getting the connection pool instance...");
  const pool1 = DatabaseConnectionPool.getInstance(3);
  console.log();

  // Try to get another instance - should return the same one
  console.log("2. Trying to get another instance...");
  const pool2 = DatabaseConnectionPool.getInstance();
  console.log(`   Same instance? ${pool1 === pool2}`);
  console.log();

  // Use multiple connections
  console.log("3. Acquiring connections and running queries...");
  console.log();

  const conn1 = await pool1.getConnection();
  await conn1.query("SELECT * FROM users");

  const conn2 = await pool1.getConnection();
  await conn2.query("SELECT * FROM orders");

  console.log();
  console.log("4. Pool statistics:");
  console.log(`   ${JSON.stringify(pool1.getStats())}`);
  console.log();

  // Release connections
  console.log("5. Releasing connections...");
  conn1.release();
  conn2.release();

  console.log();
  console.log("6. Pool statistics after release:");
  console.log(`   ${JSON.stringify(pool1.getStats())}`);
  console.log();

  // Demonstrate connection reuse
  console.log("7. Getting a connection again (should reuse)...");
  const conn3 = await pool1.getConnection();
  await conn3.query("INSERT INTO logs VALUES (...)");
  conn3.release();

  console.log();
  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Only one pool instance exists throughout the application");
  console.log("- Connections are reused, not recreated each time");
  console.log("- The pool manages the lifecycle of all connections");
  console.log("=".repeat(60));
}

main().catch(console.error);


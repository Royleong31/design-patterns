/**
 * SINGLETON PATTERN
 *
 * Intent: Ensure a class has only one instance and provide a global point of access to it.
 *
 * Real-world example: Database connection pool
 * - Database connections are expensive to create
 * - We want to reuse connections across the application
 * - Only one pool should exist to manage all connections
 */

interface Connection {
  id: string;
  query(sql: string): Promise<unknown>;
  release(): void;
}

class DatabaseConnection implements Connection {
  id: string;
  private inUse: boolean = false;

  constructor() {
    this.id = `conn_${Math.random().toString(36).substring(7)}`;
    console.log(`  [Connection] Created new connection: ${this.id}`);
  }

  async query(sql: string): Promise<unknown> {
    console.log(`  [Connection ${this.id}] Executing: ${sql}`);
    // Simulate query execution
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { rows: [], affectedRows: 0 };
  }

  release(): void {
    this.inUse = false;
    console.log(`  [Connection ${this.id}] Released back to pool`);
  }

  acquire(): boolean {
    if (this.inUse) return false;
    this.inUse = true;
    return true;
  }

  isInUse(): boolean {
    return this.inUse;
  }
}

/**
 * DatabaseConnectionPool - Singleton
 *
 * This class manages a pool of database connections.
 * Only one instance of this pool should exist in the application.
 */
export class DatabaseConnectionPool {
  private static instance: DatabaseConnectionPool | null = null;
  private connections: DatabaseConnection[] = [];
  private readonly maxConnections: number;

  // Private constructor prevents direct instantiation
  private constructor(maxConnections: number = 5) {
    this.maxConnections = maxConnections;
    console.log(
      `[Pool] Initializing connection pool with max ${maxConnections} connections`
    );
  }

  /**
   * Get the singleton instance of the connection pool
   */
  public static getInstance(maxConnections: number = 5): DatabaseConnectionPool {
    if (!DatabaseConnectionPool.instance) {
      DatabaseConnectionPool.instance = new DatabaseConnectionPool(maxConnections);
    }
    return DatabaseConnectionPool.instance;
  }

  /**
   * Reset the singleton instance (useful for testing)
   */
  public static resetInstance(): void {
    DatabaseConnectionPool.instance = null;
  }

  /**
   * Get an available connection from the pool
   */
  public async getConnection(): Promise<Connection> {
    // Try to find an available connection
    for (const conn of this.connections) {
      if (conn.acquire()) {
        console.log(`[Pool] Reusing existing connection: ${conn.id}`);
        return conn;
      }
    }

    // Create a new connection if pool isn't full
    if (this.connections.length < this.maxConnections) {
      const newConn = new DatabaseConnection();
      newConn.acquire();
      this.connections.push(newConn);
      return newConn;
    }

    // Wait for a connection to become available
    console.log("[Pool] All connections in use, waiting...");
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        for (const conn of this.connections) {
          if (conn.acquire()) {
            clearInterval(checkInterval);
            console.log(`[Pool] Connection became available: ${conn.id}`);
            resolve(conn);
            return;
          }
        }
      }, 50);
    });
  }

  /**
   * Get pool statistics
   */
  public getStats(): { total: number; inUse: number; available: number } {
    const inUse = this.connections.filter((c) => c.isInUse()).length;
    return {
      total: this.connections.length,
      inUse,
      available: this.connections.length - inUse,
    };
  }
}


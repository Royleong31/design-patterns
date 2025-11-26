/**
 * CHAIN OF RESPONSIBILITY PATTERN
 *
 * Intent: Avoid coupling the sender of a request to its receiver by giving more than
 * one object a chance to handle the request. Chain the receiving objects and pass
 * the request along the chain until an object handles it.
 *
 * Real-world example: Support Ticket System
 * - Customer support tickets are handled by different levels: Bot, Agent, Supervisor, Manager
 * - Each handler can either process the ticket or pass it to the next level
 * - The ticket moves up the chain based on complexity and priority
 * - Handlers can be added/removed without affecting others
 */

/**
 * Request - Support Ticket
 */
export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  category: "billing" | "technical" | "account" | "general" | "complaint";
  createdAt: Date;
  handledBy: string[];
  status: "open" | "in_progress" | "escalated" | "resolved";
  resolution?: string;
}

/**
 * Handler Interface - Support Handler
 */
export abstract class SupportHandler {
  protected nextHandler: SupportHandler | null = null;
  protected handlerName: string;

  constructor(name: string) {
    this.handlerName = name;
  }

  /**
   * Set the next handler in the chain
   */
  setNext(handler: SupportHandler): SupportHandler {
    this.nextHandler = handler;
    return handler; // Enable chaining: a.setNext(b).setNext(c)
  }

  /**
   * Template method for handling tickets
   */
  handle(ticket: SupportTicket): SupportTicket {
    if (this.canHandle(ticket)) {
      return this.processTicket(ticket);
    } else if (this.nextHandler) {
      console.log(`  [${this.handlerName}] Passing ticket to next handler...`);
      ticket.handledBy.push(`${this.handlerName} (passed)`);
      return this.nextHandler.handle(ticket);
    } else {
      console.log(`  [${this.handlerName}] End of chain - no handler available`);
      ticket.status = "escalated";
      return ticket;
    }
  }

  /**
   * Check if this handler can process the ticket
   */
  protected abstract canHandle(ticket: SupportTicket): boolean;

  /**
   * Process the ticket
   */
  protected abstract processTicket(ticket: SupportTicket): SupportTicket;

  getName(): string {
    return this.handlerName;
  }
}

/**
 * Concrete Handler - Automated Bot
 * Handles simple, low-priority inquiries
 */
export class BotHandler extends SupportHandler {
  private knowledgeBase: Map<string, string> = new Map();

  constructor() {
    super("Support Bot");
    this.initKnowledgeBase();
  }

  private initKnowledgeBase(): void {
    this.knowledgeBase.set("password", "You can reset your password at: /account/reset-password");
    this.knowledgeBase.set("hours", "Our support hours are 24/7 for chat, and 9 AM - 6 PM EST for phone.");
    this.knowledgeBase.set("shipping", "Standard shipping takes 5-7 business days. Express is 2-3 days.");
    this.knowledgeBase.set("return", "You can return items within 30 days. Visit: /returns");
    this.knowledgeBase.set("pricing", "Please check our pricing page at: /pricing");
  }

  protected canHandle(ticket: SupportTicket): boolean {
    // Bot handles low priority, general inquiries
    if (ticket.priority !== "low") return false;
    if (ticket.category === "complaint") return false;

    // Check if we have a knowledge base match
    const keywords = ticket.description.toLowerCase();
    for (const key of this.knowledgeBase.keys()) {
      if (keywords.includes(key)) {
        return true;
      }
    }
    return false;
  }

  protected processTicket(ticket: SupportTicket): SupportTicket {
    console.log(`  [${this.handlerName}] Processing ticket #${ticket.id}...`);

    const keywords = ticket.description.toLowerCase();
    let response = "";

    for (const [key, value] of this.knowledgeBase) {
      if (keywords.includes(key)) {
        response = value;
        break;
      }
    }

    console.log(`  [${this.handlerName}] Auto-response sent: "${response.substring(0, 50)}..."`);

    ticket.handledBy.push(this.handlerName);
    ticket.status = "resolved";
    ticket.resolution = `[Automated] ${response}`;

    return ticket;
  }
}

/**
 * Concrete Handler - Support Agent
 * Handles standard tickets that require human interaction
 */
export class AgentHandler extends SupportHandler {
  constructor() {
    super("Support Agent");
  }

  protected canHandle(ticket: SupportTicket): boolean {
    // Agent handles low to medium priority, non-complaint tickets
    return (
      (ticket.priority === "low" || ticket.priority === "medium") &&
      ticket.category !== "complaint"
    );
  }

  protected processTicket(ticket: SupportTicket): SupportTicket {
    console.log(`  [${this.handlerName}] Handling ticket #${ticket.id}...`);
    console.log(`  [${this.handlerName}] Category: ${ticket.category}, Priority: ${ticket.priority}`);
    console.log(`  [${this.handlerName}] Investigating issue...`);
    console.log(`  [${this.handlerName}] Responding to customer ${ticket.customerName}`);

    ticket.handledBy.push(this.handlerName);
    ticket.status = "resolved";
    ticket.resolution = `Resolved by ${this.handlerName}. Issue addressed and customer informed.`;

    return ticket;
  }
}

/**
 * Concrete Handler - Senior Agent / Supervisor
 * Handles high priority and complex tickets
 */
export class SupervisorHandler extends SupportHandler {
  constructor() {
    super("Supervisor");
  }

  protected canHandle(ticket: SupportTicket): boolean {
    // Supervisor handles high priority, billing issues, and complaints
    return (
      ticket.priority === "high" ||
      ticket.category === "billing" ||
      ticket.category === "complaint"
    );
  }

  protected processTicket(ticket: SupportTicket): SupportTicket {
    console.log(`  [${this.handlerName}] Escalated ticket #${ticket.id} received`);
    console.log(`  [${this.handlerName}] Priority: ${ticket.priority}, Category: ${ticket.category}`);
    console.log(`  [${this.handlerName}] Reviewing ticket history...`);
    console.log(`  [${this.handlerName}] Taking special measures for resolution`);

    ticket.handledBy.push(this.handlerName);
    ticket.status = "resolved";
    ticket.resolution = `Resolved by ${this.handlerName} with priority handling. Special attention given.`;

    return ticket;
  }
}

/**
 * Concrete Handler - Manager
 * Handles critical tickets and final escalations
 */
export class ManagerHandler extends SupportHandler {
  constructor() {
    super("Manager");
  }

  protected canHandle(ticket: SupportTicket): boolean {
    // Manager handles critical priority tickets
    return ticket.priority === "critical";
  }

  protected processTicket(ticket: SupportTicket): SupportTicket {
    console.log(`  [${this.handlerName}] 🚨 CRITICAL ticket #${ticket.id} received`);
    console.log(`  [${this.handlerName}] Customer: ${ticket.customerName}`);
    console.log(`  [${this.handlerName}] Initiating emergency response protocol`);
    console.log(`  [${this.handlerName}] Direct communication with customer`);
    console.log(`  [${this.handlerName}] Implementing immediate solution`);

    ticket.handledBy.push(this.handlerName);
    ticket.status = "resolved";
    ticket.resolution = `Resolved by ${this.handlerName}. Executive attention provided. Follow-up scheduled.`;

    return ticket;
  }
}

/**
 * Support System - Creates and manages the handler chain
 */
export class SupportSystem {
  private chainHead: SupportHandler | null = null;
  private handlers: SupportHandler[] = [];

  /**
   * Build the default support chain
   */
  buildChain(): void {
    const bot = new BotHandler();
    const agent = new AgentHandler();
    const supervisor = new SupervisorHandler();
    const manager = new ManagerHandler();

    // Set up chain: Bot -> Agent -> Supervisor -> Manager
    // TODO: Add a catch all handler to handle tickets that are not handled by any of the handlers
    bot.setNext(agent).setNext(supervisor).setNext(manager);

    this.chainHead = bot;
    this.handlers = [bot, agent, supervisor, manager];

    console.log("  [System] Support chain initialized:");
    console.log(`  [System] ${this.handlers.map((h) => h.getName()).join(" → ")}`);
  }

  /**
   * Submit a ticket to the chain
   */
  submitTicket(ticket: SupportTicket): SupportTicket {
    if (!this.chainHead) {
      throw new Error("Support chain not initialized");
    }

    console.log(`\n  [System] New ticket #${ticket.id} submitted`);
    console.log(`  [System] Subject: "${ticket.subject}"`);
    console.log(`  [System] Priority: ${ticket.priority}, Category: ${ticket.category}`);
    console.log();

    ticket.status = "in_progress";
    return this.chainHead.handle(ticket);
  }

  /**
   * Get chain info
   */
  getChainInfo(): string[] {
    return this.handlers.map((h) => h.getName());
  }
}

/**
 * Helper to create a ticket
 */
export function createTicket(
  id: string,
  customerName: string,
  subject: string,
  description: string,
  priority: SupportTicket["priority"],
  category: SupportTicket["category"]
): SupportTicket {
  return {
    id,
    customerId: `CUST-${id}`,
    customerName,
    subject,
    description,
    priority,
    category,
    createdAt: new Date(),
    handledBy: [],
    status: "open",
  };
}

/**
 * Format ticket info
 */
export function formatTicket(ticket: SupportTicket): string {
  const lines = [
    `  📋 Ticket #${ticket.id}`,
    `  👤 Customer: ${ticket.customerName}`,
    `  📝 Subject: ${ticket.subject}`,
    `  🏷️  Category: ${ticket.category} | Priority: ${ticket.priority}`,
    `  📊 Status: ${ticket.status}`,
    `  🔀 Handled by: ${ticket.handledBy.join(" → ") || "None yet"}`,
  ];

  if (ticket.resolution) {
    lines.push(`  ✅ Resolution: ${ticket.resolution}`);
  }

  return lines.join("\n");
}


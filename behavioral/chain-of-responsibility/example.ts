/**
 * CHAIN OF RESPONSIBILITY PATTERN - Example
 *
 * Demonstrates the Support Ticket chain in action.
 */

import { SupportSystem, createTicket, formatTicket } from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("CHAIN OF RESPONSIBILITY PATTERN - Support Ticket System");
  console.log("=".repeat(60));
  console.log();

  // Initialize the support system
  console.log("1. Setting up support chain...");
  const supportSystem = new SupportSystem();
  supportSystem.buildChain();
  console.log();

  // Ticket 1: Simple inquiry - handled by Bot
  console.log("2. TICKET: Simple Password Reset Inquiry");
  console.log("-".repeat(40));
  const ticket1 = createTicket(
    "T001",
    "John Doe",
    "How to reset password?",
    "I forgot my password and need help resetting it",
    "low",
    "general"
  );
  const result1 = supportSystem.submitTicket(ticket1);
  console.log();
  console.log(formatTicket(result1));
  console.log();

  // Ticket 2: Technical issue - handled by Agent
  console.log("3. TICKET: Technical Issue (Medium Priority)");
  console.log("-".repeat(40));
  const ticket2 = createTicket(
    "T002",
    "Jane Smith",
    "App crashes on login",
    "The mobile app crashes every time I try to login since the last update",
    "medium",
    "technical"
  );
  const result2 = supportSystem.submitTicket(ticket2);
  console.log();
  console.log(formatTicket(result2));
  console.log();

  // Ticket 3: Billing complaint - handled by Supervisor
  console.log("4. TICKET: Billing Complaint (High Priority)");
  console.log("-".repeat(40));
  const ticket3 = createTicket(
    "T003",
    "Bob Wilson",
    "Unauthorized charge on my account",
    "I was charged $99.99 that I did not authorize. This is unacceptable!",
    "high",
    "billing"
  );
  const result3 = supportSystem.submitTicket(ticket3);
  console.log();
  console.log(formatTicket(result3));
  console.log();

  // Ticket 4: Critical system issue - handled by Manager
  console.log("5. TICKET: Critical Issue");
  console.log("-".repeat(40));
  const ticket4 = createTicket(
    "T004",
    "Enterprise Corp (VIP)",
    "Complete service outage",
    "Our entire team of 500 users cannot access the platform. Business is halted.",
    "critical",
    "technical"
  );
  const result4 = supportSystem.submitTicket(ticket4);
  console.log();
  console.log(formatTicket(result4));
  console.log();

  // Ticket 5: Customer complaint - escalated to Supervisor
  console.log("6. TICKET: Customer Complaint");
  console.log("-".repeat(40));
  const ticket5 = createTicket(
    "T005",
    "Alice Brown",
    "Poor customer service experience",
    "I have been waiting 3 days for a response to my issue. This is very frustrating.",
    "medium",
    "complaint"
  );
  const result5 = supportSystem.submitTicket(ticket5);
  console.log();
  console.log(formatTicket(result5));
  console.log();

  // Ticket 6: General inquiry without keyword match - handled by Agent
  console.log("7. TICKET: General Inquiry (no bot keyword match)");
  console.log("-".repeat(40));
  const ticket6 = createTicket(
    "T006",
    "Charlie Green",
    "Product compatibility question",
    "Is your product compatible with macOS Sonoma?",
    "low",
    "general"
  );
  const result6 = supportSystem.submitTicket(ticket6);
  console.log();
  console.log(formatTicket(result6));
  console.log();

  // Show summary
  console.log("8. TICKET SUMMARY");
  console.log("-".repeat(40));
  const tickets = [result1, result2, result3, result4, result5, result6];

  console.log("   Ticket | Priority | Category   | Final Handler");
  console.log("   " + "-".repeat(50));
  tickets.forEach((t) => {
    const finalHandler = t.handledBy.filter((h) => !h.includes("(passed)")).pop() || "None";
    console.log(
      `   ${t.id.padEnd(6)} | ${t.priority.padEnd(8)} | ${t.category.padEnd(10)} | ${finalHandler}`
    );
  });
  console.log();

  // Demonstrate chain traversal
  console.log("9. CHAIN TRAVERSAL VISUALIZATION");
  console.log("-".repeat(40));
  console.log();
  tickets.forEach((t) => {
    const path = t.handledBy.map((h) => (h.includes("(passed)") ? `[${h}]` : `✓ ${h}`));
    console.log(`   Ticket #${t.id}: ${path.join(" → ")}`);
  });
  console.log();

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Request travels along the chain until a handler processes it");
  console.log("- Each handler decides whether to process or pass to the next");
  console.log("- Sender doesn't need to know which handler will process");
  console.log("- Handlers can be added/removed/reordered dynamically");
  console.log("- Decouples senders from receivers");
  console.log("- Multiple handlers can participate (or none at all)");
  console.log("=".repeat(60));
}

main();


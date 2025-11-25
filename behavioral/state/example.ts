/**
 * STATE PATTERN - Example
 *
 * Demonstrates the Order Processing state machine in action.
 */

import { Order, formatOrderInfo, formatStateHistory } from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("STATE PATTERN - Order Processing System");
  console.log("=".repeat(60));
  console.log();

  // Create an order
  console.log("1. Creating a new order...");
  const order = new Order("ORD-001");
  order.addItem("Wireless Keyboard", 79.99);
  order.addItem("USB Mouse", 29.99);
  order.addItem("Monitor Stand", 49.99, 2);
  order.setShippingAddress("123 Main St, City, ST 12345");
  console.log();
  console.log(formatOrderInfo(order));
  console.log();

  // Try invalid transitions from Pending state
  console.log("2. Testing invalid transitions from Pending state...");
  order.ship(); // Can't ship before paying
  order.deliver(); // Can't deliver before shipping
  order.refund(); // Can't refund before paying
  console.log();

  // Pay for the order
  console.log("3. Paying for the order...");
  order.pay();
  console.log(`   New state: ${order.getStateName()}`);
  console.log();

  // Try paying again
  console.log("4. Trying to pay again...");
  order.pay();
  console.log();

  // Ship the order
  console.log("5. Shipping the order...");
  order.ship();
  console.log(`   New state: ${order.getStateName()}`);
  console.log();

  // Try to cancel shipped order
  console.log("6. Trying to cancel shipped order...");
  order.cancel();
  console.log();

  // Deliver the order
  console.log("7. Delivering the order...");
  order.deliver();
  console.log(`   New state: ${order.getStateName()}`);
  console.log();

  // Show order info
  console.log("8. Final order information:");
  console.log(formatOrderInfo(order));
  console.log();

  // Show state history
  console.log("9. State transition history:");
  console.log(formatStateHistory(order));
  console.log();

  // Demonstrate cancellation flow
  console.log("=".repeat(60));
  console.log("ALTERNATE FLOW: Order Cancellation");
  console.log("=".repeat(60));
  console.log();

  const order2 = new Order("ORD-002");
  order2.addItem("Headphones", 149.99);
  order2.setShippingAddress("456 Oak Ave, Town, ST 67890");
  console.log();

  console.log("10. Cancelling order before payment...");
  order2.cancel();
  console.log();

  console.log("11. Trying to pay cancelled order...");
  order2.pay();
  console.log();

  console.log("    State history:");
  console.log(formatStateHistory(order2));
  console.log();

  // Demonstrate refund flow
  console.log("=".repeat(60));
  console.log("ALTERNATE FLOW: Order Refund");
  console.log("=".repeat(60));
  console.log();

  const order3 = new Order("ORD-003");
  order3.addItem("Laptop Bag", 59.99);
  order3.setShippingAddress("789 Pine Rd, Village, ST 11111");
  console.log();

  console.log("12. Processing order through to delivery...");
  order3.pay();
  order3.ship();
  order3.deliver();
  console.log();

  console.log("13. Customer requests refund...");
  order3.refund();
  console.log();

  console.log("14. Trying operations on refunded order...");
  order3.pay();
  order3.ship();
  console.log();

  console.log("    State history:");
  console.log(formatStateHistory(order3));
  console.log();

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Object behavior changes based on its internal state");
  console.log("- Each state is a separate class implementing the state interface");
  console.log("- States control their own transitions to other states");
  console.log("- Context (Order) delegates behavior to current state");
  console.log("- Invalid operations are handled gracefully by each state");
  console.log("- Adding new states doesn't require changing existing code");
  console.log("=".repeat(60));
}

main();


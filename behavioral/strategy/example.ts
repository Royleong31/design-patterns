/**
 * STRATEGY PATTERN - Example
 *
 * Demonstrates the Payment Strategy pattern in action.
 */

import {
  ShoppingCart,
  CreditCardStrategy,
  PayPalStrategy,
  CryptoStrategy,
  BankTransferStrategy,
  ApplePayStrategy,
} from "./index";

async function main() {
  console.log("=".repeat(60));
  console.log("STRATEGY PATTERN - Payment Processing");
  console.log("=".repeat(60));
  console.log();

  // Create different payment strategies
  const creditCard = new CreditCardStrategy(
    "4111111111111111",
    "12/25",
    "123",
    "John Doe"
  );

  const paypal = new PayPalStrategy("john.doe@email.com");

  const crypto = new CryptoStrategy(
    "0x742d35Cc6634C0532925a3b844Bc9e7595f",
    "ETH",
    2500 // ETH price in USD
  );

  const bankTransfer = new BankTransferStrategy(
    "021000021",
    "123456789",
    "John Doe"
  );

  const applePay = new ApplePayStrategy("device_12345");

  // Show available payment methods
  ShoppingCart.displayPaymentOptions([
    creditCard,
    paypal,
    crypto,
    bankTransfer,
    applePay,
  ]);

  // Create a shopping cart
  console.log("\n" + "=".repeat(60));
  console.log("SCENARIO 1: Credit Card Payment");
  console.log("-".repeat(40));

  const cart1 = new ShoppingCart("customer@email.com");
  cart1.addItem("Wireless Headphones", 149.99);
  cart1.addItem("Phone Case", 29.99);
  cart1.addItem("USB-C Cable", 19.99, 2);

  console.log("\nCart contents:");
  cart1.getItems().forEach((item) => {
    console.log(`  - ${item.name} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)}`);
  });
  console.log(`  Total: $${cart1.getTotal().toFixed(2)}`);

  // Use credit card strategy
  cart1.setPaymentStrategy(creditCard);
  const result1 = await cart1.checkout();
  console.log(`\n  ✓ Transaction: ${result1?.transactionId}`);
  console.log(`  ✓ Net amount received: $${result1?.netAmount.toFixed(2)}`);

  // Scenario 2: PayPal
  console.log("\n" + "=".repeat(60));
  console.log("SCENARIO 2: PayPal Payment");
  console.log("-".repeat(40));

  const cart2 = new ShoppingCart("another@email.com");
  cart2.addItem("Smart Watch", 299.99);
  cart2.addItem("Watch Band", 49.99);

  console.log("\nCart contents:");
  cart2.getItems().forEach((item) => {
    console.log(`  - ${item.name} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)}`);
  });
  console.log(`  Total: $${cart2.getTotal().toFixed(2)}`);

  cart2.setPaymentStrategy(paypal);
  const result2 = await cart2.checkout();
  console.log(`\n  ✓ Transaction: ${result2?.transactionId}`);
  console.log(`  ✓ Net amount received: $${result2?.netAmount.toFixed(2)}`);

  // Scenario 3: Cryptocurrency
  console.log("\n" + "=".repeat(60));
  console.log("SCENARIO 3: Cryptocurrency Payment");
  console.log("-".repeat(40));

  const cart3 = new ShoppingCart("crypto@email.com");
  cart3.addItem("Gaming Laptop", 1499.99);
  cart3.addItem("Laptop Stand", 79.99);

  console.log("\nCart contents:");
  cart3.getItems().forEach((item) => {
    console.log(`  - ${item.name} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)}`);
  });
  console.log(`  Total: $${cart3.getTotal().toFixed(2)}`);

  cart3.setPaymentStrategy(crypto);
  const result3 = await cart3.checkout();
  console.log(`\n  ✓ Transaction: ${result3?.transactionId}`);
  console.log(`  ✓ Net amount received: $${result3?.netAmount.toFixed(2)}`);

  // Scenario 4: Switching strategies at runtime
  console.log("\n" + "=".repeat(60));
  console.log("SCENARIO 4: Switching Payment Method at Runtime");
  console.log("-".repeat(40));

  const cart4 = new ShoppingCart("flexible@email.com");
  cart4.addItem("Ergonomic Keyboard", 179.99);

  console.log("\nCustomer adds item to cart...");
  console.log(`  Total: $${cart4.getTotal().toFixed(2)}`);

  // First, customer selects credit card
  console.log("\nCustomer initially selects Credit Card...");
  cart4.setPaymentStrategy(creditCard);

  // Then changes mind and wants lower fees
  console.log("\nCustomer changes mind - wants lower fees, switches to Bank Transfer...");
  cart4.setPaymentStrategy(bankTransfer);

  console.log(`\nComparing fees:`);
  console.log(`  - Credit Card: ${creditCard.feePercentage}% + $0.30`);
  console.log(`  - Bank Transfer: ${bankTransfer.feePercentage}%`);

  const result4 = await cart4.checkout();
  console.log(`\n  ✓ Transaction: ${result4?.transactionId}`);
  console.log(`  ✓ Net amount received: $${result4?.netAmount.toFixed(2)}`);

  // Scenario 5: Apple Pay for quick checkout
  console.log("\n" + "=".repeat(60));
  console.log("SCENARIO 5: Apple Pay Quick Checkout");
  console.log("-".repeat(40));

  const cart5 = new ShoppingCart("apple@email.com");
  cart5.addItem("AirPods Pro", 249.99);

  console.log("\nCart contents:");
  console.log(`  - AirPods Pro: $249.99`);
  console.log(`  Total: $${cart5.getTotal().toFixed(2)}`);

  cart5.setPaymentStrategy(applePay);
  const result5 = await cart5.checkout();
  console.log(`\n  ✓ Transaction: ${result5?.transactionId}`);
  console.log(`  ✓ Net amount received: $${result5?.netAmount.toFixed(2)}`);

  console.log("\n" + "=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Strategy pattern encapsulates interchangeable algorithms");
  console.log("- The context (ShoppingCart) doesn't know strategy details");
  console.log("- Strategies can be swapped at runtime");
  console.log("- Each strategy has its own implementation and validation");
  console.log("- Adding new payment methods doesn't require changing the cart");
  console.log("- Open/Closed Principle: open for extension, closed for modification");
  console.log("=".repeat(60));
}

main().catch(console.error);


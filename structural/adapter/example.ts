/**
 * ADAPTER PATTERN - Example
 *
 * Demonstrates payment gateway adapters in action.
 */

import {
  PaymentProcessor,
  StripeAPI,
  PayPalSDK,
  SquareClient,
  StripeAdapter,
  PayPalAdapter,
  SquareAdapter,
} from "./index";

async function main() {
  console.log("=".repeat(60));
  console.log("ADAPTER PATTERN - Payment Gateway Integration");
  console.log("=".repeat(60));
  console.log();

  // Create the external payment provider instances
  const stripeApi = new StripeAPI();
  const paypalSdk = new PayPalSDK();
  const squareClient = new SquareClient();

  // Wrap them with adapters to get a unified interface
  const stripeProcessor = new StripeAdapter(stripeApi);
  const paypalProcessor = new PayPalAdapter(paypalSdk);
  const squareProcessor = new SquareAdapter(squareClient);

  // Client code that works with any payment processor
  async function checkout(processor: PaymentProcessor, amount: number) {
    console.log(`Processing $${amount.toFixed(2)} payment...`);
    console.log();

    // Process payment
    const result = await processor.processPayment(amount, "USD");
    console.log();
    console.log(`  Result: ${result.success ? "✓" : "✗"} ${result.message}`);
    console.log(`  Transaction ID: ${result.transactionId}`);
    console.log(`  Provider: ${result.provider}`);

    // Check status
    const status = await processor.getTransactionStatus(result.transactionId);
    console.log(`  Status: ${status}`);

    return result;
  }

  // Demo with each provider
  console.log("1. Processing payment with STRIPE");
  console.log("-".repeat(40));
  const stripeResult = await checkout(stripeProcessor, 99.99);
  console.log();

  console.log("2. Processing payment with PAYPAL");
  console.log("-".repeat(40));
  const paypalResult = await checkout(paypalProcessor, 149.99);
  console.log();

  console.log("3. Processing payment with SQUARE");
  console.log("-".repeat(40));
  const squareResult = await checkout(squareProcessor, 79.99);
  console.log();

  // Demo refund functionality
  console.log("=".repeat(60));
  console.log("4. Processing REFUNDS");
  console.log("-".repeat(40));
  console.log();

  console.log("Refunding Stripe payment...");
  const stripeRefund = await stripeProcessor.refund(stripeResult.transactionId, 99.99);
  console.log(`  ${stripeRefund.success ? "✓" : "✗"} ${stripeRefund.message}`);
  console.log(`  Refund ID: ${stripeRefund.refundId}`);
  console.log();

  console.log("Refunding PayPal payment...");
  const paypalRefund = await paypalProcessor.refund(paypalResult.transactionId, 149.99);
  console.log(`  ${paypalRefund.success ? "✓" : "✗"} ${paypalRefund.message}`);
  console.log(`  Refund ID: ${paypalRefund.refundId}`);
  console.log();

  console.log("Refunding Square payment...");
  const squareRefund = await squareProcessor.refund(squareResult.transactionId, 79.99);
  console.log(`  ${squareRefund.success ? "✓" : "✗"} ${squareRefund.message}`);
  console.log(`  Refund ID: ${squareRefund.refundId}`);
  console.log();

  // Show the power of the adapter pattern
  console.log("=".repeat(60));
  console.log("5. POLYMORPHISM IN ACTION");
  console.log("-".repeat(40));
  console.log();

  // An array of different processors that all work the same way
  const processors: PaymentProcessor[] = [
    stripeProcessor,
    paypalProcessor,
    squareProcessor,
  ];

  console.log("Processing a $10 payment through all providers:\n");

  for (const processor of processors) {
    const result = await processor.processPayment(10, "USD");
    console.log(`  ${result.provider}: ${result.success ? "✓" : "✗"} (${result.transactionId})`);
  }

  console.log();
  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Adapters convert incompatible interfaces to a common one");
  console.log("- Client code works with the target interface, not adaptees");
  console.log("- New payment providers can be added by creating new adapters");
  console.log("- Each adapter handles the translation of data formats");
  console.log("=".repeat(60));
}

main().catch(console.error);


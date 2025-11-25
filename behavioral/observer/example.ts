/**
 * OBSERVER PATTERN - Example
 *
 * Demonstrates the Newsletter subscription system in action.
 */

import {
  NewsletterPublisher,
  EmailSubscriber,
  PushSubscriber,
  SMSSubscriber,
  SlackSubscriber,
  RSSSubscriber,
} from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("OBSERVER PATTERN - Newsletter Subscription System");
  console.log("=".repeat(60));
  console.log();

  // Create the publisher (subject)
  const techBlog = new NewsletterPublisher("TechDaily");

  // Create various subscribers (observers)
  console.log("1. Setting up subscribers");
  console.log("-".repeat(40));

  const alice = new EmailSubscriber("Alice", "alice@email.com", ["tech", "ai"]);
  const bob = new EmailSubscriber("Bob", "bob@email.com"); // All categories
  const charlie = new PushSubscriber("Charlie", "device_abc123");
  const diana = new PushSubscriber("Diana", "device_xyz789", true); // Breaking only
  const eve = new SMSSubscriber("Eve", "+1-555-0123");
  const devTeam = new SlackSubscriber("Dev Team", "https://hooks.slack.com/xxx", "tech-news");
  const rssFeed = new RSSSubscriber("https://techblog.com/rss");

  // Subscribe everyone
  techBlog.subscribe(alice);
  techBlog.subscribe(bob);
  techBlog.subscribe(charlie);
  techBlog.subscribe(diana);
  techBlog.subscribe(eve);
  techBlog.subscribe(devTeam);
  techBlog.subscribe(rssFeed);

  console.log();
  console.log(`Total subscribers: ${techBlog.getSubscriberCount()}`);

  // Publish a regular article
  console.log("\n" + "=".repeat(60));
  console.log("2. Publishing a regular article");
  console.log("-".repeat(40));

  techBlog.publishArticle(
    "TypeScript 6.0 Released with Amazing Features",
    "The latest version brings revolutionary changes to the type system.",
    "tech",
    "John Smith"
  );

  // Publish an article in a different category
  console.log("\n" + "=".repeat(60));
  console.log("3. Publishing a business article (Alice filters this out)");
  console.log("-".repeat(40));

  techBlog.publishArticle(
    "Stock Market Hits All-Time High",
    "Major indices surge on positive economic data.",
    "business",
    "Jane Doe"
  );

  // Publish breaking news
  console.log("\n" + "=".repeat(60));
  console.log("4. Publishing BREAKING NEWS");
  console.log("-".repeat(40));

  techBlog.publishArticle(
    "Major Security Vulnerability Found in Popular Framework",
    "Critical CVE affects millions of applications worldwide.",
    "security",
    "Security Team",
    true // Breaking news!
  );

  // Someone unsubscribes
  console.log("\n" + "=".repeat(60));
  console.log("5. Bob unsubscribes");
  console.log("-".repeat(40));

  techBlog.unsubscribe(bob.id);
  console.log(`\nRemaining subscribers: ${techBlog.getSubscriberCount()}`);

  // Publish another article
  console.log("\n" + "=".repeat(60));
  console.log("6. Publishing after unsubscription (Bob won't receive)");
  console.log("-".repeat(40));

  techBlog.publishArticle(
    "AI Models Now Write Better Code Than Humans",
    "New benchmarks show AI outperforming senior developers.",
    "ai",
    "Tech Reporter"
  );

  // Show different notification behaviors
  console.log("\n" + "=".repeat(60));
  console.log("NOTIFICATION BEHAVIORS RECAP");
  console.log("-".repeat(40));
  console.log();
  console.log("  📧 Alice (Email)      → Only 'tech' and 'ai' categories");
  console.log("  📱 Charlie (Push)     → All articles");
  console.log("  📱 Diana (Push)       → Breaking news only");
  console.log("  💬 Eve (SMS)          → Breaking news only (cost saving)");
  console.log("  💬 Dev Team (Slack)   → All articles to #tech-news");
  console.log("  📡 RSS Feed           → All new articles (not updates)");

  console.log("\n" + "=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Publisher maintains list of subscribers and notifies them");
  console.log("- Subscribers implement a common interface (update method)");
  console.log("- Each subscriber can react differently to notifications");
  console.log("- Subscribers can filter events based on their preferences");
  console.log("- Loose coupling between publisher and subscribers");
  console.log("- Easy to add new subscriber types without changing publisher");
  console.log("=".repeat(60));
}

main();


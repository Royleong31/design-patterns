/**
 * MEDIATOR PATTERN - Example
 *
 * Demonstrates the Chat Room mediator in action.
 */

import {
  ChatRoom,
  RegularUser,
  AdminUser,
  BotUser,
  formatUserInfo,
  formatRoomInfo,
} from "./index";

async function main() {
  console.log("=".repeat(60));
  console.log("MEDIATOR PATTERN - Chat Room System");
  console.log("=".repeat(60));
  console.log();

  // Create a chat room (mediator)
  console.log("1. Creating chat room...");
  const chatRoom = new ChatRoom("General Discussion");
  console.log();

  // Create users (colleagues)
  console.log("2. Creating users...");
  const alice = new RegularUser("Alice");
  const bob = new RegularUser("Bob");
  const charlie = new RegularUser("Charlie");
  const admin = new AdminUser("Sarah");
  const bot = new BotUser("HelpBot");
  console.log("   Created: Alice, Bob, Charlie, Admin Sarah, HelpBot");
  console.log();

  // Register users with the chat room
  console.log("3. Users joining the chat room...");
  chatRoom.register(admin); // Admin joins first
  chatRoom.register(bot);
  chatRoom.register(alice);
  chatRoom.register(bob);
  chatRoom.register(charlie);
  console.log();

  // Admin announcement
  console.log("4. ADMIN ANNOUNCEMENT");
  console.log("-".repeat(40));
  admin.announce("Welcome to the chat room! Please be respectful.");
  console.log();

  // Regular messages
  console.log("5. PUBLIC MESSAGES");
  console.log("-".repeat(40));
  alice.send("Hey everyone! How's it going?");
  console.log();

  bob.send("Hi Alice! Doing great, thanks!");
  console.log();

  charlie.send("Hello all! Just joined.");
  console.log();

  // Private messages
  console.log("6. PRIVATE MESSAGES");
  console.log("-".repeat(40));
  alice.send("Hey Bob, want to grab coffee later?", bob);
  console.log();

  bob.send("Sure! How about 3pm?", alice);
  console.log();

  // Bot commands
  console.log("7. BOT COMMANDS");
  console.log("-".repeat(40));

  // Send a command to the room (bot will respond)
  charlie.send("!help");
  await new Promise((r) => setTimeout(r, 200)); // Wait for bot response
  console.log();

  alice.send("!time");
  await new Promise((r) => setTimeout(r, 200));
  console.log();

  bob.send("!joke");
  await new Promise((r) => setTimeout(r, 200));
  console.log();

  // Admin listing users
  console.log("8. ADMIN FEATURES");
  console.log("-".repeat(40));
  admin.listOnlineUsers();
  console.log();

  // Broadcast message
  console.log("9. BROADCAST MESSAGE");
  console.log("-".repeat(40));
  alice.sendBroadcast("Don't forget the team meeting at 4pm!");
  console.log();

  // User leaves
  console.log("10. USER LEAVES");
  console.log("-".repeat(40));
  chatRoom.unregister(charlie);
  console.log();

  // Show room info
  console.log("11. ROOM STATUS");
  console.log("-".repeat(40));
  console.log(formatRoomInfo(chatRoom));
  console.log();

  // Show user stats
  console.log("12. USER STATISTICS");
  console.log("-".repeat(40));
  [alice, bob, admin, bot].forEach((user) => {
    console.log(formatUserInfo(user));
  });
  console.log();

  // Demonstrate that users don't communicate directly
  console.log("13. DECOUPLING DEMONSTRATION");
  console.log("-".repeat(40));
  console.log("   Users communicate ONLY through the mediator (ChatRoom):");
  console.log("   - Alice doesn't have a direct reference to Bob");
  console.log("   - Messages are routed through ChatRoom.sendMessage()");
  console.log("   - ChatRoom decides who receives each message");
  console.log("   - Adding new user types doesn't affect existing users");
  console.log();

  // Message history
  console.log("14. MESSAGE HISTORY (from mediator)");
  console.log("-".repeat(40));
  const history = chatRoom.getMessageHistory();
  history.slice(0, 5).forEach((msg, i) => {
    console.log(`   ${i + 1}. ${msg.sender}: "${msg.content.substring(0, 40)}..."`);
  });
  if (history.length > 5) {
    console.log(`   ... and ${history.length - 5} more messages`);
  }
  console.log();

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Mediator centralizes complex communication between objects");
  console.log("- Colleagues (users) don't need direct references to each other");
  console.log("- Adding new colleague types is easy (Admin, Bot, Regular)");
  console.log("- Communication logic is contained in the mediator");
  console.log("- Reduces coupling between components");
  console.log("- Makes it easy to add features (private messages, broadcasts)");
  console.log("=".repeat(60));
}

main();


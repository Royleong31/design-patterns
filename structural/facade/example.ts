/**
 * FACADE PATTERN - Example
 *
 * Demonstrates the Smart Home facade pattern in action.
 */

import {
  LightingSystem,
  ThermostatSystem,
  SecuritySystem,
  EntertainmentSystem,
  BlindsSystem,
  SmartHomeFacade,
} from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("FACADE PATTERN - Smart Home System");
  console.log("=".repeat(60));

  // Initialize all subsystems (in real life, these might be IoT devices)
  const lighting = new LightingSystem();
  const thermostat = new ThermostatSystem();
  const security = new SecuritySystem();
  const entertainment = new EntertainmentSystem();
  const blinds = new BlindsSystem();

  // Create the facade that wraps all subsystems
  const smartHome = new SmartHomeFacade(
    lighting,
    thermostat,
    security,
    entertainment,
    blinds
  );

  // Demonstrate the facade - each method hides the complexity
  // of coordinating multiple subsystems

  // Simulate a day in the life...
  console.log("\n" + "=".repeat(60));
  console.log("A DAY IN THE SMART HOME");
  console.log("=".repeat(60));

  // Morning wake up
  smartHome.goodMorning();

  console.log("\n[Time passes... getting ready for work]");

  // Leaving for work
  smartHome.leavingHome();

  console.log("\n[Time passes... at work all day]");

  // Coming home from work
  smartHome.arrivingHome();

  console.log("\n[Time passes... relaxing after dinner]");

  // Movie night!
  smartHome.movieMode();

  console.log("\n[Time passes... movie ends]");

  // Time for bed
  smartHome.goodNight();

  // Bonus: Show the alternative without the facade
  console.log("\n" + "=".repeat(60));
  console.log("WITHOUT FACADE (verbose manual control)");
  console.log("=".repeat(60));
  console.log();
  console.log("To achieve 'Movie Mode' without facade, you'd need to:");
  console.log();
  console.log("  lighting.dim('living_room', 10);");
  console.log("  lighting.setColor('living_room', 'warm_amber');");
  console.log("  blinds.close('living_room');");
  console.log("  entertainment.turnOnTV();");
  console.log("  entertainment.turnOnSoundbar();");
  console.log("  entertainment.setInput('HDMI1');");
  console.log("  entertainment.setVolume(50);");
  console.log("  entertainment.openStreamingApp('Netflix');");
  console.log();
  console.log("With the facade, it's just: smartHome.movieMode()");

  console.log("\n" + "=".repeat(60));
  console.log("PARTY MODE DEMO");
  console.log("=".repeat(60));
  smartHome.partyMode();

  console.log("\n" + "=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Facade provides a simplified interface to complex subsystems");
  console.log("- Client code doesn't need to know about subsystem details");
  console.log("- Facade coordinates multiple subsystems to perform tasks");
  console.log("- Original subsystems remain accessible for advanced users");
  console.log("- Makes common operations simple while keeping flexibility");
  console.log("=".repeat(60));
}

main();


/**
 * FACADE PATTERN
 *
 * Intent: Provide a unified interface to a set of interfaces in a subsystem.
 * Facade defines a higher-level interface that makes the subsystem easier to use.
 *
 * Real-world example: Smart Home System
 * - A smart home has many subsystems (lights, thermostat, security, entertainment)
 * - Each subsystem has its own complex API
 * - The facade provides simple methods like "goodMorning()" or "movieMode()"
 * - Users don't need to interact with each subsystem individually
 */

/**
 * Subsystem 1 - Lighting System
 */
export class LightingSystem {
  private lights: Map<string, { on: boolean; brightness: number; color: string }> = new Map();

  constructor() {
    // Initialize default lights
    this.lights.set("living_room", { on: false, brightness: 0, color: "warm_white" });
    this.lights.set("bedroom", { on: false, brightness: 0, color: "warm_white" });
    this.lights.set("kitchen", { on: false, brightness: 0, color: "cool_white" });
    this.lights.set("bathroom", { on: false, brightness: 0, color: "daylight" });
    this.lights.set("porch", { on: false, brightness: 0, color: "warm_white" });
  }

  turnOn(room: string): void {
    const light = this.lights.get(room);
    if (light) {
      light.on = true;
      light.brightness = 100;
      console.log(`  💡 [Lighting] ${room} light ON (100%)`);
    }
  }

  turnOff(room: string): void {
    const light = this.lights.get(room);
    if (light) {
      light.on = false;
      light.brightness = 0;
      console.log(`  💡 [Lighting] ${room} light OFF`);
    }
  }

  dim(room: string, level: number): void {
    const light = this.lights.get(room);
    if (light) {
      light.on = level > 0;
      light.brightness = level;
      console.log(`  💡 [Lighting] ${room} dimmed to ${level}%`);
    }
  }

  setColor(room: string, color: string): void {
    const light = this.lights.get(room);
    if (light) {
      light.color = color;
      console.log(`  💡 [Lighting] ${room} color set to ${color}`);
    }
  }

  turnAllOff(): void {
    this.lights.forEach((light, room) => {
      light.on = false;
      light.brightness = 0;
    });
    console.log(`  💡 [Lighting] All lights OFF`);
  }

  turnAllOn(): void {
    this.lights.forEach((light, room) => {
      light.on = true;
      light.brightness = 100;
    });
    console.log(`  💡 [Lighting] All lights ON`);
  }
}

/**
 * Subsystem 2 - Thermostat System
 */
export class ThermostatSystem {
  private temperature: number = 68;
  private mode: "heat" | "cool" | "auto" | "off" = "auto";
  private fanSpeed: "low" | "medium" | "high" | "auto" = "auto";

  setTemperature(temp: number): void {
    this.temperature = temp;
    console.log(`  🌡️ [Thermostat] Temperature set to ${temp}°F`);
  }

  setMode(mode: "heat" | "cool" | "auto" | "off"): void {
    this.mode = mode;
    console.log(`  🌡️ [Thermostat] Mode set to ${mode.toUpperCase()}`);
  }

  setFanSpeed(speed: "low" | "medium" | "high" | "auto"): void {
    this.fanSpeed = speed;
    console.log(`  🌡️ [Thermostat] Fan speed set to ${speed}`);
  }

  getTemperature(): number {
    return this.temperature;
  }

  turnOff(): void {
    this.mode = "off";
    console.log(`  🌡️ [Thermostat] System OFF`);
  }
}

/**
 * Subsystem 3 - Security System
 */
export class SecuritySystem {
  private armed: boolean = false;
  private mode: "away" | "home" | "night" | "off" = "off";
  private cameras: Map<string, boolean> = new Map();

  constructor() {
    this.cameras.set("front_door", false);
    this.cameras.set("back_door", false);
    this.cameras.set("garage", false);
    this.cameras.set("living_room", false);
  }

  arm(mode: "away" | "home" | "night"): void {
    this.armed = true;
    this.mode = mode;
    console.log(`  🔒 [Security] System ARMED (${mode} mode)`);
  }

  disarm(): void {
    this.armed = false;
    this.mode = "off";
    console.log(`  🔓 [Security] System DISARMED`);
  }

  enableCamera(location: string): void {
    if (this.cameras.has(location)) {
      this.cameras.set(location, true);
      console.log(`  📹 [Security] ${location} camera ENABLED`);
    }
  }

  disableCamera(location: string): void {
    if (this.cameras.has(location)) {
      this.cameras.set(location, false);
      console.log(`  📹 [Security] ${location} camera DISABLED`);
    }
  }

  enableAllCameras(): void {
    this.cameras.forEach((_, location) => this.cameras.set(location, true));
    console.log(`  📹 [Security] All cameras ENABLED`);
  }

  disableAllCameras(): void {
    this.cameras.forEach((_, location) => this.cameras.set(location, false));
    console.log(`  📹 [Security] All cameras DISABLED`);
  }

  lockDoors(): void {
    console.log(`  🚪 [Security] All doors LOCKED`);
  }

  unlockDoors(): void {
    console.log(`  🚪 [Security] All doors UNLOCKED`);
  }

  isArmed(): boolean {
    return this.armed;
  }
}

/**
 * Subsystem 4 - Entertainment System
 */
export class EntertainmentSystem {
  private tvOn: boolean = false;
  private soundbarOn: boolean = false;
  private streamingService: string | null = null;
  private volume: number = 30;
  private currentInput: string = "HDMI1";

  turnOnTV(): void {
    this.tvOn = true;
    console.log(`  📺 [Entertainment] TV ON`);
  }

  turnOffTV(): void {
    this.tvOn = false;
    console.log(`  📺 [Entertainment] TV OFF`);
  }

  turnOnSoundbar(): void {
    this.soundbarOn = true;
    console.log(`  🔊 [Entertainment] Soundbar ON`);
  }

  turnOffSoundbar(): void {
    this.soundbarOn = false;
    console.log(`  🔊 [Entertainment] Soundbar OFF`);
  }

  setInput(input: string): void {
    this.currentInput = input;
    console.log(`  📺 [Entertainment] Input set to ${input}`);
  }

  setVolume(level: number): void {
    this.volume = level;
    console.log(`  🔊 [Entertainment] Volume set to ${level}%`);
  }

  openStreamingApp(service: string): void {
    this.streamingService = service;
    console.log(`  📺 [Entertainment] Opened ${service}`);
  }

  closeAllApps(): void {
    this.streamingService = null;
    console.log(`  📺 [Entertainment] Closed all apps`);
  }
}

/**
 * Subsystem 5 - Window Blinds System
 */
export class BlindsSystem {
  private blinds: Map<string, number> = new Map();

  constructor() {
    this.blinds.set("living_room", 100); // 100 = fully open, 0 = closed
    this.blinds.set("bedroom", 0);
    this.blinds.set("kitchen", 100);
  }

  open(room: string): void {
    this.blinds.set(room, 100);
    console.log(`  🪟 [Blinds] ${room} blinds OPEN`);
  }

  close(room: string): void {
    this.blinds.set(room, 0);
    console.log(`  🪟 [Blinds] ${room} blinds CLOSED`);
  }

  setPosition(room: string, position: number): void {
    this.blinds.set(room, position);
    console.log(`  🪟 [Blinds] ${room} blinds at ${position}%`);
  }

  openAll(): void {
    this.blinds.forEach((_, room) => this.blinds.set(room, 100));
    console.log(`  🪟 [Blinds] All blinds OPEN`);
  }

  closeAll(): void {
    this.blinds.forEach((_, room) => this.blinds.set(room, 0));
    console.log(`  🪟 [Blinds] All blinds CLOSED`);
  }
}

/**
 * FACADE - Smart Home Controller
 * Provides simple, high-level methods to control the complex subsystems
 */
export class SmartHomeFacade {
  private lighting: LightingSystem;
  private thermostat: ThermostatSystem;
  private security: SecuritySystem;
  private entertainment: EntertainmentSystem;
  private blinds: BlindsSystem;

  constructor(
    lighting: LightingSystem,
    thermostat: ThermostatSystem,
    security: SecuritySystem,
    entertainment: EntertainmentSystem,
    blinds: BlindsSystem
  ) {
    this.lighting = lighting;
    this.thermostat = thermostat;
    this.security = security;
    this.entertainment = entertainment;
    this.blinds = blinds;
  }

  /**
   * Good Morning routine
   * - Gradually turn on lights
   * - Open blinds
   * - Set comfortable temperature
   * - Disarm security
   */
  goodMorning(): void {
    console.log("\n🌅 GOOD MORNING ROUTINE");
    console.log("-".repeat(40));
    this.security.disarm();
    this.blinds.openAll();
    this.lighting.dim("bedroom", 30);
    this.lighting.turnOn("kitchen");
    this.thermostat.setTemperature(72);
    this.thermostat.setMode("auto");
  }

  /**
   * Leaving Home routine
   * - Turn off all lights
   * - Adjust thermostat for energy savings
   * - Arm security system
   * - Enable cameras
   * - Lock doors
   */
  leavingHome(): void {
    console.log("\n🚗 LEAVING HOME ROUTINE");
    console.log("-".repeat(40));
    this.lighting.turnAllOff();
    this.entertainment.turnOffTV();
    this.entertainment.turnOffSoundbar();
    this.thermostat.setTemperature(65);
    this.thermostat.setMode("auto");
    this.blinds.closeAll();
    this.security.lockDoors();
    this.security.enableAllCameras();
    this.security.arm("away");
  }

  /**
   * Arriving Home routine
   * - Disarm security
   * - Turn on lights
   * - Set comfortable temperature
   * - Unlock doors
   */
  arrivingHome(): void {
    console.log("\n🏠 ARRIVING HOME ROUTINE");
    console.log("-".repeat(40));
    this.security.disarm();
    this.security.unlockDoors();
    this.lighting.turnOn("living_room");
    this.lighting.turnOn("kitchen");
    this.thermostat.setTemperature(72);
    this.blinds.openAll();
  }

  /**
   * Movie Mode
   * - Dim living room lights
   * - Close blinds
   * - Turn on TV and soundbar
   * - Set up Netflix
   */
  movieMode(): void {
    console.log("\n🎬 MOVIE MODE");
    console.log("-".repeat(40));
    this.lighting.dim("living_room", 10);
    this.lighting.setColor("living_room", "warm_amber");
    this.blinds.close("living_room");
    this.entertainment.turnOnTV();
    this.entertainment.turnOnSoundbar();
    this.entertainment.setInput("HDMI1");
    this.entertainment.setVolume(50);
    this.entertainment.openStreamingApp("Netflix");
  }

  /**
   * Good Night routine
   * - Turn off all entertainment
   * - Turn off all lights
   * - Lock doors
   * - Arm security in night mode
   * - Set sleeping temperature
   */
  goodNight(): void {
    console.log("\n🌙 GOOD NIGHT ROUTINE");
    console.log("-".repeat(40));
    this.entertainment.turnOffTV();
    this.entertainment.turnOffSoundbar();
    this.lighting.turnAllOff();
    this.blinds.closeAll();
    this.thermostat.setTemperature(68);
    this.thermostat.setFanSpeed("low");
    this.security.lockDoors();
    this.security.arm("night");
  }

  /**
   * Party Mode
   * - Turn on all lights with colors
   * - Set entertainment system for music
   * - Adjust thermostat
   */
  partyMode(): void {
    console.log("\n🎉 PARTY MODE");
    console.log("-".repeat(40));
    this.lighting.turnOn("living_room");
    this.lighting.setColor("living_room", "party_mix");
    this.lighting.turnOn("kitchen");
    this.lighting.dim("bedroom", 0);
    this.entertainment.turnOnSoundbar();
    this.entertainment.setVolume(70);
    this.entertainment.openStreamingApp("Spotify");
    this.thermostat.setTemperature(70);
    this.thermostat.setFanSpeed("high");
  }

  /**
   * Emergency/Panic Mode
   * - Turn on all lights
   * - Arm security
   * - Enable all cameras
   * - Lock all doors
   */
  panicMode(): void {
    console.log("\n🚨 PANIC MODE");
    console.log("-".repeat(40));
    this.lighting.turnAllOn();
    this.security.lockDoors();
    this.security.enableAllCameras();
    this.security.arm("away");
  }
}


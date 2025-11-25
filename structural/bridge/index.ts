/**
 * BRIDGE PATTERN
 *
 * Intent: Decouple an abstraction from its implementation so that the two can
 * vary independently.
 *
 * Real-world example: Remote Controls and Devices
 * - Different remote controls (basic, advanced, voice-controlled)
 * - Different devices (TV, Radio, Smart Speaker, Streaming Box)
 * - Any remote can control any device
 * - Adding new remotes doesn't affect devices and vice versa
 */

/**
 * Implementation Interface - Device
 * This is the "implementation" side of the bridge
 */
export interface Device {
  getName(): string;
  isEnabled(): boolean;
  enable(): void;
  disable(): void;
  getVolume(): number;
  setVolume(volume: number): void;
  getChannel(): number;
  setChannel(channel: number): void;
  getMaxChannel(): number;
  printStatus(): void;
}

/**
 * Concrete Implementation - Television
 */
export class Television implements Device {
  private name: string;
  private on: boolean = false;
  private volume: number = 30;
  private channel: number = 1;
  private readonly maxChannel: number = 500;

  constructor(name: string = "Living Room TV") {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  isEnabled(): boolean {
    return this.on;
  }

  enable(): void {
    this.on = true;
    console.log(`  [TV] 📺 ${this.name} is now ON`);
  }

  disable(): void {
    this.on = false;
    console.log(`  [TV] 📺 ${this.name} is now OFF`);
  }

  getVolume(): number {
    return this.volume;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(100, volume));
    console.log(`  [TV] 🔊 Volume set to ${this.volume}`);
  }

  getChannel(): number {
    return this.channel;
  }

  setChannel(channel: number): void {
    if (channel >= 1 && channel <= this.maxChannel) {
      this.channel = channel;
      console.log(`  [TV] 📡 Channel set to ${this.channel}`);
    }
  }

  getMaxChannel(): number {
    return this.maxChannel;
  }

  printStatus(): void {
    console.log(`  [TV] ${this.name}: ${this.on ? "ON" : "OFF"} | Vol: ${this.volume} | Ch: ${this.channel}`);
  }
}

/**
 * Concrete Implementation - Radio
 */
export class Radio implements Device {
  private name: string;
  private on: boolean = false;
  private volume: number = 20;
  private frequency: number = 88; // FM frequency (88-108 MHz)
  private readonly maxFrequency: number = 108;

  constructor(name: string = "Kitchen Radio") {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  isEnabled(): boolean {
    return this.on;
  }

  enable(): void {
    this.on = true;
    console.log(`  [Radio] 📻 ${this.name} is now ON`);
  }

  disable(): void {
    this.on = false;
    console.log(`  [Radio] 📻 ${this.name} is now OFF`);
  }

  getVolume(): number {
    return this.volume;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(100, volume));
    console.log(`  [Radio] 🔊 Volume set to ${this.volume}`);
  }

  getChannel(): number {
    return this.frequency;
  }

  setChannel(frequency: number): void {
    if (frequency >= 88 && frequency <= this.maxFrequency) {
      this.frequency = frequency;
      console.log(`  [Radio] 📡 Tuned to ${this.frequency.toFixed(1)} FM`);
    }
  }

  getMaxChannel(): number {
    return this.maxFrequency;
  }

  printStatus(): void {
    console.log(`  [Radio] ${this.name}: ${this.on ? "ON" : "OFF"} | Vol: ${this.volume} | ${this.frequency.toFixed(1)} FM`);
  }
}

/**
 * Concrete Implementation - Smart Speaker
 */
export class SmartSpeaker implements Device {
  private name: string;
  private on: boolean = false;
  private volume: number = 50;
  private playlist: number = 1;
  private readonly maxPlaylists: number = 20;

  constructor(name: string = "Office Speaker") {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  isEnabled(): boolean {
    return this.on;
  }

  enable(): void {
    this.on = true;
    console.log(`  [Speaker] 🔈 ${this.name} is now ON`);
  }

  disable(): void {
    this.on = false;
    console.log(`  [Speaker] 🔈 ${this.name} is now OFF`);
  }

  getVolume(): number {
    return this.volume;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(100, volume));
    console.log(`  [Speaker] 🔊 Volume set to ${this.volume}`);
  }

  getChannel(): number {
    return this.playlist;
  }

  setChannel(playlist: number): void {
    if (playlist >= 1 && playlist <= this.maxPlaylists) {
      this.playlist = playlist;
      console.log(`  [Speaker] 🎵 Playing playlist #${this.playlist}`);
    }
  }

  getMaxChannel(): number {
    return this.maxPlaylists;
  }

  printStatus(): void {
    console.log(`  [Speaker] ${this.name}: ${this.on ? "ON" : "OFF"} | Vol: ${this.volume} | Playlist: ${this.playlist}`);
  }
}

/**
 * Concrete Implementation - Streaming Box
 */
export class StreamingBox implements Device {
  private name: string;
  private on: boolean = false;
  private volume: number = 40;
  private app: number = 1; // 1=Netflix, 2=YouTube, 3=Prime, etc.
  private readonly maxApps: number = 10;
  private readonly appNames: string[] = [
    "",
    "Netflix",
    "YouTube",
    "Prime Video",
    "Disney+",
    "HBO Max",
    "Hulu",
    "Apple TV+",
    "Peacock",
    "Paramount+",
    "Spotify",
  ];

  constructor(name: string = "Streaming Box") {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  isEnabled(): boolean {
    return this.on;
  }

  enable(): void {
    this.on = true;
    console.log(`  [StreamBox] 🎬 ${this.name} is now ON`);
  }

  disable(): void {
    this.on = false;
    console.log(`  [StreamBox] 🎬 ${this.name} is now OFF`);
  }

  getVolume(): number {
    return this.volume;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(100, volume));
    console.log(`  [StreamBox] 🔊 Volume set to ${this.volume}`);
  }

  getChannel(): number {
    return this.app;
  }

  setChannel(app: number): void {
    if (app >= 1 && app <= this.maxApps) {
      this.app = app;
      console.log(`  [StreamBox] 📱 Launching ${this.appNames[this.app]}`);
    }
  }

  getMaxChannel(): number {
    return this.maxApps;
  }

  getAppName(): string {
    return this.appNames[this.app];
  }

  printStatus(): void {
    console.log(`  [StreamBox] ${this.name}: ${this.on ? "ON" : "OFF"} | Vol: ${this.volume} | App: ${this.appNames[this.app]}`);
  }
}

/**
 * Abstraction - Remote Control
 * This is the "abstraction" side of the bridge
 */
export class RemoteControl {
  protected device: Device;

  constructor(device: Device) {
    this.device = device;
    console.log(`  [Remote] Paired with ${device.getName()}`);
  }

  togglePower(): void {
    console.log(`  [Remote] Power button pressed`);
    if (this.device.isEnabled()) {
      this.device.disable();
    } else {
      this.device.enable();
    }
  }

  volumeUp(): void {
    console.log(`  [Remote] Volume+ pressed`);
    this.device.setVolume(this.device.getVolume() + 10);
  }

  volumeDown(): void {
    console.log(`  [Remote] Volume- pressed`);
    this.device.setVolume(this.device.getVolume() - 10);
  }

  channelUp(): void {
    console.log(`  [Remote] Channel+ pressed`);
    const next = this.device.getChannel() + 1;
    if (next <= this.device.getMaxChannel()) {
      this.device.setChannel(next);
    }
  }

  channelDown(): void {
    console.log(`  [Remote] Channel- pressed`);
    const prev = this.device.getChannel() - 1;
    if (prev >= 1) {
      this.device.setChannel(prev);
    }
  }

  getDevice(): Device {
    return this.device;
  }
}

/**
 * Refined Abstraction - Advanced Remote
 * Adds extra features on top of basic remote
 */
export class AdvancedRemote extends RemoteControl {
  constructor(device: Device) {
    super(device);
  }

  mute(): void {
    console.log(`  [AdvRemote] Mute pressed`);
    this.device.setVolume(0);
  }

  setVolume(level: number): void {
    console.log(`  [AdvRemote] Setting volume to ${level}`);
    this.device.setVolume(level);
  }

  goToChannel(channel: number): void {
    console.log(`  [AdvRemote] Go to channel ${channel}`);
    this.device.setChannel(channel);
  }

  showDeviceInfo(): void {
    console.log(`  [AdvRemote] Showing device info:`);
    this.device.printStatus();
  }
}

/**
 * Refined Abstraction - Voice Remote
 * Simulates voice-controlled remote
 */
export class VoiceRemote extends AdvancedRemote {
  private voiceEnabled: boolean = true;

  constructor(device: Device) {
    super(device);
    console.log(`  [VoiceRemote] Voice control enabled`);
  }

  voiceCommand(command: string): void {
    if (!this.voiceEnabled) {
      console.log(`  [VoiceRemote] Voice control is disabled`);
      return;
    }

    console.log(`  [VoiceRemote] 🎤 Voice command: "${command}"`);

    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes("turn on") || lowerCommand.includes("power on")) {
      if (!this.device.isEnabled()) this.togglePower();
    } else if (lowerCommand.includes("turn off") || lowerCommand.includes("power off")) {
      if (this.device.isEnabled()) this.togglePower();
    } else if (lowerCommand.includes("volume up") || lowerCommand.includes("louder")) {
      this.volumeUp();
    } else if (lowerCommand.includes("volume down") || lowerCommand.includes("quieter")) {
      this.volumeDown();
    } else if (lowerCommand.includes("mute")) {
      this.mute();
    } else if (lowerCommand.includes("channel")) {
      const match = command.match(/channel (\d+)/i);
      if (match) {
        this.goToChannel(parseInt(match[1]));
      }
    } else if (lowerCommand.includes("status") || lowerCommand.includes("info")) {
      this.showDeviceInfo();
    } else {
      console.log(`  [VoiceRemote] Sorry, I didn't understand that command`);
    }
  }

  toggleVoice(): void {
    this.voiceEnabled = !this.voiceEnabled;
    console.log(`  [VoiceRemote] Voice control ${this.voiceEnabled ? "enabled" : "disabled"}`);
  }
}

/**
 * Helper to create device-remote combinations
 */
export function createRemoteForDevice(
  remoteType: "basic" | "advanced" | "voice",
  device: Device
): RemoteControl {
  switch (remoteType) {
    case "basic":
      return new RemoteControl(device);
    case "advanced":
      return new AdvancedRemote(device);
    case "voice":
      return new VoiceRemote(device);
  }
}

/**
 * Format all device statuses
 */
export function printAllDevices(devices: Device[]): void {
  console.log(`\n  📱 All Devices Status:`);
  console.log(`  ${"─".repeat(50)}`);
  devices.forEach((d) => d.printStatus());
}


/**
 * BRIDGE PATTERN - Example
 *
 * Demonstrates remote controls and devices using the Bridge pattern.
 */

import {
  Television,
  Radio,
  SmartSpeaker,
  StreamingBox,
  RemoteControl,
  AdvancedRemote,
  VoiceRemote,
  printAllDevices,
  Device,
} from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("BRIDGE PATTERN - Remote Controls & Devices");
  console.log("=".repeat(60));
  console.log();

  // Create various devices
  console.log("1. Creating devices...");
  const tv = new Television("Living Room TV");
  const radio = new Radio("Kitchen Radio");
  const speaker = new SmartSpeaker("Office Speaker");
  const streamBox = new StreamingBox("Bedroom Streamer");
  console.log();

  // Basic Remote with TV
  console.log("2. BASIC REMOTE with Television");
  console.log("-".repeat(40));
  const basicRemote = new RemoteControl(tv);
  console.log();

  basicRemote.togglePower();
  basicRemote.volumeUp();
  basicRemote.volumeUp();
  basicRemote.channelUp();
  basicRemote.channelUp();
  basicRemote.channelUp();
  console.log();

  // Advanced Remote with Radio
  console.log("3. ADVANCED REMOTE with Radio");
  console.log("-".repeat(40));
  const advancedRemote = new AdvancedRemote(radio);
  console.log();

  advancedRemote.togglePower();
  advancedRemote.setVolume(75);
  advancedRemote.goToChannel(95); // 95.0 FM
  advancedRemote.showDeviceInfo();
  console.log();

  // Voice Remote with Smart Speaker
  console.log("4. VOICE REMOTE with Smart Speaker");
  console.log("-".repeat(40));
  const voiceRemote = new VoiceRemote(speaker);
  console.log();

  voiceRemote.voiceCommand("Turn on");
  voiceRemote.voiceCommand("Volume up");
  voiceRemote.voiceCommand("Volume up");
  voiceRemote.voiceCommand("Channel 5");
  voiceRemote.voiceCommand("What's the status?");
  console.log();

  // Voice Remote with Streaming Box
  console.log("5. VOICE REMOTE with Streaming Box");
  console.log("-".repeat(40));
  const streamRemote = new VoiceRemote(streamBox);
  console.log();

  streamRemote.voiceCommand("Power on");
  streamRemote.voiceCommand("Channel 2"); // YouTube
  streamRemote.voiceCommand("Louder");
  streamRemote.voiceCommand("Status");
  console.log();

  // Demonstrate bridge independence
  console.log("6. BRIDGE INDEPENDENCE - Same remote, different devices");
  console.log("-".repeat(40));
  console.log();

  const devices: Device[] = [
    new Television("TV 1"),
    new Radio("Radio 1"),
    new SmartSpeaker("Speaker 1"),
  ];

  console.log("   Using the same remote control class on different devices:");
  console.log();

  devices.forEach((device, i) => {
    console.log(`   --- Device ${i + 1}: ${device.getName()} ---`);
    const remote = new RemoteControl(device);
    remote.togglePower();
    remote.volumeUp();
    console.log();
  });

  // Show all device statuses
  console.log("7. ALL DEVICE STATUS");
  printAllDevices([tv, radio, speaker, streamBox]);
  console.log();

  // Demonstrate switching remotes for same device
  console.log("8. SWITCHING REMOTES for same device");
  console.log("-".repeat(40));
  console.log();

  const bedroom = new Television("Bedroom TV");
  console.log("   Same TV, different remotes:");
  console.log();

  const basic = new RemoteControl(bedroom);
  basic.togglePower();
  console.log();

  const advanced = new AdvancedRemote(bedroom);
  advanced.goToChannel(42);
  advanced.setVolume(60);
  console.log();

  const voice = new VoiceRemote(bedroom);
  voice.voiceCommand("Mute");
  console.log();

  bedroom.printStatus();
  console.log();

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Abstraction (Remote) and Implementation (Device) vary independently");
  console.log("- Any remote type can work with any device type");
  console.log("- Adding a new device doesn't require changing any remote");
  console.log("- Adding a new remote doesn't require changing any device");
  console.log("- The bridge (device reference) connects the two hierarchies");
  console.log("- Refined abstractions add features without affecting implementations");
  console.log("=".repeat(60));
}

main();


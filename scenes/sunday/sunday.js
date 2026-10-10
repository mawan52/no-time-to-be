import sceneManager from "../../src/core/sceneManager";
import audioEngine from "../../src/core/audio";
import effectsEngine from "../../src/core/effects";
import evasiveManager from "../../src/core/evasiveButtons";
import flyingEngine from "../../src/core/flyingElements";
import notificationEngine from "../../src/core/notifications";

export function enter() {
  audioEngine.setAmbientLevel(0.95);
  effectsEngine.setAnxietyLevel(0.95);
  audioEngine.startHeartbeatLoop(850);

  // Start continuous ambient screen tremor for Sunday
  effectsEngine.startConstantShake();
}

export function startSundayOverdrive() {
  audioEngine.playStinger();
  effectsEngine.triggerShake(500, 10);

  // Fill stress bar to max
  const stressBar = document.querySelector(".sunday-stress-bar");
  if (stressBar) {
    stressBar.style.width = "100%";
    stressBar.style.background = "linear-gradient(90deg, #ff3b30, #ff0055)";
  }

  // Relentless hostile notification storm
  notificationEngine.startStorm(2.8, true);

  // Spawn flying evasive buttons across the window
  flyingEngine.spawnFlyingButton("REST 🛌", "rest");
  flyingEngine.spawnFlyingButton("SLEEP 💤", "sleep");
  flyingEngine.spawnFlyingButton("PAUSE LIFE ⏸️", "pause");

  // Nightmare level evasive task buttons
  const buttons = document.querySelectorAll(".evasive-sunday");
  buttons.forEach((btn) => {
    evasiveManager.attach(btn, { difficulty: 3, threshold: 160, speed: 1.8 });
  });
}

export function onSundayTaskClick(element) {
  audioEngine.playStinger();
  effectsEngine.triggerShake(200, 6);

  const demotivatingAttacks = [
    "FAILURE IMMINENT",
    "TOO LATE TO STUDY",
    "THEY ARE AHEAD",
    "DISAPPOINTMENT",
    "YOU FAILED THEM",
  ];

  if (element) {
    const txt = demotivatingAttacks[Math.floor(Math.random() * demotivatingAttacks.length)];
    element.textContent = effectsEngine.corruptText(txt, 0.7);
  }

  flyingEngine.spawnFlyingButton("NO REST FOR YOU", "attack");
}

export function nextScene() {
  sceneManager.loadScene("monday");
}

export function exit() {
  effectsEngine.stopConstantShake();
  audioEngine.stopHeartbeatLoop();
  notificationEngine.stopStorm();
  flyingEngine.clear();
}

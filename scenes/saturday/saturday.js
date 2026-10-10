import sceneManager from "../../src/core/sceneManager";
import audioEngine from "../../src/core/audio";
import effectsEngine from "../../src/core/effects";
import evasiveManager from "../../src/core/evasiveButtons";
import flyingEngine from "../../src/core/flyingElements";
import notificationEngine from "../../src/core/notifications";

let taskClicks = 0;

export function enter() {
  taskClicks = 0;
  audioEngine.setAmbientLevel(0.65);
  effectsEngine.setAnxietyLevel(0.65);
}

export function startSaturdayChaos() {
  audioEngine.playStinger();
  effectsEngine.triggerShake(300, 6);

  // Fill stress bar
  const stressBar = document.querySelector(".saturday-stress-bar");
  if (stressBar) {
    stressBar.style.width = "75%";
  }

  // Start hostile notification storm
  notificationEngine.startStorm(1.5, true);

  // Spawn flying REST and PAUSE buttons that dodge the player!
  flyingEngine.spawnFlyingButton("REST 🛌", "rest");
  flyingEngine.spawnFlyingButton("TAKE A BREAK ☕", "pause");

  // Attach evasive dodge mechanics to all saturday buttons
  const buttons = document.querySelectorAll(".evasive-saturday");
  buttons.forEach((btn) => {
    evasiveManager.attach(btn, { difficulty: 2, threshold: 130, speed: 1.4 });
  });
}

export function onTaskClick(element) {
  taskClicks++;
  audioEngine.playGlitch(0.4);
  effectsEngine.triggerShake(150, 4);

  // Update button text to demotivating message
  const demotivations = [
    "OTHERS ARE AHEAD OF YOU",
    "STILL TOO SLOW",
    "NOT GOOD ENOUGH",
    "FAILING BEHIND",
    "NO TIME TO BE",
  ];
  if (element) {
    const text = demotivations[Math.floor(Math.random() * demotivations.length)];
    element.textContent = effectsEngine.corruptText(text, 0.5);
  }

  // Spawn flying button on every 2 clicks
  if (taskClicks % 2 === 0) {
    flyingEngine.spawnFlyingButton("SLEEP 💤", "sleep");
  }

  // Trigger hostile popup
  notificationEngine.spawnCustomPopup({
    appName: "Inner Voice",
    icon: "👁️",
    title: "Comparison Warning",
    body: "Your peers finished 3 hours ago. You're struggling.",
    type: "urgent",
    shake: true,
  });
}

export function nextScene() {
  sceneManager.loadScene("sunday");
}

export function exit() {
  notificationEngine.stopStorm();
  flyingEngine.clear();
}

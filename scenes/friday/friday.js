import notyf from "../../src/notyf";
import sceneManager from "../../src/core/sceneManager";
import audioEngine from "../../src/core/audio";
import effectsEngine from "../../src/core/effects";
import evasiveManager from "../../src/core/evasiveButtons";
import notificationEngine from "../../src/core/notifications";

export function enter() {
  audioEngine.setAmbientLevel(0.4);
  effectsEngine.setAnxietyLevel(0.4);
}

export function onTaskClick() {
  if (Math.random() < 0.3) {
    audioEngine.playGlitch(0.2);
  }
}

export function ahmedInterrupts() {
  audioEngine.playStinger();
  effectsEngine.triggerShake(200, 4);

  notificationEngine.spawnCustomPopup({
    appName: "Ahmed",
    icon: "💬",
    title: "HELP URGENT!",
    body: "Yo bro could you help me out real quick? I can't understand problem 7!",
    type: "urgent",
    shake: true,
  });

  // Make "Ignore and sleep" button dodge cursor!
  const ignoreBtn = document.querySelector(".evasive-btn-mild");
  if (ignoreBtn) {
    evasiveManager.attach(ignoreBtn, { difficulty: 1, speed: 1.2 });
  }
}

export function acceptAhmed() {
  audioEngine.playPing(600, 0.1, "sawtooth");
}

export function nextScene() {
  sceneManager.loadScene("saturday_messages");
}

export function exit() {
}

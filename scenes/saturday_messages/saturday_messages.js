import sceneManager from "../../src/core/sceneManager";
import audioEngine from "../../src/core/audio";
import effectsEngine from "../../src/core/effects";
import notificationEngine from "../../src/core/notifications";

export function enter() {
  audioEngine.setAmbientLevel(0.5);
  effectsEngine.setAnxietyLevel(0.5);
}

export function startMessageNotifications() {
  audioEngine.playStinger();
  effectsEngine.triggerShake(200, 4);

  // Start simultaneous notification storm while user reads demotivating messages
  notificationEngine.startStorm(1.4, true);
}

export function nextScene() {
  sceneManager.loadScene("saturday");
}

export function exit() {
  notificationEngine.stopStorm();
}

import sceneManager from "../../src/core/sceneManager";
import audioEngine from "../../src/core/audio";
import effectsEngine from "../../src/core/effects";

let heartbeatDemoActive = false;

export function enter() {
  heartbeatDemoActive = false;
  audioEngine.stopAll();
  audioEngine.setAmbientLevel(0);
  effectsEngine.setAnxietyLevel(0);
}

export function restartExperience() {
  sceneManager.loadScene("wednesday");
}

export function toggleHeartbeatDemo() {
  if (!heartbeatDemoActive) {
    audioEngine.startHeartbeatLoop(700);
    audioEngine.setAmbientLevel(0.7);
    effectsEngine.setAnxietyLevel(0.7);
    heartbeatDemoActive = true;
  } else {
    audioEngine.stopAll();
    audioEngine.setAmbientLevel(0);
    effectsEngine.setAnxietyLevel(0);
    heartbeatDemoActive = false;
  }
}

export function exit() {
  audioEngine.stopAll();
}

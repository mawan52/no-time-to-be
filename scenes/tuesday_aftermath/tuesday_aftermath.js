import sceneManager from "../../src/core/sceneManager";
import audioEngine from "../../src/core/audio";
import effectsEngine from "../../src/core/effects";

export function enter() {
  audioEngine.stopAll();
  audioEngine.setAmbientLevel(0);
  effectsEngine.setAnxietyLevel(0.1);
}

export function nextScene() {
  sceneManager.loadScene("wednesday_boundaries");
}

export function exit() {
}

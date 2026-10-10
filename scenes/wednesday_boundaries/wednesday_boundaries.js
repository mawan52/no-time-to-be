import sceneManager from "../../src/core/sceneManager";
import audioEngine from "../../src/core/audio";
import effectsEngine from "../../src/core/effects";
import notificationEngine from "../../src/core/notifications";

export function enter() {
  audioEngine.stopAll();
  audioEngine.setAmbientLevel(0);
  effectsEngine.setAnxietyLevel(0.1);
}

export function rejectTask(element) {
  audioEngine.playGlassShatter();
  effectsEngine.triggerShake(100, 2);

  const card = element.closest(".boundary-task-card");
  if (card) {
    card.style.transition = "all 0.3s ease";
    card.style.opacity = "0";
    card.style.transform = "scale(0.8) translateY(-10px)";
    setTimeout(() => {
      card.remove();
    }, 300);
  }

  notificationEngine.spawnCustomPopup({
    appName: "Peace of Mind",
    icon: "🌱",
    title: "Boundary Established",
    body: "You reclaimed your focus and mental energy.",
    type: "health",
    duration: 3000,
  });
}

export function nextScene() {
  sceneManager.loadScene("epilogue");
}

export function exit() {
}

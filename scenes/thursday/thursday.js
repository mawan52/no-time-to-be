import sceneManager from "../../src/core/sceneManager";
import audioEngine from "../../src/core/audio";
import effectsEngine from "../../src/core/effects";
import notificationEngine from "../../src/core/notifications";

let jumpRopes = 0;

export function enter() {
  jumpRopes = 0;
  audioEngine.setAmbientLevel(0.2);
  effectsEngine.setAnxietyLevel(0.2);

  setTimeout(() => {
    notificationEngine.spawnCustomPopup({
      appName: "School Portal",
      icon: "📚",
      title: "Assignment Due Tomorrow",
      body: "Don't forget to upload your lab report before 11:59 PM.",
      type: "urgent"
    });
  }, 2000);
}

export function onFocusSlider(element, event) {
  const val = element.value;
  const txt = document.querySelector(".study-focus-txt");
  if (txt) txt.textContent = `${val}%`;

  if (parseInt(val) >= 100) {
    const btn = document.querySelector(".study-complete-btn");
    if (btn) btn.style.display = "inline-block";
    audioEngine.playPing(750, 0.15);
  }
}

export function startNotifications() {
  notificationEngine.spawnCustomPopup({
    appName: "Mom",
    icon: "💬",
    title: "Study check",
    body: "Have you started studying for chemistry yet?",
    type: "social"
  });

  setTimeout(() => {
    notificationEngine.spawnCustomPopup({
      appName: "Screen Time",
      icon: "⏳",
      title: "Weekly Report",
      body: "Your screen time increased by 22% this week.",
      type: "health"
    });
  }, 2500);
}

export function uploadAssignment(element) {
  audioEngine.playPing(850, 0.18);
  if (element) {
    element.textContent = "✅ Uploading... 100%";
    element.disabled = true;
  }
  const btn = document.querySelector(".assignment-complete-btn");
  if (btn) btn.style.display = "inline-block";
}

export function sendReply() {
  audioEngine.playPing(650, 0.15);
  const btn = document.querySelector(".reply-complete-btn");
  if (btn) btn.style.display = "inline-block";
}

export function doJumpRope(element) {
  jumpRopes++;
  audioEngine.playPing(550 + jumpRopes * 40, 0.12);

  const txt = document.querySelector(".exercise-count-txt");
  if (txt) txt.textContent = `${jumpRopes}/4`;

  if (jumpRopes >= 4) {
    if (element) element.disabled = true;
    const btn = document.querySelector(".exercise-complete-btn");
    if (btn) btn.style.display = "inline-block";
  }
}

export function nextScene() {
  sceneManager.loadScene("friday");
}

export function exit() {
}

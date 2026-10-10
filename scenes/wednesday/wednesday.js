import sceneManager from "../../src/core/sceneManager";
import audioEngine from "../../src/core/audio";
import effectsEngine from "../../src/core/effects";

let projectCommits = 0;
let gymReps = 0;

export function enter() {
  projectCommits = 0;
  gymReps = 0;
  audioEngine.setAmbientLevel(0);
  effectsEngine.setAnxietyLevel(0);
}

export function onSchoolSlider(element, event) {
  const val = element.value;
  const txt = document.querySelector(".school-distance-txt");
  if (txt) txt.textContent = `${val}%`;

  if (parseInt(val) >= 100) {
    const btn = document.querySelector(".school-complete-btn");
    if (btn) btn.style.display = "inline-block";
    audioEngine.playPing(700, 0.15);
  }
}

export function submitHomework() {
  const input = document.querySelector(".homework-input");
  const val = input ? input.value.trim() : "";

  if (val === "32" || val.length > 0) {
    audioEngine.playPing(800, 0.15);
    const btn = document.querySelector(".homework-complete-btn");
    if (btn) btn.style.display = "inline-block";
  }
}

export function commitProject(element) {
  projectCommits++;
  audioEngine.playPing(600 + projectCommits * 100, 0.12);

  if (element) {
    element.textContent = `git commit -m "feat" (${projectCommits}/3)`;
  }

  if (projectCommits >= 3) {
    if (element) element.disabled = true;
    const btn = document.querySelector(".project-complete-btn");
    if (btn) btn.style.display = "inline-block";
  }
}

export function doRep(element) {
  gymReps++;
  audioEngine.playPing(500 + gymReps * 50, 0.12);

  const txt = document.querySelector(".gym-rep-txt");
  if (txt) txt.textContent = `${gymReps}/5`;

  if (gymReps >= 5) {
    if (element) element.disabled = true;
    const btn = document.querySelector(".gym-complete-btn");
    if (btn) btn.style.display = "inline-block";
  }
}

export function nextScene() {
  sceneManager.loadScene("thursday");
}

export function exit() {
}

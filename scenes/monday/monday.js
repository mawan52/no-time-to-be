import sceneManager from "../../src/core/sceneManager";
import audioEngine from "../../src/core/audio";
import effectsEngine from "../../src/core/effects";
import flyingEngine from "../../src/core/flyingElements";
import notificationEngine from "../../src/core/notifications";

let alarmClicks = 0;
let heartbeatTimer = null;
let countdownTimer = null;

export function enter() {
  alarmClicks = 0;
  audioEngine.setAmbientLevel(1.0);
  effectsEngine.setAnxietyLevel(1.0);

  // Continuous ambient screen tremor for Monday Alarm
  effectsEngine.startConstantShake();

  // Start fast pounding heartbeat loop immediately for stress
  audioEngine.startHeartbeatLoop(500);

  // Start hostile notification storm immediately
  notificationEngine.startStorm(2.0, true);
}

export function onAlarmClick(element) {
  if (alarmClicks >= 25) return;

  alarmClicks++;

  // Screech chime & screen shake
  audioEngine.playPing(950 + alarmClicks * 20, 0.12, "sawtooth", 0.25);
  effectsEngine.triggerShake(140, 4 + Math.floor(alarmClicks / 4));

  // Teleport / jump button away to a new random location ONLY when clicked!
  if (element && alarmClicks < 25) {
    const offsetX = (Math.random() * 260 - 130);
    const offsetY = (Math.random() * 120 - 60);
    element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
  }

  // Accelerate heartbeat loop faster with each click
  const newRate = Math.max(160, 500 - alarmClicks * 13);
  audioEngine.startHeartbeatLoop(newRate);

  // Update progress bar
  const progressBar = document.querySelector(".alarm-progress-bar");
  if (progressBar) {
    progressBar.style.width = `${(alarmClicks / 25) * 100}%`;
  }

  // Button label updates
  if (element) {
    if (alarmClicks < 7) {
      element.textContent = `⏰ SNOOZE ALARM (${alarmClicks}/25)`;
    } else if (alarmClicks < 14) {
      element.textContent = `⏰ WAKE UP! (${alarmClicks}/25)`;
    } else if (alarmClicks < 21) {
      element.textContent = `⏰ LATE FOR MIDTERM! (${alarmClicks}/25)`;
    } else if (alarmClicks < 25) {
      element.textContent = `⏰ CAN'T STOP IT! (${alarmClicks}/25)`;
    }
  }

  // Spawn flying buttons on click milestones
  if (alarmClicks === 5) flyingEngine.spawnFlyingButton("REST 🛌", "rest");
  if (alarmClicks === 12) flyingEngine.spawnFlyingButton("SLEEP 💤", "sleep");
  if (alarmClicks === 18) flyingEngine.spawnFlyingButton("PANIC 😱", "attack");
  if (alarmClicks === 22) flyingEngine.spawnFlyingButton("ESCAPE 🚪", "escape");

  // Trigger 5-second breakdown countdown when 25 clicks reached
  if (alarmClicks >= 25) {
    element.disabled = true;
    element.style.opacity = "0.7";
    element.style.transform = "none";

    audioEngine.playStinger();
    effectsEngine.triggerShake(500, 10);

    let secondsLeft = 5;
    element.textContent = `🔕 ALARM SILENCED. Breakdown in ${secondsLeft}s...`;

    countdownTimer = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        element.textContent = `🔕 ALARM SILENCED. Breakdown in ${secondsLeft}s...`;
        effectsEngine.triggerShake(200, 4);
      } else {
        clearInterval(countdownTimer);
        countdownTimer = null;
        element.textContent = `🔕 ALARM SILENCED.`;
        startBreakdownClimax();
      }
    }, 1000);
  }
}

export function startBreakdownClimax() {
  effectsEngine.stopConstantShake();
  audioEngine.playStinger();
  effectsEngine.triggerShake(900, 14);

  // Flatline screech & silence
  audioEngine.stopHeartbeatLoop();
  audioEngine.setAmbientLevel(0);
  notificationEngine.stopStorm();
  flyingEngine.clear();
  effectsEngine.setAnxietyLevel(0.85);

  // Reveal floating task cloud and final climax box
  const stormContainer = document.querySelector(".monday-storm-container");
  if (stormContainer) {
    stormContainer.style.display = "block";
  }

  const climaxText = document.querySelector(".monday-climax-text");
  if (climaxText) {
    climaxText.style.display = "block";
    climaxText.scrollIntoView({ behavior: "smooth" });
  }
}

export function proceedToTuesday() {
  sceneManager.loadScene("tuesday_aftermath");
}

export function restartStory() {
  sceneManager.loadScene("wednesday");
}

export function exit() {
  effectsEngine.stopConstantShake();
  if (heartbeatTimer) clearInterval(heartbeatTimer);
  if (countdownTimer) clearInterval(countdownTimer);
  audioEngine.stopAll();
  notificationEngine.stopStorm();
  flyingEngine.clear();
}

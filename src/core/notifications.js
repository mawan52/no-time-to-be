// Dynamic Notification Engine (Notyf + Custom Hostile & Anxious OS Popups)

import notyf from "../notyf";
import audioEngine from "./audio";
import effectsEngine from "./effects";

class NotificationEngine {
  constructor() {
    this.stormInterval = null;
    this.container = null;
  }

  initContainer() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.className = "notification-popup-container";
      document.body.appendChild(this.container);
    }
  }

  // Spawn custom phone / OS style popup toast
  spawnCustomPopup(options = {}) {
    this.initContainer();

    const popup = document.createElement("div");
    popup.className = `custom-toast toast-${options.type || "social"}`;

    const appIcon = options.icon || "🔔";
    const appName = options.appName || "System Alert";
    const title = options.title || "Notification";
    const body = options.body || "";

    popup.innerHTML = `
      <div class="toast-header">
        <span class="toast-icon">${appIcon}</span>
        <span class="toast-app">${appName}</span>
        <span class="toast-time">Just now</span>
      </div>
      <div class="toast-title">${title}</div>
      <div class="toast-body">${body}</div>
    `;

    // Add dismiss button or click action
    popup.addEventListener("click", () => {
      audioEngine.playGlitch(0.4);
      popup.classList.add("toast-dismissed");
      setTimeout(() => popup.remove(), 300);
    });

    this.container.appendChild(popup);

    // Audio chime & subtle screen pulse
    audioEngine.playPing(options.freq || 880, 0.25, "sine", 0.15);
    if (options.shake) {
      effectsEngine.triggerShake(120, 2);
    }

    // Auto cleanup after duration
    setTimeout(() => {
      if (popup.parentElement) {
        popup.classList.add("toast-dismissed");
        setTimeout(() => popup.remove(), 300);
      }
    }, options.duration || 5000);
  }

  // Trigger notification storm (for Saturday / Sunday overload & hostile attack)
  startStorm(density = 1, hostileMode = false) {
    this.stopStorm();

    const regularMessages = [
      { appName: "School Portal", icon: "📚", title: "Assignment Overdue!", body: "Chemistry Lab report was due 10 mins ago.", type: "urgent" },
      { appName: "Instagram", icon: "💬", title: "Sarah sent a photo", body: "Everyone is at the cafe right now. Where are you?", type: "social" },
      { appName: "Mom", icon: "❤️", title: "Did you eat?", body: "Remember to clean your room before bedtime.", type: "personal" },
      { appName: "GitHub", icon: "🐙", title: "Build Failed", body: "Workflow #92 failed on main branch.", type: "project" },
      { appName: "Screen Time", icon: "⏳", title: "Limit Exceeded", body: "You have spent 7h 40m on screen today (+34%).", type: "health" },
      { appName: "Calendar", icon: "📅", title: "Upcoming Event", body: "Math Midterm Exam in 14 hours.", type: "urgent" },
      { appName: "TikTok", icon: "🎵", title: "Trending for you", body: "10 ways teens are optimizing their productivity in 2026", type: "social" },
      { appName: "Duolingo", icon: "🦉", title: "Streak at risk!", body: "Your 142 day streak will be lost in 2 hours!", type: "urgent" },
      { appName: "FitPulse", icon: "❤️", title: "Stress Level: High", body: "Elevated heart rate detected while resting.", type: "health" },
      { appName: "Discord", icon: "💬", title: "Group Study Chat", body: "@everyone Does anyone know the answer to Q4??", type: "social" },
    ];

    const hostileMessages = [
      { appName: "System Inner Voice", icon: "🧠", title: "Falling Behind", body: "Everyone else is studying right now. Why are you staring at the screen?", type: "urgent" },
      { appName: "Peer Tracker", icon: "👁️", title: "Comparison Alert", body: "Alex just completed 4 projects this month. What have you done?", type: "urgent" },
      { appName: "Future Self", icon: "⏳", title: "Opportunity Lost", body: "Your potential is slipping away minute by minute.", type: "urgent" },
      { appName: "Expectation Monitor", icon: "⚠️", title: "Disappointment", body: "Is this really your best effort?", type: "urgent" },
      { appName: "Productivity AI", icon: "📉", title: "Output 14% Below Average", body: "You will never catch up at this pace.", type: "urgent" },
      { appName: "Reminder", icon: "⏰", title: "No Time To Rest", body: "Rest is earned. You haven't earned it.", type: "urgent" },
    ];

    const messages = hostileMode ? [...regularMessages, ...hostileMessages] : regularMessages;
    const intervalMs = Math.max(700, 2600 / density);

    this.stormInterval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];

      if (Math.random() < 0.5) {
        notyf.error(`${msg.appName}: ${msg.title}`);
        audioEngine.playPing(750 + Math.random() * 300, 0.15, "triangle", 0.12);
      } else {
        this.spawnCustomPopup({
          ...msg,
          shake: density > 1.5,
          duration: 6000,
        });
      }
    }, intervalMs);
  }

  stopStorm() {
    if (this.stormInterval) {
      clearInterval(this.stormInterval);
      this.stormInterval = null;
    }
  }

  clearAll() {
    this.stopStorm();
    if (this.container) {
      this.container.innerHTML = "";
    }
  }
}

const notificationEngine = new NotificationEngine();
export default notificationEngine;

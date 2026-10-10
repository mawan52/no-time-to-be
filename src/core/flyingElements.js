// Flying Hostile UI Elements Engine (Flying Rest buttons, erratic physics, cursor repulsion)

import audioEngine from "./audio";
import effectsEngine from "./effects";

class FlyingElementsEngine {
  constructor() {
    this.elements = [];
    this.animFrameId = null;
    this.mouse = { x: -1000, y: -1000 };
    this.isListening = false;
    this.onMouseMove = (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    };
  }

  init() {
    if (!this.isListening) {
      window.addEventListener("mousemove", this.onMouseMove);
      this.isListening = true;
    }
    this.startLoop();
  }

  spawnFlyingButton(label = "REST", type = "rest") {
    this.init();

    const btn = document.createElement("button");
    btn.className = `flying-element flying-${type} cursed-btn`;
    btn.textContent = label;

    // Random initial position
    const padding = 100;
    const x = padding + Math.random() * (window.innerWidth - padding * 2);
    const y = padding + Math.random() * (window.innerHeight - padding * 2);

    btn.style.position = "fixed";
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
    btn.style.zIndex = "9000";
    btn.style.boxShadow = "0 0 25px rgba(255, 30, 60, 0.7)";

    document.body.appendChild(btn);

    const item = {
      element: btn,
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      type,
      label,
      demotivateTextList: [
        "NO REST FOR YOU",
        "REST IS FOR THE SUCCESSFUL",
        "YOU HAVEN'T EARNED THIS",
        "OTHERS ARE WORKING RIGHT NOW",
        "YOU'RE FALLING BEHIND",
        "WORK HARDER",
      ],
    };

    // Click attempt
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      audioEngine.playStinger();
      effectsEngine.triggerShake(300, 8);

      // Repel violently & switch label
      item.vx *= -2.5;
      item.vy *= -2.5;
      const demotivation = item.demotivateTextList[Math.floor(Math.random() * item.demotivateTextList.length)];
      btn.textContent = effectsEngine.corruptText(demotivation, 0.6);
    });

    this.elements.push(item);
  }

  startLoop() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      this.elements.forEach((item) => {
        // Move by velocity
        item.x += item.vx;
        item.y += item.vy;

        // Bounce off screen edges
        const pad = 60;
        if (item.x < pad) { item.x = pad; item.vx *= -1; }
        if (item.x > w - pad - 120) { item.x = w - pad - 120; item.vx *= -1; }
        if (item.y < pad) { item.y = pad; item.vy *= -1; }
        if (item.y > h - pad - 60) { item.y = h - pad - 60; item.vy *= -1; }

        // Cursor repulsion
        const dx = item.x - this.mouse.x;
        const dy = item.y - this.mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 180 && dist > 0) {
          const force = (180 - dist) / 180;
          const angle = Math.atan2(dy, dx);
          item.vx += Math.cos(angle) * force * 3.5;
          item.vy += Math.sin(angle) * force * 3.5;
        }

        // Speed limit & dampening
        const speed = Math.hypot(item.vx, item.vy);
        if (speed > 14) {
          item.vx = (item.vx / speed) * 14;
          item.vy = (item.vy / speed) * 14;
        }

        // Apply position
        item.element.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
      });

      this.animFrameId = requestAnimationFrame(update);
    };

    update();
  }

  clear() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.elements.forEach((item) => {
      if (item.element.parentElement) {
        item.element.remove();
      }
    });
    this.elements = [];
  }
}

const flyingEngine = new FlyingElementsEngine();
export default flyingEngine;

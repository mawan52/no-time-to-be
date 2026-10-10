// Visual Canvas Effects, Glitch System, and Screen Distortion

class EffectsEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animFrameId = null;
    this.anxietyLevel = 0; // 0 (calm) to 1.0 (breakdown)
    this.isGlitching = false;
  }

  init() {
    const container = document.querySelector(".effects");
    if (!container) return;

    // Create background canvas if not exists
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
      this.canvas.className = "effects-canvas";
      container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext("2d");

      window.addEventListener("resize", () => this.resizeCanvas());
      this.resizeCanvas();
    }

    this.startLoop();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setAnxietyLevel(level) {
    this.anxietyLevel = Math.max(0, Math.min(1.0, level));
    const appElem = document.getElementById("app");
    if (appElem) {
      appElem.dataset.anxiety = this.anxietyLevel.toFixed(1);
    }
  }

  // Continuous ambient screen jitter / tremor
  startConstantShake() {
    const appElem = document.getElementById("app");
    if (appElem) {
      appElem.classList.add("constant-shaking");
    }
  }

  stopConstantShake() {
    const appElem = document.getElementById("app");
    if (appElem) {
      appElem.classList.remove("constant-shaking");
    }
  }

  triggerShake(durationMs = 400, intensity = 5) {
    const appElem = document.getElementById("app");
    if (!appElem) return;

    appElem.classList.add("shaking");
    appElem.style.setProperty("--shake-intensity", `${intensity}px`);

    setTimeout(() => {
      appElem.classList.remove("shaking");
    }, durationMs);
  }

  // Generate zalgo glitch text
  corruptText(text, severity = 0.5) {
    if (Math.random() > severity) return text;
    const zalgoUp = ["\u030d", "\u030e", "\u0304", "\u0305", "\u033f", "\u0311", "\u0306", "\u0310", "\u0352", "\u0357", "\u0351", "\u0307", "\u0308"];
    const zalgoDown = ["\u0316", "\u0317", "\u0318", "\u0319", "\u031c", "\u031d", "\u031e", "\u031f", "\u0320", "\u0324", "\u0325", "\u0326"];

    return text
      .split("")
      .map(char => {
        if (char === " " || Math.random() > severity) return char;
        let corrupted = char;
        const count = Math.floor(Math.random() * 3 * severity) + 1;
        for (let i = 0; i < count; i++) {
          corrupted += zalgoUp[Math.floor(Math.random() * zalgoUp.length)];
          corrupted += zalgoDown[Math.floor(Math.random() * zalgoDown.length)];
        }
        return corrupted;
      })
      .join("");
  }

  startLoop() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

    const render = () => {
      if (this.canvas && this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw CRT scanlines
        this.drawScanlines();

        // Draw CRT noise / glitch bars if anxiety > 0.2
        if (this.anxietyLevel > 0.2) {
          this.drawGlitchOverlay();
        }
      }
      this.animFrameId = requestAnimationFrame(render);
    };

    render();
  }

  drawScanlines() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    for (let y = 0; y < h; y += 4) {
      this.ctx.fillRect(0, y, w, 1);
    }
  }

  drawGlitchOverlay() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Random horizontal slice glitches
    const numGlitchBlocks = Math.floor(this.anxietyLevel * 10);
    for (let i = 0; i < numGlitchBlocks; i++) {
      if (Math.random() < 0.35) {
        const y = Math.random() * h;
        const blockHeight = Math.random() * 22 + 2;
        const opacity = Math.random() * 0.18 * this.anxietyLevel;

        this.ctx.fillStyle = Math.random() > 0.5 ? `rgba(255, 0, 60, ${opacity})` : `rgba(0, 220, 255, ${opacity})`;
        this.ctx.fillRect(0, y, w, blockHeight);
      }
    }

    // Edge Red Vignette (thick and prominent on high anxiety)
    if (this.anxietyLevel > 0.3) {
      const grad = this.ctx.createRadialGradient(w / 2, h / 2, Math.max(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.65);
      const alpha = Math.min(0.75, (this.anxietyLevel - 0.2) * 0.85);
      grad.addColorStop(0, "rgba(0, 0, 0, 0)");
      grad.addColorStop(1, `rgba(220, 0, 35, ${alpha})`);
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, w, h);
    }
  }

  stop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }
}

const effectsEngine = new EffectsEngine();
export default effectsEngine;

import audioEngine from "./audio";
import effectsEngine from "./effects";

class EvasiveButtonManager {
  constructor() {
    this.activeButtons = [];
    this.mousePos = { x: 0, y: 0 };
    this.onMouseMove = this.handleMouseMove.bind(this);
    this.isListening = false;
  }

  init() {
    if (!this.isListening) {
      window.addEventListener("mousemove", this.onMouseMove);
      this.isListening = true;
    }
  }

  handleMouseMove(e) {
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;

    this.activeButtons.forEach((btnData) => {
      this.updateButtonPosition(btnData);
    });
  }

  attach(element, options = {}) {
    this.init();
    if (!element || element.dataset.evasiveAttached) return;

    element.dataset.evasiveAttached = "true";
    element.classList.add("evasive-button");

    const config = {
      element,
      threshold: options.threshold || 120, // Distance to start dodging
      speed: options.speed || 1.2,
      difficulty: options.difficulty || 1, // 1: dodge, 2: dodge+teleport, 3: nightmare dodge+clone
      originalText: element.textContent.trim(),
      curseTextList: [
        "NOT YET!",
        "TOO LATE",
        "FALLING BEHIND",
        "WHY ARE YOU SLOW?",
        "DO THIS FIRST!",
        "NO CONTROL",
        "SYSTEM OVERLOAD",
      ],
      offset: { x: 0, y: 0 },
    };

    // Store in list
    this.activeButtons.push(config);

    // Mouseenter trigger
    element.addEventListener("mouseenter", () => {
      if (config.difficulty >= 2) {
        audioEngine.playGlitch(0.3);
        effectsEngine.triggerShake(150, 3);
      }
      if (config.difficulty >= 2 && Math.random() < 0.6) {
        // Change button text dynamically to anxious phrases
        const randomAnxiety = config.curseTextList[Math.floor(Math.random() * config.curseTextList.length)];
        element.textContent = effectsEngine.corruptText(randomAnxiety, 0.4);
      }
    });

    // Handle click attempt
    element.addEventListener("click", (e) => {
      if (config.difficulty >= 3 && Math.random() < 0.7) {
        // Multiply / clone task when clicked!
        e.stopImmediatePropagation();
        e.preventDefault();
        this.cloneTaskButton(config);
        audioEngine.playStinger();
        effectsEngine.triggerShake(300, 8);
      }
    });
  }

  updateButtonPosition(btnData) {
    const { element, threshold, speed, difficulty } = btnData;
    const rect = element.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dx = this.mousePos.x - btnCenterX;
    const dy = this.mousePos.y - btnCenterY;
    const dist = Math.hypot(dx, dy);

    if (dist < threshold) {
      // Calculate push direction away from mouse
      const angle = Math.atan2(dy, dx);
      const pushFactor = (threshold - dist) * 0.25 * speed * difficulty;

      btnData.offset.x -= Math.cos(angle) * pushFactor;
      btnData.offset.y -= Math.sin(angle) * pushFactor;

      // Teleport check for higher difficulty
      const screenPadding = 80;
      const currentRect = element.getBoundingClientRect();
      const isOutOfBounds =
        currentRect.left < screenPadding ||
        currentRect.right > window.innerWidth - screenPadding ||
        currentRect.top < screenPadding ||
        currentRect.bottom > window.innerHeight - screenPadding;

      if (difficulty >= 2 && isOutOfBounds) {
        // Teleport to open space on screen
        btnData.offset.x = (Math.random() * 0.4 - 0.2) * (window.innerWidth - 300);
        btnData.offset.y = (Math.random() * 0.4 - 0.2) * (window.innerHeight - 200);
        audioEngine.playGlitch(0.5);
      }

      element.style.transform = `translate3d(${btnData.offset.x}px, ${btnData.offset.y}px, 0)`;
    }
  }

  cloneTaskButton(btnData) {
    const parent = btnData.element.parentElement;
    if (!parent) return;

    const cloneWrapper = document.createElement("div");
    cloneWrapper.className = "scene-fragment renderable entering";

    const newBtn = document.createElement("button");
    newBtn.className = "next-fragment cursed-btn";

    const urgencyLabels = [
      "Submit assignment NOW",
      "Reply to Mom",
      "Study Chapter 4-9",
      "Fix project bug #404",
      "Hydrate (Urgent)",
      "Pay attention!",
      "Don't lose focus",
    ];

    const label = urgencyLabels[Math.floor(Math.random() * urgencyLabels.length)];
    newBtn.textContent = effectsEngine.corruptText(label, 0.5);

    cloneWrapper.appendChild(newBtn);
    parent.appendChild(cloneWrapper);

    requestAnimationFrame(() => {
      cloneWrapper.classList.remove("entering");
    });

    // Attach high difficulty evasive mechanics to clone
    this.attach(newBtn, { difficulty: 3, threshold: 140, speed: 1.5 });
  }

  clear() {
    this.activeButtons.forEach((btnData) => {
      btnData.element.style.transform = "";
      btnData.element.dataset.evasiveAttached = "";
    });
    this.activeButtons = [];
  }
}

const evasiveManager = new EvasiveButtonManager();
export default evasiveManager;

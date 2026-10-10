import sceneRegistry from "../../scenes/sceneRegistry";
import audioEngine from "./audio";
import effectsEngine from "./effects";
import evasiveManager from "./evasiveButtons";
import flyingEngine from "./flyingElements";
import notificationEngine from "./notifications";

const sceneState = {
  sceneDiv: document.querySelector(".scene"),
  currentSceneId: null,
  sceneFragments: {
    fragments: {},
    nextFragment: 0,
    allowNextFragment: true,
  },
  currentScript: null,
};

const sceneManager = {
  sceneState,

  initSceneManager() {
    window.sceneState = sceneState;
    window.allowNextFragment = this.sceneState.sceneFragments.allowNextFragment;
    effectsEngine.init();

    // Enable web audio resume on user interaction
    const resumeAudio = () => {
      audioEngine.ensureContext();
      window.removeEventListener("click", resumeAudio);
    };
    window.addEventListener("click", resumeAudio);

    // Event delegation for clicks
    sceneState.sceneDiv.addEventListener("click", (event) => {
      const element = event.target.closest("[data-action]");
      if (!element) return;
      const action = element.dataset.action;
      sceneState.currentScript?.[action]?.(element, event);
    });

    // Event delegation for sliders / text inputs
    sceneState.sceneDiv.addEventListener("input", (event) => {
      const element = event.target.closest("[data-action]");
      if (!element) return;
      const action = element.dataset.action;
      sceneState.currentScript?.[action]?.(element, event);
    });

    sceneState.sceneDiv.addEventListener("click", (event) => {
      if (!this.getAllowRenderNextFragment()) return;
      const element = event.target.closest(".next-fragment");
      if (!element) return;

      // Soft button click sound
      audioEngine.playPing(600, 0.1, "sine", 0.08);

      element.classList.remove("next-fragment");
      this.renderNextFragment();
    });
  },

  reset() {
    this.sceneState.sceneFragments.nextFragment = 1;
    this.sceneState.sceneFragments.fragments = [];
    this.sceneState.sceneFragments.allowNextFragment = true;
  },

  setAllowRenderNextFragment(value) {
    this.sceneState.sceneFragments.allowNextFragment = value;
  },

  getAllowRenderNextFragment() {
    return this.sceneState.sceneFragments.allowNextFragment;
  },

  render(fragment) {
    const element = fragment.element;
    element.classList.add("renderable", "entering");
    fragment.placeholder.replaceWith(element);

    requestAnimationFrame(() => {
      element.classList.remove("entering");
    });

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  },

  renderNextFragment() {
    if (!this.getAllowRenderNextFragment()) return;
    const idx = this.sceneState.sceneFragments.nextFragment++;
    const fragment = this.sceneState.sceneFragments.fragments[idx];
    if (!fragment) return;
    this.render(fragment);
  },

  async loadScene(scene) {
    if (!(scene in sceneRegistry)) {
      console.log(`Scene '${scene}' does not exist.`);
      return;
    }

    // exit current script & clear active evasive/flying/notifications
    sceneState.currentScript?.exit?.();
    evasiveManager.clear();
    flyingEngine.clear();
    notificationEngine.clearAll();

    // write html
    const sceneObject = sceneRegistry[scene];
    const fetchResponse = await fetch(sceneObject.html);
    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch scene '${scene}'.`);
    }
    const sceneHtml = await fetchResponse.text();

    sceneState.currentSceneId = scene;
    sceneState.sceneDiv.innerHTML = sceneHtml;

    // fetch scene fragments and render the first one
    this.reset();
    const fragments = [
      ...sceneState.sceneDiv.querySelectorAll(".scene-fragment")
    ];

    sceneState.sceneFragments.fragments = fragments.map(fragment => {
      const placeholder = document.createComment("scene-fragment");
      fragment.replaceWith(placeholder);
      return {
        element: fragment,
        placeholder
      };
    });

    if (sceneState.sceneFragments.fragments.length > 0) {
      this.render(sceneState.sceneFragments.fragments[0]);
    }

    // import scene script
    const sceneScript = await sceneObject.js();
    sceneState.currentScript = sceneScript;
    sceneScript.enter?.();
  },
};

export default sceneManager;

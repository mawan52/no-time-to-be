import sceneRegistry from "../../scenes/sceneRegistry";

const sceneState = {
  sceneDiv: document.querySelector(".scene"),
  currentSceneId: "empty",
  currentScript: null,
}

const sceneManager = {
  sceneState,

  initSceneManager() {
    sceneState.sceneDiv.addEventListener("click", (event) => {
      const element = event.target.closest("[data-action]");
      if (!element) return;
      const action = element.dataset.action;
      sceneState.currentScript?.[action]?.(element);
    })
  },

  async loadScene(scene) {
    if (!(scene in sceneRegistry)) {
      console.log(`Scene '${scene}' does not exist.`);
      return;
    }

    sceneState.currentScript?.exit?.();

    const sceneObject = sceneRegistry[scene];
    const fetchResponse = await fetch(sceneObject.html);
    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch scene '${scene}'.`);
    }
    const sceneHtml = await fetchResponse.text();

    sceneState.currentSceneId = scene;
    sceneState.sceneDiv.innerHTML = sceneHtml;

    const sceneScript = await sceneObject.js();
    sceneState.currentScript = sceneScript;
    sceneScript.enter?.();

  },
}

export default sceneManager;

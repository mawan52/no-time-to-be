import sceneState from "./sceneState";

const sceneManager = {
  sceneState,
  async load(scene) {
    response = await fetch(`../scenes/${scene}/${scene}.html`);
    sceneHtml = await response.text();
    sceneState.sceneDiv.innerHTML = await sceneHtml;
  }
}

export default sceneManager;

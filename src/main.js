import stateManager from "./core/sceneManager";

async function main() {
  stateManager.initSceneManager();
  // Starts on Wednesday for the full interactive story progression
  await stateManager.loadScene("wednesday");
}

main();

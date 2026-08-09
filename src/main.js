import stateManager from "./core/sceneManager"
import taskManager from "./core/taskManager"

async function main() {
  stateManager.initSceneManager();
  await stateManager.loadScene("goodmorning");
  let cleanId = taskManager.addTask("clean the wound");
  taskManager.tickTask(cleanId);
}

main();

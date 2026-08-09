const taskState = {
  taskDiv: document.querySelector(".tasks"),
  taskListDiv: document.querySelector(".tasks-list"),
  tasks: {},
  nextId: 1,
};

const taskManager = {
  taskState,

  addTask(task) {
    const taskId = taskState.nextId++;
    const listItem = document.createElement("li");
    listItem.append(task);
    taskState.taskListDiv.appendChild(listItem);
    taskState.tasks[taskId] = listItem;
    return taskId
  },

  clearTasks() {
    taskState.tasks = [];
    taskState.nextId = 1;
    taskState.taskListDiv.innerHTML = "";
  },

  tickTask(taskId) {
    taskState.tasks[taskId].classList?.add("completed");
  },
};

export default taskManager;

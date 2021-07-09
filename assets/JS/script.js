var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var taskInProgressEl = document.querySelector("#tasks-in-progress");
var taskCompletedEl = document.querySelector("#tasks-completed");

var tasks = [];

// 
//handles the main form at the top of the page. 
// 

var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // package up data as an object
  var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
  };

  var isEdit = formEl.hasAttribute("data-task-id");
  
  // send it as an argument to createTaskEl
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } 
  // no data attribute, so create object as normal and pass to createTaskEl function
  else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput
    };
    createTaskEl(taskDataObj);
  }
};

//
//creates a task with unique id
// 

var createTaskEl = function(taskDataObj) {
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  var taskActionsEl = createTaskActions(taskIdCounter);

  
  tasksToDoEl.appendChild(listItemEl);
  listItemEl.appendChild(taskActionsEl);

  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);
  saveTasks();

  taskIdCounter++;
};

// 
//addes options to task
// 

var createTaskActions = function(taskId){
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  var statusChoices = ["To Do", "In Progress", "Completed"];

  for(var i = 0; i < statusChoices.length; i++){
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value",statusChoices[i]);

    statusSelectEl.appendChild(statusOptionEl);
  }

  actionContainerEl.appendChild(statusSelectEl);

  return actionContainerEl;
}

// 
// Delete task function
// 

var deleteTask = function(taskId){
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();

  var updatedTaskArr = [];

  for (var i = 0; i < tasks.length; i++){
    if(tasks[i].id !== parseInt(taskId)){
      updatedTaskArr.push(tasks[i]);
    }
  }

  tasks = updatedTaskArr;
  saveTasks();
}

// 
// Edit task fucntion
// 

var editTask = function(taskId){
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;

  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";

  formEl.setAttribute("data-task-id", taskId);
}

// 
// Complete edit function
// 

var completeEditTask = function(taskName, taskType, taskId) {
  // find the matching task list item
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

// set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  for (var i = 0; i < tasks.length; i++){
    if (tasks[i].id === parseInt(taskId)){
      tasks[i].name === taskName;
      tasks[i].type = taskType;
    }
  }

  saveTasks();

  alert("Task Updated!");

  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
};

formEl.addEventListener("submit", taskFormHandler);

// 
//Button Handler
// 

var taskButtonHandler = function(event){
  // get target element from event
  var targetEl = event.target;

  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } 
  // delete button was clicked
  else if (targetEl.matches(".delete-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
}

// 
// Status handler
// 

var taskStatusChangeHandler = function(event){
  var taskId = event.target.getAttribute("data-task-id");
  var statusValue = event.target.value.toLowerCase();
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  if (statusValue === "to do"){
    tasksToDoEl.appendChild(taskSelected);
  }else if (statusValue === "in progress"){
    taskInProgressEl.appendChild(taskSelected);
  }else if (statusValue === "completed"){
    taskCompletedEl.appendChild(taskSelected);
  }

  saveTasks();
}

// 
// Saves task function
// 

var saveTasks = function(){
  localStorage.setItem("tasks",JSON.stringify(tasks));
}

pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("click",taskButtonHandler);
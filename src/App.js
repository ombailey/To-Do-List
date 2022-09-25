import "./App.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";

// Display Entire Application
function App() {
  return (
    <div id="main">
      <h1 className="main-title"> To-Do List</h1>
      <List />
    </div>
  );
}

// Functionality for toDo List
function List() {
  const [toDo, changeToDo] = useState([]);
  const [completedList, changeCompletedList] = useState([]);

  const completeTask = (event) => {
    let task = event.target;
    changeCompletedList([
      ...toDo.filter((item) => item.id == task.previousElementSibling.id),
      ...completedList,
    ]);
    changeToDo(
      toDo.filter((item) => item.id != task.previousElementSibling.id)
    );
  };

  const deleteTask = (event) => {
    let task = event.target;
    changeToDo(toDo.filter((item) => item.id != task.nextElementSibling.id));
  };

  return (
    <div>
      <Input toDo={toDo} changeToDo={changeToDo} />
      <ul className="task-list">
        {toDo.map((item) => (
          <div className="list-items">
            <FontAwesomeIcon
              className="remove"
              icon={faX}
              onClick={deleteTask}
            />
            <li id={item.id}>{item.name}</li>
            <FontAwesomeIcon
              className="check"
              icon={faCheck}
              onClick={completeTask}
            />
          </div>
        ))}
      </ul>
      <TaskLength toDo={toDo} />
      <Completed
        completedList={completedList}
        toDo={toDo}
        changeCompletedList={changeCompletedList}
        changeToDo={changeToDo}
      />
    </div>
  );
}
// Functionality for Adding Tasks
function Input({ toDo, changeToDo }) {
  const [taskText, setTaskText] = useState("");

  const changeText = (event) => {
    setTaskText(event.target.value);
  };

  const addTask = () => {
    let newTask = { name: taskText, id: uuidv4() };
    changeToDo([newTask, ...toDo]);
    clearInput();
  };

  const clearInput = () => {
    let input = document.querySelector("#input");
    input.value = "";
  };

  // Allows user to use enter to add task as well as pressing add button.
  useEffect(() => {
    let inputField = document.querySelector("#input");
    inputField.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        addTask();
      }
    });
  });

  return (
    <div>
      <input
        type="text"
        name="input"
        id="input"
        onChange={changeText}
        placeholder="New Task..."
      />
      <button className="add-task" onClick={addTask} title="Add Task">
        Add
      </button>
    </div>
  );
}

// Functionality for Task Count
function TaskLength({ toDo }) {
  return (
    <div>
      <h3 className="num-tasks">
        You have <span className="task-number">{toDo.length}</span> tasks.
      </h3>
    </div>
  );
}

// Functionality for Completed Bar
function Completed({ completedList, toDo, changeToDo, changeCompletedList }) {
  const [arrowDirection, changeArrowDirection] = useState("up");

  let arrow = faAngleUp;
  if (arrowDirection == "up") {
    arrow = faAngleUp;
  } else {
    arrow = faAngleDown;
  }

  const toggleList = () => {
    let cList = document.querySelector(".complete-list");
    if (arrowDirection == "up") {
      changeArrowDirection("down");
      cList.style.display = "initial";
    } else {
      changeArrowDirection("up");
      cList.style.display = "none";
    }
  };

  const undoTask = (event) => {
    let task = event.target;
    changeCompletedList(
      completedList.filter((item) => item.id != task.previousElementSibling.id)
    );
    changeToDo([
      ...completedList.filter(
        (item) => item.id == task.previousElementSibling.id
      ),
      ...toDo,
    ]);
  };
  return (
    <div className="completed-bar">
      <div className="completed">
        <p>
          Completed{" "}
          <span className="completed-num">( {completedList.length} )</span>
        </p>
        <FontAwesomeIcon
          className="list-arrows"
          icon={arrow}
          onClick={toggleList}
          title="toggle list"
        />
      </div>
      <ul className="complete-list">
        {completedList.map((task) => (
          <div className="complete-list-items">
            <li id={task.id}>{task.name}</li>
            <FontAwesomeIcon
              className="undo-task task-btn"
              icon={faRotateLeft}
              onClick={undoTask}
            />
          </div>
        ))}
      </ul>
    </div>
  );
}
export default App;

import "./App.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";

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

  // Get local storage items upon refresh
  useEffect(() => {
    let save = JSON.parse(window.localStorage.getItem("savedList") || "[]");
    if (save !== null) changeToDo(save);
  }, []);

  useEffect(() => {
    let save = JSON.parse(window.localStorage.getItem("savedComplete") || "[]");
    if (save !== null) changeCompletedList(save);
  }, []);

  // Set local storage items
  useEffect(() => {
    window.localStorage.setItem("savedList", JSON.stringify(toDo));
  }, [toDo]);

  useEffect(() => {
    window.localStorage.setItem("savedComplete", JSON.stringify(completedList));
  }, [completedList]);

  // List Functions
  const completeTask = (event) => {
    let task = event.target;

    if (
      (task.parentNode.previousElementSibling !== null &&
        task.parentNode.previousElementSibling.lastElementChild
          .firstElementChild.style.color === "orange") ||
      (task.parentNode.nextElementSibling !== null &&
        task.parentNode.nextElementSibling.lastElementChild.firstElementChild
          .style.color === "orange")
    ) {
      task.parentNode.lastElementChild.firstElementChild.style.color = "orange";
    } else {
      task.parentNode.lastElementChild.firstElementChild.style.color = "black";
    }

    console.log(task.parentNode.lastElementChild.children.length);

    changeCompletedList([
      ...toDo.filter(
        (item) => item.id === task.parentNode.firstElementChild.id
      ),
      ...completedList,
    ]);

    changeToDo(
      toDo.filter((item) => item.id !== task.parentNode.firstElementChild.id)
    );
  };

  const deleteTask = (event) => {
    let task = event.target;
    changeToDo(
      toDo.filter((item) => item.id !== task.parentNode.firstElementChild.id)
    );
  };

  const markPriority = (event) => {
    console.log(event.target.parentNode.style.color);
    let task = event.target;
    if (task.style.color === "orange") {
      task.style.color = "black";
    } else {
      task.style.color = "orange";
    }
  };
  return (
    <div>
      <Input toDo={toDo} changeToDo={changeToDo} />
      <ul className="task-list">
        {toDo.map((item) => (
          <div className="list-items">
            <li
              id={item.id}
              // onClick={toggleSubTask}
            >
              {item.name}
            </li>
            <FontAwesomeIcon
              className="remove task-icons"
              icon={faX}
              onClick={deleteTask}
            />
            <FontAwesomeIcon
              className="check task-icons"
              icon={faCheck}
              onClick={completeTask}
            />
            <FontAwesomeIcon
              className="priority task-icons"
              icon={faStar}
              onClick={markPriority}
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
    <div class="input-btns">
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
  if (arrowDirection === "up") {
    arrow = faAngleUp;
  } else {
    arrow = faAngleDown;
  }

  const toggleList = () => {
    let cList = document.querySelector(".complete-list");
    if (arrowDirection === "up") {
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
      completedList.filter((item) => item.id !== task.previousElementSibling.id)
    );
    changeToDo([
      ...completedList.filter(
        (item) => item.id === task.previousElementSibling.id
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

// function SubTask() {
//   const [subTasks, changeSubTasks] = useState([]);

//   // const addSubTask = () => {
//   //   let newTask = { name: taskText, id: uuidv4() };
//   //   changeSubTasks([newTask, ...subTasks]);
//   //   clearInput();
//   // };

//   return (
//     <div>
//       <div className="sub-task-input">
//         <input placeholder="New Subtask..." type="text"></input>
//         <button>Add</button>
//       </div>
//       <ul className="sub-task-lists">
//         {subTasks.map((item) => (
//           <div className="sub-task-items">
//             <li id={item.id}>{item.name}</li>
//             <FontAwesomeIcon
//               className="check"
//               icon={faCheck}
//               // onClick={completeTask}
//             />
//           </div>
//         ))}
//       </ul>
//     </div>
//   );
// }
export default App;

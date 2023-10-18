import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newSubtaskInput, setNewSubtaskInput] = useState("");
  const [addingSubtaskForTask, setAddingSubtaskForTask] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [editingSubtask, setEditingSubtask] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [zoomInput, setZoomInput] = useState("100");

  const zoomOptions = [
    150, 140, 130, 120, 110, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10,
  ];

  const setZoomValue = (value) => {
    const newZoom = parseFloat(value);
    if (!isNaN(newZoom)) {
      setZoom(newZoom / 100);
      setZoomInput(value);
    }
  };

  const zoomIn = () => {
    setZoom(zoom + 0.1);
    setZoomInput(((zoom + 0.1) * 100).toString());
  };

  const zoomOut = () => {
    setZoom(Math.max(0.2, zoom - 0.1));
    setZoomInput((Math.max(0.2, zoom - 0.1) * 100).toString());
  };

  const addTask = () => {
    if (taskInput.trim() === "") return;
    const newTask = { id: Date.now(), text: taskInput, subtasks: [] };
    setTasks([...tasks, newTask]);
    setTaskInput("");
    setEditingTaskId(null);
  };

  const appStyles = {
    transform: `scale(${zoom})`,
  };

  const toggleInput = (taskId) => {
    setEditingTaskId(taskId);
    if (editingTaskId === taskId) {
      setEditingTaskId(null);
    }
  };

  const deleteTask = (taskId) => {
    const shouldDelete = window.confirm("Дійсно видалити цю задачу?");
    if (shouldDelete) {
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    }
  };

  const addSubtask = (parentId) => {
    setAddingSubtaskForTask(parentId);
  };

  const saveSubtask = (parentId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === parentId) {
        const newSubtask = {
          id: Date.now(),
          text: newSubtaskInput,
          subsubtasks: [],
        };
        task.subtasks.push(newSubtask);
      }
      return task;
    });
    setTasks(updatedTasks);
    setNewSubtaskInput("");
    setAddingSubtaskForTask(null);
  };

  const editSubtask = (taskId, subtaskId, newText) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        task.subtasks = task.subtasks.map((subtask) => {
          if (subtask.id === subtaskId) {
            subtask.text = newText;
          }
          return subtask;
        });
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const deleteSubtask = (taskId, subtaskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        task.subtasks = task.subtasks.filter(
          (subtask) => subtask.id !== subtaskId
        );
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // Функція для обробки натискання клавіш
  const handleKeyPress = (event) => {
    if (event.key === "+") {
      zoomIn();
    } else if (event.key === "-") {
      zoomOut();
    }
  };

  // Встановлення обробки подій при завантаженні компоненту
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []); // Порожній масив забезпечує одноразову реєстрацію обробників подій

  return (
    <div className="App" style={appStyles}>
      <h1>Todo List</h1>
      <div className="zoom-buttons">
        <button onClick={zoomOut}>-</button>
        <select
          value={zoomInput}
          onChange={(e) => setZoomValue(e.target.value)}
        >
          {zoomOptions.map((option) => (
            <option key={option} value={option}>
              {option}%
            </option>
          ))}
        </select>
        <button onClick={zoomIn}>+</button>
      </div>
      <div>
        <div className="categories">
          <p>Categories</p>
          <button onClick={() => toggleInput("new")}>
            {editingTaskId === "new" ? "❌" : "✔️"}
          </button>
        </div>

        {editingTaskId === "new" && (
          <div className="input-container">
            <input
              type="text"
              placeholder="Додати задачу..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
            <button onClick={addTask}>Додати</button>
          </div>
        )}
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            {editingTaskId === task.id ? (
              <div className="input-container">
                <input
                  type="text"
                  value={task.text}
                  onChange={(e) => {
                    const updatedTasks = tasks.map((t) => {
                      if (t.id === task.id) {
                        return { ...t, text: e.target.value };
                      }
                      return t;
                    });
                    setTasks(updatedTasks);
                  }}
                />
                <button onClick={() => setEditingTaskId(null)}>✔️</button>
              </div>
            ) : (
              <>
                <div className="task-content">
                  <span>{task.text}</span>
                  <button onClick={() => deleteTask(task.id)}>❌</button>
                  <button onClick={() => toggleInput(task.id)}>⭕</button>
                  <button onClick={() => addSubtask(task.id)}>✔️</button>
                </div>
                {task.subtasks.length > 0 && (
                  <ul className="subtask-list">
                    {task.subtasks.map((subtask) => (
                      <li key={subtask.id} className="subtask-item">
                        {editingSubtask === subtask.id ? (
                          <div className="input-container">
                            <input
                              type="text"
                              value={subtask.text}
                              onChange={(e) => {
                                editSubtask(
                                  task.id,
                                  subtask.id,
                                  e.target.value
                                );
                              }}
                            />
                            <button onClick={() => setEditingSubtask(null)}>
                              ✔️
                            </button>
                            <button
                              onClick={() => deleteSubtask(task.id, subtask.id)}
                            >
                              ❌
                            </button>
                          </div>
                        ) : (
                          <>
                            {subtask.text}
                            <button
                              onClick={() => deleteSubtask(task.id, subtask.id)}
                            >
                              ❌
                            </button>
                            <button
                              onClick={() => setEditingSubtask(subtask.id)}
                            >
                              ⭕
                            </button>
                            <button onClick={() => addSubtask(subtask.id)}>
                              ✔️
                            </button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {addingSubtaskForTask === task.id && (
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Додати підзавдання..."
                      value={newSubtaskInput}
                      onChange={(e) => setNewSubtaskInput(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        saveSubtask(task.id);
                        setAddingSubtaskForTask(null);
                      }}
                    >
                      ✔️
                    </button>
                  </div>
                )}
              </>
            )}
            {addingSubtaskForTask && task.subtasks.length > 0 && (
              <div
                className="arrow-line"
                style={{ height: `${task.subtasks.length * 42}px` }}
              ></div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

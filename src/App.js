import React, { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newSubtaskInput, setNewSubtaskInput] = useState("");
  const [newSubtaskVisible, setNewSubtaskVisible] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [editingSubtask, setEditingSubtask] = useState(null);

  const addTask = () => {
    if (taskInput.trim() === "") return;
    const newTask = { id: Date.now(), text: taskInput, subtasks: [] };
    setTasks([...tasks, newTask]);
    setTaskInput("");
    setEditingTaskId(null);
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
    setNewSubtaskVisible(true);
    setActiveTaskId(parentId); // Задаємо активне завдання для додавання підзавдань
  };

  const saveSubtask = (parentId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === parentId) {
        const newSubtask = { id: Date.now(), text: newSubtaskInput };
        task.subtasks.push(newSubtask);
      }
      return task;
    });
    setTasks(updatedTasks);
    setNewSubtaskInput("");
    setNewSubtaskVisible(false);
    setActiveTaskId(null); // Закінчуємо додавання підзавдань для активного завдання
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

  return (
    <div className="App">
      <h1>Todo List</h1>
      <div>
        <button onClick={() => toggleInput("new")}>
          {editingTaskId === "new" ? "Скасувати" : "Plus"}
        </button>
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
                <button onClick={() => setEditingTaskId(null)}>Зберегти</button>
              </div>
            ) : (
              <>
                <div className="task-content">
                  <span>{task.text}</span>
                  <button onClick={() => deleteTask(task.id)}>Видалити</button>
                  <button onClick={() => toggleInput(task.id)}>
                    Редагувати
                  </button>
                  <button onClick={() => addSubtask(task.id)}>Plus2</button>
                </div>
                {task.subtasks.length > 0 && (
                  <ul className="subtask-list">
                    {task.subtasks.map((subtask) => (
                      <li key={subtask.id} className="subtask-item">
                        {editingTaskId === task.id &&
                        editingSubtask === subtask.id ? (
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
                              Зберегти
                            </button>
                          </div>
                        ) : (
                          <>
                            {subtask.text}
                            <button
                              onClick={() => deleteSubtask(task.id, subtask.id)}
                            >
                              Видалити
                            </button>
                            <button
                              onClick={() => setEditingSubtask(subtask.id)}
                            >
                              Редагувати
                            </button>
                            <button>Plus3</button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {activeTaskId === task.id && (
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Додати підзавдання..."
                      value={newSubtaskInput}
                      onChange={(e) => setNewSubtaskInput(e.target.value)}
                    />
                    <button onClick={() => saveSubtask(task.id)}>Додати</button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

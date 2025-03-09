import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import uuid

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch todos from the Go backend
  useEffect(() => {
    axios.get("http://localhost:8080/todos")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }, []);

  // Add a new todo
  const addTodo = () => {
    if (newTodo.trim() === "") return;

    const todo = {
      id: uuidv4(), // Generate a unique ID
      title: newTodo,
      done: false,
    };

    axios.post("http://localhost:8080/todos", todo)
      .then((response) => {
        setTodos([...todos, response.data]);
        setNewTodo("");
      })
      .catch((error) => {
        console.error("Error adding todo:", error);
      });
  };

  // Toggle the done status of a todo
  const toggleDone = (id) => {
    axios.put(`http://localhost:8080/todos/${id}`)
      .then((response) => {
        setTodos(todos.map((todo) =>
          todo.id === id ? response.data : todo
        ));
      })
      .catch((error) => {
        console.error("Error toggling todo:", error);
      });
  };

  // Delete a todo
  const deleteTodo = (id) => {
    axios.delete(`http://localhost:8080/todos/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleDone(todo.id)}
            />
            <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
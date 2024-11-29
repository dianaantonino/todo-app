"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null); 
  const [editTitle, setEditTitle] = useState("");

  // Fetch todos from Supabase
  const fetchTodos = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id);

    if (error) console.error("Error fetching todos:", error.message);
    else setTodos(data);
  };

  // Add a new todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    const { error } = await supabase.from("todos").insert({
      title: newTodo.trim(),
      is_completed: false,
      user_id: user.id,
    });

    if (error) console.error("Error adding todo:", error.message);
    else fetchTodos();

    setNewTodo("");
    setLoading(false);
  };

  // Mark todo as completed/uncompleted
  const toggleTodoCompletion = async (id, isCompleted) => {
    const { error } = await supabase
      .from("todos")
      .update({ is_completed: !isCompleted })
      .eq("id", id);

    if (error) console.error("Error updating todo:", error.message);
    else fetchTodos();
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) console.error("Error deleting todo:", error.message);
    else fetchTodos();
  };

  // Start editing a todo
  const startEditing = (id, currentTitle) => {
    setEditTodoId(id);
    setEditTitle(currentTitle);
  };

  // Save the edited todo
  const saveEdit = async (id) => {
    const { error } = await supabase
      .from("todos")
      .update({ title: editTitle.trim() })
      .eq("id", id);

    if (error) {
      console.error("Error editing todo:", error.message);
    } else {
      fetchTodos();
      cancelEdit();
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditTodoId(null);
    setEditTitle("");
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      padding: "20px",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}>
        <h1>Todo List</h1>
        <button
          onClick={logout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
      <div style={{
        marginBottom: "20px",
        display: "flex",
        gap: "10px",
      }}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={addTodo}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
      <ul style={{
        listStyleType: "none",
        padding: 0,
      }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              backgroundColor: "#f8f9fa",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {editTodoId === todo.id ? (
              <div style={{ display: "flex", gap: "10px", flex: 1 }}>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
                <button
                  onClick={() => saveEdit(todo.id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: todo.is_completed ? "line-through" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleTodoCompletion(todo.id, todo.is_completed)}
                >
                  {todo.title}
                </span>
                <div>
                  <button
                    onClick={() => startEditing(todo.id, todo.title)}
                    style={{
                      padding: "5px 10px",
                      marginRight: "10px",
                      backgroundColor: "#ffc107",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

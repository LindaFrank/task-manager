"use client";

import { useEffect, useState, useMemo } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import {
  Task,
  TaskCategory,
  sortByDueDate,
  filterByCategory,
} from "@/lib/taskUtils";

const CATEGORY_FILTERS: (TaskCategory | "ALL")[] = [
  "ALL",
  "WORK",
  "PERSONAL",
  "LEARNING",
  "OTHER",
];

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | "ALL">("ALL");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to load tasks.");
      const data = await res.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError("Couldn't load tasks. Is your database connected?");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data: {
    name: string;
    description: string;
    dueDate: string;
    category: TaskCategory;
  }) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create task.");
    const newTask = await res.json();
    setTasks((prev) => [newTask, ...prev]);
  }

  async function handleUpdate(id: string, data: Partial<Task>) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update task.");
    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete task.");
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const visibleTasks = useMemo(() => {
    return sortByDueDate(filterByCategory(tasks, categoryFilter));
  }, [tasks, categoryFilter]);

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Personal Task Manager</h1>
        <p className="mt-1 text-sm text-gray-500">
          Sorted by due date · {tasks.length} total task{tasks.length === 1 ? "" : "s"}
        </p>
      </header>

      <TaskForm onSubmit={handleCreate} />

      <div className="flex flex-wrap gap-2">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              categoryFilter === cat
                ? "bg-brand-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {cat.charAt(0) + cat.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Loading tasks...</p>
      ) : (
        <TaskList tasks={visibleTasks} onUpdate={handleUpdate} onDelete={handleDelete} />
      )}
    </main>
  );
}

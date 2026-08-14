"use client";

import { useState } from "react";
import { Task, TaskCategory, isOverdue } from "@/lib/taskUtils";
import TaskForm from "./TaskForm";

interface TaskItemProps {
  task: Task;
  onUpdate: (
    id: string,
    data: Partial<{
      name: string;
      description: string;
      dueDate: string;
      category: TaskCategory;
      completed: boolean;
    }>
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const CATEGORY_STYLES: Record<TaskCategory, string> = {
  WORK: "bg-blue-100 text-blue-700",
  PERSONAL: "bg-purple-100 text-purple-700",
  LEARNING: "bg-green-100 text-green-700",
  OTHER: "bg-gray-100 text-gray-700",
};

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const overdue = isOverdue(task);

  if (editing) {
    return (
      <TaskForm
        initialTask={task}
        onCancel={() => setEditing(false)}
        onSubmit={async (data) => {
          await onUpdate(task.id, data);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => onUpdate(task.id, { completed: e.target.checked })}
        className="mt-1 h-4 w-4 cursor-pointer"
      />
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-sm font-medium ${
              task.completed ? "text-gray-400 line-through" : "text-gray-900"
            }`}
          >
            {task.name}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs ${CATEGORY_STYLES[task.category]}`}>
            {task.category.charAt(0) + task.category.slice(1).toLowerCase()}
          </span>
          {overdue && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
              Overdue
            </span>
          )}
        </div>
        {task.description && (
          <p className="mt-1 text-sm text-gray-500">{task.description}</p>
        )}
        {task.dueDate && (
          <p className="mt-1 text-xs text-gray-400">
            Due {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => setEditing(true)}
          className="text-xs font-medium text-brand-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-xs font-medium text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

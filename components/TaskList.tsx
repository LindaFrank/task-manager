"use client";

import { Task, TaskCategory } from "@/lib/taskUtils";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
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

export default function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-xl bg-white p-6 text-center text-sm text-gray-400 shadow-sm">
        No tasks yet. Add one above to get started.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
}

export type TaskCategory = "WORK" | "PERSONAL" | "LEARNING" | "OTHER";

export interface Task {
  id: string;
  name: string;
  description: string | null;
  dueDate: string | null; // ISO string on the client
  category: TaskCategory;
  completed: boolean;
}

/**
 * Sorts tasks by due date, soonest first. Tasks with no due date go last.
 */
export function sortByDueDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

/**
 * Filters tasks down to a single category. Pass "ALL" to skip filtering.
 */
export function filterByCategory(
  tasks: Task[],
  category: TaskCategory | "ALL"
): Task[] {
  if (category === "ALL") return tasks;
  return tasks.filter((task) => task.category === category);
}

/**
 * Splits tasks into overdue vs. not, based on the current time.
 * Completed tasks are never considered overdue.
 */
export function isOverdue(task: Task, now: Date = new Date()): boolean {
  if (task.completed || !task.dueDate) return false;
  return new Date(task.dueDate).getTime() < now.getTime();
}

/**
 * Validates task form input before it's sent to the API.
 * Returns a list of error messages; an empty list means the input is valid.
 */
export function validateTaskInput(input: {
  name: string;
  dueDate?: string | null;
}): string[] {
  const errors: string[] = [];
  if (!input.name || input.name.trim().length === 0) {
    errors.push("Task name is required.");
  }
  if (input.name && input.name.trim().length > 120) {
    errors.push("Task name must be under 120 characters.");
  }
  if (input.dueDate && isNaN(new Date(input.dueDate).getTime())) {
    errors.push("Due date is not a valid date.");
  }
  return errors;
}

/**
 * Groups tasks by category, for a categorized board/list view.
 */
export function groupByCategory(
  tasks: Task[]
): Record<TaskCategory, Task[]> {
  const groups: Record<TaskCategory, Task[]> = {
    WORK: [],
    PERSONAL: [],
    LEARNING: [],
    OTHER: [],
  };
  for (const task of tasks) {
    groups[task.category].push(task);
  }
  return groups;
}

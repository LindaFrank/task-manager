import { describe, it, expect } from "vitest";
import {
  sortByDueDate,
  filterByCategory,
  isOverdue,
  validateTaskInput,
  groupByCategory,
  Task,
} from "../lib/taskUtils";

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: Math.random().toString(),
  name: "Sample task",
  description: null,
  dueDate: null,
  category: "OTHER",
  completed: false,
  ...overrides,
});

describe("sortByDueDate", () => {
  it("sorts tasks with due dates soonest first", () => {
    const tasks = [
      makeTask({ id: "a", dueDate: "2026-09-01" }),
      makeTask({ id: "b", dueDate: "2026-08-15" }),
      makeTask({ id: "c", dueDate: "2026-08-20" }),
    ];
    const sorted = sortByDueDate(tasks);
    expect(sorted.map((t) => t.id)).toEqual(["b", "c", "a"]);
  });

  it("puts tasks with no due date at the end", () => {
    const tasks = [
      makeTask({ id: "a", dueDate: null }),
      makeTask({ id: "b", dueDate: "2026-08-15" }),
    ];
    const sorted = sortByDueDate(tasks);
    expect(sorted.map((t) => t.id)).toEqual(["b", "a"]);
  });
});

describe("filterByCategory", () => {
  it("returns only tasks matching the given category", () => {
    const tasks = [
      makeTask({ id: "a", category: "WORK" }),
      makeTask({ id: "b", category: "PERSONAL" }),
      makeTask({ id: "c", category: "WORK" }),
    ];
    const filtered = filterByCategory(tasks, "WORK");
    expect(filtered.map((t) => t.id)).toEqual(["a", "c"]);
  });

  it("returns all tasks when category is ALL", () => {
    const tasks = [makeTask({ id: "a" }), makeTask({ id: "b" })];
    expect(filterByCategory(tasks, "ALL")).toHaveLength(2);
  });
});

describe("isOverdue", () => {
  it("flags a past-due, incomplete task as overdue", () => {
    const task = makeTask({ dueDate: "2020-01-01", completed: false });
    expect(isOverdue(task, new Date("2026-08-12"))).toBe(true);
  });

  it("does not flag a completed task as overdue even if past due", () => {
    const task = makeTask({ dueDate: "2020-01-01", completed: true });
    expect(isOverdue(task, new Date("2026-08-12"))).toBe(false);
  });

  it("does not flag a task with no due date as overdue", () => {
    const task = makeTask({ dueDate: null });
    expect(isOverdue(task, new Date("2026-08-12"))).toBe(false);
  });
});

describe("validateTaskInput", () => {
  it("rejects an empty task name", () => {
    const errors = validateTaskInput({ name: "   " });
    expect(errors).toContain("Task name is required.");
  });

  it("rejects an invalid due date", () => {
    const errors = validateTaskInput({ name: "Valid name", dueDate: "not-a-date" });
    expect(errors).toContain("Due date is not a valid date.");
  });

  it("accepts a valid task with no errors", () => {
    const errors = validateTaskInput({ name: "Buy groceries", dueDate: "2026-08-20" });
    expect(errors).toHaveLength(0);
  });
});

describe("groupByCategory", () => {
  it("groups tasks under their correct category buckets", () => {
    const tasks = [
      makeTask({ id: "a", category: "WORK" }),
      makeTask({ id: "b", category: "LEARNING" }),
      makeTask({ id: "c", category: "WORK" }),
    ];
    const groups = groupByCategory(tasks);
    expect(groups.WORK).toHaveLength(2);
    expect(groups.LEARNING).toHaveLength(1);
    expect(groups.PERSONAL).toHaveLength(0);
  });
});

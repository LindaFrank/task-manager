import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';

// GET /api/tasks - list all tasks
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks." },
      { status: 500 }
    );
  }
}

// POST /api/tasks - create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, dueDate, category } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Task name is required." },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        category: category || "OTHER",
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks failed:", error);
    return NextResponse.json(
      { error: "Failed to create task." },
      { status: 500 }
    );
  }
}

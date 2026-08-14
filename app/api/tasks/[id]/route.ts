import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';

interface Params {
  params: { id: string };
}

// GET /api/tasks/:id - fetch one task
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const task = await prisma.task.findUnique({ where: { id: params.id } });
    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch (error) {
    console.error(`GET /api/tasks/${params.id} failed:`, error);
    return NextResponse.json(
      { error: "Failed to fetch task." },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/:id - edit a task (name, description, dueDate, category, completed)
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json();
    const { name, description, dueDate, category, completed } = body;

    if (name !== undefined && name.trim().length === 0) {
      return NextResponse.json(
        { error: "Task name cannot be empty." },
        { status: 400 }
      );
    }

    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(category !== undefined && { category }),
        ...(completed !== undefined && { completed }),
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error(`PUT /api/tasks/${params.id} failed:`, error);
    return NextResponse.json(
      { error: "Failed to update task." },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/:id - delete a task
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await prisma.task.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/tasks/${params.id} failed:`, error);
    return NextResponse.json(
      { error: "Failed to delete task." },
      { status: 500 }
    );
  }
}

import { ERROR_MESSAGES } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { taskSchema } from "@/schemas/taskSchema";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const user = await withAuth();
    if (user instanceof NextResponse) return user;

    const { id } = await params;

    try {
        // Find the task to ensure it exists
        const task = await prisma.task.findUnique({
            where: { id },
        });

        if (!task) {
            return NextResponse.json({ message: "The requested task does not exist" }, { status: 404 });
        }

        // Ensure the task belongs to the authenticated user
        if (task.userId !== user.sub) {
            return NextResponse.json({ message: ERROR_MESSAGES.FORBIDDEN }, { status: 403 });
        }

        // Delete the task
        await prisma.task.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: ERROR_MESSAGES.SERVER_ERROR }, { status: 500 });
    }
}
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const user = await withAuth();
    if (user instanceof NextResponse) return user;

    const { id } = await params;

    try {
        const body = await req.json();

        // Validate the incoming data
        const validatedData = taskSchema.parse(body);

        // Find the task to ensure it exists
        const task = await prisma.task.findUnique({
            where: { id },
        });

        if (!task) {
            return NextResponse.json({ message: "The requested task does not exist" }, { status: 404 });
        }

        // Ensure the task belongs to the authenticated user
        if (task.userId !== user.sub) {
            return NextResponse.json({ message: ERROR_MESSAGES.FORBIDDEN }, { status: 403 });
        }

        // Update the task
        const updatedTask = await prisma.task.update({
            where: { id },
            data: validatedData,
        });

        return NextResponse.json({ message: "Task updated successfully", task: updatedTask }, { status: 200 });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ message: ERROR_MESSAGES.SERVER_ERROR }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/schemas/taskSchema";
import { withAuth } from "@/lib/withAuth";
import { ERROR_MESSAGES } from "@/lib/config";

export async function POST(req: Request) {
    const user = await withAuth();
    if (user instanceof NextResponse) return user;

    const body = await req.json();
    const result = taskSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(
            {
                message: ERROR_MESSAGES.VALIDATION_FAILED,
                errors: result.error.flatten().fieldErrors,
            },
            { status: 400 }
        );
    }

    const task = await prisma.task.create({
        data: {
            ...result.data,
            userId: user.sub,
        },
    });

    return NextResponse.json({ message: "Task created successfully", task }, { status: 201 });
}

export async function GET(req: Request) {
    const user = await withAuth();
    if (user instanceof NextResponse) return user;

    try {
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10); // Default to page 1
        const limit = parseInt(url.searchParams.get('limit') || '6', 10); // Default to 6 tasks per page
        const status = url.searchParams.get('status');  // Optional filter by status
        const priority = url.searchParams.get('priority');  // Optional filter by priority

        // Create filter object
        const filters: any = { userId: user.sub };

        if (status) {
            filters.status = status;
        }

        if (priority) {
            filters.priority = priority;
        }

        // Get the tasks with pagination and filters
        const tasks = await prisma.task.findMany({
            where: filters,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit, // Skip based on page and limit
            take: limit, // Limit the number of tasks returned
        });

        // Get the total count of tasks for pagination
        const totalTasks = await prisma.task.count({
            where: filters,
        });

        // Return tasks and pagination info
        return NextResponse.json(
            { tasks, totalTasks, page, limit },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: ERROR_MESSAGES.SERVER_ERROR },
            { status: 500 }
        );
    }
}



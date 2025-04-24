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
        const limit = parseInt(url.searchParams.get('pageSize') || '6', 10); // Default to 6 tasks per page

        // Fetch sorting parameters
        const sorting = JSON.parse(url.searchParams.get('sorting') || '[]');  // Get sorting from URL params
        const sortColumn = sorting.length > 0 ? sorting[0].column : 'status';  // Default to sorting by 'status'
        const sortDirection = sorting.length > 0 && sorting[0].direction ? sorting[0].direction : 'asc';  // Default to ascending

        // Fetch filters from URL params
        const filters = JSON.parse(url.searchParams.get('filters') || '{}');
        const status = filters.status;
        const priority = filters.priority;

        // Prepare filter object for Prisma
        const filterConditions: any = { userId: user.sub };

        if (status) filterConditions.status = status;
        if (priority) filterConditions.priority = priority;

        // Fetch tasks from Prisma with sorting and filters
        const tasks = await prisma.task.findMany({
            where: filterConditions,
            orderBy: {
                [sortColumn]: sortDirection,  // Dynamically set the sorting column and direction
            },
            skip: (page - 1) * limit,  // Skip based on page
            take: limit,  // Limit the number of tasks
        });

        // Count the total number of tasks (without pagination) to send for totalTasks
        const totalTasks = await prisma.task.count({
            where: filterConditions,
        });

        return new NextResponse(
            JSON.stringify({
                tasks,
                totalTasks,
                page,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return new NextResponse(JSON.stringify({ message: "Error fetching tasks." }), { status: 500 });
    }
}



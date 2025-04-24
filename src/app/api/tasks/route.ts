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
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('pageSize') || '6', 10);

        // Fetch sorting parameters
        const sorting = JSON.parse(url.searchParams.get('sorting') || '[]');
        const sortColumn = sorting.length > 0 ? sorting[0].column : 'status';
        const sortDirection = sorting.length > 0 && sorting[0].direction ? sorting[0].direction : 'asc';

        // Fetch filters from URL params
        const filters = JSON.parse(url.searchParams.get('filters') || '{}');
        const status = filters.status;
        const priority = filters.priority;

        // Prepare filter object for Prisma
        const filterConditions: any = { userId: user.sub };

        if (status) {
            filterConditions.status = status;
        }

        if (priority) {
            filterConditions.priority = priority;
        }

        // Get tasks with filters, sorting, and pagination
        const tasks = await prisma.task.findMany({
            where: filterConditions,
            orderBy: {
                [sortColumn]: sortDirection,
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalTasks = await prisma.task.count({
            where: filterConditions,
        });

        return NextResponse.json({
            tasks,
            totalTasks,
            page,
            pageSize: limit,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: ERROR_MESSAGES.SERVER_ERROR }, { status: 500 });
    }
}




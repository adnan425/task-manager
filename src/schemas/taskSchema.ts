import { z } from "zod";
import { Priority, Status } from "@/generated/prisma";

export const taskSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be at most 100 characters"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description must be at most 1000 characters"),

    priority: z.enum([Priority.low, Priority.medium, Priority.high]),
    status: z.enum([Status.pending, Status.completed]),
});

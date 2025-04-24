"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import { z } from "zod";
import { taskSchema } from "@/schemas/taskSchema";
import { Priority, Status, Task } from "@/generated/prisma";
import { ERROR_MESSAGES } from "@/lib/config";

export function useTasks(initialValues?: z.infer<typeof taskSchema>) {
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues: initialValues || {
            title: "",
            description: "",
            priority: "medium",
            status: "pending",
        },
    });

    const createTask = async (data: z.infer<typeof taskSchema>) => {
        const toastId = toast.loading("Creating your task...");
        setLoading(true);

        try {
            const response = await axiosInstance.post("/api/tasks", data);
            toast.success(response.data.message || "Task created successfully!", {
                id: toastId,
            });
            form.reset();
            return { success: true, task: response.data.task };
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || ERROR_MESSAGES.SERVER_ERROR;
            toast.error(errorMessage, { id: toastId });
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };
    const updateTask = async (taskId: string, data: z.infer<typeof taskSchema>) => {
        setLoading(true);

        try {
            const response = await axiosInstance.put(`/api/tasks/${taskId}`, data);
            toast.success(response.data.message || "Task updated successfully!");
            form.reset();
            return { success: true, task: response.data.task };
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || ERROR_MESSAGES.SERVER_ERROR;
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };
    const deleteTask = async (taskId: string) => {
        setLoading(true);

        try {
            const response = await axiosInstance.delete(`/api/tasks/${taskId}`);

            toast.success(response.data.message || "Task deleted successfully!");

            return { success: true };
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || ERROR_MESSAGES.SERVER_ERROR;
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const priorityOptions = Object.values(Priority).map((p) => ({
        label: p,
        value: p,
    }));

    const statusOptions = Object.values(Status).map((s) => ({
        label: s,
        value: s,
    }));
    return {
        form,
        createTask,
        loading,
        priorityOptions,
        statusOptions,
        updateTask,
        deleteTask
    };
}
interface UseTasksOptions {
    search?: string;
    filters?: Record<string, string | number | boolean>;
    sortBy?: string;
    order?: "asc" | "desc";
    page?: number;
    pageSize?: number;
}
export const useTasksList = (options: UseTasksOptions = {}) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        search = "",
        filters = {},
        sortBy = "created_at",
        order = "desc",
        page = 1,
        pageSize = 10,
    } = options;
    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                search,
                sortBy,
                order,
                page: String(page),
                pageSize: String(pageSize),
                ...Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, String(v)])),
            });

            const response = await axiosInstance.get("/api/tasks", { params });
            setTasks(response.data.tasks || []);
        } catch (err: any) {
            setError(err.message || ERROR_MESSAGES.SERVER_ERROR);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {


        fetchTasks();
    }, [search, sortBy, order, page, pageSize, JSON.stringify(filters)]);

    return {
        tasks,
        loading,
        error,
        refetch: fetchTasks,
    };
};


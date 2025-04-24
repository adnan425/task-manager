"use client";

import { Priority, Status, Task } from "@/generated/prisma";
import axiosInstance from "@/lib/axiosInstance";
import { ERROR_MESSAGES } from "@/lib/config";
import { taskSchema } from "@/schemas/taskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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


export const useTasksList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([{ id: "status", desc: false }]);  // Default sorting by 'status'
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 6;

    const fetchTasks = async () => {
        setLoading(true);
        try {
            // Prepare sorting parameters from the state
            const sortParams = sorting.map((sort) => ({
                column: sort.id,  // 'status' or 'priority'
                direction: sort.desc ? "desc" : "asc",
            }));

            // Prepare filter parameters from the state (if needed)
            const filters = columnFilters.reduce((acc, filter) => {
                acc[filter.id] = filter.value as string;
                return acc;
            }, {} as Record<string, string>);

            // Make the API request to fetch tasks
            const response = await axiosInstance.get("/api/tasks", {
                params: {
                    sorting: JSON.stringify(sortParams),  // Send sorting as a JSON string
                    filters: JSON.stringify(filters),     // Send filters as a JSON string
                    page,
                    pageSize,
                },
            });

            // Update state with fetched data
            setTotalTasks(response?.data?.totalTasks || 0);
            setTasks(response?.data?.tasks || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();  // Fetch tasks whenever the page or sorting changes
    }, [page, sorting]);

    return {
        tasks,
        loading,
        setPage,
        totalTasks,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        pageSize,
        page,
    };
};



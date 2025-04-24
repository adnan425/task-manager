"use client";

import { getTasksTableColumns } from "@/components/tasks/task-columns";
import { Priority, Status, Task } from "@/generated/prisma";
import axiosInstance from "@/lib/axiosInstance";
import { ERROR_MESSAGES } from "@/lib/config";
import { taskSchema } from "@/schemas/taskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
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
  const updateTask = async (
    taskId: string,
    data: z.infer<typeof taskSchema>
  ) => {
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
    deleteTask,
  };
}

export const useTasksList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "status", desc: false },
  ]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const fetchTasks = async () => {
    console.log("Fetching tasks with filters:", {
      statusFilter,
      priorityFilter,
    });
    setLoading(true);
    try {
      const filters: Record<string, string> = {};
      if (statusFilter) {
        filters["status"] = statusFilter;
      }
      if (priorityFilter) {
        filters["priority"] = priorityFilter;
      }

      const sortParams = sorting.map((sort) => ({
        column: sort.id,
        direction: sort.desc ? "desc" : "asc",
      }));

      console.log("Filters:", filters);
      const response = await axiosInstance.get("/api/tasks", {
        params: {
          sorting: JSON.stringify(sortParams),
          filters: JSON.stringify(filters),
          page,
          pageSize,
        },
      });
      console.log("Fetching tasks with filters:", filters);

      setTotalTasks(response?.data?.totalTasks || 0);
      setTasks(response?.data?.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [page, sorting, statusFilter, priorityFilter]);

  const columns = useMemo(() => getTasksTableColumns(), []);

  const table = useReactTable({
    data: tasks,
    columns,
    manualSorting: true,
    manualFiltering: true,
    pageCount: totalTasks,
    manualPagination: true,
    state: {
      sorting,
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return {
    tasks,
    loading,
    setPage,
    totalTasks,
    sorting,
    setSorting,
    pageSize,
    page,
    refetch: fetchTasks,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    table,
    columns,
  };
};

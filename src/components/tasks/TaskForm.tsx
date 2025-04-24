"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useTasks, useTasksList } from "@/hooks/useTasks";
import { taskSchema } from "@/schemas/taskSchema";
import { Loader, Pencil, PlusCircle } from "lucide-react";
import { z } from "zod";
import { FormFieldWrapper } from "../ui/FormFieldWrapper";
import { Task } from "@/generated/prisma";
import { useState } from "react";
interface TaskFormProps {
    task?: Task;
}
export default function TaskForm({ task }: TaskFormProps) {
    const { form, createTask, loading, statusOptions, priorityOptions, updateTask } = useTasks(task);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { refetch } = useTasksList()
    // If taskId is provided, use update logic
    const isUpdating = task !== undefined;

    async function onSubmit(data: z.infer<typeof taskSchema>) {
        try {
            if (isUpdating) {
                await updateTask(task.id, data);
            } else {
                await createTask(data);
            }
            refetch()
            // Close modal after success
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                {isUpdating ? (
                    <Button variant="ghost" size="sm">
                        <Pencil className="mr-2 h-4 w-4 text-blue-500  hover:text-blue-600" />
                        Edit
                    </Button>
                ) : (
                    <Button variant="outline">
                        <PlusCircle className="mr-2" />
                        Create Task
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isUpdating ? "Edit Task" : "Create New Task"}</DialogTitle>
                    <DialogDescription>
                        {isUpdating ? "Update your task details." : "Fill in the task details below and hit save."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            name="title"
                            label="Title"
                            placeholder="Task title"
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            placeholder="Describe the task"
                            type="textarea"
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="priority"
                            label="Priority"
                            placeholder="Select priority"
                            type="select"
                            options={priorityOptions}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="status"
                            label="Status"
                            placeholder="Select status"
                            type="select"
                            options={statusOptions}
                        />

                        <DialogFooter>
                            <DialogTrigger asChild>
                                <Button disabled={loading} type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogTrigger>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                                {isUpdating ? "Update Task" : "Save Task"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

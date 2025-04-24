"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
    ArrowUpDown,
    CircleDashed,
    Clock,
    MoreVertical,
    Pencil,
    Text,
    Trash,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPriorityIcon, getStatusIcon } from "@/lib/utils";
import { Priority, Status, Task } from "@/generated/prisma";
import { TaskDelete } from "./DeleteTask";
import TaskForm from "./TaskForm";


export function getTasksTableColumns(): ColumnDef<Task>[] {
    return [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("title")}</div>
            ),
            meta: {
                label: "Title",
                placeholder: "Search titles...",
                variant: "text",
                icon: Text,
            },
            enableColumnFilter: true,
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <div className="text-muted-foreground text-sm">
                    {row.getValue("description")}
                </div>
            ),
            meta: {
                label: "Description",
                placeholder: "Search descriptions...",
                variant: "text",
                icon: Text,
            },
            enableColumnFilter: true,
        },
        {
            accessorKey: "priority",
            header: "Priority",
            cell: ({ row }) => {
                const priority = row.getValue("priority") as Task["priority"];
                const Icon = getPriorityIcon(priority);
                return (
                    <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
                        <Icon />
                        <span className="capitalize">{priority}</span>
                    </Badge>
                );
            },
            meta: {
                label: "Priority",
                variant: "multiSelect",
                options: ["low", "medium", "high"].map((priority) => ({
                    label: priority.charAt(0).toUpperCase() + priority.slice(1),
                    value: priority,
                    icon: getPriorityIcon(priority as Priority),
                })),
                icon: ArrowUpDown,
            },
            enableColumnFilter: true,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as Task["status"];
                const Icon = getStatusIcon(status);
                return (
                    <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
                        <Icon />
                        <span className="capitalize">{status}</span>
                    </Badge>
                );
            },
            meta: {
                label: "Status",
                variant: "multiSelect",
                options: ["pending", "completed"].map((status) => ({
                    label: status.charAt(0).toUpperCase() + status.slice(1),
                    value: status,
                    icon: getStatusIcon(status as Status),
                })),
                icon: CircleDashed,
            },
            enableColumnFilter: true,
        },

        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt"));
                return date.toLocaleDateString();
            },
            meta: {
                label: "Created At",
                variant: "dateRange",
                icon: Clock,
            },
            enableColumnFilter: true,
        },
        {
            id: "actions",
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const task = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">

                            <DropdownMenuItem asChild>
                                <TaskForm task={task} />
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <TaskDelete taskId={task.id} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>

                    </DropdownMenu>
                );
            },
        },
    ];
}

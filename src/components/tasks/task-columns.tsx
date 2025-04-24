"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
    ArrowUpDown,
    CircleDashed,
    Clock,
    MoreVertical,
    Text
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Priority, Status, Task } from "@/generated/prisma";
import { getPriorityIcon, getStatusIcon } from "@/lib/utils";
import { TaskDelete } from "./DeleteTask";
import TaskForm from "./TaskForm";
import { DataTableColumnHeader } from "../ui/DataTableColumnHeader";


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
            id: "status",
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ cell }) => {
                const status = ["pending", "completed"].find(
                    (status) => status === cell.getValue<Task["status"]>(),
                );

                if (!status) return null;

                const Icon = getStatusIcon(status as Status);

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
            id: "priority",
            accessorKey: "priority",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Priority" />
            ),
            cell: ({ cell }) => {
                const priority = ["low", "medium", "high"].find(
                    (priority) => priority === cell.getValue<Task["priority"]>(),
                );

                if (!priority) return null;

                const Icon = getPriorityIcon(priority as Priority);

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

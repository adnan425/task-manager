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
import { DataTableColumnHeader } from "../ui/DataTableColumnHeader";
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

                const getStatusVariant = (status: string) => {
                    switch (status) {
                        case "pending":
                            return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
                        case "completed":
                            return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
                        default:
                            return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
                    }
                };

                return (
                    <Badge
                        variant="outline"
                        className={`py-1 [&>svg]:size-3.5 ${getStatusVariant(status)}`}
                    >
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

                const getPriorityVariant = (priority: string) => {
                    switch (priority) {
                        case "low":
                            return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
                        case "medium":
                            return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100";
                        case "high":
                            return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
                        default:
                            return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
                    }
                };

                return (
                    <Badge
                        variant="outline"
                        className={`py-1 [&>svg]:size-3.5 ${getPriorityVariant(priority)}`}
                    >
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

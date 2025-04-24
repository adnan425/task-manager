import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
export type Task = {
    id: string;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    status: "pending" | "completed";
};
export const data: Task[] = [
    {
        id: "t1",
        title: "Fix bug in payment page",
        description: "Resolve 500 error on production",
        priority: "high",
        status: "pending",
    },
    {
        id: "t2",
        title: "Update README",
        description: "Add setup instructions for new devs",
        priority: "low",
        status: "completed",
    },
    {
        id: "t3",
        title: "Design dashboard layout",
        description: "Create wireframes for the analytics dashboard",
        priority: "medium",
        status: "pending",
    },
    {
        id: "t4",
        title: "Email template styling",
        description: "Fix broken mobile styles in welcome email",
        priority: "medium",
        status: "completed",
    },
];

export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => <div className="text-muted-foreground text-sm">{row.getValue("description")}</div>,
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const priority = row.getValue("priority");
            const color =
                priority === "high" ? "text-red-600" :
                    priority === "medium" ? "text-yellow-600" :
                        "text-green-600";
            return <span className={`capitalize font-semibold ${color}`}>{priority}</span>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status");
            return <span className={`capitalize ${status === "completed" ? "text-green-600" : "text-gray-600"}`}>{status}</span>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const task = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log("Edit", task)}>Edit Task</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("Delete", task)}>Delete Task</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
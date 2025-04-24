"use client";

import { getTasksTableColumns } from "@/components/tasks/task-columns";
import TaskForm from "@/components/tasks/TaskForm";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/table-pagination";
import { useTasksList } from '@/hooks/useTasks';
import { SelectValue } from "@radix-ui/react-select";
import {
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";
import {
  Loader
} from "lucide-react";
import * as React from "react";

export default function TaskTable() {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility] = React.useState<VisibilityState>({});
  const [statusFilter, setStatusFilter] = React.useState("");
  const [priorityFilter, setPriorityFilter] = React.useState("");
  // Fetch tasks using the custom hook
  const { tasks, loading, sorting, setSorting, totalTasks, page, pageSize, setPage } = useTasksList();

  const columns = getTasksTableColumns();
  const table = useReactTable({
    data: tasks || [],
    columns,
    manualSorting: true,
    manualFiltering: true,
    pageCount: totalTasks,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex: page - 1,
        pageSize: pageSize,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });


  return (
    <div className="flex justify-center min-h-screen flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-6xl px-4 overflow-x-auto ">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-center">
          Your Tasks
        </h1>
        <p className="leading-7 mt-4 text-muted-foreground text-center max-w-2xl mx-auto px-4">
          View, filter, and manage your personal tasks. Sort by priority or status, and keep track of what matters most.

        </p>

        <div className="flex flex-wrap items-center gap-3 py-4">

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              table.getColumn("status")?.setFilterValue(value);
            }}
          >
            <SelectTrigger className=" ">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={priorityFilter}
            onValueChange={(value) => {
              setPriorityFilter(value);
              table.getColumn("priority")?.setFilterValue(value);
            }}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select a priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Priority</SelectLabel>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>


          <div className="ml-auto">
            <TaskForm />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {
                loading ? <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex justify-center items-center h-full">
                      <Loader className="animate-spin h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow> : <>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </>
              }

            </TableBody>
          </Table>
        </div>
        {/* Only show pagination when not in loading state */}
        {!loading && !(loading && tasks.length === 0) && (
          <DataTablePagination
            table={table}
            pageSize={pageSize}
            onPaginationChange={setPage}
            rowCount={totalTasks}
            currentPage={page}
          />
        )}

      </div>
    </div>

  );
}

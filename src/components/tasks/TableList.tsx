import Filters from "@/components/tasks/TableHeader";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/table-pagination";
import { useTasksList } from '@/hooks/useTasks';
import { flexRender } from "@tanstack/react-table";
import { Loader } from "lucide-react";
import { TaskDelete } from "./DeleteTask";
import TaskForm from "./TaskForm";

const TableList = () => {
    const {
        tasks, loading, totalTasks, page, pageSize, setPage,
        table, columns, refetch,
        statusFilter, priorityFilter, setStatusFilter, setPriorityFilter
    } = useTasksList()
    return (
        <>
            <div className='flex items-center justify-between mb-2'>
                <Filters
                    statusFilter={statusFilter}
                    priorityFilter={priorityFilter}
                    setStatusFilter={setStatusFilter}
                    setPriorityFilter={setPriorityFilter}
                />
                <div className="ml-auto">
                    <TaskForm refetch={refetch} />
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
                                            {row.getVisibleCells().map((cell) => {
                                                // If this is the actions cell, inject refetch to TaskForm and TaskDelete
                                                if (cell.column.id === 'actions') {
                                                    const task = row.original;
                                                    return (
                                                        <TableCell key={cell.id}>
                                                            <TaskForm task={task} refetch={refetch} />
                                                            <TaskDelete taskId={task.id} refetch={refetch} />
                                                        </TableCell>
                                                    );
                                                }
                                                return (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                );
                                            })}
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
            <DataTablePagination
                table={table}
                pageSize={pageSize}
                onPaginationChange={setPage}
                rowCount={totalTasks}
                currentPage={page}
                loading={loading}
                data={tasks}
            />
        </>
    )
}

export default TableList
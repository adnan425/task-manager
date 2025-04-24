import React from 'react'
import Filters from "@/components/tasks/TableHeader";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow, TableHeader
} from "@/components/ui/table";
import { useTasksList } from '@/hooks/useTasks';
import { flexRender } from "@tanstack/react-table";
import { Loader } from "lucide-react";
import { DataTablePagination } from "@/components/ui/table-pagination";

const TableList = () => {
    const { tasks, loading, totalTasks, page, pageSize, setPage, table, columns } = useTasksList()
    return (
        <>
            <Filters />
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
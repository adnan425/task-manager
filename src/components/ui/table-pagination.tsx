
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Table } from '@tanstack/react-table';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    pageSize: number;
    onPaginationChange: (pageIndex: number, pageSize: number) => void;
    rowCount: number;
    currentPage: number; // Add currentPage prop
}

export function DataTablePagination<TData>({
    table,
    pageSize,
    onPaginationChange,
    rowCount,
    currentPage,
}: DataTablePaginationProps<TData>) {
    const totalRows = rowCount;
    const canGoNextPage = currentPage + 1 <= Math.ceil(totalRows / pageSize);
    const canGoPreviousPage = currentPage > 1;

    const paginationButtons = [

        {
            icon: ArrowLeft,
            onClick: () => onPaginationChange(currentPage - 1, pageSize),
            disabled: !canGoPreviousPage,
            srText: 'Previous page',
            mobileView: '',
            text: 'Previous',
        },
        {
            icon: ArrowRight,
            onClick: () => {
                onPaginationChange(currentPage + 1, pageSize);
            },
            disabled: !canGoNextPage,
            srText: 'Next page',
            mobileView: '',
            text: 'Next',
        },
    ];

    const firstRowIndex = (currentPage - 1) * pageSize + 1;
    const lastRowIndex = Math.min(totalRows, firstRowIndex + pageSize - 1);

    return (
        <div className="flex items-center justify-end my-2">

            <div className="flex items-center gap-x-6 lg:gap-x-8">
                <p className="hidden text-sm tabular-nums text-gray-500 sm:block">
                    Showing{' '}
                    <span className="font-medium text-gray-900 dark:text-gray-50">
                        {firstRowIndex}-{lastRowIndex}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium text-gray-900 dark:text-gray-50">
                        {totalRows}
                    </span>
                </p>
                <div className="flex items-center gap-x-1.5">
                    {paginationButtons.map((button, index) => (
                        <Button
                            key={index}
                            variant="secondary"
                            className={cn(button.mobileView, 'p-1.5')}
                            onClick={() => {
                                button.onClick();
                                table.resetRowSelection();
                            }}
                            disabled={button.disabled}
                        >
                            <span className="sr-only">{button.srText}</span>
                            {button.text}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

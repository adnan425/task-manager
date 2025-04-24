import React from 'react';

export const Spinner = ({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    return (
        <div
            className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]}`}
            role="status"
        />
    );
};

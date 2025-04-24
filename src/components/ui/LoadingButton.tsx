import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/Spinner'
import React from 'react'

interface Props {
    loading?: boolean,
    type?: "button" | "submit",
    label: string
}
const LoadingButton = ({ loading = false, type = "button", label }: Props) => {
    return (
        <Button type={type} className="w-full" disabled={loading}>
            {loading ? <Spinner size="sm" /> : label}
        </Button>
    )
}

export default LoadingButton
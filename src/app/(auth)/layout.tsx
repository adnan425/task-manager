import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { GalleryVerticalEnd } from 'lucide-react'
import Link from 'next/link'
import React, { PropsWithChildren } from 'react'

const AuthLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    Task Manager.
                </Link>
                <div className={cn("flex flex-col gap-6")} >
                    <Card>
                        {children}
                    </Card>
                    <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                        and <a href="#">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthLayout
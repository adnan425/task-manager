"use client"
import {
    CardContent
} from "@/components/ui/card"
import LoadingButton from "@/components/ui/LoadingButton"
import { useSignIn } from "@/hooks/auth/useSignIn"
import AuthHeader from "../_components/AuthHeader"
import AuthInput from "../_components/AuthInput"
import Link from "next/link"

export default function SignInPage() {
    const { register, handleSubmit, errors, loading } = useSignIn();

    return (
        <>
            <AuthHeader
                title="Welcome back"
                description="Enter your credentials to access your account"
            />
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                        <div className="grid gap-6">
                            <AuthInput
                                label="Email"
                                name="email"
                                register={register}
                                error={errors.email?.message}
                            />
                            <AuthInput
                                label="Password"
                                name="password"
                                register={register}
                                error={errors.password?.message}
                                type="password"
                            />
                            <LoadingButton label="Login" loading={loading} type="submit" />
                        </div>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/sign-up" className="underline underline-offset-4">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </form>
            </CardContent>
        </>
    )
}

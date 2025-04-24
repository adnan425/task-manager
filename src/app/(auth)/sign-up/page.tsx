"use client"
import {
    CardContent
} from "@/components/ui/card"
import LoadingButton from "@/components/ui/LoadingButton"
import AuthHeader from "../_components/AuthHeader"
import AuthInput from "../_components/AuthInput"
import Link from "next/link"
import { useSignUp } from "@/hooks/auth/useSignUp"

export default function SignUpPage() {
    const { register, handleSubmit, errors, loading } = useSignUp();

    return (
        <>
            <AuthHeader
                title="Create your account"
                description="Sign up to get started and access all features"
            />
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                        <div className="grid gap-6">
                            <AuthInput
                                label="First Name"
                                name="first_name"
                                register={register}
                                error={errors.first_name?.message}
                            />
                            <AuthInput
                                label="Last Name"
                                name="last_name"
                                register={register}
                                error={errors.last_name?.message}
                            />
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
                            <LoadingButton label="Register" loading={loading} type="submit" />
                        </div>
                        <div className="text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/sign-in" className="underline underline-offset-4">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </form>
            </CardContent>
        </>
    )
}

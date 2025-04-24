'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { loginSchema, LoginSchemaType } from '@/schemas/authSchema';

export const useSignIn = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginSchemaType) => {
        setLoading(true);
        try {
            const res = await axiosInstance.post("/api/sign-in", data);
            router.push("/");
        } catch (err: any) {
            console.error("Login error:", err);
            const message =
                err?.response?.status === 401 && err?.response?.data?.error
                    ? err.response.data.error
                    : err?.response?.data?.message ||
                    err?.message ||
                    "Oops! That login didn’t work. Try again or reset your password.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        loading,
    };
};

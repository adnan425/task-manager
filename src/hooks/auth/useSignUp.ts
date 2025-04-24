'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import { registerSchema, RegisterSchemaType } from '@/schemas/authSchema';

export const useSignUp = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterSchemaType>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterSchemaType) => {
        setLoading(true);
        try {
            const res = await axiosInstance.post("/api/sign-up", data);

            toast.success(
                res.data.message || `Welcome, ${data.first_name}! Your account has been created.`
            );

            router.push("/sign-in");
        } catch (err: any) {
            const defaultMessage = "Something went wrong while creating your account. Please try again.";
            const backendMessage = err?.response?.data?.message;

            const fieldErrors = err?.response?.data?.errors;
            const firstFieldError = fieldErrors
                ? Object.values(fieldErrors)?.[0]?.[0]
                : null;

            const message = firstFieldError || backendMessage || err.message || defaultMessage;

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

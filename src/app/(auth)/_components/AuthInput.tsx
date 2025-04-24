'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

interface Props {
    label: string;
    name: string;
    type?: 'text' | 'password';
    placeholder?: string;
    register?: any; // from react-hook-form
    error?: string; // to show error
}

const AuthInput = ({ label, type = 'text', name, placeholder, register, error }: Props) => {
    return (
        <div className="grid">
            <Label className='mb-1' htmlFor={name}>{label}</Label>
            <Input
                id={name}
                type={type}
                placeholder={placeholder}
                {...(register ? register(name) : {})}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default AuthInput;

"use client"
import RegisterCard from '@/components/auth/RegisterCard';
import { useRegisterMutation } from '@/redux/api/authApiSlice';
import React from 'react';

const RegisterPage =  () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <RegisterCard />
    </div>
    );
};

export default RegisterPage;

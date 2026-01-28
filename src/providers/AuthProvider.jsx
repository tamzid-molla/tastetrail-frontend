"use client"
import { useProfileQuery } from '@/redux/api/authApiSlice';
import { setUser } from '@/redux/api/authSlice';
import React, { useEffect } from 'react';
import {useDispatch } from 'react-redux';

const AuthProvider = ({ children }) => {
    const { error, data, isLoading } = useProfileQuery();
    const dispatch = useDispatch();
    console.log(data, error, isLoading);
    useEffect(() => {
        if (data) {
            dispatch(setUser(data));
        }
    }, [data, dispatch]);

    return <>{children}</>
};

export default AuthProvider;
"use client"
import { store } from '@/redux/store/store';
import React from 'react';
import { Provider } from 'react-redux';

const AuthProvider = ({ children }) => {
    return <Provider store={store}>{children}</Provider>
};

export default AuthProvider;
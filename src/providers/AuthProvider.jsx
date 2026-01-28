"use client";
import GlobalLoader from "@/components/shared/GlobalLoader";
import { useProfileQuery } from "@/redux/api/authApiSlice";
import { setUser } from "@/redux/api/authSlice";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const AuthProvider = ({ children }) => {
  const { error, data, isLoading } = useProfileQuery();
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "An error occurred during login please try again later!");
      router.push("/login");
    }
    if (data) {
      dispatch(setUser(data));
    }
  }, [data, dispatch, isLoading, error, router]);
    
    if (isLoading) {
      return <GlobalLoader></GlobalLoader>;
    }
      console.log(data, error, isLoading);

  return <>{children}</>;
};

export default AuthProvider;

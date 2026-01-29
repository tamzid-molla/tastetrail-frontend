"use client";
import GlobalLoader from "@/components/shared/GlobalLoader";
import { useProfileQuery } from "@/redux/api/authApiSlice";
import { clearUser, setUser } from "@/redux/api/authSlice";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { error, data: user, isLoading, isFetching } = useProfileQuery();
  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
    if (error) {
      dispatch(clearUser());
      router.push("/login");
    }
  }, [user, dispatch, router, error]);

  if (isLoading || isFetching) {
    return <GlobalLoader message="Checking session..." />;
  }

  return <>{children}</>;
};

export default AuthProvider;

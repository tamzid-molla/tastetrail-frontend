"use client";
import React, { useEffect } from "react";
import GlobalLoader from "@/components/shared/GlobalLoader";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Home() {
  const router = useRouter();
  const user = useSelector((state) => state.auth?.user);
  console.log("home user",user);

  useEffect(() => {
    if (user) {
      // User exists, redirect based on role
      if (user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/user");
      }
    } else {
      // No user, redirect to login
      router.replace("/login");
    }
  }, [user, router]);

  return <GlobalLoader message="Redirecting..." />;
}

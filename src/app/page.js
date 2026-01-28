"use client";
import React from "react";
import useRoleBasedAccess from "@/middleware/useRoleBasedAccess";
import GlobalLoader from "@/components/shared/GlobalLoader";

export default function Home() {
  // Use role-based access control
  useRoleBasedAccess();

  return (
    <GlobalLoader></GlobalLoader>
  );
}

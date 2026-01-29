"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, Lock, Eye } from "lucide-react";
import LogoSvg from "../shared/LogoSvg";
import Link from "next/link";
import { useState } from "react";
import { useLoginMutation } from "@/redux/api/authApiSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await login(data).unwrap();
      toast.success("Login successful!");

      // Redirect to home where role-based access hook will handle the final redirect
      router.push("/");
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred during login please try again later!");
      console.error(err);
    }
  };

  return (
    <Card className="w-full max-w-md rounded-2xl shadow-lg">
      <CardHeader className="flex flex-col items-center gap-2">
        <LogoSvg />
        <h1 className="text-xl font-semibold">TasteTrail</h1>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-center">Welcome back</h1>
            <p className="text-sm text-muted-foreground text-center">Sign in to manage your recipes and meal plans</p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="you@example.com"
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                {...register("password")}
              />
              <Eye
                className="absolute right-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <Button className="w-full rounded-xl cursor-pointer" type="submit" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In →"}
          </Button>

          {isError && (
            <div className="text-red-500 text-sm text-center mt-2">
              {error?.data?.message || "An error occurred during login"}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" />
            Or continue with
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="">
            <p className="text-center text-sm text-muted-foreground">
              New to TasteTrail?
              <Link href="/register" className="text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Mail, Lock, Upload } from "lucide-react";
import LogoSvg from "../shared/LogoSvg";
import Image from "next/image";
import Link from "next/link";
import { useRegisterMutation } from "@/redux/api/authApiSlice";

const registerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  image: z.any().optional(),
});

export default function RegisterCard() {
  const [imagePreview, setImagePreview] = useState(null);
  const [register, { isLoading, isError, error }] = useRegisterMutation();

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    if (data.image && data.image.length > 0) {
      const file = data.image[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("image", { message: "Image size must be less than 5MB" });
        return;
      }

      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("image", { message: "Please upload a valid image file (JPEG, PNG, or WEBP)" });
        return;
      }
    }

    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }
    try {
      await register(formData).unwrap();
      reset();
      setImagePreview(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="w-full max-w-md rounded-2xl shadow-lg">
      <CardHeader className="flex flex-col items-center gap-2">
        <LogoSvg />
        <h1 className="text-xl font-semibold">Create Account</h1>
        <p className="text-sm text-muted-foreground">Join TasteTrail today</p>
      </CardHeader>

      <CardContent className="space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Your name"
                className={`pl-10 ${errors.fullName ? "border-red-500" : ""}`}
                {...registerForm("fullName")}
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
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
                {...registerForm("email")}
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
                type="password"
                placeholder="••••••••"
                className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                {...registerForm("password")}
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Image</label>

            <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 p-4 text-sm hover:bg-muted">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  handleImageChange(e);
                  registerForm("image").onChange(e);
                  if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    if (file.size > 5 * 1024 * 1024) {
                      setError("image", { message: "Image size must be less than 5MB" });
                      e.target.value = null;
                      return;
                    }

                    // Check file type
                    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
                    if (!validTypes.includes(file.type)) {
                      setError("image", { message: "Please upload a valid image file (JPEG, PNG, or WEBP)" });
                      e.target.value = null;
                      return;
                    }

                    // Clear any previous error
                    if (errors.image) {
                      setError("image", { message: undefined });
                    }
                  }
                }}
              />

              {imagePreview ? (
                <Image
                  width={100}
                  height={100}
                  src={imagePreview}
                  alt="Preview"
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-5 w-5" />
                  <span>Upload profile image</span>
                </div>
              )}
            </label>
            {errors.image && errors.image.message && (
              <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button className="w-full rounded-xl cursor-pointer" type="submit" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up →"}
          </Button>

          {isError && (
            <div className="text-red-500 text-sm text-center mt-2">
              {error?.data?.message || "An error occurred during registration"}
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

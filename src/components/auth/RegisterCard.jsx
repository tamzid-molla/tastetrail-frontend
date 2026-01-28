"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Mail, Lock, Upload } from "lucide-react";
import LogoSvg from "../shared/LogoSvg";
import Image from "next/image";
import Link from "next/link";

export default function RegisterCard() {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <Card className="w-full max-w-md rounded-2xl shadow-lg">
      <CardHeader className="flex flex-col items-center gap-2">
        <LogoSvg />
        <h1 className="text-xl font-semibold">Create Account</h1>
        <p className="text-sm text-muted-foreground">
          Join TasteTrail today
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Your name" className="pl-10" />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input type="email" placeholder="you@example.com" className="pl-10" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="••••••••"
              className="pl-10"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Profile Image</label>

          <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 p-4 text-sm hover:bg-muted">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />

            {imagePreview ? (
              <Image width={100} height={100}
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
        </div>

        {/* Submit */}
        <Button className="w-full rounded-xl cursor-pointer">
          Sign Up →
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

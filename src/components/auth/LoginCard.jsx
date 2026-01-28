"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, Lock, Eye } from "lucide-react";
import LogoSvg from "../shared/LogoSvg";
import Link from "next/link";

export default function LoginCard() {
  return (
    <Card className="w-full max-w-md rounded-2xl shadow-lg">
      <CardHeader className="flex flex-col items-center gap-2">
        <LogoSvg />
        <h1 className="text-xl font-semibold">TasteTrail</h1>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-center">Welcome back</h1>
          <p className="text-sm text-muted-foreground text-center">Sign in to manage your recipes and meal plans</p>
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
            <Input type="password" placeholder="••••••••" className="pl-10 pr-10" />
            <Eye className="absolute right-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer" />
          </div>
        </div>

        {/* Submit */}
        <Button className="w-full rounded-xl  cursor-pointer">Sign In →</Button>

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
      </CardContent>
    </Card>
  );
}

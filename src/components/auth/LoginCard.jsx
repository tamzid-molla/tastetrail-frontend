"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, Eye } from "lucide-react";
import LogoSvg from "../shared/LogoSvg";

export default function LoginCard() {
  return (
    <Card className="w-full max-w-md rounded-2xl shadow-lg">
      <CardHeader className="flex flex-col items-center gap-2">
        <LogoSvg />
        <h1 className="text-xl font-semibold">TasteTrail</h1>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tabs */}
        <Tabs defaultValue="signin">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger  value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="you@example.com"
              className="pl-10"
            />
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
              className="pl-10 pr-10"
            />
            <Eye className="absolute right-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer" />
          </div>
        </div>

        <div className="text-right">
          <button className="text-sm text-primary hover:underline">
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <Button className="w-full rounded-xl">
          Sign In →
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" />
          Or continue with
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="gap-2">
            G Google
          </Button>
          <Button variant="outline" className="gap-2">
            GitHub
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

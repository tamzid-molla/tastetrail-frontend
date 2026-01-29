"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LogoSvg from "../shared/LogoSvg";
import { useProfileQuery } from "@/redux/api/authApiSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearUser } from "@/redux/api/authSlice";
import { useRouter } from "next/navigation";

export function DashboardHeader() {
  const { data: userData } = useProfileQuery();
  const dispatch = useDispatch();
  const router = useRouter();

  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(clearUser()); // Still clear user even if backend fails
    } finally {
      // Redirect to login
      router.push("/login");
    }
  };

  return (
    <Card className="w-full rounded-none py-3">
      <div className="flex items-center justify-between w-11/12 mx-auto">
        <div className="flex items-center gap-2">
          <LogoSvg />
          <h2 className="text-2xl font-bold">Taste Trail</h2>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userData?.user?.photo || ""} alt={userData?.user?.name || "Admin"} />
                  <AvatarFallback>{userData?.user?.name?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}

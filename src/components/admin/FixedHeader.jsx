"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChefHat, LogOut, Menu } from "lucide-react";
import { useLogoutMutation, useProfileQuery } from "@/redux/api/authApiSlice";
import { useDispatch } from "react-redux";
import { clearUser } from "@/redux/api/authSlice";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";

const FixedHeader = () => {
  const { data: userData } = useProfileQuery();
  const dispatch = useDispatch();
  const router = useRouter();
  const { toggleSidebar, toggleDesktopSidebar, isDesktopSidebarHidden } = useSidebar();
  const [logout, { error, data, isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      dispatch(clearUser()); // Still clear user even if backend fails
    } finally {
      router.push("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b h-16 flex items-center justify-between px-4 md:px-6 shadow-sm">
      {/* Left side - Menu button and Logo/Name */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={toggleSidebar} className="h-9 w-9 p-0 md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        {isDesktopSidebarHidden && (
          <Button variant="ghost" size="sm" onClick={toggleDesktopSidebar} className="h-9 w-9 p-0 hidden md:flex">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <ChefHat className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold text-gray-900 hidden sm:block">TasteTrail Admin</span>
        <span className="text-xl font-bold text-gray-900 sm:hidden">TT Admin</span>
      </div>

      {/* Right side - User info and logout */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userData?.user?.profilePhoto} alt={userData?.user?.fullName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userData?.user?.fullName?.charAt(0)?.toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{userData?.user?.fullName || "Admin"}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="h-9 w-9 p-0 hover:bg-destructive hover:text-destructive-foreground">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default FixedHeader;

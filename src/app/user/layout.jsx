"use client";
import { Button } from "@/components/ui/button";
import { useProfileQuery, useLogoutMutation } from "@/redux/api/authApiSlice";
import { LogOut, ChefHat, Search, Calendar, Home, X, Menu, Bookmark, Utensils } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

const UserSidebar = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: userData } = useProfileQuery();
  const [logout] = useLogoutMutation();
  const { isSidebarOpen, closeSidebar, isDesktopSidebarHidden, toggleDesktopSidebar, toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/login");
    }
  };

  const navItems = [
    {
      title: "Dashboard",
      url: "/user",
      icon: Home,
    },
    {
      title: "Discover Recipes",
      url: "/user/recipes",
      icon: Search,
    },
    {
      title: "Meal Planning",
      url: "/user/meal-plan",
      icon: Calendar,
    },
    {
      title: "Cooked Recipes",
      url: "/user/cooked",
      icon: Utensils,
    },
    {
      title: "Cookbook",
      url: "/user/cookbook",
      icon: Bookmark,
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      {!isDesktopSidebarHidden && (
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col h-full bg-white border-r">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <ChefHat className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">TasteTrail</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <Link key={item.title} href={item.url}>
                      <div
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userData?.user?.profilePhoto} alt={userData?.user?.fullName} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userData?.user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{userData?.user?.fullName || "User"}</p>
                    <p className="text-xs text-muted-foreground">Member</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/10 bg-opacity-50 z-40 md:hidden" onClick={closeSidebar}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white border-r z-50 md:hidden transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ChefHat className="h-6 w-6 text-primary" />
                  <span className="text-lg font-bold">TasteTrail</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeSidebar();
                  }}
                  className="h-8 w-8 p-0">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.url;
                    return (
                      <Link key={item.title} href={item.url} onClick={closeSidebar}>
                        <div
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userData?.user?.profilePhoto} alt={userData?.user?.fullName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userData?.user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{userData?.user?.fullName || "User"}</p>
                      <p className="text-xs text-muted-foreground">Member</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${isDesktopSidebarHidden ? "" : "md:ml-64"}`}>
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b h-16 flex items-center justify-between px-4 md:px-6 shadow-sm">
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
            <span className="text-xl font-bold text-gray-900 hidden sm:block">TasteTrail</span>
            <span className="text-xl font-bold text-gray-900 sm:hidden">TT</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userData?.user?.profilePhoto} alt={userData?.user?.fullName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userData?.user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{userData?.user?.fullName || "User"}</p>
                <p className="text-xs text-muted-foreground">Member</p>
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
        <div className="pt-16">{children}</div>
      </div>
    </div>
  );
};

export default function UserLayout({ children }) {
  return (
    <SidebarProvider>
      <UserSidebar>{children}</UserSidebar>
    </SidebarProvider>
  );
}

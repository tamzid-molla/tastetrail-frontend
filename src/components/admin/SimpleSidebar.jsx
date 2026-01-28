"use client";
import { Button } from "@/components/ui/button";
import { useProfileQuery } from "@/redux/api/authApiSlice";
import { LogOut, ChefHat, Utensils, Star, Users, Home, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";

const SimpleSidebar = ({ children }) => {
  const pathname = usePathname();
  const { data: userData } = useProfileQuery();
  const { isSidebarOpen, closeSidebar, isDesktopSidebarHidden, toggleDesktopSidebar } = useSidebar();

  const navItems = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Home,
    },
    {
      title: "Recipes",
      url: "/admin/recipes",
      icon: ChefHat,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: Utensils,
    },
    {
      title: "Reviews",
      url: "/admin/reviews",
      icon: Star,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar - Toggleable on medium screens and up */}
      {!isDesktopSidebarHidden && (
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col h-full bg-white border-r">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <ChefHat className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">TasteTrail Admin</span>
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
                  <div className="bg-secondary rounded-full p-1">
                    <ChefHat className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{userData?.user?.name || "Admin"}</p>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay - Shown when isSidebarOpen is true */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/10 bg-opacity-50 z-40 md:hidden" onClick={closeSidebar}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white border-r z-50 md:hidden transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ChefHat className="h-6 w-6 text-primary" />
                  <span className="text-lg font-bold">TasteTrail Admin</span>
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
                    <div className="bg-secondary rounded-full p-1">
                      <ChefHat className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{userData?.user?.name || "Admin"}</p>
                      <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main content area - normally positioned next to sidebar, full width when sidebar is hidden */}
      <div className={`flex-1 transition-all duration-300 ${isDesktopSidebarHidden ? "" : "md:ml-64"}`}>{children}</div>
    </div>
  );
};

export default SimpleSidebar;

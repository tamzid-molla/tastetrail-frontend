"use client";
import { Button } from "@/components/ui/button";
import { useProfileQuery } from "@/redux/api/authApiSlice";
import { LogOut, ChefHat, Utensils, Star, Users, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SimpleSidebar = ({ children }) => {
  const pathname = usePathname();
  const { data: userData } = useProfileQuery();

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
      {/* Sidebar - Visible on medium screens and up, hidden on small screens */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col h-full bg-background border-r">
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
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
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

      {/* Mobile header bar - shown only on small screens */}
      <div className="md:hidden bg-background border-b p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">TasteTrail Admin</span>
        </div>
        <Button variant="outline" size="sm" disabled>
          Menu
        </Button>
      </div>

      {/* Main content area */}
      <div className="md:ml-64 flex-1">{children}</div>
    </div>
  );
};

export default SimpleSidebar;

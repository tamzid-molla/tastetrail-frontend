"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useProfileQuery } from "@/redux/api/authApiSlice";
import { LogOut, ChefHat, Utensils, Star, Users, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { clearUser } from "@/redux/api/authSlice";
import { useRouter } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: userData } = useProfileQuery();
  const dispatch = useDispatch();
  const router = useRouter();

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

  const handleLogout = () => {
    // Clear user from store
    dispatch(clearUser());
    // Redirect to login
    router.push("/login");
  };

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">TasteTrail Admin</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`${
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
                      }`}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2">
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
            <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 w-8 p-0">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

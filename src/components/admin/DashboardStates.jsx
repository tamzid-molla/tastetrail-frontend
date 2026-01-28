"use client";
import { useAllRecipeQuery } from "@/redux/api/recipeApiSlice";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Book, Users, Star, Utensils } from "lucide-react";

const DashboardStates = () => {
  const { data: recipeData, isLoading, isError, error } = useAllRecipeQuery();

  // Mock data for other stats
  const userCount = 124;
  const reviewCount = 89;
  const categoryCount = 15;

  const stats = [
    {
      title: "Total Recipes",
      value: recipeData?.recipes?.length || 0,
      icon: Book,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      change: "+12 this week",
    },
    {
      title: "Total Users",
      value: userCount,
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-100",
      change: "+5 this week",
    },
    {
      title: "Total Reviews",
      value: reviewCount,
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
      change: "+23 this week",
    },
    {
      title: "Categories",
      value: categoryCount,
      icon: Utensils,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
      change: "+2 this week",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`rounded-full p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStates;

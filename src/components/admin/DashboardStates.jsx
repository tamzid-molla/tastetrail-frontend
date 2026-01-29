"use client";
import { useRecipeCountQuery } from "@/redux/api/recipeApiSlice";
import { useReviewCountQuery } from "@/redux/api/reviewApiSlice";
import { useCategoryCountQuery } from "@/redux/api/categoryApiSlice";
import { useUserCountQuery } from "@/redux/api/userApiSlice";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Book, Users, Star, Utensils } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const DashboardStates = () => {
  const { data: recipeCountData, isLoading: recipeLoading, isError: recipeError } = useRecipeCountQuery();
  const { data: reviewCountData, isLoading: reviewLoading, isError: reviewError } = useReviewCountQuery();
  const { data: categoryCountData, isLoading: categoryLoading, isError: categoryError } = useCategoryCountQuery();
  const { data: userCountData, isLoading: userLoading, isError: userError } = useUserCountQuery();

  const isAnyLoading = recipeLoading || reviewLoading || categoryLoading || userLoading;

  const stats = [
    {
      key: "recipes",
      title: "Total Recipes",
      value: recipeCountData?.count || 0,
      weekly: recipeCountData?.weeklyCount || 0,
      icon: Book,
      color: "text-blue-500",
    },
    {
      key: "users",
      title: "Total Users",
      value: userCountData?.count || 0,
      weekly: userCountData?.weeklyCount || 0,
      icon: Users,
      color: "text-green-500",
    },
    {
      key: "reviews",
      title: "Total Reviews",
      value: reviewCountData?.count || 0,
      weekly: reviewCountData?.weeklyCount || 0,
      icon: Star,
      color: "text-yellow-500",
    },
    {
      key: "categories",
      title: "Categories",
      value: categoryCountData?.count || 0,
      weekly: categoryCountData?.weeklyCount || 0,
      icon: Utensils,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
      {stats.map((stat) => {
        const hasError =
          (stat.key === "recipes" && recipeError) ||
          (stat.key === "users" && userError) ||
          (stat.key === "reviews" && reviewError) ||
          (stat.key === "categories" && categoryError);

        const weeklyLabel = stat.weekly > 0 ? `+${stat.weekly} this week` : stat.weekly === 0 ? "No new this week" : "";

        return (
          <Card
            key={stat.key}
            className="relative overflow-hidden rounded-2xl border bg-background shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="relative flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <span className="inline-flex items-center rounded-full bg-primary/5 text-[11px] font-medium text-primary px-2 py-0.5 mt-1">
                  This week
                </span>
              </div>
              <div className="rounded-full p-2 bg-muted">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="relative">
              {isAnyLoading ? (
                <>
                  <Skeleton className="h-7 w-16 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </>
              ) : hasError ? (
                <p className="text-xs text-red-500 mt-1">Failed to load</p>
              ) : (
                <>
                  <div className="text-2xl font-semibold tracking-tight">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{weeklyLabel}</p>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStates;

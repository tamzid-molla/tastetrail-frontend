"use client";
import React from "react";
import { useGetUserNutritionSummaryQuery } from "@/redux/api/userApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Calendar, Flame, Beef, Wheat, Droplets, BarChart3 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NutritionSummaryPage = () => {
  const { data, isLoading, error } = useGetUserNutritionSummaryQuery();

  const nutritionData = data?.summary;
  const dailyTrend = nutritionData?.dailyTrend || [];

  // Format data for chart
  const chartData = dailyTrend.map((day) => ({
    date: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
    calories: day.calories,
    meals: day.meals,
  }));

  return (
    <div className="p-4 pt-6 md:pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Nutrition Summary
            </CardTitle>
            <p className="text-base sm:text-lg text-gray-600 mt-2">Your weekly nutrition insights and trends</p>
          </CardHeader>
        </Card>

        {/* Key Metrics */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="mb-6">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Unable to load nutrition data. Please try again later.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Weekly Calories</CardTitle>
                  <Flame className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{nutritionData?.weeklyCalories || 0}</div>
                  <p className="text-xs text-muted-foreground">Total consumed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Meals Cooked</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{nutritionData?.weeklyMeals || 0}</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg per Meal</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{nutritionData?.averageCaloriesPerMeal || 0}</div>
                  <p className="text-xs text-muted-foreground">Calories</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Days</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dailyTrend.filter((day) => day.meals > 0).length}</div>
                  <p className="text-xs text-muted-foreground">Days with cooking</p>
                </CardContent>
              </Card>
            </div>

            {/* Macro Nutrients */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Beef className="h-5 w-5 text-primary" />
                  Macro Nutrient Estimates
                </CardTitle>
                <p className="text-sm text-muted-foreground">Based on your cooked meals this week</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Beef className="h-8 w-8 mx-auto mb-2 text-red-500" />
                    <p className="text-2xl font-bold text-red-600">{nutritionData?.macroNutrients?.protein || 0}g</p>
                    <p className="text-sm text-muted-foreground">Protein</p>
                    <p className="text-xs text-muted-foreground mt-1">~20% of calories</p>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <Wheat className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-2xl font-bold text-yellow-600">
                      {nutritionData?.macroNutrients?.carbohydrates || 0}g
                    </p>
                    <p className="text-sm text-muted-foreground">Carbohydrates</p>
                    <p className="text-xs text-muted-foreground mt-1">~50% of calories</p>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <Droplets className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold text-blue-600">{nutritionData?.macroNutrients?.fat || 0}g</p>
                    <p className="text-sm text-muted-foreground">Fat</p>
                    <p className="text-xs text-muted-foreground mt-1">~30% of calories</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Trend Chart */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Weekly Nutrition Trend
                </CardTitle>
                <p className="text-sm text-muted-foreground">Daily calorie intake over the past week</p>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ChartContainer
                    config={{
                      calories: {
                        label: "Calories",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-64 w-full">
                    <BarChart data={chartData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="calories" fill="var(--color-calories)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No data available for the past week</p>
                      <p className="text-sm">Cook some meals to see your nutrition trends</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Section */}
            <Card>
              <CardContent className="py-6 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
                <p className="text-lg font-semibold mb-2">Want to improve your nutrition?</p>
                <p className="text-muted-foreground mb-4">
                  Plan balanced meals and track your progress with our meal planning tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/user/meal-plan">
                    <Button>Plan Balanced Meals</Button>
                  </Link>
                  <Link href="/user/recipes">
                    <Button variant="outline">Find Healthy Recipes</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default NutritionSummaryPage;

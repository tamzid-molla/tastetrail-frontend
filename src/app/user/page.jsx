"use client";
import React, { useState } from "react";
import { useGetPersonalizedRecommendationsQuery } from "@/redux/api/recommendationApiSlice";
import {
  useGetUserCookingStatsQuery,
  useGetUserCookingAnalyticsQuery,
  useSetUserYearlyGoalMutation,
} from "@/redux/api/userApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecipeCard from "@/components/user/RecipeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, ChefHat, Utensils, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart } from "recharts";
import toast from "react-hot-toast";

const UserPage = () => {
  const {
    data: recommendationsData,
    isLoading: recommendationsLoading,
    error: recommendationsError,
  } = useGetPersonalizedRecommendationsQuery();
  const {
    data: cookingStatsData,
    isLoading: statsLoading,
    refetch: refetchCookingStats,
  } = useGetUserCookingStatsQuery();
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    refetch: refetchAnalytics,
  } = useGetUserCookingAnalyticsQuery();
  const [setGoal] = useSetUserYearlyGoalMutation();

  const [targetMeals, setTargetMeals] = useState(120);
  const [isSettingGoal, setIsSettingGoal] = useState(false);

  const cookingStats = cookingStatsData?.stats;
  const recentCookedMeals = cookingStats?.recentCookedMeals || [];
  const analytics = analyticsData?.analytics;

  const handleSetGoal = async () => {
    if (targetMeals <= 0) return;

    setIsSettingGoal(true);
    try {
      await setGoal({ targetMeals: parseInt(targetMeals) }).unwrap();
      toast.success(`Yearly goal set to ${targetMeals} meals for ${new Date().getFullYear()}!`);
      setTargetMeals(120);
      // Refetch analytics to update UI immediately
      refetchAnalytics();
    } catch (error) {
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to set yearly goal. Please try again.");
      }
    } finally {
      setIsSettingGoal(false);
    }
  };

  return (
    <div className="p-4 pt-6 md:pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Your Cooking Dashboard
            </CardTitle>
            <p className="text-base sm:text-lg text-gray-600 mt-2">
              Track your cooking progress and discover personalized recipe recommendations.
            </p>
          </CardHeader>
        </Card>

        {/* Cooking Stats Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" />
              Cooking Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="text-center p-4 border rounded-lg">
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg bg-blue-50">
                  <p className="text-3xl font-bold text-blue-600">{cookingStats?.totalMealsPlanned || 0}</p>
                  <p className="text-sm text-muted-foreground">Meals Planned</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-green-50">
                  <p className="text-3xl font-bold text-green-600">{cookingStats?.totalMealsCooked || 0}</p>
                  <p className="text-sm text-muted-foreground">Meals Cooked</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-purple-50">
                  <p className="text-3xl font-bold text-purple-600">
                    {cookingStats?.totalMealsPlanned > 0
                      ? Math.round((cookingStats.totalMealsCooked / cookingStats.totalMealsPlanned) * 100)
                      : 0}
                    %
                  </p>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cooking Goals & Analytics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Cooking Analytics</CardTitle>
            <p className="text-sm text-gray-600">Track your cooking achievements</p>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-32 w-full" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Goal Setting */}
                <div className="mb-6 p-4 border rounded-lg bg-secondary/10">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex-1">
                      <Label htmlFor="targetMeals" className="text-sm font-medium">
                        {analytics?.goal > 0
                          ? `Yearly goal for ${new Date().getFullYear()}: ${analytics.goal} meals`
                          : `Set your ${new Date().getFullYear()} cooking goal`}
                      </Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="targetMeals"
                          type="number"
                          value={targetMeals}
                          onChange={(e) => setTargetMeals(e.target.value)}
                          placeholder="Enter target meals"
                          className="w-32"
                          min="1"
                          disabled={analytics?.goal > 0}
                        />
                        <Button onClick={handleSetGoal} disabled={isSettingGoal || analytics?.goal > 0} size="sm">
                          {analytics?.goal > 0 ? "Goal Set" : isSettingGoal ? "Setting..." : "Set Goal"}
                        </Button>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{analytics?.goal || 0} meals</p>
                      <p className="text-sm text-muted-foreground">Yearly Goal</p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                {analytics?.goal > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Year Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {analytics?.totalMeals || 0} / {analytics?.goal} meals
                      </span>
                    </div>
                    <Progress value={analytics?.progressPercentage || 0} className="h-3" />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>{analytics?.progressPercentage || 0}% complete</span>
                      <span>{analytics?.mealsRemaining || 0} remaining</span>
                    </div>
                  </div>
                )}

                {/* Streaks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 border rounded-lg bg-orange-50">
                    <p className="text-2xl font-bold text-orange-600">{analytics?.streak?.current || 0}</p>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg bg-amber-50">
                    <p className="text-2xl font-bold text-amber-600">{analytics?.streak?.max || 0}</p>
                    <p className="text-sm text-muted-foreground">Best Streak</p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Chart */}
                  <div>
                    <h3 className="font-semibold mb-3">Monthly Breakdown</h3>
                    {analytics?.monthlyBreakdown?.length > 0 ? (
                      <ChartContainer
                        config={{ meals: { label: "Meals", color: "hsl(var(--chart-1))" } }}
                        className="h-64 w-full">
                        <BarChart data={analytics.monthlyBreakdown}>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="meals" fill="var(--color-meals)" radius={4} />
                        </BarChart>
                      </ChartContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-muted-foreground border rounded">
                        <p>No data available</p>
                      </div>
                    )}
                  </div>

                  {/* Top Cuisines */}
                  <div>
                    <h3 className="font-semibold mb-3">Top Cuisines</h3>
                    {analytics?.topCuisines?.length > 0 ? (
                      <ChartContainer
                        config={Object.fromEntries(
                          analytics.topCuisines.map((item, i) => [
                            item.name,
                            { label: item.name, color: `hsl(var(--chart-${i + 1}))` },
                          ])
                        )}
                        className="h-64 w-full">
                        <PieChart>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Pie
                            data={analytics.topCuisines}
                            dataKey="count"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          />
                        </PieChart>
                      </ChartContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-muted-foreground border rounded">
                        <p>No data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Cooked Meals */}
        {recentCookedMeals.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                <Utensils className="h-5 w-5 text-primary" />
                Recently Cooked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentCookedMeals.slice(0, 6).map((mealPlan) => {
                  const recipe = mealPlan.recipe;
                  return (
                    <Card key={mealPlan._id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative w-full h-32 bg-gray-200">
                        {recipe?.image ? (
                          <img src={recipe.image} alt={recipe.title} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Utensils className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                          {recipe?.title || "Untitled Recipe"}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          {recipe?.cookingTime && <span>{recipe.cookingTime} min</span>}
                          {recipe?.calories && <span>{recipe.calories} cal</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Cooked on {new Date(mealPlan.updatedAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Recommended For You
            </CardTitle>
            <p className="text-sm text-gray-600">
              Discover recipes tailored just for you based on your cooking history and preferences.
            </p>
          </CardHeader>
        </Card>

        {/* Recommendations Grid */}
        {recommendationsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recommendationsError ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Unable to load recommendations. Please try again later.</p>
            </CardContent>
          </Card>
        ) : recommendationsData?.recipes && recommendationsData.recipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recommendationsData.recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/user/recipes">
                <Button variant="outline" size="lg">
                  Discover More Recipes
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">Start cooking to get personalized recommendations!</p>
              <Link href="/user/recipes">
                <Button>Browse All Recipes</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserPage;

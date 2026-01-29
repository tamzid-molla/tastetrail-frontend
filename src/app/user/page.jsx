"use client";
import React from "react";
import { useGetPersonalizedRecommendationsQuery } from "@/redux/api/recommendationApiSlice";
import { useGetUserCookingStatsQuery } from "@/redux/api/userApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecipeCard from "@/components/user/RecipeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, ChefHat, Utensils, Calendar, Bookmark } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const UserPage = () => {
  const { data: recommendationsData, isLoading: recommendationsLoading, error: recommendationsError } = useGetPersonalizedRecommendationsQuery();
  const { data: cookingStatsData, isLoading: statsLoading } = useGetUserCookingStatsQuery();

  const cookingStats = cookingStatsData?.stats;
  const recentCookedMeals = cookingStats?.recentCookedMeals || [];

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
                      : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </div>
              </div>
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
                          <img 
                            src={recipe.image} 
                            alt={recipe.title} 
                            className="object-cover w-full h-full" 
                          />
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
                          {recipe?.cookingTime && (
                            <span>{recipe.cookingTime} min</span>
                          )}
                          {recipe?.calories && (
                            <span>{recipe.calories} cal</span>
                          )}
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

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Link href="/user/meal-plan">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>Meal Planner</span>
                </Button>
              </Link>
              <Link href="/user/cooked">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Utensils className="h-6 w-6" />
                  <span>Cooked Recipes</span>
                </Button>
              </Link>
              <Link href="/user/cookbook">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Bookmark className="h-6 w-6" />
                  <span>My Cookbook</span>
                </Button>
              </Link>
              <Link href="/user/recipes">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Sparkles className="h-6 w-6" />
                  <span>Browse Recipes</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

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

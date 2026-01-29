"use client";
import React from "react";
import { useGetUserCookingStatsQuery } from "@/redux/api/userApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Utensils, Calendar, Clock, Flame } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CookedRecipesPage = () => {
  const { data, isLoading, error } = useGetUserCookingStatsQuery();
  
  const cookedMeals = data?.stats?.recentCookedMeals || [];
  const totalCooked = data?.stats?.totalMealsCooked || 0;

  return (
    <div className="p-4 pt-6 md:pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl flex items-center gap-2">
              <Utensils className="h-6 w-6 text-primary" />
              Cooked Recipes
            </CardTitle>
            <p className="text-base sm:text-lg text-gray-600 mt-2">
              Your collection of successfully cooked meals
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{totalCooked}</p>
                <p className="text-sm text-muted-foreground">Total Cooked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cooked Recipes Grid */}
        {isLoading ? (
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
        ) : error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Unable to load cooked recipes. Please try again later.</p>
              <Link href="/user">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        ) : cookedMeals.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cookedMeals.map((mealPlan) => {
                const recipe = mealPlan.recipe;
                return (
                  <Card key={mealPlan._id} className="overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="relative w-full h-48 bg-gray-200">
                      {recipe?.image ? (
                        <img 
                          src={recipe.image} 
                          alt={recipe.title} 
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Utensils className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Cooked
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-2">
                        {recipe?.title || "Untitled Recipe"}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {recipe?.category?.name && (
                          <span className="bg-secondary px-2 py-1 rounded text-xs">
                            {recipe.category.name}
                          </span>
                        )}
                        {recipe?.cuisine?.name && (
                          <span className="bg-secondary px-2 py-1 rounded text-xs">
                            {recipe.cuisine.name}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{recipe?.cookingTime || 0} min</span>
                        </div>
                        {recipe?.calories && (
                          <div className="flex items-center gap-1">
                            <Flame className="h-4 w-4" />
                            <span>{recipe.calories} cal</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Cooked on {new Date(mealPlan.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {cookedMeals.length >= 10 && (
              <div className="mt-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Showing your most recent cooked recipes. Cook more to expand your collection!
                </p>
                <Link href="/user/meal-plan">
                  <Button variant="outline">
                    Plan More Meals
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Utensils className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-semibold mb-2">No cooked recipes yet</p>
              <p className="text-muted-foreground mb-4">
                Start cooking your planned meals to build your collection!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/user/meal-plan">
                  <Button>Go to Meal Planner</Button>
                </Link>
                <Link href="/user/recipes">
                  <Button variant="outline">Discover Recipes</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CookedRecipesPage;
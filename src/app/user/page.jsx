"use client";
import React from "react";
import { useGetPersonalizedRecommendationsQuery } from "@/redux/api/recommendationApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecipeCard from "@/components/user/RecipeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const UserPage = () => {
  const { data, isLoading, error } = useGetPersonalizedRecommendationsQuery();

  return (
    <div className="p-4 pt-6 md:pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Personalized Recommendations
            </CardTitle>
            <p className="text-base sm:text-lg text-gray-600 mt-2">
              Discover recipes tailored just for you based on your cooking history and preferences.
            </p>
          </CardHeader>
        </Card>

        {/* Recommendations Grid */}
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
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Unable to load recommendations. Please try again later.</p>
            </CardContent>
          </Card>
        ) : data?.recipes && data.recipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data.recipes.map((recipe) => (
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

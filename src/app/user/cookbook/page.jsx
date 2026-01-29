"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Search } from "lucide-react";
import Link from "next/link";
import { useGetSavedRecipesQuery } from "@/redux/api/userApiSlice";
import RecipeCard from "@/components/user/RecipeCard";
import { Skeleton } from "@/components/ui/skeleton";

const CookbookPage = () => {
  const { data, isLoading, isError } = useGetSavedRecipesQuery();
  const recipes = data?.recipes || [];

  return (
    <div className="p-4 pt-6 md:pt-8">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl flex items-center gap-2">
              <Bookmark className="h-6 w-6 text-primary" />
              My Cookbook
            </CardTitle>
            <p className="text-base sm:text-lg text-gray-600 mt-2">Recipes you saved for later.</p>
          </CardHeader>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
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
        ) : isError ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">Failed to load your cookbook.</p>
            </CardContent>
          </Card>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Bookmark className="h-14 w-14 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-semibold mb-2">No saved recipes yet</p>
              <p className="text-muted-foreground mb-5">Browse recipes and save your favorites.</p>
              <Link href="/user/recipes">
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Discover Recipes
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CookbookPage;

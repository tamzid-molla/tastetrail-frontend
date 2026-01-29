"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useAllRecipeQuery } from "@/redux/api/recipeApiSlice";
import { useAllCategoriesQuery } from "@/redux/api/categoryApiSlice";
import { useAllCuisinesQuery } from "@/redux/api/cuisineApiSlice";
import RecipeCard from "@/components/user/RecipeCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const RecipesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const limit = 12;

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset to first page when filters/search change
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, selectedCategory, selectedCuisine, sort]);

  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
      sort,
    };
    if (debouncedQuery) params.q = debouncedQuery;
    if (selectedCategory !== "all") params.category = selectedCategory;
    if (selectedCuisine !== "all") params.cuisine = selectedCuisine;
    return params;
  }, [debouncedQuery, page, selectedCategory, selectedCuisine, sort]);

  const { data: recipesData, isLoading: recipesLoading, isError } = useAllRecipeQuery(queryParams);
  const { data: categoriesData } = useAllCategoriesQuery();
  const { data: cuisinesData } = useAllCuisinesQuery();

  const recipes = recipesData?.recipes || [];
  const total = recipesData?.total || 0;
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return (
    <div className="p-4 pt-6 md:pt-8">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl flex items-center gap-2">
              <Search className="h-6 w-6 text-primary" />
              Discover Recipes
            </CardTitle>
            <p className="text-base sm:text-lg text-gray-600 mt-2">
              Search and filter recipes by name, ingredients, category, or cuisine.
            </p>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search recipes by name or ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoriesData?.categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Cuisine</label>
                  <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Cuisines" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cuisines</SelectItem>
                      {cuisinesData?.cuisines?.map((cuisine) => (
                        <SelectItem key={cuisine._id} value={cuisine._id}>
                          {cuisine.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort</label>
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                      <SelectItem value="topRated">Top Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {(selectedCategory !== "all" || selectedCuisine !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedCuisine("all");
                  }}>
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {recipesLoading ? (
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
        ) : isError ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Failed to load recipes. Please try again.</p>
            </CardContent>
          </Card>
        ) : recipes.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
              <span>
                Showing page {page} of {totalPages} ({total} results)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(p - 1, 1))}>
                Prev
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}>
                Next
              </Button>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No recipes found. Try adjusting your search or filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecipesPage;

"use client";
"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useAllRecipeQuery } from "@/redux/api/recipeApiSlice";

const AdminRecipesPage = () => {
  const { data: recipesData, isLoading, isError, error } = useAllRecipeQuery();

  // Transform API data to match our table structure
  const recipes =
    recipesData?.recipes?.map((recipe) => ({
      id: recipe._id,
      name: recipe.title,
      category: recipe.category?.name || "Uncategorized",
      author: recipe.user?.name || "Unknown",
      addedDate: new Date(recipe.createdAt).toLocaleDateString(),
      cookingTime: `${recipe.cookingTime} mins`,
      difficulty: recipe.difficulty || "Medium",
      calories: recipe.nutritionInfo?.calories || 0,
      status: recipe.isPublished ? "published" : "draft",
      views: recipe.views || 0,
    })) || [];

  const getStatusVariant = (status) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 pt-20 md:pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading recipes...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 pt-20 md:pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">
            Error loading recipes: {error?.data?.message || "Something went wrong"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-20 md:pt-20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-semibold">Manage Recipes</h2>
          <p className="text-base sm:text-lg text-gray-600">View, edit, and manage all recipes in the system.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search recipes..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Link href="/admin/recipes/new">
            <Button className="w-full sm:w-auto">+ Add New Recipe</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recipe List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Category</TableHead>
                  <TableHead className="whitespace-nowrap">Author</TableHead>
                  <TableHead className="whitespace-nowrap">Calories</TableHead>
                  <TableHead className="whitespace-nowrap">Cook Time</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Views</TableHead>
                  <TableHead className="whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipes.map((recipe) => (
                  <TableRow key={recipe.id}>
                    <TableCell className="font-medium max-w-[120px] truncate">{recipe.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{recipe.category}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[100px] truncate">{recipe.author}</TableCell>
                    <TableCell className="whitespace-nowrap">{recipe.calories} cal</TableCell>
                    <TableCell className="whitespace-nowrap">{recipe.cookingTime}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(recipe.status)}>{recipe.status}</Badge>
                    </TableCell>
                    <TableCell>{recipe.views}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRecipesPage;

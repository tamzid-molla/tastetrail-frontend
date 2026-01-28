"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useAllCategoriesQuery } from "@/redux/api/categoryApiSlice";

const AdminCategoriesPage = () => {
  const { data: categoriesData, isLoading, isError, error } = useAllCategoriesQuery();

  // Transform API data to match our table structure
  const categories =
    categoriesData?.categories?.map((category) => ({
      id: category._id,
      name: category.name,
      description: category.description,
      recipeCount: category.recipes?.length || 0,
      createdAt: new Date(category.createdAt).toLocaleDateString(),
      status: category.isActive ? "active" : "inactive",
    })) || [];

  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 pt-20 md:pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading categories...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 pt-20 md:pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">
            Error loading categories: {error?.data?.message || "Something went wrong"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-20 md:pt-20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-semibold">Manage Categories</h2>
          <p className="text-base sm:text-lg text-gray-600">View, edit, and manage recipe categories.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button className="w-full sm:w-auto">+ Add New Category</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Description</TableHead>
                  <TableHead className="whitespace-nowrap">Recipe Count</TableHead>
                  <TableHead className="whitespace-nowrap">Created At</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium max-w-[120px] truncate">{category.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{category.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{category.recipeCount} recipes</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{category.createdAt}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(category.status)}>{category.status}</Badge>
                    </TableCell>
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

export default AdminCategoriesPage;

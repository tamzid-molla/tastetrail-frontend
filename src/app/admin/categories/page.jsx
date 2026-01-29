"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import {
  useAllCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/redux/api/categoryApiSlice";
import CategoryModal from "@/components/admin/CategoryModal";
import EditCategoryModal from "@/components/admin/EditCategoryModal";
import DeleteConfirmation from "@/components/admin/DeleteConfirmation";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

const AdminCategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: categoriesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAllCategoriesQuery(
    { q: debouncedSearchTerm },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Mutation hooks
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  // Transform API data to match our table structure
  const categories =
    categoriesData?.categories?.map((category) => ({
      id: category._id,
      name: category.name,
      recipeCount: category.recipeCount || 0,
      createdAt: new Date(category.createdAt).toLocaleDateString(),
    })) || [];

  const handleAddCategory = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCategoryAdded = () => {
    refetch(); // Refresh the category list
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCategoryUpdated = () => {
    refetch(); // Refresh the category list
    handleEditModalClose();
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleCategoryDeleted = async () => {
    if (selectedCategory) {
      try {
        await deleteCategory(selectedCategory.id).unwrap();
        toast.success("Category deleted successfully!");
        refetch(); // Refresh the category list
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete category");
        console.error("Error deleting category:", error);
      } finally {
        handleDeleteModalClose();
      }
    }
  };

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button className="w-full sm:w-auto" onClick={handleAddCategory}>
            + Add New Category
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category List</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile: stacked cards */}
          <div className="space-y-3 sm:hidden">
            {isLoading
              ? [...Array(5)].map((_, idx) => (
                  <div key={idx} className="border rounded-lg p-3 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-32" />
                    <div className="flex justify-end gap-2 mt-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                ))
              : categories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-3 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground font-semibold">Name</span>
                      <span className="font-medium max-w-[180px] truncate text-right">{category.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground font-semibold">Recipe Count</span>
                      <Badge variant="outline" className="ml-2">
                        {category.recipeCount} recipes
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground font-semibold">Created At</span>
                      <span className="max-w-[180px] truncate text-right">{category.createdAt}</span>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => handleDeleteClick(category)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
          </div>

          {/* Desktop/tablet: scrollable table */}
          <div className="w-full overflow-x-auto hidden sm:block">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Recipe Count</TableHead>
                  <TableHead className="whitespace-nowrap">Created At</TableHead>
                  <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? [...Array(5)].map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-24 inline-block mr-2" />
                          <Skeleton className="h-8 w-24 inline-block" />
                        </TableCell>
                      </TableRow>
                    ))
                  : categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium max-w-[160px] truncate">{category.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{category.recipeCount} recipes</Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap max-w-[160px] truncate">{category.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteClick(category)}>
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

      <CategoryModal isOpen={isModalOpen} onClose={handleModalClose} onCategoryAdded={handleCategoryAdded} />

      <EditCategoryModal
        key={selectedCategory?.id || "empty"}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        category={selectedCategory}
        onCategoryUpdated={handleCategoryUpdated}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleCategoryDeleted}
        itemName={selectedCategory?.name}
        itemType="category"
      />
    </div>
  );
};

export default AdminCategoriesPage;

"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import {
  useAllCuisinesQuery,
  useUpdateCuisineMutation,
  useDeleteCuisineMutation,
  useCreateCuisineMutation,
} from "@/redux/api/cuisineApiSlice";
import CuisineModal from "@/components/admin/CuisineModal";
import EditCuisineModal from "@/components/admin/EditCuisineModal";
import DeleteConfirmation from "@/components/admin/DeleteConfirmation";
import { toast } from "react-hot-toast";

const AdminCuisinesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState(null);

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: cuisinesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAllCuisinesQuery(
    { q: debouncedSearchTerm },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Mutation hooks
  const [createCuisine, { isLoading: isCreating }] = useCreateCuisineMutation();
  const [updateCuisine, { isLoading: isUpdating }] = useUpdateCuisineMutation();
  const [deleteCuisine, { isLoading: isDeleting }] = useDeleteCuisineMutation();

  // Transform API data to match our table structure
  const cuisines =
    cuisinesData?.cuisines?.map((cuisine) => ({
      id: cuisine._id,
      name: cuisine.name,
      recipeCount: cuisine.recipeCount || 0,
      createdAt: new Date(cuisine.createdAt).toLocaleDateString(),
    })) || [];

  const handleAddCuisine = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedCuisine(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedCuisine(null);
  };

  const handleCuisineAdded = () => {
    refetch(); // Refresh the cuisine list
  };

  const handleEditCuisine = (cuisine) => {
    setSelectedCuisine(cuisine);
    setIsEditModalOpen(true);
  };

  const handleCuisineUpdated = () => {
    refetch(); // Refresh the cuisine list
    handleEditModalClose();
  };

  const handleDeleteClick = (cuisine) => {
    setSelectedCuisine(cuisine);
    setIsDeleteModalOpen(true);
  };

  const handleCuisineDeleted = async () => {
    if (selectedCuisine) {
      try {
        await deleteCuisine(selectedCuisine.id).unwrap();
        toast.success("Cuisine deleted successfully!");
        refetch(); // Refresh the cuisine list
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete cuisine");
        console.error("Error deleting cuisine:", error);
      } finally {
        handleDeleteModalClose();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 pt-20 md:pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading cuisines...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 pt-20 md:pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">
            Error loading cuisines: {error?.data?.message || "Something went wrong"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-20 md:pt-20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-semibold">Manage Cuisines</h2>
          <p className="text-base sm:text-lg text-gray-600">View and manage recipe cuisines.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button className="w-full sm:w-auto" onClick={handleAddCuisine}>
            + Add New Cuisine
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cuisine List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Recipe Count</TableHead>
                  <TableHead className="whitespace-nowrap">Created At</TableHead>
                  <TableHead className="whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cuisines.map((cuisine) => (
                  <TableRow key={cuisine.id}>
                    <TableCell className="font-medium max-w-[120px] truncate">{cuisine.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{cuisine.recipeCount} recipes</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{cuisine.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditCuisine(cuisine)}>
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => handleDeleteClick(cuisine)}>
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

      <CuisineModal isOpen={isModalOpen} onClose={handleModalClose} onCuisineAdded={handleCuisineAdded} />

      <EditCuisineModal
        key={`edit-${selectedCuisine?.id || "empty"}`}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        cuisine={selectedCuisine}
        onCuisineUpdated={handleCuisineUpdated}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleCuisineDeleted}
        itemName={selectedCuisine?.name}
        itemType="cuisine"
      />
    </div>
  );
};

export default AdminCuisinesPage;

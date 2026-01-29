"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useAllRecipeQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} from "@/redux/api/recipeApiSlice";
import { useAllCategoriesQuery } from "@/redux/api/categoryApiSlice";
import { useAllCuisinesQuery } from "@/redux/api/cuisineApiSlice";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

const AdminRecipesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRecipeId, setCurrentRecipeId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    category: "",
    cuisine: "",
    cookingTime: "",
    calories: "",
    image: null,
    isFeatured: false,
  });

  // Mutation hooks
  const [createRecipe, { isLoading: isCreating }] = useCreateRecipeMutation();
  const [updateRecipe, { isLoading: isUpdating }] = useUpdateRecipeMutation();
  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation();

  // Fetch categories and cuisines for dropdowns
  const { data: categoriesData } = useAllCategoriesQuery();
  const { data: cuisinesData } = useAllCuisinesQuery();

  const categories = categoriesData?.categories || [];
  const cuisines = cuisinesData?.cuisines || [];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle ingredients (convert to array)
  const handleIngredientsChange = (e) => {
    const value = e.target.value;
    // Convert newline-separated ingredients to array
    const ingredientsArray = value.split("\n").filter((ingredient) => ingredient.trim() !== "");
    setFormData((prev) => ({
      ...prev,
      ingredients: ingredientsArray,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.title ||
      !formData.ingredients.length ||
      !formData.instructions ||
      !formData.category ||
      !formData.cuisine
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Prepare the recipe data as FormData for file upload
      const recipeData = new FormData();
      recipeData.append("title", formData.title);
      recipeData.append("ingredients", JSON.stringify(formData.ingredients));
      recipeData.append("instructions", formData.instructions);
      recipeData.append("category", formData.category);
      recipeData.append("cuisine", formData.cuisine);
      if (formData.cookingTime) recipeData.append("cookingTime", formData.cookingTime);
      if (formData.calories) recipeData.append("calories", formData.calories);
      if (formData.image) recipeData.append("image", formData.image);
      recipeData.append("isFeatured", formData.isFeatured);

      if (editMode) {
        // Update existing recipe
        await updateRecipe({ id: currentRecipeId, recipeData }).unwrap();
        toast.success("Recipe updated successfully!");
      } else {
        // Create new recipe
        await createRecipe(recipeData).unwrap();
        toast.success("Recipe created successfully!");
      }

      // Reset form
      setFormData({
        title: "",
        ingredients: "",
        instructions: "",
        category: "",
        cuisine: "",
        cookingTime: "",
        calories: "",
        image: "",
        isFeatured: false,
      });

      // Reset edit mode
      setEditMode(false);
      setCurrentRecipeId(null);
      setShowAddForm(false);

      // Refetch recipes to show the new one
      // Note: In a real implementation, you might want to refetch the recipe list
    } catch (error) {
      toast.error(error?.data?.message || `Failed to ${editMode ? "update" : "create"} recipe`);
      console.error(`Error ${editMode ? "updating" : "creating"} recipe:`, error);
    }
  };

  // Handle edit recipe
  const handleEditRecipe = (recipe) => {
    // Find the full recipe data from the API response
    const fullRecipe = recipesData?.recipes?.find((r) => r._id === recipe.id);

    if (fullRecipe) {
      setFormData({
        title: fullRecipe.title,
        ingredients: fullRecipe.ingredients.join("\n"),
        instructions: fullRecipe.instructions,
        category: fullRecipe.category?._id || "",
        cuisine: fullRecipe.cuisine?._id || "",
        cookingTime: fullRecipe.cookingTime?.toString() || "",
        calories: fullRecipe.calories?.toString() || "",
        image: null, // We can't pre-fill file inputs
        isFeatured: fullRecipe.isFeatured || false,
      });

      setCurrentRecipeId(recipe.id);
      setEditMode(true);
      setShowAddForm(true);
    }
  };

  // Handle delete recipe - open confirmation dialog
  const handleDeleteRecipe = (recipe) => {
    setRecipeToDelete(recipe);
    setShowDeleteDialog(true);
  };

  // Confirm delete recipe
  const confirmDeleteRecipe = async () => {
    if (!recipeToDelete) return;

    try {
      await deleteRecipe(recipeToDelete.id).unwrap();
      toast.success("Recipe deleted successfully!");
      // Close dialog
      setShowDeleteDialog(false);
      setRecipeToDelete(null);
      // Refetch recipes to update the list
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete recipe");
      console.error("Error deleting recipe:", error);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setRecipeToDelete(null);
  };

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: recipesData,
    isLoading,
    isError,
    error,
  } = useAllRecipeQuery(
    { q: debouncedSearchTerm },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Transform API data to match our table structure
  const recipes =
    recipesData?.recipes?.map((recipe) => ({
      id: recipe._id,
      name: recipe.title,
      category: recipe.category?.name || "Uncategorized",
      author: recipe.createdBy?.fullName || "Unknown", // Updated field name
      addedDate: new Date(recipe.createdAt).toLocaleDateString(),
      cookingTime: `${recipe.cookingTime} mins`,
      difficulty: recipe.difficulty || "Medium",
      status: recipe.status || "draft", // Updated field name
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button className="w-full sm:w-auto" onClick={() => setShowAddForm(!showAddForm)} type="button">
            <Plus className="mr-2 h-4 w-4" />
            {showAddForm ? "Cancel" : "+ Add New Recipe"}
          </Button>
        </div>
      </div>

      {/* Add Recipe Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editMode ? "Edit Recipe" : "Add New Recipe"}</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Recipe Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter recipe title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuisine">Cuisine *</Label>
                <Select value={formData.cuisine} onValueChange={(value) => handleSelectChange("cuisine", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    {cuisines.map((cuisine) => (
                      <SelectItem key={cuisine._id} value={cuisine._id}>
                        {cuisine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cookingTime">Cooking Time (minutes)</Label>
                <Input
                  id="cookingTime"
                  name="cookingTime"
                  type="number"
                  value={formData.cookingTime}
                  onChange={handleInputChange}
                  placeholder="Enter cooking time in minutes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  value={formData.calories}
                  onChange={handleInputChange}
                  placeholder="Enter calories"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Recipe Image</Label>
                <div className="flex items-center space-x-4">
                  <label className="flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-primary">
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Validate file size (5MB limit)
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error("Image size must be less than 5MB");
                            e.target.value = null;
                            return;
                          }

                          // Validate file type
                          const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
                          if (!validTypes.includes(file.type)) {
                            toast.error("Please upload a valid image file (JPEG, PNG, or WEBP)");
                            e.target.value = null;
                            return;
                          }

                          setFormData((prev) => ({
                            ...prev,
                            image: file,
                          }));
                        }
                      }}
                    />
                    <div className="text-center">
                      <Plus className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        {formData.image ? formData.image.name : "Click to upload image"}
                      </p>
                      <p className="text-xs text-gray-500">JPEG, PNG, or WEBP (max 5MB)</p>
                    </div>
                  </label>
                  {formData.image && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          image: null,
                        }));
                        // Reset the file input
                        const fileInput = document.getElementById("image");
                        if (fileInput) fileInput.value = "";
                      }}>
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="ingredients">Ingredients *</Label>
                <Textarea
                  id="ingredients"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleIngredientsChange}
                  placeholder="Enter ingredients, one per line"
                  rows={4}
                  required
                />
                <p className="text-sm text-muted-foreground">Enter each ingredient on a new line</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="instructions">Instructions *</Label>
                <Textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  placeholder="Enter cooking instructions"
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <input
                    id="isFeatured"
                    name="isFeatured"
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isFeatured">Featured Recipe</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating
                  ? editMode
                    ? "Updating..."
                    : "Creating..."
                  : editMode
                  ? "Update Recipe"
                  : "Create Recipe"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

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
                  <TableHead className="whitespace-nowrap">Cook Time</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
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
                    <TableCell className="whitespace-nowrap">{recipe.cookingTime}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(recipe.status)}>{recipe.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditRecipe(recipe)}>
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => handleDeleteRecipe(recipe)}
                          disabled={isDeleting}>
                          {isDeleting ? "Deleting..." : "Delete"}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the recipe &quot;{recipeToDelete?.name}&quot;? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteRecipe} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Recipe"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRecipesPage;

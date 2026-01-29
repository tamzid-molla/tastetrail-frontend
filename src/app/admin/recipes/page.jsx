"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
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
    ingredients: [""],
    instructions: [""],
    category: "",
    cuisine: "",
    cookingTime: "",
    calories: "",
    image: null,
    isFeatured: false,
  });
  const [createRecipe, { isLoading: isCreating }] = useCreateRecipeMutation();
  const [updateRecipe, { isLoading: isUpdating }] = useUpdateRecipeMutation();
  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation();
  const { data: categoriesData } = useAllCategoriesQuery();
  const { data: cuisinesData } = useAllCuisinesQuery();
  const categories = categoriesData?.categories || [];
  const cuisines = cuisinesData?.cuisines || [];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIngredientChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.ingredients];
      updated[index] = value;
      return { ...prev, ingredients: updated };
    });
  };

  const addIngredientField = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const removeIngredientField = (index) => {
    setFormData((prev) => {
      const updated = prev.ingredients.filter((_, i) => i !== index);
      return { ...prev, ingredients: updated.length ? updated : [""] };
    });
  };

  const handleInstructionChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.instructions];
      updated[index] = value;
      return { ...prev, instructions: updated };
    });
  };

  const addInstructionField = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }));
  };

  const removeInstructionField = (index) => {
    setFormData((prev) => {
      const updated = prev.instructions.filter((_, i) => i !== index);
      return { ...prev, instructions: updated.length ? updated : [""] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedIngredients = Array.isArray(formData.ingredients)
      ? formData.ingredients.map((item) => item.trim()).filter((item) => item !== "")
      : [];
    const cleanedInstructions = Array.isArray(formData.instructions)
      ? formData.instructions.map((item) => item.trim()).filter((item) => item !== "")
      : [];
    const hasRequiredBasics =
      formData.title &&
      cleanedIngredients.length &&
      cleanedInstructions.length &&
      formData.category &&
      formData.cuisine;

    const cookingTimeNum = Number(formData.cookingTime);
    const caloriesNum = Number(formData.calories);
    if (!hasRequiredBasics) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.cookingTime || Number.isNaN(cookingTimeNum) || cookingTimeNum <= 0) {
      toast.error("Please provide a valid cooking time (in minutes)");
      return;
    }
    if (!formData.calories || Number.isNaN(caloriesNum) || caloriesNum <= 0) {
      toast.error("Please provide valid calories");
      return;
    }
    if (!editMode && !formData.image) {
      toast.error("Recipe image is required");
      return;
    }

    try {
      const recipeData = new FormData();
      recipeData.append("title", formData.title);
      recipeData.append("ingredients", JSON.stringify(cleanedIngredients));
      recipeData.append("instructions", cleanedInstructions.join("\n"));
      recipeData.append("category", formData.category);
      recipeData.append("cuisine", formData.cuisine);
      recipeData.append("cookingTime", String(cookingTimeNum));
      recipeData.append("calories", String(caloriesNum));
      if (formData.image) recipeData.append("image", formData.image);
      recipeData.append("isFeatured", formData.isFeatured);

      if (editMode) {
        await updateRecipe({ id: currentRecipeId, recipeData }).unwrap();
        toast.success("Recipe updated successfully!");
      } else {
        await createRecipe(recipeData).unwrap();
        toast.success("Recipe created successfully!");
      }

      setFormData({
        title: "",
        ingredients: [""],
        instructions: [""],
        category: "",
        cuisine: "",
        cookingTime: "",
        calories: "",
        image: null,
        isFeatured: false,
      });

      setEditMode(false);
      setCurrentRecipeId(null);
      setShowAddForm(false);
    } catch (error) {
      toast.error(error?.data?.message || `Failed to ${editMode ? "update" : "create"} recipe`);
      console.error(`Error ${editMode ? "updating" : "creating"} recipe:`, error);
    }
  };

  const handleEditRecipe = (recipe) => {
    const fullRecipe = recipesData?.recipes?.find((r) => r._id === recipe.id);

    if (fullRecipe) {
      setFormData({
        title: fullRecipe.title,
        ingredients: fullRecipe.ingredients && fullRecipe.ingredients.length ? fullRecipe.ingredients : [""],
        instructions:
          typeof fullRecipe.instructions === "string" && fullRecipe.instructions.length
            ? fullRecipe.instructions.split("\n")
            : [""],
        category: fullRecipe.category?._id || "",
        cuisine: fullRecipe.cuisine?._id || "",
        cookingTime: fullRecipe.cookingTime?.toString() || "",
        calories: fullRecipe.calories?.toString() || "",
        image: null,
        isFeatured: fullRecipe.isFeatured || false,
      });

      setCurrentRecipeId(recipe.id);
      setEditMode(true);
      setShowAddForm(true);
    }
  };

  const handleDeleteRecipe = (recipe) => {
    setRecipeToDelete(recipe);
    setShowDeleteDialog(true);
  };

  const confirmDeleteRecipe = async () => {
    if (!recipeToDelete) return;

    try {
      await deleteRecipe(recipeToDelete.id).unwrap();
      toast.success("Recipe deleted successfully!");

      setShowDeleteDialog(false);
      setRecipeToDelete(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete recipe");
      console.error("Error deleting recipe:", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setRecipeToDelete(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: recipesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAllRecipeQuery(
    { q: debouncedSearchTerm },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const recipes =
    recipesData?.recipes?.map((recipe) => ({
      id: recipe._id,
      name: recipe.title,
      category: recipe.category?.name || "Uncategorized",
      author: recipe.createdBy?.fullName || "Unknown",
      addedDate: new Date(recipe.createdAt).toLocaleDateString(),
      cookingTime: `${recipe.cookingTime} mins`,
      difficulty: recipe.difficulty || "Medium",
      status: recipe.status || "draft",
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
          <Button
            className="w-full sm:w-auto"
            type="button"
            onClick={() => {
              setEditMode(false);
              setCurrentRecipeId(null);
              setFormData({
                title: "",
                ingredients: [""],
                instructions: [""],
                category: "",
                cuisine: "",
                cookingTime: "",
                calories: "",
                image: null,
                isFeatured: false,
              });
              setShowAddForm(true);
            }}>
            <Plus className="mr-2 h-4 w-4" />+ Add New Recipe
          </Button>
        </div>
      </div>
      <Dialog
        open={showAddForm}
        onOpenChange={(open) => {
          setShowAddForm(open);
          if (!open) {
            setEditMode(false);
            setCurrentRecipeId(null);
          }
        }}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Recipe" : "Add New Recipe"}</DialogTitle>
            <DialogDescription>
              {editMode ? "Update the recipe details below." : "Fill in the details to create a new recipe."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="cookingTime">Cooking Time (minutes) *</Label>
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
                <Label htmlFor="calories">Calories *</Label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  value={formData.calories}
                  onChange={handleInputChange}
                  placeholder="Enter calories"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="image">Recipe Image{!editMode && <span className="text-red-500"> *</span>}</Label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
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
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error("Image size must be less than 5MB");
                            e.target.value = null;
                            return;
                          }

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

                        const fileInput = document.getElementById("image");
                        if (fileInput) fileInput.value = "";
                      }}>
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label>Ingredients *</Label>
                <div className="space-y-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-2">
                      <Input
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                        placeholder={`Ingredient ${index + 1}`}
                      />
                      <div className="flex gap-2">
                        {formData.ingredients.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => removeIngredientField(index)}>
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addIngredientField}>
                  + Add Ingredient
                </Button>
                <p className="text-sm text-muted-foreground">Write one ingredient per field.</p>
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label>Instructions *</Label>
                <div className="space-y-2">
                  {formData.instructions.map((step, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-2">
                      <Input
                        value={step}
                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                        placeholder={`Step ${index + 1}`}
                      />
                      <div className="flex gap-2">
                        {formData.instructions.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => removeInstructionField(index)}>
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addInstructionField}>
                  + Add Step
                </Button>
                <p className="text-sm text-muted-foreground">Write one instruction step per field.</p>
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
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditMode(false);
                  setCurrentRecipeId(null);
                }}>
                Cancel
              </Button>
              <Button className="w-full sm:w-auto" type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating
                  ? editMode
                    ? "Updating..."
                    : "Creating..."
                  : editMode
                  ? "Update Recipe"
                  : "Create Recipe"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recipe List</CardTitle>
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
                    <Skeleton className="h-4 w-24" />
                    <div className="flex justify-end gap-2 mt-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                ))
              : recipes.map((recipe) => (
                  <div key={recipe.id} className="border rounded-lg p-3 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground font-semibold">Name</span>
                      <span className="font-medium max-w-[180px] truncate text-right">{recipe.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground font-semibold">Category</span>
                      <Badge variant="secondary" className="ml-2">
                        {recipe.category}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground font-semibold">Author</span>
                      <span className="max-w-[180px] truncate text-right">{recipe.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground font-semibold">Cook Time</span>
                      <span>{recipe.cookingTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground font-semibold">Status</span>
                      <Badge variant={getStatusVariant(recipe.status)} className="ml-2">
                        {recipe.status}
                      </Badge>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
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
                  </div>
                ))}
          </div>

          {/* Desktop/tablet: scrollable table */}
          <div className="w-full overflow-x-auto hidden sm:block">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Category</TableHead>
                  <TableHead className="whitespace-nowrap">Author</TableHead>
                  <TableHead className="whitespace-nowrap">Cook Time</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
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
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-24 inline-block mr-2" />
                          <Skeleton className="h-8 w-24 inline-block" />
                        </TableCell>
                      </TableRow>
                    ))
                  : recipes.map((recipe) => (
                      <TableRow key={recipe.id}>
                        <TableCell className="font-medium max-w-[180px] truncate">{recipe.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{recipe.category}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[160px] truncate">{recipe.author}</TableCell>
                        <TableCell className="whitespace-nowrap">{recipe.cookingTime}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(recipe.status)}>{recipe.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-wrap justify-end gap-2">
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

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateCategoryMutation } from "@/redux/api/categoryApiSlice";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const EditCategoryModal = ({ isOpen, onClose, category, onCategoryUpdated }) => {
  const [name, setName] = useState("");
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  // Initialize the name state when the component mounts or when category changes
  const [prevCategoryId, setPrevCategoryId] = useState(null);
  if (category && category._id !== prevCategoryId) {
    setName(category.name || "");
    setPrevCategoryId(category._id);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const categoryData = {
        name,
      };

      await updateCategory({ id: category._id, ...categoryData }).unwrap();
      toast.success("Category updated successfully!");
      onCategoryUpdated && onCategoryUpdated();
      setName(""); // Clear form after successful update
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update category");
      console.error("Error updating category:", error);
    }
  };

  const handleClose = () => {
    setName(""); // Clear form when closing
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm w-full max-w-xs">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Update the category name.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
              minLength={2}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Updating..." : "Update Category"}
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;

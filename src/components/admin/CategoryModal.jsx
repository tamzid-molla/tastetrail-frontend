"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCategoryMutation } from "@/redux/api/categoryApiSlice";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CategoryModal = ({ isOpen, onClose, onCategoryAdded }) => {
  const [name, setName] = useState("");
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const categoryData = {
        name,
      };

      await createCategory(categoryData).unwrap();
      toast.success("Category created successfully!");
      setName("");
      onCategoryAdded && onCategoryAdded();
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create category");
      console.error("Error creating category:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm w-full max-w-xs">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>Enter a name for the new category.</DialogDescription>
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
              {isLoading ? "Creating..." : "Create Category"}
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateCuisineMutation } from "@/redux/api/cuisineApiSlice";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const EditCuisineModal = ({ isOpen, onClose, cuisine, onCuisineUpdated }) => {
  const [name, setName] = useState("");
  const [updateCuisine, { isLoading }] = useUpdateCuisineMutation();

  // Initialize the name state when the component mounts or when cuisine changes
  const [prevCuisineId, setPrevCuisineId] = useState(null);
  if (cuisine && cuisine.id !== prevCuisineId) {
    setName(cuisine.name || "");
    setPrevCuisineId(cuisine.id);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cuisineData = {
        name,
      };

      await updateCuisine({ id: cuisine.id, ...cuisineData }).unwrap();
      toast.success("Cuisine updated successfully!");
      onCuisineUpdated && onCuisineUpdated();
      setName(""); // Clear form after successful update
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update cuisine");
      console.error("Error updating cuisine:", error);
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
          <DialogTitle>Edit Cuisine</DialogTitle>
          <DialogDescription>Update the cuisine name.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Cuisine Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter cuisine name"
              required
              minLength={2}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Updating..." : "Update Cuisine"}
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

export default EditCuisineModal;

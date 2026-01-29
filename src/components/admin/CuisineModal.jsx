"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCuisineMutation } from "@/redux/api/cuisineApiSlice";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CuisineModal = ({ isOpen, onClose, onCuisineAdded }) => {
  const [name, setName] = useState("");
  const [createCuisine, { isLoading }] = useCreateCuisineMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cuisineData = { name };

      await createCuisine(cuisineData).unwrap();
      toast.success("Cuisine created successfully!");
      onCuisineAdded && onCuisineAdded();
      setName(""); // Clear form
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create cuisine");
      console.error("Error creating cuisine:", error);
    }
  };

  const handleClose = () => {
    setName(""); // Clear form
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm w-full max-w-xs">
        <DialogHeader>
          <DialogTitle>Add New Cuisine</DialogTitle>
          <DialogDescription>Enter the cuisine name to create a new cuisine.</DialogDescription>
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
              {isLoading ? "Creating..." : "Create Cuisine"}
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

export default CuisineModal;

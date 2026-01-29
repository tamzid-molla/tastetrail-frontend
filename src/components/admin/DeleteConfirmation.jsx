"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, itemName, itemType = "item" }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm w-full max-w-xs">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 pt-2">
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => {
              onConfirm();
              onClose();
            }}>
            Delete
          </Button>
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmation;

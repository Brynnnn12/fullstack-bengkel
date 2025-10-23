import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type InventoryItem } from "@/api/inventoryApi";

interface DeleteInventoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  inventory: InventoryItem | null;
  isLoading?: boolean;
}

export const DeleteInventoryDialog = ({
  isOpen,
  onClose,
  onConfirm,
  inventory,
  isLoading = false,
}: DeleteInventoryDialogProps) => {
  if (!inventory) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Inventory Item</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{inventory.name}</strong>?
            <br />
            <br />
            <strong>Item Details:</strong>
            <br />
            SKU: {inventory.sku}
            <br />
            Stock: {inventory.stock}
            <br />
            Selling Price: {formatCurrency(inventory.sellingPrice)}
            <br />
            <br />
            <span className="text-destructive">
              Warning: This action cannot be undone. This will permanently
              remove the inventory item from your system.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete Item"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

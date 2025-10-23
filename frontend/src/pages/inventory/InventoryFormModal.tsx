import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type InventoryItem,
  createInventoryItemSchema,
} from "@/api/inventoryApi";

interface InventoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    sku: string;
    stock: number;
    sellingPrice: number;
  }) => void;
  inventory?: InventoryItem | null;
  isLoading?: boolean;
}

type FormData = {
  name: string;
  sku: string;
  stock: number;
  sellingPrice: number;
};

export const InventoryFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  inventory,
  isLoading = false,
}: InventoryFormModalProps) => {
  const isEditing = !!inventory;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(createInventoryItemSchema),
    defaultValues: {
      name: "",
      sku: "",
      stock: 0,
      sellingPrice: 0,
    },
  });

  useEffect(() => {
    if (inventory) {
      setValue("name", inventory.name);
      setValue("sku", inventory.sku);
      setValue("stock", inventory.stock);
      setValue("sellingPrice", inventory.sellingPrice);
    } else {
      reset();
    }
  }, [inventory, setValue, reset]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Inventory Item" : "Add New Inventory Item"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the inventory item information below."
              : "Fill in the details to add a new item to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              placeholder="Enter item name"
              {...register("name")}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              placeholder="Enter SKU (unique identifier)"
              {...register("sku")}
              disabled={isLoading}
            />
            {errors.sku && (
              <p className="text-sm text-destructive">{errors.sku.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                placeholder="0"
                {...register("stock", { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.stock && (
                <p className="text-sm text-destructive">
                  {errors.stock.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price (IDR)</Label>
              <Input
                id="sellingPrice"
                type="number"
                min="0"
                step="1000"
                placeholder="0"
                {...register("sellingPrice", { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.sellingPrice && (
                <p className="text-sm text-destructive">
                  {errors.sellingPrice.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Update Item" : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

import { memo, useCallback } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type InventoryItem } from "@/api/inventoryApi";

interface InventoryRowProps {
  inventory: InventoryItem;
  onEdit: (inventory: InventoryItem) => void;
  onDelete: (inventory: InventoryItem) => void;
  formatCurrency: (amount: number) => string;
  getStockStatus: (stock: number) => {
    status: string;
    label: string;
    color: string;
  };
}

export const InventoryRow = memo<InventoryRowProps>(
  ({ inventory, onEdit, onDelete, formatCurrency, getStockStatus }) => {
    const handleEdit = useCallback(() => {
      onEdit(inventory);
    }, [inventory, onEdit]);

    const handleDelete = useCallback(() => {
      onDelete(inventory);
    }, [inventory, onDelete]);

    const stockStatus = getStockStatus(inventory.stock);

    return (
      <tr className="border-b hover:bg-muted/50">
        <td className="p-4 font-medium">{inventory.name}</td>
        <td className="p-4 text-muted-foreground">{inventory.sku}</td>
        <td className="p-4">
          <span
            className={`font-medium ${
              inventory.stock === 0
                ? "text-red-600"
                : inventory.stock <= 5
                ? "text-orange-600"
                : "text-green-600"
            }`}
          >
            {inventory.stock}
          </span>
        </td>
        <td className="p-4 font-medium">
          {formatCurrency(inventory.sellingPrice)}
        </td>
        <td className="p-4">
          <Badge
            variant={
              stockStatus.color as
                | "default"
                | "destructive"
                | "secondary"
                | "outline"
            }
          >
            {stockStatus.label}
          </Badge>
        </td>
        <td className="p-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
    );
  }
);

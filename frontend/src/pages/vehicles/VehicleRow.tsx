import { memo, useCallback } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Vehicle } from "@/api/vehicleApi";

interface VehicleRowProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

export const VehicleRow = memo<VehicleRowProps>(
  ({ vehicle, onEdit, onDelete }) => {
    const handleEdit = useCallback(() => {
      onEdit(vehicle);
    }, [vehicle, onEdit]);

    const handleDelete = useCallback(() => {
      onDelete(vehicle);
    }, [vehicle, onDelete]);

    return (
      <tr className="border-b hover:bg-muted/50">
        <td className="p-4 font-medium">{vehicle.registrationPlate}</td>
        <td className="p-4">
          {vehicle.make} {vehicle.model}
        </td>
        <td className="p-4">{vehicle.customer?.name || "Unknown Customer"}</td>
        <td className="p-4">{vehicle.serviceLogs?.length || 0} services</td>
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

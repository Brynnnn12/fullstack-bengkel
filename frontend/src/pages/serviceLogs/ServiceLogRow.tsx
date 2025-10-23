import { memo, useCallback } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type ServiceLog } from "@/api/serviceLogApi";

interface ServiceLogRowProps {
  serviceLog: ServiceLog;
  onEdit: (serviceLog: ServiceLog) => void;
  onDelete: (serviceLog: ServiceLog) => void;
  formatCurrency: (amount: number) => string;
}

export const ServiceLogRow = memo<ServiceLogRowProps>(
  ({ serviceLog, onEdit, onDelete, formatCurrency }) => {
    const handleEdit = useCallback(() => {
      onEdit(serviceLog);
    }, [serviceLog, onEdit]);

    const handleDelete = useCallback(() => {
      onDelete(serviceLog);
    }, [serviceLog, onDelete]);

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    return (
      <tr className="border-b hover:bg-muted/50">
        <td className="p-4 font-medium">{formatDate(serviceLog.date)}</td>
        <td className="p-4">
          <div>
            <div className="font-medium">
              {serviceLog.vehicle?.registrationPlate}
            </div>
            <div className="text-sm text-muted-foreground">
              {serviceLog.vehicle?.make} {serviceLog.vehicle?.model}
            </div>
          </div>
        </td>
        <td className="p-4">
          {serviceLog.vehicle?.customer?.name || "Unknown Customer"}
        </td>
        <td className="p-4 font-medium">
          {formatCurrency(serviceLog.totalCost)}
        </td>
        <td className="p-4">{serviceLog.serviceItems?.length || 0} items</td>
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

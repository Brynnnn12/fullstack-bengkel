import React from "react";
import { Edit, Trash2, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Customer } from "@/api/customerApi";

interface CustomerRowProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomerRow = React.memo<CustomerRowProps>(
  ({ customer, onEdit, onDelete }) => {
    const handleEdit = React.useCallback(() => {
      onEdit(customer);
    }, [onEdit, customer]);

    const handleDelete = React.useCallback(() => {
      onDelete(customer);
    }, [onDelete, customer]);

    return (
      <tr className="border-b hover:bg-muted/50">
        <td className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">{customer.name}</div>
            </div>
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            {customer.phoneNumber}
          </div>
        </td>
        <td className="p-4">
          <div className="flex flex-wrap gap-1">
            {customer.vehicles && customer.vehicles.length > 0 ? (
              customer.vehicles.slice(0, 2).map((vehicle) => (
                <Badge key={vehicle.id} variant="secondary" className="text-xs">
                  {vehicle.registrationPlate}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">No vehicles</span>
            )}
            {customer.vehicles && customer.vehicles.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{customer.vehicles.length - 2} more
              </Badge>
            )}
          </div>
        </td>
        <td className="p-4 text-right">
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
    );
  }
);

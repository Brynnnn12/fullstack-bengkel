import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ServiceLog,
  createServiceLogSchema,
  type ServiceItemData,
} from "@/api/serviceLogApi";
import { vehicleApi } from "@/api/vehicleApi";
import { inventoryApi } from "@/api/inventoryApi";

interface ServiceLogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  serviceLog?: ServiceLog | null;
  isLoading?: boolean;
}

type FormData = {
  date?: string;
  totalCost: number;
  notes?: string;
  vehicleId: string;
  serviceItems: ServiceItemData[];
};

export const ServiceLogFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  serviceLog,
  isLoading = false,
}: ServiceLogFormModalProps) => {
  const isEditing = !!serviceLog;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(createServiceLogSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      totalCost: 0,
      notes: "",
      vehicleId: "",
      serviceItems: [
        { description: "", quantity: 1, price: 0, inventoryItemId: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "serviceItems",
  });

  // Fetch vehicles for dropdown
  const { data: vehiclesResponse } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => vehicleApi.getAllVehicles({ limit: 1000 }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Fetch inventory items for dropdown
  const { data: inventoryResponse } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => inventoryApi.getAllInventoryItems({ limit: 1000 }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const vehicles = vehiclesResponse?.data || [];
  const inventoryItems = inventoryResponse?.data || [];

  // Calculate total cost automatically
  const watchedServiceItems = watch("serviceItems");
  const totalCost =
    watchedServiceItems?.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0) || 0;

  useEffect(() => {
    setValue("totalCost", totalCost);
  }, [totalCost, setValue]);

  useEffect(() => {
    if (serviceLog) {
      setValue("date", new Date(serviceLog.date).toISOString().split("T")[0]);
      setValue("totalCost", serviceLog.totalCost);
      setValue("notes", serviceLog.notes || "");
      setValue("vehicleId", serviceLog.vehicleId);
      setValue(
        "serviceItems",
        serviceLog.serviceItems?.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          inventoryItemId: item.inventoryItemId,
        })) || []
      );
    } else {
      reset();
    }
  }, [serviceLog, setValue, reset]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const addServiceItem = () => {
    append({ description: "", quantity: 1, price: 0, inventoryItemId: "" });
  };

  const removeServiceItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Service Log" : "Add New Service Log"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the service log information below."
              : "Fill in the service details to create a new service log."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Service Date</Label>
              <Input
                id="date"
                type="date"
                {...register("date")}
                disabled={isLoading}
              />
              {errors.date && (
                <p className="text-sm text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vehicle</Label>
              <Select
                value={watch("vehicleId")}
                onValueChange={(value: string) => setValue("vehicleId", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationPlate} - {vehicle.make}{" "}
                      {vehicle.model}
                      {vehicle.customer && ` (${vehicle.customer.name})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicleId && (
                <p className="text-sm text-destructive">
                  {errors.vehicleId.message}
                </p>
              )}
            </div>
          </div>

          {/* Service Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Service Items</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addServiceItem}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg"
                >
                  <div className="col-span-4 space-y-2">
                    <Label>Inventory Item</Label>
                    <Select
                      value={watch(`serviceItems.${index}.inventoryItemId`)}
                      onValueChange={(value: string) =>
                        setValue(`serviceItems.${index}.inventoryItemId`, value)
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} - {formatCurrency(item.sellingPrice)} (
                            {item.stock} pcs)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-3 space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      {...register(`serviceItems.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      min="0"
                      {...register(`serviceItems.${index}.price`, {
                        valueAsNumber: true,
                      })}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>Total</Label>
                    <div className="text-sm font-medium p-2 bg-muted rounded">
                      {formatCurrency(
                        (watch(`serviceItems.${index}.quantity`) || 0) *
                          (watch(`serviceItems.${index}.price`) || 0)
                      )}
                    </div>
                  </div>

                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeServiceItem(index)}
                      disabled={isLoading || fields.length === 1}
                      className="h-8 w-8 p-0 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="col-span-12 space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      {...register(`serviceItems.${index}.description`)}
                      placeholder="Describe the service performed..."
                      disabled={isLoading}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Total Cost */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="text-lg font-medium">Total Cost:</span>
            <span className="text-lg font-bold">
              {formatCurrency(totalCost)}
            </span>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Additional notes about the service..."
              disabled={isLoading}
              rows={3}
            />
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
              {isLoading
                ? "Saving..."
                : isEditing
                ? "Update Service Log"
                : "Create Service Log"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

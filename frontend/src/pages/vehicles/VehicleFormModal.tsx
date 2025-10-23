import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Vehicle, createVehicleSchema } from "@/api/vehicleApi";
import { customerApi } from "@/api/customerApi";

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    registrationPlate: string;
    make: string;
    model: string;
    customerId: string;
  }) => void;
  vehicle?: Vehicle | null;
  isLoading?: boolean;
}

type FormData = {
  registrationPlate: string;
  make: string;
  model: string;
  customerId: string;
};

export const VehicleFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  vehicle,
  isLoading = false,
}: VehicleFormModalProps) => {
  const isEditing = !!vehicle;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(createVehicleSchema),
    defaultValues: {
      registrationPlate: "",
      make: "",
      model: "",
      customerId: "",
    },
  });

  // Fetch customers for dropdown
  const { data: customersResponse } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customerApi.getAllCustomers({ limit: 1000 }), // Get all customers for dropdown
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const customers = customersResponse?.data || [];

  useEffect(() => {
    if (vehicle) {
      setValue("registrationPlate", vehicle.registrationPlate);
      setValue("make", vehicle.make);
      setValue("model", vehicle.model);
      setValue("customerId", vehicle.customerId);
    } else {
      reset();
    }
  }, [vehicle, setValue, reset]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Vehicle" : "Add New Vehicle"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the vehicle information below."
              : "Fill in the details to add a new vehicle to your database."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="registrationPlate">Registration Plate</Label>
            <Input
              id="registrationPlate"
              placeholder="Enter registration plate (e.g., B 1234 ABC)"
              {...register("registrationPlate")}
              disabled={isLoading}
            />
            {errors.registrationPlate && (
              <p className="text-sm text-destructive">
                {errors.registrationPlate.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                placeholder="Enter vehicle make (e.g., Toyota)"
                {...register("make")}
                disabled={isLoading}
              />
              {errors.make && (
                <p className="text-sm text-destructive">
                  {errors.make.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="Enter vehicle model (e.g., Avanza)"
                {...register("model")}
                disabled={isLoading}
              />
              {errors.model && (
                <p className="text-sm text-destructive">
                  {errors.model.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerId">Customer</Label>
            <Select
              value={watch("customerId")}
              onValueChange={(value: string) => setValue("customerId", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phoneNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customerId && (
              <p className="text-sm text-destructive">
                {errors.customerId.message}
              </p>
            )}
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
                ? "Update Vehicle"
                : "Add Vehicle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

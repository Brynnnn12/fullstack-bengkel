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
import { type Vehicle } from "@/api/vehicleApi";

interface DeleteVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vehicle: Vehicle | null;
  isLoading?: boolean;
}

export const DeleteVehicleDialog = ({
  isOpen,
  onClose,
  onConfirm,
  vehicle,
  isLoading = false,
}: DeleteVehicleDialogProps) => {
  if (!vehicle) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete vehicle{" "}
            <strong>
              {vehicle.registrationPlate} ({vehicle.make} {vehicle.model})
            </strong>
            ?
            <br />
            This action cannot be undone.
            {vehicle.serviceLogs && vehicle.serviceLogs.length > 0 && (
              <span className="block mt-2 text-destructive">
                Warning: This vehicle has {vehicle.serviceLogs.length} service
                record(s). Deleting this vehicle will also remove all associated
                service records.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete Vehicle"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

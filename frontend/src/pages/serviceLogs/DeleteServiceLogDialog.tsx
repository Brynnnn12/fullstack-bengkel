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
import { type ServiceLog } from "@/api/serviceLogApi";

interface DeleteServiceLogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceLog: ServiceLog | null;
  isLoading?: boolean;
}

export const DeleteServiceLogDialog = ({
  isOpen,
  onClose,
  onConfirm,
  serviceLog,
  isLoading = false,
}: DeleteServiceLogDialogProps) => {
  if (!serviceLog) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Service Log</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this service log?
            <br />
            <strong>Service Details:</strong>
            <br />
            Date: {formatDate(serviceLog.date)}
            <br />
            Vehicle: {serviceLog.vehicle?.registrationPlate} (
            {serviceLog.vehicle?.make} {serviceLog.vehicle?.model})
            <br />
            Customer: {serviceLog.vehicle?.customer?.name || "Unknown"}
            <br />
            Total Cost: {formatCurrency(serviceLog.totalCost)}
            <br />
            Items: {serviceLog.serviceItems?.length || 0}
            <br />
            <br />
            <span className="text-destructive">
              Warning: This action cannot be undone and will also remove all
              associated service items. Inventory stock will be restored.
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
            {isLoading ? "Deleting..." : "Delete Service Log"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import {
  vehicleApi,
  type Vehicle,
  type CreateVehicleData,
  type UpdateVehicleData,
} from "@/api/vehicleApi";
import { useDebounce } from "@/hooks/useDebounce";
import { VehicleRow } from "./VehicleRow";
import { VehicleFormModal } from "./VehicleFormModal";
import { DeleteVehicleDialog } from "./DeleteVehicleDialog";

export const VehiclePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const queryClient = useQueryClient();
  const limit = 10;

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch vehicles
  const { data: vehiclesResponse, isLoading } = useQuery({
    queryKey: ["vehicles", currentPage],
    queryFn: () => vehicleApi.getAllVehicles({ page: currentPage, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes - data tetap fresh selama 5 menit
    gcTime: 10 * 60 * 1000, // 10 minutes - data tetap di cache selama 10 menit (React Query v5)
    placeholderData: (previousData) => previousData, // Pertahankan data sebelumnya saat pagination
  });

  const vehicles = useMemo(
    () => vehiclesResponse?.data || [],
    [vehiclesResponse?.data]
  );

  const pagination = vehiclesResponse?.pagination;

  // Memoized filtered vehicles based on search term
  const filteredVehicles = useMemo(() => {
    if (!debouncedSearchTerm) return vehicles;

    return vehicles.filter(
      (vehicle) =>
        vehicle.registrationPlate
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        vehicle.make
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        vehicle.model
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        vehicle.customer?.name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
    );
  }, [vehicles, debouncedSearchTerm]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Create vehicle mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateVehicleData) => vehicleApi.createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle created successfully");
      setIsFormModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to create vehicle");
    },
  });

  // Update vehicle mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVehicleData }) =>
      vehicleApi.updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle updated successfully");
      setIsFormModalOpen(false);
      setEditingVehicle(null);
    },
    onError: () => {
      toast.error("Failed to update vehicle");
    },
  });

  // Delete vehicle mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => vehicleApi.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedVehicle(null);
    },
    onError: () => {
      toast.error("Failed to delete vehicle");
    },
  });

  // Handlers
  const handleCreate = useCallback(() => {
    setEditingVehicle(null);
    setIsFormModalOpen(true);
  }, []);

  const handleEdit = useCallback((vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormModalOpen(true);
  }, []);

  const handleDelete = useCallback((vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    (data: CreateVehicleData | UpdateVehicleData) => {
      if (editingVehicle) {
        updateMutation.mutate({
          id: editingVehicle.id,
          data: data as UpdateVehicleData,
        });
      } else {
        createMutation.mutate(data as CreateVehicleData);
      }
    },
    [editingVehicle, updateMutation, createMutation]
  );

  const handleConfirmDelete = useCallback(() => {
    if (selectedVehicle) {
      deleteMutation.mutate(selectedVehicle.id);
    }
  }, [selectedVehicle, deleteMutation]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="space-y-6 px-8 py-6 min-h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Vehicle Management</h1>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles by registration plate, make, model, or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Registration Plate
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Make & Model
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Customer
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Service Count
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="h-24 text-center">
                      Loading vehicles...
                    </td>
                  </tr>
                ) : filteredVehicles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {debouncedSearchTerm
                        ? "No vehicles found matching your search."
                        : "No vehicles found."}
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <VehicleRow
                      key={vehicle.id}
                      vehicle={vehicle}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} vehicles
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <VehicleFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingVehicle(null);
        }}
        onSubmit={handleFormSubmit}
        vehicle={editingVehicle}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteVehicleDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedVehicle(null);
        }}
        onConfirm={handleConfirmDelete}
        vehicle={selectedVehicle}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

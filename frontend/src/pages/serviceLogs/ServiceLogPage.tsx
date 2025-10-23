import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import {
  serviceLogApi,
  type ServiceLog,
  type CreateServiceLogData,
  type UpdateServiceLogData,
} from "@/api/serviceLogApi";

import { useDebounce } from "@/hooks/useDebounce";
import { ServiceLogRow } from "./ServiceLogRow";
import { ServiceLogFormModal } from "./ServiceLogFormModal";
import { DeleteServiceLogDialog } from "./DeleteServiceLogDialog";

export const ServiceLogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedServiceLog, setSelectedServiceLog] =
    useState<ServiceLog | null>(null);
  const [editingServiceLog, setEditingServiceLog] = useState<ServiceLog | null>(
    null
  );

  const queryClient = useQueryClient();
  const limit = 10;

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch service logs
  const { data: serviceLogsResponse, isLoading } = useQuery({
    queryKey: ["serviceLogs", currentPage],
    queryFn: () =>
      serviceLogApi.getAllServiceLogs({ page: currentPage, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes - data tetap fresh selama 5 menit
    gcTime: 10 * 60 * 1000, // 10 minutes - data tetap di cache selama 10 menit (React Query v5)
    placeholderData: (previousData) => previousData, // Pertahankan data sebelumnya saat pagination
  });

  const serviceLogs = useMemo(
    () => serviceLogsResponse?.data || [],
    [serviceLogsResponse?.data]
  );

  const pagination = serviceLogsResponse?.pagination;

  // Memoized filtered service logs based on search term
  const filteredServiceLogs = useMemo(() => {
    if (!debouncedSearchTerm) return serviceLogs;

    return serviceLogs.filter(
      (serviceLog) =>
        serviceLog.vehicle?.registrationPlate
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        serviceLog.vehicle?.make
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        serviceLog.vehicle?.model
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        serviceLog.vehicle?.customer?.name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        serviceLog.notes
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
    );
  }, [serviceLogs, debouncedSearchTerm]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Create service log mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateServiceLogData) =>
      serviceLogApi.createServiceLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceLogs"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] }); // Update vehicle service count
      queryClient.invalidateQueries({ queryKey: ["inventory"] }); // Update inventory stock
      toast.success("Service log created successfully");
      setIsFormModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to create service log");
    },
  });

  // Update service log mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceLogData }) =>
      serviceLogApi.updateServiceLog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceLogs"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Service log updated successfully");
      setIsFormModalOpen(false);
      setEditingServiceLog(null);
    },
    onError: () => {
      toast.error("Failed to update service log");
    },
  });

  // Delete service log mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => serviceLogApi.deleteServiceLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceLogs"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Service log deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedServiceLog(null);
    },
    onError: () => {
      toast.error("Failed to delete service log");
    },
  });

  // Handlers
  const handleCreate = useCallback(() => {
    setEditingServiceLog(null);
    setIsFormModalOpen(true);
  }, []);

  const handleEdit = useCallback((serviceLog: ServiceLog) => {
    setEditingServiceLog(serviceLog);
    setIsFormModalOpen(true);
  }, []);

  const handleDelete = useCallback((serviceLog: ServiceLog) => {
    setSelectedServiceLog(serviceLog);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    (data: CreateServiceLogData | UpdateServiceLogData) => {
      if (editingServiceLog) {
        updateMutation.mutate({
          id: editingServiceLog.id,
          data: data as UpdateServiceLogData,
        });
      } else {
        createMutation.mutate(data as CreateServiceLogData);
      }
    },
    [editingServiceLog, updateMutation, createMutation]
  );

  const handleConfirmDelete = useCallback(() => {
    if (selectedServiceLog) {
      deleteMutation.mutate(selectedServiceLog.id);
    }
  }, [selectedServiceLog, deleteMutation]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <div className="space-y-6 px-8 py-6 min-h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Service Logs</h1>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service Log
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service History</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search service logs by vehicle, customer, or notes..."
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
                    Date
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Vehicle
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Customer
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Total Cost
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Items
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="h-24 text-center">
                      Loading service logs...
                    </td>
                  </tr>
                ) : filteredServiceLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {debouncedSearchTerm
                        ? "No service logs found matching your search."
                        : "No service logs found."}
                    </td>
                  </tr>
                ) : (
                  filteredServiceLogs.map((serviceLog) => (
                    <ServiceLogRow
                      key={serviceLog.id}
                      serviceLog={serviceLog}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      formatCurrency={formatCurrency}
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
                of {pagination.total} service logs
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
      <ServiceLogFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingServiceLog(null);
        }}
        onSubmit={handleFormSubmit}
        serviceLog={editingServiceLog}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteServiceLogDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedServiceLog(null);
        }}
        onConfirm={handleConfirmDelete}
        serviceLog={selectedServiceLog}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

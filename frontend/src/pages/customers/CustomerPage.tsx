import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import {
  customerApi,
  type Customer,
  type CreateCustomerData,
  type UpdateCustomerData,
} from "@/api/customerApi";
import { CustomerFormModal } from "./CustomerFormModal";
import { DeleteCustomerDialog } from "./DeleteCustomerDialog";
import { CustomerRow } from "./CustomerRow";
import { useDebounce } from "@/hooks/useDebounce";

export const CustomerPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const queryClient = useQueryClient();
  const limit = 10;

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch customers
  const { data: customersResponse, isLoading } = useQuery({
    queryKey: ["customers", currentPage],
    queryFn: () => customerApi.getAllCustomers({ page: currentPage, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes - data tetap fresh selama 5 menit
    gcTime: 10 * 60 * 1000, // 10 minutes - data tetap di cache selama 10 menit (React Query v5)
  });

  const customers = useMemo(
    () => customersResponse?.data || [],
    [customersResponse?.data]
  );

  const pagination = customersResponse?.pagination;

  // Memoized filtered customers based on search term
  const filteredCustomers = useMemo(() => {
    if (!debouncedSearchTerm) return customers;

    return customers.filter(
      (customer) =>
        customer.name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        customer.phoneNumber.includes(debouncedSearchTerm)
    );
  }, [customers, debouncedSearchTerm]);

  // Create customer mutation
  const createMutation = useMutation({
    mutationFn: customerApi.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsFormModalOpen(false);
      toast.success("Customer created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create customer");
    },
  });

  // Update customer mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerData }) =>
      customerApi.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsFormModalOpen(false);
      setEditingCustomer(null);
      toast.success("Customer updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update customer");
    },
  });

  // Delete customer mutation
  const deleteMutation = useMutation({
    mutationFn: customerApi.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsDeleteDialogOpen(false);
      setSelectedCustomer(null);
      toast.success("Customer deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete customer");
    },
  });

  // Memoized event handlers
  const handleCreateCustomer = useCallback(
    (data: CreateCustomerData) => {
      createMutation.mutate(data);
    },
    [createMutation]
  );

  const handleUpdateCustomer = useCallback(
    (data: UpdateCustomerData) => {
      if (editingCustomer) {
        updateMutation.mutate({ id: editingCustomer.id, data });
      }
    },
    [editingCustomer, updateMutation]
  );

  const handleDeleteCustomer = useCallback(() => {
    if (selectedCustomer) {
      deleteMutation.mutate(selectedCustomer.id);
    }
  }, [selectedCustomer, deleteMutation]);

  const openCreateModal = useCallback(() => {
    setEditingCustomer(null);
    setIsFormModalOpen(true);
  }, []);

  const openEditModal = useCallback((customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormModalOpen(true);
  }, []);

  const openDeleteDialog = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Reset current page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  return (
    <div className="space-y-6 px-8 py-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer database and their vehicle information.
          </p>
        </div>
        <Button onClick={openCreateModal} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name or phone..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Customer Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Customer
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Phone
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Vehicles
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="h-24 text-center">
                        Loading customers...
                      </td>
                    </tr>
                  ) : filteredCustomers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No customers found.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <CustomerRow
                        key={customer.id}
                        customer={customer}
                        onEdit={openEditModal}
                        onDelete={openDeleteDialog}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} customers
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(pagination.totalPages, prev + 1)
                    )
                  }
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CustomerFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={editingCustomer ? handleUpdateCustomer : handleCreateCustomer}
        customer={editingCustomer}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteCustomerDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedCustomer(null);
        }}
        onConfirm={handleDeleteCustomer}
        customer={selectedCustomer}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import {
  inventoryApi,
  type InventoryItem,
  type CreateInventoryItemData,
  type UpdateInventoryItemData,
} from "@/api/inventoryApi";

import { useDebounce } from "@/hooks/useDebounce";
import { InventoryRow } from "./InventoryRow";
import { DeleteInventoryDialog } from "./DeleteInventoryDialog";
import { InventoryFormModal } from "./InventoryFormModal";

export const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [stockFilter, setStockFilter] = useState<
    "all" | "low" | "out" | "available"
  >("all");
  const [sortBy, setSortBy] = useState<
    "name" | "sku" | "stock" | "sellingPrice"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] =
    useState<InventoryItem | null>(null);
  const [editingInventory, setEditingInventory] =
    useState<InventoryItem | null>(null);

  const queryClient = useQueryClient();
  const limit = 10;

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Build query parameters
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit,
      search: debouncedSearchTerm || undefined,
      stockFilter: stockFilter !== "all" ? stockFilter : undefined,
      sortBy,
      sortOrder,
    }),
    [currentPage, debouncedSearchTerm, stockFilter, sortBy, sortOrder]
  );

  // Fetch inventory items
  const { data: inventoryResponse, isLoading } = useQuery({
    queryKey: ["inventory", queryParams],
    queryFn: () => inventoryApi.getAllInventoryItems(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes - data tetap fresh selama 5 menit
    gcTime: 10 * 60 * 1000, // 10 minutes - data tetap di cache selama 10 menit (React Query v5)
    placeholderData: (previousData) => previousData, // Pertahankan data sebelumnya saat pagination
  });

  const inventoryItems = useMemo(
    () => inventoryResponse?.data || [],
    [inventoryResponse?.data]
  );

  const pagination = inventoryResponse?.pagination;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, stockFilter, sortBy, sortOrder]);

  // Create inventory item mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateInventoryItemData) =>
      inventoryApi.createInventoryItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Inventory item created successfully");
      setIsFormModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to create inventory item");
    },
  });

  // Update inventory item mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryItemData }) =>
      inventoryApi.updateInventoryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Inventory item updated successfully");
      setIsFormModalOpen(false);
      setEditingInventory(null);
    },
    onError: () => {
      toast.error("Failed to update inventory item");
    },
  });

  // Delete inventory item mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => inventoryApi.deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Inventory item deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedInventory(null);
    },
    onError: () => {
      toast.error("Failed to delete inventory item");
    },
  });

  // Handlers
  const handleCreate = useCallback(() => {
    setEditingInventory(null);
    setIsFormModalOpen(true);
  }, []);

  const handleEdit = useCallback((inventory: InventoryItem) => {
    setEditingInventory(inventory);
    setIsFormModalOpen(true);
  }, []);

  const handleDelete = useCallback((inventory: InventoryItem) => {
    setSelectedInventory(inventory);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    (data: CreateInventoryItemData | UpdateInventoryItemData) => {
      if (editingInventory) {
        updateMutation.mutate({
          id: editingInventory.id,
          data: data as UpdateInventoryItemData,
        });
      } else {
        createMutation.mutate(data as CreateInventoryItemData);
      }
    },
    [editingInventory, updateMutation, createMutation]
  );

  const handleConfirmDelete = useCallback(() => {
    if (selectedInventory) {
      deleteMutation.mutate(selectedInventory.id);
    }
  }, [selectedInventory, deleteMutation]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return { status: "out", label: "Out of Stock", color: "destructive" };
    if (stock <= 5)
      return { status: "low", label: "Low Stock", color: "warning" }; // Default low stock threshold
    return { status: "available", label: "Available", color: "default" };
  };

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalItems = inventoryItems.length;
    const lowStockItems = inventoryItems.filter(
      (item) => item.stock <= 5 && item.stock > 0
    ).length;
    const outOfStockItems = inventoryItems.filter(
      (item) => item.stock === 0
    ).length;
    const totalValue = inventoryItems.reduce(
      (sum, item) => sum + item.stock * item.sellingPrice,
      0
    );

    return { totalItems, lowStockItems, outOfStockItems, totalValue };
  }, [inventoryItems]);

  return (
    <div className="space-y-6 px-8 py-6 min-h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Inventory Management</h1>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.lowStockItems}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.outOfStockItems}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={stockFilter}
                onValueChange={(value: "all" | "low" | "out" | "available") =>
                  setStockFilter(value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(
                  value: "name" | "sku" | "stock" | "sellingPrice"
                ) => setSortBy(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="sku">SKU</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="sellingPrice">Price</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortOrder}
                onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">↑ Asc</SelectItem>
                  <SelectItem value="desc">↓ Desc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Name
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    SKU
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Stock
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Price
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Status
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
                      Loading inventory items...
                    </td>
                  </tr>
                ) : inventoryItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {debouncedSearchTerm || stockFilter !== "all"
                        ? "No inventory items found matching your criteria."
                        : "No inventory items found."}
                    </td>
                  </tr>
                ) : (
                  inventoryItems.map((item) => (
                    <InventoryRow
                      key={item.id}
                      inventory={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      formatCurrency={formatCurrency}
                      getStockStatus={getStockStatus}
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
                of {pagination.total} inventory items
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
      <InventoryFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingInventory(null);
        }}
        onSubmit={handleFormSubmit}
        inventory={editingInventory}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteInventoryDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedInventory(null);
        }}
        onConfirm={handleConfirmDelete}
        inventory={selectedInventory}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

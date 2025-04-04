import React, { useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTenderFilters } from "@/components/hook/use-tender-filters";
import TenderFilters, { FilterLabels } from "./tender-filters";
import SearchTab from "./search-tab";
import Loading from "../ui/loading";
import TenderDetailsDialog from "../shared/TenderDetailsDialog";
import TenderColumns from "./tender-columns";
import { toast } from "sonner";
import { getTenderValueCategory } from "@/utils/utils";
import { clear } from "console";
import { Input } from "@/components/ui/input";

export function DataTableTender({ setSearch, search, setTenderLength }: any) {
  const [foryou, setForYou] = React.useState<any | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRowData, setSelectedRowData] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState<any>([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const foryouValue = params.get("foryou");
      if (foryouValue == "true") setForYou(true);
      else setForYou(false);
    }
  }, []);
  React.useEffect(() => {
    if (searchQuery.trim()) {
      setColumnFilters((prev) => [
        ...prev.filter((filter) => filter.id !== "TenderId"),
        {
          id: "TenderId",
          value: searchQuery,
        },
      ]);
    } else {
      setColumnFilters((prev) =>
        prev.filter((filter) => filter.id !== "TenderId"),
      );
    }
  }, [searchQuery]);

  const {
    districts,
    departments,
    selectedDistricts,
    setSelectedDistricts,
    industry,
    setIndustry,
    classification,
    setFilterClassification,
    filterClassification,
    setClassification,
    dateRange,
    setDateRange,
    buildQueryParams,
    filterIndustry,
    filterSubIndustry,
    searchList,
    setSearchList,
    suggestionIndustry,
    suggestionClassification,
  } = useTenderFilters();
  const [selectedTenderValues, setSelectedTenderValues] = React.useState<any>(
    [],
  );
  const [page, setPage] = React.useState(0);
  const [inputPage, setInputPage] = React.useState(1);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input
    setInputPage(value === "" ? 1 : Math.max(1, parseInt(value)));
  };

  const handleGoToPage = () => {
    // Adjust for zero-based indexing and ensure within bounds
    const targetPage = Math.min(
      Math.max(0, inputPage - 1),
      Math.ceil((tenders?.count || 0) / 10) - 1,
    );
    setPage(targetPage);
  };

  // Update inputPage when page changes
  React.useEffect(() => {
    setInputPage(page + 1);
  }, [page]);

  const {
    data: tenders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "tenders",
      buildQueryParams().toString(),
      page,
      selectedTenderValues,
      sorting,
    ],
    queryFn: async () => {
      const params = buildQueryParams();

      if (sorting.length > 0) {
        const sortColumn = sorting[0].id;
        const sortDirection = sorting[0].desc ? "desc" : "asc";
        params.append("sortBy", sortColumn);
        params.append("sortOrder", sortDirection);
      }

      if (selectedTenderValues.length > 0) {
        selectedTenderValues.forEach((value: string) =>
          params.append("tenderValue", value),
        );
      }
      params.append("limit", "10");
      params.append("offset", (page * 10).toString());

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_ENPOINT +
          `/api/tender/all?${params.toString()}`,
      );
      if (!response.ok) {
        toast.error("Failed to fetch tenders");
      }
      return response.json();
    },
  });
  const columns = TenderColumns({ refetchTenders: refetch });

  const clearFilters = useCallback(() => {
    // Reset all state variables to their initial values
    setSelectedDistricts([]);
    setSelectedTenderValues([]);
    setIndustry([]);
    setClassification([]);
    setDateRange(null);
    setSearchList([]);

    // Trigger a refetch to reset the data
    refetch();
  }, [refetch]); // Add refetch to dependency array

  const handleRowClick = useCallback((rowData: any, isActionClick: boolean) => {
    if (!isActionClick) {
      setSelectedRowData(rowData);
    }
  }, []);

  const table = useReactTable({
    data: tenders?.result || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    if (tenders?.count !== undefined) {
      setTenderLength(tenders.count);
    }
  }, [tenders?.count]);

  React.useEffect(() => {
    if (rowSelection) {
      const selectedRows = table?.getSelectedRowModel()?.rows;
      const ids = selectedRows.map((row: any) => row.original._id);
      setSelectedRow(ids);
    }
  }, [rowSelection, table]);

  React.useEffect(() => {
    if (foryou) {
      setIndustry(suggestionIndustry);
      setClassification(suggestionClassification);
    } else {
      clearFilters();
    }
  }, [foryou, suggestionIndustry, suggestionClassification]);

  if (isLoading) return <Loading />;

  const isAnyRowSelected = Object.values(rowSelection).some(
    (selected) => selected,
  );

  const dropdownData: any = {
    District: districts.map((district) => ({
      value: district.toLowerCase().replace(/\s+/g, ""),
      label: district,
    })),
    "Tender Value": [
      { value: "1", label: "Less than ₹10L" },
      { value: "2", label: "₹10L - ₹1Cr" },
      { value: "3", label: "₹1Cr - ₹100Cr" },
      { value: "4", label: "More than ₹100Cr" },
    ],
    Department: departments.map((department) => ({
      value: department
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, ""),
      label: department,
    })),
    Industry: filterIndustry,
    SubIndustry: filterSubIndustry,
    Classification: filterClassification,
  };

  const handletoDeleteSelecteddata = async () => {
    try {
      const deletePromises = selectedRow.map((id: string) =>
        fetch(`${process.env.NEXT_PUBLIC_API_ENPOINT}/api/tender/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      const responses = await Promise.all(deletePromises);

      const allSuccessful = responses.every((response) => response.ok);

      if (allSuccessful) {
        toast.success("All selected tenders were deleted successfully");

        refetch();
      } else {
        toast.error("Some tenders could not be deleted");
      }
    } catch (error) {
      console.error("Error deleting tenders:", error);
      toast.error("Failed to delete tenders");
    }
  };

  return (
    <div className="w-full rounded-xl border">
      <div className="flex items-start justify-between px-2 py-2">
        <div className="flex items-start gap-2">
          {isAnyRowSelected && (
            <button
              onClick={handletoDeleteSelecteddata}
              className="w-full text-nowrap rounded-md bg-[#1C1A1A] px-4 py-2.5 text-xs text-white"
            >
              Delete Selected Documents
            </button>
          )}
        </div>
      </div>

      <div className="w-full">
        <div className="mb-4 ml-4 flex items-center gap-2">
          <Input
            placeholder="Search by Tender ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <ScrollArea>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="font-roboto cursor-pointer"
                        onClick={() => {
                          if (
                            cell.column.columnDef.id !== "select" &&
                            cell.column.columnDef.id !== "actions"
                          ) {
                            handleRowClick(row.original, false);
                          }
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        <TenderDetailsDialog
          selectedRowData={selectedRowData}
          setSelectedRowData={setSelectedRowData}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {tenders?.count || 0} total
        </div>
        <div className="flex items-center space-x-8">
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Page</span>
              <input
                type="number"
                value={inputPage}
                onChange={handlePageInputChange}
                min="1"
                max={Math.ceil((tenders?.count || 0) / 10)}
                className="w-16 rounded border px-2 py-1 text-sm"
              />
              <Button variant="default" size="sm" onClick={handleGoToPage}>
                Go
              </Button>
            </div>

            <div className="text-sm">
              of {Math.ceil((tenders?.count || 0) / 10)}
            </div>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(0)}
              disabled={page === 0}
              className="text-black/35 hover:text-black/100"
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.ceil((tenders?.count || 0) / 10) - 1)}
              disabled={page >= Math.ceil((tenders?.count || 0) / 10) - 1}
              className="text-black/35 hover:text-black/100"
            >
              Last
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
            >
              Previous
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil((tenders?.count || 0) / 10) - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

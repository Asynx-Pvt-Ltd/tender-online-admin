"use client";
import BreadCrumb from "@/components/breadcrumb";
import Documents from "@/components/tables/documents";
import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";

const breadcrumbItems = [
  {
    title: "Tender Documents Request",
    link: "/dashboard/tender-document-request",
  },
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const country = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const {
    data: tender,
    isLoading,
    error,
    refetch,
  } = useQuery(["tender", { page, limit: pageLimit, country }], () =>
    fetch(
      process.env.NEXT_PUBLIC_API_ENPOINT + `/api/tender/tenderRequest`,
    ).then((res) => res.json()),
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;
  const totalUsers = tender?.mappings?.length ?? 0;
  const downloadExcel = () => {
    if (!tender?.mappings?.length) return;

    const excelData = tender.mappings.map((item: any) => ({
      "Tender Title": item.tenderTitle,
      "Tender Id": item.tenderId,
      "Client Id": item.userId?.clientId,
      "Contact Person": item.userId?.name,
      Phone: item.userId?.phone,
      Email: item.userId?.email,
      "Requested On": new Date(item.createdAt).toLocaleDateString(),
      Remarks: item.note || "",
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 30 }, // Tender Title
      { wch: 15 }, // Tender Id
      { wch: 15 }, // Client Id
      { wch: 20 }, // Contact Person
      { wch: 15 }, // Phone
      { wch: 25 }, // Email
      { wch: 15 }, // Requested On
      { wch: 30 }, // Remarks
    ];
    worksheet["!cols"] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Tender Requests");

    const currentDate = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `tender_requests_${currentDate}.xlsx`);
  };

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        {/* <ScrollArea className="h-[80vh]"> */}
        <div className="flex items-start justify-between space-x-4">
          <Heading
            title={`Tender Documents Request (${totalUsers})`}
            description="List of all tender documents request"
          />
          <Button
            onClick={downloadExcel}
            className="flex items-center gap-2 bg-[#222222] text-white hover:bg-gray-700"
            disabled={!tender?.mappings?.length}
          >
            <Download size={16} />
            Export Excel
          </Button>
        </div>
        <Separator />
        <div className="">
          <DataTableDemo data={tender?.mappings} />
          {/* <Documents data={tender?.mappings} /> */}
        </div>
        {/* </ScrollArea> */}
      </div>
    </>
  );
}

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "tenderTitle",
    header: "Tender Title",
  },
  {
    accessorKey: "tenderId",
    header: "Tender Id",
  },
  {
    accessorKey: "userId.clientId",
    header: "Client Id",
  },
  {
    accessorKey: "userId.name",
    header: "Contact Person",
  },
  {
    accessorKey: "userId.phone",
    header: "Phone",
  },
  {
    accessorKey: "userId.email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Requested On",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString();
    },
  },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => (
  //     <span className={`status-${row.getValue("status")}`}>
  //       {row.getValue("status")}
  //     </span>
  //   ),
  // },
  {
    accessorKey: "note",
    header: "Remarks",
    cell: ({ row }) => {
      const [isEditing, setIsEditing] = React.useState(false);
      const [noteText, setNoteText] = React.useState(row.original.note || "");
      const queryClient = useQueryClient();

      const updateNoteMutation = useMutation(
        (newNote: string) =>
          fetch(
            `${process.env.NEXT_PUBLIC_API_ENPOINT}/api/tender/tenderRequest/${row.original._id}/note`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ note: newNote }),
            },
          ).then((res) => res.json()),
        {
          onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries("tender");
            setIsEditing(false);
          },
        },
      );

      const handleSaveNote = () => {
        updateNoteMutation.mutate(noteText);
      };

      if (isEditing) {
        return (
          <div className="flex items-center space-x-2">
            <Input
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-[10vw]"
            />
            <Button
              variant="default"
              onClick={handleSaveNote}
              disabled={updateNoteMutation.isLoading}
            >
              Save
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        );
      }

      return (
        <div className="flex justify-between space-x-2">
          <span className="font-xs w-[100px] text-balance">
            {noteText || "Add a remark"}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        </div>
      );
    },
  },
];

function DataTableDemo({ data }: any) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: false,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (!data) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {/* <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <div className="overflow-y-scroll rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
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
                    <TableCell key={cell.id}>
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
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-center text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>

        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          {Array.from({ length: table.getPageCount() }, (_, i) => i)
            .filter((pageIndex) => {
              const currentPage = table.getState().pagination.pageIndex;
              return (
                pageIndex === currentPage ||
                pageIndex === currentPage + 1 ||
                pageIndex === currentPage + 2
              );
            })
            .map((pageIndex) => (
              <Button
                key={pageIndex}
                variant={
                  table.getState().pagination.pageIndex === pageIndex
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => table.setPageIndex(pageIndex)}
              >
                {pageIndex + 1}
              </Button>
            ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

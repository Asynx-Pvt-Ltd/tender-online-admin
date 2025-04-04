"use client";

import { useRouter } from "next/router";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useState } from "react";
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

// Your format functions (unchanged)
export const formatDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const year = date.getUTCFullYear().toString().slice(-2);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate().toString().padStart(2, "0");
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${day}/${month}/${year} ${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
};

export function formatIndianRupeePrice(amount: any): string {
  if (
    amount === undefined ||
    amount === null ||
    amount === 0 ||
    Number.isNaN(amount)
  ) {
    return "Refer the document";
  }

  const numAmount = Number(String(amount).replace(/,/g, ""));
  if (Number.isNaN(numAmount)) {
    return "Refer the document";
  }

  const formatWithUnits = (value: number): string => {
    if (value >= 1e7) {
      const crore = value / 1e7;
      return `${crore.toFixed(2).replace(/\.00$/, "")} Crore`;
    } else if (value >= 1e5) {
      const lakh = value / 1e5;
      return `${lakh.toFixed(2).replace(/\.00$/, "")} Lakh`;
    }
    return value.toLocaleString("en-IN");
  };

  return `₹${formatWithUnits(numAmount)}`;
}

export default function TenderColumns({
  refetchTenders,
}: {
  refetchTenders: () => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENPOINT}/api/tender/${deletingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        toast.success("Tender deleted successfully");
        refetchTenders(); // Trigger refetch after successful deletion
      } else {
        toast.error("Failed to delete tender");
      }
    } catch (error) {
      console.error("Error deleting tender:", error);
      toast.error("Failed to delete tender");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="rounded"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          title="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="rounded"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          title="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorFn: (row) =>
        `${row.department} - ${row.tenderName} - ${row.classification}`,
      header: "Tender Information",
      cell: ({ row }) => {
        const department = row.original.department;
        const tenderName = row.original.tenderName;
        const classification = row.original.classification;

        return (
          <div className="flex min-w-60 items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="font-bold text-gray-900" title="Department">
                {/* {department} */}
              </span>
              <span
                className="line-clamp-2 whitespace-break-spaces text-xs font-bold text-gray-900"
                title="Tender Title"
              >
                {tenderName}
              </span>
            </div>

            <span
              className="flex w-max items-center gap-1 whitespace-nowrap rounded-full border bg-[#ECFDF3] px-2 text-[9px] font-bold text-[#027A48]"
              title="Classification"
            >
              <div className="h-1 w-1 rounded-full bg-green-500" />
              {classification}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "TenderId", // Note: This should match the property name from your data
      header: ({ column }) => (
        <div className="ml-4 text-xs text-gray-500" title="Tender ID">
          Tender ID
        </div>
      ),
      cell: ({ row }) => (
        <div className="line-clamp-2 text-center text-xs" title="Tender ID">
          {row.original.TenderId}
        </div>
      ),
      filterFn: (row, id, value) => {
        return String(row.getValue(id))
          .toLowerCase()
          .includes(String(value).toLowerCase());
      },
    },

    {
      accessorKey: "bidSubmissionDate",
      header: ({ column }) => (
        <Button
          className="text-xs text-gray-500"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          title="Sort by Bid Submission Date"
        >
          Bid Submission Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div
          className="ml-3 w-32 text-center text-xs"
          title="Bid Submission Date"
        >
          {formatDate(row.getValue("bidSubmissionDate"))}
        </div>
      ),
    },
    {
      accessorKey: "district",
      header: ({ column }) => (
        <div className="ml-4 text-xs text-gray-500" title="District">
          District
        </div>
      ),
      cell: ({ row }) => (
        <div className="line-clamp-2 text-center text-xs" title="District">
          {row.getValue("district")}
        </div>
      ),
    },
    {
      accessorKey: "emdValue",
      header: ({ column }) => (
        <div className="ml-3 text-xs text-gray-500" title="EMD Value">
          EMD Value
        </div>
      ),
      cell: ({ row }) => (
        <div className="line-clamp-2 text-center text-xs" title="EMD Value">
          {row.original.EMDAmountin}
        </div>
      ),
    },
    {
      accessorKey: "EMD Exemption Allowed",
      header: ({ column }) => (
        <div
          className="ml-3 text-xs text-gray-500"
          title="EMD Exemption Allowed"
        >
          EMD Exemption Allowed
        </div>
      ),
      cell: ({ row }) => (
        <div
          className="line-clamp-2 text-center text-xs"
          title="EMD Exemption Allowed"
        >
          {row.original.EMDExemptionAllowed}
        </div>
      ),
    },
    {
      accessorKey: "tenderValue",
      header: ({ column }) => (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center text-xs text-gray-500"
          variant="ghost"
          title="Tender Value (₹)"
        >
          Tender Value (₹)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div title="Tender Value (₹)" className="text-center">
          {formatIndianRupeePrice(row.getValue("tenderValue"))}
        </div>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const valueA = Number(
          String(rowA.getValue(columnId)).replace(/,/g, ""),
        );
        const valueB = Number(
          String(rowB.getValue(columnId)).replace(/,/g, ""),
        );

        return valueA - valueB;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-xs text-gray-500">Actions</div>,
      cell: ({ row }) => (
        <>
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setDeletingId(row.original._id);
                setIsDeleteDialogOpen(true);
              }}
              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
              title="Delete tender"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <AlertDialog
            open={isDeleteDialogOpen && deletingId === row.original._id}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this tender from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ),
    },
  ];

  return columns;
}

"use client";

import { useRouter } from "next/router";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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

export default function TenderColumns() {
  // const router = useRouter();
  // const isForYou = router.query.foryou === "true"; // Check if the query parameter is present

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
  ];

  return columns;
}

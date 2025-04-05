"use client";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/employee-tables/columns";
import EmployeeTable from "@/components/tables/employee-tables/employee-table";

import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useQuery } from "react-query";
import { useState } from "react";
import { DataTableTender } from "@/components/table/tender-table";

const breadcrumbItems = [{ title: "Tender", link: "/dashboard/tender" }];

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
  const [search, setSearch] = useState("");
  const [tenderLength, setTenderLength] = useState<null | 0>(0);

  const [isDataDeleted, setIsDataDeleted] = useState(false);

  const handletodelete = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_ENPOINT + "/api/tender/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        setIsDataDeleted(true);
        setTenderLength(0);
        toast({
          title: "Data Deleted",
          description: "All data has been deleted",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Total Tender (${tenderLength})`} description="" />

          <Link
            href={"/dashboard/tender/new"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>

          <button
            onClick={handletodelete}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Delete all data
          </button>
        </div>
        <Separator />

        {!isDataDeleted ? (
          // <ScrollArea className="h-[68vh]">
          <DataTableTender
            setSearch={setSearch}
            search={search}
            setTenderLength={setTenderLength}
          />
        ) : (
          // </ScrollArea>
          <div className="mt-8 text-center text-gray-500">
            No tenders available. Add a new tender or restore data.
          </div>
        )}
      </div>
    </>
  );
}

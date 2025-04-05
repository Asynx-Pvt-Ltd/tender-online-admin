"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface User {
  name: string;
  email: string;
  clientId: string;
  keyword: string[];
}

const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Use useEffect to fetch data
  useEffect(() => {
    const fetchKeywords = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_ENPOINT + "/api/auth/allUsersKeywords",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch keywords");
        }

        const responseData = await response.json();
        setData(responseData.user);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchKeywords();
  }, []);

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / rowsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;
  if (error)
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;

  const downloadExcel = () => {
    if (!data.length) return;

    const excelData = data.map((user) => ({
      Name: user.name,
      Email: user.email,
      "Client ID": user.clientId,
      Keywords: user.keyword.join(", "),
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const columnWidths = [
      { wch: 20 }, // Name
      { wch: 25 }, // Email
      { wch: 15 }, // Client ID
      { wch: 50 }, // Keywords
    ];
    worksheet["!cols"] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "User Keywords");

    const currentDate = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `user_keywords_${currentDate}.xlsx`);
  };

  return (
    <div className="container mx-auto space-y-4 p-6">
      <h2 className="mb-4 text-center text-2xl font-bold">User Keywords</h2>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Keywords</h2>
        <Button
          onClick={downloadExcel}
          className="flex items-center gap-2 bg-[#222222] text-white hover:bg-gray-700"
          disabled={!data.length}
        >
          <Download size={16} />
          Download Excel
        </Button>
      </div>
      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Client ID</TableHead>
            <TableHead>Keywords</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRows.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.clientId}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {user.keyword.map((kw, kwIndex) => (
                    <Badge key={kwIndex} variant="secondary">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {pageNumbers.map((number) => (
            <PaginationItem key={number}>
              <PaginationLink
                href="#"
                onClick={() => paginate(number)}
                isActive={currentPage === number}
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, pageNumbers.length))
              }
              className={
                currentPage === pageNumbers.length
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Page;

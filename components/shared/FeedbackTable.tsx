"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { formatDate } from "@/utils/utils";

interface FeedbackData {
  content: string;
  name: string;
  email: string;
  clientId: string;
  keyword: string[];
  improvement: string[];
  timestampImprovement: string[];
}

const ITEMS_PER_PAGE = 10;

const ExpandableTableRow = ({ feedback }: { feedback: FeedbackData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow
        className="group cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <TableCell>
          <div className="flex items-center gap-2">
            <div className="transform transition-transform duration-200 ease-in-out">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
              )}
            </div>
            {feedback.clientId}
          </div>
        </TableCell>
        <TableCell>{feedback.name}</TableCell>
        <TableCell>{feedback.email}</TableCell>
        <TableCell className="text-gray-500">
          {feedback.improvement.length} improvements
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow>
          <TableCell colSpan={4} className="bg-gray-50 p-4">
            <div className="space-y-4">
              {feedback.improvement.map((improvement, index) => (
                <Card
                  key={index}
                  className="bg-white transition duration-200 hover:shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {feedback.timestampImprovement[index] &&
                        formatDate(feedback.timestampImprovement[index])}
                    </div>
                    <div className="rounded-md bg-gray-50 p-3 text-gray-700">
                      {improvement}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const FeedbackTable = ({ feedbacks }: { feedbacks: FeedbackData[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(feedbacks.length / ITEMS_PER_PAGE);

  const paginatedFeedbacks = feedbacks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Improvements</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedFeedbacks.map((feedback, index) => (
            <ExpandableTableRow key={index} feedback={feedback} />
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
              </PaginationItem>
            )}

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(currentPage + 1)}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default FeedbackTable;

"use client";
import React, { useState } from "react";
import { NextPage } from "next";
import { useEffect } from "react";
import BreadCrumb from "@/components/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ChevronDown, ChevronUp, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FeedbackData {
  content: string;
  name: string;
  email: string;
  clientId: string;
  keyword: string[];
  improvement: string[];
  timestampImprovement: string[];
}

const breadcrumbItems = [
  {
    title: "Feedback",
    link: "/dashboard/feedback",
  },
];

const ITEMS_PER_PAGE = 10;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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

      <TableRow className="overflow-hidden">
        <TableCell colSpan={4} className="bg-gray-50 p-0">
          <div
            className={`transform transition-all duration-200 ease-in-out ${
              isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-4 p-4">
              {feedback.improvement.map((improvement, index) => (
                <Card
                  key={index}
                  className="transform bg-white transition-all duration-200 ease-in-out hover:shadow-md"
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
          </div>
        </TableCell>
      </TableRow>
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
        <div className="mt-4 flex justify-end gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`rounded px-3 py-1 transition-all duration-200 ease-in-out ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Page: NextPage = () => {
  const [data, setData] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_ENPOINT + "/api/auth/allmessages",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const responseData = await response.json();
        setData(responseData.user);
      } catch (error) {
        console.error("Error", error);
        setError("Failed to load feedback messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const feedbackWithImprovements = data.filter(
    (feedback) => feedback.improvement && feedback.improvement.length > 0,
  );

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">User Feedback</h1>
          <div className="text-sm text-gray-500">
            Total feedbacks: {feedbackWithImprovements.length}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 text-red-800">{error}</CardContent>
          </Card>
        )}

        {!loading && !error && feedbackWithImprovements.length === 0 && (
          <Card>
            <CardContent className="p-4 text-gray-500">
              No feedback with improvements available
            </CardContent>
          </Card>
        )}

        {!loading && !error && feedbackWithImprovements.length > 0 && (
          <FeedbackTable feedbacks={feedbackWithImprovements} />
        )}
      </div>
    </div>
  );
};

export default Page;

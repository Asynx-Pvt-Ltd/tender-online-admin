"use client";
import React, { useEffect, useState } from "react";
import BreadCrumb from "@/components/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import FeedbackTable from "@/components/shared/FeedbackTable";

interface FeedbackData {
  content: string;
  name: string;
  email: string;
  clientId: string;
  keyword: string[];
  improvement: string[];
  timestampImprovement: string[];
}

const breadcrumbItems = [{ title: "Feedback", link: "/dashboard/feedback" }];

const Page = () => {
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
        console.error("Error fetching feedback:", error);
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
      <h1 className="text-2xl font-bold">User Feedback</h1>

      {loading && (
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-500" />
      )}
      {error && (
        <Card>
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
  );
};

export default Page;

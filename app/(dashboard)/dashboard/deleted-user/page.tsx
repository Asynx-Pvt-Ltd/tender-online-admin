"use client";
import React, { useEffect, useState } from "react";
import BreadCrumb from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

// Breadcrumb Items
const breadcrumbItems = [
  {
    title: "User Management",
    link: "/dashboard/user-management",
  },
  {
    title: "Deleted Users",
    link: "/dashboard/user-management/deleted-users",
  },
];

type DeletedUser = {
  _id: string;
  originalId: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  isPayment: boolean;
  subscriptionValidity: string;
  companyName: string;
  paymentStatus: string;
  clientId: string;
  improvement: string;
  deletedAt: string;
  createdAt: string;
};

// API fetch deleted users
const fetchDeletedUsers = async (
  page: number,
  limit: number,
  search: string | null,
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENPOINT}/api/auth/deleted-users?page=${page}&limit=${limit}&search=${search || ""}`,
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error fetching deleted users:", errorData);
      throw new Error(errorData.message || "Failed to fetch deleted users");
    }

    return res.json();
  } catch (error) {
    console.error("Error in fetchDeletedUsers:", error);
    throw error;
  }
};

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function DeletedUsersPage({ searchParams }: ParamsProps) {
  const [selectedUser, setSelectedUser] = useState<DeletedUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const [search, setSearch] = useState<string | null>(null);

  const { data, error, isLoading, refetch } = useQuery(
    ["deletedUsers", page, pageLimit, search],
    () => fetchDeletedUsers(page, pageLimit, search),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      onError: (err: any) => {
        console.error("Query error:", err);
        toast({
          title: "Failed to load deleted users",
          description: err.message,
          variant: "destructive",
        });
      },
    },
  );

  useEffect(() => {
    refetch();
  }, [search, page, pageLimit, refetch]);

  const handleRowClick = (user: DeletedUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateString;
    }
  };

  const handleSearch = () => {
    refetch();
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />

      <ScrollArea className="h-[80vh]">
        <div className="flex items-start justify-between space-x-4">
          <Heading
            title={`Deleted Users (${data?.totalUsers || 0})`}
            description="View history of deleted user accounts."
          />
          <Link href="/dashboard/user-management">
            <Button variant="outline">Back to Users</Button>
          </Link>
        </div>
        <Separator />

        {/* Search bar */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              onChange={(e) => setSearch(e.target.value)}
              value={search || ""}
              type="text"
              placeholder="Search by name, email, phone, etc."
              className="w-96 rounded-lg border border-gray-200 px-4 py-2"
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="mt-8 text-center">Loading deleted users...</div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="mt-8 text-center text-red-500">
            Error loading deleted users. Please try again.
          </div>
        )}

        {/* Deleted Users table */}
        {!isLoading && !error && data && (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full rounded-lg border border-gray-200 text-left text-sm">
              <thead className="bg-gray-50">
                <tr className="text-gray-700">
                  <th className="border-b px-4 py-2">Client ID</th>
                  <th className="border-b px-4 py-2">Name</th>
                  <th className="border-b px-4 py-2">Email</th>
                  <th className="border-b px-4 py-2">Deleted At</th>
                </tr>
              </thead>
              <tbody>
                {data.deletedUsers &&
                  data.deletedUsers.map((user: DeletedUser) => (
                    <tr
                      key={user._id}
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => handleRowClick(user)}
                    >
                      <td className="border-b px-4 py-2">{user.clientId}</td>
                      <td className="border-b px-4 py-2">{user.name}</td>
                      <td className="border-b px-4 py-2">{user.email}</td>
                      <td className="border-b px-4 py-2">
                        {formatDate(user.deletedAt)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {(!data.deletedUsers || data.deletedUsers.length === 0) && (
              <div className="mt-4 text-center text-gray-500">
                No deleted users found.
              </div>
            )}

            {/* Pagination controls */}
            {data.totalPages > 1 && (
              <div className="mt-4 flex justify-center space-x-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => {
                    window.location.href = `?page=${page - 1}&limit=${pageLimit}${search ? `&search=${search}` : ""}`;
                  }}
                >
                  Previous
                </Button>

                <span className="flex items-center px-2">
                  Page {page} of {data.totalPages}
                </span>

                <Button
                  variant="outline"
                  disabled={page >= data.totalPages}
                  onClick={() => {
                    window.location.href = `?page=${page + 1}&limit=${pageLimit}${search ? `&search=${search}` : ""}`;
                  }}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Modal popup for showing detailed user info */}
      {selectedUser && (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deleted User Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phone}
              </p>
              <p>
                <strong>Client ID:</strong> {selectedUser.clientId || "N/A"}
              </p>
              <p>
                <strong>Company:</strong> {selectedUser.companyName || "N/A"}
              </p>
              <p>
                <strong>Status Before Deletion:</strong>{" "}
                {selectedUser.status === "active" ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </p>
              <p>
                <strong>Subscription:</strong>{" "}
                {selectedUser.isPayment && selectedUser.subscriptionValidity
                  ? `Valid until: ${new Date(
                      selectedUser.subscriptionValidity,
                    ).toLocaleDateString()}`
                  : "No active subscription"}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                {selectedUser.paymentStatus || "N/A"}
              </p>
              <p>
                <strong>Improvement Notes:</strong>{" "}
                {selectedUser.improvement || "N/A"}
              </p>
              <p>
                <strong>Deleted At:</strong>{" "}
                {formatDate(selectedUser.deletedAt)}
              </p>
              <p>
                <strong>Original User ID:</strong> {selectedUser.originalId}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import BreadCrumb from "@/components/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
import { Toast } from "@/components/ui/toast";

// Breadcrumb Items
const breadcrumbItems = [
  {
    title: "User Management",
    link: "/dashboard/user-management",
  },
];

type User = {
  _id: string;
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
};

// API fetch users
const fetchUsers = async (
  page: number,
  limit: number,
  search: string | null,
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_ENPOINT +
      `/api/auth/users?page=${page}&limit=${limit}&search=${search || ""}`,
  );
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

// API to delete user
const deleteUser = async (userId: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_ENPOINT + `/api/auth/users/${userId}`,
    {
      method: "DELETE",
    },
  );
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
};

// API to update user status
const updateUserStatus = async (
  userId: string,
  newStatus: "active" | "inactive",
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_ENPOINT + `/api/auth/users/${userId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    },
  );
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function Page({ searchParams }: ParamsProps) {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const [search, setSearch] = useState<string | null>(null);

  const { data, error, refetch } = useQuery(
    ["users", { page, limit: pageLimit }],
    () => fetchUsers(page, pageLimit, search),
    {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  );

  useEffect(() => {
    refetch();
  }, [search]);

  const handletoStatusUser = async (userId: any, status: string) => {
    const response = await axios.patch(
      process.env.NEXT_PUBLIC_API_ENPOINT + `/api/auth/users/${userId}/status`,
      {
        status: status === "active" ? "inactive" : "active",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response);

    if (response.data.code === 200) {
      refetch();
      toast({
        title: `User ${status === "active" ? "deactivated" : "activated"} successfully`,
      });
    } else {
      toast({
        title: `Failed to ${status === "active" ? "deactivate" : "activate"} user`,
        variant: "destructive",
      });
    }
  };

  const deleteUserMutation = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      toast({ title: "User deleted successfully" });
      setIsDeleteModalOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to delete user", variant: "destructive" });
      setIsDeleteModalOpen(false);
    },
  });

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const openDeleteConfirmation = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete);
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  if (!data) return <div>Loading...</div>;
  if (error) return <div>Error loading data.</div>;

  const users: User[] = data || [];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />

      <ScrollArea className="h-[80vh]">
        <div className="flex items-start justify-between space-x-4">
          <Heading
            title={`All User  (${data?.length || 0})`}
            description="Manage all users, view their details and update statuses."
          />
          <div className="flex space-x-2">
            <Link href="/dashboard/deleted-user">
              <Button variant="outline" className="mr-2">
                View Deleted Users
              </Button>
            </Link>
            <Link href="/dashboard/user-management/create">
              <Button className={cn(buttonVariants(), "ml-auto")}>
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </Link>
          </div>
        </div>
        <Separator />
        {/*  add search  */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by name, email, phone, etc."
              className="w-96 rounded-lg border border-gray-200 px-4 py-2"
            />
            <Button>Search</Button>
          </div>
        </div>
        {/* User list with improved table design */}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full rounded-lg border border-gray-200 text-left text-sm">
            <thead className="bg-gray-50">
              <tr className="text-gray-700">
                {/* // client Id */}
                <th className="border-b px-4 py-2">Client Id</th>
                <th className="border-b px-4 py-2">Name</th>
                <th className="border-b px-4 py-2">Email</th>
                <th className="border-b px-4 py-2">Phone</th>
                <th className="border-b px-4 py-2">Status</th>
                <th className="border-b px-4 py-2">Subscription</th>
                <th className="border-b px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRowClick(user)}
                >
                  <td className="border-b px-4 py-2">{user.clientId}</td>
                  <td className="border-b px-4 py-2">{user.name}</td>
                  <td className="border-b px-4 py-2">{user.email}</td>
                  <td className="border-b px-4 py-2">{user.phone}</td>
                  <td className="border-b px-4 py-2">
                    {user.status === "active" ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-red-600">Inactive</span>
                    )}
                  </td>
                  <td className="border-b px-4 py-2">
                    {user.isPayment
                      ? `Valid until: ${new Date(
                          user.subscriptionValidity,
                        ).toLocaleDateString()}`
                      : "No active subscription"}
                  </td>
                  <td className="flex space-x-2 border-b px-4 py-2">
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handletoStatusUser(user._id, user.status);
                      }}
                      className="mr-2"
                    >
                      {user.status === "active" ? "Deactivate" : "Activate"}
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={(e) => openDeleteConfirmation(user._id, e)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>

      {/* Modal popup for showing user details */}
      {selectedUser && (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedUser.name}'s Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Email: {selectedUser.email}</p>
              <p>Phone: {selectedUser.phone}</p>
              <p>
                Status:{" "}
                {selectedUser.status === "active" ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </p>
              <p>
                Subscription:{" "}
                {selectedUser.isPayment
                  ? `Valid until: ${new Date(
                      selectedUser.subscriptionValidity,
                    ).toLocaleDateString()}`
                  : "No active subscription"}
              </p>
              <p>Company: {selectedUser.companyName}</p>
              <p>Payment Status: {selectedUser.paymentStatus}</p>
              <p>improvement: {selectedUser?.improvement || "-"}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <div className="flex w-full justify-between space-x-2">
              <Button variant="outline" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleteUserMutation.isLoading}
              >
                {deleteUserMutation.isLoading ? "Deleting..." : "Delete User"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

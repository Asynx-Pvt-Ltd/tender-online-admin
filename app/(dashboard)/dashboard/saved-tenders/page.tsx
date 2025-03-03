"use client";
import BreadCrumb from "@/components/breadcrumb";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const breadcrumbItems = [
  { title: "Users with Saved Tenders", link: "/dashboard/saved-tenders" },
];

interface User {
  _id: string;
  clientId: string;
  username: string;
  email: string;
  name: string;
}

interface UserWithTenders {
  user: User;
  tenders: any[];
}

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchUsersWithSavedTenders = async (page = 0, limit = 10) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENPOINT}/api/auth/users-with-saved-tenders?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users with saved tenders");
      }

      const data = await response.json();
      console.log("=========", data);
      return data;
    } catch (error) {
      console.error("Error fetching users with saved tenders:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const data = await fetchUsersWithSavedTenders(page, limit);
      if (data) {
        setUsers(data.users || []);
        setTotalCount(data.count || 0);
      }
      setLoading(false);
    };

    loadUsers();
  }, [page, limit]);

  const handleUserClick = (userId: string) => {
    router.push(`/dashboard/saved-tenders/user/${userId}`);
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <h1 className="text-2xl font-bold">Users with Saved Tenders</h1>

      {loading ? (
        <div className="flex justify-center py-8">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 text-left font-medium">Client ID</th>
                <th className="p-3 text-left font-medium">Name</th>
                <th className="p-3 text-left font-medium">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="cursor-pointer border-b hover:bg-gray-50"
                    onClick={() => handleUserClick(user._id)}
                  >
                    <td className="p-3">{user.clientId}</td>
                    <td className="p-3">{user.name || "N/A"}</td>
                    <td className="p-3">{user.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No users with saved tenders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls for Users */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page + 1} of {Math.max(1, Math.ceil(totalCount / limit))}
        </span>
        <button
          onClick={() =>
            setPage((prev) =>
              (prev + 1) * limit < totalCount ? prev + 1 : prev,
            )
          }
          disabled={(page + 1) * limit >= totalCount}
          className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Page;

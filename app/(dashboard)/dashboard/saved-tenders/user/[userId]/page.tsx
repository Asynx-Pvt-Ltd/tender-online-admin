"use client";
import BreadCrumb from "@/components/breadcrumb";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Tender {
  _id: string;
  tenderName: string;
  TenderId: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
}

const UserTendersPage = () => {
  const params = useParams();
  const userId = params.userId as string;

  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUserTenders = async (userId: string, page = 0, limit = 10) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENPOINT}/api/auth/user-saved-tenders/${userId}?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user's saved tenders");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user's saved tenders:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadUserTenders = async () => {
      if (!userId) return;

      setLoading(true);
      const data = await fetchUserTenders(userId, page, limit);
      if (data) {
        setUserDetails(data.user || null);
        setTenders(data.tenders.filter((tender: any) => tender !== null) || []);
        setTotalCount(data.count || 0);
      }
      setLoading(false);
    };

    loadUserTenders();
  }, [userId, page, limit]);

  const breadcrumbItems = [
    { title: "Saved Tenders by Users", link: "/dashboard/saved-tenders" },
    { title: userDetails?.name || "User Details", link: `#` },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {userDetails ? `${userDetails.name}'s Saved Tenders` : "User Tenders"}
        </h1>
        <Link
          href="/dashboard/saved-tenders"
          className="rounded bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
        >
          Back to All Users
        </Link>
      </div>

      {userDetails && (
        <div className="rounded-lg border bg-gray-50 p-4">
          <h2 className="text-lg font-medium">User Information</h2>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p>{userDetails.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{userDetails.email}</p>
            </div>
            {userDetails.username && (
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p>{userDetails.username}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 text-left font-medium">Tender Name</th>
                <th className="p-3 text-left font-medium">Tender ID</th>
              </tr>
            </thead>
            <tbody>
              {tenders.length > 0 ? (
                tenders.map((tender) => (
                  <tr key={tender._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{tender.tenderName}</td>
                    <td className="p-3">{tender.TenderId}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="p-4 text-center text-gray-500">
                    No saved tenders found for this user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {tenders.length > 0 && (
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
      )}
    </div>
  );
};

export default UserTendersPage;

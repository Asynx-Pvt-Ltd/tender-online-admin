"use client";

import { Download } from "lucide-react";
import React, { useState, useMemo } from "react";
import { useQuery } from "react-query";
import * as XLSX from "xlsx";

interface User {
  _id: string;
  name: string;
  clientId: string;
  phone: string;
  email: string;
  profile_image: string;
  companyName: string;
  city: string;
  state: string[];
  subscriptionValidity: string;
}

interface Transaction {
  _id: string;
  userId: User;
  clientId: string;
  amount_received: number;
  price: number;
  payment_method: string;
  transaction_status: string;
  discount_applied: { $numberDecimal: string };
  tax_amount: { $numberDecimal: string };
  total_amount_paid: { $numberDecimal: string };
  payment_date: string;
  createdAt: string;
  updatedAt: string;
}

const TransactionPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery<Transaction[]>({
    queryKey: ["transaction"],
    queryFn: () =>
      fetch(
        process.env.NEXT_PUBLIC_API_ENPOINT + "/api/auth/payment/transcation",
      ).then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      }),
  });

  const filteredTransactions = useMemo(() => {
    if (!data) return [];
    if (!searchTerm.trim()) return data;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return data.filter(
      (transaction) =>
        transaction._id.toLowerCase().includes(lowerCaseSearchTerm) ||
        transaction.userId?.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        transaction.userId?.clientId
          .toLowerCase()
          .includes(lowerCaseSearchTerm) ||
        transaction.userId?.companyName
          .toLowerCase()
          .includes(lowerCaseSearchTerm) ||
        transaction.payment_method
          .toLowerCase()
          .includes(lowerCaseSearchTerm) ||
        transaction.transaction_status
          .toLowerCase()
          .includes(lowerCaseSearchTerm) ||
        transaction.userId?.email.toLowerCase().includes(lowerCaseSearchTerm),
    );
  }, [data, searchTerm]);

  const downloadExcel = () => {
    if (!filteredTransactions.length) return;

    const excelData = filteredTransactions.map((transaction) => ({
      "Transaction ID": transaction._id,
      "Customer Name": transaction.userId?.name || "N/A",
      "Client ID": transaction.userId?.clientId || "N/A",
      "Company Name": transaction.userId?.companyName || "N/A",
      Email: transaction.userId?.email || "N/A",
      Phone: transaction.userId?.phone || "N/A",
      Location: `${transaction.userId?.city || "N/A"}, ${
        transaction.userId?.state?.join(", ") || "N/A"
      }`,
      "Amount Received": transaction.amount_received,
      Price: transaction.price,
      "Payment Method": transaction.payment_method,
      Status: transaction.transaction_status,
      "Discount Applied": parseFloat(
        transaction.discount_applied?.$numberDecimal || "0",
      ),
      "Tax Amount": parseFloat(transaction.tax_amount?.$numberDecimal || "0"),
      "Total Amount Paid": parseFloat(
        transaction.total_amount_paid?.$numberDecimal || "0",
      ),
      "Payment Date": new Date(transaction.payment_date).toLocaleString(),
      "Subscription Valid Till": new Date(
        transaction.userId?.subscriptionValidity,
      ).toLocaleDateString(),
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const columnWidths = [
      { wch: 24 }, // Transaction ID
      { wch: 20 }, // Customer Name
      { wch: 20 }, // Client ID
      { wch: 20 }, // Company Name
      { wch: 25 }, // Email
      { wch: 15 }, // Phone
      { wch: 20 }, // Location
      { wch: 15 }, // Amount Received
      { wch: 10 }, // Price
      { wch: 15 }, // Payment Method
      { wch: 12 }, // Status
      { wch: 15 }, // Discount Applied
      { wch: 12 }, // Tax Amount
      { wch: 15 }, // Total Amount Paid
      { wch: 20 }, // Payment Date
      { wch: 20 }, // Subscription Valid Till
    ];
    worksheet["!cols"] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const currentDate = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `transactions_${currentDate}.xlsx`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="animate-pulse text-xl font-semibold text-[#222222]">
          Loading transactions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50">
        <div className="font-semibold text-red-500">
          Something went wrong: {(error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
        Transaction History
      </h1>

      <div className="mx-auto mb-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="relative mr-4 flex-grow">
            <input
              type="text"
              placeholder="Search by Name, Transaction ID, Email or Status..."
              className="w-full rounded-lg border border-gray-300 p-3 pl-10 shadow-sm focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <button
            onClick={downloadExcel}
            className="flex items-center gap-3 rounded-lg bg-[#222222] px-4 py-3 text-white shadow transition hover:bg-gray-700 disabled:bg-gray-400"
            disabled={!filteredTransactions.length}
          >
            <Download size={16} />
            Download Excel
          </button>
        </div>
      </div>

      <div className="container mx-auto">
        {filteredTransactions.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center rounded-lg bg-gray-100">
            <div className="text-xl font-semibold text-gray-600">
              No transactions found matching your search
            </div>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className="mb-6 rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
            >
              {/* User Details Section */}
              <div className="mb-4 flex items-center">
                <img
                  src={transaction.userId?.profile_image}
                  alt={`${transaction.userId?.name}'s profile`}
                  className="h-16 w-16 rounded-full border"
                />
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {transaction.userId?.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {transaction.userId?.companyName} |{" "}
                    {transaction.userId?.city},{" "}
                    {transaction.userId?.state.join(", ")} |{" "}
                    {transaction.userId?.clientId}
                  </p>
                  <p className="text-sm text-gray-500">
                    Subscription valid till:{" "}
                    {new Date(
                      transaction.userId?.subscriptionValidity,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Transaction Details Section */}
              <div className="mb-4 grid grid-cols-2 gap-4 text-gray-700 sm:grid-cols-4">
                <div>
                  <p className="font-semibold">Transaction ID</p>
                  <p className="truncate">{transaction._id}</p>
                </div>
                <div>
                  <p className="font-semibold">Amount Received</p>
                  <p>₹{transaction.amount_received}</p>
                </div>
                <div>
                  <p className="font-semibold">Price</p>
                  <p>₹{transaction.price}</p>
                </div>
                <div>
                  <p className="font-semibold">Payment Method</p>
                  <p>{transaction.payment_method}</p>
                </div>
                <div>
                  <p className="font-semibold">Transaction Status</p>
                  <p
                    className={`font-bold ${
                      transaction.transaction_status === "Completed"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.transaction_status}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Discount Applied</p>
                  <p>
                    ₹{parseFloat(transaction.discount_applied.$numberDecimal)}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Tax Amount</p>
                  <p>₹{parseFloat(transaction.tax_amount.$numberDecimal)}</p>
                </div>
                <div>
                  <p className="font-semibold">Total Amount Paid</p>
                  <p>
                    ₹{parseFloat(transaction.total_amount_paid.$numberDecimal)}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Payment Date</p>
                  <p>
                    {new Date(transaction.payment_date).toLocaleDateString()}{" "}
                    {new Date(transaction.payment_date).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Contact Buttons Section */}
              <div className="flex gap-4">
                <a
                  href={`mailto:${transaction.userId?.email}`}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow transition hover:bg-blue-700"
                >
                  Email: {transaction.userId?.email}
                </a>
                <a
                  href={`tel:${transaction.userId?.phone}`}
                  className="rounded-lg bg-green-600 px-4 py-2 text-white shadow transition hover:bg-green-700"
                >
                  Phone: {transaction.userId?.phone}
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionPage;

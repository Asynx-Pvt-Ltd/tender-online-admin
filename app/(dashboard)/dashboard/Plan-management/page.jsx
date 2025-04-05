"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Dot, Ban, Search, Filter, Calendar, Download } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

import SubscriptionCancel from "@/components/subscriptionCancel";
import * as XLSX from "xlsx";

const Page = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });

  const STATUS_OPTIONS = [
    { label: "Active", value: "active", color: "#00ff04" },
    { label: "Cancelled", value: "cancelled", color: "red" },
    { label: "Free Trial", value: "free trial", color: "orange" },
    {
      label: "Free Trial Expired",
      value: "free trial expired",
      color: "orange",
    },
    { label: "Completed", value: "completed", color: "lightgreen" },
  ];

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_ENPOINT + "/api/auth/users",
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("===========================", data);
        setUsers(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch users", error);
        setUsers([]);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const getPaymentStatus = (status) => {
    switch (status) {
      case "active":
        return "default";
      case "cancelled":
        return "destructive";
      case "free trial":
        return "secondary";
      case "completed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.clientId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        !selectedStatus ||
        user.paymentStatus.toLowerCase() === selectedStatus.toLowerCase();

      const matchesDateRange =
        (!dateRange?.from ||
          new Date(user.subscriptionValidity) >= dateRange.from) &&
        (!dateRange?.to || new Date(user.subscriptionValidity) <= dateRange.to);

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [users, searchTerm, selectedStatus, dateRange]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading users...
      </div>
    );
  }

  const downloadExcel = () => {
    if (!filteredUsers.length) return;

    const excelData = filteredUsers.map((user) => ({
      Name: user.name || "N/A",
      "Client ID": user.clientId || "N/A",
      Email: user.email || "N/A",
      Plan: user.subscriptionAmount || "N/A",
      "Subscription Status": user.paymentStatus || "N/A",
      "Valid Until": user.subscriptionValidity
        ? formatDate(user.subscriptionValidity)
        : "N/A",
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const columnWidths = [
      { wch: 20 }, // Name
      { wch: 15 }, // Client ID
      { wch: 25 }, // Email
      { wch: 10 }, // Plan
      { wch: 18 }, // Subscription Status
      { wch: 30 }, // Valid Until
    ];
    worksheet["!cols"] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Subscriptions");

    const currentDate = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `subscriptions_${currentDate}.xlsx`);
  };

  return (
    <div className="container mx-auto bg-white px-6 py-6 dark:bg-gray-900">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          User Subscription Management
        </h1>
      </div>

      <div className="mb-6 flex space-x-4">
        <div className="relative flex-grow">
          <Input
            placeholder="Search by name or client ID"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              Subscription Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {STATUS_OPTIONS.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={() =>
                  setSelectedStatus(
                    selectedStatus === status.value ? null : status.value,
                  )
                }
                className={`flex gap-2 ${selectedStatus === status.value ? "bg-gray-100" : ""}`}
              >
                <Dot color={status.color} />
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar size={16} />
              {dateRange?.from
                ? dateRange.to
                  ? `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
                  : format(dateRange.from, "PPP")
                : "Select Date Range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
            />
          </PopoverContent>
        </Popover>
        <Button
          onClick={downloadExcel}
          className="flex items-center gap-2 bg-[#222222] text-white hover:bg-gray-700"
          disabled={!filteredUsers.length}
        >
          <Download size={16} />
          Download Excel
        </Button>
      </div>

      <div className="rounded-lg bg-gray-50 shadow-md dark:bg-gray-800">
        <ScrollArea className="w-full">
          <Table className="w-full">
            <TableHeader className="bg-gray-100 dark:bg-gray-700">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ClientID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Subscription Status</TableHead>
                <TableHead>Valid Until</TableHead>
                {/* <TableHead>Last Subscription Date</TableHead> */}
                {/* <TableHead>Actions</TableHead> */}
                <TableHead>Subscription History</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.clientId}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <TableCell>{user.name || "N/A"}</TableCell>
                  <TableCell>{user.clientId || "N/A"}</TableCell>
                  <TableCell>{user.email || "N/A"}</TableCell>
                  <TableCell>{user?.subscriptionAmount || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getPaymentStatus(
                        (user.paymentStatus || "").toLowerCase(),
                      )}
                      className="uppercase tracking-wider"
                    >
                      {user.paymentStatus || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.subscriptionValidity
                      ? formatDate(user.subscriptionValidity)
                      : "N/A"}
                  </TableCell>
                  {/* <TableCell>
                    {user.lastSubscriptionDate
                      ? formatDate(user.lastSubscriptionDate)
                      : "NA"}
                  </TableCell> */}

                  {/* <TableCell>
                    {user.paymentStatus?.toLowerCase() === "active" && (
                      <div className="flex gap-2">
                        <SubscriptionCancel
                          subscriptionId={user.currentSubscriptionId}
                        />
                      </div>
                    )}
                  </TableCell> */}

                  <TableCell>
                    {user.subscriptionHistory?.length > 0 ? (
                      <Dialog>
                        <DialogTrigger>
                          <Button variant={"secondary"} size="sm">
                            View History
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogTitle className="text-center">
                            Subscription History
                          </DialogTitle>
                          <ScrollArea className="h-[500px] w-full">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Payment Date</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Valid Until</TableHead>
                                  <TableHead>Period</TableHead>
                                  <TableHead>Subscription ID</TableHead>
                                  <TableHead>Plan ID</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {user.subscriptionHistory
                                  .reverse()
                                  .map((entry) => (
                                    <TableRow key={entry.subscriptionId}>
                                      <TableCell>
                                        {formatDate(entry.subscriptionDate)}
                                      </TableCell>
                                      <TableCell>₹{entry.amount}</TableCell>
                                      <TableCell>
                                        {formatDate(entry.validUntil)}
                                      </TableCell>
                                      <TableCell>{entry.duration}</TableCell>
                                      <TableCell>
                                        {entry.subscriptionId}
                                      </TableCell>
                                      <TableCell>{entry.planId}</TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button variant={"ghost"} disabled>
                        No History
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Page;

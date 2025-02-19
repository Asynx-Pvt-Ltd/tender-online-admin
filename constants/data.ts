import { Icons } from "@/components/icons";
import { NavItem, SidebarNavItem } from "@/types";

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: "Candice Schiner",
    company: "Dell",
    role: "Frontend Developer",
    verified: false,
    status: "Active",
  },
  {
    id: 2,
    name: "John Doe",
    company: "TechCorp",
    role: "Backend Developer",
    verified: true,
    status: "Active",
  },
  {
    id: 3,
    name: "Alice Johnson",
    company: "WebTech",
    role: "UI Designer",
    verified: true,
    status: "Active",
  },
  {
    id: 4,
    name: "David Smith",
    company: "Innovate Inc.",
    role: "Fullstack Developer",
    verified: false,
    status: "Inactive",
  },
  {
    id: 5,
    name: "Emma Wilson",
    company: "TechGuru",
    role: "Product Manager",
    verified: true,
    status: "Active",
  },
  {
    id: 6,
    name: "James Brown",
    company: "CodeGenius",
    role: "QA Engineer",
    verified: false,
    status: "Active",
  },
  {
    id: 7,
    name: "Laura White",
    company: "SoftWorks",
    role: "UX Designer",
    verified: true,
    status: "Active",
  },
  {
    id: 8,
    name: "Michael Lee",
    company: "DevCraft",
    role: "DevOps Engineer",
    verified: false,
    status: "Active",
  },
  {
    id: 9,
    name: "Olivia Green",
    company: "WebSolutions",
    role: "Frontend Developer",
    verified: true,
    status: "Active",
  },
  {
    id: 10,
    name: "Robert Taylor",
    company: "DataTech",
    role: "Data Analyst",
    verified: false,
    status: "Active",
  },
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const navItems: NavItem[] = [
  {
    title: "Tender",
    href: "/dashboard/tender",
    icon: "user",
    label: "tender",
  },
  {
    title: "Tender Document Request",
    href: "/dashboard/tender-document-request",
    icon: "file",
    label: "tenderDocumentRequest",
  },
  {
    title: "Ads",
    href: "/dashboard/ads",
    icon: "gem",
    label: "tender",
  },
  {
    title: "Contact Us",
    href: "/dashboard/contact-us",
    icon: "users",
    label: "contactUs",
  },
  {
    title: "Blog",
    href: "/dashboard/blog",
    icon: "rss",
    label: "blog",
  },
  {
    title: "Keyword Research",
    href: "/dashboard/keyword-suggestions",
    icon: "search",
    label: "keywordManagement",
  },
  {
    title: "User Management",
    href: "/dashboard/user-management",
    icon: "user",
    label: "userManagement",
  },
  {
    title: "Feedback",
    href: "/dashboard/feedback",
    icon: "messageSquare",
    label: "feedback",
  },

  {
    title: "Banner",
    href: "/dashboard/banner",
    icon: "bookX",
    label: "banner",
  },
  {
    title: "Email Notification",
    href: "/dashboard/email",
    icon: "bell",
    label: "emailNotification",
  },
  {
    title: "Subscription Details",
    href: "/dashboard/Plan-management",
    icon: "pay",
    label: "keywordManagement",
  },
  {
    title: "Other Transactions",
    href: "/dashboard/transaction",
    icon: "pay",
    label: "transaction",
  },
  {
    title: "Logout",
    href: "/",
    icon: "login",
    label: "login",
  },
];

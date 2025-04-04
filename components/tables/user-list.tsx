import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";

interface Contact {
  subject: any;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  remarks?: string;
}

interface UserListProps {
  data: {
    message: string;
    contacts: Contact[];
    code: number;
  };
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

const UserList: React.FC<UserListProps> = ({
  data,
  setActiveTab,
  activeTab,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (data && data.contacts) {
      setContacts(data.contacts);
    }
  }, [data]);

  const handleDelete = async (id: string) => {
    try {
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact._id !== id),
      );

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_ENPOINT + `/api/tender/contactDelete/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }
    } catch (error) {
      console.error("Failed to delete contact:", error);
      setContacts((prevContacts) => {
        return data.contacts;
      });
    }
  };
  const handleSaveRemarks = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENPOINT}/api/tender/contactUpdateRemarks/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ remarks: remarks[id] }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save remarks");
      }

      // Optionally refresh or update state here
    } catch (error) {
      console.error("Failed to save remarks:", error);
    }
  };

  useEffect(() => {
    if (data && data.contacts) {
      setContacts(data.contacts);
      data.contacts.forEach((contact) => {
        setRemarks((prevRemarks) => ({
          ...prevRemarks,
          [contact._id]: contact.remarks || "",
        }));
      });
    }
  }, [data]);

  const handleMarkAsContacted = async (id: string, type: string) => {
    try {
      const contactToUpdate = contacts.find((contact) => contact._id === id);

      setContacts((prevContacts) =>
        prevContacts
          .map((contact) =>
            contact._id === id ? { ...contact, type } : contact,
          )
          .filter((contact) => contact.type !== type),
      );

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_ENPOINT +
          `/api/tender/contactMarkAsContacted/${id}/${type}`,
        {
          method: "PATCH",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to mark contact as contacted");
      }
    } catch (error) {
      console.error("Failed to mark contact as contacted:", error);
      setContacts(data.contacts);
    }
  };
  return (
    <div className="w-fit p-4">
      <div className="mb-8 flex w-fit items-center gap-6 text-black">
        <button
          onClick={() => setActiveTab("support")}
          className={cn(
            "rounded-xl border px-4 py-2",
            activeTab === "support" ? "bg-black text-white" : "text-gray-600",
          )}
        >
          Support Entries
        </button>
        <button
          onClick={() => setActiveTab("contacted")}
          className={cn(
            "rounded-xl border px-4 py-2",
            activeTab === "contacted" ? "bg-black text-white" : "text-gray-600",
          )}
        >
          Support - Contacted Entries
        </button>
        <button
          onClick={() => setActiveTab("get-in-touch")}
          className={cn(
            "rounded-xl border px-4 py-2",
            activeTab === "get-in-touch"
              ? "bg-black text-white"
              : "text-gray-600",
          )}
        >
          Get in Touch
        </button>
        <button
          onClick={() => setActiveTab("gcontacted")}
          className={cn(
            "rounded-xl border px-4 py-2",
            activeTab === "gcontacted"
              ? "bg-black text-white"
              : "text-gray-600",
          )}
        >
          Get in Touch - Contacted Entries
        </button>
      </div>
      {activeTab === "support" && (
        <div className="max-w-md">
          {contacts.length === 0 ? (
            <p className="text-gray-600">No contacts available.</p>
          ) : (
            <table className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-sm uppercase leading-normal text-gray-700">
                  <th className="border px-6 py-4 text-left">First Name</th>
                  <th className="border px-6 py-4 text-left">Subject</th>
                  <th className="border px-6 py-4 text-left">Email</th>
                  <th className="border px-6 py-4 text-left">Message</th>
                  <th className="border px-6 py-4 text-center">Actions</th>
                  <th className="border px-6 py-4 text-center">Remarks</th>{" "}
                </tr>
              </thead>
              <tbody className="text-sm font-light text-gray-600">
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="transition-colors hover:bg-gray-100"
                  >
                    <td className="border px-6 py-4">{contact.firstName}</td>
                    <td className="border px-6 py-4">
                      {contact.subject ? contact.subject : "No subject"}
                    </td>
                    <td className="border px-6">{contact.email}</td>
                    <td className="border px-6 py-4">{contact.message}</td>
                    <td className="flex flex-wrap gap-2 border px-6 py-4 text-center">
                      <Link href={`mailto:${contact.email}`} className="w-fit">
                        <Button variant={"default"}>Send Email</Button>
                      </Link>{" "}
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(contact._id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() =>
                          handleMarkAsContacted(contact._id, "contacted")
                        }
                      >
                        Mark as Contacted
                      </Button>
                    </td>
                    <td className="border px-6 py-4 text-center">
                      <input
                        type="text"
                        value={remarks[contact._id] || ""}
                        onChange={(e) =>
                          setRemarks({
                            ...remarks,
                            [contact._id]: e.target.value,
                          })
                        }
                        placeholder="Add remarks"
                        className="rounded border p-1"
                        onBlur={() => handleSaveRemarks(contact._id)} // Save on blur
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "contacted" && (
        <>
          {contacts.length === 0 ? (
            <p className="text-black">No contacts available.</p>
          ) : (
            <table className="min-w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-sm uppercase leading-normal">
                  <th className="border px-6 py-4 text-left">First Name</th>
                  <th className="border px-6 py-4 text-left">Subject</th>
                  <th className="border px-6 py-4 text-left">Email</th>
                  <th className="border px-6 py-4 text-left">Message</th>
                  <th className="border px-6 py-4 text-center">Actions</th>
                  <th className="border px-6 py-4 text-center">Remarks</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="transition-colors hover:bg-gray-100"
                  >
                    <td className="border px-6 py-4">{contact.firstName}</td>
                    <td className="border px-6 py-4">{contact.subject}</td>
                    <td className="border px-6 py-4">{contact.email}</td>
                    <td className="border px-6 py-4">{contact.message}</td>
                    <td className="border px-6 py-4 text-center">
                      <Button
                        variant="destructive"
                        disabled
                        onClick={() => handleDelete(contact._id)}
                      >
                        Delete
                      </Button>
                    </td>
                    <td className="flex gap-2 border px-6 py-4 text-center">
                      <input
                        type="text"
                        value={remarks[contact._id] || ""}
                        onChange={(e) =>
                          setRemarks({
                            ...remarks,
                            [contact._id]: e.target.value,
                          })
                        }
                        placeholder="Add remarks"
                        className="rounded border p-1"
                        onBlur={() => handleSaveRemarks(contact._id)} // Save on blur
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {activeTab === "get-in-touch" && (
        <>
          {contacts.length === 0 ? (
            <p className="text-gray-600">No contacts available.</p>
          ) : (
            <table className="min-w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-sm uppercase leading-normal text-gray-700">
                  <th className="border px-6 py-4 text-left">First Name</th>
                  <th className="border px-6 py-4 text-left">Email</th>
                  <th className="border px-6 py-4 text-left">Message</th>
                  <th className="border px-6 py-4 text-center">Actions</th>
                  <th className="border px-6 py-4 text-center">Remarks</th>{" "}
                </tr>
              </thead>
              <tbody className="text-sm font-light text-gray-600">
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="transition-colors hover:bg-gray-100"
                  >
                    <td className="border px-6 py-4">{contact.firstName}</td>
                    <td className="border px-6">{contact.email}</td>
                    <td className="border px-6 py-4">{contact.message}</td>
                    <td className="flex flex-wrap gap-2 border px-6 py-4 text-center">
                      <Link href={`mailto:${contact.email}`} className="w-fit">
                        <Button variant={"default"}>Send Email</Button>
                      </Link>{" "}
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(contact._id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() =>
                          handleMarkAsContacted(contact._id, "gcontacted")
                        }
                      >
                        Mark as Contacted
                      </Button>
                    </td>
                    <td className="border px-6 py-4 text-center">
                      <input
                        type="text"
                        value={remarks[contact._id] || ""}
                        onChange={(e) =>
                          setRemarks({
                            ...remarks,
                            [contact._id]: e.target.value,
                          })
                        }
                        placeholder="Add remarks"
                        className="rounded border p-1"
                        onBlur={() => handleSaveRemarks(contact._id)} // Save on blur
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {activeTab === "gcontacted" && (
        <>
          {contacts.length === 0 ? (
            <p className="text-black">No contacts available.</p>
          ) : (
            <table className="min-w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-sm uppercase leading-normal">
                  <th className="border px-6 py-4 text-left">First Name</th>
                  <th className="border px-6 py-4 text-left">Email</th>
                  <th className="border px-6 py-4 text-left">Message</th>
                  <th className="border px-6 py-4 text-center">Actions</th>
                  <th className="border px-6 py-4 text-center">Remarks</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="transition-colors hover:bg-gray-100"
                  >
                    <td className="border px-6 py-4">{contact.firstName}</td>
                    <td className="border px-6 py-4">{contact.email}</td>
                    <td className="border px-6 py-4">{contact.message}</td>
                    <td className="border px-6 py-4 text-center">
                      <Button
                        variant="destructive"
                        disabled
                        onClick={() => handleDelete(contact._id)}
                      >
                        Delete
                      </Button>
                    </td>
                    <td className="flex gap-2 border px-6 py-4 text-center">
                      <input
                        type="text"
                        value={remarks[contact._id] || ""}
                        onChange={(e) =>
                          setRemarks({
                            ...remarks,
                            [contact._id]: e.target.value,
                          })
                        }
                        placeholder="Add remarks"
                        className="rounded border p-1"
                        onBlur={() => handleSaveRemarks(contact._id)} // Save on blur
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;

"use client";
import React from "react";
import BreadCrumb from "@/components/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

const breadcrumbItems = [{ title: "Ads", link: "/dashboard/ads" }];

type Ad = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
};

export default function Page() {
  const queryClient = useQueryClient();

  const {
    data: ads,
    isLoading,
    error,
    refetch,
  } = useQuery<Ad[]>(["Ads"], async () => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_ENPOINT + `/api/ads/images`,
    );
    const data = await response.json();

    // Make sure we return an array, even if the API returns something else
    return Array.isArray(data) ? data : [];
  });

  const deleteAd = useMutation(
    (id: string) =>
      axios.delete(process.env.NEXT_PUBLIC_API_ENPOINT + `/api/ads/${id}`),
    {
      onSuccess: () => {
        refetch();
        toast({
          title: "Ad Deleted",
          variant: "default",
          description: "Ad has been deleted successfully.",
        });
        queryClient.invalidateQueries("Ads");
      },
      onError: () => {
        toast({
          title: "Delete Error",
          variant: "destructive",
          description: "Failed to delete ad. Please try again.",
        });
      },
    },
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Ads (${Array.isArray(ads) ? ads.length : 0})`}
            description="Manage your ads (Server-side table functionalities)."
          />

          <Link
            href={"/dashboard/ads/new"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.isArray(ads) && ads.length > 0 ? (
            ads.map((ad) => (
              <div
                key={ad._id}
                className="relative overflow-hidden rounded-lg bg-white shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              >
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{ad.title}</h3>
                  <p className="text-sm text-gray-600">{ad.description}</p>
                </div>
                <button
                  onClick={() => deleteAd.mutate(ad._id)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center">
              <p className="text-gray-500">No ads available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

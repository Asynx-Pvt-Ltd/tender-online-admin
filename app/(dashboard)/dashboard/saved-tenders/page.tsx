import BreadCrumb from "@/components/breadcrumb";
import { NextPage } from "next";

interface Props {}

const breadcrumbItems = [
  { title: "Saved Tenders by User's", link: "/dashboard/saved-tenders" },
];

const Page: NextPage<Props> = ({}) => {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <h1 className="text-2xl font-bold">Saved Tenders by User's</h1>
    </div>
  );
};

export default Page;

import { useReactTable } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { formatDate, formatIndianRupeePrice } from "../table/tender-columns";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, ChevronUp } from "lucide-react";
import React, { useEffect } from "react";
import Image from "next/image";
export interface TenderDocument {
  tenderName: string;
  description?: string;
  epublishedDate: Date;
  bidSubmissionDate: Date;
  bidOpeningDate: Date;
  tenderValue: string;
  refNo: string;
  TenderId: string;
  district: string;
  state: string;
  department: string;
  subDepartment?: string;
  location?: string;
  address?: string;
  pincode: string;
  active?: boolean;
}

const TenderDetailsDialog = ({ selectedRowData, setSelectedRowData }: any) => {
  useEffect(() => {
    console.log("selectedRowData", selectedRowData);
  }, [selectedRowData]); //2024_PWD_504115_10
  const handleToSendTender = async (tenderId: string) => {
    const url =
      process.env.NEXT_PUBLIC_API_ENPOINT + "/api/tender/tender-mapping"; // Adjust the URL as needed

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ tenderId }),
      });

      if (response.ok) {
        toast.success(
          "Tender documents request sended successfully. we will reach out soon to you.",
        );
        setSelectedRowData(null);
      } else {
        const data = await response.json();
        console.log(data);
        toast.error("Some error occurred");
      }
    } catch (error) {}
  };
  const [desOpen, setDesOpen] = React.useState(false);

  return (
    <Dialog
      open={!!selectedRowData}
      onOpenChange={() => setSelectedRowData(null)}
    >
      <DialogContent className="max-w-3xl !rounded-3xl bg-white text-white">
        <div className="px-0 py-2 lg:px-4 ">
          <div className="rounded-3xl bg-[#000000] px-2 py-4 lg:px-4">
            <div className="flex w-full flex-wrap items-center justify-between lg:flex-row">
              <div className="flex items-center gap-2">
                <div className="">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.9718 3.02812C14.3093 1.36563 11.6078 1.36563 9.94527 3.02812L7.78402 5.18937C7.55246 5.42094 7.55246 5.795 7.78402 6.02656C8.01559 6.25812 8.38965 6.25812 8.62121 6.02656L10.7825 3.86531C11.9818 2.66594 13.9293 2.66594 15.1287 3.86531C15.7106 4.44719 16.0312 5.21906 16.0253 6.04437C16.0253 6.86375 15.7106 7.63562 15.1287 8.2175L12.9675 10.3787C12.7359 10.6103 12.7359 10.9844 12.9675 11.2159C13.0862 11.3347 13.2346 11.3881 13.389 11.3881C13.5434 11.3881 13.6918 11.3287 13.8106 11.2159L15.9718 9.05469C16.7793 8.24719 17.2246 7.1725 17.2187 6.04437C17.2187 4.91031 16.7793 3.83562 15.9718 3.02812Z"
                      fill="#D0D0D0"
                    />
                    <path
                      d="M10.3787 12.9735L8.21748 15.1347C7.01811 16.3341 5.07061 16.3341 3.87123 15.1347C3.28936 14.5528 2.96873 13.781 2.97467 12.9556C2.97467 12.1363 3.28936 11.3644 3.87123 10.7825L6.03248 8.62127C6.26404 8.38971 6.26404 8.01565 6.03248 7.78408C5.80092 7.55252 5.42686 7.55252 5.19529 7.78408L3.03404 9.94533C2.22654 10.7528 1.78123 11.8275 1.78717 12.9556C1.78717 14.0897 2.22654 15.1644 3.03404 15.9719C3.84154 16.7794 4.95779 17.2188 6.05029 17.2188C7.14279 17.2188 8.23529 16.8031 9.06654 15.9719L11.2278 13.8106C11.4594 13.5791 11.4594 13.205 11.2278 12.9735C10.9962 12.7419 10.6222 12.7419 10.3906 12.9735H10.3787Z"
                      fill="#D0D0D0"
                    />
                    <path
                      d="M11.6731 6.48373L6.48373 11.6731C6.25217 11.9047 6.25217 12.2787 6.48373 12.5103C6.60248 12.629 6.75092 12.6825 6.90529 12.6825C7.05967 12.6825 7.20811 12.6231 7.32686 12.5103L12.5162 7.32092C12.7478 7.08936 12.7478 6.71529 12.5162 6.48373C12.2847 6.25217 11.9106 6.25217 11.679 6.48373H11.6731Z"
                      fill="#D0D0D0"
                    />
                  </svg>
                </div>
                <div className="">
                  <p className="text-[10px] font-normal lg:text-sm">
                    Reference No.
                  </p>
                  <h2 className="text-[10px] lg:text-sm">
                    {selectedRowData?.refNo}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.9718 3.02812C14.3093 1.36563 11.6078 1.36563 9.94527 3.02812L7.78402 5.18937C7.55246 5.42094 7.55246 5.795 7.78402 6.02656C8.01559 6.25812 8.38965 6.25812 8.62121 6.02656L10.7825 3.86531C11.9818 2.66594 13.9293 2.66594 15.1287 3.86531C15.7106 4.44719 16.0312 5.21906 16.0253 6.04437C16.0253 6.86375 15.7106 7.63562 15.1287 8.2175L12.9675 10.3787C12.7359 10.6103 12.7359 10.9844 12.9675 11.2159C13.0862 11.3347 13.2346 11.3881 13.389 11.3881C13.5434 11.3881 13.6918 11.3287 13.8106 11.2159L15.9718 9.05469C16.7793 8.24719 17.2246 7.1725 17.2187 6.04437C17.2187 4.91031 16.7793 3.83562 15.9718 3.02812Z"
                      fill="#D0D0D0"
                    />
                    <path
                      d="M10.3787 12.9735L8.21748 15.1347C7.01811 16.3341 5.07061 16.3341 3.87123 15.1347C3.28936 14.5528 2.96873 13.781 2.97467 12.9556C2.97467 12.1363 3.28936 11.3644 3.87123 10.7825L6.03248 8.62127C6.26404 8.38971 6.26404 8.01565 6.03248 7.78408C5.80092 7.55252 5.42686 7.55252 5.19529 7.78408L3.03404 9.94533C2.22654 10.7528 1.78123 11.8275 1.78717 12.9556C1.78717 14.0897 2.22654 15.1644 3.03404 15.9719C3.84154 16.7794 4.95779 17.2188 6.05029 17.2188C7.14279 17.2188 8.23529 16.8031 9.06654 15.9719L11.2278 13.8106C11.4594 13.5791 11.4594 13.205 11.2278 12.9735C10.9962 12.7419 10.6222 12.7419 10.3906 12.9735H10.3787Z"
                      fill="#D0D0D0"
                    />
                    <path
                      d="M11.6731 6.48373L6.48373 11.6731C6.25217 11.9047 6.25217 12.2787 6.48373 12.5103C6.60248 12.629 6.75092 12.6825 6.90529 12.6825C7.05967 12.6825 7.20811 12.6231 7.32686 12.5103L12.5162 7.32092C12.7478 7.08936 12.7478 6.71529 12.5162 6.48373C12.2847 6.25217 11.9106 6.25217 11.679 6.48373H11.6731Z"
                      fill="#D0D0D0"
                    />
                  </svg>
                </div>
                <div className="">
                  <p className="text-[10px] font-normal lg:text-sm">
                    Tender ID.
                  </p>
                  <h2 className="text-[10px] lg:text-sm">
                    {selectedRowData?.TenderId}
                  </h2>
                </div>
              </div>
            </div>
            <div className="">
              <h3 className="py-6 text-center text-xs font-medium lg:text-lg">
                {selectedRowData?.tenderName}
              </h3>
              <p className="flex items-center justify-center text-center text-sm">
                <Collapsible
                  open={desOpen}
                  onOpenChange={setDesOpen}
                  className="flex flex-col items-center justify-center"
                >
                  <CollapsibleTrigger className="m-auto w-fit text-black duration-300">
                    <div className="flex items-center gap-0 rounded-lg bg-white pl-2">
                      <span>Description</span>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronUp
                          className={`h-4 w-4 transform transition-transform duration-300
                ${desOpen ? "rotate-0" : "rotate-180"}`}
                        />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                    <div
                      className={`pb-3 pt-2 transition-all duration-300 ease-in-out
          ${
            desOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
                    >
                      {selectedRowData?.WorkDescription}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-3 py-2">
                <div className="flex items-center gap-4">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.9688 11.9367V10.0633L19.4703 9.58525C19.285 8.89327 19.2275 8.67867 19.0422 7.98669L20.0972 6.82794C19.6177 5.99817 19.6393 6.0354 19.1598 5.20563L17.6301 5.54076C17.123 5.03372 16.9663 4.87699 16.4593 4.36995L16.7944 2.84019C15.9646 2.36074 16.0019 2.38225 15.1721 1.90279L14.0133 2.95783C13.3213 2.77249 13.1067 2.71501 12.4147 2.52968L11.9367 1.03125H10.0633L9.58525 2.52967L7.98669 2.95782L6.82794 1.90281C5.99817 2.38226 6.0354 2.36075 5.20563 2.8402L5.54076 4.36993L4.36995 5.54074L2.84019 5.2056C2.36074 6.03537 2.38225 5.99814 1.90279 6.82791L2.95783 7.9867C2.77249 8.67868 2.71501 8.89328 2.52968 9.58526L1.03125 10.0633V11.9367L2.52968 12.4147C2.71501 13.1067 2.77248 13.3213 2.95782 14.0133L1.90281 15.1721C2.38226 16.0018 2.36075 15.9646 2.8402 16.7944L4.36994 16.4592C4.87697 16.9663 5.0337 17.123 5.54074 17.63L5.2056 19.1598C6.03537 19.6393 5.99814 19.6178 6.82791 20.0972L7.9867 19.0422L9.58526 19.4703L10.0633 20.9688H11.9367L12.4147 19.4703C13.1067 19.285 13.3213 19.2275 14.0133 19.0422L15.1721 20.0972C16.0018 19.6177 15.9646 19.6393 16.7944 19.1598L16.4592 17.6301C16.9663 17.123 17.123 16.9663 17.63 16.4593L19.1598 16.7944C19.6393 15.9646 19.6177 16.0019 20.0972 15.1721L19.0422 14.0133C19.2275 13.3213 19.285 13.1067 19.4703 12.4147L20.9688 11.9367ZM11 17.875C9.64025 17.875 8.31104 17.4718 7.18045 16.7164C6.04987 15.9609 5.16868 14.8872 4.64833 13.6309C4.12798 12.3747 3.99183 10.9924 4.2571 9.65875C4.52237 8.32513 5.17716 7.10013 6.13864 6.13864C7.10013 5.17716 8.32513 4.52237 9.65875 4.2571C10.9924 3.99183 12.3747 4.12798 13.6309 4.64833C14.8872 5.16868 15.9609 6.04987 16.7164 7.18045C17.4718 8.31104 17.875 9.64025 17.875 11C17.875 12.8234 17.1507 14.572 15.8614 15.8614C14.572 17.1507 12.8234 17.875 11 17.875Z"
                      fill="#264066"
                    />
                    <path
                      d="M5.84375 11H9.96875V20.9688H5.84375V11Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M9.96875 9.625H16.1562V20.9688H9.96875V9.625Z"
                      fill="#A8B3BA"
                    />
                    <path
                      d="M11 10.6562H11.6875V11.3438H11V10.6562Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M12.7188 10.6562H13.4062V11.3438H12.7188V10.6562Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M14.4375 10.6562H15.125V11.3438H14.4375V10.6562Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M11 12.0312H11.6875V12.7188H11V12.0312Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M12.7188 12.0312H13.4062V12.7188H12.7188V12.0312Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M14.4375 12.0312H15.125V12.7188H14.4375V12.0312Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M11 13.4062H11.6875V14.0938H11V13.4062Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M12.7188 13.4062H13.4062V14.0938H12.7188V13.4062Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M14.4375 13.4062H15.125V14.0938H14.4375V13.4062Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M11 14.7812H11.6875V15.4688H11V14.7812Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M12.7188 14.7812H13.4062V15.4688H12.7188V14.7812Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M14.4375 14.7812H15.125V15.4688H14.4375V14.7812Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M11 16.1562H11.6875V16.8438H11V16.1562Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M12.7188 16.1562H13.4062V16.8438H12.7188V16.1562Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M14.4375 16.1562H15.125V16.8438H14.4375V16.1562Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M12.0312 19.25H14.0938V20.9688H12.0312V19.25Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M11 17.5312H15.125V18.2188H11V17.5312Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M6.875 12.0312H7.5625V12.7188H6.875V12.0312Z"
                      fill="#A8B3BA"
                    />
                    <path
                      d="M6.875 13.75H7.5625V14.4375H6.875V13.75Z"
                      fill="#A8B3BA"
                    />
                    <path
                      d="M8.25 13.75H8.9375V14.4375H8.25V13.75Z"
                      fill="#A8B3BA"
                    />
                    <path
                      d="M6.875 15.4688H7.5625V16.1562H6.875V15.4688Z"
                      fill="#A8B3BA"
                    />
                    <path
                      d="M8.25 15.4688H8.9375V16.1562H8.25V15.4688Z"
                      fill="#A8B3BA"
                    />
                    <path
                      d="M6.875 17.1875H7.5625V17.875H6.875V17.1875Z"
                      fill="#A8B3BA"
                    />
                    <path
                      d="M8.25 17.1875H8.9375V17.875H8.25V17.1875Z"
                      fill="#A8B3BA"
                    />
                    <path
                      d="M7.21875 19.25H8.59375V20.9688H7.21875V19.25Z"
                      fill="#A8B3BA"
                    />
                    <path
                      d="M11 9.62502H10.3125V8.53479C10.3126 8.48963 10.3038 8.44489 10.2865 8.40317C10.2692 8.36144 10.2439 8.32356 10.2118 8.29171L9.38196 7.46183L9.86808 6.97571L10.698 7.80558C10.794 7.90112 10.8702 8.01476 10.922 8.13993C10.9739 8.2651 11.0004 8.39931 11 8.53479V9.62502Z"
                      fill="#9BA3A8"
                    />
                    <path
                      d="M8.59377 11H7.90627V10.2535C7.90639 10.2084 7.89756 10.1636 7.88028 10.1219C7.86299 10.0802 7.83761 10.0423 7.80558 10.0105L6.97571 9.18058L7.46183 8.69446L8.29171 9.52433C8.38777 9.61987 8.46393 9.73351 8.51578 9.85868C8.56763 9.98385 8.59414 10.1181 8.59377 10.2535V11Z"
                      fill="#9BA3A8"
                    />
                    <path
                      d="M13.75 9.62502H13.0625V8.87854C13.0621 8.74306 13.0886 8.60885 13.1405 8.48368C13.1923 8.35851 13.2685 8.24487 13.3646 8.14933L13.8507 7.66321L14.3368 8.14933L13.8507 8.63546C13.8187 8.66731 13.7933 8.70519 13.776 8.74692C13.7587 8.78864 13.7499 8.83338 13.75 8.87854V9.62502Z"
                      fill="#9BA3A8"
                    />
                    <path
                      d="M11.6875 6.875H12.375V9.625H11.6875V6.875Z"
                      fill="#9BA3A8"
                    />
                    <path
                      d="M8.25 12.0312H8.9375V12.7188H8.25V12.0312Z"
                      fill="#A8B3BA"
                    />
                    <path
                      d="M8.9375 7.90625C8.73354 7.90625 8.53416 7.84577 8.36457 7.73245C8.19498 7.61914 8.0628 7.45808 7.98475 7.26964C7.9067 7.08121 7.88627 6.87386 7.92607 6.67381C7.96586 6.47377 8.06407 6.29002 8.2083 6.1458C8.35252 6.00157 8.53627 5.90336 8.73631 5.86357C8.93636 5.82377 9.14371 5.8442 9.33214 5.92225C9.52058 6.0003 9.68164 6.13248 9.79495 6.30207C9.90827 6.47166 9.96875 6.67104 9.96875 6.875C9.96845 7.14841 9.8597 7.41054 9.66637 7.60387C9.47304 7.7972 9.21091 7.90595 8.9375 7.90625ZM8.9375 6.53125C8.86951 6.53125 8.80305 6.55141 8.74652 6.58918C8.68999 6.62695 8.64593 6.68064 8.61992 6.74345C8.5939 6.80627 8.58709 6.87538 8.60036 6.94206C8.61362 7.00874 8.64636 7.06999 8.69443 7.11807C8.74251 7.16614 8.80376 7.19888 8.87044 7.21215C8.93712 7.22541 9.00624 7.2186 9.06905 7.19258C9.13186 7.16657 9.18555 7.12251 9.22332 7.06598C9.26109 7.00945 9.28125 6.94299 9.28125 6.875C9.28115 6.78386 9.2449 6.69649 9.18045 6.63205C9.11601 6.5676 9.02864 6.53135 8.9375 6.53125Z"
                      fill="#264066"
                    />
                    <path
                      d="M14.4375 8.59375C14.2335 8.59375 14.0342 8.53327 13.8646 8.41995C13.695 8.30664 13.5628 8.14558 13.4848 7.95714C13.4067 7.76871 13.3863 7.56136 13.4261 7.36131C13.4659 7.16127 13.5641 6.97752 13.7083 6.8333C13.8525 6.68907 14.0363 6.59086 14.2363 6.55107C14.4364 6.51127 14.6437 6.5317 14.8321 6.60975C15.0206 6.6878 15.1816 6.81998 15.295 6.98957C15.4083 7.15916 15.4688 7.35854 15.4688 7.5625C15.4684 7.83591 15.3597 8.09804 15.1664 8.29137C14.973 8.4847 14.7109 8.59345 14.4375 8.59375ZM14.4375 7.21875C14.3695 7.21875 14.3031 7.23891 14.2465 7.27668C14.19 7.31445 14.1459 7.36814 14.1199 7.43095C14.0939 7.49377 14.0871 7.56288 14.1004 7.62956C14.1136 7.69624 14.1464 7.75749 14.1944 7.80557C14.2425 7.85364 14.3038 7.88638 14.3704 7.89965C14.4371 7.91291 14.5062 7.9061 14.569 7.88008C14.6319 7.85407 14.6855 7.81001 14.7233 7.75348C14.7611 7.69695 14.7813 7.63049 14.7813 7.5625C14.7811 7.47136 14.7449 7.38399 14.6805 7.31955C14.616 7.2551 14.5286 7.21885 14.4375 7.21875Z"
                      fill="#264066"
                    />
                    <path
                      d="M6.875 9.625C6.67104 9.625 6.47166 9.56452 6.30207 9.4512C6.13248 9.33789 6.0003 9.17683 5.92225 8.98839C5.8442 8.79996 5.82377 8.59261 5.86357 8.39256C5.90336 8.19252 6.00157 8.00877 6.1458 7.86455C6.29002 7.72032 6.47377 7.62211 6.67381 7.58232C6.87386 7.54252 7.08121 7.56295 7.26964 7.641C7.45808 7.71905 7.61914 7.85123 7.73245 8.02082C7.84577 8.19041 7.90625 8.38979 7.90625 8.59375C7.90595 8.86716 7.7972 9.12929 7.60387 9.32262C7.41054 9.51595 7.14841 9.6247 6.875 9.625ZM6.875 8.25C6.80701 8.25 6.74055 8.27016 6.68402 8.30793C6.62749 8.3457 6.58343 8.39939 6.55742 8.4622C6.5314 8.52502 6.52459 8.59413 6.53786 8.66081C6.55112 8.72749 6.58386 8.78874 6.63193 8.83682C6.68001 8.88489 6.74126 8.91763 6.80794 8.9309C6.87462 8.94416 6.94374 8.93735 7.00655 8.91133C7.06936 8.88532 7.12305 8.84126 7.16082 8.78473C7.19859 8.7282 7.21875 8.66174 7.21875 8.59375C7.21865 8.50261 7.1824 8.41524 7.11795 8.3508C7.05351 8.28635 6.96614 8.2501 6.875 8.25Z"
                      fill="#264066"
                    />
                    <path
                      d="M12.0313 7.21875C11.8273 7.21875 11.6279 7.15827 11.4583 7.04495C11.2887 6.93164 11.1566 6.77058 11.0785 6.58214C11.0004 6.39371 10.98 6.18636 11.0198 5.98631C11.0596 5.78627 11.1578 5.60252 11.302 5.4583C11.4463 5.31407 11.63 5.21586 11.8301 5.17607C12.0301 5.13627 12.2375 5.1567 12.4259 5.23475C12.6143 5.3128 12.7754 5.44498 12.8887 5.61457C13.002 5.78416 13.0625 5.98354 13.0625 6.1875C13.0622 6.46091 12.9534 6.72304 12.7601 6.91637C12.5668 7.1097 12.3047 7.21845 12.0313 7.21875ZM12.0313 5.84375C11.9633 5.84375 11.8968 5.86391 11.8403 5.90168C11.7837 5.93945 11.7397 5.99314 11.7137 6.05595C11.6876 6.11877 11.6808 6.18788 11.6941 6.25456C11.7074 6.32124 11.7401 6.38249 11.7882 6.43057C11.8363 6.47864 11.8975 6.51138 11.9642 6.52465C12.0309 6.53791 12.1 6.5311 12.1628 6.50508C12.2256 6.47907 12.2793 6.43501 12.3171 6.37848C12.3548 6.32195 12.375 6.25549 12.375 6.1875C12.3749 6.09636 12.3386 6.00899 12.2742 5.94455C12.2098 5.8801 12.1224 5.84385 12.0313 5.84375Z"
                      fill="#264066"
                    />
                    <path
                      d="M0.6875 20.625H21.3125V21.3125H0.6875V20.625Z"
                      fill="#D0D5D8"
                    />
                    <path
                      d="M9.96875 11L10.6562 20.625H9.96875V11Z"
                      fill="#868F95"
                    />
                    <path
                      d="M16.1562 19.5285C16.3108 19.4392 16.4967 19.3318 16.7944 19.1598L16.4592 17.6301C16.5806 17.5088 16.6815 17.4078 16.7723 17.317L16.1752 15.5255C16.1689 15.5327 16.1625 15.5397 16.1562 15.5468V19.5285Z"
                      fill="#1E3352"
                    />
                  </svg>

                  <h4 className="text-[10px] lg:text-sm">
                    {selectedRowData?.department}
                  </h4>
                </div>
                <div className="flex items-center gap-4">
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.55208 7.96458C6.35 7.62396 5.46875 6.51875 5.46875 5.20833C5.46875 3.62708 6.75208 2.34375 8.33333 2.34375C9.91458 2.34375 11.1979 3.62708 11.1979 5.20833C11.1979 6.51875 10.3167 7.62396 9.11458 7.96458V13.8708C9.40417 13.7229 9.72292 13.6219 10.0615 13.5802C11.451 13.4062 13.3552 13.1687 14.7448 12.9948C15.3969 12.9135 15.8854 12.3594 15.8854 11.7021V11.0896C14.6833 10.749 13.8021 9.64375 13.8021 8.33333C13.8021 6.75208 15.0854 5.46875 16.6667 5.46875C18.2479 5.46875 19.5312 6.75208 19.5312 8.33333C19.5312 9.64375 18.65 10.749 17.4479 11.0896V11.7021C17.4479 13.1469 16.3719 14.3656 14.9385 14.5448C13.549 14.7188 11.6448 14.9562 10.2552 15.1302C9.60313 15.2115 9.11458 15.7656 9.11458 16.4229V17.0354C10.3167 17.376 11.1979 18.4812 11.1979 19.7917C11.1979 21.3729 9.91458 22.6562 8.33333 22.6562C6.75208 22.6562 5.46875 21.3729 5.46875 19.7917C5.46875 18.4812 6.35 17.376 7.55208 17.0354V7.96458ZM8.33333 18.4896C9.05208 18.4896 9.63542 19.0729 9.63542 19.7917C9.63542 20.5104 9.05208 21.0938 8.33333 21.0938C7.61458 21.0938 7.03125 20.5104 7.03125 19.7917C7.03125 19.0729 7.61458 18.4896 8.33333 18.4896ZM16.6667 7.03125C17.3854 7.03125 17.9688 7.61458 17.9688 8.33333C17.9688 9.05208 17.3854 9.63542 16.6667 9.63542C15.9479 9.63542 15.3646 9.05208 15.3646 8.33333C15.3646 7.61458 15.9479 7.03125 16.6667 7.03125ZM8.33333 3.90625C9.05208 3.90625 9.63542 4.48958 9.63542 5.20833C9.63542 5.92708 9.05208 6.51042 8.33333 6.51042C7.61458 6.51042 7.03125 5.92708 7.03125 5.20833C7.03125 4.48958 7.61458 3.90625 8.33333 3.90625Z"
                      fill="#B9B9B9"
                    />
                  </svg>

                  <h4 className="text-[10px] lg:text-sm">
                    Sub Department <span>{selectedRowData?.subDepartment}</span>
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  <Image
                    src={"/globe.svg"}
                    width={20}
                    height={20}
                    alt="source"
                  />
                  <h3 className="">Source:</h3>
                </div>
                <h4 className="text-[10px] lg:text-sm ">
                  {selectedRowData?.source}
                </h4>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center justify-center gap-2 border-b py-4 text-black">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0001 0C6.32412 0 3.33337 2.99074 3.33337 6.66668C3.33337 7.7702 3.60927 8.86434 4.13376 9.8348L9.63548 19.7852C9.70873 19.9178 9.8483 20 10.0001 20C10.1518 20 10.2914 19.9178 10.3646 19.7852L15.8684 9.83152C16.3908 8.86434 16.6667 7.77016 16.6667 6.66664C16.6667 2.99074 13.676 0 10.0001 0ZM10.0001 10C8.16208 10 6.66673 8.50465 6.66673 6.66668C6.66673 4.82871 8.16208 3.33336 10.0001 3.33336C11.838 3.33336 13.3334 4.82871 13.3334 6.66668C13.3334 8.50465 11.838 10 10.0001 10Z"
                  fill="black"
                />
              </svg>
              <p className="text-[10px] lg:text-sm">
                {selectedRowData?.location}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 border-b py-4 text-black">
              <Image
                src="/district.png"
                width={28}
                height={26}
                alt="District"
              />
              <p className="text-[10px] lg:text-sm">
                {selectedRowData?.district}
              </p>
            </div>
          </div>
          <div className="flex w-full items-center justify-center py-2 text-black">
            <div className="w-full space-y-2 border-r px-1 py-1 text-center lg:px-4 lg:py-3">
              <p className="text-[8px] font-medium lg:text-xs">
                Published Date{" "}
              </p>
              <h1 className="text-[10px] font-semibold lg:text-sm">
                {formatDate(selectedRowData?.epublishedDate)}
              </h1>
            </div>
            <div className="w-full space-y-2 border-r px-1 py-1 text-center lg:px-4 lg:py-3">
              <p className="text-[8px] font-medium lg:text-xs">
                Bid Submission Date :{" "}
              </p>
              <h1 className="text-[10px] font-semibold lg:text-sm">
                {formatDate(selectedRowData?.bidSubmissionDate)}
              </h1>
            </div>
            <div className="w-full space-y-2 px-1 py-1 text-center lg:px-4 lg:py-3">
              <p className="text-[8px] font-medium lg:text-xs">
                Bid Opening Date :
              </p>
              <h1 className="text-[10px] font-semibold lg:text-sm">
                {formatDate(selectedRowData?.bidOpeningDate)}
              </h1>
            </div>
          </div>
          <div className="flex  w-full items-center justify-between gap-4 rounded-3xl border border-[#EDEDED] bg-[#EDEDED] px-1 py-3 lg:px-24">
            <div className="flex w-full items-center justify-center py-2 text-black">
              <div className="w-full space-y-2 border-r border-gray-400 px-1 py-1 text-center lg:px-4 lg:py-3">
                <h1 className="text-xs font-semibold text-[#4B4B4B] lg:text-xl">
                  EMD Amount
                </h1>
                <h3 className="text-xs font-medium text-[#2E2E2E] lg:text-base">
                  {formatIndianRupeePrice(selectedRowData?.EMDAmountin)}
                </h3>
              </div>
              <div className="w-full space-y-2 px-1 py-1 text-center lg:px-4 lg:py-3">
                <h1 className="text-xs font-semibold text-[#4B4B4B] lg:text-xl">
                  Tender Value
                </h1>
                <h3 className="text-xs font-medium text-[#2E2E2E] lg:text-base">
                  {formatIndianRupeePrice(selectedRowData?.tenderValue)}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TenderDetailsDialog;

import Header from "@/components/custom/Header";
import SideBar from "@/components/custom/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiCall } from "@/utils/api/apiCall";
import { getDashBoardData } from "@/utils/api/dashboardData";
import type { invoiceDataType } from "@/utils/api/fetchInvoice";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import {
  Check,
  Download,
  Eye,
  File,
  FileText,
  MoreHorizontal,
  Plus,
  Trash,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { updateResponse } from "../invoices/Invoices";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

type invoices = {
  id: string;
  invoiceNumber: string;
  grandTotal: string;
  issueDate: Date;
  dueDate: Date;
  status: string;
  companyName: string;
};

const DashBoard = () => {
  let navigate = useNavigate();

  const { data: dashBoardData, isLoading } = useQuery({
    queryFn: async () => getDashBoardData(),
    queryKey: ["dashboardData"],
  });

  if (!isLoading) console.log(dashBoardData);

  const [Invoices, setInvoices] = useState<invoices[] | undefined>([]);

  useEffect(() => {
    if (!isLoading) {
      setInvoices(dashBoardData?.data.recentInvoices);
    }
  }, [dashBoardData]);
  const deleteInvoice = async (invoiceId: string) => {
    const response = await apiCall<null>(
      `/delete-invoice/${invoiceId}`,
      "DELETE",
      "protected"
    );
    if (response.success) {
      if (dashBoardData?.data.recentInvoices) {
        window.location.reload();
        toast.success(response.message);
      }
    } else {
      toast.error(response.message);
    }
  };
  const downloadPdf = async (invoiceId: string) => {
    const response = await apiCall<string>(
      `/download-pdf/${invoiceId}`,
      "GET",
      "protected"
    );

    if (response.success && dashBoardData?.data.recentInvoices) {
      const link = document.createElement("a");
      link.href = response.data;
      link.setAttribute("download", "invoice_pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };
  const updateStatus = async (
    invoiceId: string,
    status: "paid" | "pending"
  ) => {
    if (status == "paid") {
      const result = await apiCall<updateResponse>(
        `/update-status-paid/${invoiceId}`,
        "POST",
        "protected"
      );
      if (result.success) {
        if (Invoices) {
          const updatedInvoices = Invoices.map((inv) =>
            inv.id === invoiceId ? { ...inv, status: status } : inv
          );
          setInvoices(updatedInvoices);
        }

        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } else if (status == "pending") {
      const result = await apiCall<updateResponse>(
        `/update-status-pending/${invoiceId}`,
        "POST",
        "protected"
      );
      if (result.success) {
        if (Invoices) {
          const updatedInvoices = Invoices.map((inv) =>
            inv.id === invoiceId ? { ...inv, status: status } : inv
          );
          setInvoices(updatedInvoices);
        }

        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }
  };

  const SummarCards = [
    {
      key: "totalRevenue",
      title: "Total Revenue",
      value: dashBoardData?.data.totalRevenue,
      icon: Wallet,
    },

    {
      key: "pendingInvoices",
      title: "Pending Invoices",
      value: dashBoardData?.data.pendingInvoicesAmount,
      icon: FileText,
    },
    {
      key: "totalClients",
      title: "Total Clients",
      value: dashBoardData?.data.clientsCount,
      icon: Users,
    },
    {
      key: "invoicesSent",
      title: "Invoices Sent",
      value: dashBoardData?.data.invoicesCount,
      icon: FileText,
    },
  ];

  if (Invoices && dashBoardData?.data)
    return (
      <div className=" min-h-screen flex">
        <SideBar />
        <div className="flex flex-col w-full">
          <Header />

          <main className="flex flex-col gap-6 p-6">
            {/* //filter and Invoice button  */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-90">DashBoard</h1>
              <div className="flex items-center gap-2">
                <div>
                  <Select defaultValue="30">
                    <SelectTrigger
                      id="status"
                      className="mt-1 bg-white w-[180px]"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="10">Last 10 days</SelectItem>
                      <SelectItem value="0">Today</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/invoices/create");
                  }}
                  className="bg-blue-500 hover:bg-blue-600 hover:text-white flex text-white items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Invoice
                </Button>
              </div>
            </div>

            {/* // Summary Card  */}
            <div className="grid grid-cols-4 gap-4">
              {SummarCards.map((summary) => {
                return (
                  <Card key={summary.key} className="h-30 rounded-md">
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-medium text-slate-500 text-sm">
                          {summary.title}
                        </CardTitle>
                        <summary.icon className="w-4 h-4 text-slate-500" />
                      </div>
                      <p className="text-lg font-semibold ">{summary.value}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent Invoices  */}
            <Card className="rounded-md">
              <CardHeader>
                <CardTitle className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Recent Invoices
                    </h2>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate("/invoices");
                      }}
                    >
                      View All
                    </Button>
                  </div>

                  <p className="text-slate-500 font-normal text-sm">
                    Manage Recent Invoices
                  </p>
                </CardTitle>

                <CardContent className=" mt-8 px-0">
                  <div className="space-y-6">
                    <table className="w-full text-sm ">
                      <thead>
                        <tr className="border-b border-gray-200 text-left text-slate-500">
                          <th className="pb-3 pl-4 font-medium">Invoice</th>
                          <th className="pb-3 font-medium">Client</th>
                          <th className="pb-3 font-medium">Amount</th>
                          <th className="pb-3 font-medium">Issue Date</th>
                          <th className="pb-3 font-medium">Due Date</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium sr-only">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {Invoices.map((invoice: invoiceDataType) => {
                          return (
                            <tr
                              className="border-b border-slate-100 hover:"
                              key={invoice.id}
                            >
                              <td className="py-4 pl-4 ">
                                <div className="font-medium text-sm text-slate-900">
                                  {invoice.invoiceNumber}
                                </div>
                              </td>
                              <td className="py-4">
                                <div className="font-medium text-sm text-slate-900">
                                  {invoice.companyName}
                                </div>
                              </td>
                              <td className="py-4">
                                <div className="font-medium text-sm text-slate-900">
                                  $ {invoice.grandTotal}
                                </div>
                              </td>
                              <td className="py-4">
                                <div className="text-slate-500 text-sm">
                                  {Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }).format(new Date(invoice.issueDate))}
                                </div>
                              </td>
                              <td className="py-4">
                                <div className="text-slate-500 text-sm">
                                  {Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }).format(new Date(invoice.dueDate))}
                                </div>
                              </td>
                              <td className="py-4">
                                <div className="">
                                  <Badge
                                    className={clsx({
                                      "bg-blue-50 text-blue-600 rounded-md   border-blue-200":
                                        invoice.status === "paid",
                                      "bg-rose-50 text-rose-600 rounded-md  border-rose-200":
                                        invoice.status === "overDue",
                                      "bg-amber-50 text-amber-600 rounded-md border-amber-200":
                                        invoice.status === "pending",
                                    })}
                                  >
                                    {invoice.status}
                                  </Badge>
                                </div>
                              </td>
                              <td className="">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    {invoice.status == "pending" ? (
                                      <DropdownMenuItem
                                        className="text-blue-500 hover:bg-blue-500"
                                        onClick={() => {
                                          updateStatus(invoice.id, "paid");
                                        }}
                                      >
                                        {" "}
                                        <Check className="w-4 h-4 text-blue-500 hover:text-blue-500" />{" "}
                                        Paid
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem
                                        className="text-amber-500 hover:bg-amber-500"
                                        onClick={() => {
                                          updateStatus(invoice.id, "pending");
                                        }}
                                      >
                                        {" "}
                                        <X className="w-4 h-4 text-amber-500 hover:text-amber-500" />{" "}
                                        pending
                                      </DropdownMenuItem>
                                    )}

                                    <DropdownMenuItem
                                      onClick={() => {
                                        navigate(`/invoices/${invoice.id}`);
                                      }}
                                    >
                                      {" "}
                                      <Eye className="w-4 h-4" /> View
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      onClick={() => {
                                        downloadPdf(invoice.id);
                                      }}
                                    >
                                      <Download className="w-4 h-4" /> Download
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => {
                                        deleteInvoice(invoice.id);
                                      }}
                                      className="text-rose-500 hover:text-rose-500"
                                    >
                                      <Trash className="w-4 h-4 text-rose-500 hover:text-rose-500" />{" "}
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
            {/* recent activites and Quick Actions */}

            <div className="grid grid-cols-3 gap-6 h-120">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="text-white  bg-blue-500 hover:bg-blue-600 hover:text-white  rounded-sm"
                    onClick={() => {
                      navigate("/invoices/create");
                    }}
                  >
                    <Plus className="h-4 w-4 " />

                    <span className="">Create a new Inovice</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate("/clients/add");
                    }}
                  >
                    <User className="h-4 w-4" />
                    <span>Add a Client</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate("/reports");
                    }}
                  >
                    <File className="w-4 h-4" />
                    <span>Generate Report</span>
                  </Button>
                </CardContent>
              </Card>
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {dashBoardData.data.recentActivities.map((activity) => {
                    return (
                      <div className=" flex justify-between items-center  rounded-md hover:bg-slate-100 border-1 borde-slate-200 h-15 p-4 text-sm font-medium text-slate-900">
                        <div className="flex gap-4 items-center">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <FileText className="h-4 w-4 text-blue-500" />
                          </div>
                          <span className="font-semibold">
                            {" "}
                            {activity.description}
                          </span>
                        </div>
                        <span>
                          {" "}
                          {Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).format(new Date(activity.createdAt))}
                        </span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
};

export default DashBoard;

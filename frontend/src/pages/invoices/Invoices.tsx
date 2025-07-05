import BoxLoader from "@/components/custom/BoxLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchInvoices, type invoiceDataType } from "@/utils/api/fetchInvoice";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import {
  Check,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Trash,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { apiCall } from "@/utils/api/apiCall";
import { toast } from "sonner";
import SideBar from "@/components/custom/Sidebar";
import Header from "@/components/custom/Header";
import { useNavigate } from "react-router-dom";

type updateResponse = {
  success: boolean;
  message: string;
};
const Invoices = () => {
  let navigate = useNavigate();

  const deleteInvoice = async (invoiceId: string) => {
    const response = await apiCall<null>(
      `/delete-invoice/${invoiceId}`,
      "DELETE",
      "protected"
    );
    if (response.success) {
      if (invoices) {
        const updatedInvoices = invoices.filter((invoice) => {
          return invoice.id !== invoiceId;
        });
        setInvoices(updatedInvoices);
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

    if (response.success && invoices) {
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
        if (invoices) {
          const updatedInvoices = invoices.map((inv) =>
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
        if (invoices) {
          const updatedInvoices = invoices.map((inv) =>
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

  const [currentPage, setCurrentPage] = useState<number>(1);
  const invoicePerPage = 8;

  const lastInvoiceIndex = currentPage * invoicePerPage;
  const firstInvoiceIndex = lastInvoiceIndex - invoicePerPage;

  const {
    data: invoicesData,
    isLoading,
    isPending,
  } = useQuery({
    queryFn: async () => fetchInvoices(),

    queryKey: ["invoices"],
  });

  const [invoices, setInvoices] = useState<invoiceDataType[]>();

  useEffect(() => {
    if (!isPending && invoicesData) {
      setInvoices(invoicesData);
    }
  }, [isPending, invoicesData]);

  return (
    <div className="bg-slate-50 min-h-screen flex">
      <SideBar />
      <div className="flex flex-col w-full">
        <Header />

        <main className="flex flex-col gap-6 p-6">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
            <div className="flex gap-4">
              <Button variant="outline" className="flex items-center">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
              <Button
                onClick={() => {
                  navigate("/invoices/create");
                }}
                className="bg-emerald-500 flex items-center hover:bg-emerald-600 text-white hover:text-white"
              >
                <Plus className="w-4 h-5" />
                <span>New Invoice</span>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex mt-30 justify-center mt-40">
              <BoxLoader />{" "}
            </div>
          ) : !invoices ? (
            <div className="flex mt-30 justify-center mt-40">
              <BoxLoader />{" "}
            </div>
          ) : invoices.length == 0 ? (
            <div className="flex mt-30 justify-center mt-40 text-slate-500">
              No invoices exists, try Creating new invoice
            </div>
          ) : (
            <Card className="rounded-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">
                    All Invoices
                  </h2>
                  <div className="flex gap-2 items-center">
                    <Select defaultValue="all">
                      <SelectTrigger
                        id="status"
                        className="mt-1 bg-white w-[180px] "
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>

                <CardContent className=" mt-8 px-0">
                  <div className="space-y-6">
                    <table className="w-full text-sm ">
                      <thead>
                        <tr className="border-b border-slate-200 text-left text-slate-500">
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
                        {invoices
                          .slice(firstInvoiceIndex, lastInvoiceIndex)
                          .map((invoice: invoiceDataType) => {
                            return (
                              <tr
                                className="border-b border-slate-100 hover:bg-slate-50"
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
                                        "bg-emerald-50 text-emerald-600 rounded-md   border-emerald-200":
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
                                          className="text-emerald-500 hover:bg-emerald-500"
                                          onClick={() => {
                                            updateStatus(invoice.id, "paid");
                                          }}
                                        >
                                          {" "}
                                          <Check className="w-4 h-4 text-emerald-500 hover:text-emerald-500" />{" "}
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
                                        <Download className="w-4 h-4" />{" "}
                                        Download
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

                    <div className="flex justify-between items-center">
                      <p className="text-slate-500 text-sm">
                        Showing 8 of {invoices.length} invoices
                      </p>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          disabled={currentPage == 1}
                          onClick={() => {
                            setCurrentPage(currentPage - 1);
                          }}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          disabled={
                            currentPage ==
                            Math.ceil(invoices.length / invoicePerPage)
                          }
                          onClick={() => {
                            setCurrentPage(currentPage + 1);
                          }}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Invoices;

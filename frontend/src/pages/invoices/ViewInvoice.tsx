import BoxLoader from "@/components/custom/BoxLoader";
import Header from "@/components/custom/Header";
import SideBar from "@/components/custom/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOneInvoice } from "@/utils/api/getOneInvoice";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import {
  ArrowLeft,
  Calendar,
  Copy,
  Dot,
  Download,
  Edit,
  FileText,
 
  LocationEdit,
  Mail,
  Phone,
  Send,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiCall } from "@/utils/api/apiCall";
import { toast } from "sonner";

const ViewInvoice = () => {
  let navigate = useNavigate();

  const [update, setUpdating] = useState<boolean>(false);

  const { invoiceId } = useParams();

  const { data: invoice, isLoading } = useQuery({
    queryFn: async () => {
      if (invoiceId) {
        const result = await getOneInvoice(invoiceId);
        return result;
      }
      return undefined;
    },
    queryKey: ["clients"],
  });

  const sendPdfToClient = async (invoiceId: string) => {
    setUpdating(true);
    const response = await apiCall<null>(
      `/send-pdf/${invoiceId}`,
      "POST",
      "protected"
    );

    if (response.success) {
      setUpdating(false);
      toast.success(response.message);
    } else {
      setUpdating(false);
      toast.error(response.message);
    }
  };

  const duplicateInvoice = async (invoiceId: string) => {
    setUpdating(true);
    const response = await apiCall<null>(
      `/duplicate-invoice/${invoiceId}`,
      "POST",
      "protected"
    );

    if (response.success) {
      setUpdating(false);
      toast.success(response.message);
    } else {
      setUpdating(false);
      toast.error(response.message);
    }
  };

  const [taxAmount, setTaxMonut] = useState<number>(0);

  useEffect(() => {
    if (invoice) {
      const taxAmount =
        (Number(invoice.subTotal) * Number(invoice.taxPercent)) / 100;

      setTaxMonut(taxAmount);

      invoice.subTotal = Number(invoice.subTotal);
      invoice.grandTotal = Number(invoice.grandTotal);
      invoice.taxPercent = Number(invoice.taxPercent);
    }
  }, [invoice]);

  const deleteInvoice = async (invoiceId: string) => {
    setUpdating(true);
    const response = await apiCall<null>(
      `/delete-invoice/${invoiceId}`,
      "DELETE",
      "protected"
    );
    if (response.success) {
      setUpdating(false);
      toast.success(response.message);
      navigate('/invoices')
    } else {
      setUpdating(false);
      toast.error(response.message);
    }
  };

  const downloadPdf = async (invoiceId: string) => {
    setUpdating(true);

    const response = await apiCall<string>(
      `/download-pdf/${invoiceId}`,
      "GET",
      "protected"
    );

    if (response.success && invoice) {
      setUpdating(false);

      const link = document.createElement("a");
      link.href = response.data;
      link.setAttribute("download", invoice.invoiceNumber);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(response.message);
    } else {
      setUpdating(false);
      toast.error(response.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="mt-20">
          <BoxLoader />
        </div>
      </div>
    );
  }

  // if (update) {
  //   return (
  //     <div className="flex justify-center items-center gap-2">
  //       {" "}
  //       <Loader2 className="animate-spin w-6 h-6 text-emerald-500 mt-30" />{" "}
  //       <span className="mt-30 text-emerald-500">Loading...</span>
  //     </div>
  //   );
  // }

  if (invoice && invoiceId)
    return (
      <div className="bg-slate-50 min-h-screen flex">
        {update && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(2px)",
            }}
          />
        )}
        <SideBar />
        <div className="flex flex-col w-full">
          <Header />

          <main className="flex flex-col gap-6 p-6">
            {/* //header part  */}
            <div className="flex items-center justify-between ">
              {/* invoice  */}
              <div className="flex gap-4 items-cetner">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/invoices");
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <div className=" ">
                  <p className="text-2xl font-bold">{invoice.invoiceNumber}</p>
                  <div className="flex justify-between">
                    <Badge
                      variant="outline"
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
                    <Dot />
                    <span>
                      Due Date {new Date(invoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={() => {
                    downloadPdf(invoiceId);
                  }}
                >
                  {" "}
                  <Download className="h-4 w-4" />
                  <span> Download Pdf</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    sendPdfToClient(invoiceId);
                  }}
                >
                  <Send className="h-4 w-4" /> <span>Send Pdf</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="flex  items-center gap-2 border-none hover:bg-slate-100 rounded-sm"
                    asChild
                  >
                    <Button variant="outline" className="w-25 ">
                      <Edit /> Action
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        navigate(`/invoices/edit-invoice/${invoiceId}`);
                      }}
                    >
                      <Edit /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        duplicateInvoice(invoiceId);
                      }}
                    >
                      <Copy /> Duplicate
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={()=>{
                      deleteInvoice(invoiceId);
                    }}>
                      <Trash className="h-4 w-4 text-rose-500" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex gap-10">
              {/* invoice  */}
              <Card className="p-8 w-4xl bg-white  rounded-md ">
                {/* //header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="rounded-md bg-emerald-500 p-2">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {!!invoice.client.companyName &&
                          invoice.client.companyName}
                      </h2>
                    </div>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p>{invoice.client.streetAddress}</p>
                      <p>
                        {invoice.client.city}, {invoice.client.state}{" "}
                        {invoice.client.pinCode}
                      </p>
                      <p>{invoice.client.country}</p>
                      <p className="mt-2">{invoice.client.email}</p>
                      <p>{invoice.client.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      INVOICE
                    </h3>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p>
                        <span className="font-medium">Invoice #:</span>{" "}
                        {invoice.invoiceNumber}
                      </p>
                      <p>
                        <span className="font-medium">Issue Date:</span>
                        {new Date(invoice.issueDate).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Due Date:</span>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* client details  */}
                <div className="mb-8">
                  <h4 className="font-semibold text-slate-900 mb-3">
                    Bill To:
                  </h4>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p className="font-medium text-slate-900">
                      {invoice.client.companyName}
                    </p>
                    <p>{invoice.client.streetAddress}</p>
                    <p>
                      {invoice.client.city}, {invoice.client.state}{" "}
                      {invoice.client.pinCode}
                    </p>
                    <p>{invoice.client.country}</p>
                    <p className="mt-2">{invoice.client.email}</p>
                    <p>{invoice.client.phoneNumber}</p>
                  </div>
                </div>

                {/* items detail  */}

                <div className="mb-8">
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                      <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-700">
                        <div className="col-span-6">Description</div>
                        <div className="col-span-2 text-center">Qty</div>
                        <div className="col-span-2 text-right">Rate</div>
                        <div className="col-span-2 text-right">Amount</div>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-200">
                      {invoice.items.map((item) => (
                        <div key={item.name} className="px-4 py-4">
                          <div className="grid grid-cols-12 gap-4 text-sm">
                            <div className="col-span-6 text-slate-900">
                              {item.description}
                            </div>
                            <div className="col-span-2 text-center text-slate-600">
                              {Number(item.quantity)}
                            </div>
                            <div className="col-span-2 text-right text-slate-600">
                              ${Number(item.unitPrice)}
                            </div>
                            <div className="col-span-2 text-right font-medium text-slate-900">
                              ${Number(item.totalPrice)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* //amount  */}
                <div className="flex justify-end mb-8">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal:</span>
                      <span className="text-slate-900">
                        ${invoice.subTotal}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        Tax ({invoice.taxPercent}%):
                      </span>
                      <span className="text-slate-900">${taxAmount}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-slate-900">Total:</span>
                      <span className="text-slate-900">
                        ${invoice.grandTotal}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {invoice.notes && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      Notes:
                    </h4>
                    <p className="text-sm text-slate-600">{invoice.notes}</p>
                  </div>
                )}
              </Card>
              {/* summary  */}
              <div className="w-100 flex flex-col gap-6">
                <Card className="w-full pb-10">
                  <CardContent className="">
                    <h1 className="text-xl font-bold text-slate-900">
                      Quick Actions
                    </h1>
                    <div className="flex flex-col gap-3 mt-4">
                      <Button
                        variant="outline"
                        className="text-white bg-black hover:text-white hover:bg-slate-800 rounded-md"
                        onClick={() => {
                          sendPdfToClient(invoiceId);
                        }}
                      >
                        <Send className="w-4 h-4" /> Send To Client
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-md"
                        onClick={() => {
                          downloadPdf(invoiceId);
                        }}
                      >
                        {" "}
                        <Download className="h-4 w-4" /> Download Pdf
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-md"
                        onClick={() => {
                          duplicateInvoice(invoiceId);
                        }}
                      >
                        <Copy /> Duplicate
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-md"
                        onClick={() => {
                          navigate(`/invoices/edit-invoice/${invoiceId}`);
                        }}
                      >
                        <Edit /> Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* //invoice Summary  */}
                <Card className="w-full pb-10">
                  <CardContent className="">
                    <h1 className="text-xl font-bold text-slate-900">
                      Invoice Summary
                    </h1>
                    <div className="flex flex-col gap-3 mt-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <div className="text-slate-700">
                          <div className="text-sm">Issue Date</div>
                          <div className="text-sm">
                            {new Date(invoice.issueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <div className="text-slate-700">
                          <div className="text-sm">Due Date</div>
                          <div className="text-sm">
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="mt-4" />

                    <div className="mt-5">
                      <div className="text-md text-slate-900 font-medium">
                        Total Amount{" "}
                      </div>
                      <div className="text-2xl font-bold">
                        ${Number(invoice.grandTotal).toFixed(2)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <h1 className="text-xl font-bold text-slate-900">
                      Client Information
                    </h1>

                    <div className="text-sm text-slate-600 space-y-1 mt-4">
                      <p className="font-normal text-lg text-slate-900">
                        {invoice.client.companyName}
                      </p>
                      <div className="flex gap-2">
                        <LocationEdit className="w-4 h-4" />
                        <div>
                          <p> {invoice.client.streetAddress}</p>
                          <p>
                            {invoice.client.city}, {invoice.client.state}{" "}
                            {invoice.client.pinCode}
                          </p>
                          <p>{invoice.client.country}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Mail className="w-4 h-4" />
                        <p>{invoice.client.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Phone className="w-4 h-4" />
                        <p>{invoice.client.phoneNumber}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
};

export default ViewInvoice;

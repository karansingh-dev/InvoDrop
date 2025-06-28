import BoxLoader from "@/components/custom/BoxLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchInvoices, type invoiceDataType } from "@/utils/api/fetchInvoice";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Download, Eye, Filter, MoreHorizontal, Plus, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react";


const Invoices = () => {


    const [currentPage, setCurrentPage] = useState<number>(1);
    const invoicePerPage = 8;

    const lastInvoiceIndex = currentPage * invoicePerPage
    const firstInvoiceIndex = lastInvoiceIndex - invoicePerPage


    const { data: invoices, isLoading } = useQuery({
        queryFn: async () =>
            fetchInvoices()

        , queryKey: ["invoices"]
    })


    return <main className="flex flex-col gap-6 p-6">

        <div className="flex justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
            <div className="flex gap-4">
                <Button variant="outline" className="flex items-center">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                </Button>
                <Button className="bg-emerald-500 flex items-center hover:bg-emerald-600 text-white hover:text-white">
                    <Plus className="w-4 h-5" />
                    <span>New Invoice</span>
                </Button>
            </div>
        </div>

        {isLoading ? <div className="flex mt-30 justify-center mt-40"><BoxLoader /> </div> : invoices == undefined ? <div className="flex mt-30 justify-center mt-40 text-rose-500">Error fetching invoices</div> : invoices.length == 0 ? <div className="flex mt-30 justify-center mt-40 text-slate-500">No invoices exists, try Creating new invoice</div> :

            <Card className="rounded-md">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">All Invoices</h2>
                        <div className="flex gap-2 items-center">
                            <Select defaultValue="all">

                                <SelectTrigger id="status" className="mt-1 bg-white w-[180px] ">
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


                    <CardContent className=" mt-8 px-0" >
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
                                    {invoices.slice(firstInvoiceIndex, lastInvoiceIndex).map((invoice: invoiceDataType) => {

                                        return <tr className="border-b border-slate-100 hover:bg-slate-50" key={invoice.id}>

                                            <td className="py-4 pl-4 ">
                                                <div className="font-medium text-sm text-slate-900">{invoice.invoiceNumber}</div>
                                            </td>
                                            <td className="py-4">
                                                <div className="font-medium text-sm text-slate-900">{invoice.companyName}</div>
                                            </td>
                                            <td className="py-4">
                                                <div className="font-medium text-sm text-slate-900">$ {invoice.grandTotal}</div>
                                            </td>
                                            <td className="py-4">
                                                <div className="text-slate-500 text-sm">
                                                    {Intl.DateTimeFormat('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    }).format(new Date(invoice.issueDate))}

                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="text-slate-500 text-sm">
                                                    {Intl.DateTimeFormat('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    }).format(new Date(invoice.dueDate))}

                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="">
                                                    <Badge variant="outline" className={clsx(

                                                        {
                                                            "bg-emerald-50 text-emerald-600 rounded-md   border-emerald-200": invoice.status === "paid",
                                                            "bg-rose-50 text-rose-600 rounded-md  border-rose-200": invoice.status === "overDue",
                                                            "bg-amber-50 text-amber-600 rounded-md border-amber-200": invoice.status === "pending",
                                                        }
                                                    )}>{invoice.status}</Badge>

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
                                                        <DropdownMenuItem> <Eye className="w-4 h-4" /> View</DropdownMenuItem>
                                                        <DropdownMenuItem><Download className="w-4 h-4" /> Download</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-rose-500 hover:text-rose-500"><Trash className="w-4 h-4 text-rose-500 hover:text-rose-500" /> Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>


                                        </tr>




                                    })}
                                </tbody>

                            </table>


                            <div className="flex justify-between items-center">

                                <p className="text-slate-500 text-sm">
                                    Showing 8 of {invoices.length} invoices
                                </p>

                                <div className="flex items-center gap-2">
                                    <Button variant="outline" disabled={currentPage == 1} onClick={() => {
                                        setCurrentPage(currentPage - 1);
                                    }}>
                                        Previous

                                    </Button>
                                    <Button variant="outline" disabled={currentPage == Math.ceil(invoices.length / invoicePerPage)} onClick={() => {
                                        setCurrentPage(currentPage + 1);
                                    }}>
                                        Next
                                    </Button>

                                </div>

                            </div>


                        </div>








                    </CardContent>
                </CardHeader>

            </Card>
        }
    </main>





}


export default Invoices;
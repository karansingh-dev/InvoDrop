import { FileText } from "lucide-react";
import { useParams } from "react-router-dom";
import BoxLoader from "@/components/custom/Loaders/BoxLoader";
import { useQuery } from "@tanstack/react-query";
import { getOneInvoice } from "./api/getOneInvoice";



const Pdf = () => {
    const { invoiceId } = useParams();

    const { data: invoice, isLoading } = useQuery({
        queryFn: async () => {
            if (invoiceId) {
                const result = await getOneInvoice(invoiceId)
                return result;
            }
            return undefined;
        }, queryKey: ["clients"]
    })





    if (isLoading) {
        return <div className="flex justify-center items-center">
            <BoxLoader />
        </div>
    }

    else if (invoice == undefined) {
        return <div className="flex justify-center item-center text-rose-500">
            <span className="mt-50">
            Error Loading Invoice details
            </span>
        </div>
    }


    else {
        
        
        return <div className="min-h-screen bg-white flex justify-center ">

        <div className="p-8 w-4xl ">
            <div className="flex justify-between">

                <div className="flex flex-col gap-2">
                    <div className="flex justify-center items-center bg-blue-600 p-2 rounded-md w-20">
                        <FileText className="w-16 h-16 text-white" />

                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        {invoice?.client.companyName}

                    </h1>
                    <div>
                        <p className="text-gray-600 font-medium">
                            {`${invoice.client.streetAddress}, ${invoice.client.city},${invoice.client.state}, ${invoice.client.country}, ${invoice.client.pinCode} `}

                        </p>
                        <p className="text-gray-600 font-medium">
                            {invoice.client.email}

                        </p>
                        <p className="text-gray-600 font-medium">
                            {invoice.client.phoneNumber}

                        </p>
                    </div>

                </div>

                <div className="flex flex-col gap-3">
                    <h1 className="text-4xl font-bold text-blue-600 uppercase text-right ">Invoice</h1>
                    <div className="text-right">
                        <div>
                            <span className="text-gray-600 font-semibold">Invoice Number: </span> <span className="text-gray-600 font-normal">{invoice?.invoiceNumber}</span>
                        </div>
                        <div>
                            <span className="text-gray-600 font-semibold">IssueDate: </span> <span className="text-gray-600 font-normal">22 June,2025</span>
                        </div>
                        <div>
                            <span className="text-gray-600 font-semibold">DueDate: </span> <span className="text-gray-600 font-normal">22 June,2025</span>
                        </div>


                    </div>

                </div>

            </div>

            {/* client details  */}
            <div className="bg-slate-100 rounded-md gap-3 flex flex-col p-4 mt-6 ">
                <h2 className="font-semibold text-gray-700 text-lg">Bill To:</h2>

                <div>
                    <h3 className="text-xl text-gray-800 font-bold">
                        {invoice.client.companyName}
                      
                    </h3>
                    <div>
                        <p className="text-gray-600 font-medium">
                            {`${invoice.client.streetAddress}, ${invoice.client.city},${invoice?.client.state}, ${invoice?.client.country}, ${invoice?.client.pinCode} `}
                        </p>
                        <p className="text-gray-600 font-medium">
                            {invoice.client.email}

                        </p>
                        <p className="text-gray-600 font-medium">{invoice.client.phoneNumber}</p>
                    </div>

                </div>


            </div>

            {/* items detail  */}

            <div className="mt-6">
                <table className="w-full">

                    <thead>
                        <tr className="bg-blue-100  ">
                            <th className="py-3 text-left pl-4">Name</th>
                            <th className="py-3 text-left">Description</th>
                            <th className="py-3 text-left">Quantity</th>
                            <th className="py-3 text-left">Unit Price</th>
                            <th className="py-3 text-right pr-4">Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        {invoice.items.map((item) => {
                            return <tr className="border-b border-gray-200">
                                <td className="py-4 text-left pl-4">{item.name}</td>
                                <td className="py-4 text-left">{item.description}</td>
                                <td className="py-4 text-left">{item.quantity}</td>
                                <td className="py-4 text-left">{item.unitPrice}</td>
                                <td className="py-4 text-right pr-4">{item.totalPrice}</td>
                            </tr>
                        })}

                    </tbody>
                </table>
            </div>

            {/* //amount  */}
            <div className="flex justify-end mt-6 ">
                <div className="space-y-2">
                    <div className="py-2 w-73 flex justify-between border-b border-gray-200 px-1">
                        <span className="font-semibold text-gray-700">Subtotal:</span>
                        <span className="text-gray-800">$1530</span>

                    </div>
                    <div className="py-2 w-73 flex justify-between border-b border-gray-200 px-1">
                        <span className="font-semibold text-gray-700">Tax(10%):</span>
                        <span className="text-gray-800">$153</span>

                    </div>
                    <div className="py-2 w-73 flex justify-between border-b border-gray-200 px-1">
                        <span className="font-bold text-gray-700">Total Due:</span>
                        <span className=" text-2xl font-bold text-blue-600">$1683</span>

                    </div>
                </div>

            </div>

            {/* notes section */}

            <div className="border-t border-gray-200 py-6">
                <h4 className="text-lg font-bold text-gray-700 mb-2">Notes</h4>
                <p className="text-gray-600">{invoice.notes}</p>
            </div>

            {/* footer note */}
            <div className="text-center border-t border-gray-200 pt-6">
                <p className="text-gray-600">Thanks for your business</p>

            </div>



        </div>
    </div>
    }

}

export default Pdf;
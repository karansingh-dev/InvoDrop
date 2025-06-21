import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addClientSchema } from "@/validations/client/addClientSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import { apiCall, type apiResponse } from "@/utils/api/apiCall";
import { toast } from "sonner";


const AddClient = () => {

    let navigate = useNavigate();

    const { register, handleSubmit } = useForm<z.infer<typeof addClientSchema>>({
        resolver: zodResolver(addClientSchema),
        defaultValues: {
            companyName: "",
            contactPersonName: "",
            phoneNumber: "",
            email: "",
            status: true,
            streetAddress: "",
            city: "",
            state: "",
            country: "",
            pinCode: ""


        }

    })

    const [statusValue, setStatusValue] = useState<string>("active");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSelectChange = (value: string) => {
        setStatusValue(value);

    }

    const statusValueToBoolean = (value: string) => {

        if (value == "active") return true;
        else if (value == "inactive") return false;

    }

    const onSubmit: SubmitHandler<z.infer<typeof addClientSchema>> = async (data) => {

        const status = statusValueToBoolean(statusValue);

        if (status) data.status = true;
        else data.status = false;

        setLoading(true);
        const result: apiResponse = await apiCall("/add-client", "post", "auth", data);

        if (result.success) {
            toast.success(result.message);
            setLoading(false);
            navigate(`/clients`);

        }
        else {
            toast.error(result.message);
            setLoading(false);
        }


    }



    return <div className="bg-slate-50 min-h-screen flex flex-col">


        {/* header section  */}
        <header className="flex items-center justify-between px-6 h-14 bg-white sticky top-0">

            <div className="flex gap-4 items-center">
                <Button variant="ghost" onClick={() => {
                    navigate("/clients")
                }}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>

                <h1 className="text-lg font-bold text-slate-900">Add New Client</h1>

            </div>

            <Button variant="outline" onClick={handleSubmit(onSubmit)} className=" bg-emerald-500 hover:bg-emerald-600 hover:text-white">

                {loading ? <Loader2 className="animate-spin w-12 h-12 text-white" /> :
                    <div className="flex justify-center items-center text-white">
                        <Save className="h-4 w-4" />
                        <span className="text-md">Save Client</span>
                    </div>

                }


            </Button>

        </header>

        {/* main section  */}

        <main className="flex justify-center p-6">
            <form onSubmit={handleSubmit(onSubmit)}  >
                <Card className="rounded-md w-200 py-0">
                    <CardHeader className="mt-5">
                        <CardTitle>
                            <h3 className="text-xl text-slate-900 font-bold">Client Information</h3>

                        </CardTitle>
                    </CardHeader>

                    <CardContent>


                        <div className="space-y-6">
                            {/* company information  */}
                            <div className="flex flex-col gap-6">
                                <h3 className="text-xl text-slate-900 font-medium">Company Information</h3>
                                <div className="">
                                    <Label htmlFor="companyName" className="text-sm font-medium text-slate-700">Company Name<span className="text-rose-500">*</span></Label>
                                    <Input
                                        {...register("companyName")}
                                        id="companyName"
                                        type="text"
                                        className="mt-1"

                                    />


                                </div>

                            </div>

                            {/* primary Contact  */}

                            <div className="flex flex-col gap-6">
                                <h3 className="text-xl text-slate-900 font-medium">Primary Contact</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="">
                                        <Label htmlFor="contactPersonName" className="text-sm font-medium text-slate-700">Contact Name<span className="text-rose-500">*</span></Label>
                                        <Input
                                            {...register("contactPersonName")}
                                            id="contactPersonName"
                                            type="text"
                                            className="mt-1"

                                        />


                                    </div>

                                    <div className="">
                                        <Label htmlFor="emailAddress" className="text-sm font-medium text-slate-700">Email Address<span className="text-rose-500">*</span></Label>
                                        <Input
                                            {...register("email")}
                                            id="emailAddress"
                                            type="text"
                                            className="mt-1"

                                        />


                                    </div>
                                    <div className="">
                                        <Label htmlFor="phoneNumber" className="text-sm font-medium text-slate-700">Phone Number<span className="text-rose-500">*</span></Label>
                                        <Input
                                            {...register("phoneNumber")}
                                            id="phoneNumber"
                                            type="tel"
                                            className="mt-1"

                                        />


                                    </div>
                                    <div className="">
                                        <Label htmlFor="status" className="text-sm font-medium text-slate-700">Status<span className="text-rose-500">*</span></Label>
                                        <Select value={statusValue} defaultValue={statusValue} onValueChange={(value) => {
                                            handleSelectChange(value);
                                        }} >

                                            <SelectTrigger id="status" className="mt-1 bg-white w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>

                                    </div>
                                </div>


                            </div>

                            {/* Address section  */}

                            <div className="flex flex-col gap-6">
                                <h3 className="text-xl text-slate-900 font-medium">Address</h3>

                                <div>
                                    <div className="">
                                        <Label htmlFor="streetAddress" className="text-sm font-medium text-slate-700">Street Address<span className="text-rose-500">*</span></Label>
                                        <Input
                                            {...register("streetAddress")}
                                            id="streetAddress"
                                            type="text"
                                            className="mt-1"

                                        />


                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">

                                    <div className="">
                                        <Label htmlFor="city" className="text-sm font-medium text-slate-700">City<span className="text-rose-500">*</span></Label>
                                        <Input
                                            {...register("city")}
                                            id="city"
                                            type="text"
                                            className="mt-1"

                                        />


                                    </div>
                                    <div className="">
                                        <Label htmlFor="state" className="text-sm font-medium text-slate-700">State<span className="text-rose-500">*</span></Label>
                                        <Input
                                            {...register("state")}
                                            id="state"
                                            type="text"
                                            className="mt-1"

                                        />


                                    </div>
                                    <div className="">
                                        <Label htmlFor="pinCode" className="text-sm font-medium text-slate-700">Pin Code<span className="text-rose-500">*</span></Label>
                                        <Input
                                            {...register("pinCode")}
                                            id="pincode"
                                            type="text"
                                            className="mt-1"

                                        />



                                    </div>
                                </div>
                                <div className="">
                                    <Label htmlFor="country" className="text-sm font-medium text-slate-700">Country<span className="text-rose-500">*</span></Label>
                                    <Input
                                        {...register("country")}
                                        id="country"
                                        type="text"
                                        className="mt-1"

                                    />

                                </div>


                            </div>





                        </div>





                    </CardContent>

                    <CardFooter className="bg-slate-100 border-t border-slate-200 flex h-16 justify-between items-center">


                        <Button variant="outline" disabled={loading} className="relative bottom-3" onClick={() => {
                            navigate("/clients");
                        }} >
                            Cancel
                        </Button>




                        <Button type="submit" variant="outline" className=" relative bottom-3 text-white bg-emerald-500 hover:bg-emerald-600 hover:text-white">
                            {loading ? <Loader2 className="animate-spin w-12 h-12 text-white" /> :
                                <div className="flex justify-center items-center text-white">
                                    <Save className="h-4 w-4" />
                                    <span className="text-md">Save Client</span>
                                </div>

                            }

                        </Button>



                    </CardFooter>


                </Card>
            </form>


        </main>

    </div >
}

export default AddClient;
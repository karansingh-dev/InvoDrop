import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm, type SubmitHandler } from "react-hook-form"
import z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { apiCall, type apiResponse } from "@/utils/apiCall";
import { useState } from "react";
import BasicLoader from "@/components/custom/BasicLoader";
import { toast } from "sonner";
import { verificationCodeSchema } from "@/validations/verificationCodeSchema";
import { useNavigate, useParams } from "react-router-dom";



const VerifyCode = () => {
    
    let navigate = useNavigate();

    const { emailAddress } = useParams();


    const [loading, setLoading] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof verificationCodeSchema>>({
        resolver: zodResolver(verificationCodeSchema),
        defaultValues: {
            email: emailAddress,
            verifyCode: ""

        },
    });

    const onSubmit: SubmitHandler<z.infer<typeof verificationCodeSchema>> = async (data) => {

        setLoading(true);

        const result: apiResponse = await apiCall("/verify-code", "post", "noauth", data);

        if (result.success) {
            toast.success(result.message);
            setLoading(false);
            navigate("/login")
        }
        else {
            toast.error(result.message);
            setLoading(false);
        }

    }

    return (
        <div className="bg-slate-50 min-h-screen bg-slate-50 flex flex-col items-center gap-8 justify-center">

            {/* //Verification Code card  */}

            <Card className="w-120 shadow-xl border-none ">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-center text-slate-900">Verify Code </CardTitle>
                    <CardDescription className="text-center text-slate-600 mt-1">
                        Enter the verifycode we sent to your email {emailAddress}
                    </CardDescription>

                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} >
                        <div className="flex flex-col space-y-6">

                            <div>
                                <div className="flex items-center">
                                    <Label htmlFor="verifyCode" className="text-sm font-medium text-slate-700 mb-1">Verification Code</Label>

                                </div>
                                <Input id="verifyCode" type="text"
                                    {...register("verifyCode")}
                                    className="h-11 border-slate-200 focus-visible:ring-emerald-500 placeholder:text-slate-700"
                                    placeholder="Enter the 6 digit verify code"
                                    required />
                                {errors.verifyCode && (
                                    <p className="text-sm text-rose-500 mt-1">
                                        {errors.verifyCode.message}
                                    </p>

                                )}
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
                                {loading ? <BasicLoader /> : <p>Verify Code</p>}
                            </Button>
                        </div>

                    </form>
                </CardContent>

            </Card>


        </div>
    )
}


export default VerifyCode;

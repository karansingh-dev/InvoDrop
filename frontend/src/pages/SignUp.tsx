import { FileText } from "lucide-react";
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
import { signUpSchema } from "@/validations/signUpSchema";
import z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { apiCall } from "@/utils/apiCall";
import { useState } from "react";
import BasicLoader from "@/components/custom/BasicLoader";


const SignUp = () => {

    const [loading, setLoading] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",

        },
    });

    const onSubmit: SubmitHandler<z.infer<typeof signUpSchema>> = async (data) => {
        try {
            setLoading(true);
            const result: {

            } = await apiCall("/sign-up", "post", "noauth", data);

            ;

        } catch (error) {
            console.error("error in registering users");


        }
        finally {
            setLoading(false);
        }

    }

    return (
        <div className="bg-slate-50 min-h-screen bg-slate-50 flex flex-col items-center gap-8 justify-center">


            <div className="flex items-center gap-2 ">
                <div className="bg-emerald-500 rounded-md p-2 flex items-center jusify-center">
                    <FileText className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl text-slate-900 font-bold">InvoDrop</h1>
            </div>

            {/* //signup card  */}

            <Card className="w-120 shadow-xl border-none">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-center text-slate-900">Welcome </CardTitle>
                    <CardDescription className="text-center text-slate-600">
                        Enter your deatails  to continue
                    </CardDescription>

                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} >
                        <div className="flex flex-col space-y-6">
                            <div className="flex items-center gap-5">
                                <div>
                                    <Label htmlFor="email" className="font-medium text-sm text-slate-700 mb-1">First Name</Label>
                                    <Input
                                        {...register("firstName")}
                                        id="firstName"
                                        type="firstName"
                                        placeholder="Shilendra"
                                        className="h-11 border-slate-200 placeholder:text-slate-700  focus-visible:ring-emerald-500"
                                        required
                                    />
                                    {errors.firstName && (
                                        <p className="text-sm text-rose-500 mt-1">
                                            {errors.firstName.message}
                                        </p>

                                    )}

                                </div>
                                <div>
                                    <Label htmlFor="lastName" className="font-medium text-sm text-slate-700 mb-1">Last Name</Label>
                                    <Input
                                        {...register("lastName")}
                                        id="lastName"
                                        type="lastName"
                                        placeholder="Singh"
                                        className="h-11 border-slate-200 placeholder:text-slate-700 focus-visible:ring-emerald-500"
                                        required
                                    />
                                    {errors.lastName && (
                                        <p className="text-sm text-rose-500 mt-1">
                                            {errors.lastName.message}
                                        </p>

                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700 mb-1">
                                    Email address
                                </Label>
                                <Input
                                    {...register("email")}
                                    id="email"
                                    type="email"
                                    placeholder="shilendra@example.com"
                                    className="h-11 border-slate-200 placeholder:text-slate-700 focus-visible:ring-emerald-500"

                                    required
                                />
                                {errors.email && (
                                    <p className="text-sm text-rose-500 mt-1">
                                        {errors.email.message}
                                    </p>

                                )}
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="text-sm font-medium text-slate-700 mb-1">Password</Label>

                                </div>
                                <Input id="password" type="password"
                                    {...register("password")}
                                    className="h-11 border-slate-200 focus-visible:ring-emerald-500 placeholder:text-slate-700"
                                    placeholder="Enter your password"
                                    required />
                                {errors.password && (
                                    <p className="text-sm text-rose-500 mt-1">
                                        {errors.password.message}
                                    </p>

                                )}
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
                                {loading ? <BasicLoader /> : <p>Sign Up</p>}
                            </Button>
                        </div>

                    </form>
                </CardContent>

            </Card>
            <p className="text-slate-700 text-sm">By signing up, you agree to our <a href="term-of-service" className="text-emerald-600 hover:text-emerald-700"> Terms of Service</a> and <a href="/privacy-policy" className="text-emerald-600 hover:text-emerald-700"> Privacy Policy</a></p>

        </div>
    )
}


export default SignUp;

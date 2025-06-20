import BasicLoader from "@/components/custom/BasicLoader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiCall, type apiResponse } from "@/utils/apiCall"
import { loginSchema } from "@/validations/loginSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileText } from "lucide-react"
import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import z from "zod"




const Login = () => {

    let navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })


    const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (data) => {


        setLoading(true);
        const result: apiResponse = await apiCall("/login", "post", "noauth", data);

        if (result.success) {
            if (typeof result.data == "string") {
                sessionStorage.setItem("token", result.data);
                toast.success(result.message);
                setLoading(false);
                navigate(`/dashboard`);
            }

        }
        else {
            toast.error(result.message);
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
                    <CardTitle className="text-2xl font-bold text-center text-slate-900">Welcome Back</CardTitle>
                    <CardDescription className="text-center text-slate-600">
                        Enter your email and passord to login
                    </CardDescription>

                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} >
                        <div className="flex flex-col space-y-6">

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
                                {loading ? <BasicLoader /> : <p>Login</p>}
                            </Button>
                        </div>

                    </form>
                </CardContent>

            </Card>
            <p className="text-slate-700 text-sm">By Signing In up, you agree to our <a href="term-of-service" className="text-emerald-600 hover:text-emerald-700"> Terms of Service</a> and <a href="/privacy-policy" className="text-emerald-600 hover:text-emerald-700"> Privacy Policy</a></p>

        </div>
    )
}

export default Login;
import BasicLoader from "@/components/custom/Loaders/BasicLoader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/Context/userContext";
import type { UserLoginFormData } from "@/types/user";
import { apiCall } from "@/utils/api/apiCall";
import { loginSchema } from "@/validations/user/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";

import { toast } from "sonner";

const Login = () => {
  const { setToken } = useUser();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: UserLoginFormData) => {
      return await apiCall<string, UserLoginFormData>(
        "/login",
        "POST",
        "noauth",
        formData
      );
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<UserLoginFormData> = async (formData) => {
    mutate(formData, {
      onSuccess: (response) => {
        if (response.success) {
          const token = response.data;

          setToken(token);

          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      },
      onError: (error: any) => {
        console.error("Registration failed:", error.message);
        toast.error("Registration failed: " + error.message);
      },
    });
  };

  return (
    <div className=" min-h-screen  flex flex-col items-center gap-8 justify-center">
      <div className="flex items-center gap-2 ">
        <div className="bg-blue-500 rounded-md p-2 flex items-center jusify-center">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl text-slate-900 font-bold">InvoDrop</h1>
      </div>

      {/* //signup card  */}

      <Card className="w-120 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-center text-slate-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-slate-600">
            Enter your email and passord to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-6">
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700 mb-1"
                >
                  Email address
                </Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="example@example.com"
                  className="h-11 border-gray-200 placeholder:text-slate-700 focus-visible:ring-blue-500"
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
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700 mb-1"
                  >
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="h-11 border-gray-200 focus-visible:ring-blue-500 placeholder:text-slate-700"
                  placeholder="Enter your password"
                  required
                />
                {errors.password && (
                  <p className="text-sm text-rose-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isPending ? <BasicLoader /> : <p>Login</p>}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-slate-500 text-sm">
            Dont't have an Account ?{" "}
            <Link
              to="/sign-up"
              className="text-sm text-blue-900 font-medium underline"
            >
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
      <p className="text-slate-700 text-sm">
        By Loging In up, you agree to our{" "}
        <a
          href="term-of-service"
          className="text-blue-600 hover:text-blue-700"
        >
          {" "}
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy-policy"
          className="text-blue-600 hover:text-blue-700"
        >
          {" "}
          Privacy Policy
        </a>
      </p>
    </div>
  );
};

export default Login;

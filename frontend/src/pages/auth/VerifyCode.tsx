import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiCall } from "@/utils/api/apiCall";
import BasicLoader from "@/components/custom/Loaders/BasicLoader";
import { toast } from "sonner";
import { verificationCodeSchema } from "@/validations/user/verificationCodeSchema";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { UserVerificationData } from "@/types/user";

const VerifyCode = () => {
  const navigate = useNavigate();

  const { emailAddress } = useParams();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: UserVerificationData) => {
      return await apiCall<null, UserVerificationData>(
        "/verify-code",
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
  } = useForm<UserVerificationData>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      email: emailAddress,
      verifyCode: "",
    },
  });

  const onSubmit: SubmitHandler<UserVerificationData> = async (formData) => {
    mutate(formData, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success(response.message);
          navigate(`/login`);
        } else {
          toast.error(response.message || "Something went wrong");
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
      {/* //Verification Code card  */}

      <Card className="w-120 shadow-xl border-none ">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-center text-slate-900">
            Verify Code{" "}
          </CardTitle>
          <CardDescription className="text-center text-slate-600 mt-1">
            Enter the verifycode we sent to your email{" "}
            <span className="font-semibold underline">{emailAddress}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-6">
              <div>
                <div className="flex items-center">
                  <Label
                    htmlFor="verifyCode"
                    className="text-sm font-medium text-slate-700 mb-1"
                  >
                    Verification Code
                  </Label>
                </div>
                <Input
                  id="verifyCode"
                  type="text"
                  {...register("verifyCode")}
                  className="h-11 border-gray-200 focus-visible:ring-blue-500 placeholder:text-slate-700"
                  placeholder="Enter the 6 digit verify code"
                  required
                />
                {errors.verifyCode && (
                  <p className="text-sm text-rose-500 mt-1">
                    {errors.verifyCode.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isPending ? <BasicLoader /> : <p>Verify Code</p>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyCode;

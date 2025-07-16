import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { OnBoardingDataType } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/validations/user/onBoardingSchema";
import { apiCall } from "@/utils/api/apiCall";
import BasicLoader2 from "../Loaders/BasicLoader2";
import { CheckIcon, X } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import BasicLoader from "../Loaders/BasicLoader";
import { useUser } from "@/Context/userContext";
import { useNavigate } from "react-router-dom";

const OnBoardingCarousel = () => {
  const navigate = useNavigate();

  const { user, setUser } = useUser();
  const [step, setStep] = useState(0);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLogoUploaded, setIsLogoUploaded] = useState<boolean>(false);

  const handleLogoUpload = async (file: File) => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiCall<string, FormData>(
        "/upload-company-logo",
        "POST",
        "protected",
        formData
      );

      if (response.success) {
        setValue("logoUrl", response.data);
        setIsLogoUploaded(true);
      } else {
        toast.error("Failed to Upload Logo");
      }
    } catch (error) {
      console.log("Failed to Upload Logo");
    } finally {
      setIsUploading(false);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: OnBoardingDataType) => {
      return await apiCall("/add-user-company", "POST", "protected", data);
    },
  });

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<OnBoardingDataType>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      termsAndConditions:
        "Please make the payment by the due date mentioned on this invoice. If you have any questions, feel free to contact us. Thank you!",
      invoiceNumberFormat: "INV-",
      defaultNote:
        "Thank you for your business. We look forward to working with you again!",
    },
  });

  const onSubmit: SubmitHandler<OnBoardingDataType> = async (data) => {
    mutate(data, {
      onSuccess: (response) => {
        if (response.success) {
          if (user) {
            setUser({ ...user, isCompanyAdded: true });
          }

          toast.success(response.message);
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
  const onError = (errors: any) => {
    console.error(" Zod Validation Errors:", errors);
    toast.error("Form Error Please check your inputs.");
  };

  const next = () => setStep((s) => Math.min(s + 1, 2));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div
      className="min-h-screen flex justify-center items-center 
   px-4"
    >
      <Button
      className="absolute top-4 left-4"
        variant="ghost"
        onClick={() => {
          navigate("/");
        }}
      >
        <X className="w-10 h-10 text-rose-500 " />
      </Button>

      <Card
        className="w-full max-w-xl shadow-md  
    "
      >
        <CardHeader>
          <CardTitle className="text-4xl text-slate-800 font-bold">
            {step === 0
              ? "Company Details"
              : step === 1
              ? "Address Details"
              : "App Preferences"}
          </CardTitle>
          <CardDescription>
            {step === 0
              ? "Enter you company name and upload your logo"
              : step === 1
              ? "Enter your company address"
              : "Customize invoice settings"}
          </CardDescription>
        </CardHeader>

        <CardContent className=" relative h-[350px] overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <div className="flex flex-col gap-4  items-start p-6">
                    <div className="flex flex-col">
                      <Label
                        htmlFor="uploadCompanyLogo"
                        className="text-slate-700 text-md mb-2"
                      >
                        Upload Company Logo
                      </Label>

                      <div className="flex flex-col gap-2">
                        {isUploading ? (
                          <BasicLoader2 />
                        ) : isLogoUploaded ? (
                          <div className="flex items-center justify-between w-full gap-2 border p-1 rounded-md bg-blue-50 text-green-800 shadow-sm">
                            <div className="flex items-center gap-2">
                              <CheckIcon className="w-5 h-5 text-green-600" />
                              <span>Logo successfully uploaded</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setIsLogoUploaded(false);
                                setValue("logoUrl", "");
                              }}
                              className="text-blue-500"
                            >
                              Upload Again
                            </Button>
                          </div>
                        ) : (
                          <Input
                            id="uploadCompanyLogo"
                            type="file"
                            className="w-full cursor-pointer  border-dashed border-2 border-blue-300 p-2 text-sm"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleLogoUpload(file);
                              }
                            }}
                          />
                        )}

                        <p className="text-xs text-slate-500">
                          JPG, GIF or PNG. Max size 10MB.
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="companyName"
                        className="text-slate-700 text-md mb-2"
                      >
                        Company Name
                      </Label>
                      <Input
                        {...register("name")}
                        id="companyName"
                        placeholder="Your company name"
                        className="w-md"
                      />
                      {errors.name && (
                        <p className="text-sm text-rose-500 mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="taxId"
                        className="text-slate-700 text-md mb-2"
                      >
                        Tax Id{" "}
                        <span className="text-slate-500">(optional)</span>
                      </Label>
                      <Input
                        {...register("taxId")}
                        id="taxId"
                        placeholder="VAT registered, GST registered, etc."
                        className="w-md"
                      />
                      {errors.taxId && (
                        <p className="text-sm text-rose-500 mt-1">
                          {errors.taxId.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <div className="space-y-4 p-6  ">
                    <div>
                      <Label
                        htmlFor="phoneNumber"
                        className="text-slate-700 mb-2"
                      >
                        Phone Number
                      </Label>
                      <Input
                        {...register("phoneNumber")}
                        id="phoneNumber"
                        placeholder="+91 1234567890"
                      />
                      {errors.phoneNumber && (
                        <p className="text-sm text-rose-500 mt-1">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="street" className="text-slate-700 mb-2">
                        Street Address
                      </Label>
                      <Input
                        {...register("streetAddress")}
                        id="street"
                        placeholder="123 Main St"
                      />
                      {errors.streetAddress && (
                        <p className="text-sm text-rose-500 mt-1">
                          {errors.streetAddress.message}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label htmlFor="city" className="text-slate-700  mb-2">
                          City
                        </Label>
                        <Input
                          {...register("city")}
                          id="city"
                          placeholder="City"
                        />
                        {errors.city && (
                          <p className="text-sm text-rose-500 mt-1">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="state" className="text-slate-700  mb-2">
                          State
                        </Label>
                        <Input
                          {...register("state")}
                          id="state"
                          placeholder="State"
                        />
                        {errors.state && (
                          <p className="text-sm text-rose-500 mt-1">
                            {errors.state.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label
                          htmlFor="country"
                          className="text-slate-700  mb-2"
                        >
                          Country
                        </Label>
                        <Input
                          id="country"
                          {...register("country")}
                          placeholder="Country"
                        />
                        {errors.country && (
                          <p className="text-sm text-rose-500 mt-1">
                            {errors.country.message}
                          </p>
                        )}
                      </div>
                      <div className="flex-1">
                        <Label
                          htmlFor="pinCode"
                          className="text-slate-700  mb-2"
                        >
                          Pin Code
                        </Label>
                        <Input
                          id="pinCode"
                          placeholder="123456"
                          {...register("pinCode")}
                        />
                        {errors.pinCode && (
                          <p className="text-sm text-rose-500 mt-1">
                            {errors.pinCode.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <div className="p-6 flex flex-col gap-4">
                    <div>
                      <Label
                        htmlFor="invoiceNumberFormat"
                        className="text-slate-700 mb-2"
                      >
                        Invoice Number Format
                      </Label>
                      <Input
                        defaultValue={getValues("invoiceNumberFormat")}
                        {...register("invoiceNumberFormat")}
                        id="invoiceNumberFormat"
                        placeholder="Your company name"
                      />
                      {errors.invoiceNumberFormat && (
                        <p className="text-sm text-rose-500 mt-1">
                          {errors.invoiceNumberFormat.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="termsAndConditions"
                        className="text-slate-700 mb-2"
                      >
                        Terms and Conditions
                      </Label>
                      <Textarea
                        defaultValue={getValues("termsAndConditions")}
                        {...register("termsAndConditions")}
                        id="termsAndConditions"
                        placeholder="Your payment terms"
                      />
                      {errors.termsAndConditions && (
                        <p className="text-sm text-rose-500 mt-1">
                          {errors.termsAndConditions.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="defualtNote"
                        className="text-slate-700 mb-2"
                      >
                        Default Note{" "}
                        <span className="text-slate-500">
                          (Printed at the footer of every invoice)
                        </span>
                      </Label>
                      <Textarea
                        {...register("defaultNote")}
                        defaultValue={getValues("defaultNote")}
                        id="defaultNote"
                        placeholder="Your default note"
                      />
                      {errors.defaultNote && (
                        <p className="text-sm text-rose-500 mt-1">
                          {errors.defaultNote.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full ${
                  step === i ? "bg-blue-600" : "bg-slate-300"
                }`}
              />
            ))}
          </div>

          <div className="flex  justify-between w-full">
            <Button variant="outline" onClick={back} disabled={step === 0}>
              Back
            </Button>
            {step < 2 ? (
              <Button
                variant="outline"
                onClick={next}
                className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
              >
                Next
              </Button>
            ) : (
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  disabled={isPending}
                  onClick={handleSubmit(onSubmit)}
                >
                  {" "}
                  {isPending ? (
                    <div>
                      <BasicLoader />
                    </div>
                  ) : (
                    <span> Skip For Now</span>
                  )}
                </Button>
                <Button
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubmit(onSubmit, onError)}
                >
                  {isPending ? (
                    <div>
                      <BasicLoader />
                    </div>
                  ) : (
                    <span> Finish</span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnBoardingCarousel;

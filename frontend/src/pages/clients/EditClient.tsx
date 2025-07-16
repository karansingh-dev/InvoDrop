import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addClientSchema as ClientSchema } from "@/validations/client/addClientSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { type NewClientDataType as ClientDataType } from "@/types/client";
import { useParams } from "react-router-dom";
import getOneClient from "@/utils/api/client/getOneClient";
import BasicLoader2 from "@/components/custom/Loaders/BasicLoader2";
import onError from "@/utils/zodErrorHandler";
import { useMutate } from "@/utils/mutate/useMutate";

export default function EditClient() {
  let navigate = useNavigate();
  const params = useParams();

  const { clientId } = params;

  const { mutateAsync, isPending: isUpdated } = useMutate<null, ClientDataType>(
    `/edit-client/${clientId}`,
    "PUT",
    "protected"
  );

  const {
    data: clientData,
    isPending,
    isFetched,
  } = useQuery({
    queryFn: async () => getOneClient(clientId!),
    queryKey: ["client"],
    enabled: !!clientId,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ClientDataType>({
    resolver: zodResolver(ClientSchema),
  });
  const [statusValue, setStatusValue] = useState<string>("active");

  useEffect(() => {
    if (isFetched) {
      if (clientData) {
        reset(clientData);
        setStatusValue(clientData.status ? "active" : "inactive");
      }
    }
  }, [isPending, isFetched, clientData]);

  const handleSelectChange = (value: string) => {
    setStatusValue(value);
    setValue("status", statusValueToBoolean(value));
  };

  const statusValueToBoolean = (value: string) => value === "active";

  const onSubmit: SubmitHandler<ClientDataType> = async (data) => {
    try {
      const response = await mutateAsync(data);

      if (response.success) {
        navigate(`/clients`);
        toast.success(response.message);
      } else {
        navigate(`/clients`);
        toast.error(response.message);
      }
    } catch (error) {
      console.error("failed updating client");
      toast.error("Failed to Update Client");
      throw error;
    }
  };

  if (!isFetched || isPending)
    return (
      <div className="flex justify-center items-center gap-2">
        <BasicLoader2 />
      </div>
    );

  return (
    <div className=" min-h-screen flex flex-col">
      {/* header section  */}
      <header className="flex items-center justify-between px-6 bg-[#F7F7F7] h-14  sticky top-0">
        <div className="flex gap-4 items-center">
          <Button
            variant="ghost"
            onClick={() => {
              navigate("/clients");
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <h1 className="text-lg font-bold text-slate-900">Edit Client</h1>
        </div>

        <Button
          variant="outline"
          type="submit"
          form="clientForm"
          className=" bg-blue-500 hover:bg-blue-600 hover:text-white"
        >
          {isUpdated ? (
            <Loader2 className="animate-spin w-12 h-12 text-white" />
          ) : (
            <div className="flex justify-center items-center gap-2 text-white">
              <Save className="h-4 w-4" />
              <span className="text-md">Update Client</span>
            </div>
          )}
        </Button>
      </header>

      {/* main section  */}

      <main className="flex justify-center p-6">
        <form id="clientForm" onSubmit={handleSubmit(onSubmit, onError)}>
          <Card className="rounded-md w-200 py-0">
            <CardHeader className="mt-5">
              <CardTitle>
                <h3 className="text-4xl  font-bold">Client Information</h3>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {/* company information  */}
                <div className="flex flex-col gap-6">
                  <h3 className="text-xl  font-medium">Company Information</h3>
                  <div className="">
                    <Label
                      htmlFor="companyName"
                      className="text-sm font-medium text-slate-700"
                    >
                      Company Name<span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      {...register("companyName")}
                      id="companyName"
                      type="text"
                      className="mt-1"
                    />
                    {errors.companyName && (
                      <p className="text-sm text-rose-500 mt-1">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* primary Contact  */}

                <div className="flex flex-col gap-6">
                  <h3 className="text-xl text-slate-900 font-medium">
                    Primary Contact
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="">
                      <Label
                        htmlFor="contactPersonName"
                        className="text-sm font-medium text-slate-700"
                      >
                        Contact Name<span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        {...register("contactPersonName")}
                        id="contactPersonName"
                        type="text"
                        className="mt-1"
                      />
                      {errors.contactPersonName && (
                        <p className="text-sm text-rose-500 mt-1">
                          {errors.contactPersonName.message}
                        </p>
                      )}
                    </div>

                    <div className="">
                      <Label
                        htmlFor="emailAddress"
                        className="text-sm font-medium text-slate-700"
                      >
                        Email Address<span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        {...register("email")}
                        id="emailAddress"
                        type="text"
                        className="mt-1"
                      />
                      {errors.email && (
                        <p className="text-sm text-rose-500 mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="">
                      <Label
                        htmlFor="phoneNumber"
                        className="text-sm font-medium text-slate-700"
                      >
                        Phone Number<span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        {...register("phoneNumber")}
                        id="phoneNumber"
                        type="tel"
                        className="mt-1"
                      />
                      {errors.phoneNumber && (
                        <p className="text-sm text-rose-500 mt-1">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                    <div className="">
                      <Label
                        htmlFor="status"
                        className="text-sm font-medium text-slate-700"
                      >
                        Status<span className="text-rose-500">*</span>
                      </Label>
                      <Select
                        value={statusValue}
                        onValueChange={(value) => {
                          handleSelectChange(value);
                        }}
                      >
                        <SelectTrigger
                          id="status"
                          className="mt-1 bg-white w-full"
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.status && (
                        <p className="text-sm text-rose-500 mt-1">
                          {errors.status.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address section  */}

                <div className="flex flex-col gap-6">
                  <h3 className="text-xl text-slate-900 font-medium">
                    Address
                  </h3>

                  <div>
                    <div className="">
                      <Label
                        htmlFor="streetAddress"
                        className="text-sm font-medium text-slate-700"
                      >
                        Street Address<span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        {...register("streetAddress")}
                        id="streetAddress"
                        type="text"
                        className="mt-1"
                      />
                      {errors.streetAddress && (
                        <p className="text-sm text-rose-500 mt-1">
                          {errors.streetAddress.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="">
                      <Label
                        htmlFor="city"
                        className="text-sm font-medium text-slate-700"
                      >
                        City<span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        {...register("city")}
                        id="city"
                        type="text"
                        className="mt-1"
                      />
                      {errors.city && (
                        <p className="text-sm text-rose-500 mt-1">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div className="">
                      <Label
                        htmlFor="state"
                        className="text-sm font-medium text-slate-700"
                      >
                        State<span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        {...register("state")}
                        id="state"
                        type="text"
                        className="mt-1"
                      />
                      {errors.state && (
                        <p className="text-sm text-rose-500 mt-1">
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                    <div className="">
                      <Label
                        htmlFor="pinCode"
                        className="text-sm fon3t-medium text-slate-700"
                      >
                        Pin Code<span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        {...register("pinCode")}
                        id="pincode"
                        type="text"
                        className="mt-1"
                      />
                      {errors.pinCode && (
                        <p className="text-sm text-rose-500 mt-1">
                          {errors.pinCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="">
                    <Label
                      htmlFor="country"
                      className="text-sm font-medium text-slate-700"
                    >
                      Country<span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      {...register("country")}
                      id="country"
                      type="text"
                      className="mt-1"
                    />
                    {errors.country && (
                      <p className="text-sm text-rose-500 mt-1">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-100 border-t border-gray-200 flex h-16 justify-between items-center">
              <Button
                variant="outline"
                disabled={isPending}
                className="relative bottom-3"
                onClick={() => {
                  navigate("/clients");
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                form="clientForm"
                variant="outline"
                className=" relative bottom-3 text-white bg-blue-500 hover:bg-blue-600 hover:text-white"
              >
                {isUpdated ? (
                  <Loader2 className="animate-spin w-12 h-12 text-white" />
                ) : (
                  <div className="flex justify-center gap-2 items-center text-white">
                    <Save className="h-4 w-4" />
                    <span className="text-md">Update Client</span>
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </main>
    </div>
  );
}

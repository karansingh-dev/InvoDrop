import BasicLoader from "@/components/custom/Loaders/BasicLoader";
import Header from "@/components/custom/Header";
import SideBar from "@/components/custom/Sidebar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/Context/userContext";
import { Save } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { UserPasswordDateType, UserUpdateFormData } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "@/validations/user/updateUserSchema";
import { passwordSchema } from "@/validations/user/passwordSchema";
import { useMutation } from "@tanstack/react-query";
import { apiCall } from "@/utils/api/apiCall";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

type Tabs = "profile" | "company";

export function Settings() {
  const { space } = useParams();
  console.log(space);
  const { user, isLoading } = useUser();
  const [activeTab, setActiveTab] = useState<Tabs>(
    (space as Tabs) || ("profile" as Tabs)
  );

  const {
    register: userUpdateForm,
    handleSubmit: handleUserUpdateForm,
    getValues: userUpdatevalues,
    formState: { errors: userUpdateFormErrors },
  } = useForm<UserUpdateFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  const { mutate: userUpdateFormMutation, isPending: updatingUserDetails } =
    useMutation({
      mutationFn: async (formData: UserUpdateFormData) => {
        return await apiCall<null, UserUpdateFormData>(
          "/update-user-data",
          "PUT",
          "protected",
          formData
        );
      },
    });

  const {
    mutate: updateUserPasswordMutation,
    isPending: updatingUserPassword,
  } = useMutation({
    mutationFn: async (formData: UserPasswordDateType) => {
      return await apiCall<null, UserPasswordDateType>(
        "/update-user-password",
        "PUT",
        "protected",
        formData
      );
    },
  });
  const onUpdateUserForm: SubmitHandler<UserUpdateFormData> = async (data) => {
    userUpdateFormMutation(data, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error(response.message || "Something went wrong");
        }
      },
      onError: (error: any) => {
        console.error("Failed to Update User details:", error.message);
        toast.error("Failed to Update User details: " + error.message);
      },
    });
  };

  const {
    register: passwordUpdateForm,
    handleSubmit: handlePasswordUpdateForm,
    formState: { errors: passwordUpdateFormErrors },
    setValue: updatePasswordFormValues,
  } = useForm<UserPasswordDateType>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onUpdatePassword: SubmitHandler<UserPasswordDateType> = async (
    data
  ) => {
    updateUserPasswordMutation(data, {
      onSuccess: (response) => {
        if (response.success) {
          updatePasswordFormValues("confirmNewPassword", "");
          updatePasswordFormValues("newPassword", "");
          updatePasswordFormValues("currentPassword", "");
          toast.success(response.message);
        } else {
          toast.error(response.message || "Something went wrong");
        }
      },
      onError: (error: any) => {
        console.error("Failed to Update User Password:", error.message);
        toast.error("Failed to Update User Password: " + error.message);
      },
    });
  };

  return (
    <div className=" min-h-screen flex">
      <SideBar />
      <div className="flex flex-col w-full">
        <Header />

        <main className="flex flex-col p-6 gap-6 ">
          {/* //header part  */}

          <div className="">
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(tab) => {
              setActiveTab(tab as Tabs);
            }}
            className="w-full  "
          >
            <TabsList className="grid w-full grid-cols-2 rounded-sm h-10 ">
              <TabsTrigger value="profile" className="rounded-sm">
                Profile
              </TabsTrigger>
              <TabsTrigger value="company" className="rounded-sm">
                Company
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent
              value="profile"
              className="mt-4 space-y-6"
              id="profile"
            >
              <Card className="rounded-sm space-y-2">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>

                {isLoading ? (
                  <div className="h-30 flex justify-item items-center">
                    <BasicLoader />
                  </div>
                ) : (
                  <CardContent>
                    <form
                      className="space-y-6"
                      onSubmit={handleUserUpdateForm(onUpdateUserForm)}
                    >
                      <div className="grid gap-4 grid-cols-2">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            required
                            {...userUpdateForm("firstName")}
                            id="firstName"
                            defaultValue={userUpdatevalues("firstName")}
                            className="mt-1 bg-white"
                          />
                          {userUpdateFormErrors.firstName && (
                            <p className="text-sm text-rose-500 mt-1">
                              {userUpdateFormErrors.firstName.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            required
                            {...userUpdateForm("lastName")}
                            id="lastName"
                            defaultValue={userUpdatevalues("lastName")}
                            className="mt-1 bg-white"
                          />
                          {userUpdateFormErrors.lastName && (
                            <p className="text-sm text-rose-500 mt-1">
                              {userUpdateFormErrors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          required
                          {...userUpdateForm("email")}
                          id="email"
                          type="email"
                          defaultValue={userUpdatevalues("email")}
                          className="mt-1 bg-white"
                        />
                        {userUpdateFormErrors.email && (
                          <p className="text-sm text-rose-500 mt-1">
                            {userUpdateFormErrors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          className="text-white bg-blue-600 hover:text-white hover:bg-blue-700"
                          type="submit"
                          disabled={updatingUserDetails}
                        >
                          {updatingUserDetails ? (
                            <BasicLoader />
                          ) : (
                            <div className="flex items-center gap-2">
                              <Save className="w-4 h-4" />
                              <span>Save Changes</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                )}
              </Card>

              <Card className="rounded-sm space-y-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Update Password</CardTitle>
                  <CardDescription>Update your Password</CardDescription>
                </CardHeader>

                <CardContent>
                  <form
                    onSubmit={handlePasswordUpdateForm(onUpdatePassword)}
                    className="space-y-6"
                  >
                    <div>
                      <Label htmlFor="email">Current Password</Label>
                      <Input
                        required
                        {...passwordUpdateForm("currentPassword")}
                        id="currentPassword"
                        type="password"
                        className="mt-1 bg-white"
                      />
                      {passwordUpdateFormErrors.currentPassword && (
                        <p className="text-sm text-rose-500 mt-1">
                          {passwordUpdateFormErrors.currentPassword.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email"> New Password </Label>
                      <Input
                        required
                        {...passwordUpdateForm("newPassword")}
                        id="newPassword"
                        type="password"
                        className="mt-1 bg-white"
                      />
                      {passwordUpdateFormErrors.newPassword && (
                        <p className="text-sm text-rose-500 mt-1">
                          {passwordUpdateFormErrors.newPassword.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Confirm New Password</Label>
                      <Input
                        required
                        {...passwordUpdateForm("confirmNewPassword")}
                        id="confirmNewPassword"
                        type="password"
                        className="mt-1 bg-white"
                      />
                      {passwordUpdateFormErrors.confirmNewPassword && (
                        <p className="text-sm text-rose-500 mt-1">
                          {passwordUpdateFormErrors.confirmNewPassword.message}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="text-white bg-blue-600 hover:text-white hover:bg-blue-700"
                      type="submit"
                      disabled={updatingUserPassword}
                    >
                      {updatingUserPassword ? (
                        <BasicLoader />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          <span>Update Password</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent
              value="company"
              className="mt-4 space-y-6"
              id="company"
            >
              hello
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

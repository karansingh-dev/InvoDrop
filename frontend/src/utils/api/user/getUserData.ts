import type { UserDetailsType } from "@/types/user";
import { apiCall } from "../apiCall";

export const getUserData = async () => {
  try {
    console.log("running")
    const response = await apiCall<UserDetailsType>(
      "/get-user-data",
      "GET",
      "protected"
    );
    if (response.success) return response.data;
    else return null;
  } catch (error) {
    throw error;
  }
};

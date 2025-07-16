import { apiCall } from "../apiCall";
import { type ClientsDataType } from "@/types/client";

export default async function getClients() {
  try {
    const response = await apiCall<ClientsDataType[]>(
      "/get-clients",
      "GET",
      "protected"
    );
    if (response.success) return response.data;
    return [];
  } catch (error) {
    console.log("error getting Client");
    throw error;
  }
}

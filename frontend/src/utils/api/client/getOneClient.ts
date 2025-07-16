import { apiCall } from "../apiCall";
import { type NewClientDataType as ClientDataType } from "@/types/client";

export default async function getOneClient(clientId: string) {
  try {
    const response = await apiCall<ClientDataType>(
      `/get-client/${clientId}`,
      "GET",
      "protected"
    );
    if(response.success) return response.data;
    return undefined;
  } catch (error) {
    console.log("error getting Client");
    throw error;
  }
}

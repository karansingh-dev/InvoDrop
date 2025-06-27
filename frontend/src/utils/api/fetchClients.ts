import type { clientsDataType } from "@/components/custom/ClientCard";
import { apiCall } from "./apiCall"




export async function fetchClients() {

    const result = await apiCall<clientsDataType[]>("/get-clients", "GET", "protected");



    return result.data;


}
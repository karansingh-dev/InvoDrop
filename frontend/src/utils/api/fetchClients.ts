import type { clientsDataType } from "@/components/custom/ClientCard";
import { apiCall } from "./apiCall"




export async function fetchClients() {

    const result = await apiCall<clientsDataType[]>("/get-clients", "GET", "protected");

if(result.data === undefined) throw new Error("Failed to fetch clients");


    return result.data;


}
import { apiCall } from "./apiCall"





export const fetchClients = async () => {

    const result = await apiCall("/get-clients", "get", "auth");

    if (result.success) {
        return result.data;
    }





}
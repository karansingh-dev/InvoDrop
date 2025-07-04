import { apiCall } from "./apiCall"


export type oneClientDataType = {
    id: string
    companyName: string;
    contactPersonName: string;
    phoneNumber: string,
    status: boolean,
    email: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    pinCode:string

}


export async function fetchOneClient(clientId:string) {

    const result = await apiCall<oneClientDataType>(`/get-one-client/${clientId}`, "GET", "protected");

    if (result.data === undefined) throw new Error("Failed to fetch client");

    return result.data;


}
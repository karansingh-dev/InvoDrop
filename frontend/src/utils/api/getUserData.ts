import { apiCall } from "./apiCall";




export const getUserData = async () => {


    const result = await apiCall<{
        firstName: string,
        lastName: string,
        email: string
    }>("/get-user-data", "GET", "protected");

    return result.data;




}
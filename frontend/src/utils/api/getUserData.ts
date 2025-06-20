import { apiCall } from "./apiCall";




export const getUserData = async () => {


    const result = await apiCall("/get-user-data", "get", "auth");

    if (result.success) {
        return result.data;
    }
    return;




}
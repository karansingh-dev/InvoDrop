import axios from "axios"

const baseUrl = "http://localhost:5000/invodrop"

type methods = "get" | "post" | "put" | "delete"
type auth = "noauth" | "auth"


export const apiCall = async (path: string, method: methods, auth: auth,data?:object, token?: string) => {

    if (auth == "noauth") {
        const response = await axios[method](`${baseUrl}${path}`, data,{
            headers: {
                "Content-Type": "application/json"
            }

        })

        return response.data;

    }
    const response = await axios[method](`${baseUrl}${path}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }

    })

    return response.data;



}
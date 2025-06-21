import axios, { AxiosError } from "axios"


const baseUrl = "http://localhost:5000/invodrop"

type methods = "get" | "post" | "put" | "delete"
type auth = "noauth" | "auth"

export interface apiResponse {
    success: boolean,
    message: string,
    data: object | object[] | string
}

export const apiCall = async (path: string, method: methods, auth: auth, data?: object | object[]) => {

    if (auth == "noauth") {
        try {


            if (data) {
                const response = await axios[method](`${baseUrl}${path}`, data, {
                    headers: {
                        "Content-Type": "application/json",

                    }
                })
                const result = response.data;

                return result;

            }
            else {
                const response = await axios[method](`${baseUrl}${path}`, {
                    headers: {
                        "Content-Type": "application/json",

                    }
                })
                const result = response.data;

                return result

            }




        } catch (error) {

            if (error instanceof AxiosError) {
                console.log(error)

                return error.response?.data;
            }

        }
    }

    else if (auth == "auth") {
        try {

            const token = sessionStorage.getItem("token");


            if (data) {
                const response = await axios[method](`${baseUrl}${path}`, data, {
                    headers: {
                        "Authorization": `Bearer ${token}`

                    }
                })

                const result = response.data;
                return result;

            }
            else {
                const response = await axios[method](`${baseUrl}${path}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`

                    }
                })

                const result = response.data;
                return result;


            }


        } catch (error) {

            if (error instanceof AxiosError) {

                return error.response?.data;
            }

        }



    }



}


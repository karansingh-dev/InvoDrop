export const baseUrl = "http://localhost:5000/invodrop";


type methods = "POST" | "GET" | "PUT" | "DELETE"
type authType = "noauth" | "protected"


type apiResponse<t> = {
    success: boolean,
    message: string,
    data: t
}

export const apiCall = async<t>(route: string, method: methods, auth: authType, data?: any): Promise<apiResponse<t>> => {



    const headers: HeadersInit = {
        "Content-Type": "application/json"
    }

    if (auth == "protected") {
        const token = sessionStorage.getItem("token");
        headers["Authorization"] = `Bearer ${token}`;

    }

    const config: RequestInit = {
        method,
        headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }


    const response = await fetch(`${baseUrl}${route}`, config);
    const result = await response.json();

    return result;
}
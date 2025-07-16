import { useMutation } from "@tanstack/react-query";
import { apiCall, type apiResponse } from "../api/apiCall";

export function useMutate<TResponse, TRequest>(
  route: string,
  method: "POST" | "PUT" | "DELETE" = "POST",
  authType: "noauth" | "protected" = "protected"
) {
  return useMutation<apiResponse<TResponse>, Error, TRequest>({
    mutationFn: async (formData: TRequest) => {
      return await apiCall<TResponse, TRequest>(
        route,
        method,
        authType,
        formData
      );
    },
  });
}

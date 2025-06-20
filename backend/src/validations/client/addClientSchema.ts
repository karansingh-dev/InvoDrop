import z from "zod";

export const addClientSchema = z.object({
    companyName: z.string().min(1, "Company name must be at least 1 character").max(200, "Company name must at most 200 characters"),
    contactPersonName: z.string().min(1, "Contact Person name must be at least 1 character").max(200, "Contact Peron name must at most 150 characters"),
    phoneNumber: z.string().min(1, "Phone Number be at least 10 character").max(200, "Company name must at most 20 characters"),
    email: z.string().email(),
    status:z.boolean(),
    streetAddress: z.string().min(5, "Street Address must be at least 5 characters").max(100, "Street Address must be at most 100 characters"),
    city: z.string().min(1, "city name must be at least 1 characters").max(50, "city name must be at most 50 characters"),
    state: z.string().min(1, "State name must be at least 1 characters").max(50, "state name must be at most 50 characters"),
    country: z.string().min(1, "Country Name must be at least 1 characters").max(50, "Country name must be at most 50 characters"),
    pinCode: z.string().min(6, "Pin Code must be at least 6 characters").max(8, "Pin Code must be at most 50 characters"),


})
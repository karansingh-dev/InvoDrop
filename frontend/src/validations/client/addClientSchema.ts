import z from "zod";

export const addClientSchema = z.object({
  companyName: z
    .string()
    .nonempty("Company name is required")
    .max(200, "Company name must be at most 200 characters"),
  contactPersonName: z
    .string()
    .nonempty("Contact person name is required")
    .max(150, "Contact person name must be at most 150 characters"),
  phoneNumber: z
    .string()
    .nonempty("Phone number is required")
    .min(10, "Phone number must be at least 10 characters")
    .max(20, "Phone number must be at most 20 characters"),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Must be a valid email address"),
  status: z.boolean(),
  streetAddress: z
    .string()
    .nonempty("Street address is required")
    .min(5, "Street address must be at least 5 characters")
    .max(100, "Street address must be at most 100 characters"),
  city: z
    .string()
    .nonempty("City is required")
    .max(50, "City name must be at most 50 characters"),
  state: z
    .string()
    .nonempty("State is required")
    .max(50, "State name must be at most 50 characters"),
  country: z
    .string()
    .nonempty("Country is required")
    .max(50, "Country name must be at most 50 characters"),
  pinCode: z
    .string()
    .nonempty("Pin code is required")
    .min(6, "Pin code must be at least 6 characters")
    .max(8, "Pin code must be at most 8 characters"),
});

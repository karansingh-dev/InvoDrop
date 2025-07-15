import { z } from "zod";

export const onboardingSchema = z.object({
  name: z
    .string()
    .max(100, { message: "Name must be at most 100 characters long" })
    .nonempty({ message: "Name is required" }),

  streetAddress: z
    .string()
    .max(255, { message: "Street address must be at most 255 characters long" })
    .nonempty({ message: "Street address is required" }),

  city: z
    .string()
    .max(100, { message: "City name must be at most 100 characters long" })
    .nonempty({ message: "City is required" }),

  state: z
    .string()
    .max(100, { message: "State name must be at most 100 characters long" })
    .nonempty({ message: "State is required" }),

  country: z
    .string()
    .max(100, { message: "Country name must be at most 100 characters long" })
    .nonempty({ message: "Country is required" }),

  pinCode: z
    .string()
    .max(10, { message: "Pin code must be at most 10 characters long" })
    .regex(/^[a-zA-Z0-9\- ]+$/, {
      message:
        "Pin code must contain only letters, numbers, spaces, or hyphens",
    })
    .nonempty({ message: "Pin code is required" }),

  logoUrl: z.string().url({ message: "Logo must be a valid URL" }).nonempty(),
  phoneNumber: z
    .string()
    .min(1, "Phone Number be at least 10 character")
    .max(200, "Company name must at most 20 characters"),

  taxId: z
    .string()

    .max(50, { message: "Tax ID must be at most 50 characters long" })
    .regex(/^[a-zA-Z0-9\-]+$/, {
      message: "Tax ID must contain only letters, numbers, or hyphens",
    })
    .optional(),

  termsAndConditions: z
    .string()
    .max(5000, { message: "Terms and conditions too long" }),
  

  defaultNote: z
    .string()
    .max(1000, { message: "Default note must be at most 1000 characters" })
  ,

  invoiceNumberFormat: z
    .string()
    .min(3, { message: "Invoice number format is required" })
    .max(100, { message: "Invoice number format is too long" })
    .nonempty({ message: "Invoice number format is required" }),
});

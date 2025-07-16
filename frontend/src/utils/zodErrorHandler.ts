import { toast } from "sonner";

export default function onError(errors: any) {
  console.error(" Zod Validation Errors:", errors);
  toast.error("Form Error Please check your inputs.");
}

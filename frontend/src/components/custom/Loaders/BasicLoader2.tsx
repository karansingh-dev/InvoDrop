import { LoaderCircle } from "lucide-react";

export default function BasicLoader2() {
  return (
    <div className="flex flex-col items-center gap-4 text-blue-500 animate-pulse">
      <LoaderCircle className="w-10 h-10 animate-spin" />
    </div>
  );
}

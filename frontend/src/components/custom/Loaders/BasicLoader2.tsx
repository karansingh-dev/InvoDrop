import { Loader2 } from "lucide-react";

export default function BasicLoader2() {
  return (
    <div className="flex flex-col items-center gap-4 text-blue-500 animate-pulse">
      <Loader2 className="animate-spin w-12 h-12 text-white" />
    </div>
  );
}

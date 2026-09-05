import { DISCLAIMER } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function DisclaimerBanner({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "border-b border-amber-400/20 bg-amber-500/10 px-4 py-2 text-center text-xs font-medium tracking-wide text-amber-100 sm:text-sm",
        className,
      )}
    >
      {DISCLAIMER}
    </div>
  );
}

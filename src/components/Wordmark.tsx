import Image from "next/image";
import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  /** Renders a larger lockup for loading / hero contexts. */
  size?: "sm" | "md" | "lg";
}

export function Wordmark({ className, size = "md" }: WordmarkProps) {
  const dimensions = {
    sm: "h-7 w-[89px]",
    md: "h-8 w-[102px] md:h-9 md:w-[115px]",
    lg: "h-14 w-[179px] md:h-16 md:w-[204px]",
  }[size];

  return (
    <span
      className={cn("relative inline-flex shrink-0 select-none", dimensions, className)}
      aria-label="UP! Store"
    >
      <Image
        src="/brand/upstore-wordmark.webp"
        alt="UP! Store"
        width={1155}
        height={362}
        priority
        className="h-full w-full object-contain"
        sizes={size === "lg" ? "204px" : "115px"}
      />
    </span>
  );
}

export default Wordmark;

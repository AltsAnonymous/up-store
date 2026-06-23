import Image from "next/image";
import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  /** Renders a larger lockup for loading / hero contexts. */
  size?: "sm" | "md" | "lg";
}

export function Wordmark({ className, size = "md" }: WordmarkProps) {
  const dimensions = {
    sm: "h-8 w-28",
    md: "h-9 w-32 md:h-10 md:w-36",
    lg: "h-20 w-64 md:h-24 md:w-80",
  }[size];

  return (
    <span
      className={cn("relative inline-flex shrink-0 select-none", dimensions, className)}
      aria-label="UP! Store"
    >
      <Image
        src="/brand/upstore-wordmark.webp"
        alt="UP! Store"
        width={1024}
        height={340}
        priority
        className="h-full w-full object-contain"
        sizes={size === "lg" ? "320px" : "144px"}
      />
    </span>
  );
}

export default Wordmark;

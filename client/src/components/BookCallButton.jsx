import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BOOKING_URL } from "@/lib/contact";
import { cn } from "@/lib/utils";

export function BookCallButton({
  variant = "secondary",
  size = "lg",
  className,
}) {
  return (
    <Button size={size} variant={variant} className={cn(className)} asChild>
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2"
      >
        <CalendarDays className="h-4 w-4" />
        Book a discovery call
      </a>
    </Button>
  );
}

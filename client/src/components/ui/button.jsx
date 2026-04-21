import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:brightness-110 shadow-[0_8px_24px_-10px_hsl(var(--primary)/0.7)] dark:shadow-neon-cyan",
        secondary:
          "bg-secondary text-secondary-foreground hover:brightness-110 shadow-[0_8px_24px_-10px_hsl(var(--secondary)/0.7)] dark:shadow-neon-purple",
        outline:
          "border-2 border-foreground/20 bg-background/40 backdrop-blur text-foreground hover:border-primary hover:text-primary",
        ghost:
          "text-foreground hover:bg-muted",
        destructive:
          "bg-destructive text-destructive-foreground hover:brightness-110",
        pop:
          "bg-accent text-accent-foreground border-2 border-foreground shadow-pop hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))]",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

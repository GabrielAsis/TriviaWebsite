import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"


const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm lg:text-lg font-medium transition-all cursor-pointer disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 ",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/80",
        destructive:
          "bg-red-600 text-white shadow-xs hover:bg-red-600/80 focus-visible:ring-destructive/20 ",
        outline:
          "border-2 border-primary text-primary bg-background shadow-xs hover:bg-off-white",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent/20 hover:text-accent-foreground",
        ghost2:
          "border-2 border-white/0 bg-off-white text-primary hover:border-primary hover:border-2",
        link: "text-primary underline-offset-4 hover:underline",
        // white variants
        white:
          "bg-white text-primary shadow-xs hover:bg-white/90",
        whiteOutline:
          "border-white border-2 bg-none text-white shadow-xs hover:bg-white/10",
      },
      size: {
        default: "h-10 px-4 py-2 ",
        sm: "h-8 gap-1.5 px-3",
        lg: "h-9 px-3 ",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }

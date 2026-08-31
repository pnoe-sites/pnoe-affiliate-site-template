import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[14px] text-base font-medium transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-glow focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-deep-forest text-white shadow-[0_18px_45px_rgba(5,15,10,0.45)] hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(5,15,10,0.55)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_18px_45px_rgba(5,15,10,0.3)] hover:-translate-y-1",
        outline:
          "border border-forest-green/60 text-forest-green bg-transparent shadow-[0_18px_45px_rgba(5,15,10,0.15)] hover:bg-forest-green hover:text-white hover:-translate-y-1",
        secondary:
          "bg-forest-green text-white shadow-[0_18px_45px_rgba(5,15,10,0.4)] hover:-translate-y-1",
        ghost: "text-forest-green hover:text-deep-forest",
        link: "text-lime-glow underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-md px-4 text-sm",
        lg: "h-14 rounded-lg px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }


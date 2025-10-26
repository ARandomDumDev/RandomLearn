import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost"
  size?: "default" | "sm"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

    const variantStyles = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    }

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-sm",
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ""}`}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button }

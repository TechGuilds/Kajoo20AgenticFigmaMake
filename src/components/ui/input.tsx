import * as React from "react";

import { cn } from "./utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
          "flex h-10 w-full min-w-0 rounded-md border border-input-border bg-input px-3 py-2 text-base text-foreground",
          "transition-[border-color,box-shadow] outline-none",
          "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "focus:border-ring focus:ring-2 focus:ring-ring/20",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
          "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
          "md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
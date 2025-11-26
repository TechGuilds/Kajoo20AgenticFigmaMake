import * as React from "react";

import { cn } from "./utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        data-slot="textarea"
        className={cn(
          "resize-none placeholder:text-muted-foreground text-foreground",
          "flex field-sizing-content min-h-20 w-full rounded-md border border-input-border bg-input px-3 py-2 text-base",
          "transition-[border-color,box-shadow] outline-none",
          "focus:border-ring focus:ring-2 focus:ring-ring/20",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
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

Textarea.displayName = "Textarea";

export { Textarea };
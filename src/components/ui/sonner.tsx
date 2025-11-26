"use client";

import { useTheme } from "next-themes@0.4.6";
import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      expand={false}
      visibleToasts={3}
      duration={3500}
      pauseWhenPageIsHidden
      closeButton
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "kajoo-toast",
          title: "kajoo-toast-title",
          description: "kajoo-toast-description",
          actionButton: "kajoo-toast-action",
          cancelButton: "kajoo-toast-cancel",
          closeButton: "kajoo-toast-close",
          success: "kajoo-toast-success",
          error: "kajoo-toast-error",
          warning: "kajoo-toast-warning",
          info: "kajoo-toast-info",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

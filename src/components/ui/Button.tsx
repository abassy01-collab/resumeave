"use client";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2 text-sm",
        variant === "primary" && "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
        variant === "secondary" && "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
        variant === "ghost" && "text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:ring-gray-300",
        variant === "danger" && "text-red-600 hover:bg-red-50 focus:ring-red-300",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
  options: string[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, placeholder, options, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {placeholder && (
        <option value="">{placeholder}</option>
      )}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
);
Select.displayName = "Select";

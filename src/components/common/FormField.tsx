import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { Input } from "./Input";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  helperText?: string;
  as?: "input" | "textarea" | "select";
  options?: { label: string; value: string }[];
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  helperText,
  as = "input",
  options = [],
  ...props
}) => {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  if (as === "textarea") {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          {...field}
          {...props}
          className={cn(
            "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          )}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
      </div>
    );
  }

  if (as === "select") {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          {...field}
          {...props}
          className={cn(
            "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          )}
        >
          <option value="">Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
      </div>
    );
  }

  return (
    <Input
      {...field}
      {...props}
      label={label}
      error={error?.message}
      helperText={helperText}
    />
  );
};

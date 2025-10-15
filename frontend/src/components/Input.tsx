import React, { forwardRef } from "react";


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string; 
  className?: string;
  // fullWidth?: boolean;  // Optional CSS/Tailwind classes
}


export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, className, ...rest }, ref) => {
    return (
      <input
        ref={ref}                 // Attach the ref from parent for direct access (like focus)
        placeholder={placeholder} // Display placeholder text
        className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}     // Apply custom CSS or Tailwind classes if provided
        {...rest}                 // Spread all other input props (like type, value, onChange, etc.)
      />
    );
  }
);

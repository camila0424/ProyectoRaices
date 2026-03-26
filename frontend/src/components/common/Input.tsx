import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    iconLeft?: ReactNode;
    className?: string; // clases extra si se necesita
}

const Input = ({ label, error, iconLeft, className = "", ...props }: InputProps) => {
    return (
        <div className={`flex flex-col w-full ${className}`}>
            {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}

            <div className="relative">
                {iconLeft && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{iconLeft}</span>}
                <input
                    className={`
            w-full border rounded-md px-3 py-2 text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
            ${iconLeft ? "pl-10" : ""}
            ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
                    {...props}
                />
            </div>

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Input;
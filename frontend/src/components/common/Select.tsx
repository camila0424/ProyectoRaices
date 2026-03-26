import type { SelectHTMLAttributes, ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    iconLeft?: ReactNode;
    className?: string;
}

const Select = ({ label, error, iconLeft, className = "", children, ...props }: SelectProps) => {
    return (
        <div className={`flex flex-col w-full ${className}`}>
            {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}

            <div className="relative">
                {iconLeft && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{iconLeft}</span>}
                <select
                    className={`
            w-full border rounded-md px-3 py-2 text-gray-900
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
            ${iconLeft ? "pl-10" : ""}
            ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none
          `}
                    {...props}
                >
                    {children}
                </select>

                {/* Icono de flecha hacia abajo */}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ▼
                </span>
            </div>

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Select;
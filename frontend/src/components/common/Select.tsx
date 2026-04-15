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
            {label && <label className="mb-1 text-sm font-medium text-[#1E1B4B]">{label}</label>}

            <div className="relative">
                {iconLeft && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{iconLeft}</span>}
                <select
                    className={`
            w-full border border-[#E5E3DC] rounded-lg px-3 py-2 text-[#1E1B4B]
            focus:outline-none focus:ring-2 focus:ring-[#C7D2FE] focus:border-[#4F46E5]
            ${iconLeft ? "pl-10" : ""}
            ${error ? "border-red-400 focus:ring-red-200" : ""}
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

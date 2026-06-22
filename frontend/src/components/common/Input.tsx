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
            {label && <label className="mb-1 text-sm font-medium text-[#1F2A44]">{label}</label>}

            <div className="relative">
                {iconLeft && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{iconLeft}</span>}
                <input
                    className={`
            w-full border border-[#E8D9C4] rounded-lg px-3 py-2
            text-[#1F2A44] placeholder-[#9CA3AF] bg-white
            focus:outline-none focus:ring-2 focus:ring-[#E8A33D]
            focus:border-[#C1502E]
            ${iconLeft ? "pl-10" : ""}
            ${error ? "border-red-400 focus:ring-red-200" : ""}
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

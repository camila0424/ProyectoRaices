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
            {label && <label className="mb-1 text-sm font-medium text-[#1E1B4B]">{label}</label>}

            <div className="relative">
                {iconLeft && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{iconLeft}</span>}
                <input
                    className={`
            w-full border border-[#E5E3DC] rounded-lg px-3 py-2
            text-[#1E1B4B] placeholder-[#9CA3AF] bg-white
            focus:outline-none focus:ring-2 focus:ring-[#C7D2FE]
            focus:border-[#4F46E5]
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

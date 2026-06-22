import type { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    className?: string;
}

const TextArea = ({ label, error, className = "", ...props }: TextAreaProps) => {
    return (
        <div className={`flex flex-col w-full ${className}`}>
            {label && <label className="mb-1 text-sm font-medium text-[#1F2A44]">{label}</label>}

            <textarea
                className={`
          w-full border border-[#E8D9C4] rounded-lg px-3 py-2
          text-[#1F2A44] placeholder-[#9CA3AF] bg-white
          focus:outline-none focus:ring-2 focus:ring-[#E8A33D]
          focus:border-[#C1502E]
          ${error ? "border-red-400 focus:ring-red-200" : ""}
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-none
        `}
                {...props}
            />

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default TextArea;

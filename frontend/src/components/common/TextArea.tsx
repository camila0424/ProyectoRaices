import type { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    className?: string;
}

const TextArea = ({ label, error, className = "", ...props }: TextAreaProps) => {
    return (
        <div className={`flex flex-col w-full ${className}`}>
            {label && <label className="mb-1 text-sm font-medium text-[#1E1B4B]">{label}</label>}

            <textarea
                className={`
          w-full border border-[#E5E3DC] rounded-lg px-3 py-2
          text-[#1E1B4B] placeholder-[#9CA3AF] bg-white
          focus:outline-none focus:ring-2 focus:ring-[#C7D2FE]
          focus:border-[#4F46E5]
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

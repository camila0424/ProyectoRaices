import type { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    className?: string;
}

const TextArea = ({ label, error, className = "", ...props }: TextAreaProps) => {
    return (
        <div className={`flex flex-col w-full ${className}`}>
            {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}

            <textarea
                className={`
          w-full border rounded-md px-3 py-2 text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
          ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
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
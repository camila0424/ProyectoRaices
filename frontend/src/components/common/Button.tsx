import type { ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
    children: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    className?: string; // para estilos extra
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
}

const variantClasses = {
    primary:   "bg-[#4F46E5] text-white hover:bg-[#4338CA] focus:ring-2 focus:ring-[#C7D2FE]",
    secondary: "bg-[#F1F0EB] text-[#1E1B4B] hover:bg-[#E5E3DC] focus:ring-2 focus:ring-[#E5E3DC]",
    outline:   "border border-[#E5E3DC] text-[#1E1B4B] hover:bg-[#F1F0EB] focus:ring-2 focus:ring-[#E5E3DC]",
};

const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
};

const Button = ({
    children,
    onClick,
    variant = "primary",
    size = "md",
    disabled = false,
    className = "",
    iconLeft,
    iconRight,
}: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        inline-flex items-center justify-center font-medium rounded-md transition
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
        >
            {iconLeft && <span className="mr-2">{iconLeft}</span>}
            {children}
            {iconRight && <span className="ml-2">{iconRight}</span>}
        </button>
    );
};

export default Button;
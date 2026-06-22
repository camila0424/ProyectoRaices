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
    primary:   "bg-[#C1502E] text-white hover:bg-[#A6401F] focus:ring-2 focus:ring-[#E8A33D]",
    secondary: "bg-[#EDE1CE] text-[#1F2A44] hover:bg-[#E8D9C4] focus:ring-2 focus:ring-[#E8D9C4]",
    outline:   "border border-[#E8D9C4] text-[#1F2A44] hover:bg-[#EDE1CE] focus:ring-2 focus:ring-[#E8D9C4]",
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

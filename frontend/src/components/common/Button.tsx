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
    primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400",
    outline: "border border-gray-400 text-gray-900 hover:bg-gray-100 focus:ring-2 focus:ring-gray-400",
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
import type { ReactNode } from "react";
//import Button from "./Button";//

interface CardProps {
    title: string;
    subtitle?: string;
    description?: string;
    image?: string; // URL de la imagen o logo
    children?: ReactNode; // para botones u otros elementos
    badge?: string;
    className?: string;
}

const Card = ({ title, subtitle, description, image, badge, children, className = "" }: CardProps) => {
    return (
        <div className={`bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 ${className}`}>
            {image && (
                <div className="w-full h-40 sm:h-48 overflow-hidden">
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                </div>
            )}

            <div className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                    </div>
                    {badge && (
                        <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {badge}
                        </span>
                    )}
                </div>

                {description && <p className="text-sm text-gray-700">{description}</p>}

                {children && <div className="mt-2 flex gap-2">{children}</div>}
            </div>
        </div>
    );
};

export default Card;
import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
    children: ReactNode;
    className?: string;
}

const Layout = ({ children, className = "" }: LayoutProps) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
            {/* Header fijo en la parte superior */}
            <Header />

            {/* Main content */}
            <main className={`flex-1 w-full  py-6 ${className}`}>
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Layout;
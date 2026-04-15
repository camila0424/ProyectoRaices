import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
    children: ReactNode;
    className?: string;
}

function Layout({ children, className = "" }: LayoutProps) {
    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--bg-main)" }}>
            <Header />
            <main className={`flex-1 w-full ${className}`}>
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
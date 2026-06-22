import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Footer from "./Footer";

interface AuthLayoutProps {
    children: ReactNode;
    className?: string;
}

function AuthLayout({ children, className = "" }: AuthLayoutProps) {
    const { logout, usuario } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    const handleCerrarSesion = () => {
        logout();
        window.location.href = "/";
    };

    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--bg-main)" }}>
            <header
                className="fixed top-0 left-0 w-full z-50 border-b border-[#E8D9C4]"
                style={{ backgroundColor: "var(--bg-header)" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                            <img src="/logo.jpeg" alt="Hausseup" className="h-10 w-auto" />
                        </Link>

                        <div className="flex items-center gap-3">
                            {usuario && (
                                <span className="text-[#6B7280] text-sm hidden sm:block">
                                    Hola, <span className="text-[#C1502E] font-medium">{usuario.nombre.split(" ")[0]}</span>
                                </span>
                            )}

                            {/* Theme toggle */}
                            <button
                                onClick={toggleTheme}
                                title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                                className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E8D9C4] hover:bg-[#EDE1CE] transition-all duration-200 text-base"
                            >
                                {isDark ? "☀️" : "🌙"}
                            </button>

                            <button
                                onClick={handleCerrarSesion}
                                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-[#1F2A44] border border-[#E8D9C4] hover:bg-[#EDE1CE] transition-all duration-200"
                            >
                                <span>←</span>
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className={`flex-1 w-full ${className}`}>
                {children}
            </main>

            <Footer />
        </div>
    );
}

export default AuthLayout;

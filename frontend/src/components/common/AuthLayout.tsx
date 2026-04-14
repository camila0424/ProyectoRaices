import type { ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Footer from "./Footer";

interface AuthLayoutProps {
    children: ReactNode;
    className?: string;
}

function AuthLayout({ children, className = "" }: AuthLayoutProps) {
    const navigate = useNavigate();
    const { logout, usuario } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    const handleCerrarSesion = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--bg-main)" }}>
            <header
                className="fixed top-0 left-0 w-full z-50 shadow-lg"
                style={{ backgroundColor: "var(--bg-header)" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-[#1D9E75] flex items-center justify-center">
                                <span className="text-white font-bold font-serif text-base">P</span>
                            </div>
                            <span className="text-white font-semibold font-serif text-base">Parceros</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            {usuario && (
                                <span className="text-gray-300 text-sm hidden sm:block">
                                    Hola, <span className="text-[#1D9E75] font-medium">{usuario.nombre.split(" ")[0]}</span>
                                </span>
                            )}

                            {/* Theme toggle */}
                            <button
                                onClick={toggleTheme}
                                title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                                className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 hover:bg-white/10 transition-all duration-200 text-base"
                            >
                                {isDark ? "☀️" : "🌙"}
                            </button>

                            <button
                                onClick={handleCerrarSesion}
                                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition-all duration-200"
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

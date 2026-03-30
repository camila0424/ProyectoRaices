import type { ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./Footer";

interface AuthLayoutProps {
    children: ReactNode;
    className?: string;
}

function AuthLayout({ children, className = "" }: AuthLayoutProps) {
    const navigate = useNavigate();

    const handleCerrarSesion = () => {
        // TODO: limpiar token/sesión cuando haya backend
        navigate("/");
    };

    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#1e2b25" }}>
            {/* Header autenticado */}
            <header
                className="fixed top-0 left-0 w-full z-50 shadow-lg"
                style={{ backgroundColor: "#1e2b25" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#1D9E75] flex items-center justify-center">
                                <span className="text-white font-bold font-serif text-base">R</span>
                            </div>
                            <span className="text-white font-semibold font-serif text-base">Raíces</span>
                        </Link>

                        {/* Cerrar sesión */}
                        <button
                            onClick={handleCerrarSesion}
                            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition-all duration-200"
                        >
                            <span>←</span>
                            Cerrar sesión
                        </button>
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
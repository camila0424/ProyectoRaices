import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const navLinks = [
    { label: "Cómo funciona", href: "#como-funciona" },
];

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (href: string) => {
        setMenuOpen(false);
        if (window.location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                const el = document.querySelector(href);
                if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 300);
        } else {
            const el = document.querySelector(href);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-[#E8D9C4] ${scrolled ? "shadow-sm" : ""}`}
            style={{ backgroundColor: "var(--bg-header)" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    <Link
                        to="/"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="flex items-center hover:opacity-80 transition-opacity"
                    >
                        <img src="/logo.png" alt="Hausseup" className="h-10 w-auto" />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => handleNavClick(link.href)}
                                className="text-[#6B7280] hover:text-[#1F2A44] text-sm font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer"
                            >
                                {link.label}
                            </button>
                        ))}

                        <button
                            onClick={() => navigate("/busco-empleo")}
                            className="text-[#6B7280] hover:text-[#1F2A44] text-sm font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer"
                        >
                            Empleos
                        </button>

                        <button
                            onClick={() => navigate("/login")}
                            className="px-4 py-1.5 rounded-lg text-sm font-medium text-[#1F2A44] border border-[#E8D9C4] hover:bg-[#EDE1CE] transition-all duration-200"
                        >
                            Iniciar sesión
                        </button>

                        <button
                            onClick={() => navigate("/registro")}
                            className="px-4 py-1.5 rounded-lg text-sm font-medium text-white bg-[#C1502E] hover:bg-[#A6401F] transition-all duration-200"
                        >
                            Registrarme
                        </button>
                    </nav>

                    {/* Mobile right section */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            className="flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-md hover:bg-[#EDE1CE]"
                            onClick={() => setMenuOpen((prev) => !prev)}
                            aria-label="Toggle menu"
                            aria-expanded={menuOpen}
                        >
                            <span className={`block h-0.5 w-5 bg-[#1F2A44] rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                            <span className={`block h-0.5 w-5 bg-[#1F2A44] rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                            <span className={`block h-0.5 w-5 bg-[#1F2A44] rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
                style={{ backgroundColor: "var(--bg-card)" }}
            >
                <nav className="flex flex-col px-4 py-4 gap-1">
                    {navLinks.map((link) => (
                        <button
                            key={link.href}
                            onClick={() => handleNavClick(link.href)}
                            className="text-[#6B7280] hover:text-[#1F2A44] text-sm font-medium text-left py-3 px-3 rounded-lg transition-colors duration-200 hover:bg-[#EDE1CE] bg-transparent border-none cursor-pointer w-full"
                        >
                            {link.label}
                        </button>
                    ))}
                    <button
                        onClick={() => { setMenuOpen(false); navigate("/busco-empleo"); }}
                        className="text-[#6B7280] hover:text-[#1F2A44] text-sm font-medium text-left py-3 px-3 rounded-lg transition-colors duration-200 hover:bg-[#EDE1CE] bg-transparent border-none cursor-pointer w-full"
                    >
                        Empleos
                    </button>

                    <button
                        onClick={() => { setMenuOpen(false); navigate("/login"); }}
                        className="mt-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#1F2A44] text-center border border-[#E8D9C4] hover:bg-[#EDE1CE] transition"
                    >
                        Iniciar sesión
                    </button>

                    <button
                        onClick={() => { setMenuOpen(false); navigate("/registro"); }}
                        className="mt-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white text-center bg-[#C1502E] hover:bg-[#A6401F] transition"
                    >
                        Registrarme
                    </button>
                </nav>
            </div>
        </header>
    );
}

export default Header;

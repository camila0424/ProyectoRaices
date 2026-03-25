import { useState, useEffect } from "react";

const navLinks = [
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Ciudades", href: "#ciudades" },
    { label: "Semillas", href: "#semillas" },
];

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (href: string) => {
        setMenuOpen(false);
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : ""
                }`}
            style={{ backgroundColor: "#1e2b25" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* ✅ Logo (ANTES estaba mal cerrado con </a>) */}
                    <div
                        onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        className="flex items-center gap-3 group cursor-pointer"
                    >
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 transition-transform duration-200 group-hover:scale-105"
                            style={{ backgroundColor: "#2d7a4f" }}
                        >
                            R
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">
                            Raíces
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => handleNavClick(link.href)}
                                className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200 relative group bg-transparent border-none cursor-pointer"
                            >
                                {link.label}
                                <span
                                    className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-200"
                                    style={{ backgroundColor: "#2d7a4f" }}
                                />
                            </button>
                        ))}

                        {/* ✅ Botón Registrarme (ANTES le faltaba el <a>) */}
                        <a
                            href="#registro"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick("#registro");
                            }}
                            className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:scale-105 active:scale-95"
                            style={{ backgroundColor: "#2d7a4f" }}
                        >
                            Registrarme
                        </a>
                    </nav>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-md hover:bg-white/10"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        <span
                            className={`block h-0.5 w-5 bg-white rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""
                                }`}
                        />
                        <span
                            className={`block h-0.5 w-5 bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""
                                }`}
                        />
                        <span
                            className={`block h-0.5 w-5 bg-white rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""
                                }`}
                        />
                    </button>

                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    }`}
                style={{ backgroundColor: "#182320" }}
            >
                <nav className="flex flex-col px-4 py-4 gap-1">
                    {navLinks.map((link) => (
                        <button
                            key={link.href}
                            onClick={() => handleNavClick(link.href)}
                            className="text-gray-300 hover:text-white text-sm font-medium text-left py-3 px-3 rounded-lg transition-colors duration-200 hover:bg-white/10 bg-transparent border-none cursor-pointer w-full"
                        >
                            {link.label}
                        </button>
                    ))}

                    {/* ✅ Botón móvil corregido */}
                    <a
                        href="#registro"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("#registro");
                        }}
                        className="mt-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white text-center hover:brightness-110 active:scale-95"
                        style={{ backgroundColor: "#2d7a4f" }}
                    >
                        Registrarme
                    </a>
                </nav>
            </div>
        </header>
    );
}

export default Header;
import { Play, Mail, MapPin } from "lucide-react";

function Footer() {
    return (
        <footer className="bg-green-950 text-white">
            {/* TOP SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-6 grid gap-10 md:grid-cols-2 lg:grid-cols-4">

                {/* BRAND */}
                <div>
                    <h2 className="text-2xl font-bold">Raíces</h2>
                    <p className="mt-3 text-sm text-green-200 leading-relaxed">
                        Red de oportunidades para la comunidad latina en España.
                        Conectamos talento, empresas y crecimiento profesional.
                    </p>
                </div>

                {/* NAVIGATION */}
                <div>
                    <h3 className="text-sm font-semibold tracking-wide uppercase text-green-300">
                        Navegación
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li>
                            <a href="#como-funciona" className="hover:text-green-400 transition">
                                Cómo funciona
                            </a>
                        </li>
                        <li>
                            <a href="#ciudades" className="hover:text-green-400 transition">
                                Ciudades
                            </a>
                        </li>
                        <li>
                            <a href="#contacto" className="hover:text-green-400 transition">
                                Contacto
                            </a>
                        </li>
                    </ul>
                </div>

                {/* CONTACT */}
                <div>
                    <h3 className="text-sm font-semibold tracking-wide uppercase text-green-300">
                        Contacto
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm text-green-200">
                        <li className="flex items-center gap-2">
                            <Mail size={16} />
                            hola@raices.app
                        </li>
                        <li className="flex items-center gap-2">
                            <MapPin size={16} />
                            España
                        </li>
                    </ul>
                </div>

                {/* CTA */}
                <div>
                    <h3 className="text-sm font-semibold tracking-wide uppercase text-green-300">
                        Comunidad
                    </h3>
                    <p className="mt-3 text-sm text-green-200">
                        Únete a nuestra comunidad y accede a contenido exclusivo para crecer profesionalmente.
                    </p>

                    <a
                        href="#"
                        className="mt-4 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-xl text-sm font-medium shadow-lg"
                    >
                        <Play size={18} />
                        Ver en YouTube
                    </a>
                </div>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-green-800" />

            {/* BOTTOM */}
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-green-400">
                <p>© {new Date().getFullYear()} Raíces. Todos los derechos reservados.</p>

                <div className="flex gap-6">
                    <a href="#" className="hover:text-green-300 transition">
                        Privacidad
                    </a>
                    <a href="#" className="hover:text-green-300 transition">
                        Términos
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
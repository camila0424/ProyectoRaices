import { Link } from "react-router-dom";

function Hero() {
    const countries = [
        { code: "ar", name: "Argentina" },
        { code: "br", name: "Brasil" },
        { code: "cl", name: "Chile" },
        { code: "co", name: "Colombia" },
        { code: "cr", name: "Costa Rica" },
        { code: "sv", name: "El Salvador" },
        { code: "gt", name: "Guatemala" },
        { code: "hn", name: "Honduras" },
        { code: "mx", name: "México" },
        { code: "ni", name: "Nicaragua" },
        { code: "pa", name: "Panamá" },
        { code: "py", name: "Paraguay" },
        { code: "pe", name: "Perú" },
        { code: "uy", name: "Uruguay" },
        { code: "ve", name: "Venezuela" },
    ];

    return (
        <section
            className="relative w-full min-h-screen flex items-start sm:items-center overflow-hidden"
            style={{ backgroundColor: "var(--bg-hero)" }}
        >
            {/* Background blobs */}
            <div className="absolute -top-16 right-10 w-48 h-48 rounded-full bg-[#1a5c42]/50 blur-2xl animate-pulse" />
            <div className="absolute -bottom-12 right-24 w-32 h-32 rounded-full bg-[#1a5c42]/50 blur-2xl animate-pulse delay-300" />

            {/* Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pt-24 pb-10 sm:py-24 md:py-28 flex flex-col">

                {/* Flags */}
                <ul className="flex flex-wrap gap-x-4 gap-y-2 mb-10 sm:mb-12 animate-fade-in">
                    {countries.map(({ code, name }) => (
                        <li
                            key={code}
                            className="flex items-center gap-2 text-xs sm:text-sm"
                            style={{ color: "var(--text-hero-subtle)" }}
                        >
                            <img
                                src={`https://flagcdn.com/w40/${code}.png`}
                                srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
                                alt={name}
                                loading="lazy"
                                className="w-6 h-4 sm:w-8 sm:h-5 object-cover rounded-sm opacity-90"
                            />
                            <span className="hidden sm:inline">{name}</span>
                        </li>
                    ))}
                </ul>

                {/* Title */}
                <h1
                    className="font-serif font-black leading-[1.15] tracking-tight max-w-xl mb-6 sm:mb-8 text-4xl sm:text-5xl md:text-6xl animate-slide-up"
                    style={{ color: "var(--text-hero)" }}
                >
                    Tu próxima{" "}
                    <span className="text-[#3eb489] italic">oportunidad</span>{" "}
                    viene de un paisano
                </h1>

                {/* Subtitle */}
                <p
                    className="max-w-md leading-relaxed mb-10 sm:mb-12 text-base sm:text-lg animate-slide-up delay-200"
                    style={{ color: "var(--text-hero-muted)" }}
                >
                    Red de empleo para hispanos en España.
                    <br />
                    Con dignidad.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 animate-slide-up delay-300">

                    <Link
                        to="/busco-empleo"
                        className="w-full sm:w-auto text-center inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-[#0d3d2b] bg-[#6fcf97] hover:bg-[#5bbf85] transition-all duration-300 shadow-lg hover:scale-[1.03]"
                    >
                        Buscar empleo
                    </Link>

                    <Link
                        to="/publicar-empleo"
                        className="w-full sm:w-auto text-center inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.03]"
                        style={{
                            color: "var(--text-hero)",
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderColor: "var(--border-hero-btn)",
                        }}
                    >
                        Tengo una oportunidad
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default Hero;

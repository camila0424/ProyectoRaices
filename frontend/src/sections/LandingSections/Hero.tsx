function Hero() {
    const countries = [
        { code: "co", name: "Colombia" },
        { code: "mx", name: "México" },
        { code: "pe", name: "Perú" },
        { code: "ve", name: "Venezuela" },
    ];

    return (
        <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#0d3d2b]">
            {/* Background decor */}
            <div className="absolute -top-15 right-[clamp(20px,6vw,80px)] w-[clamp(180px,22vw,320px)] h-[clamp(180px,22vw,320px)] rounded-full bg-[#1a5c42]/50 blur-2xl animate-pulse" />

            <div className="absolute -bottom-10 right-[clamp(120px,18vw,260px)] w-[clamp(100px,13vw,200px)] h-[clamp(100px,13vw,200px)] rounded-full bg-[#1a5c42]/50 blur-2xl animate-pulse delay-300" />

            {/* Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-[clamp(20px,5vw,80px)] py-[clamp(60px,8vw,120px)] flex flex-col justify-center">

                {/* Flags */}
                <ul className="flex flex-wrap gap-x-6 gap-y-3 mb-[clamp(24px,4vw,40px)] animate-fade-in">
                    {countries.map(({ code, name }) => (
                        <li
                            key={code}
                            className="flex items-center gap-2 text-white/80 text-sm md:text-base"
                        >
                            <img
                                src={`https://flagcdn.com/w40/${code}.png`}
                                srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
                                alt={name}
                                className="w-5 h-3.5 object-cover rounded-sm"
                            />
                            {name}
                        </li>
                    ))}
                </ul>

                {/* Title */}
                <h1 className="font-serif font-black leading-[1.1] tracking-tight text-white max-w-2xl mb-[clamp(16px,3vw,28px)] text-[clamp(36px,6vw,72px)] animate-slide-up">
                    Tu próxima{" "}
                    <span className="text-[#3eb489] italic">oportunidad</span>{" "}
                    viene de un paisano
                </h1>

                {/* Subtitle */}
                <p className="text-white/80 max-w-xl leading-relaxed mb-[clamp(28px,4vw,44px)] text-[clamp(14px,1.6vw,18px)] animate-slide-up delay-200">
                    Red de empleo para hispanos en España.
                    <br />
                    Con dignidad.
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4 animate-slide-up delay-300">
                    <a
                        href="#"
                        className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-[#0d3d2b] bg-[#6fcf97] hover:bg-[#5bbf85] transition-all duration-300 shadow-lg hover:scale-[1.03]"
                    >
                        Buscar empleo
                    </a>

                    <a
                        href="#"
                        className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-white border border-white/60 hover:bg-white/10 transition-all duration-300 hover:scale-[1.03]"
                    >
                        Tengo una oportunidad
                    </a>
                </div>
            </div>
        </section>
    );
}

export default Hero;
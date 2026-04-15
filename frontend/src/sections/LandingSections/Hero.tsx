import { Link } from "react-router-dom";
import { paisesOrigen } from "../../data/locationData";

function Hero() {
    return (
        <section
            className="relative w-full min-h-screen flex items-center overflow-hidden"
            style={{ backgroundColor: "var(--bg-hero)" }}
        >
            {/* Background blobs */}
            <div className="absolute -top-16 right-10 w-48 h-48 rounded-full bg-[#C7D2FE]/30 blur-2xl animate-pulse" />
            <div className="absolute -bottom-12 right-24 w-32 h-32 rounded-full bg-[#C7D2FE]/30 blur-2xl animate-pulse delay-300" />

            {/* Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pt-20 pb-20 flex flex-col">

                {/* Eyebrow pill */}
                <div className="inline-flex items-center gap-1.5 bg-[#EEF2FF] text-[#4F46E5] text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full mb-4 sm:mb-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] inline-block" />
                    Red de empleo para latinos en España
                </div>

                {/* Flags */}
                <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 animate-fade-in">
                    {paisesOrigen.map(({ code, name }) => (
                        <div
                            key={code}
                            className="inline-flex items-center gap-1.5 bg-[#F1F0EB] border border-[#E5E3DC] rounded-full px-2.5 py-1 text-xs text-[#312E81]"
                        >
                            <img
                                src={`https://flagcdn.com/w40/${code}.png`}
                                srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
                                alt={name}
                                loading="lazy"
                                className="w-4 h-3 object-cover rounded-sm"
                            />
                            <span className="hidden sm:inline">{name}</span>
                        </div>
                    ))}
                </div>

                {/* Title */}
                <h1
                    className="font-serif font-medium leading-[1.1] tracking-[-0.04em] max-w-xl mb-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl animate-slide-up"
                    style={{ color: "var(--text-hero)" }}
                >
                    Tu próxima{" "}
                    <span className="text-[#4F46E5] italic">oportunidad</span>{" "}
                    viene de un paisano
                </h1>

                {/* Subtitle */}
                <p
                    className="max-w-md leading-relaxed mb-8 text-sm sm:text-base md:text-lg animate-slide-up delay-200"
                    style={{ color: "var(--text-hero-muted)" }}
                >
                    Red de empleo para hispanos en España.
                    <br />
                    Con dignidad.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto animate-slide-up delay-300">

                    <Link
                        to="/busco-empleo"
                        className="w-full sm:w-auto text-center inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all duration-300 shadow-sm hover:scale-[1.02]"
                    >
                        Buscar empleo
                    </Link>

                    <Link
                        to="/registro"
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";

type TipoJornada = "por-hora" | "jornada-completa" | "media-jornada" | "temporal";

interface Anuncio {
    id: string;
    titulo: string;
    sector: string;
    jornada: TipoJornada;
    ciudad: string;
    descripcion: string;
    fechaPublicacion: string;
    candidaturas: number;
}

interface PerfilCandidato {
    id: string;
    nombre: string;
    sector: string;
    ciudad: string;
    disponibilidad: TipoJornada;
    descripcion: string;
}

const jornadaLabel: Record<TipoJornada, string> = {
    "por-hora": "Por horas",
    "jornada-completa": "Jornada completa",
    "media-jornada": "Media jornada",
    temporal: "Temporal",
};

const jornadaColor: Record<TipoJornada, string> = {
    "por-hora": "bg-blue-500/20 text-blue-300",
    "jornada-completa": "bg-green-500/20 text-green-300",
    "media-jornada": "bg-yellow-500/20 text-yellow-300",
    temporal: "bg-orange-500/20 text-orange-300",
};

const anunciosMock: Anuncio[] = [
    {
        id: "1",
        titulo: "Camarero/a de sala",
        sector: "Hostelería",
        jornada: "jornada-completa",
        ciudad: "Madrid",
        descripcion: "Buscamos camarero con experiencia para restaurante en el centro.",
        fechaPublicacion: "Hace 2 días",
        candidaturas: 8,
    },
    {
        id: "2",
        titulo: "Ayudante de barra",
        sector: "Hostelería",
        jornada: "media-jornada",
        ciudad: "Madrid",
        descripcion: "Ayudante de barra para turno de mañana.",
        fechaPublicacion: "Hace 5 días",
        candidaturas: 3,
    },
];

const perfilesMock: PerfilCandidato[] = [
    {
        id: "1",
        nombre: "Carlos M.",
        sector: "Hostelería",
        ciudad: "Madrid",
        disponibilidad: "jornada-completa",
        descripcion: "5 años de experiencia en restaurantes. Disponibilidad inmediata.",
    },
    {
        id: "2",
        nombre: "Ana R.",
        sector: "Hostelería",
        ciudad: "Madrid",
        disponibilidad: "media-jornada",
        descripcion: "Experiencia en cafeterías y catering. Busco media jornada de mañanas.",
    },
    {
        id: "3",
        nombre: "Luis P.",
        sector: "Construcción",
        ciudad: "Madrid",
        disponibilidad: "temporal",
        descripcion: "Peón de construcción con carnet de conducir. Disponible para obras temporales.",
    },
    {
        id: "4",
        nombre: "María G.",
        sector: "Limpieza",
        ciudad: "Madrid",
        disponibilidad: "por-hora",
        descripcion: "Limpieza de hogares y oficinas. Disponible mañanas de lunes a viernes.",
    },
];

type PestanaActiva = "anuncios" | "perfiles";

function EmployerDashboard() {
    const navigate = useNavigate();
    const [pestana, setPestana] = useState<PestanaActiva>("anuncios");

    return (
        <div className="min-h-screen pt-20 pb-12 px-4" style={{ backgroundColor: "#1e2b25" }}>
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-white text-3xl font-bold mb-1">Mi panel</h1>
                        <p className="text-gray-400 text-base">
                            Gestiona tus ofertas y encuentra candidatos disponibles
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/publicar-empleo")}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm hover:brightness-110 transition whitespace-nowrap"
                        style={{ backgroundColor: "#2d7a4f" }}
                    >
                        <span className="text-lg leading-none">+</span>
                        Publicar oferta
                    </button>
                </div>

                {/* Stats rápidas */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Ofertas activas", valor: anunciosMock.length, emoji: "📋" },
                        { label: "Candidaturas totales", valor: anunciosMock.reduce((a, b) => a + b.candidaturas, 0), emoji: "📥" },
                        { label: "Perfiles disponibles", valor: perfilesMock.length, emoji: "👥" },
                        { label: "Ciudad", valor: "Madrid", emoji: "📍" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl p-4 flex flex-col gap-1"
                            style={{ backgroundColor: "#182320" }}
                        >
                            <span className="text-2xl">{stat.emoji}</span>
                            <span className="text-white font-bold text-xl">{stat.valor}</span>
                            <span className="text-gray-400 text-xs">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Pestañas */}
                <div
                    className="flex rounded-xl p-1 mb-6 w-fit"
                    style={{ backgroundColor: "#182320" }}
                >
                    <button
                        onClick={() => setPestana("anuncios")}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${pestana === "anuncios"
                            ? "bg-[#2d7a4f] text-white shadow"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Mis ofertas
                    </button>
                    <button
                        onClick={() => setPestana("perfiles")}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${pestana === "perfiles"
                            ? "bg-[#2d7a4f] text-white shadow"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Perfiles disponibles
                    </button>
                </div>

                {/* Contenido pestañas */}
                {pestana === "anuncios" && (
                    <div className="flex flex-col gap-4">
                        {anunciosMock.map((anuncio) => (
                            <div
                                key={anuncio.id}
                                className="rounded-2xl p-6 border border-white/5"
                                style={{ backgroundColor: "#182320" }}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                    <div>
                                        <h3 className="text-white font-bold text-lg">{anuncio.titulo}</h3>
                                        <p className="text-gray-400 text-sm mt-0.5">
                                            {anuncio.ciudad} · {anuncio.sector}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${jornadaColor[anuncio.jornada]}`}
                                        >
                                            {jornadaLabel[anuncio.jornada]}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm mb-4">{anuncio.descripcion}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>🕐 {anuncio.fechaPublicacion}</span>
                                        <span className="flex items-center gap-1">
                                            <span className="text-[#1D9E75] font-semibold text-sm">
                                                {anuncio.candidaturas}
                                            </span>{" "}
                                            candidaturas
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition">
                                            Editar
                                        </button>
                                        <button className="px-4 py-1.5 rounded-lg text-xs text-white hover:brightness-110 transition" style={{ backgroundColor: "#2d7a4f" }}>
                                            Ver candidatos
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => navigate("/publicar-empleo")}
                            className="rounded-2xl p-6 border border-dashed border-white/10 hover:border-[#1D9E75]/50 text-center transition-all duration-200 group"
                            style={{ backgroundColor: "#182320" }}
                        >
                            <span className="text-3xl block mb-2">+</span>
                            <p className="text-gray-400 group-hover:text-white text-sm font-medium transition">
                                Publicar nueva oferta
                            </p>
                        </button>
                    </div>
                )}

                {pestana === "perfiles" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {perfilesMock.map((perfil) => (
                            <div
                                key={perfil.id}
                                className="rounded-2xl p-6 border border-white/5 hover:border-white/10 transition"
                                style={{ backgroundColor: "#182320" }}
                            >
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="w-11 h-11 rounded-full bg-[#1D9E75]/20 flex items-center justify-center shrink-0">
                                        <span className="text-[#1D9E75] font-bold text-base">
                                            {perfil.nombre.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-bold text-base">{perfil.nombre}</h3>
                                        <p className="text-[#1D9E75] text-sm">{perfil.sector}</p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold shrink-0 ${jornadaColor[perfil.disponibilidad]}`}
                                    >
                                        {jornadaLabel[perfil.disponibilidad]}
                                    </span>
                                </div>

                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    {perfil.descripcion}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">📍 {perfil.ciudad}</span>
                                    <button
                                        className="px-4 py-1.5 rounded-lg text-xs text-white font-medium hover:brightness-110 transition"
                                        style={{ backgroundColor: "#2d7a4f" }}
                                    >
                                        Ver perfil
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmployerDashboard;
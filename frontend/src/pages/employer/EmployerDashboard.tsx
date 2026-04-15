import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const SECTORES = [
    "Hostelería", "Construcción", "Limpieza", "Cuidado de personas",
    "Logística", "Comercio", "Administración", "Tecnología",
    "Agricultura", "Educación", "Salud", "Seguridad", "Otro",
];

type TipoContrato = "full_time" | "part_time" | "temporary" | "freelance" | "internship";


interface Anuncio {
    id: string;
    titulo: string;
    sector: string;
    contract_type: TipoContrato;
    ciudad: string;
    descripcion: string;
    created_at: string;
    applications_count: number;
    status: string;
}

interface PerfilCandidato {
    id: string;
    full_name: string;
    role: string;
    sector?: string;
    ciudad: string;
    bio: string;
    is_available: boolean;
}

const contratoLabel: Record<TipoContrato, string> = {
    full_time: "Jornada completa",
    part_time: "Media jornada",
    temporary: "Temporal",
    freelance: "Freelance",
    internship: "Prácticas",
};

const contratoColor: Record<TipoContrato, string> = {
    full_time: "bg-green-500/20 text-[#A5B4FC]",
    part_time: "bg-yellow-500/20 text-yellow-300",
    temporary: "bg-orange-500/20 text-orange-300",
    freelance: "bg-blue-500/20 text-blue-300",
    internship: "bg-purple-500/20 text-purple-300",
};

type PestanaActiva = "anuncios" | "perfiles";

function EmployerDashboard() {
    const navigate = useNavigate();
    const { logout, usuario } = useAuth();
    const [pestana, setPestana] = useState<PestanaActiva>("anuncios");
    const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
    const [perfiles, setPerfiles] = useState<PerfilCandidato[]>([]);
    const [loading, setLoading] = useState(true);
    const [sectorFiltro, setSectorFiltro] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteAccount = async () => {
        try {
            console.log("usuario completo:", usuario);
            console.log("id a eliminar:", usuario?.id);

            if (!usuario?.id) {
                alert("Error: no se encontró el ID de usuario");
                return;
            }

            const response = await api.delete(`/users/${usuario.id}`);
            console.log("respuesta:", response);

            logout();
            window.location.href = "/";
        } catch (error) {
            console.error("Error eliminando cuenta:", error);
            alert("No se pudo eliminar la cuenta. Intenta de nuevo.");
        }
    };

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                const [misEmpleos, candidatos] = await Promise.all([
                    api.get<Anuncio[]>("/jobs/mis-empleos"),
                    api.get<PerfilCandidato[]>("/users/candidatos"),
                ]);
                setAnuncios(misEmpleos);
                setPerfiles(candidatos);
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    const formatFecha = (fecha: string) => {
        const dias = Math.floor(
            (Date.now() - new Date(fecha).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (dias === 0) return "Hoy";
        if (dias === 1) return "Hace 1 día";
        return `Hace ${dias} días`;
    };

    return (
        <>
        <div className="min-h-screen pt-20 pb-12 px-4" style={{ backgroundColor: "var(--bg-main)" }}>
            <div className="max-w-5xl mx-auto">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-[#1E1B4B] dark:text-white text-3xl font-bold mb-1">Mi panel</h1>
                        <p className="text-[#312E81] dark:text-[#1E1B4B] dark:text-white text-base">
                            Gestiona tus ofertas y encuentra candidatos disponibles
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/publicar-empleo")}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[#1E1B4B] dark:text-white text-sm hover:brightness-110 transition whitespace-nowrap"
                        style={{ backgroundColor: "#4338CA" }}
                    >
                        <span className="text-lg leading-none">+</span>
                        Publicar oferta
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: "Ofertas activas", valor: anuncios.filter(a => a.status === "active").length, emoji: "📋" },
                        { label: "Candidaturas totales", valor: anuncios.reduce((a, b) => a + b.applications_count, 0), emoji: "📥" },
                        { label: "Perfiles disponibles", valor: perfiles.length, emoji: "👥" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl p-4 flex flex-col gap-1"
                            style={{ backgroundColor: "var(--bg-card)" }}
                        >
                            <span className="text-2xl">{stat.emoji}</span>
                            <span className="text-[#1E1B4B] dark:text-white font-bold text-xl">{stat.valor}</span>
                            <span className="text-[#312E81] dark:text-[#1E1B4B] dark:text-white text-xs">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Pestañas */}
                <div className="flex rounded-xl p-1 mb-6 w-fit" style={{ backgroundColor: "var(--bg-card)" }}>
                    <button
                        onClick={() => setPestana("anuncios")}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${pestana === "anuncios" ? "bg-[#4338CA] text-[#1E1B4B] dark:text-white shadow" : "text-[#312E81] dark:text-[#1E1B4B] dark:text-white hover:text-[#1E1B4B] dark:text-white"
                            }`}
                    >
                        Mis ofertas
                    </button>
                    <button
                        onClick={() => setPestana("perfiles")}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${pestana === "perfiles" ? "bg-[#4338CA] text-[#1E1B4B] dark:text-white shadow" : "text-[#312E81] dark:text-[#1E1B4B] dark:text-white hover:text-[#1E1B4B] dark:text-white"
                            }`}
                    >
                        Perfiles disponibles
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : pestana === "anuncios" ? (
                    <div className="flex flex-col gap-4">
                        {anuncios.length === 0 ? (
                            <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "var(--bg-card)" }}>
                                <span className="text-4xl block mb-4">📋</span>
                                <p className="text-[#1E1B4B] dark:text-white font-semibold text-lg mb-2">No tienes ofertas publicadas</p>
                                <p className="text-[#312E81] dark:text-[#1E1B4B] dark:text-white text-sm mb-6">Publica tu primera oferta para encontrar candidatos</p>
                                <button
                                    onClick={() => navigate("/publicar-empleo")}
                                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#1E1B4B] dark:text-white hover:brightness-110 transition"
                                    style={{ backgroundColor: "#4338CA" }}
                                >
                                    Publicar oferta
                                </button>
                            </div>
                        ) : (
                            <>
                                {anuncios.map((anuncio) => (
                                    <div
                                        key={anuncio.id}
                                        className="rounded-2xl p-6 border border-white/5"
                                        style={{ backgroundColor: "var(--bg-card)" }}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                            <div>
                                                <h3 className="text-[#1E1B4B] dark:text-white font-bold text-lg">{anuncio.titulo}</h3>
                                                <p className="text-[#312E81] dark:text-[#1E1B4B] dark:text-white text-sm mt-0.5">{anuncio.ciudad} · {anuncio.sector}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${contratoColor[anuncio.contract_type]}`}>
                                                {contratoLabel[anuncio.contract_type]}
                                            </span>
                                        </div>

                                        <p className="text-[#312E81] dark:text-[#1E1B4B] dark:text-white text-sm mb-4">{anuncio.descripcion}</p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span>🕐 {formatFecha(anuncio.created_at)}</span>
                                                <span>
                                                    <span className="text-[#4F46E5] font-semibold text-sm">{anuncio.applications_count}</span> candidaturas
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="px-4 py-1.5 rounded-lg text-xs text-[#312E81] dark:text-[#1E1B4B] dark:text-white hover:text-[#1E1B4B] dark:text-white border border-[#E5E3DC] dark:border-white/10 hover:border-[#C7D2FE] dark:border-white/20 transition">
                                                    Editar
                                                </button>
                                                <button
                                                    className="px-4 py-1.5 rounded-lg text-xs text-[#1E1B4B] dark:text-white hover:brightness-110 transition"
                                                    style={{ backgroundColor: "#4338CA" }}
                                                >
                                                    Ver candidatos
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => navigate("/publicar-empleo")}
                                    className="rounded-2xl p-6 border border-dashed border-[#E5E3DC] dark:border-white/10 hover:border-[#4F46E5]/50 text-center transition-all duration-200 group"
                                    style={{ backgroundColor: "var(--bg-card)" }}
                                >
                                    <span className="text-3xl block mb-2">+</span>
                                    <p className="text-[#312E81] dark:text-[#1E1B4B] dark:text-white group-hover:text-[#1E1B4B] dark:text-white text-sm font-medium transition">
                                        Publicar nueva oferta
                                    </p>
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Sector pills */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {SECTORES.map((sector) => (
                                <button
                                    key={sector}
                                    onClick={() => setSectorFiltro(prev => prev === sector ? "" : sector)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${sectorFiltro === sector
                                        ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                                        : "bg-white dark:bg-white/5 text-[#1E1B4B] dark:text-white border-[#E5E3DC] dark:border-white/10 hover:border-[#4F46E5]"
                                    }`}
                                >
                                    {sector}
                                </button>
                            ))}
                        </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {perfiles.filter(p => !sectorFiltro || p.sector === sectorFiltro).length === 0 ? (
                            <div className="col-span-2 rounded-2xl p-12 text-center" style={{ backgroundColor: "var(--bg-card)" }}>
                                <span className="text-4xl block mb-4">👥</span>
                                <p className="text-[#1E1B4B] dark:text-white font-semibold text-lg mb-2">No hay candidatos disponibles</p>
                                <p className="text-[#312E81] dark:text-[#1E1B4B] dark:text-white text-sm">Los candidatos aparecerán aquí cuando se registren</p>
                            </div>
                        ) : (
                            perfiles.filter(p => !sectorFiltro || p.sector === sectorFiltro).map((perfil) => (
                                <div
                                    key={perfil.id}
                                    className="rounded-2xl p-6 border border-white/5 hover:border-[#E5E3DC] dark:border-white/10 transition"
                                    style={{ backgroundColor: "var(--bg-card)" }}
                                >
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="w-11 h-11 rounded-full bg-[#4F46E5]/20 flex items-center justify-center shrink-0">
                                            <span className="text-[#4F46E5] font-bold text-base">
                                                {perfil.full_name.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[#1E1B4B] dark:text-white font-bold text-base">{perfil.full_name}</h3>
                                            <p className="text-[#4F46E5] text-sm">{perfil.role}</p>
                                        </div>
                                    </div>

                                    {perfil.bio && (
                                        <p className="text-[#312E81] dark:text-[#1E1B4B] dark:text-white text-sm leading-relaxed mb-4">{perfil.bio}</p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">📍 {perfil.ciudad ?? "España"}</span>
                                        <button
                                            className="px-4 py-1.5 rounded-lg text-xs text-[#1E1B4B] dark:text-white font-medium hover:brightness-110 transition"
                                            style={{ backgroundColor: "#4338CA" }}
                                        >
                                            Ver perfil
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    </>
                )}
                <div className="mt-16 pt-8 border-t border-[#E5E3DC] dark:border-white/10 text-center">
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="text-sm text-red-400 hover:text-red-600 transition-colors underline"
                    >
                        Eliminar mi cuenta
                    </button>
                </div>

            </div>
        </div>

        {showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
                <div className="bg-white dark:bg-[#1e1d35] rounded-2xl p-8 max-w-sm w-full shadow-xl">
                    <h3 className="text-lg font-medium text-[#1E1B4B] dark:text-white mb-2">
                        ¿Eliminar tu cuenta?
                    </h3>
                    <p className="text-sm text-[#6B7280] dark:text-white/70 mb-6">
                        Esta acción es permanente y no se puede deshacer.
                        Se eliminarán todos tus datos y aplicaciones.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-[#E5E3DC] dark:border-white/20 text-sm font-medium text-[#1E1B4B] dark:text-white hover:bg-[#F1F0EB] dark:hover:bg-white/10 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDeleteAccount}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all"
                        >
                            Sí, eliminar
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

export default EmployerDashboard;
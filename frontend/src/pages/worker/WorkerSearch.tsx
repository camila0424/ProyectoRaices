import { useState } from "react";
import { ciudadesEspana } from "../../data/locationData";

const SECTORES = [
    "Hostelería", "Construcción", "Limpieza", "Cuidado de personas",
    "Logística", "Comercio", "Administración", "Tecnología",
    "Agricultura", "Educación", "Salud", "Seguridad", "Otro",
];

type TipoJornada = "por-hora" | "jornada-completa" | "media-jornada" | "temporal";

interface Empleo {
    id: string;
    titulo: string;
    empresa: string;
    ciudad: string;
    provincia: string;
    sector: string;
    jornada: TipoJornada;
    descripcion: string;
    fechaPublicacion: string;
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

// Datos mock para mostrar la UI sin backend
const empleosMock: Empleo[] = [
    {
        id: "1",
        titulo: "Camarero/a de sala",
        empresa: "Restaurante El Patio",
        ciudad: "Madrid",
        provincia: "Madrid",
        sector: "Hostelería",
        jornada: "jornada-completa",
        descripcion: "Buscamos camarero/a con experiencia mínima de 1 año para restaurante en el centro de Madrid.",
        fechaPublicacion: "Hace 2 días",
    },
    {
        id: "2",
        titulo: "Ayudante de cocina",
        empresa: "Hotel Gran Vía",
        ciudad: "Madrid",
        provincia: "Madrid",
        sector: "Hostelería",
        jornada: "media-jornada",
        descripcion: "Incorporación inmediata para ayudante de cocina. Turnos de mañana.",
        fechaPublicacion: "Hace 5 días",
    },
    {
        id: "3",
        titulo: "Peón de construcción",
        empresa: "Obras y Reformas SL",
        ciudad: "Barcelona",
        provincia: "Barcelona",
        sector: "Construcción",
        jornada: "temporal",
        descripcion: "Buscamos peones para obra en Barcelona. Contrato temporal 3 meses con posibilidad de prórroga.",
        fechaPublicacion: "Hace 1 día",
    },
    {
        id: "4",
        titulo: "Cuidador/a de personas mayores",
        empresa: "Familia particular",
        ciudad: "Valencia",
        provincia: "Valencia",
        sector: "Cuidado de personas",
        jornada: "por-hora",
        descripcion: "Se necesita cuidador/a para persona mayor. Horas sueltas por las tardes.",
        fechaPublicacion: "Hace 3 días",
    },
    {
        id: "5",
        titulo: "Repartidor/a logística",
        empresa: "LogiExpress",
        ciudad: "Sevilla",
        provincia: "Sevilla",
        sector: "Logística",
        jornada: "jornada-completa",
        descripcion: "Empresa de logística busca repartidores con carnet B y experiencia en reparto.",
        fechaPublicacion: "Hace 4 días",
    },
    {
        id: "6",
        titulo: "Limpiador/a de oficinas",
        empresa: "CleanPro Services",
        ciudad: "Bilbao",
        provincia: "Bizkaia",
        sector: "Limpieza",
        jornada: "media-jornada",
        descripcion: "Limpieza de oficinas en el centro de Bilbao. Turno de mañana de 7:00 a 11:00.",
        fechaPublicacion: "Hace 6 días",
    },
];

function WorkerSearch() {
    const [sectorSeleccionado, setSectorSeleccionado] = useState("");
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
    const [ciudadSeleccionada, setCiudadSeleccionada] = useState("");

    const ciudadesDisponibles =
        ciudadesEspana.find((p) => p.provincia === provinciaSeleccionada)?.ciudades ?? [];

    const empleosFiltrados = empleosMock.filter((empleo) => {
        const matchSector = sectorSeleccionado ? empleo.sector === sectorSeleccionado : true;
        const matchProvincia = provinciaSeleccionada ? empleo.provincia === provinciaSeleccionada : true;
        const matchCiudad = ciudadSeleccionada ? empleo.ciudad === ciudadSeleccionada : true;
        return matchSector && matchProvincia && matchCiudad;
    });

    const limpiarFiltros = () => {
        setSectorSeleccionado("");
        setProvinciaSeleccionada("");
        setCiudadSeleccionada("");
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-4" style={{ backgroundColor: "#1e2b25" }}>
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-white text-3xl font-bold mb-2">Encuentra tu empleo</h1>
                    <p className="text-gray-400 text-base">
                        Explora oportunidades laborales en España para la comunidad latina
                    </p>
                </div>

                {/* Sectores */}
                <div className="mb-6">
                    <p className="text-gray-300 text-sm font-medium mb-3">Sector</p>
                    <div className="flex flex-wrap gap-2">
                        {SECTORES.map((sector) => (
                            <button
                                key={sector}
                                onClick={() =>
                                    setSectorSeleccionado((prev) => (prev === sector ? "" : sector))
                                }
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${sectorSeleccionado === sector
                                        ? "border-[#1D9E75] bg-[#1D9E75]/20 text-[#1D9E75]"
                                        : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                                    }`}
                            >
                                {sector}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filtros de ubicación */}
                <div
                    className="rounded-2xl p-5 mb-8 flex flex-col sm:flex-row gap-4 items-end"
                    style={{ backgroundColor: "#182320" }}
                >
                    <div className="flex flex-col gap-1 flex-1">
                        <label className="text-sm text-gray-300 font-medium">Provincia</label>
                        <select
                            value={provinciaSeleccionada}
                            onChange={(e) => {
                                setProvinciaSeleccionada(e.target.value);
                                setCiudadSeleccionada("");
                            }}
                            className="w-full rounded-xl px-4 py-2.5 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] appearance-none"
                        >
                            <option value="" className="bg-[#182320]">Todas las provincias</option>
                            {ciudadesEspana.map((p) => (
                                <option key={p.provincia} value={p.provincia} className="bg-[#182320]">
                                    {p.provincia}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1 flex-1">
                        <label className="text-sm text-gray-300 font-medium">Ciudad</label>
                        <select
                            value={ciudadSeleccionada}
                            onChange={(e) => setCiudadSeleccionada(e.target.value)}
                            disabled={!provinciaSeleccionada}
                            className="w-full rounded-xl px-4 py-2.5 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] appearance-none disabled:opacity-40"
                        >
                            <option value="" className="bg-[#182320]">Todas las ciudades</option>
                            {ciudadesDisponibles.map((c) => (
                                <option key={c} value={c} className="bg-[#182320]">
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    {(sectorSeleccionado || provinciaSeleccionada || ciudadSeleccionada) && (
                        <button
                            onClick={limpiarFiltros}
                            className="px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/30 transition whitespace-nowrap"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>

                {/* Resultados */}
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-gray-400 text-sm">
                        <span className="text-white font-semibold">{empleosFiltrados.length}</span>{" "}
                        {empleosFiltrados.length === 1 ? "oferta encontrada" : "ofertas encontradas"}
                    </p>
                </div>

                {empleosFiltrados.length === 0 ? (
                    <div
                        className="rounded-2xl p-12 text-center"
                        style={{ backgroundColor: "#182320" }}
                    >
                        <span className="text-4xl mb-4 block">🔍</span>
                        <p className="text-white font-semibold text-lg mb-2">
                            No hay ofertas con estos filtros
                        </p>
                        <p className="text-gray-400 text-sm">
                            Prueba a cambiar el sector o la ubicación
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {empleosFiltrados.map((empleo) => (
                            <div
                                key={empleo.id}
                                className="rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-200 hover:scale-[1.005]"
                                style={{ backgroundColor: "#182320" }}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                    <div>
                                        <h3 className="text-white font-bold text-lg leading-tight">
                                            {empleo.titulo}
                                        </h3>
                                        <p className="text-[#1D9E75] text-sm font-medium mt-0.5">
                                            {empleo.empresa}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap self-start ${jornadaColor[empleo.jornada]}`}
                                    >
                                        {jornadaLabel[empleo.jornada]}
                                    </span>
                                </div>

                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    {empleo.descripcion}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        📍 {empleo.ciudad}, {empleo.provincia}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        🏷️ {empleo.sector}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        🕐 {empleo.fechaPublicacion}
                                    </span>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <button
                                        className="px-5 py-2 rounded-xl text-sm font-semibold text-white hover:brightness-110 transition"
                                        style={{ backgroundColor: "#2d7a4f" }}
                                    >
                                        Ver oferta
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

export default WorkerSearch;
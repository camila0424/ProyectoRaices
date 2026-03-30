import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ciudadesEspana } from "../../data/locationData";

type TipoJornada = "por-hora" | "jornada-completa" | "media-jornada" | "temporal";

interface FormAnuncio {
    titulo: string;
    sector: string;
    jornada: TipoJornada | "";
    provincia: string;
    ciudad: string;
    descripcion: string;
}

interface FormAnuncioErrors {
    titulo?: string;
    sector?: string;
    jornada?: string;
    provincia?: string;
    ciudad?: string;
    descripcion?: string;
}

const SECTORES = [
    "Hostelería", "Construcción", "Limpieza", "Cuidado de personas",
    "Logística", "Comercio", "Administración", "Tecnología",
    "Agricultura", "Educación", "Salud", "Seguridad", "Otro",
];

const JORNADAS: { value: TipoJornada; label: string; descripcion: string }[] = [
    { value: "por-hora", label: "Por horas", descripcion: "Pago por hora trabajada" },
    { value: "media-jornada", label: "Media jornada", descripcion: "Aprox. 4 horas diarias" },
    { value: "jornada-completa", label: "Jornada completa", descripcion: "8 horas diarias" },
    { value: "temporal", label: "Temporal", descripcion: "Contrato de duración limitada" },
];

const initialForm: FormAnuncio = {
    titulo: "",
    sector: "",
    jornada: "",
    provincia: "",
    ciudad: "",
    descripcion: "",
};

function CreateJob() {
    const navigate = useNavigate();
    const [form, setForm] = useState<FormAnuncio>(initialForm);
    const [errors, setErrors] = useState<FormAnuncioErrors>({});

    const ciudadesDisponibles =
        ciudadesEspana.find((p) => p.provincia === form.provincia)?.ciudades ?? [];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "provincia" ? { ciudad: "" } : {}),
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleJornada = (value: TipoJornada) => {
        setForm((prev) => ({ ...prev, jornada: value }));
        setErrors((prev) => ({ ...prev, jornada: "" }));
    };

    const validate = (): boolean => {
        const newErrors: FormAnuncioErrors = {};
        if (!form.titulo.trim()) newErrors.titulo = "El título es obligatorio";
        if (!form.sector) newErrors.sector = "Selecciona un sector";
        if (!form.jornada) newErrors.jornada = "Selecciona el tipo de jornada";
        if (!form.provincia) newErrors.provincia = "Selecciona una provincia";
        if (!form.ciudad) newErrors.ciudad = "Selecciona una ciudad";
        if (!form.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        // TODO: enviar al backend
        navigate("/dashboard-empleador");
    };

    return (
        <div
            className="min-h-screen pt-20 pb-12 px-4"
            style={{ backgroundColor: "#1e2b25" }}
        >
            <div className="max-w-2xl mx-auto">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition"
                >
                    <span>←</span>
                    Volver al panel
                </button>

                <h1 className="text-white text-3xl font-bold mb-1">Publicar oferta</h1>
                <p className="text-gray-400 text-base mb-8">
                    Completa los detalles para que los candidatos encuentren tu oferta
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl p-8 flex flex-col gap-6"
                    style={{ backgroundColor: "#182320" }}
                >
                    {/* Título */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300 font-medium">Título del puesto</label>
                        <input
                            type="text"
                            name="titulo"
                            value={form.titulo}
                            onChange={handleChange}
                            placeholder="Ej: Camarero/a de sala, Peón de construcción..."
                            className="w-full rounded-xl px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
                        />
                        {errors.titulo && <p className="text-red-400 text-xs">{errors.titulo}</p>}
                    </div>

                    {/* Sector */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300 font-medium">Sector</label>
                        <select
                            name="sector"
                            value={form.sector}
                            onChange={handleChange}
                            className="w-full rounded-xl px-4 py-2.5 bg-[#182320] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] appearance-none"
                        >
                            <option value="" className="bg-[#182320]">Selecciona un sector</option>
                            {SECTORES.map((s) => (
                                <option key={s} value={s} className="bg-[#182320]">{s}</option>
                            ))}
                        </select>
                        {errors.sector && <p className="text-red-400 text-xs">{errors.sector}</p>}
                    </div>

                    {/* Tipo de jornada */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-300 font-medium">Tipo de jornada</label>
                        <div className="grid grid-cols-2 gap-3">
                            {JORNADAS.map((j) => (
                                <button
                                    key={j.value}
                                    type="button"
                                    onClick={() => handleJornada(j.value)}
                                    className={`p-4 rounded-xl border text-left transition-all duration-200 ${form.jornada === j.value
                                            ? "border-[#1D9E75] bg-[#1D9E75]/10"
                                            : "border-white/10 hover:border-white/20"
                                        }`}
                                >
                                    <p className={`text-sm font-semibold ${form.jornada === j.value ? "text-[#1D9E75]" : "text-white"}`}>
                                        {j.label}
                                    </p>
                                    <p className="text-gray-400 text-xs mt-0.5">{j.descripcion}</p>
                                </button>
                            ))}
                        </div>
                        {errors.jornada && <p className="text-red-400 text-xs">{errors.jornada}</p>}
                    </div>

                    {/* Provincia + Ciudad */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-300 font-medium">Provincia</label>
                            <select
                                name="provincia"
                                value={form.provincia}
                                onChange={handleChange}
                                className="w-full rounded-xl px-4 py-2.5 bg-[#182320] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] appearance-none"
                            >
                                <option value="" className="bg-[#182320]">Selecciona provincia</option>
                                {ciudadesEspana.map((p) => (
                                    <option key={p.provincia} value={p.provincia} className="bg-[#182320]">
                                        {p.provincia}
                                    </option>
                                ))}
                            </select>
                            {errors.provincia && <p className="text-red-400 text-xs">{errors.provincia}</p>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-300 font-medium">Ciudad</label>
                            <select
                                name="ciudad"
                                value={form.ciudad}
                                onChange={handleChange}
                                disabled={!form.provincia}
                                className="w-full rounded-xl px-4 py-2.5 bg-[#182320] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] appearance-none disabled:opacity-40"
                            >
                                <option value="" className="bg-[#182320]">Selecciona ciudad</option>
                                {ciudadesDisponibles.map((c) => (
                                    <option key={c} value={c} className="bg-[#182320]">{c}</option>
                                ))}
                            </select>
                            {errors.ciudad && <p className="text-red-400 text-xs">{errors.ciudad}</p>}
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300 font-medium">Descripción del puesto</label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Describe el puesto, requisitos, condiciones, horarios..."
                            className="w-full rounded-xl px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] resize-none"
                        />
                        {errors.descripcion && <p className="text-red-400 text-xs">{errors.descripcion}</p>}
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-3 rounded-xl font-semibold text-gray-400 text-sm border border-white/10 hover:border-white/20 hover:text-white transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl font-semibold text-white text-sm hover:brightness-110 transition"
                            style={{ backgroundColor: "#2d7a4f" }}
                        >
                            Publicar oferta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateJob;
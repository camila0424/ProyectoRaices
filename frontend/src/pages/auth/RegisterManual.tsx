import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ciudadesEspana } from "../../data/locationData";

interface FormState {
    nombre: string;
    telefono: string;
    correo: string;
    contrasena: string;
    provincia: string;
    ciudad: string;
    documento: string;
}

const initialForm: FormState = {
    nombre: "",
    telefono: "",
    correo: "",
    contrasena: "",
    provincia: "",
    ciudad: "",
    documento: "",
};

function RegisterManual() {
    const navigate = useNavigate();
    const [form, setForm] = useState<FormState>(initialForm);
    const [errors, setErrors] = useState<Partial<FormState>>({});

    const ciudadesDisponibles =
        ciudadesEspana.find((p) => p.provincia === form.provincia)?.ciudades ?? [];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "provincia" ? { ciudad: "" } : {}),
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = (): boolean => {
        const newErrors: Partial<FormState> = {};
        if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
        if (!form.telefono.trim()) newErrors.telefono = "El teléfono es obligatorio";
        if (!form.correo.trim()) newErrors.correo = "El correo es obligatorio";
        if (!form.contrasena.trim()) newErrors.contrasena = "La contraseña es obligatoria";
        if (!form.provincia) newErrors.provincia = "Selecciona una provincia";
        if (!form.ciudad) newErrors.ciudad = "Selecciona una ciudad";
        if (!form.documento.trim()) newErrors.documento = "El documento es obligatorio";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        navigate("/registro/tipo");
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-8"
            style={{ backgroundColor: "#1e2b25" }}
        >
            <div
                className="w-full max-w-lg rounded-2xl p-8 shadow-2xl"
                style={{ backgroundColor: "#182320" }}
            >
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#1D9E75] flex items-center justify-center">
                        <span className="text-white font-bold font-serif text-lg">R</span>
                    </div>
                </div>

                <h1 className="text-white text-2xl font-bold text-center mb-1">
                    Crea tu cuenta
                </h1>
                <p className="text-gray-400 text-sm text-center mb-8">
                    Completa tus datos para empezar
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Nombre */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300 font-medium">
                            Nombre completo
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Tu nombre"
                            className="w-full rounded-xl px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
                        />
                        {errors.nombre && (
                            <p className="text-red-400 text-xs mt-0.5">{errors.nombre}</p>
                        )}
                    </div>

                    {/* Teléfono + Correo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-300 font-medium">Teléfono</label>
                            <input
                                type="tel"
                                name="telefono"
                                value={form.telefono}
                                onChange={handleChange}
                                placeholder="+34 600 000 000"
                                className="w-full rounded-xl px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
                            />
                            {errors.telefono && (
                                <p className="text-red-400 text-xs mt-0.5">{errors.telefono}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-300 font-medium">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                name="correo"
                                value={form.correo}
                                onChange={handleChange}
                                placeholder="tu@correo.com"
                                className="w-full rounded-xl px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
                            />
                            {errors.correo && (
                                <p className="text-red-400 text-xs mt-0.5">{errors.correo}</p>
                            )}
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300 font-medium">Contraseña</label>
                        <input
                            type="password"
                            name="contrasena"
                            value={form.contrasena}
                            onChange={handleChange}
                            placeholder="Mínimo 8 caracteres"
                            className="w-full rounded-xl px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
                        />
                        {errors.contrasena && (
                            <p className="text-red-400 text-xs mt-0.5">{errors.contrasena}</p>
                        )}
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
                            {errors.provincia && (
                                <p className="text-red-400 text-xs mt-0.5">{errors.provincia}</p>
                            )}
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
                                    <option key={c} value={c} className="bg-[#182320]">
                                        {c}
                                    </option>
                                ))}
                            </select>
                            {errors.ciudad && (
                                <p className="text-red-400 text-xs mt-0.5">{errors.ciudad}</p>
                            )}
                        </div>
                    </div>

                    {/* Documento */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300 font-medium">
                            Documento de identidad
                        </label>
                        <input
                            type="text"
                            name="documento"
                            value={form.documento}
                            onChange={handleChange}
                            placeholder="NIE, DNI o Pasaporte"
                            className="w-full rounded-xl px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
                        />
                        {errors.documento && (
                            <p className="text-red-400 text-xs mt-0.5">{errors.documento}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="mt-2 w-full py-3 rounded-xl font-semibold text-white text-sm hover:brightness-110 transition"
                        style={{ backgroundColor: "#2d7a4f" }}
                    >
                        Continuar
                    </button>
                </form>

                <p className="text-center text-gray-500 text-xs mt-6">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-[#1D9E75] hover:underline font-medium">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterManual;
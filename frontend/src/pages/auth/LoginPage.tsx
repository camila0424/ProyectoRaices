import { useState } from "react";
import { Link } from "react-router-dom";

interface FormLogin {
    correo: string;
    contrasena: string;
}

interface FormLoginErrors {
    correo?: string;
    contrasena?: string;
    general?: string;
}

function LoginPage() {
    const [form, setForm] = useState<FormLogin>({ correo: "", contrasena: "" });
    const [errors, setErrors] = useState<FormLoginErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    };

    const validate = (): boolean => {
        const newErrors: FormLoginErrors = {};
        if (!form.correo.trim()) newErrors.correo = "El correo es obligatorio";
        if (!form.contrasena.trim()) newErrors.contrasena = "La contraseña es obligatoria";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        // TODO: conectar con backend
        setErrors((prev) => ({
            ...prev,
            general: "Próximamente. Aún no tenemos usuarios registrados.",
        }));
    };

    const handleSocialLogin = () => {
        setErrors((prev) => ({
            ...prev,
            general: "Próximamente. Aún no tenemos usuarios registrados.",
        }));
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-8"
            style={{ backgroundColor: "#1e2b25" }}
        >
            <div
                className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
                style={{ backgroundColor: "#182320" }}
            >
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#1D9E75] flex items-center justify-center">
                        <span className="text-white font-bold font-serif text-lg">R</span>
                    </div>
                </div>

                <h1 className="text-white text-2xl font-bold text-center mb-1">
                    Bienvenido de vuelta
                </h1>
                <p className="text-gray-400 text-sm text-center mb-8">
                    Inicia sesión en tu cuenta Raíces
                </p>

                {/* Mensaje general */}
                {errors.general && (
                    <div className="mb-6 px-4 py-3 rounded-xl bg-[#1D9E75]/10 border border-[#1D9E75]/30 text-center">
                        <p className="text-[#1D9E75] text-sm font-medium">{errors.general}</p>
                    </div>
                )}

                {/* Social login */}
                <div className="flex flex-col gap-3 mb-6">
                    <button
                        onClick={handleSocialLogin}
                        className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-white text-gray-800 font-semibold text-sm hover:bg-gray-100 transition"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continuar con Google
                    </button>

                    <button
                        onClick={handleSocialLogin}
                        className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-[#1877F2] text-white font-semibold text-sm hover:bg-[#166FE5] transition"
                    >
                        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                        </svg>
                        Continuar con Facebook
                    </button>
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-gray-500 text-xs">o con tu correo</span>
                    <div className="flex-1 h-px bg-white/10" />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                            <p className="text-red-400 text-xs">{errors.correo}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300 font-medium">Contraseña</label>
                        <input
                            type="password"
                            name="contrasena"
                            value={form.contrasena}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full rounded-xl px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
                        />
                        {errors.contrasena && (
                            <p className="text-red-400 text-xs">{errors.contrasena}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="mt-2 w-full py-3 rounded-xl font-semibold text-white text-sm hover:brightness-110 transition"
                        style={{ backgroundColor: "#2d7a4f" }}
                    >
                        Iniciar sesión
                    </button>
                </form>

                <p className="text-center text-gray-500 text-xs mt-6">
                    ¿No tienes cuenta?{" "}
                    <Link to="/registro" className="text-[#1D9E75] hover:underline font-medium">
                        Regístrate gratis
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
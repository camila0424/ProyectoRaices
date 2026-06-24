import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function AuthCallback() {
    const { login } = useAuth();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const error = params.get("error");

        if (error === "duplicate_email") {
            setErrorMsg("Ya tienes una cuenta con este correo. Inicia sesión en su lugar.");
            return;
        }

        const token = params.get("token");
        const nombre = params.get("nombre") ?? "Usuario";
        const correo = params.get("correo") ?? "";
        const rol = params.get("rol") as "worker" | "employer" | null;

        const id = params.get("id") ?? "";

        if (token && rol && id) {
            try {
                login(token, { id, nombre, correo, rol });

                setTimeout(() => {
                    window.location.href = "/agente";
                }, 100);
            } catch {
                window.location.href = "/login?error=google";
            }
        } else {
            window.location.href = "/login?error=google";
        }
    }, []);

    if (errorMsg) {
        return (
            <div
                className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
                style={{ backgroundColor: "var(--bg-main)" }}
            >
                <div className="w-full max-w-md rounded-2xl p-8 shadow-sm border border-[#E8D9C4] bg-white text-center">
                    <div className="flex justify-center mb-6">
                        <img src="/logo.png" alt="Hausseup" className="h-12 w-auto" />
                    </div>
                    <p className="text-[#1F2A44] text-base font-medium mb-6">{errorMsg}</p>
                    <Link
                        to="/login"
                        className="inline-block w-full py-3 rounded-xl font-semibold text-white text-sm bg-[#C1502E] hover:bg-[#A6401F] transition"
                    >
                        Ir a iniciar sesión
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center gap-4"
            style={{ backgroundColor: "var(--bg-main)" }}
        >
            <div className="w-10 h-10 rounded-full bg-[#C1502E] flex items-center justify-center animate-pulse">
                <span className="text-white font-bold font-serif text-base">H</span>
            </div>
            <p className="text-[#1F2A44] text-sm">Iniciando sesión con Google...</p>
        </div>
    );
}

export default AuthCallback;

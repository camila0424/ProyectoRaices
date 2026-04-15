import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function AuthCallback() {
    const { login } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const nombre = params.get("nombre") ?? "Usuario";
        const correo = params.get("correo") ?? "";
        const rol = params.get("rol") as "worker" | "employer" | null;

        if (token && rol) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));

                localStorage.setItem("token", token);
                localStorage.setItem("usuario", JSON.stringify({
                    id: payload.id,
                    nombre,
                    correo,
                    rol
                }));

                login(token, { id: payload.id, nombre, correo, rol });

                setTimeout(() => {
                    window.location.href = rol === "employer"
                        ? "/dashboard-empleador"
                        : "/busco-empleo";
                }, 100);
            } catch {
                window.location.href = "/login?error=google";
            }
        } else {
            window.location.href = "/login?error=google";
        }
    }, []);

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center gap-4"
            style={{ backgroundColor: "var(--bg-main)" }}
        >
            <div className="w-10 h-10 rounded-full bg-[#1D9E75] flex items-center justify-center animate-pulse">
                <span className="text-white font-bold font-serif text-base">P</span>
            </div>
            <p className="text-white text-sm">Iniciando sesión con Google...</p>
        </div>
    );
}

export default AuthCallback;

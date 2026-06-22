import { useNavigate } from "react-router-dom";

function UserIntent() {
    const navigate = useNavigate();

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-8"
            style={{ backgroundColor: "var(--bg-main)" }}
        >
            <div className="w-full max-w-lg text-center mb-10">
                <div className="flex justify-center mb-6">
                    <img src="/logo.png" alt="Hausseup" className="h-12 w-auto" />
                </div>
                <h1 className="text-[#1F2A44] text-3xl font-bold mb-3">
                    ¿Qué estás buscando?
                </h1>
                <p className="text-[#6B7280] text-base">
                    Cuéntanos cómo podemos ayudarte para personalizar tu experiencia
                </p>
            </div>

            <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Busco empleo */}
                <button
                    onClick={() => navigate("/busco-empleo")}
                    className="group flex flex-col items-center gap-4 p-8 rounded-2xl border border-[#E8D9C4] hover:border-[#C1502E] transition-all duration-200 hover:scale-[1.02] text-left"
                    style={{ backgroundColor: "var(--bg-card)" }}
                >
                    <div className="w-14 h-14 rounded-2xl bg-[#C1502E]/10 flex items-center justify-center group-hover:bg-[#C1502E]/20 transition">
                        <span className="text-3xl">🔍</span>
                    </div>
                    <div>
                        <h2 className="text-[#1F2A44] font-bold text-lg mb-1">Busco empleo</h2>
                        <p className="text-[#6B7280] text-sm leading-relaxed">
                            Encuentra oportunidades laborales en España según tu sector y ciudad
                        </p>
                    </div>
                    <span
                        className="mt-auto w-full py-2.5 rounded-xl text-center text-sm font-semibold text-white transition"
                        style={{ backgroundColor: "#C1502E" }}
                    >
                        Quiero trabajar
                    </span>
                </button>

                {/* Ofrezco empleo */}
                <button
                    onClick={() => navigate("/dashboard-empleador")}
                    className="group flex flex-col items-center gap-4 p-8 rounded-2xl border border-[#E8D9C4] hover:border-[#C1502E] transition-all duration-200 hover:scale-[1.02] text-left"
                    style={{ backgroundColor: "var(--bg-card)" }}
                >
                    <div className="w-14 h-14 rounded-2xl bg-[#C1502E]/10 flex items-center justify-center group-hover:bg-[#C1502E]/20 transition">
                        <span className="text-3xl">📋</span>
                    </div>
                    <div>
                        <h2 className="text-[#1F2A44] font-bold text-lg mb-1">Ofrezco empleo</h2>
                        <p className="text-[#6B7280] text-sm leading-relaxed">
                            Publica ofertas y encuentra perfiles de la comunidad latina disponibles
                        </p>
                    </div>
                    <span
                        className="mt-auto w-full py-2.5 rounded-xl text-center text-sm font-semibold text-white border border-[#C1502E]/30 transition"
                        style={{ backgroundColor: "#1F2A44" }}
                    >
                        Quiero contratar
                    </span>
                </button>
            </div>
        </div>
    );
}

export default UserIntent;

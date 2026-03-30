import { useNavigate } from "react-router-dom";

function UserIntent() {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4 pt-20"
            style={{ backgroundColor: "#1e2b25" }}
        >
            <div className="w-full max-w-lg text-center mb-10">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#1D9E75] flex items-center justify-center">
                        <span className="text-white font-bold font-serif text-lg">R</span>
                    </div>
                </div>
                <h1 className="text-white text-3xl font-bold mb-3">
                    ¿Qué estás buscando?
                </h1>
                <p className="text-gray-400 text-base">
                    Cuéntanos cómo podemos ayudarte para personalizar tu experiencia
                </p>
            </div>

            <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Busco empleo */}
                <button
                    onClick={() => navigate("/busco-empleo")}
                    className="group flex flex-col items-center gap-4 p-8 rounded-2xl border border-white/10 hover:border-[#1D9E75] transition-all duration-200 hover:scale-[1.02] text-left"
                    style={{ backgroundColor: "#182320" }}
                >
                    <div className="w-14 h-14 rounded-2xl bg-[#1D9E75]/20 flex items-center justify-center group-hover:bg-[#1D9E75]/30 transition">
                        <span className="text-3xl">🔍</span>
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg mb-1">Busco empleo</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Encuentra oportunidades laborales en España según tu sector y ciudad
                        </p>
                    </div>
                    <span
                        className="mt-auto w-full py-2.5 rounded-xl text-center text-sm font-semibold text-white transition"
                        style={{ backgroundColor: "#2d7a4f" }}
                    >
                        Quiero trabajar
                    </span>
                </button>

                {/* Ofrezco empleo */}
                <button
                    onClick={() => navigate("/dashboard-empleador")}
                    className="group flex flex-col items-center gap-4 p-8 rounded-2xl border border-white/10 hover:border-[#1D9E75] transition-all duration-200 hover:scale-[1.02] text-left"
                    style={{ backgroundColor: "#182320" }}
                >
                    <div className="w-14 h-14 rounded-2xl bg-[#1D9E75]/20 flex items-center justify-center group-hover:bg-[#1D9E75]/30 transition">
                        <span className="text-3xl">📋</span>
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg mb-1">Ofrezco empleo</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Publica ofertas y encuentra perfiles de la comunidad latina disponibles
                        </p>
                    </div>
                    <span
                        className="mt-auto w-full py-2.5 rounded-xl text-center text-sm font-semibold text-white border border-white/20 transition"
                    >
                        Quiero contratar
                    </span>
                </button>
            </div>
        </div>
    );
}

export default UserIntent;
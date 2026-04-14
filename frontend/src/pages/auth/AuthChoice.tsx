import { useNavigate, Link } from "react-router-dom";

const BACKEND_URL = "http://localhost:3001/api";

function AuthChoice() {
    const navigate = useNavigate();

    return (
        <div
            id="registro"
            className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-12"
            style={{ backgroundColor: "var(--bg-main)" }}
        >
            <div
                className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
                style={{ backgroundColor: "var(--bg-card)" }}
            >
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#1D9E75] flex items-center justify-center">
                        <span className="text-white font-bold font-serif text-lg">P</span>
                    </div>
                </div>

                <h1 className="text-white text-2xl font-bold text-center mb-1">
                    Únete a Parceros
                </h1>
                <p className="text-gray-400 text-sm text-center mb-8">
                    Red de oportunidades para latinos en España
                </p>

                <div className="flex flex-col gap-3 mb-6">

                    <a href={`${BACKEND_URL}/auth/google`}
                        className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-white text-gray-800 font-semibold text-sm hover:bg-gray-100 transition"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continuar con Google
                    </a>


                    <a href={`${BACKEND_URL}/auth/facebook`}
                        className="flex items-center justify-center gap-3 w-full py-3 rounded-xl text-white font-semibold text-sm transition"
                        style={{ backgroundColor: "#1877F2" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#166FE5")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1877F2")}
                    >
                        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                        </svg>
                        Continuar con Facebook
                    </a>
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-gray-500 text-xs">o regístrate manualmente</span>
                    <div className="flex-1 h-px bg-white/10" />
                </div>

                <button
                    onClick={() => navigate("/registro/manual")}
                    className="w-full py-3 rounded-xl font-semibold text-white text-sm border border-white/20 hover:bg-white/5 transition"
                >
                    Añadir mis datos manualmente
                </button>

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

export default AuthChoice;
import React from "react";
import { FileText, Search, Handshake, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Step = {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
};

const steps: Step[] = [
    {
        id: "01",
        title: "Crea tu perfil",
        description: "Con tu documentación legal en España",
        icon: <FileText className="w-6 h-6" />,
    },
    {
        id: "02",
        title: "Busca por ciudad",
        description: "Encuentra latinos con negocios u oportunidades",
        icon: <Search className="w-6 h-6" />,
    },
    {
        id: "03",
        title: "Conecta directo",
        description: "Con el dueño o el referente de empleo",
        icon: <Handshake className="w-6 h-6" />,
    },
    {
        id: "04",
        title: "Consigue trabajo",
        description: "Con contrato, dignidad y un paisano que avala",
        icon: <CheckCircle className="w-6 h-6" />,
    },
];

function HowItWorks() {
    const navigate = useNavigate();

    return (
        <section
            id="como-funciona"
            className="w-full py-20 px-6 md:px-12 bg-linear-to-b from-white to-gray-50"
        >
            <div className="max-w-6xl mx-auto text-center">
                {/* HEADER */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Cómo funciona Raíces
                </h2>
                <p className="text-gray-500 text-base md:text-lg mb-16">
                    Simple, seguro y pensado para ti
                </p>

                {/* STEPS */}
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className="relative flex flex-col items-center text-center group max-w-55"
                        >
                            {/* Línea (solo desktop) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 border-t border-dashed border-green-400 opacity-60" />
                            )}

                            {/* Círculo */}
                            <div className="relative z-10 w-20 h-20 flex items-center justify-center rounded-full border-2 border-green-500 bg-white shadow-md transition-transform duration-300 group-hover:scale-110">
                                <div className="text-green-600">{step.icon}</div>
                                <span className="absolute -bottom-6 text-sm font-semibold text-gray-700">
                                    {step.id}
                                </span>
                            </div>

                            {/* Texto */}
                            <div className="mt-5">
                                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 flex flex-col md:flex-row items-stretch justify-center gap-4">

                    {/* Card 1 — Raíces */}
                    <div className="flex flex-col justify-between bg-green-900 text-white rounded-2xl px-6 py-4 md:px-10 md:py-6 shadow-xl w-full md:max-w-md transition hover:shadow-2xl">
                        <p className="text-sm md:text-base text-green-200 mb-3">
                            ¿Tienes documentación legal en España?
                        </p>
                        <button
                            onClick={() => navigate("/registro")}
                            className="text-center leading-tight transition hover:opacity-90 cursor-pointer"
                        >
                            <span className="block text-xl md:text-2xl font-semibold">
                                Únete gratis a Raíces →
                            </span>
                        </button>
                    </div>

                    {/* Card 2 — Semillas */}
                    <div className="flex flex-col justify-between bg-yellow-800 text-white rounded-2xl px-6 py-4 md:px-10 md:py-6 shadow-xl w-full md:max-w-md transition hover:shadow-2xl">
                        <p className="text-sm md:text-base text-white mb-3">
                            ¿Aún no tienes documentación legal en España?
                        </p>
                        <button
                            onClick={() => navigate("/registro")}
                            className="text-center leading-tight transition hover:opacity-90 cursor-pointer"
                        >
                            <span className="block text-xl md:text-2xl font-semibold">
                                Únete gratis a Semillas →
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;

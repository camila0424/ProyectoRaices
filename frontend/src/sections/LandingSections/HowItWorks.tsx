import React, { useEffect, useRef } from "react";
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
    const stepsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.15 }
        );
        const steps = stepsRef.current?.querySelectorAll(".step-item");
        steps?.forEach((step) => observer.observe(step));
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="como-funciona"
            className="w-full py-20 px-6 md:px-12 dark:bg-[#16152a]"
            style={{ backgroundColor: "var(--bg-main)" }}
        >
            <div className="max-w-6xl mx-auto text-center">
                {/* HEADER */}
                <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-[#1E1B4B] dark:text-white mb-4">
                    Cómo funciona parceros
                </h2>
                <p className="text-[#6B7280] dark:text-white/80 text-base md:text-lg mb-16">
                    Simple, seguro y pensado para ti
                </p>

                {/* STEPS */}
                <div ref={stepsRef} className="relative flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className="step-item relative flex flex-col items-center text-center group max-w-55"
                        >
                            {/* Línea (solo desktop) */}
                            {index < steps.length - 1 && (
                                <div
                                    className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 border-t border-dashed opacity-60"
                                    style={{ borderColor: "#C7D2FE" }}
                                />
                            )}

                            {/* Círculo */}
                            <div className="relative z-10 w-20 h-20 flex items-center justify-center rounded-2xl border border-[#C7D2FE] dark:border-white/10 bg-[#EEF2FF] dark:bg-[#1e1d35] shadow-sm transition-transform duration-300 group-hover:scale-110">
                                <div className="text-[#4F46E5]">{step.icon}</div>
                                <span className="absolute -bottom-6 text-sm font-semibold text-[#6B7280] dark:text-white/50">
                                    {step.id}
                                </span>
                            </div>

                            {/* Texto */}
                            <div className="mt-5">
                                <h3 className="font-medium text-[#1E1B4B] dark:text-white">{step.title}</h3>
                                <p className="text-sm text-[#6B7280] dark:text-white/70 mt-1">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 flex flex-col md:flex-row items-stretch justify-center gap-4">

                    {/* Card 1 — parceros */}
                    <div className="flex flex-col justify-between bg-[#1E1B4B] text-white rounded-2xl px-6 py-4 md:px-10 md:py-6 shadow-xl w-full md:max-w-md transition hover:shadow-2xl">
                        <p className="text-sm md:text-base mb-3" style={{ color: "rgba(255,255,255,0.65)" }}>
                            ¿Tienes documentación legal en España?
                        </p>
                        <button
                            onClick={() => { navigate("/registro"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            className="text-center leading-tight transition hover:opacity-90 cursor-pointer"
                        >
                            <span className="block text-xl md:text-2xl font-semibold">
                                Únete gratis a parceros →
                            </span>
                        </button>
                    </div>

                    {/* Card 2 — Semillas */}
                    <div className="flex flex-col justify-between bg-[#FEF9C3] border border-[#FDE68A] rounded-2xl px-6 py-4 md:px-10 md:py-6 shadow-xl w-full md:max-w-md transition hover:shadow-2xl">
                        <p className="text-sm md:text-base text-[#92400E] mb-3">
                            ¿Aún no tienes documentación legal en España?
                        </p>
                        <button
                            onClick={() => { navigate("/registro"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            className="text-center leading-tight transition hover:opacity-90 cursor-pointer"
                        >
                            <span className="flex items-center justify-center gap-2 text-xl md:text-2xl font-semibold text-[#1E1B4B]">
                                Únete gratis a Semillas
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FDE68A] text-[#1E1B4B] text-base">→</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;

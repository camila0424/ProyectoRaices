import { useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Check, User, ShieldCheck, Briefcase, Sparkles, ArrowRight, ArrowLeft, Building2 } from 'lucide-react';

import { paisesOrigen, ciudadesEspana } from "../../../data/locationData";
import StepIdentidad from './StepIdentidad';
import StepLaboral from './StepLaboral';

interface OnboardingData {
    nombre: string;
    telefono: string;
    pais: string;
    provincia: string;
    pueblo: string;
    habilidades?: string[];
    esReclutador?: boolean; // Nueva propiedad
    fotos?: {
        frontal: string | null;
        selfie: string | null;
    };
}

// Clase corregida para Selectors (Fondo oscuro forzado en options)
const darkSelectClass = "w-full p-3 rounded-xl text-white border border-white/10 bg-[#262624] focus:ring-2 focus:ring-[#1D9E75]/30 outline-none [&_option]:bg-[#262624] [&_option]:text-white";

function OnboardingRegister() {
    const [currentStep, setCurrentStep] = useState(1);
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [pais, setPais] = useState("");
    const [provincia, setProvincia] = useState("");
    const [pueblo, setPueblo] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<Partial<OnboardingData>>({});

    const handleNext = (stepData = {}) => {
        setFormData(prev => ({ ...prev, ...stepData }));
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        setTelefono(value);
        setErrors(prev => ({ ...prev, telefono: "" }));
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
        if (telefono.length < 9) newErrors.telefono = "Número inválido";
        if (!pais) newErrors.pais = "Selecciona un país";
        if (!provincia) newErrors.provincia = "Selecciona una provincia";
        if (!pueblo) newErrors.pueblo = "Selecciona una localidad";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const steps = [
        { id: 1, title: "Datos básicos", icon: <User size={14} /> },
        { id: 2, title: "Identidad", icon: <ShieldCheck size={14} /> },
        { id: 3, title: "Perfil laboral", icon: <Briefcase size={14} /> },
        { id: 4, title: "Finalizar", icon: <Sparkles size={14} /> },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#141413]">
            {/* SIDEBAR */}
            <aside className="w-full md:w-72 bg-[#04342C] p-6 border-r border-white/5 shrink-0">
                <Link to="/" className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-full bg-[#1D9E75] flex items-center justify-center shadow-lg shadow-[#1D9E75]/20">
                        <span className="text-white font-bold">R</span>
                    </div>
                    <span className="text-white font-semibold text-xl font-serif italic">Raíces</span>
                </Link>

                <nav className="flex md:flex-col gap-6 overflow-x-auto no-scrollbar">
                    {steps.map((step) => {
                        const isCompleted = currentStep > step.id;
                        const isActive = currentStep === step.id;
                        return (
                            <div key={step.id} className={`flex items-center gap-3 transition-opacity ${isActive || isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition
                                    ${isCompleted ? 'bg-[#1D9E75] border-[#1D9E75]' : isActive ? 'border-[#1D9E75]' : 'border-white/20'}`}>
                                    <span className="text-white">{isCompleted ? <Check size={16} /> : step.icon}</span>
                                </div>
                                <p className="text-white text-sm font-medium">{step.title}</p>
                            </div>
                        );
                    })}
                </nav>
            </aside>

            {/* MAIN */}
            <main className="flex-1 flex items-center justify-center p-6 relative">
                <div className="w-full max-w-md bg-[#30302E] border border-white/5 rounded-4xl p-8 space-y-6 shadow-2xl">

                    {/* PASO 1 */}
                    {currentStep === 1 && (
                        <div className="space-y-5 animate-in fade-in duration-500">
                            <header>
                                <h1 className="text-white text-2xl font-bold font-serif italic">Bienvenido</h1>
                                <p className="text-[#9C9A92] text-sm">Completa tu información básica</p>
                            </header>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-[#C2C0B6] uppercase tracking-wider ml-1">Nombre y apellidos</label>
                                    <input
                                        value={nombre}
                                        onChange={(e) => { setNombre(e.target.value); setErrors(prev => ({ ...prev, nombre: "" })); }}
                                        placeholder="Ej: Juan Pérez"
                                        className={`w-full mt-1 p-3 rounded-xl text-white bg-[#262624] border ${errors.nombre ? 'border-red-500' : 'border-white/10'} outline-none focus:ring-2 focus:ring-[#1D9E75]/30`}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[#C2C0B6] uppercase tracking-wider ml-1">WhatsApp</label>
                                    <div className="flex gap-2 mt-1">
                                        <div className="w-16 flex items-center justify-center bg-[#262624] border border-white/10 rounded-xl text-[#C2C0B6] text-xs font-bold">+34</div>
                                        <input
                                            value={telefono}
                                            onChange={handlePhoneChange}
                                            placeholder="600000000"
                                            className={`flex-1 p-3 rounded-xl text-white bg-[#262624] border ${errors.telefono ? 'border-red-500' : 'border-white/10'} outline-none focus:ring-2 focus:ring-[#1D9E75]/30`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[#C2C0B6] uppercase tracking-wider ml-1">País de origen</label>
                                    <select value={pais} onChange={(e) => { setPais(e.target.value); setErrors(prev => ({ ...prev, pais: "" })); }} className={darkSelectClass}>
                                        <option value="">Selecciona país</option>
                                        {paisesOrigen.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-[#C2C0B6] uppercase tracking-wider ml-1">Provincia</label>
                                        <select value={provincia} onChange={(e) => { setProvincia(e.target.value); setErrors(prev => ({ ...prev, provincia: "" })); }} className={darkSelectClass}>
                                            <option value="">Elegir...</option>
                                            {ciudadesEspana.map(c => <option key={c.provincia} value={c.provincia}>{c.provincia}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[#C2C0B6] uppercase tracking-wider ml-1">Localidad</label>
                                        <select value={pueblo} onChange={(e) => setPueblo(e.target.value)} disabled={!provincia} className={darkSelectClass}>
                                            <option value="">Elegir...</option>
                                            {ciudadesEspana.find(p => p.provincia === provincia)?.ciudades.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => validateStep1() && handleNext({ nombre, telefono, pais, provincia, pueblo })} className="w-full py-4 rounded-xl font-bold bg-[#1D9E75] text-white hover:scale-[1.02] transition shadow-lg shadow-[#1D9E75]/10">
                                Siguiente paso
                            </button>
                        </div>
                    )}

                    {currentStep === 2 && <StepIdentidad onNext={handleNext} onBack={handleBack} />}
                    {currentStep === 3 && <StepLaboral onNext={handleNext} onBack={handleBack} />}

                    {/* PASO 4: FINALIZAR (CON LA LÓGICA QUE PEDISTE) */}
                    {currentStep === 4 && (
                        <div className="flex flex-col items-center text-center space-y-8 animate-in zoom-in duration-500">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#1D9E75]/20 blur-2xl rounded-full" />
                                <div className="relative size-20 bg-[#1D9E75]/10 border border-[#1D9E75]/20 rounded-full flex items-center justify-center ring-8 ring-[#1D9E75]/5">
                                    <Sparkles className="text-[#1D9E75]" size={36} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-white font-serif text-3xl font-bold italic tracking-tight">
                                    ¡Listo, {formData.nombre?.split(' ')[0]}!
                                </h2>
                                <p className="text-[#C2C0B6] text-sm max-w-70 mx-auto leading-relaxed">
                                    {formData.esReclutador
                                        ? "Tu cuenta de empresa está activa. Empieza a buscar talento hoy mismo."
                                        : "Tu perfil ha sido creado con éxito. ¿Qué quieres hacer ahora?"}
                                </p>
                            </div>

                            <div className="w-full space-y-3">
                                <button className="group w-full p-4 rounded-2xl bg-[#1D9E75] text-white flex items-center justify-between font-bold text-lg transition-all active:scale-[0.98]">
                                    <div className="flex items-center gap-3">
                                        {formData.esReclutador ? <Building2 size={20} /> : <span>🔍</span>}
                                        <span>{formData.esReclutador ? "Publicar vacante" : "Busco empleo"}</span>
                                    </div>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                {!formData.esReclutador && (
                                    <button className="group w-full p-4 rounded-2xl bg-[#262624] border border-white/10 text-[#FAF9F5] flex items-center justify-between font-bold text-lg transition-all active:scale-[0.98]">
                                        <div className="flex items-center gap-3">
                                            <span>💼</span>
                                            <span>Quiero contratar</span>
                                        </div>
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-[#1D9E75]" />
                                    </button>
                                )}
                            </div>

                            <button onClick={handleBack} className="flex items-center justify-center gap-2 w-full text-[#C2C0B6] hover:text-white text-sm font-medium transition-colors pt-4 border-t border-white/5">
                                <ArrowLeft size={16} /> Revisar mis datos
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default OnboardingRegister;
import { useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Sparkles, User, ShieldCheck, Briefcase, PartyPopper } from 'lucide-react';
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";
import { paisesOrigen, ciudadesEspana } from "../../../data/locationData";

// Importación de componentes de paso
import StepIdentidad from './StepIdentidad';
import StepLaboral from './StepLaboral';

interface OnboardingData {
    nombre?: string;
    telefono?: string;
    pais?: string;
    provincia?: string;
    pueblo?: string;
    habilidades?: string[];
    fotos?: {
        frontal: string | null;
        selfie: string | null;
    };
}


const darkInputClass = "[&_input]:bg-[#262624] [&_input]:border-white/10 [&_input]:text-[#FAF9F5] [&_input]:placeholder-[#9C9A92] [&_input]:rounded-xl [&_input]:focus:border-[#1D9E75] [&_input]:focus:ring-2 [&_input]:focus:ring-[#1D9E75]/20 [&_label]:text-[#C2C0B6]";
const darkSelectClass = "[&_select]:bg-[#262624] [&_select]:border-white/10 [&_select]:text-[#FAF9F5] [&_select]:rounded-xl [&_select]:focus:border-[#1D9E75] [&_select]:focus:ring-2 [&_select]:focus:ring-[#1D9E75]/20 [&_label]:text-[#C2C0B6]";

function OnboardingRegister() {
    const [currentStep, setCurrentStep] = useState(1);
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
    const [telefono, setTelefono] = useState("");
    const [formData, setFormData] = useState<OnboardingData>({});

    // --- Lógica de navegación ---
    const handleNext = (stepData = {}) => {
        setFormData(prev => ({ ...prev, ...stepData }));
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- Validación de Teléfono ---
    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        setTelefono(value);
    };

    const pueblosDisponibles = ciudadesEspana.find(p => p.provincia === provinciaSeleccionada)?.ciudades || [];

    const steps = [
        { id: 1, title: "Datos básicos", icon: <User size={14} /> },
        { id: 2, title: "Identidad", icon: <ShieldCheck size={14} /> },
        { id: 3, title: "Perfil laboral", icon: <Briefcase size={14} /> },
        { id: 4, title: "Finalizar", icon: <Sparkles size={14} /> },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#141413] font-sans selection:bg-[#1D9E75]/30">

            {/* --- SIDEBAR RESPONSIVE (v4) --- */}
            <aside className="w-full md:w-72 bg-[#04342C] flex flex-col p-6 md:p-8 shrink-0 border-b md:border-b-0 md:border-r border-white/5">
                <Link to="/" className="flex items-center gap-3 mb-10">
                    <div className="size-10 rounded-full bg-[#1D9E75] flex items-center justify-center shadow-lg shadow-[#1D9E75]/20">
                        <span className="text-white font-bold font-serif text-lg">R</span>
                    </div>
                    <span className="text-white font-semibold font-serif text-xl tracking-tight">Raíces</span>
                </Link>

                {/* Stepper dinámico: Vertical en Desktop, Horizontal en Mobile */}
                <nav className="flex md:flex-col gap-6 overflow-x-auto no-scrollbar pb-4 md:pb-0">
                    {steps.map((step, idx) => {
                        const isCompleted = currentStep > step.id;
                        const isActive = currentStep === step.id;

                        return (
                            <div key={step.id} className="flex items-center md:items-start gap-4 shrink-0 transition-all duration-500">
                                <div className="flex flex-col items-center">
                                    <div className={`size-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 
                                        ${isCompleted ? 'bg-[#1D9E75] border-[#1D9E75]' : isActive ? 'bg-transparent border-[#1D9E75] ring-4 ring-[#1D9E75]/10' : 'border-white/10 opacity-30'}`}>
                                        <span className="text-white">
                                            {isCompleted ? <Check size={16} strokeWidth={3} /> : step.icon}
                                        </span>
                                    </div>
                                    {idx !== steps.length - 1 && (
                                        <div className={`hidden md:block w-0.5 h-10 my-1 transition-colors duration-700 
                                            ${isCompleted ? 'bg-[#1D9E75]' : 'bg-white/10'}`}
                                        />
                                    )}
                                </div>
                                <div className={`transition-all duration-300 ${isActive || isCompleted ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-1'}`}>
                                    <p className="text-white text-sm font-bold leading-none">{step.title}</p>
                                    <p className="hidden md:block text-[#5DCAA5] text-[11px] mt-1.5 font-medium opacity-80">Paso 0{step.id}</p>
                                </div>
                            </div>
                        );
                    })}
                </nav>

                <div className="hidden md:flex flex-1 flex-col justify-end mt-12">
                    <div className="bg-[#085041] rounded-2xl p-5 border border-white/5 shadow-inner">
                        <p className="text-[#9FE1CB] text-xs leading-relaxed italic">"Raíces me ayudó a encontrar estabilidad en un país nuevo. El proceso fue humano y rápido."</p>
                        <p className="text-[#5DCAA5] text-[10px] font-bold mt-4 tracking-widest uppercase">— Comunidad Raíces</p>
                    </div>
                </div>
            </aside>

            {/* --- CONTENEDOR DE PASOS --- */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-12 relative overflow-hidden">
                {/* Decoración de fondo sutil */}
                <div className="absolute top-0 right-0 size-96 bg-[#1D9E75]/5 blur-[120px] rounded-full -mr-48 -mt-48" />

                <div className="w-full max-w-md bg-[#30302E] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10">

                    {/* PASO 1: DATOS BÁSICOS */}
                    {currentStep === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <header className="space-y-3">
                                <h1 className="text-[#FAF9F5] font-serif text-3xl font-bold tracking-tight">Bienvenido a Raíces</h1>
                                <p className="text-[#9C9A92] text-sm">Comencemos con tu información básica para crear tu cuenta profesional.</p>
                            </header>

                            <div className="space-y-5">
                                <Input label="Nombre y Apellidos" type="text" placeholder="Ej. Juan Pérez" className={darkInputClass} />

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#C2C0B6] ml-1">WhatsApp</label>
                                    <div className="flex gap-3">
                                        <div className="w-20 h-12 bg-[#262624] border border-white/10 rounded-xl flex items-center justify-center text-[#C2C0B6] text-sm font-bold">+34</div>
                                        <input
                                            type="text"
                                            value={telefono}
                                            onChange={handlePhoneChange}
                                            placeholder="600 000 000"
                                            className="flex-1 bg-[#262624] border border-white/10 text-[#FAF9F5] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75] transition-all"
                                        />
                                    </div>
                                </div>

                                <Select label="País de origen" className={darkSelectClass}>
                                    <option value="">Selecciona tu país...</option>
                                    {paisesOrigen.map((pais) => (
                                        <option key={pais.code} value={pais.code}>{pais.name}</option>
                                    ))}
                                </Select>

                                <div className="grid grid-cols-1 gap-5">
                                    <Select
                                        label="Provincia en España"
                                        className={darkSelectClass}
                                        onChange={(e) => setProvinciaSeleccionada(e.target.value)}
                                    >
                                        <option value="">Selecciona provincia...</option>
                                        {ciudadesEspana.map((item) => (
                                            <option key={item.provincia} value={item.provincia}>{item.provincia}</option>
                                        ))}
                                    </Select>

                                    <Select
                                        label="Localidad / Pueblo"
                                        className={`${darkSelectClass} ${!provinciaSeleccionada ? 'opacity-30 pointer-events-none' : ''}`}
                                        disabled={!provinciaSeleccionada}
                                    >
                                        <option value="">{provinciaSeleccionada ? "Selecciona localidad..." : "Espera a elegir provincia"}</option>
                                        {pueblosDisponibles.map((pueblo) => (
                                            <option key={pueblo} value={pueblo}>{pueblo}</option>
                                        ))}
                                    </Select>
                                </div>

                                <Button
                                    variant="primary"
                                    onClick={() => handleNext()}
                                    className="w-full rounded-2xl! bg-[#1D9E75] py-4.5 text-white font-bold text-lg mt-4 shadow-xl shadow-[#1D9E75]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Siguiente paso
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* PASO 2: IDENTIDAD */}
                    {currentStep === 2 && (
                        <StepIdentidad onNext={handleNext} onBack={handleBack} />
                    )}

                    {/* PASO 3: LABORAL */}
                    {currentStep === 3 && (
                        <StepLaboral onNext={handleNext} onBack={handleBack} />
                    )}

                    {/* PASO 4: FINALIZAR */}
                    {currentStep === 4 && (
                        <div className="text-center space-y-8 animate-in zoom-in duration-500">
                            <div className="size-24 bg-[#1D9E75]/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-[#1D9E75]/5">
                                <PartyPopper className="text-[#1D9E75]" size={48} />
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-[#FAF9F5] font-serif text-3xl font-bold italic tracking-tight">
                                    ¡Todo listo, {formData.nombre?.split(' ')[0] || 'compatriota'}!
                                </h2>
                                <p className="text-[#C2C0B6] text-sm max-w-70 mx-auto leading-relaxed">
                                    Tu perfil en Raíces ha sido creado. ¿Cuál es tu objetivo principal ahora?
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 mt-8">
                                {/* Opción A: Buscar Empleo */}
                                <button className="group p-5 rounded-2xl bg-[#1D9E75] text-white flex items-center justify-between font-bold text-lg transition-all hover:shadow-lg hover:shadow-[#1D9E75]/20 active:scale-[0.97]">
                                    <div className="flex items-center gap-3">
                                        <span>🔍</span>
                                        <span>Busco empleo</span>
                                    </div>
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                {/* Opción B: Contratar */}
                                <button className="group p-5 rounded-2xl bg-[#262624] border border-white/10 text-[#FAF9F5] flex items-center justify-between font-bold text-lg transition-all hover:border-[#1D9E75]/50 active:scale-[0.97]">
                                    <div className="flex items-center gap-3">
                                        <span>💼</span>
                                        <span>Quiero contratar</span>
                                    </div>
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform text-[#1D9E75]" />
                                </button>
                            </div>

                            {/* BOTÓN ATRÁS (Añadido) */}
                            <div className="pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex items-center justify-center gap-2 w-full text-[#c2c0b6f1] hover:text-white text-sm font-medium transition-colors py-2"
                                >
                                    <ArrowLeft size={16} /> Revisar mis datos anteriores
                                </button>
                            </div>

                            <p className="text-[10px] text-[#9C9A92] uppercase tracking-[0.2em] font-medium opacity-50">
                                Raíces • Conectando talento y comunidad
                            </p>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

export default OnboardingRegister;
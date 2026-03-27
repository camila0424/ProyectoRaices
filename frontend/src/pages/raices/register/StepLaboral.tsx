import { useState } from 'react';
import { Briefcase, Check, ArrowRight, ArrowLeft, Star, Building2 } from 'lucide-react';
import Button from "../../../components/common/Button";

interface StepProps {
    onNext: (data: { habilidades: string[], esReclutador: boolean }) => void;
    onBack: () => void;
}

const CATEGORIAS = [
    { id: 'cocina', label: 'Cocina / Hostelería', icon: '🍳' },
    { id: 'limpieza', label: 'Limpieza', icon: '🧹' },
    { id: 'cuidado', label: 'Cuidado de personas', icon: '👵' },
    { id: 'construccion', label: 'Construcción', icon: '🏗️' },
    { id: 'reparto', label: 'Reparto / Mensajería', icon: '🛵' },
    { id: 'campo', label: 'Campo / Agricultura', icon: '🚜' },
    { id: 'mantenimiento', label: 'Mantenimiento', icon: '🔧' },
    { id: 'otros', label: 'Otros', icon: '✨' },
];

const StepLaboral = ({ onNext, onBack }: StepProps) => {
    const [seleccionados, setSeleccionados] = useState<string[]>([]);

    const toggleHabilidad = (id: string) => {
        setSeleccionados(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const isComplete = seleccionados.length > 0;

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <div className="inline-flex size-12 bg-[#1D9E75]/10 rounded-full items-center justify-center mb-4">
                    <Briefcase className="text-[#1D9E75]" size={24} />
                </div>
                <h2 className="text-[#FAF9F5] font-serif text-2xl font-semibold italic">Tu Perfil Laboral</h2>
                <p className="text-[#C2C0B6] text-sm mt-2 tracking-tight">Selecciona las áreas donde tienes experiencia</p>
            </div>

            {/* SECCIÓN ESPECIAL: OFRECER EMPLEO (Nuevo botón que pediste) */}
            <button
                type="button"
                onClick={() => onNext({ habilidades: [], esReclutador: true })}
                className="w-full p-4 rounded-2xl border-2 border-dashed border-[#1D9E75]/30 bg-[#1D9E75]/5 hover:bg-[#1D9E75]/10 hover:border-[#1D9E75] transition-all flex items-center gap-4 group"
            >
                <div className="size-10 rounded-xl bg-[#1D9E75] flex items-center justify-center text-white shadow-lg shadow-[#1D9E75]/20 group-hover:scale-110 transition-transform">
                    <Building2 size={20} />
                </div>
                <div className="text-left">
                    <p className="text-[#FAF9F5] text-sm font-bold">No busco, quiero contratar</p>
                    <p className="text-[#5DCAA5] text-[10px] font-medium uppercase tracking-wider">Perfil de Reclutador</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-[#1D9E75] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
                    <span className="bg-[#30302E] px-3 text-[#9C9A92] font-semibold">O elige tus habilidades</span>
                </div>
            </div>

            {/* Grid de Habilidades */}
            <div className="grid grid-cols-2 gap-3">
                {CATEGORIAS.map((cat) => {
                    const isSelected = seleccionados.includes(cat.id);
                    return (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleHabilidad(cat.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 text-left active:scale-[0.96]
                                ${isSelected
                                    ? 'border-[#1D9E75] bg-[#1D9E75]/10 ring-2 ring-[#1D9E75]/10'
                                    : 'border-white/10 bg-[#262624] hover:border-white/20'}`}
                        >
                            <span className="text-xl">{cat.icon}</span>
                            <div className="flex-1 overflow-hidden">
                                <p className={`text-[11px] font-bold leading-tight truncate ${isSelected ? 'text-[#5DCAA5]' : 'text-[#FAF9F5]'}`}>
                                    {cat.label}
                                </p>
                            </div>
                            {isSelected && <Check size={12} className="text-[#1D9E75] shrink-0" strokeWidth={3} />}
                        </button>
                    );
                })}
            </div>

            {/* Nota rápida de experiencia */}
            <div className="p-4 bg-[#262624] rounded-2xl border border-white/5 focus-within:border-[#1D9E75]/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                    <Star size={14} className="text-[#1D9E75]" />
                    <span className="text-[#FAF9F5] text-[11px] font-bold uppercase tracking-wider">Nota adicional</span>
                </div>
                <textarea
                    placeholder="Ej: Tengo coche propio y disponibilidad inmediata..."
                    className="w-full bg-transparent border-none text-[#FAF9F5] text-sm placeholder-[#9C9A92] focus:ring-0 resize-none h-14 p-0"
                />
            </div>

            {/* Acciones de navegación */}
            <div className="flex items-center gap-4 pt-2">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center justify-center size-12 rounded-xl bg-[#262624] text-[#C2C0B6] hover:text-white transition-colors border border-white/5"
                >
                    <ArrowLeft size={20} />
                </button>

                <Button
                    variant="primary"
                    disabled={!isComplete}
                    onClick={() => onNext({ habilidades: seleccionados, esReclutador: false })}
                    className="flex-1 py-4 rounded-xl bg-[#1D9E75] text-white font-bold text-base shadow-lg shadow-[#1D9E75]/10 active:scale-[0.98] transition-all"
                >
                    Finalizar registro
                </Button>
            </div>
        </div>
    );
};

export default StepLaboral;
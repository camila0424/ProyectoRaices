import { useState } from 'react';
import { Briefcase, Check, ArrowRight, ArrowLeft, Star } from 'lucide-react';
import Button from "../../../components/common/Button";

interface StepProps {
    onNext: (data: { habilidades: string[] }) => void;
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
                <h2 className="text-[#FAF9F5] font-serif text-2xl font-semibold">Tu Perfil Laboral</h2>
                <p className="text-[#C2C0B6] text-sm mt-2">¿En qué áreas tienes experiencia o buscas trabajo?</p>
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
                            className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-300 text-left
                                ${isSelected
                                    ? 'border-[#1D9E75] bg-[#1D9E75]/10 ring-2 ring-[#1D9E75]/20'
                                    : 'border-white/5 bg-[#262624] hover:border-white/20'}`}
                        >
                            <span className="text-xl">{cat.icon}</span>
                            <div className="flex-1">
                                <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#5DCAA5]' : 'text-[#FAF9F5]'}`}>
                                    {cat.label}
                                </p>
                            </div>
                            {isSelected && <Check size={14} className="text-[#1D9E75] shrink-0" />}
                        </button>
                    );
                })}
            </div>
            {/* BOTÓN EXTRA: OFREZCO EMPLEO */}
            <div className="mt-2">
                <button
                    type="button"
                    onClick={() => onNext({ habilidades: ['reclutador'] })} // Enviamos una marca especial
                    className="w-full p-4 rounded-2xl border-2 border-dashed border-[#1D9E75]/30 bg-[#1D9E75]/5 hover:bg-[#1D9E75]/10 hover:border-[#1D9E75] transition-all flex items-center justify-center gap-3 group"
                >
                    <span className="text-xl group-hover:scale-110 transition-transform">💼</span>
                    <div className="text-left">
                        <p className="text-[#FAF9F5] text-lg font-bold">No busco, quiero contratar</p>
                        <p className="text-[#5DCAA5] text-[10px]">Publicar vacantes en Raíces</p>
                    </div>
                </button>
            </div>


            {/* nota rapida*/}
            <div className="mt-2 p-4 bg-[#262624] rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                    <Star size={16} className="text-[#1D9E75]" />
                    <span className="text-[#FAF9F5] text-xs font-semibold">Añade una nota rápida</span>
                </div>
                <textarea
                    placeholder="Ej: 5 años de experiencia en cocina italiana..."
                    className="w-full bg-transparent border-none text-[#FAF9F5] text-sm placeholder-[#9C9A92] focus:ring-0 resize-none h-16"
                />
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-4 pt-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 text-[#C2C0B6] hover:text-white text-sm font-medium transition-colors"
                >
                    <ArrowLeft size={16} /> Atrás
                </button>

                <Button
                    variant="primary"
                    disabled={!isComplete}
                    onClick={() => onNext({ habilidades: seleccionados })}
                    className="flex-1 py-4 rounded-2xl bg-[#1D9E75] text-white font-bold"
                >
                    Siguiente <ArrowRight size={18} />
                </Button>
            </div>
        </div>
    );
};

export default StepLaboral;
import { useState, type ChangeEvent } from 'react';
import { Camera, CheckCircle, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import Button from "../../../components/common/Button";

// Definimos una interfaz para los datos de las fotos
interface IdentityPhotos {
    frontal: string | null;
    selfie: string | null;
}

interface StepProps {
    // Reemplazamos 'any' por la interfaz que definimos arriba
    onNext: (data: IdentityPhotos) => void;
    onBack: () => void;
}

const StepIdentidad = ({ onNext, onBack }: StepProps) => {
    const [preview, setPreview] = useState<IdentityPhotos>({
        frontal: null,
        selfie: null
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, id: keyof IdentityPhotos) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Validación: Solo permitir imágenes (jpg, png, webp)
        if (!file.type.startsWith('image/')) {
            alert("Por favor, sube una imagen válida (JPG o PNG)");
            return;
        }

        // Validación: Tamaño máximo 5MB
        if (file.size > 5 * 1024 * 1024) {
            alert("La imagen es demasiado pesada. Máximo 5MB");
            return;
        }

        const url = URL.createObjectURL(file);
        setPreview(prev => ({ ...prev, [id]: url }));
    };

    const isComplete = !!(preview.frontal && preview.selfie);

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h2 className="text-[#FAF9F5] font-serif text-2xl font-semibold">Verifica tu identidad</h2>
                <p className="text-[#C2C0B6] text-sm mt-2">Necesitamos confirmar que eres tú.</p>
            </div>

            {/* USO DE 'Info': Bloque informativo */}
            <div className="bg-[#1D9E75]/10 border border-[#1D9E75]/30 rounded-xl p-4 flex gap-3">
                <Info className="text-[#1D9E75] shrink-0" size={20} />
                <p className="text-[#9FE1CB] text-[11px] leading-relaxed">
                    Asegúrate de que el documento se lea claramente y no haya reflejos.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {(['frontal', 'selfie'] as const).map((id) => (
                    <div key={id} className="flex flex-col gap-2">
                        <label className="text-[#C2C0B6] text-xs font-medium ml-1">
                            {id === 'frontal' ? 'Lado frontal del documento' : 'Selfie con tu documento'}
                        </label>

                        <label className={`relative overflow-hidden h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer 
                            ${preview[id] ? 'border-[#1D9E75] bg-[#1D9E75]/5' : 'border-white/10 bg-[#262624] hover:border-white/30'}`}>

                            {/* USO DE 'handleFileChange' */}
                            <input
                                type="file"
                                accept="image/*"
                                capture={id === 'selfie' ? 'user' : 'environment'}
                                className="hidden"
                                onChange={(e) => handleFileChange(e, id)}
                            />

                            {preview[id] ? (
                                <>
                                    <img src={preview[id]!} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                                    <div className="z-10 flex flex-col items-center">
                                        {/* USO DE 'CheckCircle' */}
                                        <CheckCircle className="text-[#5DCAA5] mb-1" size={28} />
                                        <span className="text-white text-[11px] font-medium">Foto capturada</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* USO DE 'Camera' */}
                                    <Camera className="text-[#9C9A92] mb-1" size={24} />
                                    <span className="text-[#9C9A92] text-[11px]">Toca para capturar</span>
                                </>
                            )}
                        </label>
                    </div>
                ))}
            </div>

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
                    onClick={() => onNext(preview)}
                    className="flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                    Continuar <ArrowRight size={18} />
                </Button>
            </div>
        </div>
    );
};

export default StepIdentidad;
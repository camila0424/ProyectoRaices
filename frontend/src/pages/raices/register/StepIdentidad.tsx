import { useState, type ChangeEvent } from 'react';
import { Camera, CheckCircle, ArrowRight, ArrowLeft, Info, FileText } from 'lucide-react';

interface IdentityPhotos {
    frontal: string | null;
    selfie: string | null;
}

interface IdentityData {
    frontal: string | null;
    selfie: string | null;
    nie: string;
}

interface StepProps {
    onNext: (data: IdentityData) => void;
    onBack: () => void;
}

function StepIdentidad({ onNext, onBack }: StepProps) {

    const [preview, setPreview] = useState<IdentityPhotos>({
        frontal: null,
        selfie: null
    });

    const [nie, setNie] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const nieRegex = /^[XYZ]\d{7}[A-Z]$/i;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, id: keyof IdentityPhotos) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({ ...prev, [id]: "Archivo no válido" }));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, [id]: "Máximo 5MB" }));
            return;
        }

        const url = URL.createObjectURL(file);
        setPreview(prev => ({ ...prev, [id]: url }));
        setErrors(prev => ({ ...prev, [id]: "" }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!nieRegex.test(nie)) {
            newErrors.nie = "NIE/TIE inválido";
        }

        if (!preview.frontal) {
            newErrors.frontal = "Sube tu documento";
        }

        if (!preview.selfie) {
            newErrors.selfie = "Sube tu selfie";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className="flex flex-col gap-6">

            {/* HEADER */}
            <div className="text-center">
                <h2 className="text-[#FAF9F5] text-2xl font-semibold">
                    Verifica tu identidad
                </h2>
                <p className="text-[#C2C0B6] text-sm mt-2">
                    Necesitamos confirmar que eres tú
                </p>
            </div>

            {/* INFO */}
            <div className="bg-[#1D9E75]/10 border border-[#1D9E75]/30 rounded-xl p-4 flex gap-3">
                <Info className="text-[#1D9E75]" size={20} />
                <p className="text-[#9FE1CB] text-xs">
                    Asegúrate de que el documento sea legible y sin reflejos
                </p>
            </div>

            {/* NIE INPUT */}
            <div>
                <label className="text-[#C2C0B6] text-xs ml-1">
                    NIE / TIE
                </label>

                <div className={`flex items-center gap-3 mt-1 p-3 rounded-xl border
                    ${errors.nie ? 'border-red-500 bg-red-500/5' : 'border-white/10 bg-[#262624]'}
                `}>
                    <div className="p-2 rounded-full bg-[#1D9E75]/10">
                        <FileText className="text-[#1D9E75]" size={18} />
                    </div>

                    <input
                        value={nie}
                        onChange={(e) => {
                            setNie(e.target.value.toUpperCase());
                            setErrors(prev => ({ ...prev, nie: "" }));
                        }}
                        placeholder="Ej: X1234567A"
                        className="w-full bg-transparent text-white outline-none"
                    />
                </div>

                {errors.nie && (
                    <p className="text-red-400 text-xs mt-1">{errors.nie}</p>
                )}
            </div>

            {/* UPLOADS */}
            <div className="grid gap-4">
                {(['frontal', 'selfie'] as const).map((id) => {
                    const hasError = errors[id];
                    const hasImage = preview[id];

                    return (
                        <div key={id} className="flex flex-col gap-2">

                            <label className="text-[#C2C0B6] text-xs ml-1">
                                {id === 'frontal'
                                    ? 'Documento (frontal)'
                                    : 'Selfie con documento'}
                            </label>

                            <label className={`relative h-32 rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer
                                ${hasError
                                    ? 'border-red-500 bg-red-500/5'
                                    : hasImage
                                        ? 'border-[#1D9E75] bg-[#1D9E75]/5'
                                        : 'border-white/10 bg-[#262624]'
                                }`}>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, id)}
                                />

                                {hasImage ? (
                                    <>
                                        <img
                                            src={preview[id]!}
                                            className="absolute inset-0 w-full h-full object-cover opacity-40"
                                        />
                                        <div className="z-10 flex flex-col items-center">
                                            <CheckCircle className="text-[#5DCAA5]" size={28} />
                                            <span className="text-white text-xs">
                                                Imagen subida
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Camera className="text-[#9C9A92]" size={24} />
                                        <span className="text-[#9C9A92] text-xs">
                                            Toca para subir
                                        </span>
                                    </div>
                                )}
                            </label>

                            {hasError && (
                                <p className="text-red-400 text-xs ml-1">{hasError}</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-4 pt-4">

                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-[#C2C0B6] hover:text-white text-sm"
                >
                    <ArrowLeft size={16} />
                    Atrás
                </button>

                <button
                    onClick={() => {
                        if (!validate()) return;
                        onNext({ ...preview, nie });
                    }}
                    className="flex-1 py-4 rounded-xl bg-[#1D9E75] text-white font-bold flex items-center justify-center gap-2"
                >
                    Continuar
                    <ArrowRight size={18} />
                </button>
            </div>

        </div>
    );
}

export default StepIdentidad;
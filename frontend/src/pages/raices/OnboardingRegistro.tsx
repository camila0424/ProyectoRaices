import { Link } from 'react-router-dom';
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import { paisesOrigen, ciudadesEspana } from "../../data/locationData";

// Clases compartidas para adaptar los componentes al tema oscuro del onboarding
const darkInputClass =
    "[&_input]:bg-[#262624] [&_input]:border-white/20 [&_input]:text-[#FAF9F5] [&_input]:placeholder-[#9C9A92] [&_input]:rounded-lg [&_input]:focus:border-[#1D9E75] [&_input]:focus:ring-[#1D9E75] [&_label]:text-[#C2C0B6]";

const darkSelectClass =
    "[&_select]:bg-[#262624] [&_select]:border-white/20 [&_select]:text-[#FAF9F5] [&_select]:rounded-lg [&_select]:focus:border-[#1D9E75] [&_select]:focus:ring-[#1D9E75] [&_label]:text-[#C2C0B6] [&_.pointer-events-none]:text-[#C2C0B6]";

// Emoji de bandera a partir del código ISO de 2 letras
const flagEmoji = (code: string) =>
    code
        .toUpperCase()
        .split("")
        .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
        .join("");

function OnboardingRegistro() {
    return (
        <>
            <div className="flex min-h-screen bg-[#141413] font-sans">
                {/* Left Panel - Branding & Steps */}
                <aside className="w-60 shrink-0 bg-[#04342C] flex flex-col px-5 py-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 mb-10 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-[#1D9E75] flex items-center justify-center">
                            <span className="text-white font-bold font-serif text-base">R</span>
                        </div>
                        <span className="text-white font-semibold font-serif text-base">Raíces</span>
                    </Link>

                    {/* Progress Steps */}
                    <p className="text-[#9FE1CB] text-[11px] font-medium tracking-wide uppercase mb-4">
                        Tu registro
                    </p>

                    <div className="flex flex-col gap-0">
                        {/* Step 1 - Active */}
                        <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                                <div className="w-7 h-7 rounded-full bg-[#1D9E75] flex items-center justify-center shrink-0">
                                    <span className="text-white text-[11px]">1</span>
                                </div>
                                <div className="w-px flex-1 border-l border-dashed border-[#1D9E75] my-1 h-6" />
                            </div>
                            <div className="pt-0.5">
                                <p className="text-white text-[13px] font-medium leading-tight">Datos básicos</p>
                                <p className="text-[#5DCAA5] text-[11px] mt-0.5">Nombre, país, ciudad</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                                <div className="w-7 h-7 rounded-full border border-[#5DCAA5] flex items-center justify-center shrink-0">
                                    <span className="text-[#5DCAA5] text-[11px]">2</span>
                                </div>
                                <div className="w-px flex-1 border-l border-dashed border-[#5DCAA5]/50 my-1 h-6" />
                            </div>
                            <div className="pt-0.5">
                                <p className="text-[#9FE1CB] text-[13px] leading-tight">Documentación</p>
                                <p className="text-[#5DCAA5] text-[11px] mt-0.5">NIE, TIE o permiso</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-start gap-3 opacity-70">
                            <div className="flex flex-col items-center">
                                <div className="w-7 h-7 rounded-full border border-[#5DCAA5]/50 flex items-center justify-center shrink-0">
                                    <span className="text-[#5DCAA5] text-[11px]">3</span>
                                </div>
                                <div className="w-px flex-1 border-l border-dashed border-[#5DCAA5]/30 my-1 h-6" />
                            </div>
                            <div className="pt-0.5">
                                <p className="text-[#9FE1CB] text-[13px] leading-tight">Tu perfil laboral</p>
                                <p className="text-[#5DCAA5] text-[11px] mt-0.5">Habilidades y metas</p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex items-start gap-3 opacity-30">
                            <div className="flex flex-col items-center">
                                <div className="w-7 h-7 rounded-full border border-[#5DCAA5]/30 flex items-center justify-center shrink-0">
                                    <span className="text-[#5DCAA5] text-[11px]">4</span>
                                </div>
                            </div>
                            <div className="pt-0.5">
                                <p className="text-[#9FE1CB] text-[13px] leading-tight">Tipo de usuario</p>
                                <p className="text-[#5DCAA5] text-[11px] mt-0.5">Busco / Ofrezco</p>
                            </div>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Quote block */}
                    <div className="bg-[#085041] rounded-xl p-4">
                        <span className="text-[#1D9E75] font-serif text-3xl leading-none">"</span>
                        <p className="text-[#9FE1CB] text-[11px] leading-relaxed mt-1">
                            Llegué sin red y sin conocidos. Raíces me conectó en 3 días.
                        </p>
                        <p className="text-[#5DCAA5] text-[10px] font-medium mt-3">— Carlos M., Colombia</p>
                        <p className="text-[#5DCAA5] text-[10px]">Madrid · Hostelería</p>
                    </div>
                </aside>

                {/* Main Form Panel */}
                <main className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full max-w-md bg-[#30302E] border border-white/10 rounded-2xl p-8">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <h1 className="text-[#FAF9F5] font-serif text-2xl font-semibold">Crea tu perfil</h1>
                            <p className="text-[#C2C0B6] text-[13px] mt-1">Paso 1 de 4 — Datos básicos</p>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-1 bg-[#262624] rounded-full mb-6">
                            <div className="h-1 bg-[#1D9E75] rounded-full w-1/4" />
                        </div>

                        {/* Form */}
                        <div className="flex flex-col gap-4">
                            {/* Nombre completo */}
                            <Input
                                label="Nombre completo"
                                type="text"
                                defaultValue="Escribe tu nombre aquí"
                                className={darkInputClass}
                            />

                            {/* Correo electrónico */}
                            <Input
                                label="Correo electrónico"
                                type="email"
                                placeholder="tu@correo.com"
                                className={darkInputClass}
                            />

                            {/* Teléfono */}
                            <div>
                                <label className="mb-1 text-sm font-medium text-[#C2C0B6] block">
                                    Teléfono (WhatsApp)
                                </label>
                                <div className="flex gap-2">
                                    <div className="w-20 bg-[#262624] border border-white/20 rounded-lg px-3 py-2 text-[#C2C0B6] text-[12px] flex items-center justify-center shrink-0">
                                        +34
                                    </div>
                                    <Input
                                        type="tel"
                                        placeholder="600 000 000"
                                        className={`flex-1 ${darkInputClass}`}
                                    />
                                </div>
                            </div>

                            {/* País y Ciudad */}
                            <div className="flex gap-3">
                                {/* País de origen */}
                                <Select
                                    label="País de origen"
                                    className={`flex-1 ${darkSelectClass}`}
                                >
                                    <option value="">Selecciona...</option>
                                    {paisesOrigen.map((pais) => (
                                        <option key={pais.code} value={pais.code}>
                                            {flagEmoji(pais.code)} {pais.name}
                                        </option>
                                    ))}
                                </Select>

                                {/* Ciudad en España — agrupada por provincia */}
                                <Select
                                    label="Ciudad en España"
                                    className={`flex-1 ${darkSelectClass}`}
                                >
                                    <option value="">Selecciona...</option>
                                    {ciudadesEspana.map((grupo) => (
                                        <optgroup key={grupo.provincia} label={grupo.provincia}>
                                            {grupo.ciudades.map((ciudad) => (
                                                <option key={ciudad} value={ciudad}>
                                                    {ciudad}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </Select>
                            </div>

                            {/* ¿Qué buscas? */}
                            <div>
                                <p className="mb-2 text-sm font-medium text-[#C2C0B6]">¿Qué buscas en Raíces?</p>
                                <div className="flex gap-3">
                                    {/* Busco empleo - selected */}
                                    <button className="relative flex-1 bg-[#E1F5EE] border-2 border-[#1D9E75] rounded-xl py-4 flex flex-col items-center gap-1 cursor-pointer">
                                        <span className="text-2xl">🔍</span>
                                        <span className="text-[#085041] text-[13px] font-medium">Busco empleo</span>
                                        <span className="text-[#0F6E56] text-[11px]">Tengo documentación</span>
                                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#1D9E75] flex items-center justify-center">
                                            <span className="text-white text-[10px]">✓</span>
                                        </div>
                                    </button>
                                    {/* Ofrezco trabajo */}
                                    <button className="flex-1 bg-[#262624] border border-white/10 rounded-xl py-4 flex flex-col items-center gap-1 cursor-pointer hover:border-[#1D9E75]/40 transition-colors">
                                        <span className="text-2xl">💼</span>
                                        <span className="text-[#FAF9F5] text-[13px] font-medium">Ofrezco trabajo</span>
                                        <span className="text-[#C2C0B6] text-[11px]">Dueño o referente</span>
                                    </button>
                                </div>
                            </div>

                            {/* Privacy note */}
                            <div className="bg-[#E1F5EE] rounded-xl px-4 py-3">
                                <p className="text-[#0F6E56] text-[11px] font-medium">🔒 Tu información está protegida</p>
                                <p className="text-[#1D9E75] text-[10px] mt-1 leading-relaxed">
                                    Solo verificamos que tienes documentación legal. No compartimos tus datos con
                                    terceros ni con empleadores sin tu permiso.
                                </p>
                            </div>

                            {/* Terms checkbox */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <div className="w-3.5 h-3.5 rounded-sm bg-[#1D9E75] flex items-center justify-center shrink-0">
                                    <span className="text-white text-[8px]">✓</span>
                                </div>
                                <span className="text-[#C2C0B6] text-[11px]">
                                    Acepto los términos de uso y la política de privacidad
                                </span>
                            </label>

                            {/* Submit button */}
                            <Button
                                variant="primary"
                                size="lg"
                                iconRight={<span>→</span>}
                                className="w-full rounded-xl bg-[#1D9E75] hover:bg-[#17876A] focus:ring-[#1D9E75] justify-center"
                            >
                                Continuar: Verificar documentación
                            </Button>
                        </div>

                        {/* Login link */}
                        <p className="text-center text-[#C2C0B6] text-[12px] mt-4">
                            ¿Ya tienes cuenta?{" "}
                            <a href="#" className="text-[#1D9E75] hover:underline">
                                Inicia sesión
                            </a>
                        </p>

                        {/* Social login */}
                        <div className="mt-3">
                            <p className="text-center text-[#9C9A92] text-[11px] mb-3">— o regístrate con —</p>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 bg-[#262624] border-white/10 text-[#FAF9F5] hover:bg-[#2e2e2c] hover:border-white/20 focus:ring-0 rounded-lg justify-center"
                                >
                                    G &nbsp; Continuar con Google
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 bg-[#262624] border-white/10 text-[#FAF9F5] hover:bg-[#2e2e2c] hover:border-white/20 focus:ring-0 rounded-lg justify-center"
                                >
                                    📘 &nbsp; Facebook
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default OnboardingRegistro;


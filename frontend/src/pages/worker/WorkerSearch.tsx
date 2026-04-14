import { useState, useEffect } from "react";
import { ciudadesEspana } from "../../data/locationData";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type TipoContrato = "full_time" | "part_time" | "temporary" | "freelance" | "internship";
type Tab = "empleos" | "aplicaciones" | "guardados" | "recursos";
type RecursosSeccion = "entidades" | "ninos" | "demanda" | "primeros";

interface Empleo {
    id: string;
    titulo: string;
    employer_nombre: string;
    ciudad: string;
    sector: string;
    contract_type: TipoContrato;
    descripcion: string;
    created_at: string;
    vacancies: number;
    applications_count: number;
}

interface Aplicacion {
    id: number;
    status: "pending" | "accepted" | "rejected" | "withdrawn";
    cover_note: string;
    created_at: string;
    titulo: string;
    empresa: string;
    ciudad: string;
}

// ─── Static lookup tables ─────────────────────────────────────────────────────

const SECTORES = [
    "Hostelería", "Construcción", "Limpieza", "Cuidado de personas",
    "Logística", "Comercio", "Administración", "Tecnología",
    "Agricultura", "Educación", "Salud", "Seguridad", "Otro",
];

const contratoLabel: Record<TipoContrato, string> = {
    full_time: "Jornada completa",
    part_time: "Media jornada",
    temporary: "Temporal",
    freelance: "Por horas",
    internship: "Prácticas",
};

const contratoColor: Record<TipoContrato, string> = {
    full_time: "bg-green-500/20 text-green-300",
    part_time: "bg-yellow-500/20 text-yellow-300",
    temporary: "bg-orange-500/20 text-orange-300",
    freelance: "bg-blue-500/20 text-blue-300",
    internship: "bg-purple-500/20 text-purple-300",
};

const estadoLabel: Record<Aplicacion["status"], string> = {
    pending: "Pendiente",
    accepted: "Aceptado",
    rejected: "No seleccionado",
    withdrawn: "Retirada",
};

const estadoColor: Record<Aplicacion["status"], string> = {
    pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    accepted: "bg-green-500/20 text-green-300 border-green-500/30",
    rejected: "bg-red-500/20 text-red-300 border-red-500/30",
    withdrawn: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const demandaColor: Record<string, string> = {
    "Muy alta": "bg-red-500/20 text-red-300",
    "Alta": "bg-orange-500/20 text-orange-300",
    "Media": "bg-blue-500/20 text-blue-300",
    "Baja": "bg-gray-500/20 text-gray-400",
};

// ─── Resources data ───────────────────────────────────────────────────────────

const ENTIDADES = [
    {
        nombre: "Lanbide",
        subtitulo: "Servicio Vasco de Empleo",
        descripcion: "Gestiona el empleo y la formación profesional en Euskadi. Ofrece orientación laboral, cursos gratuitos, gestión del paro y apoyo a la búsqueda de trabajo.",
        url: "https://www.lanbide.euskadi.eus",
        telefono: "945 160 600",
        tipo: "Empleo y formación",
        region: "País Vasco",
        icono: "💼",
        servicios: ["Orientación laboral", "Cursos de formación", "Gestión del paro", "Intermediación laboral"],
    },
    {
        nombre: "SEPE",
        subtitulo: "Servicio Público de Empleo Estatal",
        descripcion: "Organismo estatal que gestiona las prestaciones por desempleo, formación para el empleo y la intermediación laboral en toda España.",
        url: "https://www.sepe.es",
        telefono: "901 119 999",
        tipo: "Empleo y prestaciones",
        region: "Nacional",
        icono: "🏛️",
        servicios: ["Prestación por desempleo", "Formación", "Bolsa de trabajo", "Certificados profesionales"],
    },
    {
        nombre: "Extranjería",
        subtitulo: "Oficina de Extranjería – Delegación del Gobierno",
        descripcion: "Tramita permisos de residencia y trabajo, renovaciones de NIE, reagrupación familiar y demás gestiones para extranjeros en España.",
        url: "https://extranjeros.inclusion.gob.es",
        telefono: "060",
        tipo: "Trámites legales",
        region: "Nacional",
        icono: "📋",
        servicios: ["NIE y TIE", "Permiso de trabajo", "Residencia legal", "Reagrupación familiar"],
    },
    {
        nombre: "Cruz Roja Española",
        subtitulo: "Organización humanitaria",
        descripcion: "Ofrece programas de integración sociolaboral para inmigrantes: formación en idiomas, orientación legal, talleres de empleo y apoyo psicosocial.",
        url: "https://www.cruzroja.es",
        telefono: "902 222 292",
        tipo: "Integración social",
        region: "Nacional",
        icono: "🏥",
        servicios: ["Formación en idiomas", "Orientación legal", "Talleres de empleo", "Apoyo psicosocial"],
    },
    {
        nombre: "Cáritas Española",
        subtitulo: "Entidad de acción social de la Iglesia Católica",
        descripcion: "Ayuda a personas en situación de vulnerabilidad ofreciendo apoyo económico, orientación, acceso a vivienda y programas de inserción laboral.",
        url: "https://www.caritas.es",
        telefono: "91 444 10 00",
        tipo: "Acción social",
        region: "Nacional",
        icono: "🤝",
        servicios: ["Apoyo económico", "Acceso a vivienda", "Inserción laboral", "Orientación social"],
    },
    {
        nombre: "Susenean",
        subtitulo: "Programa de integración social – Euskadi",
        descripcion: "Iniciativa del Gobierno Vasco que apoya a familias y personas en situación de vulnerabilidad, con atención especial a personas migrantes en proceso de integración.",
        url: "https://www.euskadi.eus/servicios-sociales",
        telefono: "012",
        tipo: "Servicios sociales",
        region: "País Vasco",
        icono: "🏠",
        servicios: ["Apoyo a familias", "Integración social", "Acceso a servicios básicos", "Atención a vulnerables"],
    },
    {
        nombre: "ACCEM",
        subtitulo: "Asociación para la integración de migrantes",
        descripcion: "Trabaja por la integración social y laboral de personas migrantes y refugiadas en España, con programas de empleo, vivienda y acompañamiento.",
        url: "https://www.accem.es",
        telefono: "91 448 12 34",
        tipo: "Integración de migrantes",
        region: "Nacional",
        icono: "🌍",
        servicios: ["Inserción laboral", "Apoyo a refugiados", "Acceso a vivienda", "Formación profesional"],
    },
    {
        nombre: "CEAR",
        subtitulo: "Comisión Española de Ayuda al Refugiado",
        descripcion: "Defiende los derechos de personas refugiadas y migrantes, ofreciendo asistencia jurídica, social, psicológica y apoyo en la búsqueda de empleo.",
        url: "https://www.cear.es",
        telefono: "91 598 05 35",
        tipo: "Derechos y refugio",
        region: "Nacional",
        icono: "⚖️",
        servicios: ["Asistencia jurídica", "Apoyo psicológico", "Búsqueda de empleo", "Acogida humanitaria"],
    },
    {
        nombre: "Red Acoge",
        subtitulo: "Federación de asociaciones pro inmigrantes",
        descripcion: "Red de organizaciones que trabajan por la acogida e integración de personas inmigrantes. Ofrecen asesoría jurídica, orientación laboral y formación.",
        url: "https://www.redacoge.org",
        telefono: "91 532 03 49",
        tipo: "Integración de migrantes",
        region: "Nacional",
        icono: "🫂",
        servicios: ["Asesoría jurídica", "Orientación laboral", "Formación", "Apoyo a la acogida"],
    },
    {
        nombre: "Médicos del Mundo",
        subtitulo: "Organización humanitaria de salud",
        descripcion: "Garantiza el acceso a la salud de personas en situación de vulnerabilidad, incluyendo migrantes sin tarjeta sanitaria o en situación irregular.",
        url: "https://www.medicosdelmundo.org",
        telefono: "91 543 90 69",
        tipo: "Salud",
        region: "Nacional",
        icono: "🩺",
        servicios: ["Atención sanitaria", "Salud mental", "Apoyo a irregulares", "Acompañamiento médico"],
    },
];

const AYUDAS_NINOS = [
    {
        nombre: "Beca de comedor escolar",
        descripcion: "Cubre total o parcialmente el coste del servicio de comedor en centros escolares públicos y concertados durante el curso escolar.",
        gestiona: "Comunidad Autónoma o municipio",
        requisitos: "Renta familiar inferior al umbral establecido por cada CCAA. Se solicita al inicio del curso.",
        icono: "🍽️",
        tipo: "Educación",
    },
    {
        nombre: "Ayuda por hijo a cargo",
        descripcion: "Prestación económica de la Seguridad Social para familias con hijos menores de 18 años a cargo. Sin límite de edad si el hijo tiene discapacidad.",
        gestiona: "Seguridad Social (IMSERSO)",
        requisitos: "Ingresos anuales por debajo del límite establecido y residencia legal en España.",
        icono: "👶",
        tipo: "Prestación económica",
    },
    {
        nombre: "Cheque guardería / Ayuda 0-3 años",
        descripcion: "Subvención para el primer ciclo de educación infantil (0 a 3 años). Puede cubrir parte o la totalidad de la cuota mensual.",
        gestiona: "Comunidad Autónoma",
        requisitos: "Residencia en la CCAA y cumplir los criterios económicos establecidos.",
        icono: "🏫",
        tipo: "Educación",
    },
    {
        nombre: "Libros de texto gratuitos",
        descripcion: "Entrega o préstamo gratuito de libros de texto para Educación Primaria y ESO en centros públicos.",
        gestiona: "Comunidad Autónoma",
        requisitos: "Matriculación en centro público. En algunas CCAA se amplía a centros concertados.",
        icono: "📚",
        tipo: "Educación",
    },
    {
        nombre: "Beca general MEC",
        descripcion: "Becas del Ministerio de Educación para estudios postobligatorios: Bachillerato, FP, Grado Universitario.",
        gestiona: "Ministerio de Educación y Formación Profesional",
        requisitos: "Criterios académicos y económicos. Residencia legal en España.",
        icono: "🎓",
        tipo: "Educación superior",
    },
    {
        nombre: "Bono Social de Electricidad",
        descripcion: "Descuento del 25% al 40% en la factura de la luz para familias vulnerables o numerosas con hijos menores.",
        gestiona: "Comercializadora de referencia (Endesa, Iberdrola...)",
        requisitos: "Familia numerosa, monoparental o unidad familiar con todos sus miembros desempleados.",
        icono: "⚡",
        tipo: "Suministros básicos",
    },
    {
        nombre: "Renta Garantizada de Ciudadanía",
        descripcion: "Renta mínima de inserción para familias en situación de pobreza. Incluye complemento adicional por hijos menores a cargo.",
        gestiona: "Comunidad Autónoma",
        requisitos: "Residencia mínima (generalmente 1 año continuado) y situación de necesidad económica acreditada.",
        icono: "💰",
        tipo: "Prestación económica",
    },
    {
        nombre: "Ayuda al material escolar",
        descripcion: "Subsidio para la compra de material escolar (cuadernos, estuches, mochilas) al inicio del curso.",
        gestiona: "Municipio o Comunidad Autónoma",
        requisitos: "Residencia en el municipio y nivel de renta familiar bajo.",
        icono: "✏️",
        tipo: "Educación",
    },
    {
        nombre: "Actividades extraescolares gratuitas",
        descripcion: "Programas municipales de deporte, música, idiomas y actividades culturales para niños de familias con recursos limitados.",
        gestiona: "Ayuntamiento",
        requisitos: "Empadronamiento en el municipio y acreditación de situación económica.",
        icono: "⚽",
        tipo: "Ocio y cultura",
    },
];

const EMPLEOS_DEMANDADOS = [
    {
        zona: "Madrid",
        icono: "🏙️",
        descripcion: "Capital y principal hub laboral de España",
        sectores: [
            { nombre: "Tecnología e IT", demanda: "Muy alta" },
            { nombre: "Hostelería y restauración", demanda: "Alta" },
            { nombre: "Seguridad y vigilancia", demanda: "Alta" },
            { nombre: "Logística y reparto", demanda: "Alta" },
            { nombre: "Limpieza y mantenimiento", demanda: "Media" },
        ],
    },
    {
        zona: "Cataluña (Barcelona)",
        icono: "🏗️",
        descripcion: "Motor industrial y turístico del nordeste",
        sectores: [
            { nombre: "Hostelería y turismo", demanda: "Muy alta" },
            { nombre: "Construcción", demanda: "Alta" },
            { nombre: "Transporte y logística", demanda: "Alta" },
            { nombre: "Cuidado de personas", demanda: "Alta" },
            { nombre: "Comercio", demanda: "Media" },
        ],
    },
    {
        zona: "País Vasco",
        icono: "🏭",
        descripcion: "Industria, servicios avanzados y bienestar social",
        sectores: [
            { nombre: "Industria del metal", demanda: "Muy alta" },
            { nombre: "Construcción y obras", demanda: "Alta" },
            { nombre: "Cuidado de mayores", demanda: "Alta" },
            { nombre: "Tecnología industrial", demanda: "Alta" },
            { nombre: "Hostelería", demanda: "Media" },
        ],
    },
    {
        zona: "Comunitat Valenciana",
        icono: "🌊",
        descripcion: "Turismo, agricultura y sector servicios",
        sectores: [
            { nombre: "Turismo y hostelería", demanda: "Muy alta" },
            { nombre: "Agricultura", demanda: "Alta" },
            { nombre: "Logística", demanda: "Alta" },
            { nombre: "Construcción", demanda: "Media" },
            { nombre: "Comercio", demanda: "Media" },
        ],
    },
    {
        zona: "Andalucía",
        icono: "☀️",
        descripcion: "Turismo, agricultura y servicios",
        sectores: [
            { nombre: "Turismo y hostelería", demanda: "Muy alta" },
            { nombre: "Agricultura y campo", demanda: "Muy alta" },
            { nombre: "Limpieza", demanda: "Alta" },
            { nombre: "Cuidado de personas", demanda: "Alta" },
            { nombre: "Construcción", demanda: "Media" },
        ],
    },
    {
        zona: "Canarias",
        icono: "🌴",
        descripcion: "Turismo todo el año, sin estacionalidad",
        sectores: [
            { nombre: "Turismo y hostelería", demanda: "Muy alta" },
            { nombre: "Limpieza de hoteles", demanda: "Alta" },
            { nombre: "Transporte turístico", demanda: "Alta" },
            { nombre: "Comercio", demanda: "Media" },
            { nombre: "Construcción", demanda: "Media" },
        ],
    },
    {
        zona: "Aragón / Navarra",
        icono: "🌾",
        descripcion: "Logística, industria agroalimentaria y agricultura",
        sectores: [
            { nombre: "Logística y almacén", demanda: "Muy alta" },
            { nombre: "Industria agroalimentaria", demanda: "Alta" },
            { nombre: "Agricultura", demanda: "Alta" },
            { nombre: "Transporte", demanda: "Alta" },
            { nombre: "Construcción", demanda: "Media" },
        ],
    },
    {
        zona: "Murcia",
        icono: "🍅",
        descripcion: "Agricultura intensiva e industria conservera",
        sectores: [
            { nombre: "Agricultura intensiva", demanda: "Muy alta" },
            { nombre: "Industria conservera", demanda: "Alta" },
            { nombre: "Limpieza", demanda: "Alta" },
            { nombre: "Hostelería", demanda: "Media" },
            { nombre: "Construcción", demanda: "Media" },
        ],
    },
];

// ─── Primeros pasos data ──────────────────────────────────────────────────────

const PRIMEROS_PASOS = [
    {
        paso: "01",
        titulo: "Empadronarte",
        icono: "📍",
        descripcion: "Es lo primero y más importante. Sin padrón no puedes acceder a servicios sociales, sanitarios ni educativos.",
        como: "Ve al Ayuntamiento de tu ciudad (o pide cita online) con tu pasaporte y un justificante de domicilio: contrato de alquiler, carta firmada del propietario o incluso una factura a tu nombre.",
        importante: "El empadronamiento es gratuito y no te pone en ninguna lista migratoria negativa. Es un derecho.",
        enlace: "https://www.padron.es",
        enlaceTexto: "Consultar Ayuntamiento",
    },
    {
        paso: "02",
        titulo: "Solicitar el NIE / TIE",
        icono: "📋",
        descripcion: "El NIE (Número de Identificación de Extranjero) es tu número fiscal en España. Lo necesitarás para trabajar, abrir una cuenta y cualquier trámite oficial.",
        como: "Pide cita previa en la Oficina de Extranjería o en la Comisaría de Policía Nacional de tu provincia. Lleva: pasaporte original + fotocopia, formulario EX-15, fotografía de carné, y abona la tasa 790-012 (≈ 12 €) en cualquier banco.",
        importante: "Las citas pueden tardar semanas o meses. Pídela lo antes posible y mientras tanto puedes usar tu pasaporte para muchos trámites.",
        enlace: "https://extranjeros.inclusion.gob.es",
        enlaceTexto: "Oficina de Extranjería",
    },
    {
        paso: "03",
        titulo: "Tarjeta sanitaria (SIP)",
        icono: "🏥",
        descripcion: "Con el padrón municipal puedes solicitar tu tarjeta sanitaria de la Seguridad Social. Es gratuita y te da acceso a médico de cabecera, urgencias y especialistas.",
        como: "Acude a tu centro de salud más cercano con el volante de empadronamiento y tu pasaporte o NIE. En el País Vasco, también puedes solicitarla en Osakidetza.",
        importante: "Tus hijos menores también tienen derecho a tarjeta sanitaria una vez empadronados, independientemente de su situación administrativa.",
        enlace: "https://www.seguridadsocial.es",
        enlaceTexto: "Seguridad Social",
    },
    {
        paso: "04",
        titulo: "Inscribirte en Lanbide o SEPE",
        icono: "💼",
        descripcion: "Registrarte como demandante de empleo te da acceso a cursos de formación gratuitos, ofertas de trabajo y, cuando cumplas los requisitos, prestaciones por desempleo.",
        como: "En Euskadi ve a Lanbide (lanbide.euskadi.eus) o a tu oficina más cercana. En el resto de España, acude al SEPE (sepe.es). Lleva: NIE o pasaporte, padrón y tu CV si lo tienes.",
        importante: "Aunque no busques empleo activamente, inscribirte en Lanbide/SEPE te abre la puerta a cursos de castellano, informática, hostelería y muchos más — totalmente gratis.",
        enlace: "https://www.lanbide.euskadi.eus",
        enlaceTexto: "Ir a Lanbide",
    },
    {
        paso: "05",
        titulo: "Abrir cuenta bancaria",
        icono: "🏦",
        descripcion: "Necesitarás una cuenta para recibir tu nómina, pagar el alquiler y hacer transferencias. Sin cuenta bancaria en España es muy difícil trabajar.",
        como: "Ve a cualquier banco con tu pasaporte/NIE y padrón. Algunos bancos como CaixaBank, BBVA o Santander tienen cuentas sin comisiones. También puedes abrir cuenta online en N26 o Revolut con solo el pasaporte.",
        importante: "Con N26 o Revolut puedes tener cuenta operativa en minutos, incluso sin NIE. Muy útil mientras esperas los trámites.",
        enlace: "https://n26.com/es-es",
        enlaceTexto: "N26 (apertura online)",
    },
    {
        paso: "06",
        titulo: "Número de Seguridad Social",
        icono: "🛡️",
        descripcion: "Lo necesitas para que tu empleador te dé de alta y cotices legalmente. Sin él no puedes tener contrato de trabajo.",
        como: "Normalmente lo gestiona tu empleador cuando firmas el contrato. Si no, acude a la Tesorería General de la Seguridad Social más cercana con tu NIE/pasaporte y padrón. Es gratuito.",
        importante: "Si alguien te ofrece trabajo y no quiere darte de alta en la Seguridad Social, es trabajo ilegal. Exige siempre tu contrato y alta en la SS.",
        enlace: "https://sede.seg-social.gob.es",
        enlaceTexto: "Sede Seguridad Social",
    },
    {
        paso: "07",
        titulo: "Buscar vivienda estable",
        icono: "🏠",
        descripcion: "El alquiler en España requiere normalmente 1 mes de fianza + el primer mes por adelantado. Algunas plataformas exigen nómina o aval.",
        como: "Busca en Idealista, Fotocasa o HabitaQ. Si tienes dificultades económicas, contacta con Cáritas, Cruz Roja o los Servicios Sociales de tu ayuntamiento — tienen programas de acceso a vivienda.",
        importante: "Tener una dirección fija es clave para el empadronamiento y acceder a otros servicios. Si estás en situación precaria, las entidades como Cáritas pueden orientarte hacia albergues o pisos de acogida.",
        enlace: "https://www.caritas.es",
        enlaceTexto: "Ayuda de Cáritas",
    },
    {
        paso: "08",
        titulo: "Homologar tu título (si aplica)",
        icono: "🎓",
        descripcion: "Si tienes estudios universitarios o de formación profesional en tu país, puedes homologarlos para ejercer tu profesión en España.",
        como: "El trámite se gestiona en el Ministerio de Educación (universitarios) o en la Consejería de Educación de tu Comunidad Autónoma (FP). Puede tardar entre 6 meses y 2 años.",
        importante: "Cruz Roja, ACCEM y otras entidades pueden orientarte en el proceso de homologación de forma gratuita. ¡No lo hagas solo si puedes recibir ayuda!",
        enlace: "https://www.educacion.gob.es/educacion/mc/homologacion-titulos",
        enlaceTexto: "Ministerio de Educación",
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFecha(fecha: string): string {
    const dias = Math.floor((Date.now() - new Date(fecha).getTime()) / (1000 * 60 * 60 * 24));
    if (dias === 0) return "Hoy";
    if (dias === 1) return "Hace 1 día";
    return `Hace ${dias} días`;
}

function loadSavedJobs(): Record<string, Empleo> {
    try {
        const stored = localStorage.getItem("parceros_saved_jobs");
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

// ─── Main component ───────────────────────────────────────────────────────────

function WorkerSearch() {
    const { usuario } = useAuth();

    // Tab state
    const [tab, setTab] = useState<Tab>("empleos");
    const [recursosSeccion, setRecursosSeccion] = useState<RecursosSeccion>("primeros");

    // Jobs search state
    const [empleos, setEmpleos] = useState<Empleo[]>([]);
    const [loadingEmpleos, setLoadingEmpleos] = useState(true);
    const [errorEmpleos, setErrorEmpleos] = useState("");
    const [sectorSeleccionado, setSectorSeleccionado] = useState("");
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
    const [ciudadSeleccionada, setCiudadSeleccionada] = useState("");

    // Applications state
    const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
    const [loadingAplicaciones, setLoadingAplicaciones] = useState(false);
    const [errorAplicaciones, setErrorAplicaciones] = useState("");

    // Apply action state
    const [aplicados, setAplicados] = useState<Set<string>>(new Set());
    const [aplicando, setAplicando] = useState<string | null>(null);

    // Saved jobs state (localStorage)
    const [guardados, setGuardados] = useState<Record<string, Empleo>>(loadSavedJobs);

    const ciudadesDisponibles =
        ciudadesEspana.find((p) => p.provincia === provinciaSeleccionada)?.ciudades ?? [];

    // ── Fetch jobs ──────────────────────────────────────────────────────────────
    const cargarEmpleos = (sector: string, ciudad: string) => {
        setLoadingEmpleos(true);
        setErrorEmpleos("");
        const params = new URLSearchParams();
        if (sector) params.append("sector", sector);
        if (ciudad) params.append("ciudad", ciudad);
        const query = params.toString() ? `?${params.toString()}` : "";
        api.get<Empleo[]>(`/jobs${query}`)
            .then(setEmpleos)
            .catch(() => setErrorEmpleos("No se pudieron cargar los empleos"))
            .finally(() => setLoadingEmpleos(false));
    };

    useEffect(() => {
        cargarEmpleos(sectorSeleccionado, ciudadSeleccionada);
    }, [sectorSeleccionado, ciudadSeleccionada]);

    // ── Fetch applications ──────────────────────────────────────────────────────
    useEffect(() => {
        if (tab !== "aplicaciones" || !usuario) return;
        setLoadingAplicaciones(true);
        setErrorAplicaciones("");
        api.get<Aplicacion[]>("/applications/mis-candidaturas")
            .then(setAplicaciones)
            .catch(() => setErrorAplicaciones("No se pudieron cargar tus aplicaciones"))
            .finally(() => setLoadingAplicaciones(false));
    }, [tab, usuario]);

    // ── Actions ─────────────────────────────────────────────────────────────────
    const aplicar = async (empleo: Empleo) => {
        if (aplicados.has(empleo.id) || aplicando) return;
        setAplicando(empleo.id);
        try {
            await api.post("/applications", { jobId: empleo.id });
            setAplicados((prev) => new Set([...prev, empleo.id]));
        } catch {
            // silencioso — el usuario seguirá viendo el botón activo
        } finally {
            setAplicando(null);
        }
    };

    const toggleGuardar = (empleo: Empleo) => {
        setGuardados((prev) => {
            const next = { ...prev };
            if (next[empleo.id]) {
                delete next[empleo.id];
            } else {
                next[empleo.id] = empleo;
            }
            localStorage.setItem("parceros_saved_jobs", JSON.stringify(next));
            return next;
        });
    };

    const limpiarFiltros = () => {
        setSectorSeleccionado("");
        setProvinciaSeleccionada("");
        setCiudadSeleccionada("");
    };

    // ── Job card ─────────────────────────────────────────────────────────────────
    const JobCard = ({ empleo }: { empleo: Empleo }) => {
        const yaAplicado = aplicados.has(empleo.id);
        const guardado = !!guardados[empleo.id];
        const estaAplicando = aplicando === empleo.id;

        return (
            <div
                className="rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-200"
                style={{ backgroundColor: "var(--bg-card)" }}
            >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-lg leading-snug">{empleo.titulo}</h3>
                        <p className="text-[#1D9E75] text-sm font-medium mt-0.5">{empleo.employer_nombre}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${contratoColor[empleo.contract_type]}`}>
                            {contratoLabel[empleo.contract_type]}
                        </span>
                        <button
                            onClick={() => toggleGuardar(empleo)}
                            title={guardado ? "Quitar de guardados" : "Guardar oferta"}
                            className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-200 ${guardado
                                ? "border-[#1D9E75] bg-[#1D9E75]/20 text-[#1D9E75]"
                                : "border-white/10 text-gray-500 hover:border-white/30 hover:text-white"
                                }`}
                        >
                            {guardado ? "🔖" : "🤍"}
                        </button>
                    </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{empleo.descripcion}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                    <span>📍 {empleo.ciudad}</span>
                    <span>🏷️ {empleo.sector}</span>
                    <span>🕐 {formatFecha(empleo.created_at)}</span>
                    <span>👥 {empleo.vacancies} vacante{empleo.vacancies !== 1 ? "s" : ""}</span>
                </div>

                <div className="pt-4 border-t border-white/5">
                    {yaAplicado ? (
                        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                            ✓ Aplicación enviada
                        </span>
                    ) : (
                        <button
                            onClick={() => aplicar(empleo)}
                            disabled={estaAplicando}
                            className="px-5 py-2 rounded-xl text-sm font-semibold text-white hover:brightness-110 transition disabled:opacity-50"
                            style={{ backgroundColor: "#2d7a4f" }}
                        >
                            {estaAplicando ? "Enviando..." : "Aplicar ahora"}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // ─── Render ───────────────────────────────────────────────────────────────────

    const TABS: { id: Tab; label: string; icono: string }[] = [
        { id: "empleos", label: "Empleos", icono: "🔍" },
        { id: "aplicaciones", label: "Mis aplicaciones", icono: "📋" },
        { id: "guardados", label: "Guardados", icono: "🔖" },
        { id: "recursos", label: "Recursos y ayudas", icono: "🤝" },
    ];

    return (
        <div className="min-h-screen pt-20 pb-16 px-4" style={{ backgroundColor: "var(--bg-main)" }}>
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-white text-3xl font-bold mb-1">
                        Hola{usuario ? `, ${usuario.nombre.split(" ")[0]}` : ""}
                    </h1>
                    <p className="text-gray-400 text-base">
                        Tu espacio para crecer profesionalmente en España
                    </p>
                </div>

                {/* Tab navigation */}
                <div
                    className="flex overflow-x-auto gap-1 mb-8 p-1.5 rounded-2xl scrollbar-hide"
                    style={{ backgroundColor: "var(--bg-card)" }}
                >
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${tab === t.id
                                ? "bg-[#1D9E75] text-white shadow"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <span>{t.icono}</span>
                            <span className="hidden sm:inline">{t.label}</span>
                        </button>
                    ))}
                </div>

                {/* ═══ TAB: EMPLEOS ══════════════════════════════════════════════════════ */}
                {tab === "empleos" && (
                    <div>
                        {/* Sector chips */}
                        <div className="mb-6">
                            <p className="text-gray-300 text-sm font-medium mb-3">Sector</p>
                            <div className="flex flex-wrap gap-2">
                                {SECTORES.map((sector) => (
                                    <button
                                        key={sector}
                                        onClick={() => setSectorSeleccionado((prev) => prev === sector ? "" : sector)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${sectorSeleccionado === sector
                                            ? "border-[#1D9E75] bg-[#1D9E75]/20 text-[#1D9E75]"
                                            : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                                            }`}
                                    >
                                        {sector}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Location filters */}
                        <div
                            className="rounded-2xl p-5 mb-8 flex flex-col sm:flex-row gap-4 items-end"
                            style={{ backgroundColor: "var(--bg-card)" }}
                        >
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-sm text-gray-300 font-medium">Provincia</label>
                                <select
                                    value={provinciaSeleccionada}
                                    onChange={(e) => { setProvinciaSeleccionada(e.target.value); setCiudadSeleccionada(""); }}
                                    className="w-full rounded-xl px-4 py-2.5 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] appearance-none"
                                >
                                    <option value="" className="bg-[#182320]">Todas las provincias</option>
                                    {ciudadesEspana.map((p) => (
                                        <option key={p.provincia} value={p.provincia} className="bg-[#182320]">{p.provincia}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-sm text-gray-300 font-medium">Ciudad</label>
                                <select
                                    value={ciudadSeleccionada}
                                    onChange={(e) => setCiudadSeleccionada(e.target.value)}
                                    disabled={!provinciaSeleccionada}
                                    className="w-full rounded-xl px-4 py-2.5 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] appearance-none disabled:opacity-40"
                                >
                                    <option value="" className="bg-[#182320]">Todas las ciudades</option>
                                    {ciudadesDisponibles.map((c) => (
                                        <option key={c} value={c} className="bg-[#182320]">{c}</option>
                                    ))}
                                </select>
                            </div>
                            {(sectorSeleccionado || provinciaSeleccionada || ciudadSeleccionada) && (
                                <button
                                    onClick={limpiarFiltros}
                                    className="px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/30 transition whitespace-nowrap"
                                >
                                    Limpiar filtros
                                </button>
                            )}
                        </div>

                        {/* Results count */}
                        <p className="text-gray-400 text-sm mb-4">
                            <span className="text-white font-semibold">{empleos.length}</span>{" "}
                            {empleos.length === 1 ? "oferta encontrada" : "ofertas encontradas"}
                        </p>

                        {loadingEmpleos ? (
                            <div className="flex justify-center py-20">
                                <div className="w-8 h-8 border-2 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : errorEmpleos ? (
                            <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "var(--bg-card)" }}>
                                <p className="text-red-400 text-sm">{errorEmpleos}</p>
                            </div>
                        ) : empleos.length === 0 ? (
                            <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "var(--bg-card)" }}>
                                <span className="text-4xl block mb-4">🔍</span>
                                <p className="text-white font-semibold text-lg mb-2">No hay ofertas con estos filtros</p>
                                <p className="text-gray-400 text-sm">Prueba a cambiar el sector o la ubicación</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {empleos.map((empleo) => (
                                    <JobCard key={empleo.id} empleo={empleo} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══ TAB: MIS APLICACIONES ══════════════════════════════════════════════ */}
                {tab === "aplicaciones" && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-white text-xl font-bold mb-1">Mis aplicaciones</h2>
                            <p className="text-gray-400 text-sm">Ofertas a las que has enviado tu candidatura</p>
                        </div>

                        {loadingAplicaciones ? (
                            <div className="flex justify-center py-20">
                                <div className="w-8 h-8 border-2 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : errorAplicaciones ? (
                            <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "var(--bg-card)" }}>
                                <p className="text-red-400 text-sm">{errorAplicaciones}</p>
                            </div>
                        ) : aplicaciones.length === 0 ? (
                            <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "var(--bg-card)" }}>
                                <span className="text-4xl block mb-4">📋</span>
                                <p className="text-white font-semibold text-lg mb-2">Aún no has aplicado a ninguna oferta</p>
                                <p className="text-gray-400 text-sm mb-6">Explora las ofertas disponibles y envía tu candidatura</p>
                                <button
                                    onClick={() => setTab("empleos")}
                                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:brightness-110 transition"
                                    style={{ backgroundColor: "#2d7a4f" }}
                                >
                                    Ver empleos
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {aplicaciones.map((aplicacion) => (
                                    <div
                                        key={aplicacion.id}
                                        className="rounded-2xl p-6 border border-white/5"
                                        style={{ backgroundColor: "var(--bg-card)" }}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                            <div>
                                                <h3 className="text-white font-bold text-lg">{aplicacion.titulo}</h3>
                                                <p className="text-[#1D9E75] text-sm font-medium mt-0.5">{aplicacion.empresa}</p>
                                            </div>
                                            <span className={`self-start px-3 py-1 rounded-full text-xs font-semibold border ${estadoColor[aplicacion.status]}`}>
                                                {estadoLabel[aplicacion.status]}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                            <span>📍 {aplicacion.ciudad}</span>
                                            <span>🕐 Aplicado {formatFecha(aplicacion.created_at)}</span>
                                            {aplicacion.cover_note && (
                                                <span className="text-gray-400 italic truncate max-w-xs">"{aplicacion.cover_note}"</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══ TAB: GUARDADOS ══════════════════════════════════════════════════════ */}
                {tab === "guardados" && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-white text-xl font-bold mb-1">Ofertas guardadas</h2>
                            <p className="text-gray-400 text-sm">Empleos que has marcado para revisar más tarde</p>
                        </div>

                        {Object.keys(guardados).length === 0 ? (
                            <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "var(--bg-card)" }}>
                                <span className="text-4xl block mb-4">🔖</span>
                                <p className="text-white font-semibold text-lg mb-2">No tienes ofertas guardadas</p>
                                <p className="text-gray-400 text-sm mb-6">
                                    Pulsa el icono 🤍 en cualquier oferta para guardarla aquí
                                </p>
                                <button
                                    onClick={() => setTab("empleos")}
                                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:brightness-110 transition"
                                    style={{ backgroundColor: "#2d7a4f" }}
                                >
                                    Explorar empleos
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {Object.values(guardados).map((empleo) => (
                                    <JobCard key={empleo.id} empleo={empleo} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══ TAB: RECURSOS Y AYUDAS ══════════════════════════════════════════════ */}
                {tab === "recursos" && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-white text-xl font-bold mb-1">Recursos y ayudas</h2>
                            <p className="text-gray-400 text-sm">
                                Organizaciones, prestaciones y datos para orientarte en España
                            </p>
                        </div>

                        {/* Sub-tab navigation */}
                        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
                            {[
                                { id: "primeros" as RecursosSeccion, label: "Primeros pasos", icono: "🧭" },
                                { id: "entidades" as RecursosSeccion, label: "Entidades de apoyo", icono: "🏛️" },
                                { id: "ninos" as RecursosSeccion, label: "Ayudas para niños", icono: "👶" },
                                { id: "demanda" as RecursosSeccion, label: "Empleos por zona", icono: "📊" },
                            ].map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setRecursosSeccion(s.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap border transition-all duration-200 ${recursosSeccion === s.id
                                        ? "border-[#1D9E75] bg-[#1D9E75]/15 text-[#1D9E75]"
                                        : "border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                                        }`}
                                >
                                    <span>{s.icono}</span>
                                    <span>{s.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Primeros pasos */}
                        {recursosSeccion === "primeros" && (
                            <div>
                                <div className="mb-6 rounded-2xl p-5 border border-[#1D9E75]/30 bg-[#1D9E75]/8">
                                    <p className="text-[#1D9E75] font-semibold text-base mb-1">
                                        ✈️ ¿Acabas de llegar a España?
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        Aquí tienes el orden exacto de lo que debes hacer para instalarte correctamente, acceder a servicios y poder trabajar legalmente.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {PRIMEROS_PASOS.map((paso) => (
                                        <div
                                            key={paso.paso}
                                            className="rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all"
                                            style={{ backgroundColor: "var(--bg-card)" }}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Número de paso */}
                                                <div className="shrink-0 w-10 h-10 rounded-full bg-[#1D9E75]/15 border border-[#1D9E75]/30 flex items-center justify-center">
                                                    <span className="text-[#1D9E75] font-bold text-sm">{paso.paso}</span>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-lg">{paso.icono}</span>
                                                        <h3 className="text-white font-bold text-base">{paso.titulo}</h3>
                                                    </div>

                                                    <p className="text-gray-400 text-sm leading-relaxed mb-3">
                                                        {paso.descripcion}
                                                    </p>

                                                    <div className="bg-white/5 rounded-xl px-4 py-3 mb-3">
                                                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">Cómo hacerlo</p>
                                                        <p className="text-gray-300 text-sm leading-relaxed">{paso.como}</p>
                                                    </div>

                                                    <div className="flex items-start gap-2 mb-3">
                                                        <span className="text-yellow-400 text-sm mt-0.5">⚠️</span>
                                                        <p className="text-yellow-300/80 text-xs leading-relaxed">{paso.importante}</p>
                                                    </div>

                                                    <a
                                                        href={paso.enlace}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white border border-[#1D9E75]/40 bg-[#1D9E75]/10 hover:bg-[#1D9E75]/20 transition"
                                                    >
                                                        🔗 {paso.enlaceTexto}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 rounded-2xl p-4 border border-[#1D9E75]/20 bg-[#1D9E75]/5">
                                    <p className="text-green-300 text-sm">
                                        <span className="font-semibold">Recuerda:</span> No estás solo. Las entidades en la pestaña "Entidades de apoyo" (Cruz Roja, Cáritas, ACCEM…) ofrecen acompañamiento gratuito en todos estos trámites. Pide ayuda cuando la necesites.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Entidades */}
                        {recursosSeccion === "entidades" && (
                            <div>
                                <p className="text-gray-400 text-sm mb-6">
                                    Organizaciones públicas y privadas que ofrecen apoyo a migrantes latinos en España.
                                    Haz clic en el nombre o en "Ir al sitio web" para acceder directamente.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {ENTIDADES.map((entidad) => (
                                        <div
                                            key={entidad.nombre}
                                            className="rounded-2xl p-5 border border-white/5 hover:border-[#1D9E75]/30 transition-all flex flex-col gap-3 group"
                                            style={{ backgroundColor: "var(--bg-card)" }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl mt-0.5">{entidad.icono}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                                        {/* Nombre = link directo */}
                                                        <a
                                                            href={entidad.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-white font-bold text-base hover:text-[#1D9E75] transition-colors"
                                                        >
                                                            {entidad.nombre} ↗
                                                        </a>
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#1D9E75]/15 text-[#1D9E75] font-medium">
                                                            {entidad.region}
                                                        </span>
                                                    </div>
                                                    <p className="text-[#1D9E75] text-xs font-medium">{entidad.subtitulo}</p>
                                                </div>
                                            </div>

                                            <p className="text-gray-400 text-sm leading-relaxed">{entidad.descripcion}</p>

                                            <div className="flex flex-wrap gap-1.5">
                                                {entidad.servicios.map((s) => (
                                                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
                                                <span className="text-xs text-gray-500">📞 {entidad.telefono}</span>
                                                <a
                                                    href={entidad.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white border border-[#1D9E75]/40 bg-[#1D9E75]/10 hover:bg-[#1D9E75]/20 transition"
                                                >
                                                    🌐 Ir al sitio web
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Ayudas para niños */}
                        {recursosSeccion === "ninos" && (
                            <div>
                                <p className="text-gray-400 text-sm mb-6">
                                    Prestaciones, becas y ayudas disponibles para familias con hijos en España. Los requisitos pueden variar según la comunidad autónoma.
                                </p>
                                <div className="flex flex-col gap-4">
                                    {AYUDAS_NINOS.map((ayuda) => (
                                        <div
                                            key={ayuda.nombre}
                                            className="rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all"
                                            style={{ backgroundColor: "var(--bg-card)" }}
                                        >
                                            <div className="flex items-start gap-3 mb-3">
                                                <span className="text-2xl mt-0.5">{ayuda.icono}</span>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                                        <h3 className="text-white font-bold text-base">{ayuda.nombre}</h3>
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 font-medium">
                                                            {ayuda.tipo}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm leading-relaxed">{ayuda.descripcion}</p>
                                                </div>
                                            </div>
                                            <div className="ml-9 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                                <div className="bg-white/5 rounded-xl px-3 py-2">
                                                    <p className="text-gray-500 mb-0.5">Gestiona</p>
                                                    <p className="text-gray-300">{ayuda.gestiona}</p>
                                                </div>
                                                <div className="bg-white/5 rounded-xl px-3 py-2">
                                                    <p className="text-gray-500 mb-0.5">Requisitos</p>
                                                    <p className="text-gray-300">{ayuda.requisitos}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div
                                    className="mt-6 rounded-2xl p-4 border border-yellow-500/20 bg-yellow-500/5"
                                >
                                    <p className="text-yellow-300 text-sm">
                                        <span className="font-semibold">Consejo:</span> Para saber exactamente qué ayudas te corresponden, acude a los Servicios Sociales de tu ayuntamiento o a las entidades listadas en la pestaña "Entidades de apoyo". Llevar el empadronamiento y documentación actualizada facilita mucho los trámites.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Empleos por zona */}
                        {recursosSeccion === "demanda" && (
                            <div>
                                <p className="text-gray-400 text-sm mb-6">
                                    Sectores con mayor demanda de trabajadores según la región. Útil para decidir dónde buscar empleo.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {EMPLEOS_DEMANDADOS.map((zona) => (
                                        <div
                                            key={zona.zona}
                                            className="rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all"
                                            style={{ backgroundColor: "var(--bg-card)" }}
                                        >
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-2xl">{zona.icono}</span>
                                                <h3 className="text-white font-bold text-base">{zona.zona}</h3>
                                            </div>
                                            <p className="text-gray-500 text-xs mb-4">{zona.descripcion}</p>
                                            <div className="flex flex-col gap-2">
                                                {zona.sectores.map((s) => (
                                                    <div key={s.nombre} className="flex items-center justify-between gap-2">
                                                        <span className="text-gray-300 text-sm">{s.nombre}</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${demandaColor[s.demanda]}`}>
                                                            {s.demanda}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 rounded-2xl p-4 border border-[#1D9E75]/20 bg-[#1D9E75]/5">
                                    <p className="text-green-300 text-sm">
                                        <span className="font-semibold">Fuente:</span> Datos basados en estadísticas del SEPE y observatorios regionales de empleo. La demanda real puede variar según la época del año.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default WorkerSearch;

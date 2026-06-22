interface Props {
  onAccept: () => void;
}

function PrivacyModal({ onAccept }: Props) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(31, 42, 68, 0.8)" }}
    >
      <div
        className="w-full max-w-[520px] rounded-3xl p-8 shadow-2xl"
        style={{ backgroundColor: "#F7EEE0" }}
      >
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#C1502E" }}>
          Tu privacidad importa
        </h2>
        <p className="text-sm mb-5" style={{ color: "#1F2A44", opacity: 0.65 }}>
          Antes de continuar, léenos un momento
        </p>

        <p className="text-sm leading-relaxed mb-5" style={{ color: "#1F2A44" }}>
          En Hausseup recogemos tu nombre, email y perfil profesional para
          conectarte con empleadores en España. Nunca vendemos tus datos ni los
          compartimos sin tu permiso. Tus datos se guardan mientras tengas cuenta
          activa. Puedes eliminar tu cuenta en cualquier momento desde ajustes.
        </p>

        <a
          href="/privacidad"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium hover:underline block mb-6"
          style={{ color: "#C1502E" }}
        >
          Leer política completa →
        </a>

        <button
          onClick={onAccept}
          className="w-full py-3 rounded-xl font-semibold text-white text-sm hover:brightness-110 transition"
          style={{ backgroundColor: "#C1502E" }}
        >
          Entendido, continuar
        </button>
      </div>
    </div>
  );
}

export default PrivacyModal;

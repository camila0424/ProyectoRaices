import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

type ModalState = 'none' | 'choice' | 'confirm-delete';

interface AgentDrawerProps {
  open: boolean;
  onClose: () => void;
  onQuickMessage: (text: string) => void;
}

function AgentDrawer({ open, onClose, onQuickMessage }: AgentDrawerProps) {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [modalState, setModalState] = useState<ModalState>('none');
  const [deleteInput, setDeleteInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function handleLogout() {
    logout();
    navigate('/');
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function closeModal() {
    setModalState('none');
    setDeleteInput('');
  }

  async function handlePause() {
    if (!usuario?.id) return;
    setLoading(true);
    try {
      await api.patch(`/users/${usuario.id}`, { is_available: false });
      closeModal();
      onClose();
      showToast('Tu cuenta ha sido pausada');
      setTimeout(() => {
        logout();
        navigate('/');
      }, 1500);
    } catch (err) {
      alert((err as Error).message || 'No pudimos completar la acción. Vuelve a intentarlo.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!usuario?.id || deleteInput !== 'ELIMINAR') return;
    setLoading(true);
    try {
      await api.delete(`/users/${usuario.id}`);
      logout();
      navigate('/?deleted=1');
    } catch (err) {
      alert((err as Error).message || 'No pudimos completar la acción. Vuelve a intentarlo.');
      setLoading(false);
    }
  }

  return (
    <>
      {/* overlay del drawer */}
      <div
        onClick={() => { if (modalState === 'none') onClose(); }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
          zIndex: 100,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* panel lateral */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '260px',
          height: '100vh',
          background: '#1F2A44',
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 0',
          transform: open ? 'translateX(0)' : 'translateX(-260px)',
          transition: 'transform 0.25s ease',
        }}
      >
        {/* cabecera del drawer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              color: '#F7EEE0',
              fontWeight: '700',
              fontSize: '20px',
              fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
              letterSpacing: '-0.5px',
            }}
          >
            Hausseup
          </span>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#F7EEE0',
              fontSize: '20px',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '4px',
            }}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        {/* opciones de navegación */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' }}>
          {usuario?.rol === 'worker' && (
            <DrawerItem
              label="Mis candidaturas"
              icon="📋"
              onClick={() => { onClose(); onQuickMessage('__silent__Muéstrame mis candidaturas'); }}
            />
          )}
          {usuario?.rol === 'employer' && (
            <DrawerItem
              label="Mis anuncios"
              icon="💼"
              onClick={() => { onClose(); onQuickMessage('__silent__Muéstrame mis anuncios'); }}
            />
          )}
          <DrawerItem label="Ajustes" icon="⚙️" onClick={() => { onQuickMessage('Quiero ajustar mi cuenta'); onClose(); }} />
        </nav>

        {/* acciones de cuenta al fondo */}
        <div style={{ padding: '0 12px', borderTop: '1px solid rgba(247,238,224,0.1)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <DrawerItem
            label="Eliminar cuenta"
            icon="🗑️"
            onClick={() => setModalState('choice')}
            destructive
          />
          <DrawerItem label="Cerrar sesión" icon="🚪" onClick={handleLogout} danger />
        </div>
      </div>

      {/* modal overlay */}
      {modalState !== 'none' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(31,42,68,0.6)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          {modalState === 'choice' && (
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '28px 24px',
                maxWidth: '380px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1F2A44',
                  fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
                }}
              >
                ¿Qué prefieres hacer?
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#4A5568',
                  lineHeight: 1.5,
                  fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
                }}
              >
                Puedes pausar tu cuenta si no quieres recibir más notificaciones ni aparecer en búsquedas, o eliminarla definitivamente si ya no quieres usar Hausseup.
              </p>

              {/* opción pausar */}
              <button
                onClick={handlePause}
                disabled={loading}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '4px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '2px solid #1F2A44',
                  background: loading ? '#f0f0f0' : '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#1F2A44',
                    fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
                  }}
                >
                  Pausar mi cuenta
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: '#4A5568',
                    fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
                  }}
                >
                  Tu perfil deja de mostrarse. Puedes reactivarla cuando quieras.
                </span>
              </button>

              {/* opción eliminar */}
              <button
                onClick={() => setModalState('confirm-delete')}
                disabled={loading}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '4px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '2px solid #C1502E',
                  background: loading ? '#f0f0f0' : '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#C1502E',
                    fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
                  }}
                >
                  Eliminar definitivamente
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: '#4A5568',
                    fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
                  }}
                >
                  Todos tus datos se borran. Esta acción no se puede deshacer.
                </span>
              </button>

              <button
                onClick={closeModal}
                disabled={loading}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'none',
                  color: '#4A5568',
                  fontSize: '14px',
                  fontWeight: '500',
                  fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
            </div>
          )}

          {modalState === 'confirm-delete' && (
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '28px 24px',
                maxWidth: '380px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#C1502E',
                  fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
                }}
              >
                Eliminar cuenta
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#4A5568',
                  lineHeight: 1.5,
                  fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
                }}
              >
                Escribe <strong>ELIMINAR</strong> para confirmar. Esta acción borrará todos tus datos y no se puede deshacer.
              </p>

              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="Escribe ELIMINAR"
                autoFocus
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '2px solid #C1502E',
                  fontSize: '15px',
                  fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
                  outline: 'none',
                  color: '#1F2A44',
                }}
              />

              <button
                onClick={handleDelete}
                disabled={deleteInput !== 'ELIMINAR' || loading}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: deleteInput === 'ELIMINAR' && !loading ? '#C1502E' : '#E2B5A8',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '600',
                  fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
                  cursor: deleteInput === 'ELIMINAR' && !loading ? 'pointer' : 'not-allowed',
                  transition: 'background 0.15s',
                }}
              >
                {loading ? 'Eliminando...' : 'Eliminar definitivamente'}
              </button>

              <button
                onClick={() => setModalState('choice')}
                disabled={loading}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'none',
                  color: '#4A5568',
                  fontSize: '14px',
                  fontWeight: '500',
                  fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
                  cursor: 'pointer',
                }}
              >
                Volver
              </button>
            </div>
          )}
        </div>
      )}

      {/* toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1F2A44',
            color: '#F7EEE0',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
            fontWeight: '500',
            zIndex: 300,
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            whiteSpace: 'nowrap',
          }}
        >
          {toast}
        </div>
      )}
    </>
  );
}

interface DrawerItemProps {
  label: string;
  icon: string;
  onClick: () => void;
  danger?: boolean;
  destructive?: boolean;
}

function DrawerItem({ label, icon, onClick, danger, destructive }: DrawerItemProps) {
  const color = destructive ? '#C1502E' : danger ? '#E8A33D' : '#F7EEE0';
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        background: 'none',
        border: 'none',
        color,
        fontSize: '15px',
        fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
        fontWeight: '500',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,238,224,0.08)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'none';
      }}
    >
      <span style={{ fontSize: '18px', lineHeight: 1 }}>{icon}</span>
      {label}
    </button>
  );
}

export default AgentDrawer;

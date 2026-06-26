import { useState, useEffect } from 'react';

interface JobPostingCardProps {
  job: {
    id: string;
    title: string;
    description?: string;
    city_name?: string;
    city_id?: string | number;
    contract_type?: string;
    salary?: string;
    paperwork?: string;
    requires_nie?: boolean;
    applications_count: number;
    created_at: string;
  };
  onEdit: (jobId: string, jobTitle: string) => void;
}

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function formatContractType(raw?: string): string {
  const map: Record<string, string> = {
    full_time: 'Tiempo completo',
    part_time: 'Media jornada',
    temporary: 'Temporal',
    freelance: 'Autónomo / Freelance',
    internship: 'Prácticas',
  };
  return raw ? (map[raw] ?? raw) : 'Ver anuncio';
}

function JobPostingCard({ job, onEdit }: JobPostingCardProps) {
  const [cityName, setCityName] = useState(job.city_name || '');

  useEffect(() => {
    if (job.city_id && !job.city_name) {
      fetch(`${import.meta.env.VITE_API_URL}/cities/${job.city_id}`)
        .then(r => r.json())
        .then(data => setCityName(data.name || String(job.city_id)))
        .catch(() => setCityName(String(job.city_id)));
    }
  }, [job.city_id]);

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(31,42,68,0.08)',
        padding: '20px',
        width: '260px',
        minWidth: '260px',
        maxWidth: '260px',
        boxSizing: 'border-box',
        marginBottom: '8px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <h3
        style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#1F2A44',
          margin: '0 0 14px',
          lineHeight: '1.3',
        }}
      >
        {job.title}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
        <p style={rowStyle}>
          <span style={labelStyle}>Ciudad:</span>{' '}
          <span style={valueStyle}>{cityName || 'Ver anuncio'}</span>
        </p>
        <p style={rowStyle}>
          <span style={labelStyle}>Contrato:</span>{' '}
          <span style={valueStyle}>{formatContractType(job.contract_type)}</span>
        </p>
        <p style={rowStyle}>
          <span style={labelStyle}>Salario:</span>{' '}
          <span style={valueStyle}>{job.salary || 'A negociar'}</span>
        </p>
        <p style={rowStyle}>
          <span style={labelStyle}>Documentación:</span>{' '}
          <span style={valueStyle}>
            {job.paperwork || (job.requires_nie ? 'NIE requerido' : 'Sin requisito de NIE')}
          </span>
        </p>
        <p style={rowStyle}>
          <span style={labelStyle}>Candidaturas:</span>{' '}
          <span style={valueStyle}>{job.applications_count}</span>
        </p>
        <p style={rowStyle}>
          <span style={labelStyle}>Publicada:</span>{' '}
          <span style={valueStyle}>{formatDate(job.created_at)}</span>
        </p>
      </div>

      {job.description && (
        <p style={{
          fontSize: '13px',
          color: '#4B4B4B',
          margin: '0 0 12px',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        } as React.CSSProperties}>
          {job.description}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => onEdit(job.id, job.title)}
          style={{
            padding: '7px 16px',
            background: '#C1502E',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Editar
        </button>
      </div>
    </div>
  );
}

const rowStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '14px',
  lineHeight: '1.4',
};

const labelStyle: React.CSSProperties = {
  fontWeight: '700',
  color: '#1F2A44',
};

const valueStyle: React.CSSProperties = {
  color: '#4B4B4B',
};

export default JobPostingCard;

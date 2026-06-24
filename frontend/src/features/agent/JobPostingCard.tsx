interface JobPostingCardProps {
  job: {
    id: string;
    title: string;
    city_name?: string;
    contract_type: string;
    salary?: string;
    paperwork?: string;
    applications_count: number;
    created_at: string;
  };
  onEdit: (jobId: string) => void;
}

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function JobPostingCard({ job, onEdit }: JobPostingCardProps) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(31,42,68,0.08)',
        padding: '20px',
        width: '280px',
        maxWidth: '100%',
        boxSizing: 'border-box',
        marginBottom: '8px',
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
          <span style={labelStyle}>📍 Ciudad:</span>{' '}
          <span style={valueStyle}>{job.city_name || '—'}</span>
        </p>
        <p style={rowStyle}>
          <span style={labelStyle}>📄 Contrato:</span>{' '}
          <span style={valueStyle}>{job.contract_type}</span>
        </p>
        <p style={rowStyle}>
          <span style={labelStyle}>💰 Salario:</span>{' '}
          <span style={valueStyle}>{job.salary || 'A negociar'}</span>
        </p>
        <p style={rowStyle}>
          <span style={labelStyle}>✅ Documentación:</span>{' '}
          <span style={valueStyle}>{job.paperwork || '—'}</span>
        </p>
        <p style={rowStyle}>
          <span style={labelStyle}>👥 Candidaturas:</span>{' '}
          <span style={valueStyle}>{job.applications_count}</span>
        </p>
        <p style={rowStyle}>
          <span style={labelStyle}>📅 Publicada:</span>{' '}
          <span style={valueStyle}>{formatDate(job.created_at)}</span>
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => onEdit(job.id)}
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

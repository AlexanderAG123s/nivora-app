import { ReactNode } from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({ 
  title, 
  description, 
  icon = <FolderOpen size={32} strokeWidth={1.5} />,
  action 
}: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      textAlign: 'center',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px dashed var(--border-subtle)',
      borderRadius: '8px',
      color: 'var(--text-muted)'
    }}>
      <div style={{ marginBottom: '1rem', color: 'var(--text-subtle)' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', maxWidth: '300px', marginBottom: action ? '1.5rem' : '0' }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}

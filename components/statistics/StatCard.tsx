"use client";
import { ReactNode, useState } from "react";
import EducationalModal, { EducationalProps } from "@/components/ui/EducationalModal";
import { Maximize2 } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  educational?: EducationalProps;
}

export default function StatCard({ title, value, subtitle, icon, trend, educational }: StatCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="panel tour-cards" 
        style={{ 
          display: 'flex', flexDirection: 'column', 
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
          cursor: educational ? 'pointer' : 'default',
          position: 'relative'
        }}
        onClick={() => educational && setIsModalOpen(true)}
        onMouseEnter={(e) => {
          if (educational) {
            e.currentTarget.style.borderColor = 'var(--border-focus)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (educational) {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {educational && (
                <div style={{ color: 'var(--text-muted)', opacity: 0.5 }} title="Ver explicación">
                  <Maximize2 size={12} />
                </div>
              )}
              {icon && (
                <div style={{ color: 'var(--text-muted)' }}>
                  {icon}
                </div>
              )}
            </div>
          </div>
          
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            fontFamily: 'var(--font-fira-code), monospace',
            letterSpacing: '-0.02em',
            color: 'var(--text-main)'
          }}>
            {value}
          </div>
          
          {(subtitle || trend) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
              {trend && (
                <span style={{ 
                  color: trend.isPositive ? '#10B981' : '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 500,
                }}>
                  {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                </span>
              )}
              {subtitle && <span style={{ color: 'var(--text-subtle)' }}>{subtitle}</span>}
            </div>
          )}
        </div>
      </div>

      {educational && (
        <EducationalModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={title}
          value={value}
          educational={educational}
        />
      )}
    </>
  );
}

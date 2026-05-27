"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";
import { 
  LayoutDashboard, 
  BarChart2, 
  Calculator, 
  PieChart, 
  Table, 
  History, 
  Settings,
  Database
} from "lucide-react";

const navItems = [
  { name: "Resumen", href: "/", icon: LayoutDashboard },
  { name: "Estadística Descriptiva", href: "/descriptive-statistics", icon: BarChart2 },
  { name: "Probabilidad", href: "/probability", icon: Calculator },
  { name: "Visualizaciones", href: "/visualizations", icon: PieChart },
  { name: "Tablas de Frecuencia", href: "/frequency-tables", icon: Table },
  { name: "Historial", href: "/history", icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useUIStore();

  return (
    <>
      <div 
        className={`mobile-overlay ${isSidebarOpen ? 'mobile-open' : ''}`} 
        onClick={closeSidebar} 
      />
      
      <aside className={`sidebar-wrapper ${isSidebarOpen ? 'mobile-open' : ''}`} style={{ padding: '1.5rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
        <div style={{ 
          background: 'var(--accent-blue)',
          borderRadius: '6px',
          padding: '0.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Database size={18} color="#FFF" />
        </div>
        <h1 style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text-main)' }}>
          Analytics
        </h1>
      </div>

      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>
        ÁREA DE TRABAJO
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={closeSidebar}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-main)';
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} color={isActive ? 'var(--text-main)' : 'var(--text-subtle)'} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
        <Link href="/settings" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-main)';
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.background = 'transparent';
          }}>
          <Settings size={16} color="var(--text-subtle)" />
          Ajustes
        </Link>
        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>A</div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Alexander Doe</div>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}

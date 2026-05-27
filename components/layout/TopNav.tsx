"use client";

import { Search, Bell, Menu } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";

export default function TopNav() {
  const { toggleSidebar } = useUIStore();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 1.5rem', /* Reduced padding for mobile */
      backgroundColor: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      height: '60px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <button 
          className="mobile-menu-btn" 
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          color: 'var(--text-subtle)',
          width: '100%',
          maxWidth: '300px'
        }}>
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Buscar consultas..." 
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '0.875rem',
              width: '100%',
              fontFamily: 'inherit'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button style={{
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-subtle)',
          cursor: 'pointer',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-subtle)'}
        >
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}

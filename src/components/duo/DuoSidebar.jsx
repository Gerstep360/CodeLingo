import React from 'react';
import { Compass, Zap, Terminal, BookOpen, Flame, Award, Heart } from 'lucide-react';
import { DuoOwlIcon, DuoFlameIcon, DuoTrophyIcon } from './DuoIcons';

export function DuoSidebar({ activeTab, onSelectTab, streak = 4, totalXp = 120 }) {
  const navItems = [
    { id: 'path', label: 'Aprender', icon: Compass, badge: null },
    { id: 'flash', label: 'Test Flash', icon: Zap, badge: '10 Q' },
    { id: 'editor', label: 'Modo Examen (IDE)', icon: Terminal, badge: 'Java' },
    { id: 'cheatsheet', label: 'Guía Mental', icon: BookOpen, badge: 'Vargas' },
  ];

  return (
    <aside className="duo-sidebar">
      {/* Brand Header */}
      <div className="duo-sidebar-header">
        <div className="duo-logo-wrap">
          <DuoOwlIcon size={40} className="duo-logo-svg" />
          <div>
            <h2 className="duo-brand-title">CodeLingo</h2>
            <span className="duo-brand-tag">Vargas Sprint</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="duo-nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`duo-nav-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={22} className="duo-nav-icon" />
              <span className="duo-nav-label">{item.label}</span>
              {item.badge && <span className="duo-nav-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* User Stats Card in Sidebar */}
      <div className="duo-sidebar-footer">
        <div className="duo-stat-pill">
          <DuoFlameIcon size={20} />
          <span className="stat-val">{streak}</span>
          <span className="stat-label">Días Racha</span>
        </div>
        <div className="duo-stat-pill">
          <DuoTrophyIcon size={18} />
          <span className="stat-val">{totalXp}</span>
          <span className="stat-label">XP Total</span>
        </div>
      </div>

      <style>{`
        .duo-sidebar {
          width: 256px;
          min-width: 256px;
          height: 100vh;
          position: sticky;
          top: 0;
          background: #FFFFFF;
          border-right: 2px solid var(--duo-swan);
          display: flex;
          flex-direction: column;
          padding: 20px 16px;
          user-select: none;
          z-index: 40;
        }

        .duo-sidebar-header {
          padding-bottom: 24px;
          border-bottom: 2px solid var(--duo-swan);
          margin-bottom: 20px;
        }

        .duo-logo-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .duo-logo-icon {
          font-size: 36px;
          line-height: 1;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .duo-brand-title {
          font-family: var(--font-sans);
          font-size: 22px;
          font-weight: 900;
          color: var(--duo-green);
          letter-spacing: -0.5px;
          line-height: 1.1;
        }

        .duo-brand-tag {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--duo-wolf);
        }

        .duo-nav-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        .duo-nav-btn {
          display: flex;
          align-items: center;
          gap: 16px;
          height: 52px;
          padding: 0 16px;
          border-radius: var(--radius-md);
          border: 2px solid transparent;
          background: transparent;
          color: var(--duo-wolf);
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          cursor: pointer;
          transition: all 120ms ease;
          text-align: left;
        }

        .duo-nav-btn:hover:not(.active) {
          background: var(--duo-polar);
          color: var(--duo-eel);
        }

        .duo-nav-btn.active {
          background: var(--duo-blue-soft);
          border-color: #84D8FF;
          color: var(--duo-blue);
        }

        .duo-nav-btn.active .duo-nav-icon {
          color: var(--duo-blue);
        }

        .duo-nav-label {
          flex: 1;
        }

        .duo-nav-badge {
          font-size: 10px;
          font-weight: 900;
          padding: 2px 8px;
          border-radius: 999px;
          background: #FFFFFF;
          color: var(--duo-blue);
          border: 1px solid #84D8FF;
        }

        .duo-sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 16px;
          border-top: 2px solid var(--duo-swan);
        }

        .duo-stat-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          background: var(--duo-polar);
          border: 1px solid var(--duo-swan);
        }

        .stat-val {
          font-weight: 900;
          font-size: 15px;
          color: var(--duo-eel);
        }

        .stat-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--duo-wolf);
          margin-left: auto;
        }

        @media (max-width: 1024px) {
          .duo-sidebar {
            width: 80px;
            min-width: 80px;
            padding: 16px 8px;
          }
          .duo-brand-title, .duo-brand-tag, .duo-nav-label, .duo-nav-badge, .stat-label {
            display: none;
          }
          .duo-nav-btn {
            justify-content: center;
            padding: 0;
          }
          .duo-stat-pill {
            justify-content: center;
            padding: 6px;
          }
        }
      `}</style>
    </aside>
  );
}

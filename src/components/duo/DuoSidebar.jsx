import React from 'react';
import { Compass, Zap, Terminal, BookOpen, Target, Moon, Sun, UserRound, ShieldCheck } from 'lucide-react';
import { DuoOwlIcon, DuoFlameIcon, DuoTrophyIcon } from './DuoIcons';

export function DuoSidebar({
  activeTab,
  onSelectTab,
  streak = 4,
  totalXp = 120,
  theme = 'dark',
  onToggleTheme,
  isAdmin = false,
}) {
  const navItems = [
    { id: 'account', label: 'Mi cuenta', icon: UserRound, badge: null },
    { id: 'path', label: 'Aprender', icon: Compass, badge: null },
    { id: 'practice', label: 'Practicar', icon: Target, badge: null },
    { id: 'flash', label: 'Test Flash', icon: Zap, badge: '10 Q' },
    { id: 'editor', label: 'Taller Java', icon: Terminal, badge: 'Java' },
    { id: 'cheatsheet', label: 'Guía Mental', icon: BookOpen, badge: 'Vargas' },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: ShieldCheck, badge: null }] : []),
  ];

  return (
    <>
      {/* 1. Mobile Top Header (<= 768px) */}
      <header className="duo-mobile-top-header">
        <div className="mobile-brand" onClick={() => onSelectTab('path')} role="button" tabIndex={0}>
          <DuoOwlIcon size={32} />
          <span className="mobile-brand-name">CodeLingo</span>
        </div>
        <div className="mobile-stats-row">
          <div className="mobile-stat-pill flame">
            <DuoFlameIcon size={16} />
            <span>{streak}</span>
          </div>
          <div className="mobile-stat-pill trophy">
            <DuoTrophyIcon size={15} />
            <span>{totalXp}</span>
          </div>
          {onToggleTheme && (
            <button
              type="button"
              className="mobile-theme-btn"
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              aria-label={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          )}
        </div>
      </header>

      {/* 2. Desktop & Tablet Sidebar (> 768px) */}
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
          {onToggleTheme && (
            <button
              type="button"
              className="duo-theme-toggle"
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              <span className="duo-theme-toggle-icon">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </span>
              <span className="duo-theme-toggle-label">
                {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              </span>
            </button>
          )}
        </div>
      </aside>

      {/* 3. Mobile Bottom Navigation Bar (<= 768px) */}
      <nav className={`duo-mobile-bottom-nav ${activeTab === 'editor' ? 'in-editor' : ''}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="mobile-icon-wrap">
                <Icon size={20} />
                {item.badge && <span className="mobile-badge-dot" />}
              </div>
              <span className="mobile-tab-text">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        /* Desktop Sidebar */
        .duo-sidebar {
          width: 256px;
          min-width: 256px;
          height: 100vh;
          position: sticky;
          top: 0;
          background: var(--bg-main);
          border-right: 2px solid var(--duo-swan);
          display: flex;
          flex-direction: column;
          padding: 20px 16px;
          user-select: none;
          z-index: 40;
        }

        .duo-mobile-top-header {
          display: none;
        }

        .duo-mobile-bottom-nav {
          display: none;
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

        /* Medium Tablet: Collapsed 80px Sidebar */
        @media (max-width: 1024px) and (min-width: 769px) {
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

        /* Mobile (<= 768px): Hide Left Sidebar, Show Mobile Top & Bottom Nav */
        @media (max-width: 768px) {
          .duo-sidebar {
            display: none;
          }

          /* Mobile Top Header */
          .duo-mobile-top-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            height: 54px;
            background: var(--bg-main);
            border-bottom: 2px solid var(--duo-swan);
            padding: 0 16px;
            z-index: 50;
            box-shadow: 0 2px 4px rgba(0,0,0,0.04);
          }

          .mobile-brand {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
          }

          .mobile-brand-name {
            font-size: 18px;
            font-weight: 900;
            color: var(--duo-green);
          }

          .mobile-stats-row {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .mobile-theme-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 999px;
            border: 1.5px solid var(--duo-swan);
            background: var(--duo-polar);
            color: var(--duo-yellow);
            cursor: pointer;
          }

          .mobile-stat-pill {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 4px 10px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 900;
            border: 1.5px solid var(--duo-swan);
            background: var(--duo-polar);
          }

          .mobile-stat-pill.flame {
            color: var(--duo-orange);
            background: var(--duo-orange-soft);
            border-color: #FFD29D;
          }

          .mobile-stat-pill.trophy {
            color: #B58500;
            background: var(--duo-yellow-soft);
            border-color: #FFE58F;
          }

          /* Mobile Bottom Navigation Bar */
          .duo-mobile-bottom-nav {
            display: flex;
            align-items: center;
            justify-content: space-around;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: var(--bg-main);
            border-top: 2px solid var(--duo-swan);
            z-index: 90;
            padding-bottom: env(safe-area-inset-bottom);
            box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
          }

          .mobile-nav-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2px;
            height: 100%;
            background: transparent;
            border: none;
            color: var(--duo-wolf);
            font-family: var(--font-sans);
            cursor: pointer;
            padding: 4px 0;
            transition: color 120ms ease;
          }

          .mobile-nav-item.active {
            color: var(--duo-blue);
          }

          .mobile-icon-wrap {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-badge-dot {
            position: absolute;
            top: -2px;
            right: -4px;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: var(--duo-orange);
          }

          .mobile-tab-text {
            font-size: 11px;
            font-weight: 800;
            line-height: 1;
          }
        }
      `}</style>
    </>
  );
}

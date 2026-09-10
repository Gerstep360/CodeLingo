import React, { useState } from 'react';
import { Award, Target, Sparkles, HelpCircle, ChevronRight, Check } from 'lucide-react';
import { DUO_RECOVERY_PHRASES, DUO_GOLDEN_TABLE } from '../../data/duoLessonsData';
import { DuoFlameIcon, DuoBacktrackIcon, DuoDiceIcon, DuoShuffleIcon, DuoMatrixIcon } from './DuoIcons';

const ICON_MAP = {
  backtrack: <DuoBacktrackIcon size={16} />,
  dice: <DuoDiceIcon size={16} />,
  shuffle: <DuoShuffleIcon size={16} />,
  matrix: <DuoMatrixIcon size={16} />
};

export function DuoRightRail({ streak = 4, dailyXp = 35, targetXp = 50, onOpenCheatsheet }) {
  const [activeTab, setActiveTab] = useState('phrases'); // 'phrases' | 'table'

  return (
    <aside className="duo-right-rail">
      {/* Daily Quest / Streak Header Card */}
      <div className="duo-card duo-streak-card">
        <div className="card-top-row">
          <div className="icon-badge streak">
            <DuoFlameIcon size={26} color="#FFFFFF" />
          </div>
          <div className="card-info">
            <h4 className="card-title">Racha activa: {streak} días</h4>
            <p className="card-desc">¡Estás en racha para el examen!</p>
          </div>
        </div>

        {/* XP Daily Progress */}
        <div className="daily-xp-wrap">
          <div className="xp-label-row">
            <span className="xp-name">Objetivo Diario</span>
            <span className="xp-count">{dailyXp} / {targetXp} XP</span>
          </div>
          <div className="duo-progress-bar">
            <div
              className="duo-progress-fill"
              style={{ width: `${Math.min(100, Math.round((dailyXp / targetXp) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Memory Pills / Cheatsheet Card */}
      <div className="duo-card duo-rescue-card">
        <div className="rescue-header">
          <div className="rescue-title-wrap">
            <span className="rescue-badge">SOS EXAMEN</span>
            <h4 className="rescue-title">4 Frases para Recuperar Todo</h4>
          </div>
          <button
            type="button"
            className="btn-tab-toggle"
            onClick={() => setActiveTab(activeTab === 'phrases' ? 'table' : 'phrases')}
            title="Alternar entre Frases y Tabla de Oro"
          >
            {activeTab === 'phrases' ? 'Ver Tabla' : 'Ver Frases'}
          </button>
        </div>

        {activeTab === 'phrases' ? (
          <div className="rescue-phrases-list">
            {DUO_RECOVERY_PHRASES.map((item) => (
              <div key={item.title} className="phrase-item">
                <div className="phrase-top">
                  <span className="phrase-icon">{ICON_MAP[item.iconKey] || <Sparkles size={14} />}</span>
                  <span className="phrase-name">{item.title}</span>
                </div>
                <div className="phrase-code">{item.phrase}</div>
                <div className="phrase-detail">{item.detail}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="golden-table-mini">
            <div className="table-header-mini">
              <span>Algoritmo</span>
              <span>For</span>
              <span>Llamada</span>
            </div>
            {DUO_GOLDEN_TABLE.map((row) => (
              <div key={row.algo} className="table-row-mini">
                <span className="row-algo">{row.algo}</span>
                <span className="row-start">{row.start}</span>
                <span className="row-call">{row.call}</span>
              </div>
            ))}
          </div>
        )}

        {onOpenCheatsheet && (
          <button
            type="button"
            className="duo-btn duo-btn-secondary view-full-btn"
            onClick={onOpenCheatsheet}
          >
            <span>Abrir Guía Completa</span>
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      <style>{`
        .duo-right-rail {
          width: 330px;
          min-width: 330px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 24px 20px 40px;
        }

        .duo-card {
          background: #FFFFFF;
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-lg);
          padding: 20px;
          box-shadow: 0 4px 0 var(--duo-swan);
        }

        .card-top-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .icon-badge {
          width: 46px;
          height: 46px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-badge.streak {
          background: var(--duo-orange);
          box-shadow: 0 4px 0 var(--duo-orange-shadow);
        }

        .card-title {
          font-size: 16px;
          font-weight: 800;
          color: var(--duo-eel);
          line-height: 1.2;
        }

        .card-desc {
          font-size: 13px;
          font-weight: 600;
          color: var(--duo-wolf);
          margin-top: 2px;
        }

        .daily-xp-wrap {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .xp-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 800;
        }

        .xp-name {
          color: var(--duo-eel);
        }

        .xp-count {
          color: var(--duo-green);
        }

        /* Rescue SOS Card */
        .rescue-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .rescue-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 900;
          color: var(--duo-red);
          background: var(--duo-red-soft);
          border: 1px solid #FFB8B8;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .rescue-title {
          font-size: 15px;
          font-weight: 800;
          color: var(--duo-eel);
        }

        .btn-tab-toggle {
          background: var(--duo-polar);
          border: 1px solid var(--duo-swan);
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 800;
          color: var(--duo-blue);
          cursor: pointer;
        }

        .btn-tab-toggle:hover {
          background: var(--duo-blue-soft);
        }

        .rescue-phrases-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .phrase-item {
          background: var(--duo-polar);
          border: 1px solid var(--duo-swan);
          border-radius: 12px;
          padding: 10px 12px;
        }

        .phrase-top {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          color: var(--duo-wolf);
          text-transform: uppercase;
        }

        .phrase-code {
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 800;
          color: var(--duo-blue);
          margin: 3px 0;
        }

        .phrase-detail {
          font-size: 12px;
          color: var(--duo-wolf);
          line-height: 1.3;
        }

        /* Golden Table Mini */
        .golden-table-mini {
          display: flex;
          flex-direction: column;
          font-size: 12px;
          border: 1px solid var(--duo-swan);
          border-radius: 10px;
          overflow: hidden;
        }

        .table-header-mini {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          background: var(--duo-polar);
          padding: 8px;
          font-weight: 800;
          color: var(--duo-wolf);
          border-bottom: 1px solid var(--duo-swan);
        }

        .table-row-mini {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          padding: 8px;
          border-bottom: 1px solid var(--duo-swan);
          font-family: var(--font-mono);
        }

        .table-row-mini:last-child {
          border-bottom: none;
        }

        .row-algo {
          font-weight: 700;
          color: var(--duo-eel);
        }

        .row-start {
          color: var(--duo-blue);
        }

        .row-call {
          color: var(--duo-green);
          font-weight: 700;
        }

        .view-full-btn {
          width: 100%;
          min-height: 40px;
          font-size: 13px;
          margin-top: 14px;
        }

        @media (max-width: 1180px) {
          .duo-right-rail {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}

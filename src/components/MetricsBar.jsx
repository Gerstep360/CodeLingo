import React from 'react';
import { Zap, Target, Gauge, AlertCircle, TrendingUp, Flame } from 'lucide-react';

export function MetricsBar({
  wpm,
  cpm,
  accuracy,
  totalErrors,
  progressPercent,
  streak,
  maxStreak,
  comboMultiplier,
  comboTierName,
  comboColor,
  isExamMode
}) {
  return (
    <div className="metrics-bar-container">
      {/* Metric Chip: WPM */}
      <div className="metric-chip">
        <div className="metric-icon-wrap mint">
          <Gauge size={16} />
        </div>
        <div className="metric-data">
          <span className="metric-value">{wpm}</span>
          <span className="metric-label">WPM</span>
        </div>
      </div>

      {/* Metric Chip: CPM */}
      <div className="metric-chip">
        <div className="metric-icon-wrap sky">
          <TrendingUp size={16} />
        </div>
        <div className="metric-data">
          <span className="metric-value">{cpm}</span>
          <span className="metric-label">CPM</span>
        </div>
      </div>

      {/* Metric Chip: Precisión */}
      <div className="metric-chip">
        <div className="metric-icon-wrap lavender">
          <Target size={16} />
        </div>
        <div className="metric-data">
          <span className="metric-value">{accuracy}%</span>
          <span className="metric-label">Precisión</span>
        </div>
      </div>

      {/* Metric Chip: Errores */}
      <div className="metric-chip">
        <div className="metric-icon-wrap peach">
          <AlertCircle size={16} />
        </div>
        <div className="metric-data">
          <span className="metric-value">{totalErrors}</span>
          <span className="metric-label">Errores</span>
        </div>
      </div>

      {/* Metric Chip: Combo & Racha (Video Game Style) */}
      <div className={`metric-chip combo-chip ${streak >= 25 ? 'combo-active' : ''}`}>
        <div className="metric-icon-wrap honey">
          <Flame size={16} className={streak >= 25 ? 'animate-pulse-gentle' : ''} />
        </div>
        <div className="metric-data">
          <div className="combo-value-row">
            <span className="metric-value">{streak}</span>
            <span className="combo-multiplier-pill" style={{ borderColor: comboColor, color: comboColor }}>
              {comboTierName}
            </span>
          </div>
          <span className="metric-label">Racha (Máx: {maxStreak})</span>
        </div>
      </div>

      {/* Progress Pill Bar */}
      <div className="metric-progress-wrapper">
        <div className="progress-info">
          <span className="progress-label">Progreso del Código</span>
          <span className="progress-value">{progressPercent}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <style>{`
        .metrics-bar-container {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 28px;
          background: var(--card-bg);
          border-bottom: 1px solid var(--card-border);
          overflow-x: auto;
        }

        .metric-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          background: var(--bg-main);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
          min-width: 105px;
          flex-shrink: 0;
          transition: var(--transition-fast);
        }

        .metric-icon-wrap {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .metric-icon-wrap.mint {
          background: var(--pastel-mint-bg);
          color: var(--pastel-mint);
          border: 1px solid var(--pastel-mint-border);
        }

        .metric-icon-wrap.sky {
          background: var(--pastel-sky-bg);
          color: var(--pastel-sky);
          border: 1px solid var(--pastel-sky-border);
        }

        .metric-icon-wrap.lavender {
          background: var(--pastel-lavender-bg);
          color: var(--pastel-lavender);
          border: 1px solid var(--pastel-lavender-border);
        }

        .metric-icon-wrap.peach {
          background: var(--pastel-peach-bg);
          color: var(--pastel-peach);
          border: 1px solid var(--pastel-peach-border);
        }

        .metric-icon-wrap.honey {
          background: var(--pastel-honey-bg);
          color: var(--pastel-honey);
          border: 1px solid var(--pastel-honey-border);
        }

        .metric-data {
          display: flex;
          flex-direction: column;
        }

        .metric-value {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.1;
        }

        .metric-label {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* Combo Chip */
        .combo-chip {
          min-width: 170px;
          background: var(--pastel-honey-bg);
          border-color: var(--pastel-honey-border);
        }

        .combo-chip.combo-active {
          border-color: var(--pastel-lavender);
          box-shadow: 0 0 10px rgba(108, 92, 231, 0.12);
        }

        .combo-value-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .combo-multiplier-pill {
          font-size: 9px;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: var(--radius-full);
          border: 1px solid;
          background: #FFFFFF;
          letter-spacing: 0.3px;
        }

        /* Progress track */
        .metric-progress-wrapper {
          flex: 1;
          min-width: 140px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-left: 6px;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .progress-value {
          color: var(--text-primary);
          font-weight: 700;
        }

        .progress-track {
          width: 100%;
          height: 6px;
          background: var(--bg-subtle);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--pastel-mint), var(--pastel-lavender));
          border-radius: var(--radius-full);
          transition: width 0.15s ease;
        }
      `}</style>
    </div>
  );
}

import React, { useState } from 'react';
import { Bot, Sparkles, ChevronDown, ChevronUp, Copy, Check, Lightbulb } from 'lucide-react';
import { getAIPatternForLine } from '../utils/aiExamCoach';

export function AICoachPanel({ targetCode, currentIndex, isExamMode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get active AI pattern for the current code section
  const currentLineText = '';
  const pattern = getAIPatternForLine(currentLineText, targetCode, currentIndex);

  if (!pattern) return null;

  const handleCopyCheatCode = () => {
    if (pattern.cheatCode) {
      navigator.clipboard.writeText(pattern.cheatCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="ai-coach-card">
      <div className="ai-coach-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="ai-coach-title-wrap">
          <div className="ai-bot-badge">
            <Bot size={16} />
          </div>
          <div>
            <div className="ai-badge-row">
              <span className="ai-label-pill">IA Copilot de Examen</span>
              <span className="ai-concept-pill">{pattern.concept}</span>
            </div>
            <h3 className="ai-pattern-title">{pattern.title}</h3>
          </div>
        </div>

        <div className="ai-coach-actions">
          <span className="ai-hint-tag">Atajo de Memoria</span>
          <button className="btn-collapse-toggle">
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="ai-coach-content animate-pop">
          <p className="ai-insight-text">
            {pattern.aiInsight}
          </p>

          <div className="ai-cheat-box">
            <div className="cheat-label-row">
              <span className="cheat-label">
                <Sparkles size={12} color="var(--pastel-lavender)" />
                <span>Estructura Clave a Recordar:</span>
              </span>
              <button
                type="button"
                onClick={handleCopyCheatCode}
                className="btn-copy-cheat"
                title="Copiar atajo"
              >
                {copied ? <Check size={12} color="var(--pastel-mint)" /> : <Copy size={12} />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <code className="cheat-code-snippet">{pattern.cheatCode}</code>
          </div>
        </div>
      )}

      <style>{`
        .ai-coach-card {
          margin: 0 28px 14px 28px;
          background: var(--card-bg);
          border: 1px solid var(--pastel-lavender-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          transition: var(--transition-fast);
        }

        .ai-coach-card:hover {
          border-color: var(--pastel-lavender);
        }

        .ai-coach-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 18px;
          background: var(--pastel-lavender-bg);
          cursor: pointer;
          user-select: none;
        }

        .ai-coach-title-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-bot-badge {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          background: var(--card-bg);
          color: var(--pastel-lavender);
          border: 1px solid var(--pastel-lavender-border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ai-badge-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ai-label-pill {
          font-size: 10px;
          font-weight: 800;
          color: var(--pastel-lavender);
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .ai-concept-pill {
          font-size: 10px;
          font-weight: 700;
          background: var(--card-bg);
          color: var(--text-secondary);
          border: 1px solid var(--card-border);
          padding: 1px 6px;
          border-radius: var(--radius-full);
        }

        .ai-pattern-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .ai-coach-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ai-hint-tag {
          font-size: 11px;
          font-weight: 600;
          color: var(--pastel-lavender);
        }

        .btn-collapse-toggle {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .ai-coach-content {
          padding: 12px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 1px solid var(--pastel-lavender-border);
          background: #FCFBFE;
        }

        .ai-insight-text {
          font-size: 12px;
          color: var(--text-primary);
          line-height: 1.5;
        }

        .ai-cheat-box {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cheat-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cheat-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          color: var(--pastel-lavender);
        }

        .btn-copy-cheat {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .btn-copy-cheat:hover {
          color: var(--pastel-lavender);
        }

        .cheat-code-snippet {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--pastel-mint);
          background: var(--pastel-mint-bg);
          border: 1px solid var(--pastel-mint-border);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}

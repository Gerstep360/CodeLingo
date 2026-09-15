import React, { useState, useEffect } from 'react';
import { Box, Code } from 'lucide-react';

export function IntelliSensePopup({
  triggerData,
  selectedIndex: propIndex,
  setSelectedIndex: propSetIndex,
  onSelectSuggestion,
  onClose
}) {
  const [localIndex, setLocalIndex] = useState(0);
  const selectedIndex = propIndex !== undefined ? propIndex : localIndex;
  const setSelectedIndex = propSetIndex || setLocalIndex;

  const suggestions = triggerData?.suggestions || [];

  useEffect(() => {
    setSelectedIndex(0);
  }, [triggerData?.objectPath, triggerData?.memberQuery]);

  if (!triggerData || suggestions.length === 0) return null;

  const activeItem = suggestions[selectedIndex] || suggestions[0];

  return (
    <div className="intellisense-popup animate-pop">
      <div className="intellisense-header">
        <div className="ide-dot-label">
          <span className="dot-icon"></span>
          <span className="object-name">{triggerData.objectPath}.</span>
          <span className="query-hint">{triggerData.memberQuery || 'métodos'}</span>
        </div>
        <span className="tab-hint">Pulsa [Enter] o [Tab] para autocompletar</span>
      </div>

      <div className="intellisense-body">
        {/* Suggestions list */}
        <div className="suggestions-list">
          {suggestions.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={item.label}
                className={`suggestion-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectSuggestion(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <span className={`type-badge ${item.type}`}>
                  {item.type === 'method' ? 'm' : 'p'}
                </span>
                <span className="item-label">{item.label}</span>
                <span className="item-detail">{item.detail}</span>
              </div>
            );
          })}
        </div>

        {/* Documentation side card */}
        {activeItem && (
          <div className="suggestion-doc-card">
            <div className="doc-title">{activeItem.detail}</div>
            <div className="doc-desc">{activeItem.desc}</div>
            <div className="doc-shortcut">Inserta: <code>{activeItem.insertText}</code></div>
          </div>
        )}
      </div>

      <style>{`
        .intellisense-popup {
          position: absolute;
          top: 30px;
          left: 0;
          background: #FFFFFF;
          border: 1px solid var(--pastel-lavender-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 50;
          display: flex;
          flex-direction: column;
          min-width: 380px;
          max-width: 520px;
          overflow: hidden;
          font-family: var(--font-sans);
        }

        .intellisense-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 12px;
          background: var(--pastel-lavender-bg);
          border-bottom: 1px solid var(--pastel-lavender-border);
          font-size: 11px;
        }

        .ide-dot-label {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .object-name {
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--pastel-lavender);
        }

        .query-hint {
          color: var(--text-secondary);
        }

        .tab-hint {
          font-size: 10px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .intellisense-body {
          display: flex;
          max-height: 220px;
        }

        .suggestions-list {
          flex: 1;
          overflow-y: auto;
          padding: 4px 0;
          border-right: 1px solid var(--card-border);
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          cursor: pointer;
          font-size: 12px;
          transition: var(--transition-fast);
        }

        .suggestion-item:hover, .suggestion-item.selected {
          background: var(--pastel-lavender-bg);
        }

        .type-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          font-family: var(--font-mono);
          text-transform: uppercase;
        }

        .type-badge.method {
          background: #E8E6FC;
          color: #6C5CE7;
        }

        .type-badge.property {
          background: #E1F0FE;
          color: #3B82F6;
        }

        .item-label {
          font-family: var(--font-mono);
          font-weight: 600;
          color: var(--text-primary);
        }

        .item-detail {
          margin-left: auto;
          font-size: 10px;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .suggestion-doc-card {
          width: 170px;
          padding: 10px 12px;
          background: #FAF9F6;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 11px;
        }

        .doc-title {
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--pastel-lavender);
          font-size: 11px;
          word-break: break-all;
        }

        .doc-desc {
          color: var(--text-secondary);
          line-height: 1.35;
        }

        .doc-shortcut {
          margin-top: auto;
          font-size: 10px;
          color: var(--text-muted);
        }

        .doc-shortcut code {
          background: #FFFFFF;
          border: 1px solid var(--card-border);
          border-radius: 3px;
          padding: 1px 4px;
          color: var(--pastel-mint);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

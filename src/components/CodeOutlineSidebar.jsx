import React, { useState } from 'react';
import { Compass, Search, Copy, Check, Code2 } from 'lucide-react';

export function CodeOutlineSidebar({ outlineFunctions, activeFunction, onSelectFunction }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedFnName, setCopiedFnName] = useState(null);

  const filtered = (outlineFunctions || []).filter((fn) =>
    fn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (fn.fullSignature && fn.fullSignature.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCopy = (e, fn) => {
    e.stopPropagation();
    const textToCopy = fn.codeSnippet || fn.fullSignature || '';
    navigator.clipboard.writeText(textToCopy);
    setCopiedFnName(fn.name);
    setTimeout(() => {
      setCopiedFnName((curr) => (curr === fn.name ? null : curr));
    }, 1800);
  };

  return (
    <aside className="ide-outline-panel">
      <div className="outline-header">
        <div className="outline-title-row">
          <Compass size={15} color="var(--pastel-lavender)" />
          <span className="outline-title">Navegador de Algoritmos</span>
        </div>
        <span className="outline-subtitle">Elige qué programar primero (No-lineal)</span>
      </div>

      {/* Quick Search */}
      <div className="outline-search-wrap">
        <Search size={13} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Buscar función (ej. mochila)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="outline-search-input"
        />
      </div>

      {/* Function list */}
      <div className="outline-list">
        {filtered.length === 0 && (
          <div className="outline-empty">No se encontraron funciones</div>
        )}

        {filtered.map((fn) => {
          const isActive = activeFunction === fn.name;
          const isCopied = copiedFnName === fn.name;

          return (
            <div
              key={fn.name + fn.lineIdx}
              className={`outline-item-wrap ${isActive ? 'active' : ''}`}
              onClick={() => onSelectFunction(fn)}
              title={`Saltar a línea ${fn.lineIdx + 1}: ${fn.fullSignature}`}
            >
              <div className="item-main-clickable">
                <div className="item-prefix">
                  <span className="fn-type">{fn.returnType || 'void'}</span>
                  <span className="fn-name">{fn.name}</span>
                </div>
                <div className="item-params">
                  ({fn.params ? fn.params.split(',').map((p) => p.trim().split(' ').pop()).join(', ') : ''})
                </div>
              </div>

              <div className="item-actions">
                <span className="item-line">L{fn.lineIdx + 1}</span>
                <button
                  type="button"
                  className={`btn-outline-copy ${isCopied ? 'copied' : ''}`}
                  onClick={(e) => handleCopy(e, fn)}
                  title="Copiar código de esta función"
                >
                  {isCopied ? <Check size={11} color="var(--pastel-mint)" /> : <Copy size={11} />}
                  <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .ide-outline-panel {
          width: 270px;
          background: var(--card-bg);
          border-right: 1px solid var(--card-border);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          user-select: none;
        }

        .outline-header {
          padding: 12px 16px 10px 16px;
          border-bottom: 1px solid var(--card-border);
          background: var(--bg-main);
        }

        .outline-title-row {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .outline-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .outline-subtitle {
          font-size: 10px;
          color: var(--text-secondary);
          display: block;
          margin-top: 2px;
        }

        .outline-search-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-bottom: 1px solid var(--card-border);
          background: var(--bg-subtle);
        }

        .outline-search-input {
          border: none;
          outline: none;
          font-size: 11px;
          width: 100%;
          color: var(--text-primary);
          background: transparent;
        }

        .outline-list {
          flex: 1;
          overflow-y: auto;
          padding: 6px 0;
        }

        .outline-empty {
          padding: 16px;
          font-size: 11px;
          color: var(--text-muted);
          text-align: center;
        }

        .outline-item-wrap {
          width: 100%;
          padding: 7px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          cursor: pointer;
          transition: var(--transition-fast);
          border-left: 3px solid transparent;
        }

        .outline-item-wrap:hover {
          background: var(--bg-main);
        }

        .outline-item-wrap.active {
          background: var(--pastel-lavender-bg);
          border-left-color: var(--pastel-lavender);
        }

        .item-main-clickable {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .item-prefix {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .fn-type {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--pastel-sky);
          font-weight: 600;
        }

        .fn-name {
          font-family: var(--font-sans);
          font-size: 12px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .outline-item-wrap.active .fn-name {
          color: var(--pastel-lavender);
        }

        .item-params {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .item-line {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          color: var(--text-muted);
          background: var(--bg-main);
          padding: 1px 4px;
          border-radius: 3px;
        }

        .btn-outline-copy {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 3px 6px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          font-size: 10px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-outline-copy:hover {
          background: var(--pastel-lavender-bg);
          color: var(--pastel-lavender);
          border-color: var(--pastel-lavender-border);
        }

        .btn-outline-copy.copied {
          color: var(--pastel-mint);
          border-color: var(--pastel-mint-border);
          background: var(--pastel-mint-bg);
        }
      `}</style>
    </aside>
  );
}

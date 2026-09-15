import React, { useState, useEffect } from 'react';
import { Star, Check, Lock, Zap, Sparkles, Play, Brain, BookOpen } from 'lucide-react';
import { DUO_UNITS, getNodeLockStatus } from '../../data/duoLessonsData';
import { DuoTrophyIcon } from './DuoIcons';
import { duoStorage } from '../../utils/duoStorage';

export function DuoLearningPath({
  completedNodeIds = [],
  activeNodeId = 'node-sumandos-base',
  onStartLesson,
  onOpenClass
}) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [lockTooltipNode, setLockTooltipNode] = useState(null);
  const [activeLesson, setActiveLesson] = useState(() => duoStorage.getActiveLesson());

  useEffect(() => {
    const handleStorageChange = () => {
      setActiveLesson(duoStorage.getActiveLesson());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleNodeClick = (node, lockStatus) => {
    if (lockStatus.isLocked) {
      setLockTooltipNode({ node, reason: lockStatus.reason });
      setSelectedNode(null);
      return;
    }
    setLockTooltipNode(null);
    setSelectedNode(node);
  };

  // Conteo global de progreso del Primer Parcial
  const allNodes = DUO_UNITS.flatMap((u) => u.nodes);
  const totalCompleted = allNodes.filter((n) => completedNodeIds.includes(n.id)).length;
  const progressPercent = Math.round((totalCompleted / allNodes.length) * 100) || 0;

  return (
    <div className="duo-learning-path-wrap">
      {/* Cabecera General del Primer Parcial */}
      <header className="parcial-header-card">
        <div className="parcial-header-badge">
          <Sparkles size={14} />
          <span>CURSO OFICIAL · PRIMER PARCIAL</span>
        </div>
        <h2 className="parcial-header-title">Inteligencia Artificial — Ing. Vargas</h2>
        <p className="parcial-header-sub">
          7 familias canónicas de examen. Aprende primero la <strong>Base</strong>, domina sus <strong>Variantes</strong> en paralelo y supera el <strong>Examen de Clase</strong>.
        </p>

        <div className="parcial-progress-box">
          <div className="parcial-progress-meta">
            <span>PROGRESO DEL PARCIAL</span>
            <strong>{totalCompleted} de {allNodes.length} Nodos ({progressPercent}%)</strong>
          </div>
          <div className="parcial-progress-track">
            <div className="parcial-progress-bar" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </header>

      {/* Banner de Reanudación de Sesión Guardada */}
      {activeLesson?.nodeId && (
        <div className="resume-lesson-banner animate-pop">
          <div className="resume-left">
            <div className="resume-play-bubble">
              <Play size={20} fill="#FFFFFF" color="#FFFFFF" />
            </div>
            <div className="resume-text-group">
              <span className="resume-eyebrow">SESIÓN EN PROGRESO · CONTINUAR DONDE TE QUEDASTE</span>
              <h4 className="resume-lesson-name">{activeLesson.nodeTitle || 'Lección de Examen'}</h4>
            </div>
          </div>
          <div className="resume-actions-group">
            <button
              type="button"
              className="duo-btn duo-btn-primary btn-resume-now"
              onClick={() => onStartLesson({ id: activeLesson.nodeId, classId: activeLesson.classId, title: activeLesson.nodeTitle })}
            >
              <span>CONTINUAR</span>
              <Play size={14} fill="#FFFFFF" />
            </button>
            <button
              type="button"
              className="btn-dismiss-resume"
              title="Descartar lección guardada"
              onClick={() => {
                duoStorage.clearActiveLesson();
                setActiveLesson(null);
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Renderizado de las 7 Clases Jerárquicas */}
      {DUO_UNITS.map((unit, unitIdx) => {
        const baseNode = unit.nodes.find((n) => n.nodeRole === 'base');
        const variantNodes = unit.nodes.filter((n) => n.nodeRole === 'variant');
        const speedrunNode = unit.nodes.find((n) => n.nodeRole === 'speedrun');
        const examNode = unit.nodes.find((n) => n.nodeRole === 'exam');

        const unitCompletedNodes = unit.nodes.filter((n) => completedNodeIds.includes(n.id));
        const isUnitDone = unitCompletedNodes.length === unit.nodes.length;
        const isBaseDone = baseNode && completedNodeIds.includes(baseNode.id);

        return (
          <section key={unit.id} className="duo-class-tree-section">
            {/* Banner Duolingo de Clase */}
            <div className="duo-class-banner" style={{ background: unit.color }}>
              <div className="class-banner-content">
                <div className="class-tag-row">
                  <span className="class-badge-pill">TEMA {unitIdx + 1} · PRIMER PARCIAL</span>
                  {isUnitDone && (
                    <span className="class-done-pill">
                      <Check size={12} strokeWidth={3} /> COMPLETADA
                    </span>
                  )}
                  <button
                    type="button"
                    className="btn-view-class-page"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenClass?.(unit.id);
                    }}
                    title="Ver página dedicada y nodos de esta clase"
                  >
                    <BookOpen size={12} />
                    <span>Página de Clase</span>
                  </button>
                </div>
                <h3 className="class-title">{unit.title}</h3>
                <p className="class-subtitle">{unit.subtitle}</p>

                {unit.mentalModel?.phrase && (
                  <div className="class-mental-chip">
                    <span className="chip-label"><Brain size={14} className="icon-inline"/>MODELO MENTAL:</span>
                    <span className="chip-phrase">{unit.mentalModel.phrase}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ÁRBOL JERÁRQUICO DE NODOS */}
            <div className="hierarchy-tree-container">
              {/* =======================================================
                  NIVEL 1: ALGORITMO BASE
                  ======================================================= */}
              {baseNode && (
                <div className="hierarchy-level level-base">
                  <div className="level-tag">NIVEL 1: APRENDER BASE</div>
                  <NodeItem
                    node={baseNode}
                    completedNodeIds={completedNodeIds}
                    activeNodeId={activeNodeId}
                    onNodeClick={handleNodeClick}
                    selectedNode={selectedNode}
                    lockTooltipNode={lockTooltipNode}
                    onCloseModal={() => {
                      setSelectedNode(null);
                      setLockTooltipNode(null);
                    }}
                    onStartLesson={onStartLesson}
                    badgeText="BASE"
                  />
                </div>
              )}

              {/* Línea conectora hacia abajo */}
              <div className="tree-connector-stem">
                <div className={`stem-line ${isBaseDone ? 'stem-done' : ''}`} />
                <div className="stem-junction-branch">
                  <span className="junction-text">DESBLOQUEA VARIANTES</span>
                </div>
              </div>

              {/* =======================================================
                  NIVEL 2: VARIANTES EN PARALELO
                  ======================================================= */}
              {variantNodes.length > 0 && (
                <div className="hierarchy-level level-variants">
                  <div className="level-tag">
                    NIVEL 2: VARIANTES (BASE + DELTA)
                    {!isBaseDone && <span className="tag-lock-hint"><Lock size={12} className="icon-inline"/> Requiere Base</span>}
                  </div>
                  <div className="variants-grid">
                    {variantNodes.map((vNode) => {
                      // Extraer regla corta o delta para mostrar como chip rápido
                      let deltaChip = null;
                      if (vNode.delta && vNode.delta[0]) {
                        deltaChip = vNode.delta[0].after || vNode.delta[0].added || vNode.delta[0].reason;
                      } else if (vNode.shortDesc) {
                        deltaChip = vNode.shortDesc;
                      }

                      return (
                        <div key={vNode.id} className="variant-cell">
                          <NodeItem
                            node={vNode}
                            completedNodeIds={completedNodeIds}
                            activeNodeId={activeNodeId}
                            onNodeClick={handleNodeClick}
                            selectedNode={selectedNode}
                            lockTooltipNode={lockTooltipNode}
                            onCloseModal={() => {
                              setSelectedNode(null);
                              setLockTooltipNode(null);
                            }}
                            onStartLesson={onStartLesson}
                            badgeText="DELTA"
                            customSubChip={deltaChip}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Línea conectora convergiendo a Speedrun y Examen */}
              <div className="tree-connector-stem">
                <div className="stem-line" />
              </div>

              {/* =======================================================
                  NIVEL 3 & 4: SPEEDRUN Y EXAMEN DE CLASE
                  ======================================================= */}
              <div className="hierarchy-level level-mastery">
                <div className="level-tag">NIVEL 3: SPEEDRUN & EXAMEN</div>
                <div className="mastery-nodes-row">
                  {speedrunNode && (
                    <NodeItem
                      node={speedrunNode}
                      completedNodeIds={completedNodeIds}
                      activeNodeId={activeNodeId}
                      onNodeClick={handleNodeClick}
                      selectedNode={selectedNode}
                      lockTooltipNode={lockTooltipNode}
                      onCloseModal={() => {
                        setSelectedNode(null);
                        setLockTooltipNode(null);
                      }}
                      onStartLesson={onStartLesson}
                      badgeText="SPEEDRUN"
                      customIcon={<Zap size={24} />}
                    />
                  )}

                  {examNode && (
                    <NodeItem
                      node={examNode}
                      completedNodeIds={completedNodeIds}
                      activeNodeId={activeNodeId}
                      onNodeClick={handleNodeClick}
                      selectedNode={selectedNode}
                      lockTooltipNode={lockTooltipNode}
                      onCloseModal={() => {
                        setSelectedNode(null);
                        setLockTooltipNode(null);
                      }}
                      onStartLesson={onStartLesson}
                      badgeText="EXAMEN"
                      customIcon={<DuoTrophyIcon size={28} />}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <style>{`
        .duo-learning-path-wrap {
          flex: 1;
          max-width: 720px;
          margin: 0 auto;
          padding: 24px 16px 140px;
          display: flex;
          flex-direction: column;
          gap: 52px;
          font-family: var(--font-display, "Nunito", system-ui, sans-serif);
        }

        /* Cabecera del Parcial */
        .parcial-header-card {
          background: var(--card-bg, #FFFFFF);
          border: 2px solid var(--duo-swan, #E5E5E5);
          border-bottom-width: 4px;
          border-radius: 20px;
          padding: 22px 26px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }

        /* Banner de Reanudación de Sesión Guardada */
        .resume-lesson-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--card-bg);
          border: 2px solid var(--duo-green);
          border-bottom-width: 4px;
          border-radius: 20px;
          padding: 16px 22px;
          box-shadow: 0 4px 0 var(--duo-green-shadow, #46A302);
          gap: 16px;
          flex-wrap: wrap;
        }

        .resume-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .resume-play-bubble {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--duo-green);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 3px 0 var(--duo-green-shadow, #46A302);
        }

        .resume-text-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .resume-eyebrow {
          font-size: 10px;
          font-weight: 900;
          color: var(--duo-green);
          letter-spacing: 0.8px;
        }

        .resume-lesson-name {
          font-size: 16px;
          font-weight: 900;
          color: var(--duo-eel);
          margin: 0;
        }

        .resume-actions-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-resume-now {
          min-height: 42px;
          padding: 0 18px;
          font-size: 13px;
        }

        .btn-dismiss-resume {
          background: transparent;
          border: none;
          font-size: 24px;
          line-height: 1;
          color: var(--duo-wolf);
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: var(--transition-fast);
        }

        .btn-dismiss-resume:hover {
          color: var(--duo-eel);
          background: var(--bg-subtle);
        }

        .btn-view-class-page {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.22);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.4);
          padding: 3px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: var(--transition-fast);
          margin-left: auto;
        }

        .btn-view-class-page:hover {
          background: rgba(255, 255, 255, 0.35);
          transform: translateY(-1px);
        }

        .parcial-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #DDF4FF;
          color: #168CC5;
          border: 1.5px solid #B8E7FF;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.8px;
          padding: 3px 10px;
          border-radius: 999px;
          width: fit-content;
        }

        .parcial-header-title {
          font-size: 22px;
          font-weight: 900;
          color: var(--duo-eel, #4B4B4B);
          margin: 0;
          line-height: 1.25;
        }

        .parcial-header-sub {
          font-size: 14px;
          color: var(--duo-wolf, #777777);
          margin: 0;
          line-height: 1.45;
        }

        .parcial-progress-box {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .parcial-progress-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 800;
          color: var(--duo-wolf, #777777);
        }

        .parcial-progress-meta strong {
          color: var(--duo-green, #58CC02);
        }

        .parcial-progress-track {
          width: 100%;
          height: 14px;
          background: var(--duo-swan, #E5E5E5);
          border-radius: 999px;
          overflow: hidden;
          position: relative;
        }

        .parcial-progress-bar {
          height: 100%;
          background: var(--duo-green, #58CC02);
          box-shadow: 0 2px 0 #46A302 inset;
          border-radius: 999px;
          transition: width 400ms ease;
        }

        /* Sección de Clase */
        .duo-class-tree-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          width: 100%;
        }

        /* Banner Duolingo */
        .duo-class-banner {
          width: 100%;
          border-radius: 20px;
          padding: 22px 24px;
          color: #FFFFFF;
          box-shadow: 0 6px 0 rgba(0, 0, 0, 0.16);
          position: relative;
          overflow: hidden;
        }

        .class-tag-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .class-badge-pill {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.9px;
          text-transform: uppercase;
          background: rgba(0, 0, 0, 0.22);
          padding: 4px 10px;
          border-radius: 8px;
        }

        .class-done-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 900;
          background: #FFFFFF;
          color: #2E7D32;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .class-title {
          font-size: 22px;
          font-weight: 900;
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.2px;
        }

        .class-subtitle {
          font-size: 14px;
          font-weight: 600;
          opacity: 0.94;
          margin: 6px 0 0;
          line-height: 1.4;
        }

        .class-mental-chip {
          margin-top: 14px;
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 8px 14px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }

        .chip-label {
          font-weight: 900;
          letter-spacing: 0.5px;
          opacity: 0.88;
        }

        .chip-phrase {
          font-weight: 800;
          color: #FFF275;
          letter-spacing: 0.3px;
        }

        /* Árbol Jerárquico */
        .hierarchy-tree-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 0;
          position: relative;
        }

        .hierarchy-level {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          position: relative;
        }

        .level-tag {
          font-size: 11px;
          font-weight: 900;
          color: var(--duo-wolf, #777777);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          background: var(--duo-swan, #E5E5E5);
          padding: 2px 10px;
          border-radius: 999px;
          margin-bottom: 6px;
        }

        .tag-lock-hint {
          color: #D32F2F;
          font-weight: 900;
        }

        /* Grid de Variantes */
        .variants-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 24px;
          width: 100%;
          max-width: 600px;
        }

        .variant-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 130px;
        }

        /* Fila de Speedrun y Examen */
        .mastery-nodes-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
          width: 100%;
        }

        /* Tallos Conectores */
        .tree-connector-stem {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          margin: 8px 0;
          position: relative;
        }

        .stem-line {
          width: 4px;
          height: 32px;
          background: var(--duo-swan, #E5E5E5);
          border-radius: 999px;
          transition: background 300ms ease;
        }

        .stem-line.stem-done {
          background: var(--duo-green, #58CC02);
        }

        .stem-junction-branch {
          background: var(--card-bg, #FFFFFF);
          border: 2px solid var(--duo-swan, #E5E5E5);
          padding: 2px 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 900;
          color: var(--duo-wolf, #777777);
          letter-spacing: 0.5px;
          margin-top: -8px;
          z-index: 2;
        }

        /* Node Item Slot */
        .duo-node-slot {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Botón Circular 3D estilo Duolingo */
        .duo-path-node {
          width: 76px;
          height: 70px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: transform 90ms ease, box-shadow 90ms ease, filter 120ms ease;
          user-select: none;
        }

        .duo-path-node:hover:not(.locked) {
          filter: brightness(1.05);
        }

        .duo-path-node:active:not(.locked) {
          transform: translateY(4px);
        }

        /* Nodos por Rol y Estado */
        .duo-path-node.role-base {
          background: #58CC02;
          box-shadow: 0 7px 0 #46A302;
        }
        .duo-path-node.role-base:active {
          box-shadow: 0 2px 0 #46A302;
        }

        .duo-path-node.role-variant {
          background: #1CB0F6;
          box-shadow: 0 7px 0 #168CC5;
        }
        .duo-path-node.role-variant:active {
          box-shadow: 0 2px 0 #168CC5;
        }

        .duo-path-node.role-speedrun {
          background: #FFC800;
          box-shadow: 0 7px 0 #D7A900;
        }
        .duo-path-node.role-speedrun:active {
          box-shadow: 0 2px 0 #D7A900;
        }

        .duo-path-node.role-exam {
          background: #CE82FF;
          box-shadow: 0 7px 0 #A85ED6;
        }
        .duo-path-node.role-exam:active {
          box-shadow: 0 2px 0 #A85ED6;
        }

        /* Completado (Oro) */
        .duo-path-node.completed {
          background: #FFC800 !important;
          box-shadow: 0 7px 0 #D7A900 !important;
        }
        .duo-path-node.completed:active {
          box-shadow: 0 2px 0 #D7A900 !important;
        }

        /* Bloqueado (Gris Piedra) */
        .duo-path-node.locked {
          background: #E5E5E5 !important;
          box-shadow: 0 7px 0 #CBCBCB !important;
          cursor: not-allowed;
        }

        .node-icon-holder {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
        }

        /* Insignia Flotante START */
        .node-crown-badge {
          position: absolute;
          top: -24px;
          background: var(--card-bg, #FFFFFF);
          color: #58CC02;
          border: 2px solid #58CC02;
          box-shadow: 0 3px 0 #58CC02;
          font-size: 10px;
          font-weight: 900;
          padding: 2px 8px;
          border-radius: 999px;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .node-crown-badge.badge-exam {
          color: #B45309;
          border-color: #F59E0B;
          box-shadow: 0 3px 0 #D97706;
          background: #FEF3C7;
        }

        .node-label-caption {
          font-size: 13px;
          font-weight: 800;
          color: var(--duo-eel, #4B4B4B);
          margin-top: 8px;
          max-width: 140px;
          text-align: center;
          line-height: 1.25;
        }

        .node-sub-chip {
          margin-top: 4px;
          font-size: 11px;
          font-weight: 700;
          background: var(--bg-subtle, #F0F4F8);
          color: var(--text-primary, #2D3748);
          padding: 2px 8px;
          border-radius: 6px;
          max-width: 130px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          border: 1px solid var(--card-border, #E2E8F0);
        }

        /* Popover Modal Duolingo */
        .node-tooltip-popover {
          position: absolute;
          top: 84px;
          background: var(--card-bg, #FFFFFF);
          border: 2px solid var(--duo-swan, #E5E5E5);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
          border-radius: 20px;
          padding: 20px;
          width: 310px;
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: popIn 180ms ease forwards;
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.92) translateY(-6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .popover-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 900;
          color: #168CC5;
          background: #DDF4FF;
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid #B8E7FF;
          margin-bottom: 4px;
        }

        .popover-badge.badge-gold {
          color: #B58500;
          background: #FFF5C2;
          border-color: #FFE58F;
        }

        .popover-title {
          font-size: 17px;
          font-weight: 900;
          color: var(--duo-eel, #4B4B4B);
          margin: 0;
          line-height: 1.25;
        }

        .popover-desc {
          font-size: 13px;
          font-weight: 600;
          color: var(--duo-wolf, #777777);
          margin: 4px 0 0;
          line-height: 1.4;
        }

        .popover-delta-box {
          background: var(--bg-subtle, #F8FAFC);
          border: 1.5px solid var(--card-border, #E2E8F0);
          border-radius: 12px;
          padding: 8px 12px;
          font-size: 12px;
          color: var(--text-primary, #334155);
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .popover-delta-box strong {
          color: var(--text-primary, #0F172A);
        }

        .popover-btn {
          width: 100%;
          min-height: 48px;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.6px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        /* Popover de Bloqueo */
        .node-tooltip-popover.popover-locked {
          border-color: var(--duo-swan, #CBD5E1);
          background: var(--bg-subtle, #F8FAFC);
        }

        .locked-alert {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: var(--text-secondary, #475569);
          font-size: 13px;
          line-height: 1.4;
        }

        .locked-alert strong {
          color: var(--text-primary, #0F172A);
          display: block;
          margin-bottom: 2px;
        }

        .btn-close-locked {
          min-height: 38px;
          background: var(--card-bg, #E2E8F0);
          color: var(--text-primary, #334155);
          box-shadow: 0 3px 0 var(--duo-swan, #CBD5E1);
          border-radius: 12px;
          font-weight: 800;
          font-size: 13px;
          border: none;
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .duo-learning-path-wrap {
            padding: 16px 10px 120px;
            gap: 40px;
          }

          .variants-grid {
            gap: 16px;
          }

          .variant-cell {
            min-width: 110px;
          }

          .duo-path-node {
            width: 68px;
            height: 62px;
          }

          .node-tooltip-popover {
            width: 280px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Componente individual de Nodo (3D circle + popover interactivo).
 */
function NodeItem({
  node,
  completedNodeIds,
  activeNodeId,
  onNodeClick,
  selectedNode,
  lockTooltipNode,
  onCloseModal,
  onStartLesson,
  badgeText = '',
  customIcon = null,
  customSubChip = null
}) {
  const isCompleted = completedNodeIds.includes(node.id);
  const isActive = node.id === activeNodeId;
  const lockStatus = getNodeLockStatus(node.id, completedNodeIds);
  const isLocked = lockStatus.isLocked;

  const isSelected = selectedNode?.id === node.id;
  const isLockTooltipOpen = lockTooltipNode?.node?.id === node.id;

  const roleClass = `role-${node.nodeRole || 'variant'}`;

  return (
    <div className="duo-node-slot">
      {/* Botón Circular 3D */}
      <button
        type="button"
        className={`duo-path-node ${roleClass} ${isActive ? 'active animate-pulse-glow' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
        onClick={() => onNodeClick(node, lockStatus)}
        title={node.title}
      >
        <span className="node-icon-holder">
          {isCompleted ? (
            <Check size={28} strokeWidth={3.5} color="#FFFFFF" />
          ) : isLocked ? (
            <Lock size={22} color="#8E9AA0" />
          ) : customIcon ? (
            customIcon
          ) : node.nodeRole === 'base' ? (
            <Star size={28} fill="#FFFFFF" color="#FFFFFF" />
          ) : node.nodeRole === 'exam' ? (
            <DuoTrophyIcon size={28} />
          ) : (
            <Sparkles size={24} color="#FFFFFF" />
          )}
        </span>

        {/* Insignia Flotante START */}
        {isActive && !isCompleted && !isLocked && (
          <div className={`node-crown-badge ${node.nodeRole === 'exam' ? 'badge-exam' : ''}`}>
            <span>{node.nodeRole === 'exam' ? 'EXAMEN' : 'START'}</span>
          </div>
        )}
      </button>

      {/* Etiqueta del Nodo */}
      <span className="node-label-caption">{node.title}</span>

      {/* Chip opcional de Delta rápido */}
      {customSubChip && <span className="node-sub-chip" title={customSubChip}>{customSubChip}</span>}

      {/* POPOVER INTERACTIVO AL HACER CLIC */}
      {isSelected && (
        <div className="node-tooltip-popover">
          <div className="popover-header">
            <span className={`popover-badge ${node.nodeRole === 'exam' ? 'badge-gold' : ''}`}>
              +{node.xp || 25} XP · {badgeText || 'LECCIÓN'}
            </span>
            <h4 className="popover-title">{node.title}</h4>
            <p className="popover-desc">{node.shortDesc}</p>
          </div>

          {/* Si tiene Delta visible, mostrarlo */}
          {node.delta && node.delta[0] && (
            <div className="popover-delta-box">
              <strong>CAMBIO CLAVE:</strong>
              <span>{node.delta[0].reason || node.delta[0].after}</span>
            </div>
          )}

          <div className="popover-actions">
            <button
              type="button"
              className="duo-btn duo-btn-primary popover-btn"
              onClick={() => {
                onCloseModal();
                onStartLesson(node);
              }}
            >
              <Play size={16} fill="#FFFFFF" />
              <span>
                {isCompleted
                  ? 'REPASAR LECCIÓN'
                  : node.nodeRole === 'exam'
                  ? 'INICIAR EXAMEN'
                  : node.nodeRole === 'speedrun'
                  ? 'INICIAR SPEEDRUN'
                  : 'EMPEZAR LECCIÓN'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* TOOLTIP DE BLOQUEO CON RAZÓN PEDAGÓGICA (FASE 8) */}
      {isLockTooltipOpen && (
        <div className="node-tooltip-popover popover-locked">
          <div className="locked-alert">
            <Lock size={22} color="#64748B" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Nodo Bloqueado</strong>
              <span>{lockTooltipNode.reason}</span>
            </div>
          </div>
          <button type="button" className="btn-close-locked" onClick={onCloseModal}>
            Entendido
          </button>
        </div>
      )}
    </div>
  );
}

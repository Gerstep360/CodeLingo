import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Check,
  Lock,
  Play,
  Sparkles,
  Trophy,
  BookOpen,
  Timer
} from 'lucide-react';
import { DUO_UNITS, getNodeLockStatus } from '../../data/duoLessonsData';

export function DuoClassPage({ completedNodeIds = [] }) {
  const { classId } = useParams();
  const navigate = useNavigate();

  const unit = DUO_UNITS.find(
    (u) => u.id === classId || u.classId === classId || u.unitIndex === Number(classId)
  );

  if (!unit) {
    return (
      <div className="duo-center-scrollable">
        <div className="class-page-container not-found">
          <div className="class-not-found-card">
            <h2>Clase no encontrada</h2>
            <p>La clase con identificador "{classId}" no forma parte del temario actual del Primer Parcial.</p>
            <button
              type="button"
              className="duo-btn duo-btn-primary"
              onClick={() => navigate('/path')}
            >
              <ArrowLeft size={18} />
              <span>Volver a la Ruta</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const baseNode = unit.nodes.find((n) => n.nodeRole === 'base');
  const unitCompleted = unit.nodes.filter((n) => completedNodeIds.includes(n.id));
  const progressPercent = Math.round((unitCompleted.length / unit.nodes.length) * 100) || 0;
  const isUnitFinished = unitCompleted.length === unit.nodes.length;

  // Find next uncompleted node for direct "Continuar" CTA
  const nextNode = unit.nodes.find((n) => !completedNodeIds.includes(n.id)) || baseNode;

  return (
    <div className="duo-center-scrollable">
      <div className="class-page-container">
        {/* Top Back Navigation Bar */}
        <nav className="class-nav-back">
          <button
            type="button"
            className="btn-back-link"
            onClick={() => navigate('/path')}
          >
            <ArrowLeft size={18} />
            <span>Volver a la Ruta del Primer Parcial</span>
          </button>
        </nav>

        {/* Class Banner Card */}
        <header
          className="class-hero-card"
          style={{ '--class-color': unit.color || 'var(--duo-green)' }}
        >
          <div className="class-hero-top">
            <span className="class-index-pill">
              CLASE {unit.unitIndex} DE 7 · PRIMER PARCIAL
            </span>
            {isUnitFinished && (
              <span className="class-mastered-pill">
                <Check size={14} strokeWidth={3} />
                <span>CLASE DOMINADA</span>
              </span>
            )}
          </div>

          <h1 className="class-hero-title">{unit.title}</h1>
          <p className="class-hero-concept">{unit.concept}</p>

          {/* Golden Rule Highlight Box */}
          {unit.goldenRule && (
            <div className="class-golden-box">
              <div className="golden-tag">
                <Sparkles size={16} color="var(--duo-yellow)" />
                <span>REGLA DE ORO DE VARGAS</span>
              </div>
              <p className="golden-text">{unit.goldenRule}</p>
            </div>
          )}

          {/* Progress row */}
          <div className="class-progress-wrapper">
            <div className="class-progress-meta">
              <span>PROGRESO DE LA CLASE</span>
              <strong>
                {unitCompleted.length} de {unit.nodes.length} Nodos ({progressPercent}%)
              </strong>
            </div>
            <div className="class-progress-track">
              <div
                className="class-progress-bar"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Main Action Button */}
          {nextNode && (
            <div className="class-hero-cta">
              <button
                type="button"
                className="duo-btn duo-btn-primary btn-launch-class"
                onClick={() => navigate(`/lesson/${nextNode.id}`)}
              >
                <Play size={18} fill="#FFFFFF" />
                <span>
                  {isUnitFinished
                    ? 'REPASAR CLASE'
                    : unitCompleted.length > 0
                    ? `CONTINUAR: ${nextNode.title}`
                    : `EMPEZAR: ${nextNode.title}`}
                </span>
              </button>
            </div>
          )}
        </header>

        {/* Section: Nodes breakdown */}
        <section className="class-nodes-section">
          <h2 className="section-title">
            <BookOpen size={20} color="var(--duo-blue)" style={{ verticalAlign: 'middle', marginRight: 8 }} />
            <span>Nodos de Aprendizaje de esta Clase</span>
          </h2>
          <p className="section-desc">
            Cada nodo entrena una competencia específica: desde memorizar la estructura canónica, dominar las podas de examen, hasta resolver bajo presión de tiempo.
          </p>

          <div className="class-nodes-grid">
            {unit.nodes.map((node) => {
              const isCompleted = completedNodeIds.includes(node.id);
              const lockStatus = getNodeLockStatus(node.id, completedNodeIds);
              const isLocked = lockStatus.isLocked;

              const roleNames = {
                base: 'ALGORITMO BASE CANÓNICO',
                variant: 'VARIANTE DE EXAMEN',
                speedrun: 'ENTRENAMIENTO SPEEDRUN',
                exam: 'EVALUACIÓN DE CLASE'
              };

              return (
                <div
                  key={node.id}
                  className={`class-node-card role-${node.nodeRole || 'variant'} ${isCompleted ? 'is-completed' : ''} ${isLocked ? 'is-locked' : ''}`}
                >
                  <div className="node-card-left">
                    <div className="node-badge-icon">
                      {isCompleted ? (
                        <Check size={24} strokeWidth={3} color="var(--duo-green)" />
                      ) : isLocked ? (
                        <Lock size={22} color="var(--duo-wolf)" />
                      ) : node.nodeRole === 'base' ? (
                        <Star size={24} fill="var(--duo-yellow)" color="var(--duo-yellow)" />
                      ) : node.nodeRole === 'exam' ? (
                        <Trophy size={24} color="var(--duo-yellow)" />
                      ) : node.nodeRole === 'speedrun' ? (
                        <Timer size={24} color="var(--duo-orange)" />
                      ) : (
                        <Sparkles size={22} color="var(--duo-blue)" />
                      )}
                    </div>
                    <div className="node-info">
                      <span className="node-role-tag">
                        {roleNames[node.nodeRole] || 'LECCIÓN'}
                      </span>
                      <h3 className="node-title">{node.title}</h3>
                      <p className="node-desc">
                        {node.theory?.concept || node.description || 'Práctica intensiva y memorización de examen.'}
                      </p>

                      {/* Show delta if present */}
                      {node.delta && node.delta[0] && (
                        <div className="node-delta-chip">
                          <strong>CAMBIO:</strong> {node.delta[0].reason || node.delta[0].after}
                        </div>
                      )}

                      {/* Lock reason */}
                      {isLocked && (
                        <div className="node-lock-alert">
                          <Lock size={14} />
                          <span>{lockStatus.reason}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="node-card-action">
                    <button
                      type="button"
                      className={`duo-btn ${isCompleted ? 'duo-btn-secondary' : isLocked ? 'duo-btn-secondary btn-disabled' : 'duo-btn-primary'} btn-node-go`}
                      disabled={isLocked}
                      onClick={() => navigate(`/lesson/${node.id}`)}
                    >
                      {isCompleted ? (
                        <>
                          <Check size={16} />
                          <span>Repasar</span>
                        </>
                      ) : isLocked ? (
                        <>
                          <Lock size={16} />
                          <span>Bloqueado</span>
                        </>
                      ) : (
                        <>
                          <Play size={16} fill="#FFFFFF" />
                          <span>Entrar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <style>{`
        .class-page-container {
          max-width: 780px;
          margin: 0 auto;
          padding: 24px 20px 80px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .class-nav-back {
          display: flex;
          align-items: center;
        }

        .btn-back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          transition: var(--transition-fast);
        }

        .btn-back-link:hover {
          color: var(--duo-blue);
          background: var(--bg-subtle);
        }

        /* Hero Card */
        .class-hero-card {
          background: var(--card-bg);
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-xl);
          padding: 28px 24px;
          box-shadow: 0 4px 0 var(--duo-swan);
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
        }

        .class-hero-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        .class-index-pill {
          font-size: 11px;
          font-weight: 900;
          color: var(--class-color);
          background: var(--bg-subtle);
          border: 1px solid var(--duo-swan);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          letter-spacing: 0.8px;
        }

        .class-mastered-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 900;
          color: var(--duo-green);
          background: var(--duo-green-soft);
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .class-hero-title {
          font-size: 26px;
          font-weight: 900;
          color: var(--duo-eel);
          margin: 0;
          line-height: 1.2;
        }

        .class-hero-concept {
          font-size: 14px;
          font-weight: 600;
          color: var(--duo-wolf);
          line-height: 1.45;
          margin: 0;
        }

        .class-golden-box {
          background: var(--bg-subtle);
          border-left: 4px solid var(--duo-yellow);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .golden-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 900;
          color: var(--duo-yellow);
          letter-spacing: 0.8px;
        }

        .golden-text {
          font-size: 13px;
          font-weight: 700;
          color: var(--duo-eel);
          margin: 0;
          line-height: 1.35;
        }

        .class-progress-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 4px;
        }

        .class-progress-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 800;
          color: var(--duo-wolf);
        }

        .class-progress-track {
          height: 12px;
          background: var(--duo-swan);
          border-radius: 999px;
          overflow: hidden;
        }

        .class-progress-bar {
          height: 100%;
          background: var(--duo-green);
          border-radius: 999px;
          transition: width 300ms ease;
        }

        .class-hero-cta {
          padding-top: 8px;
        }

        .btn-launch-class {
          min-height: 48px;
          width: 100%;
          font-size: 14px;
        }

        /* Nodes Section */
        .class-nodes-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 900;
          color: var(--duo-eel);
          margin: 0;
        }

        .section-desc {
          font-size: 13px;
          color: var(--duo-wolf);
          margin: 0;
          line-height: 1.4;
        }

        .class-nodes-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .class-node-card {
          background: var(--card-bg);
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-lg);
          padding: 18px 20px;
          box-shadow: 0 3px 0 var(--duo-swan);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          transition: var(--transition-fast);
        }

        .class-node-card:hover:not(.is-locked) {
          border-color: var(--card-border-hover);
          transform: translateY(-2px);
        }

        .class-node-card.is-completed {
          border-color: var(--duo-green);
        }

        .class-node-card.is-locked {
          opacity: 0.72;
          background: var(--bg-subtle);
        }

        .node-card-left {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          flex: 1;
        }

        .node-badge-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: var(--bg-subtle);
          border: 1px solid var(--duo-swan);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .node-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .node-role-tag {
          font-size: 10px;
          font-weight: 900;
          color: var(--duo-blue);
          letter-spacing: 0.6px;
        }

        .node-title {
          font-size: 16px;
          font-weight: 900;
          color: var(--duo-eel);
          margin: 0;
        }

        .node-desc {
          font-size: 12px;
          color: var(--duo-wolf);
          margin: 0;
          line-height: 1.35;
        }

        .node-delta-chip {
          display: inline-block;
          font-size: 11px;
          color: var(--duo-yellow);
          background: var(--duo-yellow-soft);
          padding: 2px 8px;
          border-radius: 6px;
          margin-top: 4px;
          width: fit-content;
        }

        .node-lock-alert {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          color: var(--duo-red-text);
          background: var(--duo-red-soft);
          padding: 2px 8px;
          border-radius: 6px;
          margin-top: 4px;
          width: fit-content;
        }

        .node-card-action {
          flex-shrink: 0;
        }

        .btn-node-go {
          min-width: 120px;
          min-height: 42px;
          font-size: 13px;
        }

        .btn-disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        @media (max-width: 640px) {
          .class-node-card {
            flex-direction: column;
            align-items: stretch;
          }
          .node-card-action .btn-node-go {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

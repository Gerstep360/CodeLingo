import React, { useState } from 'react';
import { Star, Check, Lock, Zap, Sparkles, Play, Award, ChevronRight } from 'lucide-react';
import { DUO_UNITS } from '../../data/duoLessonsData';
import { DuoTrophyIcon } from './DuoIcons';

export function DuoLearningPath({ completedNodeIds = [], activeNodeId = 'node-1-1', onStartLesson }) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Winding horizontal offsets for nodes in path (Left, Center, Right, Center, etc.)
  const offsets = [0, 45, 75, 30, -45, -75, -30];

  const handleNodeClick = (node, isLocked) => {
    if (isLocked) return;
    setSelectedNode(node);
  };

  return (
    <div className="duo-learning-path-wrap">
      {DUO_UNITS.map((unit, unitIdx) => {
        return (
          <section key={unit.id} className="duo-unit-section">
            {/* Unit Header Card */}
            <div className="duo-unit-banner" style={{ background: unit.color }}>
              <div className="unit-meta">
                <span className="unit-badge">UNIDAD {unitIdx + 1}</span>
                <h3 className="unit-title">{unit.title}</h3>
                <p className="unit-sub">{unit.subtitle}</p>
              </div>
              <div className="unit-banner-icon">
                <Sparkles size={28} color="rgba(255,255,255,0.85)" />
              </div>
            </div>

            {/* Path Nodes List */}
            <div className="duo-nodes-track">
              {unit.nodes.map((node, nodeIdx) => {
                const isCompleted = completedNodeIds.includes(node.id);
                const isActive = node.id === activeNodeId;
                const isLocked = !isCompleted && !isActive;
                const isExam = Boolean(node.isFinalExam || node.type === 'final_exam');
                const xOffset = offsets[nodeIdx % offsets.length];

                return (
                  <div
                    key={node.id}
                    className={`duo-node-slot ${isExam ? 'slot-exam' : ''}`}
                    style={{ transform: `translateX(${xOffset}px)` }}
                  >
                    {/* Node Interactive 3D Circle */}
                    <button
                      type="button"
                      className={`duo-path-node ${isActive ? 'active animate-pulse-glow' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''} ${isExam ? 'exam-node' : ''}`}
                      onClick={() => handleNodeClick(node, isLocked)}
                      title={node.title}
                    >
                      {/* Inner Icon */}
                      <span className="node-icon-holder">
                        {isCompleted ? (
                          <Check size={26} strokeWidth={3} color="#FFFFFF" />
                        ) : isLocked ? (
                          <Lock size={22} color="var(--duo-hare)" />
                        ) : isExam ? (
                          <DuoTrophyIcon size={28} />
                        ) : (
                          <Star size={26} fill="#FFFFFF" color="#FFFFFF" />
                        )}
                      </span>

                      {/* Floating Crown / Target ONLY on active uncompleted node */}
                      {isActive && (
                        <div className={`node-crown-badge animate-pop ${isExam ? 'crown-exam' : ''}`}>
                          <span>{isExam ? 'EXAMEN' : 'START'}</span>
                        </div>
                      )}
                    </button>

                    {/* Node Mini Title */}
                    <span className={`node-label-caption ${isExam ? 'label-exam' : ''}`}>{node.title}</span>

                    {/* Node Popover Modal Tooltip */}
                    {selectedNode?.id === node.id && (
                      <div className="node-tooltip-popover animate-pop">
                        <div className="popover-header">
                          <span className={`popover-badge ${isExam ? 'popover-exam-badge' : ''}`}>
                            {isExam ? `🏆 EXAMEN FINAL · +${node.xp} XP` : `+${node.xp} XP`}
                          </span>
                          <h4 className="popover-title">{node.title}</h4>
                          <p className="popover-desc">{node.shortDesc}</p>
                        </div>
                        <div className="popover-actions">
                          <button
                            type="button"
                            className="duo-btn duo-btn-primary popover-btn"
                            onClick={() => {
                              setSelectedNode(null);
                              onStartLesson(node);
                            }}
                          >
                            <Play size={16} fill="#FFFFFF" />
                            <span>{isCompleted ? 'PRACTICAR' : isExam ? 'INICIAR EXAMEN' : 'EMPEZAR LECCIÓN'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <style>{`
        .duo-learning-path-wrap {
          flex: 1;
          max-width: 640px;
          margin: 0 auto;
          padding: 30px 16px 120px;
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        .duo-unit-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
        }

        /* Unit Banner */
        .duo-unit-banner {
          width: 100%;
          border-radius: var(--radius-lg);
          padding: 20px 24px;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 0 rgba(0, 0, 0, 0.15);
        }

        .unit-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          background: rgba(0, 0, 0, 0.18);
          padding: 3px 8px;
          border-radius: 6px;
          margin-bottom: 6px;
        }

        .unit-title {
          font-size: 19px;
          font-weight: 900;
          line-height: 1.2;
        }

        .unit-sub {
          font-size: 13px;
          font-weight: 600;
          opacity: 0.92;
          margin-top: 4px;
        }

        /* Nodes Track */
        .duo-nodes-track {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 42px;
          position: relative;
          width: 100%;
        }

        .duo-node-slot {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 300ms ease;
        }

        /* Physical 3D Node Circle */
        .duo-path-node {
          width: 72px;
          height: 66px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: transform 90ms ease, box-shadow 90ms ease;
          user-select: none;
        }

        .duo-path-node:active:not(.locked) {
          transform: translateY(4px);
        }

        /* Active Green Node */
        .duo-path-node.active {
          background: var(--duo-green);
          box-shadow: 0 7px 0 var(--duo-green-shadow);
        }
        .duo-path-node.active:active {
          box-shadow: 0 2px 0 var(--duo-green-shadow);
        }

        /* Completed Golden/Yellow Node */
        .duo-path-node.completed {
          background: var(--duo-yellow);
          box-shadow: 0 7px 0 var(--duo-yellow-shadow);
        }
        .duo-path-node.completed:active {
          box-shadow: 0 2px 0 var(--duo-yellow-shadow);
        }

        /* Locked Gray Node */
        .duo-path-node.locked {
          background: var(--duo-swan);
          box-shadow: 0 7px 0 #CBCBCB;
          cursor: not-allowed;
        }

        .node-icon-holder {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Floating Start Badge */
        .node-crown-badge {
          position: absolute;
          top: -24px;
          background: #FFFFFF;
          color: var(--duo-green);
          border: 2px solid var(--duo-green);
          box-shadow: 0 3px 0 var(--duo-green);
          font-size: 10px;
          font-weight: 900;
          padding: 2px 8px;
          border-radius: 999px;
          letter-spacing: 0.5px;
        }

        .node-crown-badge.crown-exam {
          color: #B58500;
          border-color: #F59E0B;
          box-shadow: 0 3px 0 #D97706;
          background: #FEF3C7;
        }

        .duo-path-node.exam-node.active {
          background: #F59E0B;
          box-shadow: 0 7px 0 #D97706;
        }

        .node-label-caption {
          font-size: 13px;
          font-weight: 800;
          color: var(--duo-eel);
          margin-top: 8px;
          max-width: 140px;
          text-align: center;
          line-height: 1.2;
        }

        .node-label-caption.label-exam {
          color: #B45309;
          font-weight: 900;
        }

        /* Popover Tooltip */
        .node-tooltip-popover {
          position: absolute;
          top: 76px;
          background: #FFFFFF;
          border: 2px solid var(--duo-swan);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          border-radius: var(--radius-lg);
          padding: 18px 20px;
          width: 290px;
          z-index: 50;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .popover-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 900;
          color: var(--duo-yellow);
          background: var(--duo-yellow-soft);
          padding: 2px 8px;
          border-radius: 999px;
          border: 1px solid #FFE58F;
          margin-bottom: 4px;
        }

        .popover-title {
          font-size: 16px;
          font-weight: 900;
          color: var(--duo-eel);
          line-height: 1.2;
        }

        .popover-desc {
          font-size: 13px;
          font-weight: 600;
          color: var(--duo-wolf);
          margin-top: 4px;
          line-height: 1.35;
        }

        .popover-btn {
          width: 100%;
          min-height: 44px;
          font-size: 14px;
        }

        @media (max-width: 640px) {
          .duo-learning-path {
            padding: 16px 12px 100px;
            gap: 32px;
          }

          .duo-unit-banner {
            padding: 14px 16px;
          }

          .unit-title {
            font-size: 16px;
          }

          .unit-sub {
            font-size: 12px;
          }

          .node-tooltip-popover {
            width: 270px;
            max-width: calc(100vw - 32px);
            left: 50%;
            transform: translateX(-50%);
            padding: 14px 16px;
          }
        }
      `}</style>
    </div>
  );
}

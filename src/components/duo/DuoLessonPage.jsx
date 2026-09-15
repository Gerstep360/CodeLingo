import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getNodeById } from '../../data/duoLessonsData';
import { DuoLessonRunner } from './DuoLessonRunner';
import { duoStorage } from '../../utils/duoStorage';

export function DuoLessonPage({ onFinishLesson }) {
  const { nodeId } = useParams();
  const navigate = useNavigate();

  const node = getNodeById(nodeId);

  useEffect(() => {
    if (node) {
      duoStorage.saveActiveLesson({
        nodeId: node.id,
        classId: node.classId || '01-sumandos',
        nodeTitle: node.title,
        timestamp: Date.now()
      });
    }
  }, [node]);

  const handleClose = () => {
    if (node?.classId) {
      navigate(`/class/${node.classId}`);
    } else {
      navigate('/path');
    }
  };

  const handleFinish = (finishedNodeId, earnedXp) => {
    duoStorage.clearActiveLesson();
    if (onFinishLesson) {
      onFinishLesson(finishedNodeId, earnedXp);
    }
    if (node?.classId) {
      navigate(`/class/${node.classId}`);
    } else {
      navigate('/path');
    }
  };

  if (!node) {
    return (
      <div className="duo-center-scrollable">
        <div style={{ maxWidth: 540, margin: '60px auto', padding: 24, textAlign: 'center' }} className="duo-card">
          <h2>Lección no encontrada</h2>
          <p style={{ color: 'var(--duo-wolf)', margin: '12px 0 20px' }}>
            No se encontró ninguna lección con el identificador "{nodeId}".
          </p>
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
    );
  }

  return (
    <DuoLessonRunner
      node={node}
      onClose={handleClose}
      onFinishLesson={handleFinish}
    />
  );
}

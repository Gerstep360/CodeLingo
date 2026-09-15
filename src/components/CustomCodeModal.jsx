import React, { useState } from 'react';
import { X, Code2, Sparkles, Check, FileText } from 'lucide-react';

export function CustomCodeModal({ isOpen, onClose, onSaveCustomCode }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personalizado');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setErrorMsg('Por favor pega o escribe el código que deseas practicar.');
      return;
    }

    onSaveCustomCode({
      id: 'custom-' + Date.now(),
      title: title.trim() || 'Código Personalizado',
      category: category.trim() || 'Personalizado',
      description: description.trim() || 'Código cargado por el usuario para memoria muscular.',
      code: code.trim()
    });

    onClose();
  };

  const handleLoadSample = () => {
    setTitle('React: Componente Contador con Reducer');
    setCategory('React Hooks');
    setDescription('Gestión de estado complejo con useReducer y dispatch actions.');
    setCode(`import { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return initialState;
    default:
      throw new Error();
  }
}

export function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Total: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}`);
    setErrorMsg('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card animate-pop" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <Code2 size={18} color="var(--pastel-lavender)" />
            </div>
            <div>
              <h2 className="modal-title">Cargar Mi Propio Código</h2>
              <p className="modal-subtitle">Pega cualquier código para entrenar memoria muscular o dar tu examen.</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Título del Ejercicio</label>
              <input
                type="text"
                placeholder="Ej. Algoritmo QuickSort o Componente Dropdown"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Categoría / Materia</label>
              <input
                type="text"
                placeholder="Ej. React, Algoritmos, Examen Final"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción / Objetivo (Opcional)</label>
            <input
              type="text"
              placeholder="Instrucción de lo que debes recordar o construir"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <div className="code-label-row">
              <label className="form-label">Código Fuente de Referencia *</label>
              <button
                type="button"
                onClick={handleLoadSample}
                className="btn-sample-code"
              >
                <Sparkles size={13} />
                <span>Cargar ejemplo</span>
              </button>
            </div>
            <textarea
              rows={10}
              placeholder={`// Pega aquí tu código...\nfunction miExamen() {\n  // Tu código para memorizar\n}`}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              className="form-textarea"
              spellCheck={false}
            />
            {errorMsg && <p className="form-error-text">{errorMsg}</p>}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              <Check size={16} />
              <span>Cargar al Simulador</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(43, 47, 56, 0.4);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
        }

        .modal-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          width: 100%;
          max-width: 620px;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          background: var(--bg-main);
          border-bottom: 1px solid var(--card-border);
        }

        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-icon-badge {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--pastel-lavender-bg);
          border: 1px solid var(--pastel-lavender-border);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .modal-subtitle {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          transition: var(--transition-fast);
        }

        .modal-close-btn:hover {
          background: var(--bg-subtle);
          color: var(--text-primary);
        }

        .modal-form {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .code-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .form-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .btn-sample-code {
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          color: var(--pastel-lavender);
          cursor: pointer;
        }

        .btn-sample-code:hover {
          text-decoration: underline;
        }

        .form-input {
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--card-border);
          background: var(--bg-main);
          font-size: 13px;
          color: var(--text-primary);
          outline: none;
          transition: var(--transition-fast);
        }

        .form-input:focus {
          border-color: var(--pastel-lavender);
          background: var(--card-bg);
        }

        .form-textarea {
          padding: 12px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--card-border);
          background: var(--bg-main);
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 20px;
          color: var(--text-primary);
          outline: none;
          resize: vertical;
          transition: var(--transition-fast);
        }

        .form-textarea:focus {
          border-color: var(--pastel-lavender);
          background: var(--card-bg);
        }

        .form-error-text {
          font-size: 12px;
          color: var(--pastel-peach);
          font-weight: 500;
        }

        .modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 8px;
        }

        .btn-cancel {
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-cancel:hover {
          background: var(--bg-main);
        }

        .btn-submit {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--pastel-lavender-border);
          background: var(--pastel-lavender);
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-submit:hover {
          background: #5a4bcf;
        }
      `}</style>
    </div>
  );
}

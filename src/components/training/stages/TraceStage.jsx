import { useState } from 'react';

export default function TraceStage({ lessonData, onComplete }) {
  const [index, setIndex] = useState(0);
  const steps = lessonData.trace?.steps || [];
  if (!steps.length) return <p role="alert">Esta lección todavía necesita una traza para continuar.</p>;
  const step = steps[index];
  const lists = typeof step === 'string' ? [...step.matchAll(/\[([0-9, ]+)\]/g)].map(match=>match[1].split(',')) : [];
  return <>
    <h2>Sigue una ejecución</h2>
    <pre><code>{JSON.stringify(lessonData.trace.input || lessonData.trace.matrix)}</code></pre>
    <p className="trace-caption">Paso {index + 1} de {steps.length}</p><div aria-label="Estado de la lista">{lists.map((items,j)=><div className="trace-state" key={j}>{items.map((item,k)=><span className="trace-cell" key={k}>{item.trim()}</span>)}</div>)}</div>
    <pre aria-live="polite"><code>{typeof step === 'string' ? step : JSON.stringify(step, null, 2)}</code></pre>
    <div className="training-actions">
      <button className="duo-btn" disabled={!index} onClick={() => setIndex(index - 1)}>Anterior</button>
      <button className="duo-btn duo-btn-primary" onClick={() => index + 1 < steps.length ? setIndex(index + 1) : onComplete({ correct: true })}>{index + 1 < steps.length ? 'Siguiente paso' : 'Continuar'}</button>
    </div>
  </>;
}

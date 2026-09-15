import { useState } from 'react';
export default function OrderBlocksStage({ lessonData, onComplete }) {
  const blocks = (lessonData.code?.core || lessonData.code?.target || '').split('\n').filter(line => line.trim());
  const [selected, setSelected] = useState([]);
  const [wrong, setWrong] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  if (!blocks.length) return <p role="alert">Faltan bloques de código.</p>;
  function check() {
    const correct = selected.every((id, index) => blocks[id] === blocks[index]);
    if (correct) onComplete({ correct: true, mistakes });
    else { setWrong(true); setMistakes(mistakes + 1); }
  }
  return <><h2>Ordena el código</h2><p>Selecciona las líneas en el orden correcto. Puedes deshacer la última.</p>
    <pre><code>{selected.map(id => blocks[id]).join('\n') || 'Tu código aparecerá aquí'}</code></pre>
    <div className="training-blocks">{blocks.map((_, i) => blocks.length - i - 1).map(id => <button key={id} disabled={selected.includes(id)} onClick={() => { setSelected([...selected, id]); setWrong(false); }}><code>{blocks[id]}</code></button>)}</div>
    <p role="status">{wrong ? ' Revisa el orden de los bloques.' : ''}</p>
    <div className="training-actions"><button className="duo-btn" disabled={!selected.length} onClick={() => { setSelected(selected.slice(0, -1)); setWrong(false); }}>Deshacer</button><button className="duo-btn duo-btn-primary" disabled={selected.length !== blocks.length} onClick={check}>Comprobar</button></div>
  </>;
}

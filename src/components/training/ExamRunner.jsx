import { useEffect, useRef, useState } from 'react';
import { X, Timer, Trophy, CheckCircle2, CircleAlert, RotateCcw } from 'lucide-react';
import { shuffle, examSummary } from '../../learning/exam';
import { evaluateCode } from '../../learning/semanticEvaluator';
import { saveAttempt } from '../../learning/progress';
import { useTrainingTyping } from '../../hooks/useTrainingTyping';
import CodeInput from './CodeInput';
import './training.css';
export default function ExamRunner({lessons,title='Vargas Mode',duration=2700,onClose,onComplete,onTrainErrors}) {
  const [queue]=useState(()=>shuffle(lessons.filter(a=>a.code?.target)));
  const [results,setResults]=useState([]);
  const [finished,setFinished]=useState(false);
  const [deadline]=useState(()=>Date.now()+duration*1000);
  const [remaining,setRemaining]=useState(duration);
  const delivered=useRef(false);
  const panel=useRef(null);
  const activeResult=useRef(null);
  const current=queue[results.length];
  useEffect(()=>{
    const previous=document.activeElement,overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';panel.current?.focus();
    return()=>{document.body.style.overflow=overflow;previous?.focus?.();};
  },[]);
  useEffect(()=>{
    if(finished||!queue.length)return;
    const tick=()=>{
      const left=Math.max(0,Math.ceil((deadline-Date.now())/1000));setRemaining(left);
      if(!left){
        const pending=queue.slice(results.length).map((lesson,i)=>{
          const evaluation=i===0&&activeResult.current?activeResult.current():{...evaluateCode('',lesson),accuracy:0,elapsedSeconds:0};
          return {...evaluation,lessonId:lesson.id,title:lesson.title,classId:lesson.classId,mode:'exam',hintsUsed:0};
        });
        for(const result of pending)saveAttempt(result.lessonId,result);
        setResults([...results,...pending]);setFinished(true);
      }
    };
    const timer=setInterval(tick,250);return()=>clearInterval(timer);
  },[deadline,finished,queue,results]);
  function accept(result) {
    if(finished)return;
    const item={...result,lessonId:current.id,title:current.title,classId:current.classId,mode:'exam',hintsUsed:0};
    saveAttempt(current.id,item);setResults([...results,item]);activeResult.current=null;
    if(results.length+1===queue.length)setFinished(true);
  }
  const summary=examSummary(results);
  function closeResults() {
    if(delivered.current)return;delivered.current=true;
    onComplete?.({...summary,results});onClose();
  }
  return <div className="training-overlay"><div className="training-panel" ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} onKeyDown={event=>{
    if(event.key==='Escape'&&!/TEXTAREA/.test(event.target.tagName)){event.preventDefault();onClose();}
    if(event.key==='Tab'&&!event.defaultPrevented){
      const items=[...panel.current.querySelectorAll('button:not(:disabled),textarea')],first=items[0],last=items.at(-1);
      if(event.shiftKey&&(document.activeElement===first||document.activeElement===panel.current)){event.preventDefault();last?.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
    }
  }}>
    <header className="training-header"><button className="btn-exit-lesson" aria-label="Salir del examen" onClick={onClose}><X/></button><progress aria-label="Progreso del examen" value={results.length} max={queue.length||1}/><span className="training-timer"><Timer size={18}/>{Math.floor(remaining/60)}:{String(remaining%60).padStart(2,'0')}</span></header>
    <main className="training-main"><span className="training-eyebrow">{title} · Sin pistas</span>
      {!queue.length?<p>No hay algoritmos disponibles para este examen.</p>:finished?<><h2><Trophy className="icon-inline"/>Resultado del examen</h2>
        <div className="learning-grid"><div className="learning-card"><h3>Lógica</h3>{Math.round(summary.logic*100)}%</div><div className="learning-card"><h3>Precisión</h3>{Math.round(summary.accuracy*100)}%</div><div className="learning-card"><h3>Recall</h3>{summary.correct}/{summary.total}</div><div className="learning-card"><h3>Errores críticos</h3>{summary.criticalMistakes}</div></div>
        <p>Tiempo total: {duration-remaining} s. Más lento: {summary.slowest?.title}. Refuerza: {summary.weakest?.title}.</p>
        <table className="exam-results"><thead><tr><th>Algoritmo</th><th>Resultado</th><th>Tiempo</th></tr></thead><tbody>{results.map(r=><tr key={r.lessonId}><td>{r.title}</td><td>{r.correct?<CheckCircle2 size={18} aria-label="Correcto"/>:<CircleAlert size={18} aria-label="Necesita repaso"/>}</td><td>{r.elapsedSeconds.toFixed(1)} s</td></tr>)}</tbody></table>
        {Object.entries(summary.classes).map(([name,r])=><p key={name}>{name}: {r.correct}/{r.total} correctos</p>)}
        {results.filter(r=>!r.correct).map(r=><section key={r.lessonId}><h3>{r.title}</h3>{r.errors?.map(e=><p key={e.id}>{e.message}</p>)}</section>)}
        <div className="training-actions"><button className="duo-btn duo-btn-primary" onClick={closeResults}>Volver</button>{!summary.passed&&onTrainErrors&&<button className="duo-btn training-secondary" onClick={()=>{if(!delivered.current){delivered.current=true;onComplete?.({...summary,results});}onTrainErrors(queue.filter(a=>results.some(r=>r.lessonId===a.id&&!r.correct)) );}}><RotateCcw size={18}/>Entrenar mis errores</button>}</div>
      </>:<ExamQuestion key={current.id} lesson={current} activeResult={activeResult} onSubmit={accept}/>}
    </main>
  </div></div>;
}
function ExamQuestion({lesson,activeResult,onSubmit}) {
  const engine=useTrainingTyping(lesson.code.target, { lessonId: 'exam_' + lesson.id, stageId: 'exam' });
  const submitted=useRef(false);
  const snapshot=()=>({...evaluateCode(engine.value,lesson),...engine.metrics()});
  useEffect(()=>{activeResult.current=snapshot;return()=>{activeResult.current=null;};});
  function submit(){
    if(submitted.current)return;
    submitted.current=true;
    engine.clearDraft();
    onSubmit(snapshot());
  }
  return <><h2>{lesson.title}</h2><p>Escribe el algoritmo completo. Recibirás la evaluación al terminar el examen.</p>
    <div onPaste={event=>event.preventDefault()}><CodeInput value={engine.value} onChange={engine.change} onSubmit={submit}/></div>
    <div className="training-actions"><button className="duo-btn training-secondary" onClick={submit}>Omitir / entregar</button><button className="duo-btn duo-btn-primary" disabled={!engine.value.trim()} onClick={submit}>Entregar respuesta</button></div>
  </>;
}


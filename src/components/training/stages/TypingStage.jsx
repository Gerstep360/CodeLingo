import { useEffect, useState } from 'react';
import { CheckCircle2, CircleAlert, Lightbulb, RotateCcw, Timer, ArrowRight } from 'lucide-react';
import CodeInput from '../CodeInput';
import CodeReference from '../CodeReference';
import { useTrainingTyping } from '../../../hooks/useTrainingTyping';
import { evaluateCode, maskCode } from '../../../learning/semanticEvaluator';
import { supportLevel } from '../../../learning/progress';

export default function TypingStage({lessonData,onComplete,onAttempt,mode='guided',stageId,masteryData={},exam=false}) {
  const target=lessonData.code?.target||'';
  const engine=useTrainingTyping(target, { lessonId: lessonData.id, stageId: stageId || mode });
  const [result,setResult]=useState(null),[hints,setHints]=useState(0),[elapsed,setElapsed]=useState(0);
  const hidden=exam||['recall','speedrun'].includes(mode);
  const anchors=lessonData.logic?.anchors || (lessonData.criticalFragments||[]).map(f=>({id:f.anchor||f.id,label:f.concept||f.id,code:f.expected}));
  const level=supportLevel(masteryData);

  useEffect(()=>{
    if(mode!=='speedrun'||result)return;
    const timer=setInterval(()=>setElapsed(engine.metrics().elapsedSeconds),250);
    return ()=>clearInterval(timer);
  },[mode,result,engine]);

  if(!target.trim())return <p role="alert">Falta el código de esta lección.</p>;

  function check() {
    if(!engine.value.trim())return;
    if(result?.correct){
      engine.clearDraft();
      onComplete(result);
      return;
    }
    const evaluation=evaluateCode(engine.value,lessonData);
    const measured=engine.metrics();
    const next={...evaluation,...measured,mode:exam?'exam':mode,hintsUsed:hints,targetSeconds:lessonData.speedrun?.targetSeconds||90};
    if(engine.tracking.current.pasted)next.accuracy=0;
    setResult(next);onAttempt?.(next);
    if(exam){
      if(next.correct) engine.clearDraft();
      onComplete(next);
    }
  }

  function retry(){engine.reset();setHints(0);setResult(null);setElapsed(0);}
  const showFull=!hidden&&stageId==='guided-copy';
  const reference=showFull?target:mode==='ghost'?maskCode(lessonData,stageId==='ghost-60'?.6:.3):null;

  return <section className="typing-stage">
    <div className="training-stage-heading"><div><span className="training-eyebrow">{exam?'Evaluación':mode==='speedrun'?'Contra el reloj':hidden?'Memoria activa':'Construye el algoritmo'}</span>
      <h2>{lessonData.title}</h2><p>{hidden?'Escribe el algoritmo completo.':'Reconstruye la función usando sus bloques.'}</p></div>
      {mode==='speedrun'&&<span className="training-timer"><Timer size={18}/>{elapsed.toFixed(1)} s</span>}
    </div>
    {!hidden&&<div className="training-anchors">{anchors.map(a=><span key={a.id}>{a.label}</span>)}</div>}
    {reference&&<CodeReference code={reference} anchors={anchors}/>}
    {!hidden&&!reference&&level===1&&<p className="training-rule">{lessonData.logic?.goldenRule}</p>}
    <div onPaste={event=>{if(hidden){event.preventDefault();}else{engine.tracking.current.pasted=true;}}}>
      <CodeInput value={engine.value} onChange={(value,meta)=>{engine.change(value,meta);setResult(null);}} readOnly={Boolean(result?.correct)} onSubmit={check} errorLine={result?.errorLine}/>
    </div>
    {result&&!exam&&<div className={'training-feedback '+(result.correct?'is-correct':'is-error')} role="status">
      {result.correct?<CheckCircle2 size={22}/>:<CircleAlert size={22}/>}<div><strong>{result.correct?'Código correcto':'Revisa estos puntos'}</strong>
        {result.errors.map(error=><p key={error.id} className={error.line?'feedback-line-error':''}>{error.line?<strong>Línea {error.line}: </strong>:null}{error.message}</p>)}
        {!result.correct&&!result.errors.length&&<p>Revisa el resto de líneas, nombres y operadores. El formato no afecta la comparación.</p>}
        {result.correct&&<p>Tiempo: {result.elapsedSeconds.toFixed(1)} s{hints>0?' · Pistas: '+hints:''}{result.cpm>0?' · CPM: '+result.cpm:''}</p>}
      </div></div>}

    {!exam&&hints>0&&<aside className="training-hint" aria-live="polite">
      {hints===1?<p>{lessonData.logic?.mentalModel||lessonData.logic?.goldenRule}</p>:hints===2?<ul>{anchors.map(a=><li key={a.id}>{a.label}</li>)}</ul>:hints===3?<CodeReference code={lessonData.criticalFragments?.[0]?.expected||lessonData.code.signature||''}/>:<CodeReference code={target} anchors={anchors}/>}
    </aside>}
    <div className="training-actions">
      {!exam&&mode!=='speedrun'&&<button type="button" className="duo-btn training-secondary" disabled={hints>=4||Boolean(result?.correct)} onClick={()=>setHints(hints+1)}><Lightbulb size={18}/> Pista {hints}/4</button>}
      {!exam&&<button type="button" className="duo-btn training-secondary" onClick={retry}><RotateCcw size={18}/> Reintentar</button>}
      <button type="button" className="duo-btn duo-btn-primary" disabled={!engine.value.trim()} onClick={check}>{result?.correct?'Continuar':exam?'Entregar respuesta':'Comprobar'}<ArrowRight size={18}/></button>
    </div>
  </section>;
}



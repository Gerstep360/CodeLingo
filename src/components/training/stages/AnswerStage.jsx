import { useEffect, useState } from 'react';
import { CheckCircle2, CircleAlert, ArrowRight } from 'lucide-react';
import { isAnswerCorrect } from '../../../learning/answerEvaluator';
import CodeReference from '../CodeReference';
export default function AnswerStage({drills,onComplete,onAttempt}) {
  const [index,setIndex]=useState(0),[answer,setAnswer]=useState(''),[feedback,setFeedback]=useState(null),[mistakes,setMistakes]=useState(0);
  const drill=drills[index];
  useEffect(()=>{
    const handler=event=>{
      if(!drill?.options||event.ctrlKey||event.altKey||event.metaKey||/INPUT|TEXTAREA/.test(event.target.tagName))return;
      const option=drill.options[Number(event.key)-1];
      if(option&&feedback!==true){event.preventDefault();setAnswer(typeof option==='string'?option:option.text);}
    };
    window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler);
  },[drill,feedback]);
  if(!drill?.answer)return <p role="alert">Falta contenido de práctica para esta etapa.</p>;
  function submit(event) {
    event.preventDefault();
    if(feedback===true){
      if(index+1===drills.length)onComplete({correct:true,mistakes,logicScore:1/(1+mistakes)});
      else{setIndex(index+1);setAnswer('');setFeedback(null);}
      return;
    }
    const correct=isAnswerCorrect(answer,drill);setFeedback(correct);
    if(!correct)setMistakes(mistakes+1);
    onAttempt?.({correct,logicScore:Number(correct),anchors:drill.anchor?{[drill.anchor]:Number(correct)}:{},mistakes:Number(!correct)});
  }
  return <form onSubmit={submit} className="answer-stage">
    <span className="training-eyebrow">Una idea · {index+1}/{drills.length}</span><h2>{drill.prompt}</h2>
    {drill.context&&<CodeReference code={drill.context} label="Completa el fragmento oculto"/>}
    {drill.options?<div className="recognition-options" role="group" aria-label="Opciones de respuesta">{drill.options.map((item,i)=>{
      const text=typeof item==='string'?item:item.text;
      return <button type="button" key={text} className={answer===text?'selected':''} aria-pressed={answer===text} disabled={feedback===true} onClick={()=>{setAnswer(text);setFeedback(null);}}><kbd>{i+1}</kbd><span>{text}</span></button>;
    })}</div>:<><label htmlFor="training-answer">{drill.answerType==='code'?'Escribe el código que falta':'Tu respuesta'}</label><input id="training-answer" autoComplete="off" spellCheck={false} value={answer} readOnly={feedback===true} onChange={event=>{setAnswer(event.target.value);setFeedback(null);}}/></>}
    {feedback!==null&&<div className={'training-feedback '+(feedback?'is-correct':'is-error')} role="status">
      {feedback?<CheckCircle2 size={22}/>:<CircleAlert size={22}/>}<div><strong>{feedback?'Correcto':'Todavía no'}</strong><p>{drill.reason||'Revisa el fragmento en su contexto.'}</p>
      {!feedback&&<p>Respuesta esperada: <code>{drill.answer}</code>. Puedes corregirla e intentarlo de nuevo.</p>}</div>
    </div>}
    <button className="duo-btn duo-btn-primary" disabled={!answer.trim()}>{feedback===true?'Continuar':'Comprobar'}<ArrowRight size={18}/></button>
  </form>;
}


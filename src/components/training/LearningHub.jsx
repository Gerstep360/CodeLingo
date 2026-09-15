import { useEffect, useState, useRef } from 'react';
import { BookOpen, Shuffle, Timer, Target, Trophy, ArrowLeftRight, RotateCcw, Brain } from 'lucide-react';
import { getAllAlgorithms,getClassById } from '../../content/contentLoader';
import { readProgress,reviewQueue,canSpeedrun } from '../../learning/progress';
import { shuffle } from '../../learning/exam';
import { TrainingRunner } from './TrainingRunner';
import ExamRunner from './ExamRunner';
import './training.css';
export default function LearningHub({completedNodes=[],onEarnXp}) {
  const [records,setRecords]=useState(readProgress),[session,setSession]=useState(null),[queue,setQueue]=useState([]);
  const finishedTraining=useRef(false);
  const all=getAllAlgorithms(),algorithms=all.filter(a=>a.code?.target);
  const learned=algorithms.filter(a=>records[a.id]?.attempts||completedNodes.includes('node-'+a.id)||completedNodes.includes('node-'+a.classId+'-base'));
  useEffect(()=>{const update=()=>setRecords(readProgress());window.addEventListener('learning-progress',update);return()=>window.removeEventListener('learning-progress',update);},[]);
  const due=reviewQueue(algorithms,records),cram=reviewQueue(algorithms,records,{cram:true});
  function train(items,sequence=['recall']) {
    if(!items.length)return;setQueue(items.slice(1));setSession({type:'training',lesson:{...items[0],trainingSequence:sequence},sequence});
  }
  function next(){
    if(queue.length){setSession({...session,lesson:{...queue[0],trainingSequence:session.sequence}});setQueue(queue.slice(1));}
    else setSession(null);
  }
  function weak(lesson) {
    const record=records[lesson.id];
    const fragments=(lesson.criticalFragments||[]).filter(f=>(record?.anchors?.[f.anchor||f.id]??1)<.9);
    train([{...lesson,criticalFragments:fragments.length?fragments:lesson.criticalFragments}],['fill-line']);
  }
  const cards=[
    {title:'Repaso pendiente',text:due.length+' algoritmos listos para repasar',icon:RotateCcw,action:()=>train(due),disabled:!due.length},
    {title:'Cram mode',text:'Puntos débiles, próximos repasos y errores recientes',icon:Target,action:()=>train(shuffle(cram)),disabled:!cram.length},
    {title:'Vargas Roulette',text:'Mezcla de clases que ya aprendiste',icon:Shuffle,action:()=>train(shuffle(learned)),disabled:!learned.length},
    {title:'Contraste',text:'Practica las diferencias entre variantes',icon:ArrowLeftRight,action:()=>train([...learned].sort((a,b)=>(records[a.id]?.mastery||0)-(records[b.id]?.mastery||0)),['recognize']),disabled:!learned.length},
    {title:'Vargas Mode',text:'45 minutos · un algoritmo de cada clase · sin pistas',icon:Timer,action:()=>setSession({type:'exam',lessons:[...new Set(algorithms.map(a=>a.classId))].map(id=>shuffle(algorithms.filter(a=>a.classId===id))[0])}),disabled:false}
  ];
  return <div className="learning-hub"><span className="training-eyebrow">Tu entrenamiento</span><h1>Practicar y dominar</h1><p>Primero lógica y precisión. Después velocidad.</p>
    <div className="learning-grid">{cards.map(card=><section className="learning-card" key={card.title}><h3><card.icon size={22}/>{card.title}</h3><p>{card.text}</p><button className="duo-btn duo-btn-primary" disabled={card.disabled} onClick={card.action}>Comenzar</button></section>)}</div>
    <h2><Brain className="icon-inline"/>Dominio por algoritmo</h2>
    {!learned.length&&<div className="learning-empty"><BookOpen size={28}/><p>Completa una clase para ver tus puntos fuertes y los fragmentos que conviene practicar.</p></div>}
    {learned.map(lesson=>{const record=records[lesson.id]||{};return <section className="learning-card" key={lesson.id}>
      <h3>{record.status==='MASTERED'&&<Trophy size={20}/>} {lesson.title}</h3><p>{Math.round((record.mastery||0)*100)}% de dominio · {record.successfulRecalls||0} recalls sin pistas</p>
      <progress aria-label={'Dominio de '+lesson.title} value={record.mastery||0} max={1}/>
      <p>Próximo repaso: {record.nextReview?new Date(record.nextReview).toLocaleString():'Empieza un recall'}</p>
      {Object.entries(record.anchors||{}).map(([anchor,score])=><div className="mastery-row" key={anchor}><span>{lesson.criticalFragments?.find(f=>(f.anchor||f.id)===anchor)?.concept||anchor}</span><strong>{Math.round(score*100)}%</strong><progress aria-label={anchor} value={score} max={1}/></div>)}
      <div className="training-actions"><button className="duo-btn training-secondary" onClick={()=>weak(lesson)}><Target size={18}/>Entrenar punto débil</button><button className="duo-btn training-secondary" onClick={()=>train([lesson])}>Recall</button><button className="duo-btn training-secondary" disabled={!canSpeedrun(record)} onClick={()=>train([lesson],['speedrun'])}><Timer size={18}/>Speedrun</button></div>
    </section>;})}
    {session?.type==='training'&&<TrainingRunner key={session.lesson.id+session.sequence.join()} lessonData={session.lesson} classData={getClassById(session.lesson.classId)} onClose={()=>{if(finishedTraining.current){finishedTraining.current=false;next();}else setSession(null);}} onComplete={result=>{finishedTraining.current=true;onEarnXp?.(result.earnedXp);}}/>}
    {session?.type==='exam'&&<ExamRunner lessons={session.lessons} onClose={()=>setSession(null)} onComplete={summary=>onEarnXp?.(summary.passed?50:0)} onTrainErrors={items=>train(items)}/>}
  </div>;
}


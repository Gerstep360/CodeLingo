import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Check, Lock, Play, Sparkles, Star, Timer, Trophy } from 'lucide-react';
import { DUO_UNITS, getNodeLockStatus } from '../../data/duoLessonsData';
import HelperLessons from './HelperLessons';
import './class-page.css';

export function DuoClassPage({completedNodeIds=[]}) {
  const {classId}=useParams();
  const navigate=useNavigate();
  const unit=DUO_UNITS.find(u=>u.id===classId||u.classId===classId||u.unitIndex===Number(classId));
  if(!unit)return <main className="class-overview"><h1>Clase no encontrada</h1><button className="duo-btn duo-btn-primary" onClick={()=>navigate('/path')}>Volver a la ruta</button></main>;
  const count=unit.nodes.filter(n=>completedNodeIds.includes(n.id)).length;
  const next=unit.nodes.find(n=>!completedNodeIds.includes(n.id)&&!getNodeLockStatus(n.id,completedNodeIds).isLocked)
    ||unit.nodes.find(n=>!getNodeLockStatus(n.id,completedNodeIds).isLocked);
  const base=unit.nodes.find(n=>n.nodeRole==='base');
  const groups=[
    {id:'base',title:'Entiende la base',description:'Aprende la idea y construye el algoritmo.'},
    {id:'variant',title:'Cambia una idea',description:'Compara cada variante con lo que ya sabes.'},
    {id:'challenge',title:'Ponlo a prueba',description:'Recuerda sin mirar y practica bajo tiempo.'}
  ];
  return <div className="duo-center-scrollable"><main className="class-overview">
    <button className="class-back" onClick={()=>navigate('/path')}><ArrowLeft size={18}/>Volver a aprender</button>
    <header className="class-overview-hero" style={{'--class-accent':unit.color}}>
      <div className="class-overview-kicker"><BookOpen size={16}/>Tema {unit.unitIndex} · Primer parcial</div>
      <h1>{unit.title.replace(/^TEMA\s+\d+\s*[·.]\s*/i,'').toLocaleLowerCase('es')}</h1>
      <p>{base?.shortDesc||unit.subtitle}</p>
      <div className="class-overview-progress"><progress value={count} max={unit.nodes.length} aria-label="Progreso de la clase"/><span>{count}/{unit.nodes.length}</span></div>
      {next?<button className="duo-btn duo-btn-primary" onClick={()=>navigate('/lesson/'+next.id)}><Play size={18}/>{count?'Continuar aprendiendo':'Empezar a aprender'}</button>:<p className="class-access-note"><Lock size={16}/>Completa la clase anterior para continuar.</p>}
      {next&&<span className="class-next-label">Siguiente: {next.title}</span>}
    </header>
    <HelperLessons helpers={unit.sharedHelpers} nodes={unit.nodes} completedNodeIds={completedNodeIds} onStart={node=>navigate('/lesson/'+node.id)}/>
    {groups.map(group=>{
      const nodes=unit.nodes.filter(n=>group.id==='challenge'?['speedrun','exam'].includes(n.nodeRole):n.nodeRole===group.id);
      if(!nodes.length)return null;
      return <section className="class-lesson-section" key={group.id}><h2>{group.title}</h2><p>{group.description}</p><div className="class-lesson-list">{nodes.map(node=>{
        const done=completedNodeIds.includes(node.id),lock=getNodeLockStatus(node.id,completedNodeIds);
        const Icon=done?Check:lock.isLocked?Lock:node.nodeRole==='base'?Star:node.nodeRole==='speedrun'?Timer:node.nodeRole==='exam'?Trophy:Sparkles;
        return <article className={'class-lesson-row '+(done?'is-done':'')+(lock.isLocked?' is-locked':'')} key={node.id}><span className="class-lesson-icon"><Icon size={23}/></span><div><h3>{node.title.trim()}</h3><p>{lock.isLocked?lock.reason:node.shortDesc}</p></div><button className="class-lesson-open" disabled={lock.isLocked} onClick={()=>navigate('/lesson/'+node.id)} aria-label={(done?'Repasar ':'Abrir ')+node.title}>{lock.isLocked?<Lock size={18}/>:<ArrowRight size={19}/>}</button></article>;
      })}</div></section>;
    })}
  </main></div>;
}


import { ArrowRight, Check, Code2, Grid2X2, Layers, Plus, Wrench } from 'lucide-react';
import { getNodeLockStatus } from '../../data/duoLessonsData';
import CodeReference from '../training/CodeReference';
import './helper-lessons.css';

function helperIcon(helper) {
  if(/matriz|menor/i.test(helper.title))return Grid2X2;
  if(/suma|prod|peso/i.test(helper.title))return Plus;
  if(/objeto/i.test(helper.title))return Layers;
  return Code2;
}
export default function HelperLessons({helpers=[],nodes=[],completedNodeIds=[],onStart,compact=false}) {
  if(!helpers.length)return null;
  return <section className={'helper-lessons '+(compact?'is-compact':'')} aria-label="Funciones que vas a necesitar">
    <header className="helper-section-heading"><span className="helper-section-icon"><Wrench size={20}/></span><div><span className="helper-eyebrow">Antes del algoritmo</span><h2>Pequeñas funciones, grandes pasos</h2><p>Entiende qué devuelve cada auxiliar y pruébalo con un ejemplo.</p></div></header>
    <div className="helper-lesson-list">{helpers.map(helper=>{
      const node=nodes.find(n=>n.rawAlgorithmId===helper.id);
      if(!node)return null;
      const done=completedNodeIds.includes(node.id);
      const locked=getNodeLockStatus(node.id,completedNodeIds);
      const Icon=helperIcon(helper);
      const name=helper.code?.target?.match(/static\s+(?:int|boolean|Matriz)\s+(\w+)\s*\(/)?.[1];
      return <article className={'helper-lesson '+(done?'is-done':'')} key={helper.id}>
        <button type="button" className="helper-lesson-action" onClick={()=>onStart(node)} disabled={locked.isLocked} aria-label={(done?'Repasar ':'Aprender ')+helper.title}>
          <span className="helper-lesson-symbol">{done?<Check size={25} strokeWidth={3}/>:<Icon size={25} strokeWidth={2.5}/>}</span>
          <span className="helper-lesson-copy"><span className="helper-lesson-name">{name?name+'()':helper.title.replace('Clase ','')}</span><span className="helper-lesson-purpose">{helper.purpose}</span>
            <span className="helper-lesson-meta">{locked.isLocked?locked.reason:done?'Completado · repasar':'Ver · entender · escribir'}</span></span>
          <ArrowRight className="helper-lesson-arrow" size={20}/>
        </button>
        {!compact&&<details className="helper-preview"><summary>Consultar código</summary><CodeReference code={helper.code?.target} label={helper.title}/></details>}
      </article>;
    })}</div>
  </section>;
}


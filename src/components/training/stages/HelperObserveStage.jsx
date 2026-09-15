import { useState } from 'react';
import { ArrowRight, Check, Code2, Lightbulb, Play } from 'lucide-react';
import CodeReference from '../CodeReference';
import './helper-observe.css';

function Value({value,example,source=false}) {
  if(Array.isArray(value)&&value.every(Array.isArray))return <div className="helper-matrix" role="table" aria-label={source?'Matriz inicial':'Matriz resultante'}>{value.map((row,i)=><div role="row" key={i}>{row.map((cell,j)=>{
    const removed=source&&(i===example?.removeRow||j===example?.removeColumn);
    const selected=source&&example?.selection&&i>=example.selection.i&&i<=example.selection.a&&j>=example.selection.j&&j<=example.selection.b;
    return <span role="cell" className={(removed?'is-removed':'')+(selected?' is-selected':'')} key={j} aria-label={removed?cell+' · se elimina':String(cell)}>{cell}</span>;
  })}</div>)}</div>;
  if(Array.isArray(value))return <div className="helper-value-list">{value.map((item,i)=><span key={i}>{typeof item==='object'?Object.entries(item).map(([k,v])=>k+': '+v).join(', '):String(item)}</span>)}</div>;
  if(value&&typeof value==='object')return <dl className="helper-value-object">{Object.entries(value).map(([key,val])=><div key={key}><dt>{key}</dt><dd>{String(val)}</dd></div>)}</dl>;
  return <span className="helper-single-value">{String(value)}</span>;
}
export default function HelperObserveStage({lessonData,stageId,onComplete}) {
  const [index,setIndex]=useState(0);
  const example=lessonData.teachingExample;
  const blocks=lessonData.logic?.anchors||[];
  const block=blocks[index];
  const isExample=stageId==='concrete-example';
  const isBlocks=stageId==='line-by-line'&&block;
  const name=lessonData.code.target.match(/static\s+(?:int|boolean|Matriz)\s+(\w+)\(/)?.[1];
  function next(){if(isBlocks&&index+1<blocks.length)setIndex(index+1);else onComplete({correct:true});}
  return <section className="helper-observe">
    <div className="helper-observe-heading"><span className="helper-observe-glyph">{isExample?<Play size={27}/>:isBlocks?<Code2 size={28}/>:<Lightbulb size={28}/>}</span><div><span className="training-eyebrow">{isExample?'Un ejemplo real':isBlocks?'Paso '+(index+1)+' de '+blocks.length:'Conoce tu herramienta'}</span><h2>{isExample?'De la entrada al resultado':isBlocks?block.label.toLocaleLowerCase('es'):name?('¿Para qué sirve '+name+'()?'):lessonData.title}</h2></div></div>
    <p className="helper-observe-intro">{isExample?example?.caption:isBlocks?block.memory:lessonData.fromZero?.explanation||lessonData.logic?.idea||lessonData.purpose}</p>
    {isExample&&example&&<>
      <div className="helper-example-flow"><div className="helper-example-part"><span className="helper-example-label">Recibe</span><Value value={example.input} example={example} source/></div><ArrowRight className="helper-example-arrow" size={25}/><div className="helper-example-part is-result"><span className="helper-example-label">Devuelve</span><Value value={example.output}/></div></div>
      {example.states&&<ol className="helper-example-steps">{example.states.map((state,i)=><li key={i}><span>{i+1}</span><code>{state}</code></li>)}</ol>}
      {(example.removeRow!==undefined||example.selection)&&<p className="helper-example-note">{example.removeRow!==undefined?'Las celdas tachadas se eliminan. Los índices empiezan en 0.':'Las celdas resaltadas forman el recorte. Los índices empiezan en 0.'}</p>}
    </>}
    {isBlocks&&<><CodeReference code={block.code} label={'Bloque '+(index+1)+' · '+lessonData.title}/><div className="helper-block-progress" aria-label="Bloques del auxiliar">{blocks.map((item,i)=><button type="button" key={item.id} className={i===index?'is-active':i<index?'is-done':''} aria-label={'Ver bloque '+(i+1)} aria-current={i===index?'step':undefined} onClick={()=>setIndex(i)}>{i<index?<Check size={16}/>:i+1}</button>)}</div></>}
    {!isExample&&!isBlocks&&<><div className="helper-memory-rule"><Lightbulb size={22}/><div><strong>Quédate con esta idea</strong><p>{lessonData.logic?.goldenRule}</p></div></div><div className="helper-learning-preview"><span><Check size={16}/>Un ejemplo resuelto</span><span><Code2 size={16}/>Escritura guiada</span></div></>}
    <div className="helper-observe-footer"><button className="duo-btn duo-btn-primary" onClick={next}>{isBlocks&&index+1<blocks.length?'Siguiente bloque':'Continuar'}<ArrowRight size={18}/></button></div>
  </section>;
}


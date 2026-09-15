import HelperObserveStage from './HelperObserveStage';
import CodeReference from '../CodeReference';
import { INTRO_CHAPTERS } from '../trainingSequence';

function Content({ value }) {
  if (value == null) return null;
  if (typeof value !== 'object') return <p>{String(value)}</p>;
  if (Array.isArray(value)) return <ul>{value.map((item, i) => <li key={i}><Content value={item} /></li>)}</ul>;
  return Object.entries(value).filter(([key]) => !['title', 'instruction', 'rule'].includes(key)).map(([key, item]) => (
    ['SR', 'CR'].includes(key) ? <section key={key}><h3>{key === 'SR' ? 'Sin repetición' : 'Con repetición'}</h3><Content value={item} /></section> : key === 'code' ? <pre key={key}><code>{item}</code></pre> : <Content key={key} value={item} />
  ));
}

export default function ObserveStage({ classData, lessonData, stageId, onComplete }) {
  if(lessonData.isShared||lessonData.type==='shared') return <HelperObserveStage classData={classData} lessonData={lessonData} stageId={stageId} onComplete={onComplete}/>;
  const chapter = lessonData.teachBeforePractice?.[INTRO_CHAPTERS[stageId]];
  const base = classData?.base;
  const showBase = ['base-recap', 'base-vs-variant', 'build-from-base'].includes(stageId);
  const showCode = ['observe', 'full-code-explained', 'base-vs-variant', 'build-from-base'].includes(stageId);
  const showDelta = ['delta-explained', 'base-vs-variant', 'build-from-base'].includes(stageId);
  return <>
    <h2>{chapter?.title || (stageId === 'welcome' ? `Aprende ${classData?.shortTitle || lessonData.title}` : lessonData.title)}</h2>
    {chapter ? <Content value={chapter} /> : <p>{lessonData.logic?.idea}</p>}
    {(stageId === 'observe' || stageId === 'welcome') && <p className="training-rule">{lessonData.logic?.goldenRule}</p>}
    {showBase && base && <section><h3>Base</h3><p>{base.logic?.idea}</p><CodeReference code={base.code?.target || base.code?.template} anchors={base.logic?.anchors} label="Algoritmo base"/></section>}
    {showDelta && lessonData.logic?.delta?.map((delta, i) => <section key={delta.id || i} className="training-rule"><h3>Qué cambia</h3><pre><code>{delta.before} → {delta.after || delta.added}</code></pre><p>{delta.reason}</p></section>)}
    {showCode && <>
      <div className="training-anchors">{lessonData.logic?.anchors?.map(anchor => <span key={anchor.id} title={anchor.memory}>{anchor.label}</span>)}</div>
      <CodeReference code={lessonData.code?.target || lessonData.code?.template} anchors={lessonData.logic?.anchors} changed={lessonData.logic?.delta?.map(d=>d.after||d.added)} label="Algoritmo actual"/>
    </>}
    {stageId==='welcome'&&classData?.relatedClasses?.length>0&&<aside className="training-rule"><h3>Conecta lo que aprendes</h3>{classData.relatedClasses.map(relation=><p key={relation.id}>{relation.note}</p>)}</aside>}
    {stageId==='plan-before-code'&&classData?.mentalModel?.recoveryPhrases?.map(phrase=><p className="training-rule" key={phrase}>{phrase}</p>)}
    <button className="duo-btn duo-btn-primary" onClick={() => onComplete({ correct: true })}>Continuar</button>
  </>;
}

import AnswerStage from './AnswerStage';
export default function FillLineStage({lessonData,...props}) {
  const lines=(lessonData.code?.target||'').split('\n');
  const drills=(lessonData.microDrills||[]).filter(d=>d.type==='fill-line');
  const fallback=(lessonData.criticalFragments||[]).filter(f=>lines.some(line=>line.includes(f.expected))).slice(0,4).map(f=>{
    const index=lines.findIndex(line=>line.includes(f.expected));
    return {prompt:'Completa el fragmento oculto en su contexto.',answer:f.expected,reason:f.errorMessage,anchor:f.anchor||f.id,
      context:lines.slice(Math.max(0,index-1),index+2).join('\n').replace(f.expected,'________________')};
  });
  return <AnswerStage {...props} drills={(drills.length?drills:fallback).map(d=>({...d,answerType:'code'}))}/>;
}


import AnswerStage from './AnswerStage';
export default function FillTokenStage({lessonData,...props}) {
  const drills=(lessonData.microDrills||[]).filter(d=>d.type==='fill-token');
  const fragments=lessonData.criticalFragments||[];
  const fallback=fragments.filter(f=>lessonData.code?.target?.includes(f.expected)).slice(0,3).map(f=>{
    const match=f.expected.match(/k\s*\+\s*1|==|>=|<=|!=|contains|removeLast|suma|prod|\bi\b|\bk\b/);
    const token=match?.[0]||f.expected;
    return {prompt:'Escribe el token que falta.',context:f.expected.replace(token,'____'),answer:token,reason:f.errorMessage,anchor:f.anchor||f.id};
  });
  return <AnswerStage {...props} drills={(drills.length?drills:fallback).map(d=>({...d,answerType:'code',context:d.context||d.prompt}))}/>;
}


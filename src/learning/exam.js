export function shuffle(items,random=Math.random) {
  const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;
}
export function examSummary(results) {
  const count=results.length||1,correct=results.filter(r=>r.correct).length;
  const anchors={},classes={};
  for(const result of results) {
    const key=result.classId||'general';
    classes[key]??={correct:0,total:0};classes[key].total++;classes[key].correct+=Number(result.correct);
    for(const [anchor,score] of Object.entries(result.anchors||{}))if(!score)anchors[anchor]=(anchors[anchor]||0)+1;
  }
  return {correct,total:results.length,passed:results.length>0&&correct===results.length,
    accuracy:results.reduce((a,b)=>a+(b.accuracy||0),0)/count,
    logic:results.reduce((a,b)=>a+(b.logicScore||0),0)/count,
    criticalMistakes:results.reduce((a,b)=>a+(b.criticalMistakes||0),0),classes,anchors,
    slowest:[...results].sort((a,b)=>b.elapsedSeconds-a.elapsedSeconds)[0],
    weakest:[...results].sort((a,b)=>a.logicScore-b.logicScore||a.accuracy-b.accuracy)[0]};
}


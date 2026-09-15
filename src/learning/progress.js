export const PROGRESS_KEY='vargas_learning_v2';
export const REVIEW_INTERVALS=[600000,86400000,259200000,604800000];
export function readProgress(storage=globalThis.localStorage) {
  try { const data=JSON.parse(storage.getItem(PROGRESS_KEY)||'{}');return data&&typeof data==='object'&&!Array.isArray(data)?data:{}; } catch{return {};}
}
export function supportLevel(record={}) {
  const score=record.mastery||0;
  return score>=.85?0:score>=.7?1:score>=.55?2:score>=.4?3:score>=.2?4:5;
}
export function canSpeedrun() { return true; }
export function updateRecord(previous={}, result, now=Date.now()) {
  const accuracy=result.accuracy??Number(result.correct);
  const recall=['recall','exam'].includes(result.mode);
  const successful=recall&&result.correct;
  const successfulRecalls=(previous.successfulRecalls||0)+Number(successful);
  const perfectRecalls=(previous.perfectRecalls||0)+Number(successful&&!(result.criticalMistakes>0));
  const logicScore=result.logicScore??Number(result.correct);
  const seconds=result.elapsedSeconds || 0;
  const typing=result.mode?{accuracy,bestTime:result.correct&&seconds>0?Math.min(previous.typing?.bestTime||Infinity,seconds):previous.typing?.bestTime||null,cpm:result.correct?result.cpm||0:0}:previous.typing||{accuracy:0,bestTime:null,cpm:0};
  const anchors={...previous.anchors};
  for(const [key,value] of Object.entries(result.anchors||{}))anchors[key]=previous.anchors?.[key]===undefined?value:(previous.anchors[key]+value)/2;
  const recallScore=Math.min(1,successfulRecalls/2);
  const speedScore=typing.bestTime?Math.min(1,(result.targetSeconds||90)/typing.bestTime):0;
  const mastery=Math.max(0,Math.min(1,.4*recallScore+.25*logicScore+.2*typing.accuracy+.15*speedScore-.05*(result.hintsUsed||0)));
  const reviewIndex=successful?Math.min(3,(previous.reviewIndex??-1)+1):result.correct?(previous.reviewIndex??0):0;
  return {...previous,attempts:(previous.attempts||0)+1,mastery,successfulRecalls,perfectRecalls,logic:{score:logicScore},typing,anchors,
    hintsUsed:(previous.hintsUsed||0)+(result.hintsUsed||0),lastAttempt:result,lastReviewed:new Date(now).toISOString(),
    nextReview:new Date(now+REVIEW_INTERVALS[reviewIndex]).toISOString(),reviewIndex,
    status:mastery>=.85&&successfulRecalls>=2?'MASTERED':successfulRecalls?'REVIEW':'LEARNING'};
}
export function saveAttempt(id,result,storage=globalThis.localStorage) {
  const all=readProgress(storage);all[id]=updateRecord(all[id],result);
  try {storage.setItem(PROGRESS_KEY,JSON.stringify(all));} catch {console.warn('No se pudo guardar el progreso en este navegador.');}
  if(typeof window!=='undefined')window.dispatchEvent(new Event('learning-progress'));
  return all[id];
}
export function stageXp(result) {
  if(!result.correct)return 0;
  if(result.mode==='exam')return !result.criticalMistakes?50:35;
  if(result.mode==='speedrun')return !result.criticalMistakes?40:30;
  if(result.mode==='recall')return Math.max(10,25-5*(result.hintsUsed||0));
  if(result.mode)return 15;
  return ['recognize','observe','trace'].includes(result.kind)?(result.kind==='recognize'?5:0):10;
}
export function reviewQueue(algorithms,records,{cram=false,now=Date.now()}={}) {
  return algorithms.filter(a=>a.code?.target&&records[a.id]).filter(a=>{
    const r=records[a.id],due=new Date(r.nextReview||0).getTime();
    return due<=now || (cram&&(r.mastery<.85||due<=now+86400000||!r.lastAttempt?.correct));
  }).sort((a,b)=>(records[a.id].mastery||0)-(records[b.id].mastery||0));
}


import { codeTokens, sameCode, findCodeMismatch } from '../components/training/trainingSequence.js';
export function containsTokens(code, fragment) {
  const actual=codeTokens(code), expected=codeTokens(fragment);
  return expected.length>0 && actual.some((_,i)=>expected.every((token,j)=>actual[i+j]===token));
}
export function evaluateCode(answer, lesson) {
  const target=lesson.code?.target || '';
  const exact=sameCode(answer,target);
  const fragments=lesson.criticalFragments || [];
  const anchors={};
  const errors=[];
  let lineError=null;
  if(!exact && target.trim()) {
    lineError=findCodeMismatch(answer,target);
    if(lineError) {
      errors.push({
        id:'line-mismatch',
        anchor:'syntax',
        line:lineError.line,
        found:lineError.found,
        expected:lineError.expected,
        message:lineError.message
      });
    }
  }
  for(const fragment of fragments) {
    // Some older content describes a concept rather than a contiguous Java fragment.
    const checkable=fragment.forbidden || containsTokens(target,fragment.expected);
    if(!checkable)continue;
    const correct=exact || (fragment.forbidden?!containsTokens(answer,fragment.forbidden):containsTokens(answer,fragment.expected));
    anchors[fragment.anchor || fragment.id]=correct?1:0;
    if(!correct)errors.push({id:fragment.id,anchor:fragment.anchor || fragment.id,expected:fragment.expected,message:fragment.errorMessage || 'Revisa '+fragment.concept});
  }
  const scores=Object.values(anchors);
  return {
    correct:exact,
    logicScore:scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:Number(exact),
    anchors,
    criticalMistakes:errors.length,
    errors,
    lineError,
    errorLine:lineError?.line || null
  };
}

export function maskCode(lesson, fraction) {
  const lines=lesson.code.target.split('\n');
  const meaningful=lines.map((line,i)=>({line,i})).filter(x=>x.line.trim()&&!/^[{}]+$/.test(x.line.trim()));
  const fragments=lesson.criticalFragments || [];
  const priority=meaningful.filter(x=>fragments.some(f=>containsTokens(x.line,f.expected)||containsTokens(f.expected,x.line.trim())));
  const ranked=[...priority,...meaningful.filter(x=>!priority.includes(x))];
  const indices=new Set(ranked.slice(0,Math.ceil(meaningful.length*fraction)).map(x=>x.i));
  return lines.map((line,i)=>indices.has(i)?line.match(/^\s*/)[0]+'____________________':line).join('\n');
}


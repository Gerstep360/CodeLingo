import { sameCode } from '../components/training/trainingSequence.js';
const words=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[.,;:¿?¡!]/g,' ').replace(/\s+/g,' ').trim();
export function isAnswerCorrect(answer,drill) {
  const accepted=[drill.answer,...(drill.acceptedAnswers||[])].filter(Boolean);
  if(accepted.some(expected=>sameCode(answer,expected)))return true;
  if(drill.answerType==='code'||drill.type==='fill-token'||drill.type==='fill-line')return false;
  const text=words(answer);
  if(accepted.some(expected=>words(expected)===text))return true;
  if(/add.*recursi.*removeLast/i.test(drill.answer)) {
    return /(?:add|agreg|anad|elij|eleg)/.test(text)&&/(?:recurs|llam|baj|explor)/.test(text)&&/(?:removelast|quit|deshac|retroced|elimin)/.test(text)
      && text.search(/add|agreg|anad|elij|eleg/)<text.search(/recurs|llam|baj|explor/)
      && text.search(/recurs|llam|baj|explor/)<text.search(/removelast|quit|deshac|retroced|elimin/);
  }
  return false;
}
export function recognitionDrills(lesson) {
  const drills=lesson.recognitionDrills?.length?lesson.recognitionDrills:(lesson.microDrills||[]).filter(d=>['contrast','choice'].includes(d.type));
  return (drills.length?drills:[{prompt:'¿Qué regla describe este algoritmo?',answer:lesson.logic?.goldenRule}]).map((drill,index)=>{
    const pattern=/add.*recursi.*removeLast/i.test(drill.answer);
    const alternatives=pattern?['Quitar → agregar → recursión','Recursión → quitar → agregar']:['k','k+1','i','0','!contains','contains','libre'].includes(drill.answer)?
      ['k','k+1','i','0','!contains','contains','libre'].filter(v=>v!==drill.answer).slice(0,3):
      ['Se reinicia la estructura en cada llamada.','Se invierte el orden de todas las operaciones.'];
    const options=[drill.answer,...alternatives].filter((value,i,all)=>value&&all.indexOf(value)===i);
    const offset=(index+1)%options.length;
    return {...drill,prompt:pattern?'Dentro del for, después de elegir k, ¿qué tres acciones ejecutas y en qué orden?':drill.prompt,
      reason:drill.reason||(pattern?'El for elige el candidato. Dentro agregas el candidato, exploras mediante recursión y lo quitas al regresar.':lesson.logic?.goldenRule),
      options:drill.options||[...options.slice(offset),...options.slice(0,offset)]};
  });
}


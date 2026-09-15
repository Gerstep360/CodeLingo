import { codeTokens } from './trainingSequence';
const KEYWORDS=new Set(['static','void','int','boolean','return','if','for','else','new','public','class','double','true','false']);
function Syntax({text}) {
  const parts=text.split(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*$|\b[A-Za-z_$][\w$]*\b|\b\d+\b)/g);
  return parts.map((token,i)=><span key={i} className={KEYWORDS.has(token)?'syntax-keyword':/^["']/.test(token)?'syntax-string':/^\d+$/.test(token)?'syntax-number':token.startsWith('//')?'syntax-comment':''}>{token}</span>);
}
export default function CodeReference({code='',anchors=[],changed=[],label='Referencia Java'}) {
  return <div className="code-reference" aria-label={label}><div className="code-reference-title">{label}</div><pre><code>{code.split('\n').map((line,i)=>{
    const anchor=anchors.find(a=>a.code&&codeTokens(line).join(' ').includes(codeTokens(a.code).join(' ')));
    const delta=changed.some(fragment=>fragment&&line.includes(fragment));
    return <span key={i} className={'reference-line '+(delta?'reference-changed':'')} data-anchor={anchor?.id}>
      <span className="reference-number" aria-hidden="true">{i+1}</span><span><Syntax text={line}/>{anchor&&<small className="anchor-label">{anchor.label}</small>}</span>
    </span>;
  })}</code></pre></div>;
}


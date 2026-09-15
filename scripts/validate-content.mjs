import {readdirSync,readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {getSequence} from '../src/components/training/trainingSequence.js';
import {containsTokens} from '../src/learning/semanticEvaluator.js';
const root=path.resolve('src/content/primer-parcial');
const supported=new Set(['observe','trace','recognize','fill-token','fill-line','order-blocks','ghost-code','guided-typing','recall','speedrun']);
const walk=p=>readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?(e.name==='templates'?[]:walk(path.join(p,e.name))):[path.join(p,e.name)]);
const files=walk(root).filter(f=>f.endsWith('.json')),ids=new Set(),errors=[];
const canonical=readFileSync('src/assets/AI/Primer Parcial/ExamenVargas.java','utf8');
let algorithms=0;
const fail=(file,message)=>errors.push(path.relative(root,file)+': '+message);
for(const file of files){
 let data;try{data=JSON.parse(readFileSync(file,'utf8'));}catch(e){fail(file,e.message);continue;}
 if(!data.id||ids.has(data.id))fail(file,'ID ausente o duplicado: '+data.id);ids.add(data.id);
 if(data.order!==undefined&&(!Number.isInteger(data.order)||data.order<0))fail(file,'order inválido');
 for(const ref of [data.parent,...(data.requires||[])].filter(Boolean)){
   const resolved=path.resolve(path.dirname(file),ref);
   if(!resolved.startsWith(root+path.sep)||!existsSync(resolved))fail(file,'Referencia inválida: '+ref);
 }
 if(path.basename(file)==='class.json'){
   if(!existsSync(path.join(path.dirname(file),'base.json')))fail(file,'Falta base.json');
   const dir=path.join(path.dirname(file),'exercises');
   if(existsSync(dir)){const orders=new Set();for(const f of readdirSync(dir).filter(f=>f.endsWith('.json'))){const d=JSON.parse(readFileSync(path.join(dir,f),'utf8'));if(!Number.isInteger(d.order)||orders.has(d.order))fail(file,'Orden de variantes ausente o duplicado');orders.add(d.order);}}
 }
 if(!data.trainingSequence)continue;
 const seq=getSequence(data);
 if(!seq.length||seq.some(s=>!supported.has(s.kind)))fail(file,'trainingSequence inválida');
 if(seq.some(s=>s.kind==='trace')&&!data.trace?.steps?.length)fail(file,'Falta trace.steps');
 if(data.typingEnabled===false){if(!data.code?.template)fail(file,'Falta plantilla conceptual');continue;}
 if(!data.code?.target?.trim()){fail(file,'Falta code.target');continue;}
 algorithms++;
 if(data.canonicalSource&&!containsTokens(canonical,data.code.target))fail(file,'El código no coincide con ExamenVargas.java');
 const fragmentIds=new Set();
 for(const f of data.criticalFragments||[]){
   if(!f.id||fragmentIds.has(f.id))fail(file,'Fragmento sin ID único');fragmentIds.add(f.id);
   if(!f.expected&&!f.forbidden)fail(file,'Fragmento sin expected/forbidden');
   if(f.expected&&!containsTokens(data.code.target,f.expected))fail(file,'Fragmento fuera del target: '+f.id);
   if(f.forbidden&&containsTokens(data.code.target,f.forbidden))fail(file,'El target contiene un fragmento prohibido: '+f.id);
 }
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('Contenido válido: '+files.length+' JSON, '+algorithms+' algoritmos con código.');


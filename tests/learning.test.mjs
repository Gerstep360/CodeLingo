import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sameCode} from '../src/learning/javaComparison.js';
import {evaluateCode} from '../src/learning/semanticEvaluator.js';
import {editCode} from '../src/learning/editorCommands.js';
import {isAnswerCorrect} from '../src/learning/answerEvaluator.js';
import {updateRecord,canSpeedrun,reviewQueue,readProgress} from '../src/learning/progress.js';
import {examSummary,shuffle} from '../src/learning/exam.js';
const lesson=file=>JSON.parse(readFileSync('src/content/primer-parcial/'+file,'utf8'));
test('Java tolera indentación, saltos, comentarios y llaves seguras',()=>{
 assert.ok(sameCode('if(a){ f(); }','if ( a ) f ( ) ;'));
 assert.ok(sameCode('for(int i=0;i<n;i++){ f(); }','for (int i=0; i<n; i++) f();'));
 assert.ok(sameCode('int x=1; // comentario\n f();','int x = 1; f();'));
 assert.ok(!sameCode('if(a){f();g();}','if(a)f();g();'));
 assert.ok(!sameCode('if(a)if(b)f();else g();','if(a){if(b)f();}else g();'));
 assert.ok(!sameCode('print("a b");','print("ab");'));
});
test('Tab, Shift+Tab, selección multilinea y autoindentación',()=>{
 assert.deepEqual(editCode('abc',0,0,'Tab'),{value:'    abc',start:4,end:4});
 assert.equal(editCode('    a\n    b',0,11,'Tab',true).value,'a\nb');
 assert.equal(editCode('a\nb',0,3,'Tab').value,'    a\n    b');
 assert.deepEqual(editCode('{}',1,1,'Enter'),{value:'{\n    \n}',start:6,end:6});
});
test('Respuesta conceptual admite palabras equivalentes y rechaza la cabecera del for',()=>{
 const drill={answer:'add → recursión → removeLast'};
 assert.ok(isAnswerCorrect('Agrego, llamo recursivamente y quito',drill));
 assert.ok(!isAnswerCorrect('for(int k=i;k<=n;k++)',drill));
 assert.ok(isAnswerCorrect('k + 1',{answer:'k+1',answerType:'code'}));
});
for(const [file,before,after] of [
 ['04-combinaciones/exercises/sin-repeticion.json','combiSR(L1,L2,r,k+1);','combiSR(L1,L2,r,k);'],
 ['04-combinaciones/exercises/con-repeticion.json','combiCR(L1,L2,r,k);','combiCR(L1,L2,r,k+1);'],
 ['05-permutaciones/exercises/sin-repeticion.json','!L1.contains','L1.contains'],
 ['01-sumandos/base.json','L.removeLast();',''],
 ['07-submatrices/base.json','a=i','a=0'],
 ['06-determinante/base.json','det(menor','det('],
])test('Detecta error crítico en '+file,()=>{
 const data=lesson(file),bad=data.code.target.replace(before,after);
 assert.notEqual(bad,data.code.target);
 assert.ok(evaluateCode(data.code.target,data).correct);
 assert.ok(!evaluateCode(bad,data).correct);
 assert.ok(evaluateCode(bad,data).criticalMistakes>0);
});
test('Permut CR prohíbe contains',()=>{
 const data=lesson('05-permutaciones/exercises/con-repeticion.json');
 assert.ok(evaluateCode(data.code.target,data).correct);
 assert.ok(evaluateCode(data.code.target.replace('L1.add','if(!L1.contains(1)) L1.add'),data).errors.some(e=>e.id==='no-contains'));
});
test('Dominio exige recalls, pistas reducen score y errores acortan repaso',()=>{
 const success={mode:'recall',correct:true,accuracy:1,logicScore:1,hintsUsed:0,elapsedSeconds:30,anchors:{undo:1}};
 let record=updateRecord({},success,1000);assert.ok(canSpeedrun(record));assert.notEqual(record.status,'MASTERED');
 record=updateRecord(record,success,2000);assert.equal(record.status,'MASTERED');assert.equal(record.successfulRecalls,2);
 const failed=updateRecord(record,{...success,correct:false,logicScore:0,accuracy:.5},3000);assert.equal(failed.reviewIndex,0);
 assert.ok(updateRecord({}, {...success,hintsUsed:2}).mastery<updateRecord({},success).mastery);
 assert.equal(reviewQueue([{id:'a',code:{target:'f();'}}],{a:{...failed,nextReview:new Date(0).toISOString()}}).length,1);
});
test('Almacenamiento anterior no se destruye; JSON inválido se recupera',()=>{
 const storage={getItem:()=>'{invalid'};assert.deepEqual(readProgress(storage),{});
 assert.equal(examSummary([{correct:false,accuracy:.5,logicScore:0,elapsedSeconds:1}]).passed,false);
 assert.deepEqual(shuffle([1,2,3],()=>0).sort(),[1,2,3]);
});


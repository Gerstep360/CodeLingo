import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { getSequence, sameCode } from '../src/components/training/trainingSequence.js';
const supported = new Set(['observe','trace','recognize','fill-token','fill-line','order-blocks','ghost-code','guided-typing','recall','speedrun']);
const walk = p => readdirSync(p,{withFileTypes:true}).flatMap(e => e.isDirectory() ? (e.name === 'templates' ? [] : walk(p+'/'+e.name)) : [p+'/'+e.name]);
let count = 0;
for (const file of walk('src/content/primer-parcial').filter(f => f.endsWith('.json'))) {
 const data = JSON.parse(readFileSync(file,'utf8'));
 if (!data.trainingSequence) continue;
 const sequence = getSequence(data);
 assert.ok(sequence.length, file);
 assert.ok(sequence.every(s => supported.has(s.kind)), file);
 if (sequence.some(s => s.kind === 'trace')) assert.ok(data.trace?.steps?.length, file);
 if (sequence.some(s => ['guided-typing','recall','speedrun','ghost-code','order-blocks'].includes(s.kind))) assert.ok(data.code?.target?.trim(), file);
 if (data.typingEnabled === false) assert.ok(sequence.every(s => ['observe','trace','recognize'].includes(s.kind)), file);
 count++;
}
assert.ok(sameCode('int x = 1;', 'int x=1;'));
assert.ok(!sameCode('intx=1;', 'int x=1;'));
assert.ok(!sameCode('f(L,n,k);', 'f(L,n,k+1);'));
assert.ok(!sameCode('a + + b', 'a++b'));
assert.ok(!sameCode('print("a b");', 'print("ab");'));
assert.ok(!sameCode('', ''));
assert.deepEqual(getSequence({trainingSequence:[]}), []);
assert.equal(getSequence({trainingSequence:['future-stage']})[0].kind,'future-stage');
console.log(`Validated ${count} training sequences and Java comparison regressions.`);

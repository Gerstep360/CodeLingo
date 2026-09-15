import test from 'node:test';
import assert from 'node:assert/strict';
import { accountStorage, legacyProgress, validateValues } from '../src/account/accountStorage.js';
test('account hydration isolates users and migrations exclude credentials/preferences', () => {
 accountStorage.hydrate({'vargas_duo_xp':'30'});
 accountStorage.hydrate({}); assert.equal(accountStorage.getItem('vargas_duo_xp'),null);
 const source=new Map([['vargas_duo_xp','90'],['token','secret'],['vargas_theme','dark'],['vargas_code_draft_test','int n=0;']]);
 const storage={length:source.size,key:i=>[...source.keys()][i],getItem:k=>source.get(k)};
 assert.deepEqual(legacyProgress(storage),{'vargas_duo_xp':'90','vargas_code_draft_test':'int n=0;'});
 assert.equal(source.get('vargas_duo_xp'),'90');
});
test('changes notify once and snapshots cannot mutate account data', () => {
 accountStorage.hydrate({});let calls=0;const unsub=accountStorage.subscribe(()=>calls++);
 accountStorage.setItem('vargas_duo_xp','10');accountStorage.setItem('vargas_duo_xp','10');
 const snap=accountStorage.snapshot();snap.vargas_duo_xp='999';assert.equal(accountStorage.getItem('vargas_duo_xp'),'10');
 accountStorage.removeItem('vargas_duo_xp');assert.equal(calls,2);unsub();
});
test('invalid or excessive account snapshots cannot hydrate', () => {
 for(const value of [[],null,{'auth_token':'x'},{'vargas_duo_xp':1},{'vargas_code_draft_x':'x'.repeat(500001)}])assert.throws(()=>validateValues(value));
});

const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');

const assert=require('node:assert/strict');

(async()=>{

 const browser=await chromium.launch({headless:true,channel:'msedge'});

 const stamp=Date.now(),email=`sync-${stamp}@example.test`,password='Test-account-password-123';

 const one=await browser.newContext({viewport:{width:1280,height:950}}),two=await browser.newContext({viewport:{width:390,height:844}});

 const a=await one.newPage(),b=await two.newPage(); const errors=[];a.on('pageerror',e=>errors.push(e.message));b.on('pageerror',e=>errors.push(e.message));

 try {

 await a.goto('http://127.0.0.1:5173/#/account');

 await a.getByRole('button',{name:'Crear cuenta',exact:true}).click();

 await a.getByLabel('Tu nombre',{exact:true}).fill('Alumno de prueba');await a.getByLabel('Correo electrónico').fill(email);await a.getByLabel('Contraseña · mínimo 10 caracteres').fill(password);await a.getByLabel('Repite tu contraseña').fill(password);

 await a.screenshot({path:'docs/account-register-desktop.png'});

 await a.getByRole('button',{name:'Crear mi cuenta',exact:true}).click();

 await a.getByRole('heading',{name:'Tu avance, Alumno de prueba'}).waitFor();

 await a.evaluate(()=>{localStorage.setItem('vargas_duo_xp','321');localStorage.setItem('vargas_duo_completed','["node-sumandos-base"]');localStorage.setItem('vargas_code_draft_demo','    int x = 1;\n');});

 await a.reload();await a.getByRole('button',{name:'Subir mi avance anterior'}).click();await a.getByText('Guardado en tu cuenta',{exact:true}).waitFor();

 const read=page=>page.evaluate(async()=>{const session=await(await fetch('/api/session')).json();const r=await fetch('/api/progress',{headers:{Accept:'application/json','X-Account-ID':String(session.user.id)}});return r.json();});

 let data=await read(a);assert.equal(data.values.vargas_duo_xp,'321');assert.equal(data.values.vargas_code_draft_demo,'    int x = 1;\n');

 await b.goto('http://127.0.0.1:5173/#/account');await b.getByLabel('Correo electrónico').fill(email);await b.getByLabel('Contraseña',{exact:true}).fill(password);await b.getByRole('button',{name:'Entrar y continuar'}).click();await b.getByRole('heading',{name:'Tu avance, Alumno de prueba'}).waitFor();

 assert.equal((await read(b)).values.vargas_duo_xp,'321');

 assert.ok(await b.locator('body').evaluate(e=>e.scrollWidth<=innerWidth));await b.screenshot({path:'docs/account-mobile.png'});

 // A real second-client update makes A's revision stale.

 await b.evaluate(async()=>{const session=await (await fetch('/api/session')).json();const p=await(await fetch('/api/progress',{headers:{'X-Account-ID':String(session.user.id)}})).json();await fetch('/api/progress',{method:'PUT',headers:{'Content-Type':'application/json','Accept':'application/json','X-CSRF-TOKEN':session.csrf,'X-Account-ID':String(session.user.id)},body:JSON.stringify({revision:p.revision,values:{...p.values,vargas_duo_xp:'999'}})});});

 await a.goto('http://127.0.0.1:5173/#/lesson/node-sumandos-helper-suma');

 await a.getByRole('heading',{name:'¿Para qué sirve suma()?'}).waitFor();

 await a.getByRole('link',{name:/Hay cambios en otro dispositivo/}).click();

 await a.getByRole('heading',{name:'Hay dos versiones de tu avance'}).waitFor();await a.screenshot({path:'docs/account-conflict.png'});

 await a.getByRole('button',{name:'Usar versión de la cuenta'}).click();await a.getByText('Guardado en tu cuenta',{exact:true}).waitFor();assert.equal((await read(a)).values.vargas_duo_xp,'999');

 await a.getByRole('button',{name:'Cerrar sesión',exact:true}).click();await a.getByRole('button',{name:'Entrar y continuar'}).waitFor();

 assert.equal((await a.request.get('http://127.0.0.1:5173/api/progress',{headers:{Accept:'application/json'}})).status(),401);

 assert.deepEqual(errors,[]);console.log('PASS: registration, migration, exact draft preservation, second device login, revision conflict, remote resolution, logout, mobile layout.');

 }finally{await browser.close();}

})().catch(e=>{console.error(e);process.exit(1);});


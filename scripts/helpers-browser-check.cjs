const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
 const page=await browser.newPage({viewport:{width:1365,height:1000},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(12000);
 await page.goto('http://127.0.0.1:5173/#/class/sumandos');
 await page.getByRole('heading',{name:'Pequeñas funciones, grandes pasos'}).waitFor();
 assert.equal(await page.locator('.helper-lesson').count(),1);
 await page.screenshot({path:'docs/helpers-class-dark.png'});
 await page.getByRole('button',{name:'Aprender Auxiliar suma',exact:true}).click();
 await page.getByRole('heading',{name:'¿Para qué sirve suma()?'}).waitFor();
 assert.ok((await page.locator('.helper-observe-intro').innerText()).includes('Recorre'));
 await page.screenshot({path:'docs/helpers-lesson-dark.png'});
 await page.getByRole('button',{name:'Continuar',exact:true}).click();
 await page.getByRole('heading',{name:'De la entrada al resultado'}).waitFor();
 assert.equal(await page.locator('.helper-single-value').innerText(),'9');
 await page.screenshot({path:'docs/helpers-example-dark.png'});
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.locator('.training-panel').evaluate(e=>e.scrollWidth<=e.clientWidth));
 await page.screenshot({path:'docs/helpers-example-mobile.png'});
 await page.getByRole('button',{name:'Continuar',exact:true}).click();
 assert.match(await page.locator('.helper-observe-intro').innerText(),/cero/);
 for(let i=0;i<2;i++)await page.getByRole('button',{name:'Siguiente bloque',exact:true}).click();
 await page.getByRole('button',{name:'Continuar',exact:true}).click();
 await page.getByLabel('Código Java',{exact:true}).waitFor();
 const input=page.getByLabel('Código Java',{exact:true});
 await input.fill('{}');await input.evaluate(e=>e.setSelectionRange(1,1));await input.press('Enter');await input.press('Tab');
 assert.equal(await input.inputValue(),'{\n        \n}');
 await input.press('Shift+Tab');assert.equal(await input.inputValue(),'{\n    \n}');
 await page.goto('http://127.0.0.1:5173/#/class/determinante');
 assert.equal(await page.locator('.helper-lesson').count(),3);
 assert.ok(await page.locator('.class-overview').evaluate(e=>e.scrollWidth<=e.clientWidth));
 await page.screenshot({path:'docs/helpers-class-mobile.png'});
 await page.evaluate(()=>{localStorage.setItem('vargas_theme','light');});await page.reload();
 await page.screenshot({path:'docs/helpers-class-light-mobile.png'});
 await page.setViewportSize({width:1365,height:1000});
 await page.goto('http://127.0.0.1:5173/#/class/sumandos');
 await page.screenshot({path:'docs/helpers-class-light.png'});
 await page.goto('http://127.0.0.1:5173/#/lesson/node-determinante-shared-menor');
 await page.getByRole('button',{name:'Continuar',exact:true}).click();
 assert.equal(await page.locator('.helper-matrix').count(),2);
 assert.equal(await page.locator('.helper-matrix .is-removed').count(),5);
 await page.screenshot({path:'docs/helpers-matrix-light.png'});
 await page.goto('http://127.0.0.1:5173/#/path');
 assert.equal(await page.locator('.helper-lessons.is-compact').count(),5);
 assert.deepEqual(errors,[]);
 console.log('PASS helpers: class pages, suma lesson, examples, blocks, Tab/Shift+Tab, matrices, responsive layout, dark/light.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});



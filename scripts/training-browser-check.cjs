const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=JSON.parse(fs.readFileSync('src/content/primer-parcial/01-sumandos/base.json','utf8'));
const variant=JSON.parse(fs.readFileSync('src/content/primer-parcial/04-combinaciones/exercises/sin-repeticion.json','utf8'));
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});
  page.setDefaultTimeout(10000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5173/');
  await page.locator('button[title="Sumandos Base"]').click({force:true});
  await page.locator('.node-tooltip-popover button').click();
  await page.getByRole('dialog').waitFor();
  await page.getByRole('button',{name:'Continuar',exact:true}).click();
  await page.getByRole('button',{name:'Salir de la lección',exact:true}).click();
  await page.locator('button[title="Sumandos Base"]').click({force:true});
  await page.locator('.node-tooltip-popover button').click();
  assert.match(await page.getByRole('dialog').innerText(),/Qué estamos intentando hacer/);
  await page.getByRole('button',{name:'Salir de la lección',exact:true}).click();
  async function mount(lesson,stage,extra={}){
    await page.evaluate(async({lesson,stage,extra})=>{
      window.testRoot?.unmount();document.getElementById('root').style.display='none';
      const React=(await import('/node_modules/.vite/deps/react.js')).default;
      const {createRoot}=(await import('/node_modules/.vite/deps/react-dom_client.js')).default;
      const {TrainingRunner}=await import('/src/components/training/TrainingRunner.jsx');
      const host=document.createElement('div');document.body.append(host);window.testRoot=createRoot(host);
      window.result=null;window.closeCount=0;
      const id=lesson.id+'-test-'+stage;localStorage.removeItem('vargas_session_'+id);
      window.testRoot.render(React.createElement(TrainingRunner,{lessonData:{...lesson,id,trainingSequence:[stage]},classData:{shortTitle:'Sumandos'},...extra,onComplete:r=>window.result=r,onClose:()=>window.closeCount++}));
    },{lesson,stage,extra});
    await page.getByRole('dialog').waitFor();
  }
  await mount(base,'recognize');
  assert.equal(await page.getByRole('textbox').count(),0);
  await page.getByRole('button',{name:/^\d k$/}).click();
  await page.getByRole('button',{name:'Comprobar',exact:true}).click();
  await page.getByRole('button',{name:'Continuar',exact:true}).click();
  assert.match(await page.locator('.training-panel h2').innerText(),/qué tres acciones/);
  await page.getByRole('button',{name:/add.*recursión.*removeLast/}).click();
  await page.getByRole('button',{name:'Comprobar',exact:true}).click();
  assert.match(await page.getByRole('status').innerText(),/Correcto/);
  await mount(base,'guided-copy');
  const input=page.getByLabel('Código Java',{exact:true});
  await input.fill('{}');await input.evaluate(el=>el.setSelectionRange(1,1));await input.press('Enter');
  assert.equal(await input.inputValue(),'{\n    \n}');
  await input.press('Tab');assert.equal(await input.inputValue(),'{\n        \n}');
  await input.press('Shift+Tab');assert.equal(await input.inputValue(),'{\n    \n}');
  await input.fill('incorrecto');await input.press('Control+Enter');
  assert.match(await page.getByRole('status').innerText(),/Revisa/);
  const formatted=base.code.target.split('\n').map(line=>line.trim()).join('\n');
  await input.fill(formatted);await input.press('Control+Enter');
  assert.match(await page.getByRole('status').innerText(),/Código correcto/);
  await page.screenshot({path:'docs/editor-desktop.png'});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'docs/editor-mobile.png',fullPage:true});
  assert.ok(await page.locator('.training-panel').evaluate(e=>e.scrollWidth<=e.clientWidth));
  await page.setViewportSize({width:1280,height:900});
  await mount(variant,'recall');
  assert.equal(await page.locator('.code-reference').count(),0);
  await page.getByRole('button',{name:/Pista 0/}).click();
  assert.ok(await page.locator('.training-hint').isVisible());
  await page.getByLabel('Código Java',{exact:true}).fill(variant.code.target);
  await page.getByRole('button',{name:'Comprobar',exact:true}).click();
  await page.getByRole('button',{name:'Continuar',exact:true}).click();
  await page.getByRole('button',{name:'Volver a la ruta',exact:true}).dblclick();
  assert.equal(await page.evaluate(()=>window.closeCount),1);
  assert.equal(await page.evaluate(()=>window.result.stages[0].hintsUsed),1);
  await mount(variant,'speedrun');
  assert.match(await page.getByRole('dialog').innerText(),/Primero completa un recall/);
  await page.getByLabel('Código Java',{exact:true}).fill(variant.code.target);
  await page.getByRole('button',{name:'Comprobar',exact:true}).click();
  await page.getByRole('button',{name:'Iniciar velocidad',exact:true}).click();
  assert.equal(await page.getByLabel('Código Java',{exact:true}).inputValue(),'');
  assert.equal(await page.locator('.code-reference').count(),0);
  assert.match(await page.getByRole('dialog').innerText(),/Precisión antes que velocidad/);
  await page.evaluate(async lessons=>{
    window.testRoot.unmount();
    const React=(await import('/node_modules/.vite/deps/react.js')).default;
    const {createRoot}=(await import('/node_modules/.vite/deps/react-dom_client.js')).default;
    const {default:ExamRunner}=await import('/src/components/training/ExamRunner.jsx');
    const host=document.createElement('div');document.body.append(host);window.testRoot=createRoot(host);window.examResult=null;
    window.testRoot.render(React.createElement(ExamRunner,{lessons,title:'Prueba de examen',duration:60,onClose:()=>{},onComplete:r=>window.examResult=r}));
  },[variant]);
  await page.getByRole('dialog',{name:'Prueba de examen'}).waitFor();
  assert.equal(await page.locator('.code-reference').count(),0);
  assert.equal(await page.getByRole('button',{name:/Pista/}).count(),0);
  await page.getByLabel('Código Java',{exact:true}).fill('incorrecto');
  await page.getByRole('button',{name:'Entregar respuesta',exact:true}).click();
  await page.getByRole('button',{name:'Volver',exact:true}).click();
  assert.equal(await page.evaluate(()=>window.examResult.passed),false);
  await page.goto('http://127.0.0.1:5173/');
  await page.getByRole('button',{name:'Practicar',exact:true}).first().click();
  await page.getByRole('heading',{name:'Practicar y dominar'}).waitFor();
  await page.screenshot({path:'docs/practice-desktop.png'});
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'docs/practice-mobile.png'});
  await page.getByRole('button',{name:'Guía Mental',exact:false}).last().click();
  await page.locator('.duo-cheatsheet-container').waitFor();
  assert.ok((await page.locator('.algo-accordion-item').count())>=24);
  assert.deepEqual(errors,[]);
  console.log('PASS: route/resume, clear recognition, Tab/Shift+Tab/Enter, format-insensitive grading, feedback, hints, recall, speed gate, exam, practice, canonical guide, desktop/mobile.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});




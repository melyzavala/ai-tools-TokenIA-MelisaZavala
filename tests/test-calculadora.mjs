import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let passed = 0;
const test = async (name, fn) => {
  try { await fn(); passed++; console.log(`OK ${name}`); }
  catch (error) { console.error(`FALLO ${name}: ${error.message}`); process.exitCode = 1; }
};

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
await test('Existe un único script principal', () => assert.ok(scriptMatch));
await test('JavaScript compila sin errores de sintaxis', () => { new Function(scriptMatch[1]); });
await test('Documento declara idioma español', () => assert.match(html, /<html lang="es">/));
await test('Viewport responsive presente', () => assert.match(html, /name="viewport"/));
await test('Reglas responsive para 920, 700 y 580 px', () => {
  for (const width of ['920px','700px','580px']) assert.ok(html.includes(width));
});
await test('Preferencia de movimiento reducido respetada', () => assert.match(html, /prefers-reduced-motion/));
await test('No hay rutas locales absolutas publicables', () => assert.doesNotMatch(html, /(?:[A-Z]:\\|file:\/\/)/i));
await test('Recursos externos usan HTTPS', () => {
  const urls = [...html.matchAll(/https?:\/\/[^'"\s<)]+/g)].map(match => match[0]);
  assert.ok(urls.length > 0); assert.ok(urls.every(url => url.startsWith('https://')));
});
await test('No hay patrones comunes de secretos', () => {
  assert.doesNotMatch(html, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9]{20,}|api[_-]?key\s*[:=]\s*['"][^'"]+/i);
});

const requiredIds = ['project','audience','reportTheme','modelProvider','model','projectFile','projectFolder','projectZip','inputText','outputText','currency','fxRate','volume','budget','downloadReport','comparisonMode','comparisonSort','toggleValueModule','toggleProjectsModule','downloadFullReport'];
await test('Controles esenciales presentes y con identificadores únicos', () => {
  for (const id of requiredIds) assert.equal((html.match(new RegExp(`id="${id}"`,'g')) || []).length, 1, id);
});
await test('Botones principales tienen manejadores', () => {
  for (const id of ['downloadReport','loadFx','reset','addComparisonProject','downloadFullReport','exportCsv','importConfig','exportConfig']) assert.ok(html.includes(`$('${id}').addEventListener`) || html.includes(`state.${id}.addEventListener`), id);
});
await test('Estados accesibles de carga y resultados', () => {
  assert.match(html, /id="projectFileStatus"[^>]*aria-live="polite"/);
  assert.match(html, /id="projectCost"[^>]*aria-live="polite"/);
  assert.match(html, /role="progressbar"[^>]*aria-label="Uso del presupuesto"/);
});
await test('Entradas de archivo declaran formatos compatibles', () => {
  for (const ext of ['.txt','.md','.json','.csv','.html','.xml','.yaml','.yml','.zip']) assert.ok(html.includes(ext), ext);
  assert.match(html, /id="projectFolder"[^>]*webkitdirectory/);
});
await test('API de tipo de cambio tiene tres proveedores y timeout', () => {
  for (const endpoint of ['open.er-api.com','cdn.jsdelivr.net','api.frankfurter.app']) assert.ok(html.includes(endpoint));
  assert.match(html, /AbortController/);
});
await test('Informes contemplan audiencia y tres temáticas', () => {
  for (const key of ['executive','academic','operational']) assert.ok(html.includes(key));
  assert.match(html, /Temática del informe/); assert.match(html, /Selecciona para quién es el informe/);
});
await test('Evaluación de valor es condicional en informes', () => assert.match(html, /const roiReport = roi \?/));
await test('Comparativo incluye Claude y Gemini', () => {
  assert.match(html, /Anthropic · Claude/); assert.match(html, /Google · Gemini/);
});
await test('GitHub Pages no depende de rutas raíz', () => assert.doesNotMatch(html, /(?:src|href)="\/(?!\/)/));

function calculateScenario({inputTokens,outputTokens,inputRate,outputRate,fixed=0,volume=1,exchange=1,budget=0}) {
  const inputCost = inputTokens * inputRate / 1_000_000;
  const outputCost = outputTokens * outputRate / 1_000_000;
  const perCallUsd = inputCost + outputCost + fixed;
  const perCall = perCallUsd * exchange;
  const total = perCall * volume;
  return {inputCost,outputCost,perCallUsd,perCall,total,budgetUsage:budget>0?total/budget*100:null,budgetCapacity:budget>0&&perCall>0?Math.floor(budget/perCall):null};
}
function roiScenario({volume,perCall,periods,implementation,minutes,hourly,automationRate,additional=0}) {
  const laborBenefitPerCall = minutes/60*hourly*(automationRate/100);
  const benefitPerPeriod = volume*laborBenefitPerCall+additional;
  const operatingNet = benefitPerPeriod-volume*perCall;
  const totalCost = implementation+volume*perCall*periods;
  const netBenefit = benefitPerPeriod*periods-totalCost;
  return {laborBenefitPerCall,benefitPerPeriod,operatingNet,totalCost,netBenefit,payback:implementation===0?0:operatingNet>0?implementation/operatingNet:null,breakEvenCalls:implementation===0?0:laborBenefitPerCall-perCall>0?Math.ceil(implementation/(laborBenefitPerCall-perCall)):null};
}
const close = (actual,expected,tolerance=1e-10) => assert.ok(Math.abs(actual-expected)<=tolerance, `${actual} != ${expected}`);
await test('Cálculo manual por millón de tokens', () => {
  const r=calculateScenario({inputTokens:120,outputTokens:350,inputRate:45,outputRate:50,fixed:.001,volume:10_000,exchange:1});
  close(r.inputCost,.0054); close(r.outputCost,.0175); close(r.perCallUsd,.0239); close(r.total,239);
});
await test('Conversión de moneda y volumen', () => {
  const r=calculateScenario({inputTokens:120,outputTokens:350,inputRate:45,outputRate:50,fixed:.001,volume:10_000,exchange:18.4572});
  close(r.total,4411.2708,1e-6);
});
await test('Uso y capacidad presupuestal', () => {
  const r=calculateScenario({inputTokens:100,outputTokens:200,inputRate:2,outputRate:10,volume:10_000,budget:50});
  close(r.perCall,.0022); close(r.total,22); close(r.budgetUsage,44); assert.equal(r.budgetCapacity,22_727);
});
await test('Escenario con tokens de entrada en cero', () => {
  const r=calculateScenario({inputTokens:0,outputTokens:500,inputRate:99,outputRate:4,volume:1000});
  close(r.inputCost,0); close(r.total,2);
});
await test('Crecimiento compuesto', () => {
  assert.deepEqual([0,1,2,3].map(p=>Math.round(10_000*Math.pow(1.15,p))),[10_000,11_500,13_225,15_209]);
});
await test('Evaluación de valor y recuperación', () => {
  const r=roiScenario({volume:10_000,perCall:.000775,periods:12,implementation:500,minutes:3,hourly:180,automationRate:70});
  close(r.laborBenefitPerCall,6.3); close(r.benefitPerPeriod,63_000); close(r.operatingNet,62_992.25); close(r.totalCost,593); close(r.netBenefit,755_407); assert.equal(r.breakEvenCalls,80);
});
await test('Evaluación de valor no recuperable', () => {
  const r=roiScenario({volume:100,perCall:2,periods:12,implementation:500,minutes:0,hourly:180,automationRate:100});
  assert.equal(r.payback,null); assert.equal(r.breakEvenCalls,null);
});

const parserSource = html.match(/function firstValue[\s\S]*?function workMode/)[0].replace(/\n\s*function workMode[\s\S]*$/,'');
const {detectProjectData}=new Function(`${parserSource}; return {detectProjectData};`)();
for (const file of ['proyecto.txt','proyecto.md','proyecto.json','proyecto.csv','proyecto.html','proyecto.xml','proyecto.yaml','proyecto.yml']) {
  await test(`Lectura estructurada de ${file}`, () => {
    const content=fs.readFileSync(path.join(here,'fixtures',file),'utf8');
    const result=detectProjectData(content,file);
    assert.ok(result.title); assert.ok(result.input || result.output);
    if (file !== 'proyecto.txt') { assert.ok(result.input); assert.ok(result.output); }
  });
}
const zipSource = html.match(/const PROJECT_MAX_BYTES[\s\S]*?function applyProjectContent/)[0].replace(/\n\s*function applyProjectContent[\s\S]*$/,'');
const {unzipProject,composeProjectBundle}=new Function(`${zipSource}; return {unzipProject,composeProjectBundle};`)();
await test('Lectura de ZIP con archivos compatibles', async () => {
  const buffer=fs.readFileSync(path.join(here,'fixtures','proyecto.zip'));
  const file=new File([buffer],'proyecto.zip',{type:'application/zip'});
  const entries=await unzipProject(file);
  assert.ok(entries.length>=2);
  const result=detectProjectData(composeProjectBundle(entries,file.name),file.name);
  assert.ok(result.input || result.output);
});
await test('Carpeta sintética contiene input y output compatibles', () => {
  const folder=fs.readdirSync(path.join(here,'fixtures','carpeta-proyecto'));
  assert.deepEqual(folder.sort(),['input.txt','output.txt']);
});

console.log(`\nResultado: ${passed} pruebas aprobadas${process.exitCode ? ' con fallos' : ', 0 fallos'}.`);

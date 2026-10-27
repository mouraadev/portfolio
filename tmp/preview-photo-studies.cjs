const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('C:/Users/Ryan Moura/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const folder = 'C:/Users/Ryan Moura/.codex/visualizations/2026/10/25/01a170f3-ac50-7e10-b54d-a66557ff6ddc';
const fragmentPath = path.join(folder,'portfolio-fotos.html');
(async () => {
 const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try {
   const page = await browser.newPage({viewport:{width:1024,height:900},reducedMotion:'reduce'});
   await page.goto(pathToFileURL(path.resolve('ChatGPT Image Oct 24, 2026, 09_49_56 AM.png')).href);
   const photo = await page.evaluate(async () => {
     const img=document.querySelector('img');await img.decode();
     const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=800;
     canvas.getContext('2d').drawImage(img,0,0,1200,800);
     return canvas.toDataURL('image/jpeg',.87);
   });
   let fragment=fs.readFileSync(fragmentPath,'utf8').replace(/<style id="photo-asset">[\s\S]*?<\/style>\s*/, '');
   fragment='<style id="photo-asset">#ryan-photo-studies {--ryan-photo:url("'+photo+'");}</style>\n'+fragment;
   fs.writeFileSync(fragmentPath,fragment);
   await page.goto('about:blank');
   await page.setContent('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#050507}[hidden]{display:none!important}</style>'+fragment+'</html>');
   const checks=[];
   for(const width of [1024,375,320]) {
     await page.setViewportSize({width,height:1200});
     for(let i=0;i<4;i++) {
       await page.evaluate(n=>{document.querySelectorAll('[data-variant]').forEach((s,j)=>s.hidden=j!==n);},i);
       await page.locator('.portfolio:visible').screenshot({path:path.join(folder,`option-${i+1}-${width}.png`)});
       checks.push(await page.evaluate(()=>({name:document.querySelector('[data-variant]:not([hidden])').dataset.variant,width:innerWidth,scroll:document.documentElement.scrollWidth,photo:getComputedStyle(document.querySelector('[data-variant]:not([hidden]) .pf-photo')).backgroundImage.startsWith('url("data:image/jpeg')})));
     }
   }
   console.log(JSON.stringify({bytes:fs.statSync(fragmentPath).size,checks},null,2));
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});


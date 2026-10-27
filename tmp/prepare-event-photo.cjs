const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/Ryan Moura/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const page=await browser.newPage();
 await page.goto(pathToFileURL(path.resolve('ChatGPT Image Oct 24, 2026, 09_49_56 AM.png')).href);
 fs.mkdirSync('assets',{recursive:true});
 for(const width of [768,1536]){
  const data=await page.evaluate(async width=>{const img=document.querySelector('img');await img.decode();const canvas=document.createElement('canvas');canvas.width=width;canvas.height=width*img.naturalHeight/img.naturalWidth;canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/webp',.86);},width);
  const file=`assets/ryan-devday-${width}.webp`;fs.writeFileSync(file,Buffer.from(data.split(',')[1],'base64'));console.log(file,fs.statSync(file).size);
 }
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});

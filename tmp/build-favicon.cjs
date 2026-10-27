const fs=require('node:fs');
const {chromium}=require('C:/Users/Ryan Moura/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
  const page=await browser.newPage({deviceScaleFactor:1});
  const svg=fs.readFileSync('assets/favicon.svg','utf8');
  const images=[];
  for(const size of [16,32,48]){
   await page.setViewportSize({width:size,height:size});
   await page.setContent('<style>html,body{margin:0;background:transparent}svg{display:block;width:100%;height:100%}</style>'+svg);
   images.push({size,data:await page.screenshot({type:'png',omitBackground:true})});
  }
  const header=Buffer.alloc(6+16*images.length);header.writeUInt16LE(1,2);header.writeUInt16LE(images.length,4);
  let offset=header.length;
  images.forEach(({size,data},i)=>{const at=6+i*16;header[at]=header[at+1]=size;header.writeUInt16LE(1,at+4);header.writeUInt16LE(32,at+6);header.writeUInt32LE(data.length,at+8);header.writeUInt32LE(offset,at+12);offset+=data.length});
  fs.writeFileSync('assets/favicon.ico',Buffer.concat([header,...images.map(i=>i.data)]));
  await page.setViewportSize({width:128,height:128});
  await page.screenshot({path:'tmp/favicon-preview.png',omitBackground:true});
  console.log('assets/favicon.ico: 16, 32, 48px; '+fs.statSync('assets/favicon.ico').size+' bytes');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});

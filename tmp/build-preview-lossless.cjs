const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/Ryan Moura/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1200,height:625},deviceScaleFactor:1.28});
  await page.goto(pathToFileURL(path.resolve('tmp/og-card-v3.html')).href);
  await page.addStyleTag({content:'body,main{height:625px}.copy{top:80px;bottom:70px;left:46px;width:570px}figure{inset:20px 20px 20px 620px}.eyebrow,.stack,.link{display:none}h1{font-size:144px;margin-bottom:42px}.role{font-size:44px;line-height:1.2}img{inset:0;width:100%;height:100%;object-fit:cover;object-position:53% 50%}'});
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
  await page.screenshot({path:'assets/portfolio-preview-linkedin-v3.png'});
  console.log(JSON.stringify({width:1536,height:800,bytes:fs.statSync('assets/portfolio-preview-linkedin-v3.png').size}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});


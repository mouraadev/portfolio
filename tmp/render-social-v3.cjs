const {chromium}=require('C:/Users/Ryan Moura/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1200,height:627},deviceScaleFactor:2});
  await page.goto(pathToFileURL(path.resolve('tmp/og-card-v3.html')).href);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
  await page.screenshot({path:'assets/portfolio-social-v3.png'});
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});

const fs=require('node:fs');
const base=require('node:url').pathToFileURL(require('node:path').resolve('index.html')).href;
const assert=require('node:assert/strict');
const {JSDOM}=require('../.audit-tools/node_modules/jsdom');
const {chromium}=require('C:/Users/Ryan Moura/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const before=new JSDOM(fs.readFileSync('tmp/index-before-event-banner.html','utf8')).window.document;
const after=new JSDOM(fs.readFileSync('index.html','utf8')).window.document;
for(const selector of ['.hero','.about-layout','.signal','script'])assert.equal(after.querySelector(selector).outerHTML,before.querySelector(selector).outerHTML,selector+' preserved');
for(const a of after.querySelectorAll('a[href^="#"]'))assert.ok(after.getElementById(a.hash.slice(1)));
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const page=await browser.newPage({reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));const results=[];
 for(const width of [320,375,768,1024,1440]){
  await page.setViewportSize({width,height:1000});await page.goto(base);
  await page.locator('.event-banner').scrollIntoViewIfNeeded();await page.locator('.event-banner img').evaluate(img=>img.decode());
  const result=await page.evaluate(()=>{const banner=document.querySelector('.event-banner'),img=banner.querySelector('img'),caption=banner.querySelector('.event-caption');const a=banner.getBoundingClientRect(),b=caption.getBoundingClientRect();return{width:innerWidth,scrollWidth:document.documentElement.scrollWidth,imageLoaded:img.complete&&img.naturalWidth>0,captionFits:b.bottom<=a.bottom+1&&b.right<=a.right+1,source:img.currentSrc,bannerHeight:a.height};});
  assert.equal(result.width,result.scrollWidth);assert.ok(result.imageLoaded);assert.ok(result.captionFits);results.push(result);
  await page.locator('.event-banner').screenshot({path:`audit/screenshots/event-banner-${width}.png`});
  if(width===375){await page.locator('#navToggle').click();await page.locator('#navLinks a[href="#about"]').click();assert.equal(new URL(page.url()).hash,'#about');assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'),'false');}
 }
 await page.locator('#about').screenshot({path:'audit/screenshots/event-about-desktop.png'});
 const normal=await browser.newPage({viewport:{width:1440,height:1000}});await normal.goto(base+'#about');await normal.waitForFunction(()=>document.querySelector('.event-banner').classList.contains('visible'));await normal.close();
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:375,height:900}});await nojs.goto(base+'#about');assert.equal(await nojs.locator('.event-banner').evaluate(e=>getComputedStyle(e).opacity),'1');await nojs.close();
 assert.deepEqual(errors,[]);console.log(JSON.stringify({results,errors,preserved:'hero, biography, summary and JavaScript',navigation:'About anchor and mobile menu passed',visibility:'normal motion, reduced motion and no JavaScript passed'},null,2));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});

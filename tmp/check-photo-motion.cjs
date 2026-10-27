const fs=require('node:fs'),assert=require('node:assert/strict');
const {JSDOM}=require('../.audit-tools/node_modules/jsdom');
const {chromium}=require('C:/Users/Ryan Moura/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const url=require('node:url').pathToFileURL(require('node:path').resolve('index.html')).href;
const current=new JSDOM(fs.readFileSync('index.html','utf8')).window.document;
const before=new JSDOM(fs.readFileSync('tmp/index-before-whatsapp.html','utf8')).window.document;
assert.equal(current.querySelector('.hero').outerHTML,before.querySelector('.hero').outerHTML);
assert.equal(current.querySelectorAll('a[href="https://wa.me/5511970371243"]').length,2);
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.locator('.event-stage').scrollIntoViewIfNeeded();await page.locator('.event-banner img').evaluate(e=>e.decode());
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('.event-stage')).opacity==='1');
 const box=await page.locator('.event-banner').boundingBox();await page.mouse.move(box.x+box.width*.8,box.y+box.height*.3);
 await page.waitForFunction(()=>document.querySelector('.event-banner').style.transform.includes('rotateX'));
 await page.waitForTimeout(350);
 const moving=await page.locator('.event-banner').evaluate(e=>({transform:e.style.transform,transition:getComputedStyle(e).transitionProperty,duration:getComputedStyle(e).transitionDuration}));
 assert.match(moving.transition,/border-color/);assert.match(moving.duration,/0.6s/);
 await page.screenshot({path:'audit/screenshots/event-photo-hover.png'});
 await page.mouse.move(box.x+box.width*.2,box.y+box.height*.7);await page.waitForTimeout(300);
 await page.mouse.move(0,0);await page.waitForFunction(()=>document.querySelector('.event-banner').style.transform==='');
 await page.mouse.move(box.x+box.width*.8,box.y+box.height*.3);await page.waitForTimeout(100);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('.event-banner').style.transform==='');
 await page.mouse.move(box.x+box.width*.2,box.y+box.height*.5);await page.waitForTimeout(100);assert.equal(await page.locator('.event-banner').evaluate(e=>e.style.transform),'');
 const widths=[];
 for(const width of [320,375,768,1024,1440]){
  await page.setViewportSize({width,height:1000});await page.goto(url);const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,below:document.querySelector('.event-stage').getBoundingClientRect().top>=document.querySelector('.hero').getBoundingClientRect().bottom}));assert.equal(layout.width,layout.scroll);assert.ok(layout.below);widths.push(width);
  if(width===1440)await page.screenshot({path:'audit/screenshots/restored-hero-with-contact.png'});
  await page.locator('.event-contact-link').click();assert.equal(new URL(page.url()).hash,'#contact');
 }
 await page.goto(url);await page.locator('.event-contact-link').focus();await page.keyboard.press('Enter');assert.equal(new URL(page.url()).hash,'#contact');
 const touch=await browser.newPage({viewport:{width:375,height:812},isMobile:true,hasTouch:true});await touch.goto(url+'#about');await touch.locator('.event-stage').scrollIntoViewIfNeeded();assert.equal(await touch.locator('.event-banner').evaluate(e=>e.style.transform),'');await touch.locator('.event-contact-link').tap();assert.equal(new URL(touch.url()).hash,'#contact');await touch.close();
 const nojs=await browser.newPage({javaScriptEnabled:false});await nojs.goto(url+'#about');assert.equal(await nojs.locator('.event-stage').evaluate(e=>getComputedStyle(e).opacity),'1');await nojs.close();
 assert.deepEqual(errors,[]);console.log(JSON.stringify({widths,moving,errors,checks:'Original hero restored, photo below hero, spring tilt and settling, live reduced-motion reset, touch, keyboard, no-JS, WhatsApp preserved'},null,2));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});

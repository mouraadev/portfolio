const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Ryan Moura/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const url=require('node:url').pathToFileURL(require('node:path').resolve('index.html')).href;
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
const page=await browser.newPage({reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));const result=[];
for(const [width,height] of [[320,740],[375,812],[768,1024],[1024,768],[1440,900]]){
 await page.setViewportSize({width,height});await page.goto(url);await page.locator('.event-banner img').evaluate(e=>e.decode());
 const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,bannerTop:document.querySelector('.event-banner').getBoundingClientRect().top,height:innerHeight}));assert.equal(layout.width,layout.scroll);result.push(layout);
 await page.screenshot({path:`audit/screenshots/hero-event-${width}.png`});
 await page.locator('.event-contact-link').click();assert.equal(new URL(page.url()).hash,'#contact');
 assert.equal(await page.locator('#about a[href="https://wa.me/5511970371243"]').count(),1);assert.equal(await page.locator('#contact a[href="https://wa.me/5511970371243"]').count(),1);
 if(width===375)await page.locator('.contact-panel').screenshot({path:'audit/screenshots/contact-whatsapp-mobile.png'});
}
assert.equal(await page.locator('#capabilities #runtimeCard').count(),1);assert.deepEqual(errors,[]);
await page.goto(url);await page.locator('.event-contact-link').focus();await page.keyboard.press('Enter');assert.equal(new URL(page.url()).hash,'#contact');
console.log(JSON.stringify({result,errors,checks:'Two correct WhatsApp links, photo click and keyboard navigation, diagram in competencies'},null,2));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});

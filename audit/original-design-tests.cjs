const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const { JSDOM } = require('../.audit-tools/node_modules/jsdom');
const { chromium } = require('C:/Users/Ryan Moura/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const original = new JSDOM(fs.readFileSync('index.backup-2026-09-28-before-audit.html','utf8')).window.document;
const finalSource = fs.readFileSync('index.html','utf8');
const current = new JSDOM(finalSource).window.document;
assert.equal(current.querySelector('style').textContent, original.querySelector('style').textContent, 'Original CSS unchanged');
assert.equal(current.querySelector('script').textContent, original.querySelector('script').textContent, 'Original JS unchanged');
assert.deepEqual([...current.querySelectorAll('body *')].map(e=>e.tagName), [...original.querySelectorAll('body *')].map(e=>e.tagName), 'Original layout structure unchanged');
assert.deepEqual([...current.querySelectorAll('h1,h2,h3')].map(e=>e.innerHTML), [...original.querySelectorAll('h1,h2,h3')].map(e=>e.innerHTML), 'Original titles unchanged');
assert.ok(!finalSource.includes('file:///'));
assert.ok(current.querySelector('a[href="mailto:ryandmoura@gmail.com"]'));
for(const link of current.querySelectorAll('a[href^="#"]')) assert.ok(current.getElementById(link.hash.slice(1)));
(async()=>{
  const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  const result = { source:'CSS, JavaScript, structure and titles identical to original backup', widths:[], errors:[] };
  try {
    const page = await browser.newPage({reducedMotion:'reduce'});
    page.on('pageerror',e=>result.errors.push(e.message));
    await page.route('**/favicon.ico',route=>route.fulfill({status:204,body:''}));
    for(const width of [320,375,768,1024,1440]){
      await page.setViewportSize({width,height:1000});
      await page.goto('http://127.0.0.1:8765/');
      const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,name:document.querySelector('h1').getBoundingClientRect().toJSON()}));
      assert.equal(layout.width,layout.scrollWidth);
      assert.ok(layout.name.left>=0 && layout.name.right<=width);
      result.widths.push(width);
      await page.screenshot({path:path.join(__dirname,'screenshots',`original-restored-${width}.png`),fullPage:false});
      if(width===375){
        await page.locator('#navToggle').click();
        assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'),'true');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'),'false');
      }
    }
    await page.locator('#navLinks a[href="#work"]').click();
    assert.equal(new URL(page.url()).hash,'#work');
    await page.getByRole('link',{name:'Voltar ao topo'}).click();
    assert.equal(new URL(page.url()).hash,'#home');
    assert.deepEqual(result.errors,[]);
    console.log(JSON.stringify(result,null,2));
    fs.writeFileSync(path.join(__dirname,'original-design-results.json'),JSON.stringify(result,null,2));
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

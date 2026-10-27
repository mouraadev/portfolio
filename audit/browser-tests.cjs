const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/Ryan Moura/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const output = path.join(__dirname, 'screenshots');
fs.mkdirSync(output, { recursive: true });
const result = { widths: [], navigation: [], accessibility: [], errors: [] };

if (process.argv.includes('--original-design')) {
  require('./original-design-tests.cjs');
} else (async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const base = 'http://127.0.0.1:8765/';
    const beforePage = await context.newPage();
    await beforePage.goto(base + 'index.backup-2026-09-28-before-audit.html');
    await beforePage.screenshot({ path: path.join(output, 'before-desktop.png'), fullPage: true });
    await beforePage.close();
    const page = await context.newPage();
    page.on('pageerror', error => result.errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') result.errors.push(message.text()); });
    await page.goto(base);
    for (const width of [320,375,768,1024,1440]) {
      await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
      await page.goto(base);
      const layout = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        const outside = [...document.querySelectorAll('main *,footer,nav')].filter(el => {
          // Original artwork intentionally extends within overflow-clipped cards.
          if (el.closest('[aria-hidden="true"]')) return false;
          const style = getComputedStyle(el); const rect = el.getBoundingClientRect();
          return style.visibility !== 'hidden' && rect.width > 0 && (rect.left < -1 || rect.right > width + 1);
        }).map(el => ({ tag: el.tagName, class: el.className, text: el.textContent.trim().slice(0,70) }));
        return { width, scrollWidth: document.documentElement.scrollWidth, outside };
      });
      result.widths.push(layout);
      assert.equal(layout.scrollWidth, layout.width, 'Horizontal overflow at ' + width);
      assert.deepEqual(layout.outside, [], 'Outside viewport at ' + width);
      await page.screenshot({ path: path.join(output, `after-${width}.png`), fullPage: true });
      if (width < 600) {
        await page.getByRole('button', { name: 'Abrir navegação' }).click();
        assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Sobre');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'), 'false');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'navToggle');
        await page.getByRole('button', { name: 'Abrir navegação' }).click();
        await page.locator('#navLinks a[href="#work"]').click();
        assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'), 'false');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'work');
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const anchor of ['about','capabilities','work','credentials','contact']) {
      await page.locator(`#navLinks a[href="#${anchor}"]`).click();
      await page.waitForFunction(id => document.querySelector(`#navLinks a[href="#${id}"]`).getAttribute('aria-current') === 'location', anchor);
      assert.equal(await page.evaluate(() => document.activeElement.id), anchor);
      result.navigation.push(anchor);
      await page.screenshot({ path: path.join(output, `section-${anchor}.png`) });
    }
    await page.getByRole('link', { name: 'Voltar ao topo' }).click();
    assert.equal(await page.evaluate(() => location.hash), '#home');
    await page.getByRole('link', { name: 'Ver projeto principal' }).click();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'budget');
    for (const details of await page.locator('details').all()) {
      await details.locator('summary').focus(); await page.keyboard.press('Enter');
      assert.ok(await details.evaluate(el => el.open));
      await page.keyboard.press('Space'); assert.equal(await details.evaluate(el => el.open), false);
    }
    await page.setViewportSize({ width: 320, height: 844 });
    await page.locator('#budget summary').click();
    await page.locator('#budget summary').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(output,'mobile-case-study.png') });
    const caseOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    assert.equal(caseOverflow, false, 'Expanded case on mobile');
    await page.locator('#budget summary').click();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.getByRole('link', { name: 'Ver currículo', exact: true }).first().click();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'curriculo');
    await page.goto(base);
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Pular para o conteúdo');
    await page.keyboard.press('Enter'); assert.equal(await page.evaluate(() => document.activeElement.id), 'main');
    const axePath = path.join(root, '.audit-tools/node_modules/axe-core/axe.min.js');
    if (fs.existsSync(axePath)) {
      await page.addScriptTag({ path: axePath });
      const axe = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] } })).violations);
      result.accessibility = axe.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n=>n.target) }));
      assert.deepEqual(result.accessibility, [], 'Axe violations');
    } else result.accessibility = 'Axe not installed';
    await page.emulateMedia({ reducedMotion: 'reduce', contrast: 'more' });
    assert.equal(await page.locator('html').evaluate(el => getComputedStyle(el).scrollBehavior), 'auto');
    assert.equal(await page.locator('html').evaluate(el => getComputedStyle(el).getPropertyValue('--muted').trim()), '#dedee5');
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name:'prefers-reduced-transparency', value:'reduce' }] });
    assert.equal(await page.locator('.nav').evaluate(el => getComputedStyle(el).backdropFilter), 'none');
    await cdp.send('Emulation.setEmulatedMedia', { features: [] });
    await page.emulateMedia({ reducedMotion: 'no-preference', contrast: 'no-preference' });
    await page.goto(base);
    await page.locator('#runtimeCard').hover();
    await page.waitForFunction(() => document.getElementById('runtimeCard').style.transform.includes('rotateY'));
    assert.ok(await page.locator('.flow-line').first().evaluate(el => getComputedStyle(el).animationName === 'data-flow'));
    await page.evaluate(async () => {
      await Promise.all(document.getAnimations().filter(a => a.effect.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => {})));
    });
    await page.mouse.move(10, 10);
    await page.screenshot({path:path.join(output,'restored-hero.png'), animations:'disabled'});
    await page.locator('#capabilities').scrollIntoViewIfNeeded();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => document.getAnimations().every(a => a.playState !== 'running'));
    assert.equal(await page.locator('#runtimeCard').evaluate(el => el.style.transform), '');
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: {width:375,height:844} });
    const staticPage = await noJs.newPage(); await staticPage.goto(base);
    assert.ok(await staticPage.getByRole('link',{name:'Sobre',exact:true}).isVisible());
    assert.ok(await staticPage.getByRole('heading',{name:'Ryan Moura'}).isVisible());
    await staticPage.screenshot({path:path.join(output,'no-javascript-mobile.png'),fullPage:true});
    await noJs.close();
    const filePage = await context.newPage();
    await filePage.goto('file:///' + path.join(root,'index.html').replaceAll('\\','/'));
    await filePage.getByRole('link',{name:'Ver projeto principal'}).click();
    assert.equal(await filePage.evaluate(() => location.hash),'#budget');
    await filePage.close();
    await page.setViewportSize({ width:1440,height:1000 }); await page.goto(base);
    await page.screenshot({path:path.join(output,'final-hero.png')});
    result.keyboard = 'skip link, menu Tab/Escape, anchor focus, details Enter/Space: passed';
    result.preferences = 'reduced motion, dynamic cancellation, transparency and contrast: passed';
    result.restoredMotion = 'perspective pointer interaction, animated flow, cancellation with reduced motion: passed';
    result.portability = 'file URL and localhost; no-JavaScript mobile: passed';
    assert.deepEqual(result.errors, [], 'Console errors');
  } finally { await browser.close(); fs.writeFileSync(path.join(__dirname,'browser-results.json'),JSON.stringify(result,null,2)); }
  console.log(JSON.stringify(result,null,2));
})().catch(error => { console.error(error); process.exitCode = 1; });

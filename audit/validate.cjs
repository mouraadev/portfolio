const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const { HtmlValidate } = require('../.audit-tools/node_modules/html-validate');
const css = require('../.audit-tools/node_modules/css-tree');
const { JSDOM } = require('../.audit-tools/node_modules/jsdom');

(async () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const validator = new HtmlValidate({ extends: ['html-validate:recommended'], rules: {
    'prefer-native-element': 'off', 'no-inline-style': 'error',
    'long-title': 'off', 'tel-non-breaking': 'off'
  }});
  const validation = await validator.validateString(html, 'index.html');
  console.log(JSON.stringify(validation.results.flatMap(result => result.messages), null, 2));
  assert.equal(validation.valid, true, 'HTML validation');
  const document = new JSDOM(html).window.document;
  const parseErrors = [];
  css.parse(document.querySelector('style').textContent, { onParseError: e => parseErrors.push(e.message) });
  assert.deepEqual(parseErrors, [], 'CSS syntax');
  for (const script of document.querySelectorAll('script')) {
    if (script.type === 'application/ld+json') JSON.parse(script.textContent);
    else new Function(script.textContent);
  }
  const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
  assert.equal(new Set(ids).size, ids.length, 'Unique IDs');
  for (const link of document.querySelectorAll('a[href^="#"]')) {
    assert.ok(document.getElementById(link.getAttribute('href').slice(1)), link.outerHTML);
  }
  assert.equal(document.querySelectorAll('h1').length, 1);
  let previous = 0;
  for (const heading of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
    const level = Number(heading.tagName.slice(1));
    assert.ok(level <= previous + 1, 'Heading hierarchy: ' + heading.textContent);
    previous = level;
  }
  for (const link of document.querySelectorAll('a')) assert.ok((link.textContent.trim() || link.getAttribute('aria-label')), 'Unnamed link');
  for (const link of document.querySelectorAll('a[target="_blank"]')) assert.ok(link.rel.includes('noopener'));
  assert.ok(document.querySelector('a[href="mailto:ryandmoura@gmail.com"]'));
  assert.ok(!/file:\/\/\/|C:\\Users|SEU-EMAIL|saved from url|class="[^"]*\bvisible\b|style="/i.test(html));
  assert.ok(!document.documentElement.hasAttribute('style'));
  assert.ok(!document.querySelector('.nav.scrolled'));
  console.log(JSON.stringify({ html: 'valid', css: 'parsed', javascript: 'parsed', schema: 'valid JSON', anchors: 'all valid', headings: 'valid', bytes: Buffer.byteLength(html), todos: [...new Set(html.match(/TODO_[A-Z_]+/g))] }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });

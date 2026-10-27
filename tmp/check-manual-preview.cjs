const fs = require('node:fs');
const assert = require('node:assert/strict');
const sharp = require('C:/Users/Ryan Moura/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

(async () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert(!/og:|twitter:|image_src|portfolio-preview/.test(html), 'Metadados antigos restantes');
  const paths = [...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map(match => match[1]);
  for (const file of paths) assert(fs.existsSync(file), `Asset ausente: ${file}`);
  for (const file of ['assets/portfolio-preview.webp', 'assets/portfolio-preview-linkedin-v3.png']) {
    assert(!fs.existsSync(file), `Capa antiga restante: ${file}`);
  }
  const original = await sharp('assets/ryan-devday-1536.webp').metadata();
  const edited = await sharp('assets/ryan-devday-linkedin.webp').metadata();
  assert.equal(edited.format, original.format);
  assert.equal(edited.width, original.width);
  assert.equal(edited.height, original.height);
  const generated = await sharp('C:/Users/Ryan Moura/.codex/generated_images/01a17170-cde0-73f3-92f7-d67fd41db12e/exec-a50562fc-861b-4b3b-a13d-02dd6037c33c.png').raw().toBuffer();
  const converted = await sharp('assets/ryan-devday-linkedin.webp').raw().toBuffer();
  assert(generated.equals(converted), 'Conversao alterou os pixels');
  console.log(JSON.stringify({format: edited.format, width: edited.width, height: edited.height, conversion: 'lossless', automaticPreviewMetadata: false, obsoleteCovers: false, validLocalReferences: paths.length}));
})().catch(error => { console.error(error); process.exit(1); });

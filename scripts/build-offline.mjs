/**
 * Folds the built site into one self-contained HTML file.
 *
 * Everything the page reaches for at runtime has to come along: the bundles,
 * the icon sprite, the favicon and all ten wordlists. What is left must make no
 * request at all, so it works from a file:// URL with no network.
 */
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIST = 'dist';
const PUBLIC_DOC = join('public', 'doc');
const OUTPUT = join(DIST, 'bip39-offline.html');

/** `</script` inside inlined code would close the tag early. */
function escapeForInlineScript(code) {
  return code.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
}

function readAsset(htmlPath) {
  return readFileSync(join(DIST, htmlPath.replace(/^\//, '')), 'utf8');
}

function inlineStylesheet(html) {
  return html.replace(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (match, href) => {
    if (!href.startsWith('/assets/')) return match;
    return `<style>${readAsset(href)}</style>`;
  });
}

function inlineModuleScript(html) {
  return html.replace(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g, (match, src) => {
    if (!src.startsWith('/assets/')) return match;
    const code = readAsset(src).replaceAll('/sprite.svg#', '#');
    return `<script type="module">${escapeForInlineScript(code)}</script>`;
  });
}

function inlineSprite(html) {
  const sprite = readFileSync(join('public', 'sprite.svg'), 'utf8')
    .replace(/<\?xml[^>]*\?>/, '')
    .trim();

  return html.replace('<body>', `<body>\n${sprite}\n`).replaceAll('/sprite.svg#', '#');
}

function inlineFavicon(html) {
  const favicon = readFileSync(join('public', 'favicon.svg'), 'utf8');
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(favicon).toString('base64')}`;

  return html.replace('href="/favicon.svg"', `href="${dataUri}"`);
}

function embedWordlists(html) {
  const wordlists = {};

  for (const file of readdirSync(PUBLIC_DOC).sort()) {
    if (!file.endsWith('.txt')) continue;
    wordlists[file.replace(/\.txt$/, '')] = readFileSync(join(PUBLIC_DOC, file), 'utf8').trim();
  }

  const languages = Object.keys(wordlists);
  if (languages.length === 0) {
    throw new Error(`No wordlists found in ${PUBLIC_DOC}`);
  }

  const script = `<script>window.__BIP39_WORDLISTS__=${escapeForInlineScript(JSON.stringify(wordlists))};</script>`;

  return { html: html.replace('</head>', `${script}\n</head>`), languages };
}

/** A copy of the page cannot hand out copies of itself. */
function removeDownloadButton(html) {
  return html.replace(/\s*<a id="download-offline"[\s\S]*?<\/a>/, '');
}

function assertSelfContained(html) {
  // Script and style bodies are code, not markup: a selector built inside the
  // bundle is not a reference the page follows.
  const markup = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');

  const external = [...markup.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map(([, url]) => url)
    .filter(url => !url.startsWith('#') && !url.startsWith('data:') && !url.startsWith('https://'));

  if (external.length > 0) {
    throw new Error(`Offline build still points outside itself: ${[...new Set(external)].join(', ')}`);
  }

  // These are resolved from markup, so no mention of them may survive anywhere.
  // The bundle's own /doc/ fetch is left alone: it is the online fallback, and
  // the embedded wordlists asserted below mean it is never reached.
  for (const path of ['/sprite.svg', '/assets/']) {
    if (html.includes(path)) {
      throw new Error(`Offline build still resolves ${path} at runtime`);
    }
  }
}

function assertWordlistsEmbedded(html, languages) {
  if (!html.includes('__BIP39_WORDLISTS__')) {
    throw new Error('Offline build carries no embedded wordlists');
  }

  for (const language of languages) {
    if (!html.includes(`"${language}"`)) {
      throw new Error(`Offline build is missing the ${language} wordlist`);
    }
  }
}

function build() {
  let html = readFileSync(join(DIST, 'index.html'), 'utf8');

  html = inlineStylesheet(html);
  html = inlineModuleScript(html);
  html = inlineSprite(html);
  html = inlineFavicon(html);
  html = removeDownloadButton(html);

  const embedded = embedWordlists(html);
  html = embedded.html;

  assertSelfContained(html);
  assertWordlistsEmbedded(html, embedded.languages);
  writeFileSync(OUTPUT, html);

  const kb = Math.round(Buffer.byteLength(html) / 1024);
  console.log(`${OUTPUT}  ${kb} kB  (${embedded.languages.length} wordlists embedded)`);
}

build();

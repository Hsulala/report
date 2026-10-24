#!/usr/bin/env node
// 提案自動上線：把「提案製作倉庫」(Hsulala/report) 的 hub/<資料夾>/ 傳到 makarma-hub（R2 檔案＋D1 登記）。
// 規格見 docs/PROPOSAL-PIPELINE.md。這支檔案是單檔、不依賴本倉庫其他程式，會原樣複製到提案倉庫的 tools/deploy-hub.js；
// 修改時兩邊要一起更新（以本檔為準）。
//
// 用法：node deploy-proposals.js [--root .] [--only 資料夾1,資料夾2] [--dry-run] [--base-url https://hub.kulalab.app]
// 環境變數：CLOUDFLARE_API_TOKEN、CLOUDFLARE_ACCOUNT_ID（--dry-run 不需要）、HUB_BASE_URL（選填）
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const BUCKET = 'makarma-proposals';
export const D1_NAME = 'makarma-hub';
export const KEY_RE = /^[a-z0-9][a-z0-9-]{0,48}$/; // 資料夾名稱（提案識別）
export const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/; // 客戶短網址，需與 hub 的規則一致
const META_FIELDS = ['client', 'title', 'date', 'entry', 'slug'];
const MAX_TOTAL_BYTES = 80 * 1024 * 1024;

const TYPES = {
  html: 'text/html; charset=utf-8', htm: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'text/javascript; charset=utf-8',
  mjs: 'text/javascript; charset=utf-8', json: 'application/json; charset=utf-8', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg',
  jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', avif: 'image/avif', ico: 'image/x-icon', woff: 'font/woff', woff2: 'font/woff2',
  ttf: 'font/ttf', otf: 'font/otf', mp4: 'video/mp4', webm: 'video/webm', txt: 'text/plain; charset=utf-8', pdf: 'application/pdf',
};
export const guessType = (path) => TYPES[String(path).split('.').pop().toLowerCase()] ?? 'application/octet-stream';

// 與 hub（src/keyword/proposals.js）相同：只收相對路徑、不含 ..、不含隱藏檔
export function safeSubpath(raw) {
  const path = String(raw ?? '');
  if (!path || path.includes('\0') || path.includes('\\') || path.startsWith('/')) return null;
  const parts = path.split('/');
  if (parts.some((part) => !part || part === '.' || part === '..' || part.startsWith('.'))) return null;
  return parts.join('/');
}

const taipeiToday = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
const isoDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(String(v)) && !Number.isNaN(Date.parse(String(v)));
const quote = (v) => `'${String(v).replace(/'/g, "''")}'`;

// 驗證 meta.json，回傳 { meta, errors }
export function validateMeta(raw) {
  const errors = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { meta: null, errors: ['meta.json 必須是 JSON 物件'] };
  for (const key of Object.keys(raw)) if (!META_FIELDS.includes(key)) errors.push(`meta.json 有不認識的欄位「${key}」（可用：${META_FIELDS.join('、')}）`);
  const text = (v) => (typeof v === 'string' ? v.trim() : '');
  const meta = { client: text(raw.client), title: text(raw.title), date: raw.date === undefined ? taipeiToday() : text(raw.date), entry: raw.entry === undefined ? 'index.html' : text(raw.entry), slug: raw.slug === undefined ? null : text(raw.slug).toLowerCase() };
  if (!meta.client) errors.push('meta.json 缺少 client（關鍵字主控台裡的客戶名稱）');
  if (!meta.title) errors.push('meta.json 缺少 title');
  else if ([...meta.title].length > 80) errors.push('title 最多 80 字');
  if (!isoDate(meta.date)) errors.push('date 格式請用 YYYY-MM-DD');
  if (!safeSubpath(meta.entry) || !/\.html?$/i.test(meta.entry)) errors.push('entry 必須是資料夾內的相對 .html 路徑');
  if (meta.slug !== null && !SLUG_RE.test(meta.slug)) errors.push('slug 只能用小寫英文、數字與連字號（1–40 字，頭尾不可是連字號）');
  return { meta: errors.length ? null : meta, errors };
}

// 讀一個提案資料夾：回傳 { key, meta, files:[{rel, full, size}], errors }
export function readProposalDir(root, key) {
  const dir = join(root, 'hub', key);
  const errors = [];
  if (!KEY_RE.test(key)) errors.push(`資料夾名稱「${key}」只能用小寫英文、數字與連字號（1–49 字）`);
  const metaPath = join(dir, 'meta.json');
  let meta = null;
  if (!existsSync(metaPath)) errors.push('缺少 meta.json');
  else {
    try {
      const checked = validateMeta(JSON.parse(readFileSync(metaPath, 'utf8')));
      meta = checked.meta; errors.push(...checked.errors);
    } catch (error) { errors.push(`meta.json 不是合法的 JSON：${error.message}`); }
  }
  const files = [];
  (function walk(current) {
    for (const name of readdirSync(current)) {
      const full = join(current, name);
      if (statSync(full).isDirectory()) walk(full); else files.push({ full, rel: relative(dir, full).split(sep).join('/'), size: statSync(full).size });
    }
  })(dir);
  const upload = files.filter((file) => file.rel !== 'meta.json'); // meta.json 只給部署程式看，不傳上去
  const bad = upload.filter((file) => !safeSubpath(file.rel));
  if (bad.length) errors.push(`這些檔名不能上傳（隱藏檔、特殊字元或空白路徑）：${bad.map((f) => f.rel).join('、')}`);
  if (meta && !upload.some((file) => file.rel === meta.entry)) errors.push(`資料夾裡找不到入口檔 ${meta.entry}`);
  const total = upload.reduce((sum, file) => sum + file.size, 0);
  if (total > MAX_TOTAL_BYTES) errors.push(`檔案總計 ${Math.round(total / 1048576)} MB，超過 80 MB 上限，請壓縮圖片`);
  return { key, meta, files: upload, errors };
}

export const listKeys = (root) => {
  const dir = join(root, 'hub');
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) => statSync(join(dir, name)).isDirectory()).sort();
};

// 單份提案上線。io = { sql(text) → rows, put(key, fullPath, contentType), del(keys), fetch, baseUrl, log }
// 回傳 { client, proposalId, created, url, verified }
export async function deployOne(item, io) {
  const { key, meta, files } = item;
  const { sql, put, del, log } = io;
  const cols = await sql("SELECT name FROM pragma_table_info('kw_proposals')");
  if (!cols.some((c) => c.name === 'source_key') || !cols.some((c) => c.name === 'manifest')) throw new Error('hub 還沒更新到支援自動上線的版本（缺 kw_proposals.source_key），請先部署 makarma-hub');
  const clientCols = await sql("SELECT name FROM pragma_table_info('kw_clients')");
  if (!clientCols.some((c) => c.name === 'slug')) throw new Error('hub 還沒更新到支援短網址的版本（缺 kw_clients.slug），請先部署 makarma-hub');

  const clients = await sql('SELECT id, name, slug, archived FROM kw_clients');
  const hits = clients.filter((c) => c.id === meta.client || c.name === meta.client);
  if (hits.length !== 1) throw new Error(hits.length ? `有多位客戶叫「${meta.client}」，請改用客戶 id` : `關鍵字主控台找不到客戶「${meta.client}」，請先在後台建立客戶（名稱要完全一致）`);
  const client = hits[0];
  if (client.archived) throw new Error(`客戶「${client.name}」已封存，請先取消封存`);
  if (meta.slug) {
    const taken = clients.find((c) => c.slug === meta.slug && c.id !== client.id);
    if (taken) throw new Error(`短網址「${meta.slug}」已被「${taken.name}」使用`);
  }

  let existing = (await sql(`SELECT id, manifest FROM kw_proposals WHERE client_id = ${quote(client.id)} AND source_key = ${quote(key)}`))[0] ?? null;
  if (!existing) {
    // 手動上傳的舊提案沒有資料夾名稱：同一位客戶底下「標題相同、且只有一份」就認領它，避免變成兩份
    const legacy = await sql(`SELECT id, manifest FROM kw_proposals WHERE client_id = ${quote(client.id)} AND source_key IS NULL AND title = ${quote(meta.title)}`);
    if (legacy.length === 1) {
      existing = legacy[0];
      await sql(`UPDATE kw_proposals SET source_key = ${quote(key)} WHERE id = ${quote(existing.id)}`);
      log(`  認領既有的手動上傳提案（${existing.id}），之後同資料夾重推會覆蓋它`);
    } else {
      const others = await sql(`SELECT id, source_key, title FROM kw_proposals WHERE client_id = ${quote(client.id)}`);
      log(`  該客戶目前的提案：${others.length ? others.map((o) => `${o.id}（資料夾 ${o.source_key ?? '無'}，${o.title}）`).join('、') : '無'}`);
    }
  }
  const twins = existing ? await sql(`SELECT id FROM kw_proposals WHERE client_id = ${quote(client.id)} AND id <> ${quote(existing.id)} AND source_key IS NULL AND title = ${quote(meta.title)}`) : [];
  if (twins.length) log(`  注意：該客戶還有 ${twins.length} 份同標題、沒有資料夾名稱的舊提案（${twins.map((t) => t.id).join('、')}），若是重複請到 hub 後台「提案簡報」刪除舊的那份`);
  const id = existing?.id ?? randomUUID();
  const prefix = `proposals/${client.id}/${id}/`;
  log(`${existing ? '更新' : '新增'}：${client.name}「${meta.title}」（資料夾 ${key}，${files.length} 個檔案）`);
  for (const file of files) await put(`${prefix}${file.rel}`, file.full, guessType(file.rel));

  const manifest = JSON.stringify(files.map((f) => f.rel).sort());
  if (existing) await sql(`UPDATE kw_proposals SET title = ${quote(meta.title)}, proposal_date = ${quote(meta.date)}, entry = ${quote(meta.entry)}, manifest = ${quote(manifest)} WHERE id = ${quote(id)}`);
  else await sql(`INSERT INTO kw_proposals (id, client_id, title, proposal_date, entry, source_key, manifest) VALUES (${quote(id)}, ${quote(client.id)}, ${quote(meta.title)}, ${quote(meta.date)}, ${quote(meta.entry)}, ${quote(key)}, ${quote(manifest)})`);
  if (meta.slug && meta.slug !== client.slug) await sql(`UPDATE kw_clients SET slug = ${quote(meta.slug)} WHERE id = ${quote(client.id)}`);

  // 檔案都已傳完、紀錄也更新了才刪舊檔：中途失敗最多多留幾個舊檔，不會讓客戶看到壞掉的頁面
  if (existing?.manifest) {
    let before = [];
    try { before = JSON.parse(existing.manifest); } catch { /* 舊紀錄壞掉就不清 */ }
    const stale = before.filter((rel) => !files.some((f) => f.rel === rel)).map((rel) => `${prefix}${rel}`);
    if (stale.length) { await del(stale); log(`  已刪除 ${stale.length} 個不再使用的舊檔`); }
  }

  const slug = meta.slug || client.slug;
  const result = { client: client.name, proposalId: id, created: !existing, url: slug ? `${io.baseUrl}/report/${slug}/p/${id}/` : null, verified: 'skipped' };
  if (!slug) { log('  客戶沒有短網址，略過線上驗證（可在 meta.json 設 slug）'); return result; }

  // 部署後驗證：用「指定提案」網址開，不論是不是最新一份都能驗到；有 PIN 的客戶會被轉去輸入頁（302），只能算略過
  const res = await io.fetch(result.url, { redirect: 'manual' });
  if (res.status === 302) { result.verified = 'pin'; log('  客戶有 PIN 保護，線上驗證略過（頁面會導向 PIN 輸入）'); return result; }
  if (res.status !== 200) throw new Error(`線上驗證失敗：${result.url} 回 ${res.status}`);
  const html = await res.text();
  if (!html.trim()) throw new Error(`線上驗證失敗：${result.url} 內容是空的`);
  const assets = [...html.matchAll(/(?:src|href)=["']([^"'#?:]+\.(?:png|jpe?g|gif|svg|webp|avif|css|js|mjs|woff2?|ttf|otf|mp4|webm))["']/gi)].map((m) => m[1]).filter((p) => !p.startsWith('/') && !p.startsWith('//'));
  const missing = [];
  for (const asset of new Set(assets)) {
    const r = await io.fetch(new URL(asset, result.url).toString(), { redirect: 'manual' });
    if (r.status !== 200) missing.push(`${asset}（${r.status}）`);
  }
  if (missing.length) throw new Error(`線上驗證失敗：頁面引用的檔案讀不到：${missing.join('、')}（請用相對路徑，例如 assets/logo.png，不要用 /assets/…）`);
  result.verified = 'ok';
  log(`  線上驗證通過：${result.url}（頁面與 ${new Set(assets).size} 個引用檔案都讀得到）`);
  return result;
}

// ---- 命令列 ----
function wranglerIo(baseUrl) {
  const wrangler = (...args) => execFileSync('npx', ['--yes', 'wrangler@4', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], maxBuffer: 64 * 1024 * 1024 });
  return {
    baseUrl, log: (m) => console.log(m), fetch: (url, init) => fetch(url, init),
    sql: async (text) => JSON.parse(wrangler('d1', 'execute', D1_NAME, '--remote', '--json', '--command', text))[0].results ?? [],
    put: async (key, full, type) => { wrangler('r2', 'object', 'put', `${BUCKET}/${key}`, '--file', full, '--content-type', type, '--remote'); },
    del: async (keys) => { for (const key of keys) wrangler('r2', 'object', 'delete', `${BUCKET}/${key}`, '--remote'); },
  };
}

export async function main(argv, env = process.env) {
  const args = {};
  for (let i = 0; i < argv.length; i++) if (argv[i].startsWith('--')) { const name = argv[i].slice(2); args[name] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; }
  const root = args.root && args.root !== true ? args.root : '.';
  const only = typeof args.only === 'string' ? args.only.split(',').map((s) => s.trim()).filter(Boolean) : null;
  const keys = only ?? listKeys(root);
  if (!keys.length) { console.log('hub/ 底下沒有提案資料夾，沒有事情要做。'); return 0; }
  const items = keys.map((key) => (existsSync(join(root, 'hub', key)) ? readProposalDir(root, key) : { key, meta: null, files: [], errors: ['資料夾不存在（已刪除的提案不會自動下架，請到 hub 後台「提案簡報」刪除）'] }));
  let failed = false;
  for (const item of items) {
    if (item.errors.length) { failed = true; console.error(`✗ hub/${item.key}\n${item.errors.map((e) => `   - ${e}`).join('\n')}`); }
    else console.log(`✓ hub/${item.key}：${item.meta.client}「${item.meta.title}」${item.meta.date}，${item.files.length} 個檔案`);
  }
  if (failed) return 1;
  if (args['dry-run']) { console.log('--dry-run：格式檢查全部通過，沒有上傳。'); return 0; }
  if (!env.CLOUDFLARE_API_TOKEN || !env.CLOUDFLARE_ACCOUNT_ID) { console.error('缺少 CLOUDFLARE_API_TOKEN 或 CLOUDFLARE_ACCOUNT_ID'); return 1; }
  const baseUrl = String(args['base-url'] && args['base-url'] !== true ? args['base-url'] : env.HUB_BASE_URL || 'https://hub.kulalab.app').replace(/\/$/, '');
  const io = wranglerIo(baseUrl);
  const results = [];
  for (const item of items) {
    try { results.push(await deployOne(item, io)); } catch (error) { failed = true; console.error(`✗ hub/${item.key} 上線失敗：${error.message}`); }
  }
  console.log(`\n完成 ${results.length} / ${items.length} 份。`);
  for (const r of results) console.log(` - ${r.client}：${r.url ?? '（無短網址）'}（${r.created ? '新增' : '覆蓋更新'}，驗證：${r.verified}）`);
  return failed ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv.slice(2)).then((code) => process.exit(code));

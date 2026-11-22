// Perks on the public site: "My perks" (opens a supporter's perks with their personal code) and lucky drops on downloads.
// Every holder's perks are published encrypted with a key derived from their own code (PBKDF2 → AES-GCM),
// so the page source never contains a link, key or message in readable form.
import { icon, esc, md, perkKind, accentOf } from './render.js?v=247ed47834';

const D = JSON.parse(document.getElementById('site-data').textContent);
const P = D.perks;
const $ = (s, r = document) => r.querySelector(s);
const enc = s => new TextEncoder().encode(s);
const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const norm = c => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const hex = buf => [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');
const sha = async s => hex(await crypto.subtle.digest('SHA-256', enc(s)));
const CODE_KEYS = [location.host + '.supporterCode', location.host + location.pathname.split('/')[1] + '.supporterCode'];
const savedCode = () => CODE_KEYS.map(k => localStorage.getItem(k)).find(Boolean) || '';
const saveCode = c => CODE_KEYS.forEach(k => localStorage.setItem(k, c));
const forgetCode = () => CODE_KEYS.forEach(k => localStorage.removeItem(k));

// ---------- crypto ----------
async function codeKey(code) {
  const base = await crypto.subtle.importKey('raw', enc(norm(code)), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: enc(`${P.salt}:perks`), iterations: P.iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
}
async function unseal(box, key) { return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(box.iv) }, key, b64(box.ct)))); }
const dropKey = async perkId => crypto.subtle.importKey('raw', await crypto.subtle.digest('SHA-256', enc(`${P.salt}:drop:${perkId}`)), 'AES-GCM', false, ['decrypt']);

// ---------- dialog ----------
const dlg = document.createElement('dialog');
dlg.className = 'app-dlg form-dlg perk-dlg';
dlg.innerHTML = `<button class="dlg-close" type="button" aria-label="Close">${icon('x')}</button><div class="dlg-scroll" id="perkBody"></div>`;
document.body.append(dlg);
const body = $('#perkBody', dlg);
dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('.dlg-close')) dlg.close(); });
const show = html => { body.innerHTML = html; if (!dlg.open) dlg.showModal(); };

// ---------- My perks ----------
async function openVault(code) {
  code = code ?? savedCode();
  if (!code) return askCode();
  show(`<div class="sub perk-wait"><span class="spinner"></span> Opening your perks…</div>`);
  const h = await sha(`${P.salt}:${norm(code)}`);
  const box = P.vault[h];
  const canSubmit = !!D.community?.codes?.includes(h);
  if (!box) {
    if (canSubmit) { saveCode(norm(code)); return show(vaultHTML({ perks: [] }, true)); }
    return askCode('That code doesn’t open any perks yet. Check for typos. If you only just got it, the site can take a minute or two to update.');
  }
  try { const v = await unseal(box, await codeKey(code)); saveCode(norm(code)); show(vaultHTML(v, canSubmit)); }
  catch { askCode('That code didn’t work. Check for typos and try again.'); }
}
function askCode(err) {
  show(`<div class="sub">
    <div class="sub-hero"><span class="comm-ico perk-hero-ico">${icon('gift')}</span><h2 id="perk-title">Open your perks</h2><p>Enter the personal code from your email. It opens everything you’ve unlocked, on any device.</p></div>
    <form class="unlock" id="perkUnlock"><label class="fld"><span>Your code</span><input name="code" placeholder="${esc(P.prefix || 'CAFE')}-XXXX-XXXX-XXXX" autocomplete="off" spellcheck="false" required></label>
      ${err ? `<p class="err">${icon('info')}${esc(err)}</p>` : ''}<button class="btn primary" type="submit">${icon('unlock')}Open</button></form>
    ${P.list.length ? `<p class="perk-fine">Don’t have a code yet? <a href="#perks" data-perks-browse>See the perks you can unlock</a>.</p>` : ''}
  </div>`);
  $('#perkUnlock', body).addEventListener('submit', e => { e.preventDefault(); openVault(e.target.code.value); });
  setTimeout(() => $('#perkUnlock input', body)?.focus(), 50);
}
const BTN = { download: 'Download', early: 'Get early access', discord: 'Join on Discord', vote: 'Cast your vote', beta: 'Join the beta', source: 'Open the repository', assets: 'Download the pack', support: 'Get help', credits: 'See the credits', shoutout: 'Watch', custom: 'Open', secret: 'Open', discount: 'Use it', key: 'Download', wall: 'See the wall' };
function rewardHTML(p, { drop = false } = {}) {
  const [kic, kind] = perkKind(p.type), a = accentOf(p.accent);
  const copy = (v, label) => `<div class="perk-secret"><small>${esc(label)}</small><code>${esc(v)}</code><button type="button" class="btn ghost sm" data-copy-perk="${esc(v)}">${icon('copy')}Copy</button></div>`;
  return `<article class="perk-own" style="--a1:${a.a1};--a2:${a.a2}">
    <div class="perk-top"><span class="perk-ico">${icon(p.icon || kic)}</span><div><b>${esc(p.name)}</b><span class="perk-kind">${esc(kind)}${p.app ? ` · ${esc(p.app)}` : ''}</span></div>${p.until ? `<span class="perk-flag">Until ${esc(p.until)}</span>` : drop ? '' : `<span class="perk-flag ok">${icon('check')}Unlocked</span>`}</div>
    ${p.text ? `<div class="perk-text md">${md(p.text)}</div>` : ''}
    ${p.code ? copy(p.code, p.type === 'discount' ? 'Discount code' : 'Code') : ''}
    ${p.key ? copy(p.key, 'Your licence key') : ''}
    ${p.instructions ? `<p class="perk-note">${icon('info')}<span>${esc(p.instructions)}</span></p>` : ''}
    <div class="perk-acts">${p.url ? `<a class="btn-acc" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.label || BTN[p.type] || 'Open')}${icon('arrow')}</a>` : ''}
      ${p.type === 'submit' ? `<button class="btn-acc" type="button" data-submit>${icon('send')}Submit your app</button>` : ''}
      ${p.type === 'support' && !p.url && D.supportEmail ? `<a class="btn-acc" href="mailto:${esc(D.supportEmail)}?subject=${encodeURIComponent(`[Priority] Help with `)}">${icon('mail')}Email priority support</a>` : ''}
      ${p.type === 'wall' && !p.url ? `<a class="btn-acc" href="#community" data-close-perks>${icon('crown')}See the wall</a>` : ''}</div>
  </article>`;
}
function vaultHTML(v, canSubmit) {
  const hasSubmit = v.perks.some(p => p.type === 'submit');
  return `<div class="sub perk-vault">
    <div class="sub-hero"><span class="comm-ico ok">${icon('unlock')}</span><h2 id="perk-title">${v.name ? `Hi ${esc(v.name)}, here` : 'Here'} ${v.perks.length === 1 ? 'is your perk' : 'are your perks'}</h2><p>${v.perks.length ? 'Thank you for supporting the studio. Your perks stay here: come back with the same code any time.' : 'Your code is valid. You don’t have any perks yet, but it unlocks app submissions.'}</p></div>
    <div class="perk-owned">${v.perks.map(p => rewardHTML(p)).join('')}
      ${canSubmit && !hasSubmit && D.community ? `<article class="perk-own"><div class="perk-top"><span class="perk-ico">${icon('send')}</span><div><b>Submit your app</b><span class="perk-kind">Supporter extra</span></div></div><div class="perk-acts"><button class="btn-acc" type="button" data-submit>${icon('send')}Open the form</button></div></article>` : ''}</div>
    <p class="perk-fine">${icon('lock')} Keep your code private: it opens these perks. <button type="button" class="linkish" data-perks-forget>Forget it on this device</button></p>
  </div>`;
}

// ---------- lucky drops ----------
const today = () => new Date().toISOString().slice(0, 10);
const appOf = el => el.closest('.pcard')?.dataset.id || el.closest('[data-detail]')?.dataset.detail || (document.body.classList.contains('app-page') ? decodeURIComponent((location.pathname.match(/\/apps\/([^/]+)\//) || [])[1] || '') : '');
function roll(appId) {
  for (const d of P.drops[appId] || []) {
    const k = `perkdrop:${d.perk}:${appId}`;
    if (localStorage.getItem(k) === today() || localStorage.getItem(`perkwon:${d.perk}`)) continue; // one try per app per day, one win per perk
    localStorage.setItem(k, today());
    if (d.daily) { const c = JSON.parse(localStorage.getItem('perkdropday') || '{}'); if (c.d !== today()) { c.d = today(); c.n = 0; } if (c.n >= d.daily) continue; c.n++; localStorage.setItem('perkdropday', JSON.stringify(c)); }
    if (Math.random() * 100 < d.chance) { localStorage.setItem(`perkwon:${d.perk}`, today()); return d; }
  }
  return null;
}
function confetti() {
  const c = document.createElement('div'); c.className = 'perk-confetti';
  const colors = ['#8B5CF6', '#38BDF8', '#2DD4BF', '#F59E0B', '#FB7185', '#A3E635'];
  c.innerHTML = Array.from({ length: 80 }, (_, i) => `<i style="left:${Math.random() * 100}%;background:${colors[i % colors.length]};animation-delay:${Math.random() * .5}s;animation-duration:${2 + Math.random() * 1.6}s"></i>`).join('');
  dlg.append(c); setTimeout(() => c.remove(), 4200);
}
async function won(d, appId, link) {
  const app = D.apps.find(a => a.id === appId);
  const go = link ? `<a class="btn ghost" href="${esc(link.href)}"${link.target ? ` target="${esc(link.target)}" rel="noopener"` : ''} data-close-perks>${icon('download')}Continue to ${esc(app?.name || 'the download')}</a>` : '';
  const hero = `<div class="sub-hero perk-win"><span class="comm-ico perk-hero-ico">${icon(d.icon || 'gift')}</span><span class="perk-kicker">${icon('sparkles')}Lucky drop · ${esc(+d.chance >= 1 ? Math.round(d.chance) : d.chance)}% chance</span><h2 id="perk-title">You found <span class="grad-text">${esc(d.name)}</span>!</h2>${d.tagline ? `<p>${esc(d.tagline)}</p>` : ''}</div>`;
  if (d.mode === 'instant' && d.box) {
    let p = null; try { p = await unseal(d.box, await dropKey(d.perk)); } catch {}
    show(`<div class="sub">${hero}${p ? `<div class="perk-owned">${rewardHTML(p, { drop: true })}</div><p class="perk-fine">${icon('info')} Save anything you need now: this drop is shown once.</p>` : ''}<div class="perk-row">${go}</div></div>`);
  } else {
    show(`<div class="sub">${hero}
      <p class="perk-note">${icon('mail')}<span>Claim it by email and we’ll send your personal perk code once we’ve checked it. Claims are limited, so don’t wait.</span></p>
      <form id="perkClaim"><div class="perk-f2"><label class="fld"><span>Your name</span><input name="name" required maxlength="80" autocomplete="name"></label><label class="fld"><span>Email for your code</span><input name="email" type="email" required maxlength="120" autocomplete="email"></label></div>
      <div class="perk-row"><button class="btn primary" type="submit">${icon('gift')}Claim my perk</button>${go}</div></form></div>`);
    $('#perkClaim', body).addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target, claim = { v: 1, perk: d.perk, app: appId, name: f.name.value.trim(), email: f.email.value.trim(), t: hex(crypto.getRandomValues(new Uint8Array(8))), at: new Date().toISOString() };
      const blob = btoa(String.fromCharCode(...enc(JSON.stringify(claim)))).replace(/\+/g, '-').replace(/\//g, '_');
      const text = `Hi! I won the "${d.name}" lucky drop on ${app?.name || appId}.\n\nName: ${claim.name}\nEmail: ${claim.email}\n\nPERK-CLAIM:${blob}\n\n(Please keep the line above: it identifies the claim.)`;
      const to = P.claimEmail || D.supportEmail || '';
      body.innerHTML = `<div class="sub">${hero}<p class="perk-note">${icon('check')}<span>Nearly done: send the claim email that just opened. If nothing opened, copy the claim and email it to <b>${esc(to || 'the studio')}</b>.</span></p>
        <div class="perk-secret"><small>Your claim</small><code class="perk-blob">PERK-CLAIM:${esc(blob)}</code><button type="button" class="btn ghost sm" data-copy-perk="${esc(text)}">${icon('copy')}Copy</button></div><div class="perk-row">${to ? `<a class="btn primary" href="mailto:${esc(to)}?subject=${encodeURIComponent(`Perk claim: ${d.name}`)}&body=${encodeURIComponent(text)}">${icon('mail')}Open the email again</a>` : ''}${go}</div></div>`;
      if (to) location.href = `mailto:${to}?subject=${encodeURIComponent(`Perk claim: ${d.name}`)}&body=${encodeURIComponent(text)}`;
    });
  }
  confetti();
}

// ---------- events ----------
document.addEventListener('click', async e => {
  const t = e.target;
  if (t.closest('[data-perks-open]')) { e.preventDefault(); openVault(); return; }
  if (t.closest('[data-perks-browse]')) { dlg.close(); $('#perks')?.scrollIntoView({ behavior: 'smooth' }); return; }
  if (t.closest('[data-perks-forget]')) { forgetCode(); askCode(); return; }
  if (t.closest('[data-close-perks]') || (t.closest('[data-submit]') && dlg.contains(t))) { dlg.close(); return; }
  const cp = t.closest('[data-copy-perk]');
  if (cp) { try { await navigator.clipboard.writeText(cp.dataset.copyPerk); cp.innerHTML = `${icon('check')}Copied`; setTimeout(() => (cp.innerHTML = `${icon('copy')}Copy`), 1600); } catch {} return; }
  const dl = t.closest('a.btn-acc');
  if (dl && !dl.closest('.perk, .perk-own, .perk-dlg') && Object.keys(P.drops).length) {
    const appId = appOf(dl), d = appId && roll(appId);
    if (d) { e.preventDefault(); e.stopImmediatePropagation(); won(d, appId, { href: dl.href, target: dl.target }); }
  }
}, true);
if (location.hash === '#perks') { setTimeout(() => { $('#perks')?.scrollIntoView(); openVault(); }, 300); }
addEventListener('hashchange', () => { if (location.hash === '#perks') openVault(); });

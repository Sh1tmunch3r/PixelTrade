// The /download/ page buyers land on after paying. It asks the delivery service what this purchase includes and
// shows the files. Nothing secret lives here: the session id in the address is the buyer's own proof of purchase.
const box = document.getElementById('dl');
const W = (box.dataset.worker || '').replace(/\/$/, '');
const SUPPORT = box.dataset.support || '';
const STORE = box.dataset.store || '';
const q = new URLSearchParams(location.search);
const sid = (q.get('session_id') || '').trim();
const demo = q.has('demo');
const ICONS = document.getElementById('dl-icons')?.content;
const I = k => ICONS?.querySelector(`[data-k="${k}"]`)?.innerHTML || '';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const size = n => (n >= 1073741824 ? `${(n / 1073741824).toFixed(2)} GB` : n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : n >= 1024 ? `${Math.round(n / 1024)} KB` : `${n} bytes`);
const day = d => { try { return new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return ''; } };
const ext = n => (String(n).match(/\.([a-z0-9]{1,6})$/i)?.[1] || '').toUpperCase();
const mailto = (subject, body) => `mailto:${SUPPORT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
const help = (what = 'my download', sm = false) => SUPPORT ? `<a class="btn ghost${sm ? ' sm' : ''}" href="${esc(mailto(`Help with ${what}`, `Hi,\n\nI need help with ${what}.\n\nPurchase reference: ${sid || 'none'}\n\n`))}">${I('mail')}Email support</a>` : '';

function view(html) { box.innerHTML = html; box.classList.remove('busy'); }
function waiting(title, text) {
  box.classList.add('busy');
  box.innerHTML = `<div class="dl-state"><span class="dl-spin" aria-hidden="true"></span><h1>${esc(title)}</h1><p>${esc(text)}</p></div>`;
}

const ERR = {
  bad_link: ['This link is incomplete', 'Open the download link from your purchase confirmation email, or copy the whole address again.'],
  not_found: ['We couldn’t find that purchase', 'Check that you copied the whole link. If you just paid, open the link from your confirmation email.'],
  unpaid: ['This checkout wasn’t completed', 'No payment was taken, so there’s nothing to download yet.'],
  refunded: ['This purchase was refunded', 'Downloads switch off when a purchase is refunded.'],
  disputed: ['Downloads are paused', 'This purchase is under dispute with the card issuer.'],
  expired: ['This download link has expired', 'Get in touch and we’ll send you a fresh link.'],
  no_download: ['Nothing to download', 'This purchase doesn’t include a download.'],
  no_file: ['That file has moved', 'Reload this page to see the latest files.'],
  config: ['Downloads are temporarily unavailable', 'Something on our side needs attention. Please try again later or contact us.'],
  files: ['Downloads are temporarily unavailable', 'We couldn’t reach the file storage. Please try again in a few minutes.']
};
function failed(code, message) {
  const [title, text] = ERR[code] || ['Something went wrong', message || 'Please try again in a minute.'];
  view(`<div class="dl-state bad"><span class="dl-ico">${I('alert')}</span><h1>${esc(title)}</h1><p>${esc(message && ERR[code] ? message : text)}</p>
    <div class="dl-ctas"><button type="button" class="btn ghost" data-retry>${I('refresh')}Try again</button>${help()}</div></div>`);
}

function done(o) {
  const files = o.files || [];
  const main = files[0];
  const link = n => `${W}/dl?session_id=${encodeURIComponent(sid)}&file=${encodeURIComponent(n)}`;
  const notes = String(o.release?.notes || '').trim();
  view(`<div class="dl-ok">
    ${o.test ? `<div class="dl-test">${I('alert')}Test purchase: this used Stripe test mode, so no real money moved.</div>` : ''}
    <div class="dl-head"><span class="dl-ico ok">${I('check')}</span><div><small>Thank you for your purchase</small><h1>${esc(o.app?.name || 'Your download')}</h1>
      <p>${[o.release?.name && o.release.name !== o.app?.name && !o.release.name.includes(o.release.tag || '#') ? esc(o.release.name) : '', o.release?.tag ? `<span class="ver-chip">${esc(o.release.tag)}</span>` : '', o.release?.date ? `Released ${esc(day(o.release.date))}` : ''].filter(Boolean).join(' · ')}</p></div></div>
    ${files.length ? `<div class="dl-files">${files.map((f, i) => `<a class="dl-file${i ? '' : ' main'}" href="${esc(link(f.name))}" rel="nofollow noreferrer">
        <span class="dl-ext">${esc(ext(f.name) || 'FILE')}</span><span class="dl-name"><b>${esc(f.name)}</b><small>${esc(size(f.size))}</small></span>
        <span class="btn ${i ? 'ghost' : 'primary'} sm">${I('download')}Download</span></a>`).join('')}</div>`
      : `<div class="dl-empty">${I('clock')}<p>The files for this release are still being uploaded. Check back shortly, or contact us.</p></div>`}
    ${notes ? `<details class="dl-notes"><summary>What’s in this version</summary><div>${esc(notes).replace(/\n/g, '<br>')}</div></details>` : ''}
    <div class="dl-keep">${I('lock')}<div><b>Keep this page’s address.</b> It’s your personal download link${o.expires ? ` and works until ${esc(day(o.expires))}` : ' and keeps working'}. ${o.email ? `We’ll also send it to ${esc(o.email)}.` : ''}</div>
      <button type="button" class="btn ghost sm" data-copy>${I('copy')}Copy link</button></div>
    <div class="dl-meta"><span>Purchased ${esc(day(o.purchased))}</span>${main ? `<span>${files.length} file${files.length > 1 ? 's' : ''}</span>` : ''}${help(o.app?.name || 'my download', true)}</div>
  </div>`);
}

let tries = 0;
async function load() {
  if (demo) return done({ app: { name: `${STORE || 'Studio'} app (preview)` }, release: { tag: 'v1.0.0', date: new Date().toISOString(), notes: 'This is a preview of the page buyers see after paying.\nReal purchases show their own files here.' },
    files: [{ name: 'App-Setup-1.0.0-x64.exe', size: 58720256 }, { name: 'App-1.0.0-portable.zip', size: 61865984 }], email: 'bu•••@example.com', purchased: new Date().toISOString(), test: true });
  if (!W) return failed('config');
  if (!sid) return failed('bad_link');
  waiting(tries ? 'Confirming your payment…' : 'Getting your download…', tries ? 'Stripe is still confirming the payment. This usually takes a few seconds.' : 'Checking your purchase.');
  try {
    const r = await fetch(`${W}/api/order?session_id=${encodeURIComponent(sid)}`, { cache: 'no-store' });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.ok) return done(j);
    if (j.code === 'pending' && tries++ < 40) return setTimeout(load, 3000);
    failed(j.code, j.error);
  } catch {
    if (tries++ < 3) return setTimeout(load, 2000);
    failed('network', 'We couldn’t reach the download service. Check your connection and try again.');
  }
}

box.addEventListener('click', async e => {
  if (e.target.closest('[data-retry]')) { tries = 0; load(); }
  const c = e.target.closest('[data-copy]');
  if (c) { try { await navigator.clipboard.writeText(location.href); c.innerHTML = `${I('check')}Copied`; setTimeout(() => (c.innerHTML = `${I('copy')}Copy link`), 2000); } catch {} }
});
load();

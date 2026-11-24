// Mobile menu, bottom bar and back-to-top for the public site.
// The menu is built from what is live on the page right now: every home-page section that rendered and is visible,
// with live counts. It rebuilds itself whenever the page changes (filters, perks loading, sections appearing), so it never
// lists a section that isn't there. On app pages it lists the home-page sections from the build, plus this page's parts.
import { icon, esc } from './render.js?v=6e9778c12d';

const D = JSON.parse(document.getElementById('site-data').textContent);
const M = D.mobile || {}, BASE = window.SITE_BASE || '', HOME = document.body.classList.contains('home');
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const nav = $('.nav'), btn = $('.menu-btn');
const NAV = new Map((D.nav || []).map(n => [n.id, n]));
const ICON = { featured: 'star', apps: 'grid', videos: 'youtube', embeds: 'link', news: 'megaphone', community: 'crown', perks: 'gift', studio: 'sparkles', support: 'mail' };
const phone = () => matchMedia(`(max-width: ${M.breakpoint || 860}px)`).matches;
const buzz = () => { if (M.haptics !== false) try { navigator.vibrate?.(8); } catch {} };

// ---------- what is on the page ----------
const visible = el => !!el && !el.hidden && el.offsetParent !== null && el.getClientRects().length > 0;
function countOf(id, sec) {
  if (M.counts === false || !sec) return '';
  const n = id === 'apps' ? $$('#all-apps > *', sec).filter(visible).length
    : id === 'videos' ? $$('.vcard, .short', sec).length : id === 'news' ? $$('.feed > *', sec).length
    : id === 'perks' ? $$('.perk', sec).length : id === 'featured' ? $$('.spot-slide', sec).length : 0;
  return n ? String(n) : '';
}
function labelOf(sec) {
  const n = NAV.get(sec.id); if (n) return n.label;
  return (sec.dataset.nav || $('.kicker', sec)?.textContent || $('h2', sec)?.textContent || sec.id).trim().slice(0, 28);
}
function sections() {
  if (HOME) return $$('main > section[id]').filter(s => s.id !== 'top' && !s.classList.contains('hero') && visible(s) && s.offsetHeight > 40)
    .map(s => ({ id: s.id, href: `#${s.id}`, label: labelOf(s), icon: NAV.get(s.id)?.icon || ICON[s.id] || 'chevron', count: countOf(s.id, s) }));
  // app page: the home sections from the build, then this page's own parts
  const home = (D.nav || []).map(n => ({ ...n, href: `${BASE}${n.href}` }));
  const parts = $$('.app-sheet [id], .app-main section[id]').filter(el => visible(el) && /^(screens|features|changelog|faq|download|requirements|reviews|media|about)/i.test(el.id))
    .map(el => ({ id: el.id, href: `#${el.id}`, label: ($('h2, h3', el)?.textContent || el.id).trim().slice(0, 28), icon: 'chevron', count: '' }));
  return [...parts, ...home];
}

// ---------- the drawer ----------
const sheet = document.createElement('aside');
sheet.className = `m-menu m-${M.menu || 'sheet'} m-${M.side || 'right'}`;
sheet.setAttribute('aria-label', 'Menu'); sheet.setAttribute('aria-hidden', 'true'); sheet.id = 'mMenu'; sheet.inert = true;
const scrim = Object.assign(document.createElement('div'), { className: 'm-scrim' });
document.body.append(scrim, sheet);
btn?.setAttribute('aria-controls', 'mMenu'); btn?.setAttribute('aria-expanded', 'false');

let lastKey = '', active = '';
function build(force) {
  const list = sections();
  const key = JSON.stringify(list) + active;
  if (!force && key === lastKey) return;
  lastKey = key;
  const brand = $('.nav .brand')?.cloneNode(true);
  const socials = M.socials !== false ? $('footer.site .socials, .support .socials')?.cloneNode(true) : null;
  const ext = M.external !== false ? $$('.nav-links a[target=_blank]:not([data-donate])').map(a => `<a class="m-ext" href="${esc(a.href)}" target="_blank" rel="noopener">${a.innerHTML}</a>`).join('') : '';
  const dn = D.donate && D.donate.menu !== false && M.donate !== false ? D.donate : null;
  const perks = $('[data-perks-open]'), submit = $('[data-submit]'), search = HOME && $('#q');
  sheet.innerHTML = `<div class="m-head">${brand ? brand.outerHTML : ''}<button type="button" class="m-x" aria-label="Close menu">${icon('x')}</button></div>
    ${M.title ? `<p class="m-title">${esc(M.title)}</p>` : ''}
    ${M.search !== false && search ? `<button type="button" class="m-search" data-m="search">${icon('search')}<span>Search apps and features</span></button>` : ''}
    <nav class="m-list" aria-label="On this page">${list.map(i => `<a href="${esc(i.href)}" data-sec="${esc(i.id)}" class="${active === i.id ? 'on' : ''}"><span class="m-ico">${icon(i.icon)}</span><span class="m-lbl">${esc(i.label)}</span>${i.count ? `<em>${esc(i.count)}</em>` : ''}${icon('chevron', 'i m-chev')}</a>`).join('')}</nav>
    ${perks || submit ? `<div class="m-acts">${perks ? `<button type="button" class="m-act" data-m="perks">${icon('gift')}<span>My perks</span></button>` : ''}${submit ? `<button type="button" class="m-act" data-m="submit">${icon('send')}<span>Submit your app</span></button>` : ''}</div>` : ''}
    ${ext ? `<div class="m-exts">${ext}</div>` : ''}
    <div class="m-foot">${dn ? `<a class="caffeine lg st-${esc(dn.style || 'amber')} m-donate" href="${esc(dn.url)}"${dn.newTab !== false ? ' target="_blank" rel="noopener"' : ''} data-donate>${icon(dn.icon || 'can')}<span>${esc(dn.short || dn.label)}</span></a>${dn.sub ? `<small class="cafe-sub">${esc(dn.sub)}</small>` : ''}` : ''}
      ${socials ? socials.outerHTML : ''}</div>`;
}
let rebuildT = 0;
// only while it's open: a closed menu is rebuilt fresh when it opens
const rebuild = () => { if (!document.body.classList.contains('m-open')) return; clearTimeout(rebuildT); rebuildT = setTimeout(() => build(), 120); };

let lastFocus = null;
function open() {
  build(true); lastFocus = document.activeElement;
  document.body.classList.add('m-open'); sheet.inert = false; sheet.setAttribute('aria-hidden', 'false'); btn?.setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => sheet.classList.add('in')); scrim.classList.add('in');
  setTimeout(() => (sheet.querySelector('.m-list a.on') || sheet.querySelector('.m-list a, .m-x'))?.focus({ preventScroll: true }), 60);
  buzz();
}
function close(restore = true) {
  if (!document.body.classList.contains('m-open')) return;
  sheet.classList.remove('in'); scrim.classList.remove('in'); document.body.classList.remove('m-open');
  sheet.inert = true; sheet.setAttribute('aria-hidden', 'true'); btn?.setAttribute('aria-expanded', 'false');
  if (restore) lastFocus?.focus?.({ preventScroll: true });
}
btn?.addEventListener('click', () => (document.body.classList.contains('m-open') ? close() : open()));
scrim.addEventListener('click', () => close());
addEventListener('keydown', e => {
  if (!document.body.classList.contains('m-open')) return;
  if (e.key === 'Escape') { e.preventDefault(); close(); }
  if (e.key === 'Tab') { const f = $$('a, button, input', sheet).filter(visible); if (!f.length) return; const [a, z] = [f[0], f.at(-1)]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
});
sheet.addEventListener('click', e => {
  if (e.target.closest('.m-x')) return close();
  const m = e.target.closest('[data-m]')?.dataset.m;
  if (m) { close(false); setTimeout(() => { if (m === 'search') { $('#apps')?.scrollIntoView({ behavior: 'smooth' }); setTimeout(() => $('#q')?.focus(), 450); } else $(m === 'perks' ? '[data-perks-open]' : '[data-submit]')?.click(); }, 180); return; }
  if (e.target.closest('a')) { buzz(); close(false); }
});
// swipe the drawer away
let sx = 0, sy = 0;
sheet.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
sheet.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx, dy = Math.abs(e.changedTouches[0].clientY - sy); if (dy < 60 && ((M.side === 'left' && dx < -70) || (M.side !== 'left' && dx > 70))) close(); }, { passive: true });
matchMedia(`(max-width: ${M.breakpoint || 860}px)`).addEventListener('change', e => { if (!e.matches) close(false); });
// the old dropdown markup is still there for no-JS visitors; links in it close it too
$$('.nav-links a').forEach(a => a.addEventListener('click', () => nav?.classList.remove('open')));

// ---------- keeping it live ----------
const main = $('main');
if (main) new MutationObserver(rebuild).observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class', 'style'] });
addEventListener('resize', rebuild, { passive: true });
addEventListener('load', () => build(true));

// which section you're reading: highlighted in the menu, the top links and the bottom bar
if (HOME && M.spy !== false && 'IntersectionObserver' in window) {
  const seen = new Map();
  const io = new IntersectionObserver(es => {
    for (const e of es) seen.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
    const best = [...seen].sort((a, b) => b[1] - a[1])[0];
    const id = best && best[1] > 0 ? best[0] : '';
    if (id === active) return; active = id;
    $$('.nav-links a[href^="#"]').forEach(a => a.classList.toggle('on', a.getAttribute('href') === `#${id}`));
    $$('.m-list a, .m-bar a').forEach(a => a.classList.toggle('on', a.dataset.sec === id));
  }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, .01, .25, .5] });
  const watch = () => $$('main > section[id]').forEach(s => { if (!s._spy) { s._spy = 1; io.observe(s); } });
  watch(); if (main) new MutationObserver(watch).observe(main, { childList: true });
}

// ---------- bottom bar (phones) ----------
if (M.bar) {
  const bar = document.createElement('nav'); bar.className = 'm-bar'; bar.setAttribute('aria-label', 'Quick links');
  document.body.append(bar);
  const drawBar = () => {
    const list = sections().filter(i => i.id !== 'support' && i.id !== 'studio').slice(0, 3);
    bar.innerHTML = `${HOME ? '' : `<a href="${esc(BASE)}" data-sec="home">${icon('home')}<span>Home</span></a>`}${list.map(i => `<a href="${esc(i.href)}" data-sec="${esc(i.id)}" class="${active === i.id ? 'on' : ''}">${icon(i.icon)}<span>${esc(i.label)}</span></a>`).join('')}${HOME && $('#q') && M.search !== false ? `<button type="button" data-m="search">${icon('search')}<span>Search</span></button>` : ''}<button type="button" data-m="menu">${icon('menu')}<span>Menu</span></button>`;
  };
  drawBar(); if (main) new MutationObserver(() => { clearTimeout(bar._t); bar._t = setTimeout(drawBar, 200); }).observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  bar.addEventListener('click', e => {
    const m = e.target.closest('[data-m]')?.dataset.m; buzz();
    if (m === 'menu') open();
    if (m === 'search') { $('#apps')?.scrollIntoView({ behavior: 'smooth' }); setTimeout(() => $('#q')?.focus(), 450); }
  });
  // hides while scrolling down, comes back when scrolling up
  let y0 = scrollY; addEventListener('scroll', () => { const y = scrollY; bar.classList.toggle('away', y > y0 + 4 && y > 300); if (y < y0 - 4) bar.classList.remove('away'); y0 = y; }, { passive: true });
}

// ---------- back to top ----------
if (M.toTop !== false) {
  const up = Object.assign(document.createElement('button'), { type: 'button', className: 'm-top', innerHTML: icon('up'), title: 'Back to top' });
  up.setAttribute('aria-label', 'Back to top'); document.body.append(up);
  addEventListener('scroll', () => up.classList.toggle('in', scrollY > innerHeight * 1.6 && phone()), { passive: true });
  up.addEventListener('click', () => { buzz(); scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); });
}

build(true);

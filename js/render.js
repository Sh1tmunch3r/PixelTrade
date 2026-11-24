// Pylerium Manager: shared catalog vocabulary and renderers (used by the app and by every generated site).
// Used by the local hub (live preview), the site builder (static HTML) and the public site,
// so every card, video and detail view looks identical everywhere. Plain ES module, no dependencies.

export const ACCENTS = {
  studio:  { label: 'Studio Teal',   a1: '#2DD4BF', a2: '#38BDF8' },
  violet:  { label: 'Royal Violet',  a1: '#8B5CF6', a2: '#6366F1' },
  sky:     { label: 'Nebula Sky',    a1: '#38BDF8', a2: '#818CF8' },
  emerald: { label: 'Emerald',       a1: '#10B981', a2: '#2DD4BF' },
  amber:   { label: 'Solar Amber',   a1: '#F59E0B', a2: '#FB7185' },
  ember:   { label: 'Ember & Cyan',  a1: '#F97316', a2: '#22D3EE' },
  rose:    { label: 'Rose Quartz',   a1: '#FB7185', a2: '#A78BFA' },
  crimson: { label: 'Crimson',       a1: '#EF4444', a2: '#F59E0B' },
  lime:    { label: 'Acid Lime',     a1: '#A3E635', a2: '#22D3EE' }
};

// Categories are edited in the hub (Site → Categories). These are only the defaults.
export const DEFAULT_CATEGORIES = [
  { id: 'desktop',   label: 'Desktop',            icon: 'monitor' },
  { id: 'extension', label: 'Browser extensions', icon: 'chrome' },
  { id: 'tv',        label: 'Android TV',         icon: 'tv' },
  { id: 'mods',      label: 'Game mods',          icon: 'gamepad' },
  { id: 'web',       label: 'Web',                icon: 'globe' },
  { id: 'devtools',  label: 'Developer tools',    icon: 'terminal' }
];
let CATS = DEFAULT_CATEGORIES;
export function setCategories(list) { if (Array.isArray(list) && list.length) CATS = list; }
export const categories = () => CATS;
export const categoryOf = id => CATS.find(c => c.id === id) || { id, label: 'Software', icon: 'code' };

export const STATUS = {
  live: { label: 'Available',      short: 'Live' },
  beta: { label: 'Public beta',    short: 'Beta' },
  soon: { label: 'Coming soon',    short: 'Soon' },
  dev:  { label: 'In development', short: 'In dev' }
};

export const SOCIALS = {
  youtube:   { label: 'YouTube',   icon: 'youtube',   match: /youtube\.com|youtu\.be/i },
  github:    { label: 'GitHub',    icon: 'github',    match: /github\.com/i },
  discord:   { label: 'Discord',   icon: 'discord',   match: /discord\.(gg|com)/i },
  x:         { label: 'X',         icon: 'xlogo',     match: /(^|\/\/|\.)(x|twitter)\.com/i },
  tiktok:    { label: 'TikTok',    icon: 'tiktok',    match: /tiktok\.com/i },
  instagram: { label: 'Instagram', icon: 'instagram', match: /instagram\.com/i },
  twitch:    { label: 'Twitch',    icon: 'twitch',    match: /twitch\.tv/i },
  reddit:    { label: 'Reddit',    icon: 'reddit',    match: /reddit\.com/i },
  bluesky:   { label: 'Bluesky',   icon: 'bluesky',   match: /bsky\.(app|social)/i },
  linkedin:  { label: 'LinkedIn',  icon: 'linkedin',  match: /linkedin\.com/i },
  patreon:   { label: 'Patreon',   icon: 'patreon',   match: /patreon\.com/i },
  kofi:      { label: 'Ko-fi',     icon: 'coffee',    match: /ko-fi\.com/i },
  mastodon:  { label: 'Mastodon',  icon: 'mastodon',  match: /mastodon\.|mstdn\.|fosstodon\./i },
  telegram:  { label: 'Telegram',  icon: 'telegram',  match: /(^|\/\/)(t\.me|telegram\.me)\//i },
  devto:     { label: 'DEV',       icon: 'devto',     match: /(^|\/\/)dev\.to\//i },
  itch:      { label: 'itch.io',   icon: 'itch',      match: /itch\.io/i },
  producthunt: { label: 'Product Hunt', icon: 'producthunt', match: /producthunt\.com/i },
  email:     { label: 'Email',     icon: 'mail',      match: /^mailto:/i },
  website:   { label: 'Website',   icon: 'globe',     match: /./ }
};
export function detectSocial(url) {
  for (const [k, v] of Object.entries(SOCIALS)) if (k !== 'website' && v.match.test(url || '')) return k;
  return 'website';
}

const P = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  terminal: '<path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>',
  sparkles: '<path d="M12 3l1.9 5.8L20 10.7l-6.1 1.9L12 18.5l-1.9-5.9L4 10.7l6.1-1.9z"/><path d="M19 3v4M17 5h4M5 17v4M3 19h4"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  package: '<path d="M16.5 9.4 7.5 4.2"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M9.9 4.24A9 9 0 0 1 12 4c6.5 0 10 8 10 8a18 18 0 0 1-2.16 3.19M6.6 6.6A18 18 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="m2 2 20 20"/><path d="M14.1 14.1a3 3 0 1 1-4.2-4.2"/>',
  tv: '<rect x="2" y="7" width="20" height="15" rx="2"/><path d="m17 2-5 5-5-5"/>',
  chrome: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M21.17 8H12M3.95 6.06 8.54 14M10.88 21.94 15.46 14"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  chevleft: '<path d="m15 18-6-6 6-6"/>',
  up: '<path d="m18 15-6-6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  folder: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
  play: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/>',
  playfill: '<path d="M7 4.5v15l13-7.5z" fill="currentColor"/>',
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  video: '<path d="m22 8-6 4 6 4V8z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  unlock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  gamepad: '<rect x="2" y="6" width="20" height="12" rx="6"/><path d="M6 12h4M8 10v4M15 13h.01M18 11h.01"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
  car: '<path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M9.5 17h5M3 12h18"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 8a5 5 0 0 1 0 8M18 5a9 9 0 0 1 0 14"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
  film: '<rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/>',
  phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  puzzle: '<path d="M19.4 14.6a2 2 0 1 0 0-3.2V7a1 1 0 0 0-1-1h-4.4a2 2 0 1 0-3.2 0H6a1 1 0 0 0-1 1v4.4a2 2 0 1 1 0 3.2V19a1 1 0 0 0 1 1h4.4a2 2 0 1 1 3.2 0h4.8a1 1 0 0 0 1-1z"/>',
  crown: '<path d="m2 6 4 10h12l4-10-6 5-4-7-4 7z"/><path d="M6 20h12"/>',
  can: '<path d="M9 2h6"/><path d="M8.5 2 7 4.5V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4.5L15.5 2"/><path d="M7 7h10M7 18.5h10"/><path d="m12.8 9.2-2.3 3.4h3.1l-2.3 3.4"/>',
  tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chart: '<path d="M3 3v18h18"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  store: '<path d="M3 9 4.5 4h15L21 9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 11v9h14v-9"/><path d="M10 20v-5h4v5"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  power: '<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.8 0"/>',
  coffee: '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><path d="M6 2v2M10 2v2M14 2v2"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  palette: '<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2a10 10 0 0 0 0 20c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.04-.23-.29-.38-.63-.38-1.02A1.5 1.5 0 0 1 14.25 17H16a6 6 0 0 0 6-6c0-5-4.5-9-10-9z"/>',
  bot: '<rect x="3" y="8" width="18" height="12" rx="3"/><path d="M12 8V4M8 4h8"/><circle cx="8.5" cy="14" r="1.2"/><circle cx="15.5" cy="14" r="1.2"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  // brand marks (simplified line versions)
  youtube: '<path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
  plug: '<path d="M12 22v-5"/><path d="M9 8V2M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z"/>',
  stripe: '<rect x="2" y="4" width="20" height="16" rx="4"/><path d="M14.5 9.2c-.6-.5-1.5-.8-2.5-.8-1.4 0-2.4.7-2.4 1.7 0 2.4 5 1.4 5 3.9 0 1.1-1.1 1.8-2.6 1.8-1.1 0-2.2-.4-2.9-1"/>',
  cloudflare: '<path d="M17.5 18H6a4 4 0 0 1-.6-7.96A6 6 0 0 1 17 9a4.5 4.5 0 0 1 .5 9z"/><path d="M9 14h7"/>',
  itch: '<path d="M3 9 5 4h14l2 5"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/><path d="M10 15h.01M14 15h.01M11 17.5h2"/>',
  mastodon: '<path d="M21 13.5c-.3 1.6-2.6 3.3-5.3 3.6-1.4.2-2.8.3-4.3.2-2.4-.1-4.3-.6-4.3-.6v.7c.3 2.4 2.3 2.5 4.2 2.6 1.9 0 3.6-.5 3.6-.5l.1 1.7s-1.3.7-3.7.8c-1.3.1-2.9 0-4.8-.5C2.5 20.5 2.3 16.5 2.2 12.5V8.9c0-4.2 2.7-5.4 2.7-5.4C6.3 2.8 8.7 2.5 11.2 2.5h.1c2.5 0 4.9.3 6.3 1 0 0 2.7 1.2 2.7 5.4 0 0 0 3.1-.4 4.6z"/><path d="M8.5 12V8.6c0-1 .7-1.8 1.7-1.8s1.8.8 1.8 1.8V11M12 11V8.6c0-1 .8-1.8 1.8-1.8s1.7.8 1.7 1.8V12"/>',
  telegram: '<path d="M21.5 3.5 2.8 10.7c-.9.4-.9 1.6.1 1.9l4.6 1.4 1.8 5.6c.3.8 1.2 1 1.8.4l2.6-2.5 4.7 3.5c.7.5 1.6.1 1.8-.7L22.9 4.9c.2-.9-.6-1.7-1.4-1.4z"/><path d="m7.5 14 9.5-6.5-6.8 8"/>',
  ollama: '<path d="M8 5.5V3.6c0-.9.8-1.4 1.4-.8l1 1.2M16 5.5V3.6c0-.9-.8-1.4-1.4-.8l-1 1.2"/><path d="M6.5 11.5C6.5 8 9 5.5 12 5.5s5.5 2.5 5.5 6v3.5c1 .8 1.5 2 1.5 3.3 0 1.5-.7 2.7-1.7 3.2H6.7C5.7 21 5 19.8 5 18.3c0-1.3.5-2.5 1.5-3.3z"/><path d="M10 12.5h.01M14 12.5h.01"/><path d="M10.7 15.5c.7.6 1.9.6 2.6 0"/>',
  sparkle: '<path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/><path d="M19 3v4M17 5h4"/>',
  devto: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M6.5 9v6h1.2a1.8 1.8 0 0 0 1.8-1.8v-2.4A1.8 1.8 0 0 0 7.7 9z"/><path d="M14 9h-2.2v6H14M11.8 12h1.6"/><path d="M15.6 9l1.4 6 1.4-6"/>',
  xlogo: '<path d="M4 4h4.5L20 20h-4.5z"/><path d="M20 4l-6.6 7.2M4 20l6.6-7.2"/>',
  discord: '<path d="M8.5 17.5 7.5 19C5 18.5 3.3 17.4 2.5 16.5c0-4.5 1.3-8.5 3-11 1.4-.7 2.8-1 4-1.2l.6 1.3a14 14 0 0 1 3.8 0l.6-1.3c1.2.2 2.6.5 4 1.2 1.7 2.5 3 6.5 3 11-.8.9-2.5 2-5 2.5l-1-1.5"/><path d="M7.5 15.5c3 1.5 6 1.5 9 0"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/>',
  tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 3 2.5 5 5.5 5"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  twitch: '<path d="M4 3h16v11l-4 4h-4l-3 3v-3H5l-1-1z"/><path d="M11 8v4M15 8v4"/>',
  reddit: '<circle cx="12" cy="14" r="7"/><path d="m12 7 1-4 4 1"/><circle cx="18" cy="4" r="1"/><path d="M9 16.5c1.5 1 4.5 1 6 0M9.5 12.5h.01M14.5 12.5h.01"/>',
  bluesky: '<path d="M12 11C10 7 6.5 4 4 4c-1.5 0-2 1-2 2.5S3 12 6 12c-3 1-3 4-1 5.5S10 17 12 13c2 4 5 6 7 4.5s2-4.5-1-5.5c3 0 4-4 4-5.5S21.5 4 20 4c-2.5 0-6 3-8 7z"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  patreon: '<circle cx="15" cy="9.5" r="6.5"/><path d="M3 3v18"/>',
  producthunt: '<circle cx="12" cy="12" r="9.5"/><path d="M10 17V7h3.2a2.9 2.9 0 0 1 0 5.8H10"/>',
  rss: '<path d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14"/><circle cx="6" cy="18" r="1.4"/>'
};

// Glyphs an app or category can use as its icon (subset of the icon set, in picker order).
export const GLYPHS = ['package', 'sparkles', 'monitor', 'tv', 'play', 'home', 'cpu', 'chrome', 'terminal', 'code', 'gamepad', 'car', 'wrench',
  'puzzle', 'layers', 'shield', 'globe', 'mic', 'music', 'film', 'moon', 'zap', 'rocket', 'compass', 'image', 'video', 'phone', 'bot',
  'palette', 'book', 'heart', 'users', 'crown', 'can', 'coffee', 'key', 'megaphone'];

export function icon(name, cls = 'i') {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || P.code}</svg>`;
}

let markN = 0;
export const resetMarks = () => { markN = 0; }; // keeps generated pages byte-identical between builds
export const initialsOf = name => (String(name || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(w => [...w][0]).join('') || 'S').toUpperCase();
// A studio's mark: their uploaded logo, else a monogram of their initials in the house style.
export function monogram(text, cls = 'mark') {
  const n = ++markN, t = esc(String(text).slice(0, 2));
  return `<svg class="${cls}" viewBox="0 0 44 44" fill="none" aria-hidden="true"><defs>` +
    `<linearGradient id="mg${n}a" x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#8B5CF6"/><stop offset=".52" stop-color="#38BDF8"/><stop offset="1" stop-color="#2DD4BF"/></linearGradient>` +
    `<linearGradient id="mg${n}b" x1="10" y1="10" x2="34" y2="34" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#C4B5FD"/><stop offset="1" stop-color="#5EEAD4"/></linearGradient></defs>` +
    `<rect x="2" y="2" width="40" height="40" rx="12" fill="#0F1322" stroke="url(#mg${n}a)" stroke-width="1.75"/>` +
    `<text x="22" y="22.5" text-anchor="middle" dominant-baseline="central" font-family="Inter,Segoe UI,system-ui,sans-serif" font-weight="800" font-size="${t.length > 1 ? 16 : 20}" letter-spacing="-.5" fill="url(#mg${n}b)">${t}</text>` +
    `<circle cx="34" cy="34" r="2.2" fill="#2DD4BF"/></svg>`;
}
export function brandMark(cls = 'mark', brand) {
  if (brand?.logoUrl) return `<img class="${cls}" src="${esc(brand.logoUrl)}" alt="" width="44" height="44">`;
  if (brand?.name) return monogram(initialsOf(brand.name), cls);
  const n = ++markN;
  return `<svg class="${cls}" viewBox="0 0 44 44" fill="none" aria-hidden="true"><defs>` +
    `<linearGradient id="pm${n}a" x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#8B5CF6"/><stop offset=".52" stop-color="#38BDF8"/><stop offset="1" stop-color="#2DD4BF"/></linearGradient>` +
    `<linearGradient id="pm${n}b" x1="12" y1="10" x2="34" y2="34" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#C4B5FD"/><stop offset="1" stop-color="#5EEAD4"/></linearGradient></defs>` +
    `<rect x="2" y="2" width="40" height="40" rx="12" fill="#0F1322" stroke="url(#pm${n}a)" stroke-width="1.75"/>` +
    `<path d="M13 30V14.5C13 13.12 14.12 12 15.5 12H24.5C28.64 12 32 15.36 32 19.5C32 23.64 28.64 27 24.5 27H18.5V30" stroke="url(#pm${n}b)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M18.5 17.5H24C25.38 17.5 26.5 18.62 26.5 20C26.5 21.38 25.38 22.5 24 22.5H18.5V17.5Z" fill="url(#pm${n}a)" fill-opacity=".35"/>` +
    `<circle cx="29.5" cy="30" r="2.2" fill="#2DD4BF"/></svg>`;
}

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const isAbs = u => /^(https?:|mailto:|#|\/)/i.test(u);
const safeUrl = u => (/^(javascript|data|vbscript):/i.test(String(u || '').trim()) ? '' : String(u || '').trim());
// Resolve a catalog link: absolute stays as-is, site-relative ("pagepackage/") gets the page's base prefix.
export function href(u, base = '') { const s = safeUrl(u); return !s ? '' : isAbs(s) ? s : base + s; }
const ext = u => (/^https?:/i.test(u) ? ' target="_blank" rel="noopener"' : '');
export const accentOf = id => ACCENTS[id] || ACCENTS.studio;
export const statusOf = id => STATUS[id] || STATUS.live;

// Image paths in the catalog are relative to the hub's media folder ("pagepackage/cover.png") or absolute URLs.
export function media(path, base) {
  if (!path) return '';
  return /^(https?:|data:|blob:)/i.test(path) ? path : base + path;
}
export function accentStyle(app) { const a = accentOf(app.accent); return `--a1:${a.a1};--a2:${a.a2}`; }

export function appIcon(app, opts = {}, size = '') {
  const inner = app.iconImage ? `<img src="${esc(media(app.iconImage, opts.mediaBase || ''))}" alt="" loading="lazy">` : icon(app.glyph || 'code');
  return `<span class="app-ico${size ? ' ' + size : ''}">${inner}</span>`;
}
function statusPill(app, long) {
  const s = statusOf(app.status);
  return `<span class="spill s-${esc(app.status || 'live')}"><i></i>${esc(long ? s.label : s.short)}</span>`;
}
// "New" for 30 days after it was added, "Updated" for 21 days after a release; a manual badge always wins.
export function badgeOf(app, now = Date.now()) {
  if (app.badge) return app.badge;
  const days = d => (d ? (now - new Date(d + 'T00:00:00')) / 864e5 : 1e9);
  if (days(app.createdAt) <= 30) return 'New';
  if (days(app.updatedAt) <= 21 && app.status !== 'soon' && app.status !== 'dev') return 'Updated';
  return '';
}
function primaryLink(app, base) {
  const raw = app.primaryUrl || app.pageUrl || app.repoUrl;
  if (!safeUrl(raw)) return null;
  return { url: href(raw, base), label: app.primaryLabel || (raw === app.repoUrl ? 'View on GitHub' : 'Learn more'), raw };
}
function byline(app, base) {
  if (!app.community || !app.author?.name) return '';
  const n = esc(app.author.name);
  return `<span class="byline">${icon('users')}by ${app.author.url ? `<a href="${esc(href(app.author.url, base))}"${ext(app.author.url)}>${n}</a>` : n}</span>`;
}

export function coverHTML(app, opts = {}) {
  if (app.cover) { const src = esc(media(app.cover, opts.mediaBase || '')); return `<div class="cover fit"><img class="cv-bg" src="${src}" alt="" aria-hidden="true" loading="lazy"><img class="cv-img" src="${src}" alt="${esc(app.name)} screenshot" loading="lazy"></div>`; }
  return `<div class="cover gen"><span class="gen-grid"></span><span class="gen-glyph">${icon(app.glyph || 'code')}</span><span class="gen-name">${esc(app.name)}</span></div>`;
}

// A showcase card. opts: mediaBase (image prefix), base (link prefix), wide (featured layout), preview (inert, hub editor).
export function cardHTML(app, opts = {}) {
  const base = opts.base || '';
  const cat = categoryOf(app.category);
  const pl = primaryLink(app, base);
  const tags = (app.techStack || []).slice(0, 4);
  const more = (app.techStack || []).length - tags.length;
  const link = opts.preview ? '#' : `${base}apps/${encodeURIComponent(app.id)}/`;
  const badge = badgeOf(app, opts.now);
  return `<article class="pcard${opts.wide ? ' wide' : ''}${app.featured ? ' is-featured' : ''}${app.community ? ' is-community' : ''}" data-id="${esc(app.id)}" data-cat="${esc(app.category)}" data-status="${esc(app.status)}" style="${accentStyle(app)}">
  <a class="pcard-hit" href="${link}" data-app="${esc(app.id)}" aria-label="${esc(app.name)} details"></a>
  <div class="pcard-media">${coverHTML(app, opts)}<div class="pills">${statusPill(app)}${app.community ? `<span class="cpill">${icon('users')}Community</span>` : ''}</div><div class="pills r">${app.paid && app.price ? `<span class="ppill">${icon('tag')}${esc(app.price)}</span>` : ''}${badge ? `<span class="npill">${esc(badge)}</span>` : ''}${app.featured ? `<span class="fpill">${icon('star')}Featured</span>` : ''}</div></div>
  ${opts.wide ? '<div class="pcard-side">' : ''}<div class="pcard-body">
    <div class="pcard-head">${appIcon(app, opts)}<div class="pcard-title"><h3>${esc(app.name || 'Untitled app')}</h3><div class="meta">${icon(cat.icon)}<span>${esc(cat.label)}</span>${app.version ? `<span class="dot">·</span><span class="ver">${esc(app.version)}</span>` : ''}</div></div></div>
    ${byline(app, base)}
    <p class="tagline">${esc(app.tagline)}</p>
    ${opts.wide && app.description ? `<p class="desc">${esc(clip(mdPlain(app.description), 280))}</p>` : ''}
    ${app.metricLabel || app.metricValue ? `<div class="metric"><span>${esc(app.metricLabel)}</span><b>${esc(app.metricValue)}</b></div>` : ''}
    ${tags.length ? `<div class="tags">${tags.map(t => `<span>${esc(t)}</span>`).join('')}${more > 0 ? `<span class="more">+${more}</span>` : ''}</div>` : ''}
  </div>
  <div class="pcard-foot">
    ${pl ? `<a class="btn-acc" href="${esc(pl.url)}"${ext(pl.url)}>${esc(pl.label)}${icon('arrow')}</a>` : `<span class="btn-ghost-static">${esc(statusOf(app.status).label)}</span>`}
    <span class="sp"></span>
    ${app.repoUrl && (!pl || pl.raw !== app.repoUrl) ? `<a class="ibtn" href="${esc(href(app.repoUrl, base))}" target="_blank" rel="noopener" title="Source on GitHub" aria-label="Source on GitHub">${icon('github')}</a>` : ''}
    <a class="details" href="${link}" data-app="${esc(app.id)}">Details${icon('chevron')}</a>
  </div>${opts.wide ? '</div>' : ''}
</article>`;
}

// ---------- YouTube ----------
export function youtubeId(url) {
  const m = String(url || '').match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/|v\/))([\w-]{11})/i);
  return m ? m[1] : (/^[\w-]{11}$/.test(url || '') ? url : '');
}
export const ytThumb = (id, q = 'hqdefault') => `https://i.ytimg.com/vi/${id}/${q}.jpg`;
export function ytEmbedHTML(id, title = 'Video', vertical = false) {
  return `<button type="button" class="yt-lite${vertical ? ' vert' : ''}" data-yt="${esc(id)}" aria-label="Play ${esc(title)}"><img src="${ytThumb(id, vertical ? 'hqdefault' : 'maxresdefault')}" onerror="this.onerror=null;this.src='${ytThumb(id)}'" alt="" loading="lazy"><span class="yt-play">${icon('playfill')}</span></button>`;
}
export function videoCardHTML(v) {
  return `<article class="vcard">${ytEmbedHTML(v.id, v.title)}<div class="vmeta"><h3>${esc(v.title)}</h3><span>${esc(fmtDate((v.published || '').slice(0, 10)))}${v.views >= 100 ? ` · ${esc(fmtViews(v.views))} views` : ''}</span></div></article>`;
}
export function shortCardHTML(v) {
  return `<button type="button" class="scard" data-short="${esc(v.id)}" aria-label="Play ${esc(v.title)}"><img src="${ytThumb(v.id, 'oardefault')}" onerror="this.onerror=null;this.src='${ytThumb(v.id)}'" alt="" loading="lazy"><span class="s-ov"><span class="yt-play sm">${icon('playfill')}</span><b>${esc(cleanTitle(v.title))}</b>${v.views >= 100 ? `<small>${esc(fmtViews(v.views))} views</small>` : ''}</span></button>`;
}
export const cleanTitle = t => String(t || '').replace(/\s#\S+/g, '').trim() || t;
export function fmtViews(n) { n = +n || 0; return n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K' : String(n); }

// ---------- detail view (site dialog, app pages, hub preview) ----------
export function detailHTML(app, opts = {}) {
  const base = opts.base || '';
  const mb = opts.mediaBase || '';
  const cat = categoryOf(app.category);
  const st = statusOf(app.status);
  const shots = [app.cover, ...(app.screenshots || [])].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
  const pl = primaryLink(app, base);
  const yt = youtubeId(app.videoUrl);
  // a video file uploaded with the app's media (mp4/webm) plays right on the page
  const vid = !yt && /\.(mp4|webm)$/i.test(app.videoUrl || '') && !/^https?:/i.test(app.videoUrl) ? app.videoUrl : '';
  const links = [];
  if (pl) links.push(`<a class="btn-acc lg" href="${esc(pl.url)}"${ext(pl.url)}>${esc(pl.label)}${icon('arrow')}</a>`);
  if (app.pageUrl && (!pl || app.pageUrl !== pl.raw)) links.push(`<a class="btn-soft" href="${esc(href(app.pageUrl, base))}"${ext(app.pageUrl)}>${icon('globe')}Product page</a>`);
  if (app.repoUrl && (!pl || app.repoUrl !== pl.raw)) links.push(`<a class="btn-soft" href="${esc(href(app.repoUrl, base))}" target="_blank" rel="noopener">${icon('github')}Source</a>`);
  if (app.docsUrl) links.push(`<a class="btn-soft" href="${esc(href(app.docsUrl, base))}"${ext(app.docsUrl)}>${icon('book')}Docs</a>`);
  if (app.videoUrl && !yt && !vid) links.push(`<a class="btn-soft" href="${esc(href(app.videoUrl, base))}" target="_blank" rel="noopener">${icon('video')}Watch video</a>`);
  if (!opts.preview) links.push(`<button type="button" class="btn-soft share" data-share="${esc(app.id)}">${icon('share')}<span>Share</span></button>`);
  return `<div class="detail" data-detail="${esc(app.id)}" style="${accentStyle(app)}">
  <header class="d-head">${appIcon(app, opts, 'lg')}<div class="d-title"><div class="d-row"><h2 id="dlg-title">${esc(app.name)}</h2>${app.version ? `<span class="ver-chip">${esc(app.version)}</span>` : ''}${statusPill(app, true)}${app.community ? `<span class="cpill">${icon('users')}Community</span>` : ''}</div><p>${esc(app.tagline)}</p>${byline(app, base)}</div></header>
  ${shots.length ? `<div class="d-gallery"><div class="d-stage"><img src="${esc(media(shots[0], mb))}" alt="${esc(app.name)} screenshot"></div>${shots.length > 1 ? `<div class="d-thumbs">${shots.map((s, i) => `<button type="button" class="${i ? '' : 'on'}" data-src="${esc(media(s, mb))}" aria-label="Screenshot ${i + 1}"><img src="${esc(media(s, mb))}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}</div>` : `<div class="d-gallery">${coverHTML(app, opts)}</div>`}
  <div class="d-grid">
    <div class="d-main">
      ${app.description ? `<section><h4>Overview</h4><div class="d-desc md">${md(app.description, base)}</div></section>` : ''}
      ${yt ? `<section><h4>Video</h4><div class="d-video">${ytEmbedHTML(yt, app.name)}</div></section>` : ''}
      ${vid ? `<section><h4>Video</h4><div class="d-video"><video class="d-vid" src="${esc(media(vid, mb))}"${app.cover ? ` poster="${esc(media(app.cover, mb))}"` : ''} controls preload="metadata" playsinline></video></div></section>` : ''}
      ${(app.features || []).length ? `<section><h4>Highlights</h4><ul class="d-feats">${app.features.map(f => `<li>${icon('check')}<span>${esc(f)}</span></li>`).join('')}</ul></section>` : ''}
      ${app.installCommand ? `<section><h4>Get started</h4><div class="cmd"><code>${esc(app.installCommand)}</code><button type="button" class="copy" data-copy="${esc(app.installCommand)}">${icon('copy')}<span>Copy</span></button></div></section>` : ''}
      ${app.embedCode ? `<section><h4>${esc(app.embedTitle || 'More')}</h4><div class="embed-box">${opts.preview ? `<div class="embed-ph">${icon('code')}Custom embed shows here on the website</div>` : app.embedCode}</div></section>` : ''}
    </div>
    <aside class="d-side">
      <dl class="facts">
        <div><dt>Platform</dt><dd>${esc(app.platform || cat.label)}</dd></div>
        <div><dt>Status</dt><dd>${esc(st.label)}</dd></div>
        ${app.price ? `<div><dt>Price</dt><dd>${esc(app.price)}</dd></div>` : ''}
        ${app.version ? `<div><dt>Version</dt><dd>${esc(app.version)}</dd></div>` : ''}
        ${app.requirements ? `<div><dt>Requires</dt><dd>${esc(app.requirements)}</dd></div>` : ''}
        ${app.metricLabel ? `<div><dt>${esc(app.metricLabel)}</dt><dd>${esc(app.metricValue)}</dd></div>` : ''}
        ${app.updatedAt ? `<div><dt>Updated</dt><dd>${esc(fmtDate(app.updatedAt))}</dd></div>` : ''}
      </dl>
      ${(app.techStack || []).length ? `<h4>Built with</h4><div class="tags">${app.techStack.map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
      ${(app.changelog || []).length ? `<h4>Release notes</h4><ol class="log">${app.changelog.map(c => `<li><div><b>${esc(c.ver)}</b><span>${esc(c.date)}</span></div><p>${esc(c.note)}</p></li>`).join('')}</ol>` : ''}
    </aside>
  </div>
  ${links.length ? `<footer class="d-foot">${links.join('')}${app.paid ? `<p class="d-paid">${icon('lock')}<span>Secure checkout by Stripe. Your download is ready the moment you pay, and the link is emailed to you.</span></p>` : ''}</footer>` : ''}
</div>`;
}

export function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  return isNaN(d) ? iso : d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function socialLinksHTML(socials = [], cls = 'socials') {
  if (!socials.length) return '';
  return `<div class="${cls}">${socials.map(s => { const m = SOCIALS[s.type] || SOCIALS.website; return `<a href="${esc(safeUrl(s.url))}"${ext(s.url)} title="${esc(s.label || m.label)}" aria-label="${esc(s.label || m.label)}">${icon(m.icon)}</a>`; }).join('')}</div>`;
}

// Fields that never leave the hub.
export const PRIVATE_FIELDS = ['notes', 'localPath', 'published', 'order', 'submission'];
export function publicApp(app) {
  const o = { ...app };
  for (const k of PRIVATE_FIELDS) delete o[k];
  if (o.author) o.author = { name: o.author.name || '', url: o.author.url || '' };
  // Private repository (detected by auto-sync): no Source button or GitHub link on the public site.
  if (o.repoPrivate) delete o.repoUrl;
  delete o.repoPrivate; delete o.licensed;
  return o;
}

// ---------- Markdown (app descriptions) ----------
// A small, safe renderer: everything is escaped first, links go through safeUrl, and no raw HTML is ever passed on.
// Supports headings, paragraphs (single line breaks kept), **bold**, *italic*, ~~strike~~, `code`, fenced code, links,
// autolinks, images, bullet/numbered/task lists (nested by indent), quotes, rules and tables.
const MD_BLOCK = /^(\s{0,3}#{1,6}\s|\s*```|\s{0,3}>|\s*([-*+]|\d{1,3}[.)])\s+|\s{0,3}([-*_])(\s*\3){2,}\s*$)/;
function mdInline(s, base) {
  const keep = [];
  const put = h => `\u0000${keep.push(h) - 1}\u0000`;
  s = String(s).replace(/`([^`\n]+)`/g, (m, c) => put(`<code>${esc(c)}</code>`));
  s = s.replace(/!\[([^\]\n]*)\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g, (m, alt, u) => { const h = href(u, base); return h && /^(https?:|\/|\.|[\w-]+\/)/i.test(h) ? put(`<img src="${esc(h)}" alt="${esc(alt)}" loading="lazy">`) : esc(alt); });
  s = s.replace(/\[([^\]\n]+)\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g, (m, t, u) => { const h = href(u, base); return h ? put(`<a href="${esc(h)}"${ext(h)}>${mdInline(t, base)}</a>`) : esc(t); });
  s = s.replace(/(^|[\s(])(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])/g, (m, pre, u) => pre + put(`<a href="${esc(u)}"${ext(u)}>${esc(u)}</a>`));
  s = esc(s)
    .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^\w])__(?=\S)([\s\S]*?\S)__(?!\w)/g, '$1<strong>$2</strong>')
    .replace(/(^|[^*\w])\*(?=[^\s*])([^*\n]*?[^\s*])\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/(^|[^\w])_(?=\S)([^_\n]*?\S)_(?!\w)/g, '$1<em>$2</em>')
    .replace(/~~(?=\S)([\s\S]*?\S)~~/g, '<del>$1</del>');
  return s.replace(/\u0000(\d+)\u0000/g, (m, i) => keep[+i]);
}
const mdCells = l => l.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => c.trim().replace(/\\\|/g, '|'));
export function md(src, base = '') {
  const L = String(src || '').replace(/\r\n?/g, '\n').replace(/\t/g, '    ').split('\n');
  const out = [];
  let i = 0;
  const indent = l => l.match(/^ */)[0].length;
  function list(min) {
    const first = L[i].match(/^(\s*)([-*+]|\d{1,3}[.)])\s+/);
    const ordered = /\d/.test(first[2]), start = ordered ? parseInt(first[2], 10) : 1, ind = first[1].length;
    const items = [];
    while (i < L.length) {
      const m = L[i].match(/^(\s*)([-*+]|\d{1,3}[.)])\s+(.*)$/);
      if (!m || m[1].length < min || m[1].length > ind + 1 || /\d/.test(m[2]) !== ordered) break;
      if (m[1].length < ind) break;
      let text = m[3]; i++;
      while (i < L.length && L[i].trim() && !/^\s*([-*+]|\d{1,3}[.)])\s+/.test(L[i]) && !MD_BLOCK.test(L[i]) && indent(L[i]) > ind) text += '\n' + L[i].trim(), i++;
      let sub = '';
      while (i < L.length && /^\s*([-*+]|\d{1,3}[.)])\s+/.test(L[i]) && indent(L[i]) > ind + 1) sub += list(ind + 2);
      const task = text.match(/^\[([ xX])\]\s+(.*)$/s);
      items.push(task ? `<li class="task"><span class="tick${task[1] === ' ' ? '' : ' on'}" aria-hidden="true"></span>${mdInline(task[2], base).replace(/\n/g, '<br>')}${sub}</li>`
        : `<li>${mdInline(text, base).replace(/\n/g, '<br>')}${sub}</li>`);
      while (i < L.length && !L[i].trim() && i + 1 < L.length && /^\s*([-*+]|\d{1,3}[.)])\s+/.test(L[i + 1]) && indent(L[i + 1]) >= ind) i++;
    }
    return ordered ? `<ol${start !== 1 ? ` start="${start}"` : ''}>${items.join('')}</ol>` : `<ul>${items.join('')}</ul>`;
  }
  while (i < L.length) {
    const l = L[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if ((m = l.match(/^\s*```\s*([\w+-]*)/))) {
      const code = []; i++;
      while (i < L.length && !/^\s*```\s*$/.test(L[i])) code.push(L[i++]);
      i++;
      out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`);
      continue;
    }
    if ((m = l.match(/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/))) { const n = Math.min(6, m[1].length + 2); out.push(`<h${n}>${mdInline(m[2], base)}</h${n}>`); i++; continue; }
    if (/^\s{0,3}([-*_])(\s*\1){2,}\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
    if (/^\s{0,3}>/.test(l)) {
      const q = [];
      while (i < L.length && /^\s{0,3}>/.test(L[i])) q.push(L[i++].replace(/^\s{0,3}>\s?/, ''));
      out.push(`<blockquote>${md(q.join('\n'), base)}</blockquote>`);
      continue;
    }
    if (l.includes('|') && i + 1 < L.length && /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(L[i + 1])) {
      const head = mdCells(l), align = mdCells(L[i + 1]).map(c => (/^:-+:$/.test(c) ? 'center' : /-:$/.test(c) ? 'right' : ''));
      i += 2;
      const rows = [];
      while (i < L.length && L[i].includes('|') && L[i].trim()) rows.push(mdCells(L[i++]));
      const cell = (tag, c, k) => `<${tag}${align[k] ? ` style="text-align:${align[k]}"` : ''}>${mdInline(c, base)}</${tag}>`;
      out.push(`<div class="md-table"><table><thead><tr>${head.map((c, k) => cell('th', c, k)).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${head.map((_, k) => cell('td', r[k] || '', k)).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    if (/^\s*([-*+]|\d{1,3}[.)])\s+/.test(l)) { out.push(list(0)); continue; }
    const p = [];
    while (i < L.length && L[i].trim() && !(p.length && MD_BLOCK.test(L[i])) && !(L[i].includes('|') && i + 1 < L.length && /^\s*\|?\s*:?-{2,}/.test(L[i + 1]))) p.push(L[i++].trim());
    if (!p.length) { p.push(L[i++].trim()); }
    out.push(`<p>${p.map(x => mdInline(x, base)).join('<br>')}</p>`);
  }
  return out.join('\n');
}
// Plain text for excerpts, meta descriptions and search snippets.
export function mdPlain(src) {
  return String(src || '').replace(/\r\n?/g, '\n')
    .replace(/```[\s\S]*?(```|$)/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '').replace(/^\s{0,3}>\s?/gm, '').replace(/^\s*([-*+]|\d{1,3}[.)])\s+(\[[ xX]\]\s+)?/gm, '')
    .replace(/^\s*\|?\s*:?-{2,}.*$/gm, '').replace(/\|/g, ' ')
    .replace(/(\*\*|__|~~|`)/g, '').replace(/(^|[\s(])[*_](\S[^*_\n]*?)[*_](?=[\s).,;:!?]|$)/g, '$1$2')
    .replace(/^\s{0,3}([-*_])(\s*\1){2,}\s*$/gm, '')
    .replace(/\s+/g, ' ').trim();
}
export const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s);

// ---------- perks ----------
// [icon, label, what it is]. Shared by the hub's perk maker, the site builder and the site script.
export const PERK_KINDS = {
  submit: ['send', 'App submissions', 'Unlocks the form to submit your own apps to the showcase.'],
  download: ['download', 'Exclusive download', 'A file, build or bonus only perk holders can download.'],
  early: ['zap', 'Early access', 'Get an app or update before everyone else.'],
  discount: ['tag', 'Discount code', 'A code that takes money off something.'],
  discord: ['discord', 'Discord role', 'A private channel or a special role in the community.'],
  secret: ['lock', 'Secret message', 'Hidden text: a story, tips, a thank-you, a puzzle.'],
  key: ['key', 'Licence key', 'A unique key for each holder, from a list you paste in.'],
  wall: ['crown', 'Wall badge', 'A special spot on the supporters wall.'],
  credits: ['film', 'In the credits', 'Their name in an app’s credits or about screen.'],
  vote: ['chart', 'Roadmap vote', 'A say in what gets built next.'],
  beta: ['activity', 'Beta tester', 'Test new builds and report bugs first.'],
  support: ['mail', 'Priority support', 'A faster line to you for help.'],
  shoutout: ['megaphone', 'Shout-out', 'A thank-you in a video, stream or post.'],
  source: ['github', 'Source access', 'Access to a private repository.'],
  assets: ['palette', 'Asset pack', 'Wallpapers, icons, sounds, presets.'],
  custom: ['gift', 'Custom perk', 'Anything you like.']
};
export const perkKind = t => PERK_KINDS[t] || PERK_KINDS.custom;
const perkDate = d => { try { return new Date(d + 'T00:00:00').toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return d; } };
const names = (list, all) => { const n = list.map(a => a.name); return n.length < 2 ? n[0] || '' : `${n.slice(0, -1).join(', ')} ${all ? 'and' : 'or'} ${n.at(-1)}`; };
// How a perk is unlocked, as short lines. money(amount) formats a price in the site currency.
export function perkHowHTML(p, money = v => String(v), base = '') {
  const li = (ic, html) => `<li>${icon(ic)}<span>${html}</span></li>`;
  return (p.how || []).map(h =>
    h.k === 'total' ? li('can', `Support with <b>${esc(money(h.amount))}</b> or more in total`)
    : h.k === 'buy' ? li('card', `Get it on its own for <b>${esc(money(h.price))}</b>`)
    : h.k === 'apps' ? li('store', `Included when you buy ${h.apps.map(a => `<a href="${base}apps/${encodeURIComponent(a.id)}/" data-app="${esc(a.id)}">${esc(a.name)}</a>`).join(h.all ? ' and ' : ' or ')}`)
    : h.k === 'drop' ? li('sparkles', `Lucky drop: ${h.apps.map(a => `<b>${esc(+a.chance >= 1 ? Math.round(a.chance) : a.chance)}%</b> chance when you download <a href="${base}apps/${encodeURIComponent(a.id)}/" data-app="${esc(a.id)}">${esc(a.name)}</a>`).join(', ')}`)
    : li('gift', 'Given by the studio to people who help out')).join('');
}
export function perkCardHTML(p, o = {}) {
  const a = accentOf(p.accent), [, kind] = perkKind(p.type);
  const buy = (p.how || []).find(h => h.k === 'buy');
  const flags = [p.left != null ? (p.left ? `Only ${p.left} left` : 'All claimed') : '', p.endsAt ? `Until ${perkDate(p.endsAt)}` : '', p.days ? `Lasts ${p.days} day${p.days === 1 ? '' : 's'}` : ''].filter(Boolean);
  return `<article class="perk${p.left === 0 ? ' gone' : ''}" data-perk="${esc(p.id)}" style="--a1:${a.a1};--a2:${a.a2}">
  <div class="perk-glow"></div>
  <div class="perk-top"><span class="perk-ico">${icon(p.icon || perkKind(p.type)[0])}</span><span class="perk-kind">${esc(kind)}</span>${flags.length ? `<span class="perk-flag">${esc(flags[0])}</span>` : ''}</div>
  <h3>${esc(p.name)}</h3>${p.tagline ? `<p>${esc(p.tagline)}</p>` : ''}
  <ul class="perk-how">${perkHowHTML(p, o.money, o.base || '')}</ul>
  <div class="perk-foot">${buy && p.left !== 0 ? `<a class="btn-acc" href="${esc(buy.url)}" target="_blank" rel="noopener">${icon('card')}${esc(buy.label || 'Get this perk')}</a>` : ''}<span class="sp"></span>${p.holders ? `<span class="perk-holders">${icon('users')}${p.holders} ${p.holders === 1 ? 'holder' : 'holders'}</span>` : ''}${flags.slice(1).map(f => `<span class="perk-holders">${esc(f)}</span>`).join('')}</div>
</article>`;
}

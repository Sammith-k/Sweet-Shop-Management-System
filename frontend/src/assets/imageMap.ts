// Build a local path from the mithai name, e.g. "Gulab Jamun" -> /mithai/gulab-jamun.jpg
export function getLocalImagePath(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `/mithai/${slug}.jpg`;
}

// Remote backups (used if local is missing)
export function getRemoteImage(name: string): string {
  const n = name.toLowerCase();
  const map: Record<string, string> = {
    'gulab jamun': 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Gulab_jamun_%28homemade%29.jpg',
    jalebi: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Jalebi_-_India_-_2020.jpg',
    rasgulla: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Rasgulla_%28white%29.jpg',
    'kaju katli': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Kaju_katli_-_Indian_Sweets.jpg',
    'besan ladoo': 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Besan_ladoo.jpg',
    barfi: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Kaju_ka_Barfi.jpg',
    rasmalai: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Rasmalai_-_Served_in_a_bowl.jpg',
    'soan papdi': 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Soan_papdi.jpg',
    peda: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Kesar_peda.jpg',
    sandesh: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Sandesh_-_Bengali_sweet.jpg'
  };
  for (const key of Object.keys(map)) if (n.includes(key)) return map[key];
  // Generic fallback (Unsplash)
  return 'https://images.unsplash.com/photo-1606313564200-e75d5e30476e?q=80&w=1080&auto=format&fit=crop';
}

// Final fallback: inline SVG placeholder so you always see something
export function getPlaceholder(name: string) {
  const safe = name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop stop-color="#a855f7" offset="0"/>
        <stop stop-color="#22d3ee" offset="1"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
      font-family="Segoe UI, Roboto, Arial" font-size="48" fill="white">🍬 ${safe}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
export const DEFAULT_AVATARS = [
  {
    id: 'bear',
    nameID: 'Beruang Cuan',
    nameEN: 'Money Bear',
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#FFDDC1" rx="20"/>
  <circle cx="50" cy="55" r="35" fill="#8B5A2B"/>
  <circle cx="25" cy="30" r="15" fill="#8B5A2B"/>
  <circle cx="75" cy="30" r="15" fill="#8B5A2B"/>
  <circle cx="25" cy="30" r="8" fill="#D2B48C"/>
  <circle cx="75" cy="30" r="8" fill="#D2B48C"/>
  <circle cx="50" cy="65" r="18" fill="#D2B48C"/>
  <circle cx="40" cy="50" r="4" fill="#000"/>
  <circle cx="60" cy="50" r="4" fill="#000"/>
  <ellipse cx="50" cy="60" rx="6" ry="4" fill="#000"/>
</svg>
    `)}`
  },
  {
    id: 'cat',
    nameID: 'Kucing Finansial',
    nameEN: 'Financial Cat',
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#C1E1FF" rx="20"/>
  <circle cx="50" cy="55" r="35" fill="#FFA500"/>
  <polygon points="20,50 15,15 45,30" fill="#FFA500"/>
  <polygon points="80,50 85,15 55,30" fill="#FFA500"/>
  <polygon points="25,45 20,25 40,35" fill="#FFDAB9"/>
  <polygon points="75,45 80,25 60,35" fill="#FFDAB9"/>
  <circle cx="35" cy="50" r="4" fill="#000"/>
  <circle cx="65" cy="50" r="4" fill="#000"/>
  <polygon points="47,60 53,60 50,65" fill="#FF69B4"/>
  <line x1="35" y1="60" x2="15" y2="55" stroke="#000" stroke-width="2"/>
  <line x1="35" y1="65" x2="15" y2="65" stroke="#000" stroke-width="2"/>
  <line x1="65" y1="60" x2="85" y2="55" stroke="#000" stroke-width="2"/>
  <line x1="65" y1="65" x2="85" y2="65" stroke="#000" stroke-width="2"/>
  <circle cx="50" cy="85" r="8" fill="#FFD700"/>
  <text x="50" y="88" font-size="8" font-family="sans-serif" text-anchor="middle" fill="#000">$</text>
</svg>
    `)}`
  },
  {
    id: 'owl',
    nameID: 'Burung Hantu Bijak',
    nameEN: 'Wise Owl',
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#C1FFD7" rx="20"/>
  <path d="M 20 50 Q 50 10 80 50 L 80 80 Q 50 95 20 80 Z" fill="#6B4226"/>
  <path d="M 30 55 Q 50 25 70 55 L 70 75 Q 50 85 30 75 Z" fill="#D2B48C"/>
  <circle cx="35" cy="50" r="12" fill="#FFF"/>
  <circle cx="65" cy="50" r="12" fill="#FFF"/>
  <circle cx="35" cy="50" r="5" fill="#000"/>
  <circle cx="65" cy="50" r="5" fill="#000"/>
  <circle cx="37" cy="48" r="2" fill="#FFF"/>
  <circle cx="67" cy="48" r="2" fill="#FFF"/>
  <polygon points="45,60 55,60 50,70" fill="#FFA500"/>
</svg>
    `)}`
  }
];

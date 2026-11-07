/**
 * Procedural "studio" product renders.
 *
 * No stock photography ships with the repo, so every product has two vector renders
 * produced here: a lit studio shot ("photo") and an internal blueprint ("xray").
 * They are rasterised on demand and fed to the liquify / X-ray shader.
 * Swap `productImage()` for real <img> URLs and the shader pipeline keeps working.
 */

const DEFS = `
<linearGradient id="m" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6c727d"/><stop offset=".22" stop-color="#eef1f5"/><stop offset=".5" stop-color="#9aa1ac"/><stop offset=".78" stop-color="#e3e7ec"/><stop offset="1" stop-color="#5d636d"/></linearGradient>
<linearGradient id="w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbfbfc"/><stop offset=".55" stop-color="#d9dde3"/><stop offset="1" stop-color="#aeb4bd"/></linearGradient>
<linearGradient id="d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2c3037"/><stop offset=".5" stop-color="#121418"/><stop offset="1" stop-color="#07080a"/></linearGradient>
<linearGradient id="b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a5a1c"/><stop offset=".25" stop-color="#f7de9c"/><stop offset=".5" stop-color="#c08f34"/><stop offset=".78" stop-color="#f1d28a"/><stop offset="1" stop-color="#6d4e16"/></linearGradient>
<linearGradient id="y" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe066"/><stop offset="1" stop-color="#d49a00"/></linearGradient>
<linearGradient id="gloss" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".45" stop-color="#fff" stop-opacity=".04"/><stop offset=".46" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="bg" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#262a31"/><stop offset=".6" stop-color="#101216"/><stop offset="1" stop-color="#07080a"/></radialGradient>
<radialGradient id="xbg" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="#06222b"/><stop offset="1" stop-color="#03070a"/></radialGradient>
<radialGradient id="warm" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffbe6"/><stop offset=".35" stop-color="#ffd27a"/><stop offset="1" stop-color="#ff9a1f" stop-opacity="0"/></radialGradient>
<linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc766" stop-opacity=".45"/><stop offset="1" stop-color="#ffc766" stop-opacity="0"/></linearGradient>
<radialGradient id="hole" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#2a2d33"/></radialGradient>
<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#3de2ff" stroke-opacity=".07"/></pattern>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="sh" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="26" stdDeviation="22" flood-color="#000" flood-opacity=".65"/></filter>
`

const C = 'stroke="#3de2ff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"'
const CF = 'stroke="#3de2ff" stroke-width="2.5" fill="rgba(61,226,255,.08)" stroke-linejoin="round"'
const A = 'stroke="#ffb44d" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"'
const T = (x, y, s, anchor = 'middle', fill = '#3de2ff') =>
  `<text x="${x}" y="${y}" font-family="IBM Plex Mono, monospace" font-size="15" letter-spacing="2" text-anchor="${anchor}" fill="${fill}" fill-opacity=".85">${s}</text>`

const screw = (x, y, r = 24) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#m)" stroke="#555a63" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${r * 0.68}" fill="none" stroke="#fff" stroke-opacity=".35"/><path d="M${x - r * 0.6} ${y - r * 0.2}L${x + r * 0.6} ${y + r * 0.2}" stroke="#2a2d33" stroke-width="${r * 0.22}" stroke-linecap="round"/>`
const xscrew = (x, y, r = 18) =>
  `<circle cx="${x}" cy="${y}" r="${r}" ${C}/><path d="M${x - r * 0.6} ${y}H${x + r * 0.6}M${x} ${y - r * 0.6}V${y + r * 0.6}" ${C}/>`

/* ---------------------------------- PHOTOS ---------------------------------- */

const photo = {
  'volt-panel-s1': () => `
    <g filter="url(#sh)">
      <rect x="200" y="130" width="400" height="540" rx="42" fill="url(#w)"/>
    </g>
    <rect x="200" y="130" width="400" height="540" rx="42" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>
    <rect x="228" y="158" width="344" height="484" rx="28" fill="#0b0c0f"/>
    <rect x="236" y="166" width="328" height="468" rx="22" fill="url(#d)"/>
    <rect x="236" y="166" width="328" height="468" rx="22" fill="url(#gloss)"/>
    <circle cx="400" cy="372" r="92" fill="none" stroke="#3de2ff" stroke-opacity=".18" stroke-width="2"/>
    <circle cx="400" cy="372" r="78" fill="none" stroke="#3de2ff" stroke-width="5" filter="url(#glow)" stroke-dasharray="360 130" stroke-linecap="round" transform="rotate(-70 400 372)"/>
    <path d="M370 352A38 38 0 1 0 430 352M400 334V376" stroke="#3de2ff" stroke-width="7" fill="none" stroke-linecap="round" filter="url(#glow)"/>
    <g filter="url(#glow)"><circle cx="360" cy="548" r="6" fill="#3de2ff"/></g>
    <circle cx="400" cy="548" r="6" fill="#2a3138"/><circle cx="440" cy="548" r="6" fill="#2a3138"/>
    <text x="400" y="598" font-family="Sora, sans-serif" font-size="14" letter-spacing="8" text-anchor="middle" fill="#7e8794">VOLTRA</text>`,

  'arc-guard-32': () => `
    <rect x="110" y="372" width="580" height="38" fill="url(#m)"/>
    <rect x="110" y="372" width="580" height="38" fill="none" stroke="#000" stroke-opacity=".3"/>
    ${[150, 230, 570, 650].map((x) => `<rect x="${x}" y="384" width="34" height="12" rx="6" fill="#333840"/>`).join('')}
    <g filter="url(#sh)"><rect x="296" y="96" width="208" height="608" rx="20" fill="url(#w)"/></g>
    <rect x="296" y="96" width="208" height="608" rx="20" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="2"/>
    <rect x="312" y="112" width="176" height="86" rx="12" fill="#c9ced6"/>
    <rect x="312" y="602" width="176" height="86" rx="12" fill="#c9ced6"/>
    ${screw(400, 156)}${screw(400, 645)}
    <rect x="326" y="222" width="148" height="356" rx="14" fill="#eceff3" stroke="#b9bfc8"/>
    <text x="400" y="290" font-family="Sora, sans-serif" font-size="54" font-weight="700" text-anchor="middle" fill="#1d2025">C32</text>
    <text x="400" y="322" font-family="IBM Plex Mono, monospace" font-size="14" letter-spacing="3" text-anchor="middle" fill="#5b616b">32A · 230V~ · 10kA</text>
    <rect x="350" y="350" width="100" height="168" rx="12" fill="#101216"/>
    <rect x="362" y="358" width="76" height="86" rx="9" fill="url(#d)" stroke="#444a54"/>
    <rect x="370" y="364" width="60" height="10" rx="5" fill="#fff" opacity=".18"/>
    <text x="400" y="486" font-family="IBM Plex Mono, monospace" font-size="16" font-weight="500" text-anchor="middle" fill="#3de2ff">I</text>
    <rect x="378" y="540" width="44" height="14" rx="3" fill="#d83a3a"/>
    <text x="400" y="572" font-family="Sora, sans-serif" font-size="13" letter-spacing="6" text-anchor="middle" fill="#7a808a">VOLTRA</text>`,

  'pro-grip-plug': () => `
    <g filter="url(#sh)"><circle cx="400" cy="400" r="256" fill="#14161a"/></g>
    <circle cx="400" cy="400" r="256" fill="url(#d)"/>
    <circle cx="400" cy="400" r="244" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>
    <circle cx="400" cy="400" r="214" fill="#0c0d10" stroke="#262a31" stroke-width="3"/>
    <circle cx="400" cy="400" r="214" fill="url(#gloss)"/>
    <rect x="132" y="366" width="66" height="68" rx="12" fill="url(#m)" stroke="#555a63"/>
    <rect x="602" y="366" width="66" height="68" rx="12" fill="url(#m)" stroke="#555a63"/>
    <circle cx="316" cy="400" r="54" fill="#050607"/><circle cx="484" cy="400" r="54" fill="#050607"/>
    <circle cx="316" cy="400" r="38" fill="url(#m)" stroke="#6c727d" stroke-width="2"/>
    <circle cx="484" cy="400" r="38" fill="url(#m)" stroke="#6c727d" stroke-width="2"/>
    <circle cx="316" cy="400" r="14" fill="#2a2d33"/><circle cx="484" cy="400" r="14" fill="#2a2d33"/>
    <text x="400" y="545" font-family="IBM Plex Mono, monospace" font-size="18" letter-spacing="4" text-anchor="middle" fill="#8a919c">16A · 250V~ · IP44</text>
    <text x="400" y="278" font-family="Sora, sans-serif" font-size="20" letter-spacing="10" text-anchor="middle" fill="#6c727d">PRO-GRIP</text>`,

  'aurelle-pendant': () => `
    <path d="M400 -10V210" stroke="#0b0c0e" stroke-width="7"/>
    <rect x="370" y="196" width="60" height="46" rx="8" fill="url(#b)"/>
    <path d="M380 242H420L430 262H370Z" fill="url(#b)"/>
    <polygon points="190,500 610,500 770,790 30,790" fill="url(#cone)"/>
    <g filter="url(#sh)">
      <path d="M160 490C160 320 280 258 400 258C520 258 640 320 640 490Z" fill="url(#b)"/>
    </g>
    <path d="M200 470C210 350 290 292 380 282" stroke="#fff" stroke-opacity=".5" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M590 470C584 380 540 320 470 292" stroke="#000" stroke-opacity=".18" stroke-width="16" fill="none" stroke-linecap="round"/>
    <ellipse cx="400" cy="490" rx="240" ry="38" fill="#b57b1c"/>
    <ellipse cx="400" cy="494" rx="224" ry="28" fill="#ffe6a4"/>
    <circle cx="400" cy="500" r="112" fill="url(#warm)" opacity=".9"/>
    <circle cx="400" cy="498" r="38" fill="#fffdf2" filter="url(#glow)"/>`,

  'quantum-dmm': () => `
    <g filter="url(#sh)"><rect x="205" y="70" width="390" height="660" rx="64" fill="url(#y)"/></g>
    <rect x="205" y="70" width="390" height="660" rx="64" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>
    <rect x="240" y="104" width="320" height="592" rx="42" fill="url(#d)" stroke="#000"/>
    <rect x="266" y="134" width="268" height="148" rx="14" fill="#0b0d10"/>
    <rect x="274" y="142" width="252" height="132" rx="9" fill="#b6c9b0"/>
    <rect x="274" y="142" width="252" height="132" rx="9" fill="url(#gloss)"/>
    <text x="494" y="228" font-family="IBM Plex Mono, monospace" font-size="74" font-weight="500" text-anchor="end" fill="#1b2619">230.4</text>
    <text x="294" y="170" font-family="IBM Plex Mono, monospace" font-size="16" fill="#1b2619">AUTO  V~</text>
    ${Array.from({ length: 24 }, (_, i) => `<rect x="${292 + i * 9}" y="248" width="5" height="${i < 17 ? 14 : 8}" fill="#1b2619" opacity="${i < 17 ? 1 : 0.35}"/>`).join('')}
    <circle cx="400" cy="440" r="118" fill="url(#m)" stroke="#444" stroke-width="3"/>
    <circle cx="400" cy="440" r="94" fill="url(#d)" stroke="#000" stroke-width="2"/>
    ${Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2
      return `<circle cx="${400 + Math.cos(a) * 106}" cy="${440 + Math.sin(a) * 106}" r="4" fill="#1b1d21"/>`
    }).join('')}
    <path d="M400 440L430 392" stroke="#3de2ff" stroke-width="7" stroke-linecap="round" filter="url(#glow)"/>
    <circle cx="400" cy="440" r="18" fill="url(#m)"/>
    ${[280, 340, 400, 460, 520].map((x) => `<rect x="${x - 22}" y="582" width="44" height="22" rx="8" fill="#242830" stroke="#3a3f49"/>`).join('')}
    ${[[320, 654, '#e23b3b'], [400, 654, '#c9ced6'], [480, 654, '#c9ced6']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="26" fill="#050607" stroke="${c}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="10" fill="#1a1c20"/>`).join('')}`,

  'orbit-smart-socket': () => `
    <g filter="url(#sh)"><rect x="180" y="180" width="440" height="440" rx="92" fill="url(#w)"/></g>
    <rect x="180" y="180" width="440" height="440" rx="92" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="2"/>
    <circle cx="400" cy="400" r="162" fill="#e4e7ec" stroke="#b6bcc5" stroke-width="3"/>
    <circle cx="400" cy="400" r="162" fill="url(#gloss)"/>
    <rect x="232" y="378" width="38" height="44" rx="8" fill="url(#m)" stroke="#6c727d"/>
    <rect x="530" y="378" width="38" height="44" rx="8" fill="url(#m)" stroke="#6c727d"/>
    <circle cx="340" cy="400" r="30" fill="url(#hole)" stroke="#9aa1ac" stroke-width="3"/>
    <circle cx="460" cy="400" r="30" fill="url(#hole)" stroke="#9aa1ac" stroke-width="3"/>
    <path d="M232 520A190 190 0 0 0 568 520" stroke="#3de2ff" stroke-width="9" fill="none" stroke-linecap="round" filter="url(#glow)" transform="translate(0 -22)"/>
    <text x="400" y="560" font-family="Sora, sans-serif" font-size="15" letter-spacing="9" text-anchor="middle" fill="#6c727d">ORBIT</text>`,
}

/* ----------------------------------- XRAYS ----------------------------------- */

const xray = {
  'volt-panel-s1': () => `
    <rect x="200" y="130" width="400" height="540" rx="42" ${C} stroke-opacity=".35"/>
    <rect x="240" y="170" width="320" height="460" rx="18" ${CF}/>
    <rect x="280" y="236" width="110" height="84" rx="6" ${A}/>
    <path d="M296 300q10-26 20 0t20 0t20 0t20 0" ${A}/>
    ${T(335, 350, 'K1 RELAY', 'middle', '#ffb44d')}
    <rect x="428" y="238" width="96" height="96" rx="8" ${CF}/>
    ${Array.from({ length: 6 }, (_, i) => `<path d="M${428 + i * 16 + 8} 238v-16M${428 + i * 16 + 8} 334v16M428 ${238 + i * 16 + 8}h-16M524 ${238 + i * 16 + 8}h16" ${C}/>`).join('')}
    ${T(476, 292, 'SoC')}
    <circle cx="300" cy="420" r="26" ${C}/><circle cx="300" cy="420" r="12" ${C}/>
    <circle cx="372" cy="430" r="20" ${C}/><circle cx="372" cy="430" r="8" ${C}/>
    <path d="M280 480h130M410 480v40h130M300 400V330M372 410V320M476 334v60h60" ${C} stroke-opacity=".6"/>
    <g ${A}><path d="M430 470a50 50 0 0 1 100 0" /><path d="M444 470a36 36 0 0 1 72 0"/><path d="M458 470a22 22 0 0 1 44 0"/><circle cx="480" cy="470" r="4"/></g>
    ${T(480, 506, 'ANT', 'middle', '#ffb44d')}
    ${xscrew(320, 190)}${xscrew(480, 190)}${xscrew(320, 610)}${xscrew(480, 610)}
    <path d="M250 560h300" ${C} stroke-opacity=".5" stroke-dasharray="6 8"/>
    ${T(400, 590, 'ZERO-CROSS DRIVER')}`,

  'arc-guard-32': () => `
    <rect x="296" y="96" width="208" height="608" rx="20" ${C} stroke-opacity=".4"/>
    <rect x="312" y="112" width="176" height="86" rx="12" ${C} stroke-opacity=".5"/>
    <rect x="312" y="602" width="176" height="86" rx="12" ${C} stroke-opacity=".5"/>
    ${xscrew(400, 156, 24)}${xscrew(400, 645, 24)}
    <path d="M400 182V250" ${A} stroke-width="6"/>
    <g ${A}>${Array.from({ length: 9 }, (_, i) => `<ellipse cx="400" cy="${264 + i * 12}" rx="46" ry="9"/>`).join('')}</g>
    ${T(470, 300, 'COIL', 'start', '#ffb44d')}
    <path d="M400 372C440 372 440 430 400 430" ${A} stroke-width="5"/>
    <path d="M360 372h80" ${C} stroke-width="4"/>
    ${T(470, 410, 'BIMETAL', 'start', '#ffb44d')}
    <g ${C}>${Array.from({ length: 10 }, (_, i) => `<path d="M346 ${452 + i * 11}h108"/>`).join('')}</g>
    ${T(470, 500, 'ARC CHUTE', 'start')}
    <path d="M400 560v60" ${A} stroke-width="6"/>
    <path d="M372 540q14-14 28 0t28 0" ${A}/>
    <rect x="352" y="352" width="96" height="30" rx="8" ${C} stroke-opacity=".6" transform="rotate(-18 400 367)"/>`,

  'pro-grip-plug': () => `
    <circle cx="400" cy="400" r="256" ${C} stroke-opacity=".4"/>
    <circle cx="400" cy="400" r="214" ${CF}/>
    <circle cx="316" cy="400" r="38" ${C}/><circle cx="484" cy="400" r="38" ${C}/>
    <path d="M316 400H240V520H340M484 400H560V520H460" ${A} stroke-width="8"/>
    <path d="M400 330V520" ${A} stroke-width="8"/>
    <rect x="250" y="460" width="300" height="130" rx="22" ${C} stroke-opacity=".6"/>
    ${xscrew(290, 520, 20)}${xscrew(400, 520, 20)}${xscrew(510, 520, 20)}
    <g ${C}>${[300, 360, 420, 480, 540].map((x) => `<path d="M${x} 590v90"/>`).join('')}</g>
    <rect x="360" y="260" width="80" height="34" rx="17" ${A}/>
    ${T(400, 252, 'FUSE 13A', 'middle', '#ffb44d')}
    <rect x="132" y="366" width="66" height="68" rx="12" ${C}/><rect x="602" y="366" width="66" height="68" rx="12" ${C}/>
    ${T(400, 724, 'STRAIN RELIEF CLAMP')}`,

  'aurelle-pendant': () => `
    <path d="M160 490C160 320 280 258 400 258C520 258 640 320 640 490Z" ${C} stroke-opacity=".5"/>
    <path d="M400 -10V210" ${C}/>
    <rect x="360" y="270" width="80" height="62" rx="8" ${CF}/>
    ${T(400, 306, 'DRIVER')}
    <g ${C}>${Array.from({ length: 9 }, (_, i) => `<path d="M${250 + i * 38} 360v70"/>`).join('')}</g>
    <path d="M240 430H560" ${C}/>
    ${T(400, 460, 'HEAT SINK', 'middle', '#ffb44d')}
    <ellipse cx="400" cy="490" rx="150" ry="26" ${A}/>
    <g ${A}>${Array.from({ length: 5 }, (_, i) => `<circle cx="${290 + i * 55}" cy="490" r="9"/>`).join('')}</g>
    <path d="M400 332V380M400 380H300M300 380V430" ${A} stroke-width="3" stroke-dasharray="4 6"/>
    ${T(400, 530, 'COB LED 97 CRI')}`,

  'quantum-dmm': () => `
    <rect x="240" y="104" width="320" height="592" rx="42" ${C} stroke-opacity=".45"/>
    <rect x="266" y="134" width="268" height="148" rx="14" ${C}/>
    <path d="M290 282q0 40 110 40" ${A}/>
    ${T(400, 214, '88.88.8', 'middle')}
    <rect x="276" y="338" width="248" height="230" rx="18" ${CF}/>
    <circle cx="400" cy="440" r="100" ${C}/><circle cx="400" cy="440" r="72" ${A}/><circle cx="400" cy="440" r="44" ${C}/>
    ${Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2
      return `<path d="M${400 + Math.cos(a) * 72} ${440 + Math.sin(a) * 72}L${400 + Math.cos(a) * 100} ${440 + Math.sin(a) * 100}" ${C}/>`
    }).join('')}
    <rect x="296" y="580" width="60" height="26" rx="6" ${A}/>${T(326, 622, 'FUSE', 'middle', '#ffb44d')}
    <rect x="440" y="580" width="70" height="40" rx="6" ${C}/>${T(475, 640, 'BLE')}
    <rect x="270" y="636" width="260" height="46" rx="10" ${C} stroke-opacity=".6"/>
    ${T(400, 664, 'CR2032 · 3V')}
    <path d="M300 306v30M500 306v30" ${C}/>`,

  'orbit-smart-socket': () => `
    <rect x="180" y="180" width="440" height="440" rx="92" ${C} stroke-opacity=".4"/>
    <circle cx="400" cy="400" r="162" ${CF}/>
    <circle cx="340" cy="400" r="30" ${C}/><circle cx="460" cy="400" r="30" ${C}/>
    <path d="M340 400V300H460V400" ${A} stroke-width="7"/>
    <rect x="360" y="250" width="80" height="44" rx="8" ${C}/>${T(400, 238, 'SHUNT', 'middle', '#ffb44d')}
    <rect x="270" y="440" width="110" height="80" rx="8" ${CF}/>${T(325, 486, 'RELAY')}
    <rect x="420" y="440" width="110" height="80" rx="8" ${CF}/>${T(475, 486, 'Wi-Fi 6')}
    <g ${A}><path d="M452 540a30 30 0 0 1 46 0"/><path d="M440 530a46 46 0 0 1 70 0"/></g>
    <rect x="232" y="378" width="38" height="44" rx="8" ${C}/><rect x="530" y="378" width="38" height="44" rx="8" ${C}/>
    <path d="M232 520A190 190 0 0 0 568 520" ${A} stroke-width="5" transform="translate(0 -22)" stroke-dasharray="3 9"/>`,
}

const wrap = (inner, { bg, kind }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800"><defs>${DEFS}</defs>${
  bg
    ? kind === 'xray'
      ? '<rect width="800" height="800" fill="url(#xbg)"/><rect width="800" height="800" fill="url(#grid)"/>'
      : '<rect width="800" height="800" fill="url(#bg)"/><ellipse cx="400" cy="760" rx="300" ry="26" fill="#000" opacity=".35"/>'
    : ''
}${inner}</svg>`

const cache = new Map()

/** Returns an object URL for a product render. kind: 'photo' | 'xray' */
export function productImage(id, kind = 'photo', { bg = true } = {}) {
  const key = `${id}:${kind}:${bg}`
  if (cache.has(key)) return cache.get(key)
  const body = (kind === 'xray' ? xray : photo)[id]?.()
  if (!body) return ''
  const svg = wrap(body, { bg, kind })
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  cache.set(key, url)
  return url
}

export const rawSvg = (id, kind = 'photo', bg = true) =>
  wrap((kind === 'xray' ? xray : photo)[id]?.() ?? '', { bg, kind })

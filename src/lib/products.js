export const CATEGORIES = ['All', 'Switches', 'Protection', 'Connectors', 'Lighting', 'Tools']

export const PRODUCTS = [
  {
    id: 'volt-panel-s1',
    name: 'Volt Panel S1',
    category: 'Switches',
    price: 189,
    tagline: 'Touch-glass smart switch',
    blurb:
      'A single-gang capacitive glass switch with silent zero-cross relays, local-first automation and a 0.9 mm milled aluminium bezel.',
    specs: [
      ['Load', '10 A · 2300 W resistive'],
      ['Wireless', 'Thread · Zigbee 3.0 · BLE'],
      ['Relay life', '100,000 cycles'],
      ['Finish', 'Gorilla glass · anodised frame'],
    ],
  },
  {
    id: 'arc-guard-32',
    name: 'Arc-Guard MCB 32A',
    category: 'Protection',
    price: 64,
    tagline: 'C-curve miniature circuit breaker',
    blurb:
      'Thermal-magnetic trip with a ten-plate arc chute rated to 10 kA. Positive-indication contacts and finger-safe IP20 terminals.',
    specs: [
      ['Rating', '32 A · C curve'],
      ['Breaking capacity', '10 kA'],
      ['Poles', '1P · 17.5 mm module'],
      ['Standard', 'IEC 60898-1'],
    ],
  },
  {
    id: 'pro-grip-plug',
    name: 'Pro-Grip Earthed Plug',
    category: 'Connectors',
    price: 28,
    tagline: 'Industrial-grade rewireable plug',
    blurb:
      'Impact-proof PA66 body, silver-plated brass pins and a tool-free clamp that holds up to 3×2.5 mm² flex under 300 N pull.',
    specs: [
      ['Rating', '16 A · 250 V'],
      ['Pins', 'Silver-plated brass'],
      ['Strain relief', '300 N pull'],
      ['Ingress', 'IP44 with gasket'],
    ],
  },
  {
    id: 'aurelle-pendant',
    name: 'Aurelle Pendant',
    category: 'Lighting',
    price: 429,
    tagline: 'Hand-spun brass luxury fixture',
    blurb:
      'A spun brass dome with a champagne-lacquered interior, driven by a flicker-free 2200–3000 K dim-to-warm engine.',
    specs: [
      ['Output', '1,100 lm · CRI 97'],
      ['Colour temp', '2200–3000 K dim-to-warm'],
      ['Material', 'Solid spun brass'],
      ['Drive', 'Triac / 0–10 V / DALI-2'],
    ],
  },
  {
    id: 'quantum-dmm',
    name: 'Quantum DMM Pro',
    category: 'Tools',
    price: 349,
    tagline: 'CAT IV smart multimeter',
    blurb:
      'True-RMS with 60,000 counts, Bluetooth logging to your phone and a drop-proof holster. Built for live-panel diagnostics.',
    specs: [
      ['Safety', 'CAT IV 600 V · CAT III 1000 V'],
      ['Counts', '60,000 true-RMS'],
      ['Logging', 'BLE 5 · 100k samples'],
      ['Drop rating', '3 m'],
    ],
  },
  {
    id: 'orbit-smart-socket',
    name: 'Orbit Smart Socket',
    category: 'Switches',
    price: 79,
    tagline: 'Energy-metering wall outlet',
    blurb:
      'Per-socket energy metering with ±1% accuracy, child-safe shutters, and a halo status ring that shows load at a glance.',
    specs: [
      ['Load', '16 A · 3680 W'],
      ['Metering', '±1% · 1 s resolution'],
      ['Safety', 'Shuttered · surge guarded'],
      ['Wireless', 'Wi-Fi 6 · Matter'],
    ],
  },
]

export const byId = (id) => PRODUCTS.find((p) => p.id === id)
export const money = (n) => `$${n.toLocaleString('en-US')}`

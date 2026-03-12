// Reflect Design System — Figma Plugin v2
// Fixes: multi-mode fallback for free plan, font fallbacks, error reporting

figma.showUI(__html__, { width: 320, height: 260, title: 'Reflect Design System Setup' });

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex, alpha = 1) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return { r, g, b, a: alpha };
}

function varAlias(variable) {
  return { type: 'VARIABLE_ALIAS', id: variable.id };
}

async function safeLoadFont(family, style) {
  try {
    await figma.loadFontAsync({ family, style });
    return true;
  } catch {
    return false;
  }
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRIMITIVES = {
  'color/amber-400':   { hex: '#D4724A', desc: 'Brand warm — terracotta' },
  'color/amber-300':   { hex: '#E89A70', desc: 'Brand warm light (dark mode)' },
  'color/teal-500':    { hex: '#4A7D8C', desc: 'Brand calm — muted teal' },
  'color/teal-400':    { hex: '#6AA8B8', desc: 'Brand calm light (dark mode)' },
  'color/sage-400':    { hex: '#7DB87A', desc: 'Mood positive — sage green' },
  'color/coral-400':   { hex: '#C4735A', desc: 'Mood negative — muted coral' },
  'color/neutral-950': { hex: '#1A1A22', desc: 'Text primary (light)' },
  'color/neutral-900': { hex: '#1A1A28', desc: 'Background (dark)' },
  'color/neutral-800': { hex: '#2A2A35', desc: 'Surface (dark)' },
  'color/neutral-500': { hex: '#6E6E7E', desc: 'Text muted (light)' },
  'color/neutral-200': { hex: '#E2E2E8', desc: 'Border (light) / text muted (dark)' },
  'color/warm-50':     { hex: '#FAF8F5', desc: 'Background primary (light)' },
  'color/white':       { hex: '#FFFFFF', desc: 'Surface / cards (light)' },
  'color/error':       { hex: '#D94F4F', desc: 'Error state' },
  'color/success':     { hex: '#3D9A5C', desc: 'Success state' },
  'color/overlay':     { hex: '#1A1A22', alpha: 0.5, desc: 'Modal scrim 50%' },
};

const SEMANTIC_LIGHT = {
  'bg/primary':      'color/warm-50',
  'bg/secondary':    'color/white',
  'surface/default': 'color/white',
  'surface/overlay': 'color/overlay',
  'brand/primary':   'color/amber-400',
  'brand/secondary': 'color/teal-500',
  'mood/positive':   'color/sage-400',
  'mood/negative':   'color/coral-400',
  'text/primary':    'color/neutral-950',
  'text/muted':      'color/neutral-500',
  'border':          'color/neutral-200',
  'error':           'color/error',
  'success':         'color/success',
};

const SEMANTIC_DARK = {
  'bg/primary':      'color/neutral-900',
  'bg/secondary':    'color/neutral-800',
  'surface/default': 'color/neutral-800',
  'surface/overlay': 'color/overlay',
  'brand/primary':   'color/amber-300',
  'brand/secondary': 'color/teal-400',
  'mood/positive':   'color/sage-400',
  'mood/negative':   'color/coral-400',
  'text/primary':    'color/white',
  'text/muted':      'color/neutral-200',
  'border':          'color/neutral-800',
  'error':           'color/error',
  'success':         'color/success',
};

const SPACING = {
  'space/4': 4, 'space/8': 8, 'space/12': 12, 'space/16': 16,
  'space/20': 20, 'space/24': 24, 'space/32': 32, 'space/48': 48, 'space/64': 64,
  'card/padding': 16, 'card/radius': 16, 'screen/edge': 24,
};

const TEXT_STYLES = [
  { name: 'Display',      family: 'Plus Jakarta Sans', style: 'Bold',     size: 32, lh: 120 },
  { name: 'Title',        family: 'Plus Jakarta Sans', style: 'SemiBold', size: 24, lh: 130 },
  { name: 'Body',         family: 'Plus Jakarta Sans', style: 'Regular',  size: 16, lh: 160 },
  { name: 'Caption',      family: 'Plus Jakarta Sans', style: 'Regular',  size: 13, lh: 140 },
  { name: 'Journal Body', family: 'Lora',              style: 'Regular',  size: 18, lh: 180 },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'run') return;

  const log = [];

  try {
    // ── 1. Primitives ──
    log.push('Creating Primitives collection…');
    const primColl = figma.variables.createVariableCollection('Primitives');
    const primMode = primColl.modes[0].modeId;
    primColl.renameMode(primMode, 'Default');

    const primVars = {};
    for (const [name, def] of Object.entries(PRIMITIVES)) {
      const v = figma.variables.createVariable(name, primColl, 'COLOR');
      v.description = def.desc || '';
      v.setValueForMode(primMode, hexToRgb(def.hex, def.alpha ?? 1));
      primVars[name] = v;
    }
    log.push(`✓ Primitives: ${Object.keys(primVars).length} variables`);

    // ── 2. Semantic — try Light/Dark, fall back to Light only ──
    log.push('Creating Semantic collection…');
    const semColl = figma.variables.createVariableCollection('Semantic');
    const lightMode = semColl.modes[0].modeId;
    semColl.renameMode(lightMode, 'Light');

    let darkMode = null;
    let hasDarkMode = false;
    try {
      darkMode = semColl.addMode('Dark');
      hasDarkMode = true;
      log.push('✓ Dark mode added (paid plan detected)');
    } catch {
      log.push('⚠ Dark mode skipped (free plan — Light only)');
    }

    for (const [name, lightPrim] of Object.entries(SEMANTIC_LIGHT)) {
      const v = figma.variables.createVariable(name, semColl, 'COLOR');
      v.setValueForMode(lightMode, varAlias(primVars[lightPrim]));
      if (hasDarkMode && darkMode) {
        const darkPrim = SEMANTIC_DARK[name];
        v.setValueForMode(darkMode, varAlias(primVars[darkPrim]));
      }
    }
    log.push(`✓ Semantic: ${Object.keys(SEMANTIC_LIGHT).length} variables`);

    // ── 3. Spacing ──
    log.push('Creating Spacing collection…');
    const spaceColl = figma.variables.createVariableCollection('Spacing');
    const spaceMode = spaceColl.modes[0].modeId;
    spaceColl.renameMode(spaceMode, 'Default');

    for (const [name, value] of Object.entries(SPACING)) {
      const v = figma.variables.createVariable(name, spaceColl, 'FLOAT');
      v.setValueForMode(spaceMode, value);
    }
    log.push(`✓ Spacing: ${Object.keys(SPACING).length} variables`);

    // ── 4. Text Styles ──
    log.push('Loading fonts & creating text styles…');
    const createdStyles = [];

    // Try to load fonts — use Inter as fallback if PJS not installed
    const pjsAvailable = await safeLoadFont('Plus Jakarta Sans', 'Bold');
    const loraAvailable = await safeLoadFont('Lora', 'Regular');

    if (!pjsAvailable) {
      log.push('⚠ Plus Jakarta Sans not found — install it from Google Fonts first');
    }
    if (!loraAvailable) {
      log.push('⚠ Lora not found — install it from Google Fonts first');
    }

    for (const ts of TEXT_STYLES) {
      const loaded = await safeLoadFont(ts.family, ts.style);
      if (!loaded) {
        log.push(`  ✗ Skipped "${ts.name}" — font not available`);
        continue;
      }
      const style = figma.createTextStyle();
      style.name = ts.name;
      style.fontName = { family: ts.family, style: ts.style };
      style.fontSize = ts.size;
      style.lineHeight = { unit: 'PERCENT', value: ts.lh };
      createdStyles.push(style);
      log.push(`  ✓ ${ts.name}`);
    }

    // ── 5. Foundations Page ──
    log.push('Building Foundations page…');
    let foundationsPage = figma.root.findChild(n => n.name === '🎨 Foundations');
    if (!foundationsPage) {
      foundationsPage = figma.createPage();
      foundationsPage.name = '🎨 Foundations';
    }
    figma.currentPage = foundationsPage;

    // Load display font for labels
    const interLoaded = await safeLoadFont('Inter', 'Regular')
      || await safeLoadFont('Roboto', 'Regular');
    const labelFont = interLoaded
      ? { family: 'Inter', style: 'Regular' }
      : { family: 'Roboto', style: 'Regular' };

    const frame = figma.createFrame();
    frame.name = 'Reflect — Foundations';
    frame.resize(1440, 2600);
    frame.fills = [{ type: 'SOLID', color: hexToRgb('#FAF8F5') }];

    let yPos = 80;
    const X = 80;

    function addSectionTitle(text) {
      const t = figma.createText();
      t.fontName = labelFont;
      t.characters = text;
      t.fontSize = 11;
      t.letterSpacing = { unit: 'PERCENT', value: 10 };
      t.fills = [{ type: 'SOLID', color: hexToRgb('#6E6E7E') }];
      t.x = X; t.y = yPos;
      frame.appendChild(t);
      yPos += 28;
    }

    // Color swatches — Primitives
    addSectionTitle('COLOR PRIMITIVES');
    let sx = X;
    let swatchRow = 0;
    const entries = Object.entries(PRIMITIVES);
    for (let i = 0; i < entries.length; i++) {
      const [name, def] = entries[i];
      if (i > 0 && i % 8 === 0) { sx = X; yPos += 100; }

      const rect = figma.createRectangle();
      rect.x = sx; rect.y = yPos;
      rect.resize(72, 56); rect.cornerRadius = 8;
      rect.fills = [{ type: 'SOLID', color: hexToRgb(def.hex, def.alpha ?? 1) }];
      rect.strokes = [{ type: 'SOLID', color: hexToRgb('#E2E2E8') }];
      rect.strokeWeight = 1;
      frame.appendChild(rect);

      const lbl = figma.createText();
      lbl.fontName = labelFont;
      lbl.characters = name.replace('color/', '');
      lbl.fontSize = 9;
      lbl.fills = [{ type: 'SOLID', color: hexToRgb('#6E6E7E') }];
      lbl.x = sx; lbl.y = yPos + 60;
      frame.appendChild(lbl);

      sx += 88;
    }
    yPos += 140;

    // Semantic tokens
    addSectionTitle('SEMANTIC TOKENS (Light)');
    sx = X;
    const semEntries = Object.entries(SEMANTIC_LIGHT);
    for (let i = 0; i < semEntries.length; i++) {
      const [name, primKey] = semEntries[i];
      if (i > 0 && i % 6 === 0) { sx = X; yPos += 100; }

      const hex = PRIMITIVES[primKey]?.hex ?? '#CCCCCC';
      const alpha = PRIMITIVES[primKey]?.alpha ?? 1;

      const rect = figma.createRectangle();
      rect.x = sx; rect.y = yPos;
      rect.resize(120, 48); rect.cornerRadius = 8;
      rect.fills = [{ type: 'SOLID', color: hexToRgb(hex, alpha) }];
      rect.strokes = [{ type: 'SOLID', color: hexToRgb('#E2E2E8') }];
      rect.strokeWeight = 1;
      frame.appendChild(rect);

      const lbl = figma.createText();
      lbl.fontName = labelFont;
      lbl.characters = name;
      lbl.fontSize = 9;
      lbl.fills = [{ type: 'SOLID', color: hexToRgb('#6E6E7E') }];
      lbl.x = sx; lbl.y = yPos + 52;
      frame.appendChild(lbl);

      sx += 140;
    }
    yPos += 140;

    // Typography specimens
    addSectionTitle('TYPOGRAPHY SCALE');
    for (const ts of TEXT_STYLES) {
      const loaded = await safeLoadFont(ts.family, ts.style);
      if (!loaded) { yPos += 40; continue; }

      const specimen = figma.createText();
      specimen.fontName = { family: ts.family, style: ts.style };
      specimen.fontSize = ts.size;
      specimen.lineHeight = { unit: 'PERCENT', value: ts.lh };
      specimen.characters = `${ts.name}  —  ${ts.family} ${ts.style} ${ts.size}px / ${ts.lh}% lh`;
      specimen.fills = [{ type: 'SOLID', color: hexToRgb('#1A1A22') }];
      specimen.x = X; specimen.y = yPos;
      frame.appendChild(specimen);
      yPos += Math.round(ts.size * (ts.lh / 100)) + 20;
    }
    yPos += 40;

    // Spacing grid
    addSectionTitle('SPACING SCALE');
    sx = X;
    for (const size of [4, 8, 12, 16, 20, 24, 32, 48, 64]) {
      const rect = figma.createRectangle();
      rect.x = sx; rect.y = yPos + (64 - size);
      rect.resize(size, size);
      rect.fills = [{ type: 'SOLID', color: hexToRgb('#D4724A') }];
      rect.cornerRadius = 2;
      frame.appendChild(rect);

      const lbl = figma.createText();
      lbl.fontName = labelFont;
      lbl.characters = `${size}`;
      lbl.fontSize = 10;
      lbl.fills = [{ type: 'SOLID', color: hexToRgb('#6E6E7E') }];
      lbl.x = sx; lbl.y = yPos + 70;
      frame.appendChild(lbl);

      sx += size + 28;
    }

    frame.resize(1440, yPos + 200);

    const summary = [
      `✅ Done!`,
      `Primitives: ${Object.keys(primVars).length} vars`,
      `Semantic: ${Object.keys(SEMANTIC_LIGHT).length} vars${hasDarkMode ? ' (Light+Dark)' : ' (Light only — upgrade for Dark)'}`,
      `Spacing: ${Object.keys(SPACING).length} vars`,
      `Text styles: ${createdStyles.length}/5`,
    ].join(' · ');

    figma.ui.postMessage({ type: 'done', message: summary, log });

  } catch (err) {
    figma.ui.postMessage({
      type: 'error',
      message: `${err.message}`,
      log,
    });
  }
};

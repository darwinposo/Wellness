// Reflect Design System — Figma Plugin
// Automates: Primitives + Semantic + Spacing Variables, 5 Text Styles, Foundations page

figma.showUI(__html__, { width: 320, height: 220, title: 'Reflect Design System Setup' });

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b, a: alpha };
}

function varAlias(variable) {
  return { type: 'VARIABLE_ALIAS', id: variable.id };
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRIMITIVES = {
  'color/amber-400':   { hex: '#D4724A', desc: 'Brand warm — terracotta' },
  'color/amber-300':   { hex: '#E89A70', desc: 'Brand warm light' },
  'color/teal-500':    { hex: '#4A7D8C', desc: 'Brand calm — muted teal' },
  'color/teal-400':    { hex: '#6AA8B8', desc: 'Brand calm light' },
  'color/sage-400':    { hex: '#7DB87A', desc: 'Mood positive — sage green' },
  'color/coral-400':   { hex: '#C4735A', desc: 'Mood negative — muted coral' },
  'color/neutral-950': { hex: '#1A1A22', desc: 'Text primary' },
  'color/neutral-900': { hex: '#1A1A28', desc: 'Dark bg' },
  'color/neutral-800': { hex: '#2A2A35', desc: 'Dark surface' },
  'color/neutral-500': { hex: '#6E6E7E', desc: 'Text muted' },
  'color/neutral-200': { hex: '#E2E2E8', desc: 'Border' },
  'color/warm-50':     { hex: '#FAF8F5', desc: 'Background primary' },
  'color/white':       { hex: '#FFFFFF', desc: 'Surface / cards' },
  'color/error':       { hex: '#D94F4F', desc: 'Error state' },
  'color/success':     { hex: '#3D9A5C', desc: 'Success state' },
  'color/overlay':     { hex: '#1A1A22', alpha: 0.5, desc: 'Modal scrim 50%' },
};

const SEMANTIC = {
  'bg/primary':      { light: 'color/warm-50',     dark: 'color/neutral-900' },
  'bg/secondary':    { light: 'color/white',        dark: 'color/neutral-800' },
  'surface/default': { light: 'color/white',        dark: 'color/neutral-800' },
  'surface/overlay': { light: 'color/overlay',      dark: 'color/overlay' },
  'brand/primary':   { light: 'color/amber-400',    dark: 'color/amber-300' },
  'brand/secondary': { light: 'color/teal-500',     dark: 'color/teal-400' },
  'mood/positive':   { light: 'color/sage-400',     dark: 'color/sage-400' },
  'mood/negative':   { light: 'color/coral-400',    dark: 'color/coral-400' },
  'text/primary':    { light: 'color/neutral-950',  dark: 'color/white' },
  'text/muted':      { light: 'color/neutral-500',  dark: 'color/neutral-200' },
  'border':          { light: 'color/neutral-200',  dark: 'color/neutral-800' },
  'error':           { light: 'color/error',        dark: 'color/error' },
  'success':         { light: 'color/success',      dark: 'color/success' },
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

  try {
    // 1. Primitives collection
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

    // 2. Semantic collection (Light + Dark modes)
    const semColl = figma.variables.createVariableCollection('Semantic');
    const lightMode = semColl.modes[0].modeId;
    semColl.renameMode(lightMode, 'Light');
    const darkMode = semColl.addMode('Dark');

    for (const [name, def] of Object.entries(SEMANTIC)) {
      const v = figma.variables.createVariable(name, semColl, 'COLOR');
      v.setValueForMode(lightMode, varAlias(primVars[def.light]));
      v.setValueForMode(darkMode,  varAlias(primVars[def.dark]));
    }

    // 3. Spacing collection
    const spaceColl = figma.variables.createVariableCollection('Spacing');
    const spaceMode = spaceColl.modes[0].modeId;
    spaceColl.renameMode(spaceMode, 'Default');

    for (const [name, value] of Object.entries(SPACING)) {
      const v = figma.variables.createVariable(name, spaceColl, 'FLOAT');
      v.setValueForMode(spaceMode, value);
    }

    // 4. Text styles (requires font loading)
    const createdStyles = [];
    for (const ts of TEXT_STYLES) {
      await figma.loadFontAsync({ family: ts.family, style: ts.style });
      const style = figma.createTextStyle();
      style.name = ts.name;
      style.fontName = { family: ts.family, style: ts.style };
      style.fontSize = ts.size;
      style.lineHeight = { unit: 'PERCENT', value: ts.lh };
      createdStyles.push(style);
    }

    // 5. Foundations page
    let foundationsPage = figma.root.findChild(n => n.name === '🎨 Foundations');
    if (!foundationsPage) {
      foundationsPage = figma.createPage();
      foundationsPage.name = '🎨 Foundations';
    }
    figma.currentPage = foundationsPage;

    const frame = figma.createFrame();
    frame.name = 'Reflect Design System — Foundations';
    frame.resize(1440, 2400);
    frame.fills = [{ type: 'SOLID', color: hexToRgb('#FAF8F5') }];
    frame.x = 0; frame.y = 0;

    // Section helper
    let yPos = 64;
    const COL1 = 64;
    const SECTION_GAP = 80;

    function addLabel(text, size = 13, weight = 'SemiBold', color = '#6E6E7E') {
      const t = figma.createText();
      t.x = COL1; t.y = yPos;
      t.characters = text;
      t.fontSize = size;
      t.fills = [{ type: 'SOLID', color: hexToRgb(color) }];
      frame.appendChild(t);
      yPos += size + 8;
      return t;
    }

    // Load fonts needed for foundation labels
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    await figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' });
    await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
    await figma.loadFontAsync({ family: 'Plus Jakarta Sans', style: 'Bold' });
    await figma.loadFontAsync({ family: 'Plus Jakarta Sans', style: 'Regular' });

    // ── Color Primitives ──
    const titleNode1 = figma.createText();
    titleNode1.x = COL1; titleNode1.y = yPos;
    titleNode1.characters = 'COLOR PRIMITIVES';
    titleNode1.fontSize = 11;
    titleNode1.letterSpacing = { unit: 'PERCENT', value: 10 };
    titleNode1.fills = [{ type: 'SOLID', color: hexToRgb('#6E6E7E') }];
    frame.appendChild(titleNode1);
    yPos += 32;

    let xPos = COL1;
    const SWATCH_SIZE = 64;
    const SWATCH_GAP = 16;
    const SWATCHES_PER_ROW = 8;
    let swatchCount = 0;

    for (const [name, def] of Object.entries(PRIMITIVES)) {
      const swatch = figma.createRectangle();
      swatch.x = xPos; swatch.y = yPos;
      swatch.resize(SWATCH_SIZE, SWATCH_SIZE);
      swatch.cornerRadius = 8;
      swatch.fills = [{ type: 'SOLID', color: hexToRgb(def.hex, def.alpha ?? 1) }];
      swatch.strokes = [{ type: 'SOLID', color: hexToRgb('#E2E2E8') }];
      swatch.strokeWeight = 1;
      frame.appendChild(swatch);

      const label = figma.createText();
      label.x = xPos; label.y = yPos + SWATCH_SIZE + 4;
      label.characters = name.replace('color/', '');
      label.fontSize = 10;
      label.fills = [{ type: 'SOLID', color: hexToRgb('#6E6E7E') }];
      frame.appendChild(label);

      swatchCount++;
      xPos += SWATCH_SIZE + SWATCH_GAP;
      if (swatchCount % SWATCHES_PER_ROW === 0) {
        xPos = COL1;
        yPos += SWATCH_SIZE + 32;
      }
    }
    yPos += SWATCH_SIZE + 48 + SECTION_GAP;

    // ── Semantic Roles ──
    const titleNode2 = figma.createText();
    titleNode2.x = COL1; titleNode2.y = yPos;
    titleNode2.characters = 'SEMANTIC TOKENS — LIGHT / DARK';
    titleNode2.fontSize = 11;
    titleNode2.letterSpacing = { unit: 'PERCENT', value: 10 };
    titleNode2.fills = [{ type: 'SOLID', color: hexToRgb('#6E6E7E') }];
    frame.appendChild(titleNode2);
    yPos += 32;

    const semanticEntries = Object.entries(SEMANTIC);
    for (let i = 0; i < semanticEntries.length; i++) {
      const [name, def] = semanticEntries[i];
      const lightHex = PRIMITIVES[def.light]?.hex ?? '#FFFFFF';
      const darkHex  = PRIMITIVES[def.dark]?.hex  ?? '#000000';
      const colX = COL1 + (i % 6) * 200;
      const rowY = yPos + Math.floor(i / 6) * 100;

      const chip = figma.createRectangle();
      chip.x = colX; chip.y = rowY;
      chip.resize(80, 36); chip.cornerRadius = 6;
      chip.fills = [{ type: 'SOLID', color: hexToRgb(lightHex) }];
      chip.strokes = [{ type: 'SOLID', color: hexToRgb('#E2E2E8') }];
      chip.strokeWeight = 1;
      frame.appendChild(chip);

      const chipDark = figma.createRectangle();
      chipDark.x = colX + 84; chipDark.y = rowY;
      chipDark.resize(80, 36); chipDark.cornerRadius = 6;
      chipDark.fills = [{ type: 'SOLID', color: hexToRgb(darkHex) }];
      frame.appendChild(chipDark);

      const chipLabel = figma.createText();
      chipLabel.x = colX; chipLabel.y = rowY + 40;
      chipLabel.characters = name;
      chipLabel.fontSize = 10;
      chipLabel.fills = [{ type: 'SOLID', color: hexToRgb('#6E6E7E') }];
      frame.appendChild(chipLabel);
    }
    yPos += Math.ceil(semanticEntries.length / 6) * 100 + SECTION_GAP;

    // ── Typography Scale ──
    const titleNode3 = figma.createText();
    titleNode3.x = COL1; titleNode3.y = yPos;
    titleNode3.characters = 'TYPOGRAPHY SCALE';
    titleNode3.fontSize = 11;
    titleNode3.letterSpacing = { unit: 'PERCENT', value: 10 };
    titleNode3.fills = [{ type: 'SOLID', color: hexToRgb('#6E6E7E') }];
    frame.appendChild(titleNode3);
    yPos += 32;

    for (const ts of TEXT_STYLES) {
      const specimen = figma.createText();
      specimen.x = COL1; specimen.y = yPos;
      specimen.characters = `${ts.name} — ${ts.family} ${ts.style} ${ts.size}px / ${ts.lh}%`;
      specimen.fontName = { family: ts.family, style: ts.style };
      specimen.fontSize = ts.size;
      specimen.lineHeight = { unit: 'PERCENT', value: ts.lh };
      specimen.fills = [{ type: 'SOLID', color: hexToRgb('#1A1A22') }];
      frame.appendChild(specimen);
      yPos += ts.size * (ts.lh / 100) + 24;
    }
    yPos += SECTION_GAP;

    // ── Spacing Scale ──
    const titleNode4 = figma.createText();
    titleNode4.x = COL1; titleNode4.y = yPos;
    titleNode4.characters = 'SPACING SCALE';
    titleNode4.fontSize = 11;
    titleNode4.letterSpacing = { unit: 'PERCENT', value: 10 };
    titleNode4.fills = [{ type: 'SOLID', color: hexToRgb('#6E6E7E') }];
    frame.appendChild(titleNode4);
    yPos += 32;

    const spacingSizes = [4, 8, 12, 16, 20, 24, 32, 48, 64];
    let spaceX = COL1;
    for (const size of spacingSizes) {
      const bar = figma.createRectangle();
      bar.x = spaceX; bar.y = yPos + (64 - size);
      bar.resize(size, size);
      bar.fills = [{ type: 'SOLID', color: hexToRgb('#D4724A') }];
      bar.cornerRadius = 2;
      frame.appendChild(bar);

      const spLabel = figma.createText();
      spLabel.x = spaceX; spLabel.y = yPos + 72;
      spLabel.characters = `${size}`;
      spLabel.fontSize = 10;
      spLabel.fills = [{ type: 'SOLID', color: hexToRgb('#6E6E7E') }];
      frame.appendChild(spLabel);

      spaceX += size + 24;
    }

    // Resize frame to content
    frame.resize(1440, yPos + 200);

    figma.ui.postMessage({
      type: 'done',
      message: 'Design system created! Check Primitives, Semantic, Spacing collections + 🎨 Foundations page.'
    });

  } catch (err) {
    figma.ui.postMessage({ type: 'error', message: err.message });
  }
};

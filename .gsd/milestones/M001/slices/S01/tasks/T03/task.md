# T03: Token Export Pipeline
Slice: M001/S01
Created: 2026-03-12

## Goal
Set up the pipeline that exports Figma Variables to a JSON token file, then transforms it into a working `tailwind.config.js` and `global.css` that NativeWind v4 can consume.

## Steps
1. Install TokenFlow plugin in Figma (Figma Community: "TokenFlow - Figma Variables to Tailwind 4")
2. Run TokenFlow export → save output as `design/tokens/tokens.json`
3. Install Style Dictionary locally: `npm install -g style-dictionary`
4. Write `design/tokens/sd.config.js` — transforms JSON to tailwind + CSS outputs
5. Run Style Dictionary: `npx style-dictionary build --config sd.config.js`
6. Verify `design/tokens/tailwind.config.js` — check color names match Figma semantic Variables
7. Verify `design/tokens/global.css` — check CSS custom properties use oklch values
8. Create `design/tokens/README.md` documenting the pipeline steps for future updates
9. Commit token files to repo: `design/tokens/`

## Must-Haves

### Truths
- [ ] `tokens.json` is valid JSON, parseable without errors
- [ ] `tailwind.config.js` exports a theme with `colors` section matching semantic Variable names
- [ ] `global.css` contains `:root { }` with CSS custom properties for all semantic color tokens
- [ ] Dark mode tokens present in `global.css` under `@media (prefers-color-scheme: dark)`
- [ ] Running Style Dictionary with the config produces both files without errors
- [ ] `inlineNativeRem: 16` is documented in README as required NativeWind config

### Artifacts
- [ ] `design/tokens/tokens.json` — exists, ≥20 color tokens
- [ ] `design/tokens/tailwind.config.js` — exists, valid JS, has `theme.extend.colors` section
- [ ] `design/tokens/global.css` — exists, has `:root` block + dark mode block
- [ ] `design/tokens/sd.config.js` — exists, runnable with `npx style-dictionary build`
- [ ] `design/tokens/README.md` — documents: export steps, transform steps, how to update

### Key Links
- [ ] Color names in `tailwind.config.js` exactly match: `brand-warm`, `brand-calm`, `bg-primary`, `surface`, `text-primary`, `text-muted`, `mood-positive`, `mood-negative`
- [ ] `global.css` variable names use `--color-` prefix (e.g. `--color-brand-warm`)

## Expected Output Files

### design/tokens/global.css (target output)
```css
:root {
  --color-bg-primary: oklch(97% 0.01 80);
  --color-surface: oklch(100% 0 0);
  --color-brand-warm: oklch(72% 0.15 45);
  --color-brand-calm: oklch(65% 0.10 230);
  --color-mood-positive: oklch(78% 0.14 130);
  --color-mood-negative: oklch(72% 0.12 35);
  --color-text-primary: oklch(20% 0.02 260);
  --color-text-muted: oklch(55% 0.02 260);
}
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: oklch(18% 0.01 260);
    --color-surface: oklch(22% 0.01 260);
    --color-brand-warm: oklch(68% 0.14 45);
    --color-text-primary: oklch(95% 0.01 80);
    --color-text-muted: oklch(65% 0.02 260);
  }
}
```

### design/tokens/tailwind.config.js (target output)
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--color-bg-primary)',
        'surface': 'var(--color-surface)',
        'brand-warm': 'var(--color-brand-warm)',
        'brand-calm': 'var(--color-brand-calm)',
        'mood-positive': 'var(--color-mood-positive)',
        'mood-negative': 'var(--color-mood-negative)',
        'text-primary': 'var(--color-text-primary)',
        'text-muted': 'var(--color-text-muted)',
      },
      fontFamily: {
        sans: ['PlusJakartaSans_400Regular'],
        'sans-semibold': ['PlusJakartaSans_600SemiBold'],
        'sans-bold': ['PlusJakartaSans_700Bold'],
        serif: ['Lora_400Regular'],
      },
    },
  },
}
```

## Notes
- If TokenFlow plugin doesn't export oklch values (exports hex instead), manually edit tokens.json to use oklch — the oklch values are the source of truth from research.
- Alternative to TokenFlow: "Export Figma Variables to Tailwind/JSON" plugin (Figma Community).
- Style Dictionary docs: https://style-dictionary.fyi
- This token pipeline runs every time the design system is updated in Figma. Takes ~5 minutes total.

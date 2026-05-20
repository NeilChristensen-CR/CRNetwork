# Design system rules

## The rule

**`@courtreserve/admin` is the source of truth for UI in this repo.** Before
writing or modifying any component, check whether the design system already
ships something that fits. If it does, use it. Do not reach for raw HTML +
inline styles when an exported primitive exists.

## Where to look

The package exports ~117 components plus foundations, hooks, tokens, and types.

```sh
# Quick exhaustive list of what's available:
node -p "Object.keys(require('@courtreserve/admin'))"

# Type signatures (props, variants):
sed -n '1,200p' node_modules/@courtreserve/admin/dist/index.d.ts
ls node_modules/@courtreserve/admin/dist/components/

# Design tokens (989 CSS custom properties):
grep -oE '\-\-[a-zA-Z][a-zA-Z0-9_-]+:' node_modules/@courtreserve/admin/dist/index.css | sort -u
```

Tokens follow conventional categories: `--color-bg-*`, `--color-fg-*`,
`--color-border-*`, semantic (`--color-primary-*`, `--color-success-*`,
`--color-warning-*`, `--color-error-*`, `--color-info-*`), neutrals
(`--color-neutral-*`, `--color-grey-*`), accents (`--color-blue/cyan/green/
orange/pink/purple/red/teal/*`), and structural (`--border-weight-*`, etc.).

Always import the global stylesheet once at app entry:

```js
import "@courtreserve/admin/styles.css";
```

## When the design system has what you need

Use it. Prefer exported props over wrapper divs. Don't restyle exported
components with overriding `style={{…}}` unless there's a documented reason.

## When the design system has a gap

If you cannot find a component or variant that fits, **state the gap
explicitly in your response before writing code.** Format:

> **DS gap:** `<what's missing>` — closest existing primitive is
> `<Component>`, which lacks `<specific affordance>`. Building a local
> component that uses the DS tokens and follows the `<reference>` pattern.

Then build it with these constraints:

1. **Style with DS tokens, not raw hex values.** Use `var(--color-bg-card)`,
   `var(--color-fg-primary)`, etc. Never paste literal colors like `#0F1214`
   or one-off pixel values that are already tokenized.
2. **Compose from DS primitives where possible** — wrap `Button`, `Badge`,
   `Banner`, etc. rather than rebuilding them. A new component should usually
   add layout or composition, not re-implement an exported primitive.
3. **Match naming conventions.** PascalCase component, props named after the
   nearest DS analogue (`variant`, `size`, `tone` — not `color`, `style`,
   `kind`).
4. **Place new components in `src/components/` and re-export from
   `src/components/index.js`.** Keep one component per file unless they're
   tightly coupled (e.g. `Card` + `CardHeader`).
5. **No inline `style={{…}}` for anything tokenizable.** Inline styles are
   acceptable only for true one-off layout (e.g. `display: 'flex'`) where a
   CSS class would be overkill. Anything color/spacing/typography goes
   through a token.

## When in doubt

Search before writing. Half the components have aliases or sub-parts that
aren't obvious from the name (e.g. `AccordionRoot`/`AccordionItem`/
`AccordionTrigger`/`AccordionContent` — don't reinvent any of them).

## Scope

This rule applies to anything under `src/`. The `public/` directory holds
the legacy Babel-standalone prototype — don't refactor it to use the DS
unless explicitly asked. New work goes in `src/`.

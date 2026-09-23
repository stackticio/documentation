# Stacktic documentation

The public documentation site: https://stackticio.github.io/documentation/

Built with Docusaurus. The content is AI-client-first — it describes the graph model, the
MCP interface, what the automation actually generates, and what the stack agent proves.

## Run it

```bash
npm install          # first time only
npm start            # dev server with hot reload
npm run build        # production build into build/
npm run serve        # serve the production build locally
```

## Layout

```
docs/                 all documentation content (.mdx)
├─ index.mdx          what Stacktic is
├─ how-it-works.mdx   the four layers
├─ concepts.mdx       components, sub-components, links, attributes, versions
├─ mcp/               the AI interface: quickstart, connect, tools, knowledge, workflows
├─ platform/          the design surface: systems, history, LiveView, catalog, collaboration
├─ day0/              design and generate
├─ day2/              operate and prove — the stack agent
├─ compliance/        compliance automation
├─ blueprints/        ML, private AI, sovereignty, multi-environment SaaS
└─ reference/         catalog, link types, API, glossary

src/
├─ components/stk/    the MDX component library (Hero, Cards, Steps, Stats, Figure, …)
├─ theme/             MDXComponents — registers those globally, so every .mdx can use them
├─ css/custom.css     the design system
└─ pages/             the landing page and the ROI calculator

sidebars.js           navigation
docusaurus.config.js  site config
static/               legacy marketing HTML kept as-is; not linked from the docs
```

## Writing

All docs pages are `.mdx` and may use the shared components without importing them:

```mdx
<Hero eyebrow="Section" title="The headline">Standfirst paragraph.</Hero>

<Cards>
  <Card to="/docs/somewhere" kicker="Kicker" title="Title">Body.</Card>
</Cards>

<Steps><Step title="First">Body.</Step></Steps>

<Stats><Stat value="79" label="component templates" /></Stats>

<Figure caption="Caption"><svg>…</svg></Figure>

<Split>
  <Side tone="problem" head="The gap"><ul><li>…</li></ul></Side>
  <Side tone="answer" head="The answer"><ul><li>…</li></ul></Side>
</Split>
```

Diagrams are inline SVG using the theme's CSS variables (`var(--stk-blue)`,
`var(--stk-mint)`, `var(--stk-steel)`, `var(--stk-panel)`), so they work in both light and
dark mode. SVG attributes must be written in JSX form (`strokeWidth`, `textAnchor`,
`fontSize`).

## Rules for this repo

1. **Every claim comes from the code.** The platform application, the templates and the
   knowledge layer are the sources of truth. Nothing here is written from memory of them.
2. **No customer names, cluster names, hostnames, domains or credentials.** Examples are
   generic. This site is public.
3. **Write for the AI client first.** The primary reader operates the stack through MCP;
   human click-paths are secondary.
4. **Do not document a capability that is not registered in the catalog** without saying
   so explicitly.

## History

The previous (2024-era) version of this site is preserved in full on the `archive/docs-v1`
branch and the `docs-v1-archive` tag.

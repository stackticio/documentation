// @ts-check
const config = {
  title: 'Stacktic',
  tagline: 'Graph the system. Automate everything.',
  url: 'https://stackticio.github.io',
  baseUrl: '/documentation/',
  favicon: 'img/favicon.ico',
  trailingSlash: false,
  organizationName: 'stackticio',
  projectName: 'documentation',
  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',
  // .md files are plain Markdown (the Kanso guides), .mdx stays MDX
  markdown: { format: 'detect' },

  themeConfig: {
    image: 'img/transparent_logo_black.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: { hideable: true, autoCollapseCategories: false },
    },
    navbar: {
      title: 'Stacktic',
      hideOnScroll: false,
      logo: {
        alt: 'Stacktic',
        src: 'img/transparent_logo_black.png',
        href: '/docs/',
        target: '_self',
      },
      items: [
        { to: '/docs/', label: 'Docs', position: 'left' },
        { to: '/docs/mcp/quickstart', label: 'Start with MCP', position: 'left' },
        { to: '/docs/platform/', label: 'Platform', position: 'left' },
        { to: '/docs/compliance/', label: 'Compliance', position: 'left' },
        { to: '/docs/blueprints/', label: 'Blueprints', position: 'left' },
        { to: '/docs/reference/components', label: 'Catalog', position: 'right' },
        { to: '/kanso/', label: 'Kanso', position: 'right', activeBasePath: 'kanso' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Start',
          items: [
            { label: 'What Stacktic is', to: '/docs/' },
            { label: 'How it works', to: '/docs/how-it-works' },
            { label: 'Start with MCP', to: '/docs/mcp/quickstart' },
          ],
        },
        {
          title: 'Automation',
          items: [
            { label: 'The platform', to: '/docs/platform/' },
            { label: 'Day 0–1 — design & generate', to: '/docs/day0/' },
            { label: 'Day 2 — operate', to: '/docs/day2/' },
            { label: 'Compliance', to: '/docs/compliance/' },
          ],
        },
        {
          title: 'Reference',
          items: [
            { label: 'Component catalog', to: '/docs/reference/components' },
            { label: 'Link types', to: '/docs/reference/links' },
            { label: 'Platform API', to: '/docs/reference/api' },
          ],
        },
        {
          title: 'Kanso',
          items: [
            { label: 'What Kanso is', to: '/kanso/' },
            { label: 'Connect an agent', to: '/kanso/agents/connect' },
            { label: 'Install', to: '/kanso/run/install' },
          ],
        },
      ],
      copyright: `Stacktic · ${new Date().getFullYear()}`,
    },
    prism: {
      additionalLanguages: ['bash', 'json', 'yaml', 'python', 'hcl'],
    },
    tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: [require.resolve('./src/css/custom.css'), require.resolve('./src/css/kanso.css')],
        },
      },
    ],
  ],

  // Kanso has its own docs set: /kanso/…, its own sidebar, same theme
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'kanso',
        path: 'kanso',
        routeBasePath: 'kanso',
        sidebarPath: require.resolve('./sidebars-kanso.js'),
      },
    ],
  ],

  deploymentBranch: 'gh-pages',
};

module.exports = config;

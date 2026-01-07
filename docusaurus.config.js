module.exports = {
  title: 'STACKTIC',
  tagline: 'Embrace full-stack automation control tactic',
  url: 'https://stackticio.github.io',  // Your GitHub Pages URL
  baseUrl: '/documentation/',  // Matches your repository name
  favicon: 'img/favicon.ico',
  trailingSlash: false,
  organizationName: 'stackticio',  // Your GitHub organization/user name
  projectName: 'documentation',  // Correct GitHub repository name
  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',

  themeConfig: {
    navbar: {
      title: '',
      logo: {
        alt: 'Stacktic',
        src: 'img/transparent_logo_black.png',
        href: '/docs/overview',  // Redirect to documentation page
        target: '_self',
      },
      items: [
        { to: '/docs/overview', label: 'Documentation', position: 'right' },
        { to: '/calculateAllTasksROI', label: 'ROI', position: 'right' },
      ],
    },
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  deploymentBranch: 'gh-pages',
};


module.exports = {
  title: 'STACKTIC',
  tagline: 'Embrace full-stack automation control tactic',
  url: 'https://www.yourstackticsite.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'stacktic',
  projectName: 'stacktic-website',

  themeConfig: {
    navbar: {
      title: '',
      logo: {
        alt: 'Stacktic',
        src: 'img/transparent_logo_black.png',
        href: '/docs/overview',  // Redirect to documentation page instead of homepage
        target: '_self',
      },
      items: [
        // { to: '/', label: 'Home', position: 'right' }, // Home link commented out
        { to: '/docs/overview', label: 'Documentation', position: 'right' },
        // { to: '/solutions', label: 'Solution', position: 'right' },
        // { to: '/cases', label: 'Case Studies', position: 'right' },
        { to: '/calculateAllTasksROI', label: 'ROI', position: 'right' },
        // { to: '/blog', label: 'Blogs', position: 'right' }, // Updated path
        // { to: '/pricing', label: 'Pricing', position: 'right' },
        // { to: '/company', label: 'Company', position: 'right' },
      ],
    },
    // ... other themeConfig settings
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // ... other doc plugin options
        },
        blog: {
          showReadingTime: true,
          // ... other blog plugin options
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  // ... other configuration settings
};


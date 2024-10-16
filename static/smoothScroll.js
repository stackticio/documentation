// File location: <root of your Docusaurus project>/docusaurus.config.js

module.exports = {
  // Your existing config...
  scripts: [
    {
      src: '/smoothScroll.js',
      async: false,
      defer: true,
    },
  ],
  // The rest of your configuration...
};

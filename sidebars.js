module.exports = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Start',
      collapsed: false,
      items: [
        { type: 'doc', id: 'index', label: 'What Stacktic is' },
        { type: 'doc', id: 'how-it-works', label: 'How it works' },
        { type: 'doc', id: 'concepts', label: 'Core concepts' },
      ],
    },
    {
      type: 'category',
      label: 'Build with AI',
      collapsed: false,
      items: [
        { type: 'doc', id: 'mcp/mcp-index', label: 'MCP — the AI interface' },
        { type: 'doc', id: 'mcp/mcp-quickstart', label: 'Quickstart — initiator stack' },
        { type: 'doc', id: 'mcp/mcp-connect', label: 'Connect a client' },
        { type: 'doc', id: 'mcp/mcp-tools', label: 'Tool surface' },
        { type: 'doc', id: 'mcp/mcp-knowledge', label: 'Knowledge layer' },
        { type: 'doc', id: 'mcp/mcp-workflows', label: 'Working with the model' },
      ],
    },
    {
      type: 'category',
      label: 'The platform',
      collapsed: true,
      items: [
        { type: 'doc', id: 'platform/platform-index', label: 'Overview' },
        { type: 'doc', id: 'platform/platform-systems', label: 'Systems and builds' },
        { type: 'doc', id: 'platform/platform-history', label: 'History and rollback' },
        { type: 'doc', id: 'platform/platform-liveview', label: 'LiveView' },
        { type: 'doc', id: 'platform/platform-sections', label: 'Catalog and sections' },
        { type: 'doc', id: 'platform/platform-collaboration', label: 'Collaboration' },
      ],
    },
    {
      type: 'category',
      label: 'Day 0–1 — design & generate',
      collapsed: true,
      items: [
        { type: 'doc', id: 'day0/day0-index', label: 'Overview' },
        { type: 'doc', id: 'day0/day0-graph-to-code', label: 'From graph to repository' },
        { type: 'doc', id: 'day0/day0-build-deploy', label: 'Build and deploy' },
        { type: 'doc', id: 'day0/day0-identity-secrets', label: 'Identity and secrets' },
      ],
    },
    {
      type: 'category',
      label: 'Day 2 — operate & prove',
      collapsed: true,
      items: [
        { type: 'doc', id: 'day2/day2-index', label: 'The stack agent' },
        { type: 'doc', id: 'day2/day2-validation', label: 'Validation' },
        { type: 'doc', id: 'day2/day2-scanners', label: 'Scanners' },
        { type: 'doc', id: 'day2/day2-evidence', label: 'Evidence and drift' },
        { type: 'doc', id: 'day2/day2-backup', label: 'Backup and recovery' },
        { type: 'doc', id: 'day2/day2-lifecycle', label: 'Lifecycle and scale' },
      ],
    },
    {
      type: 'category',
      label: 'Compliance automation',
      collapsed: true,
      items: [
        { type: 'doc', id: 'compliance/compliance-index', label: 'Overview' },
        { type: 'doc', id: 'compliance/compliance-frameworks', label: 'PCI DSS and ISO 27001' },
        { type: 'doc', id: 'compliance/compliance-policy', label: 'Admission policy' },
        { type: 'doc', id: 'compliance/compliance-controls-from-graph', label: 'Controls from the graph' },
        { type: 'doc', id: 'compliance/compliance-reviews', label: 'Reviews and approvals' },
      ],
    },
    {
      type: 'category',
      label: 'Blueprints',
      collapsed: true,
      items: [
        { type: 'doc', id: 'blueprints/blueprints-index', label: 'Overview' },
        { type: 'doc', id: 'blueprints/blueprints-ml', label: 'Machine learning' },
        { type: 'doc', id: 'blueprints/blueprints-private-ai', label: 'Private AI' },
        { type: 'doc', id: 'blueprints/blueprints-sovereignty', label: 'Digital sovereignty' },
        { type: 'doc', id: 'blueprints/blueprints-saas', label: 'Multi-environment SaaS' },
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: [
        { type: 'doc', id: 'reference/reference-components', label: 'Component catalog' },
        { type: 'doc', id: 'reference/reference-links', label: 'Link types' },
        { type: 'doc', id: 'reference/reference-api', label: 'Platform API' },
        { type: 'doc', id: 'reference/reference-glossary', label: 'Glossary' },
      ],
    },
  ],
};

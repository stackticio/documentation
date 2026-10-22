module.exports = {
  kansoSidebar: [
    {
      type: 'category',
      label: 'Start',
      collapsed: false,
      items: [
        { type: 'doc', id: 'index', label: 'What Kanso is' },
        { type: 'doc', id: 'how-it-works', label: 'How it works' },
        { type: 'doc', id: 'concepts', label: 'Core concepts' },
      ],
    },
    {
      type: 'category',
      label: 'Agents and people',
      collapsed: false,
      items: [
        { type: 'doc', id: 'agents/quickstart', label: 'Your first agent' },
        { type: 'doc', id: 'agents/fleets', label: 'Fleets and leases' },
        { type: 'doc', id: 'agents/human-answers', label: 'Human answers' },
        { type: 'doc', id: 'agents/governance', label: 'Governing agents' },
        { type: 'doc', id: 'agents/accountability', label: 'Accountability' },
        { type: 'doc', id: 'agents/connect', label: 'MCP reference' },
      ],
    },
    {
      type: 'category',
      label: 'Work management',
      collapsed: true,
      items: [
        { type: 'doc', id: 'work/projects-issues-fields', label: 'Projects, issues and fields' },
        { type: 'doc', id: 'work/workflows', label: 'Workflows' },
        { type: 'doc', id: 'work/forms', label: 'Forms' },
        { type: 'doc', id: 'work/boards-sprints', label: 'Boards and sprints' },
        { type: 'doc', id: 'work/search-jql', label: 'Search and JQL' },
        { type: 'doc', id: 'work/links-and-hierarchy', label: 'Links and hierarchy' },
        { type: 'doc', id: 'work/worklogs', label: 'Worklogs and timesheets' },
        { type: 'doc', id: 'work/attachments', label: 'Attachments' },
        { type: 'doc', id: 'work/user-interface', label: 'The web interface' },
      ],
    },
    {
      type: 'category',
      label: 'Integrate',
      collapsed: true,
      items: [
        { type: 'doc', id: 'integrate/api', label: 'API' },
        { type: 'doc', id: 'integrate/webhooks-and-apps', label: 'Webhooks and apps' },
        { type: 'doc', id: 'integrate/app-development', label: 'App development' },
        { type: 'doc', id: 'integrate/building-apps', label: 'Your own service' },
        { type: 'doc', id: 'integrate/tracker-as-code', label: 'Tracker as code' },
      ],
    },
    {
      type: 'category',
      label: 'Run Kanso',
      collapsed: true,
      items: [
        { type: 'doc', id: 'run/install', label: 'Install' },
        { type: 'doc', id: 'run/configuration', label: 'Configuration' },
        { type: 'doc', id: 'run/users-and-auth', label: 'Users and authentication' },
        { type: 'doc', id: 'run/architecture', label: 'Architecture' },
      ],
    },
    {
      type: 'category',
      label: 'Move from Jira',
      collapsed: true,
      items: [
        { type: 'doc', id: 'migrate/jira-migration', label: 'What moves, and how' },
        { type: 'doc', id: 'migrate/jira-import', label: 'The importer' },
      ],
    },
  ],
};

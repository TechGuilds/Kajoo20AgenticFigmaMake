export const DEFAULT_CHAT_PANEL_SIZE = 25;

export const DEFAULT_USER = {
  id: 'current-user',
  name: 'John Smith',
  email: 'john.smith@company.com',
  initials: 'JS'
};

export const DEFAULT_WORKSPACE_CONFIG = {
  sourceSystem: 'To be configured',
  targetSystem: 'To be configured',
  progress: 0,
  phase: 'setup' as const,
  teamSize: 1,
  estimatedDuration: 'TBD',
  projects: [],
  phaseProgress: {
    assessment: 0,
    setup: 0,
    migrate: 0,
    reconstruct: 0,
    launch: 0
  }
};
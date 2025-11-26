// Seed data for API endpoints
import type { Task, ChatThread, AiLog, Artifact } from '../../../types';

// Mock seed data
export const mockTasks: Task[] = [
  {
    id: 'task-001',
    projectId: '1',
    title: 'Analyze Current Sitecore Architecture',
    description: 'Comprehensive analysis of existing Sitecore XP architecture, including custom modules, integrations, and dependencies.',
    createdBy: { id: 'user-1', name: 'System' },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    category: 'architecture',
    phase: 'assessment',
    priority: 'high',
    assignedAgent: 'Architecture Analyst AI',
    humanReviewer: 'Senior Architect',
    estimatedHours: 16,
    actualHours: 14,
    progress: 100,
    artifactIds: ['artifact-001', 'artifact-002'],
    acceptanceCriteria: [
      'Complete inventory of all Sitecore components',
      'Dependency mapping documented',
      'Integration points identified',
      'Custom code analysis completed'
    ],
    tags: ['analysis', 'architecture', 'documentation'],
    jiraTicket: 'MIGR-101'
  },
  {
    id: 'task-002',
    projectId: '1',
    title: 'Setup Next.js Frontend Project',
    description: 'Initialize Next.js project with TypeScript, configure build pipeline, and setup development environment.',
    createdBy: { id: 'user-1', name: 'System' },
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in-progress',
    category: 'development',
    phase: 'setup',
    priority: 'high',
    assignedAgent: 'Frontend Setup AI',
    humanReviewer: 'Senior Developer',
    estimatedHours: 8,
    actualHours: 6,
    progress: 75,
    artifactIds: ['artifact-003'],
    acceptanceCriteria: [
      'Next.js project initialized',
      'TypeScript configured',
      'Build pipeline setup',
      'Development server running'
    ],
    tags: ['frontend', 'setup', 'nextjs']
  }
];

export const mockChatThreads: ChatThread[] = [
  {
    id: 'thread-project-1',
    projectId: '1',
    type: 'project',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'thread-task-001',
    projectId: '1',
    taskId: 'task-001',
    type: 'task',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
];

export const mockAiLogs: AiLog[] = [
  {
    id: 'log-001',
    threadId: 'thread-project-1',
    at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    role: 'human',
    message: 'Can you help me understand the current migration progress?'
  },
  {
    id: 'log-002',
    threadId: 'thread-project-1',
    at: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000).toISOString(),
    role: 'agent',
    message: 'I can see your Enterprise Portal Migration workspace is currently 75% complete. The architecture analysis is finished, and we\'re now working on component migration. Would you like me to show you the detailed breakdown?'
  },
  {
    id: 'log-003',
    threadId: 'thread-task-001',
    at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    role: 'system',
    message: 'You are the Task Execution Agent for Task task-001 in Project Enterprise Portal Migration. \n\nObjective: Analyze Current Sitecore Architecture\n\nDescription: Comprehensive analysis of existing Sitecore XP architecture, including custom modules, integrations, and dependencies.\n\nAcceptance Criteria:\n• Complete inventory of all Sitecore components\n• Dependency mapping documented\n• Integration points identified\n• Custom code analysis completed\n\nConstraints: This task is marked as high priority and requires senior architect review.'
  },
  {
    id: 'log-004',
    threadId: 'thread-task-001',
    at: new Date(Date.now() - 1 * 60 * 60 * 1000 + 60000).toISOString(),
    role: 'agent',
    message: 'I\'ve completed the architecture analysis. Here\'s a comprehensive report of the current Sitecore XP environment.',
    attachments: [
      {
        type: 'json',
        label: 'Architecture Analysis Report',
        content: JSON.stringify({
          sitecoreVersion: '10.2',
          customModules: 12,
          integrations: ['CRM', 'ERP', 'Analytics'],
          dependencies: ['SQL Server', 'Solr', 'Redis']
        }, null, 2),
        createArtifact: 'text'
      },
      {
        type: 'sitecore-diff',
        label: 'Content Tree Analysis',
        content: 'Analyzed 1,247 content items across 15 templates',
        createArtifact: 'sitecore'
      }
    ]
  }
];

export const mockArtifacts: Artifact[] = [
  {
    id: 'artifact-001',
    projectId: '1',
    taskId: 'task-001',
    type: 'text',
    label: 'Architecture Analysis Report',
    summary: 'Comprehensive analysis of Sitecore XP architecture',
    content: JSON.stringify({
      sitecoreVersion: '10.2',
      customModules: 12,
      integrations: ['CRM', 'ERP', 'Analytics'],
      dependencies: ['SQL Server', 'Solr', 'Redis'],
      recommendations: [
        'Migrate custom modules to headless architecture',
        'Consolidate integrations through GraphQL layer',
        'Implement caching strategy for performance'
      ]
    }, null, 2),
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'artifact-002',
    projectId: '1',
    taskId: 'task-001',
    type: 'sitecore',
    label: 'Content Tree Analysis',
    summary: 'Analysis of content structure and templates',
    meta: {
      itemCount: 1247,
      templateCount: 15,
      languageCount: 3,
      mediaCount: 342
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'artifact-003',
    projectId: '1',
    taskId: 'task-002',
    type: 'code',
    label: 'Next.js Project Setup',
    summary: 'Initial project structure and configuration',
    content: `// package.json\n{\n  "name": "sitecore-headless-app",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build",\n    "start": "next start"\n  },\n  "dependencies": {\n    "next": "14.0.0",\n    "react": "^18.0.0",\n    "typescript": "^5.0.0"\n  }\n}`,
    meta: {
      repository: 'https://github.com/company/sitecore-headless',
      branch: 'main',
      filesCreated: 15
    },
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
];
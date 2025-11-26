import { type Workspace, type Project, type Task } from '../types/entities';

const SAMPLE_TASKS: Task[] = [
  {
    id: 'task-1-1',
    title: 'Analyze existing content structure',
    description: 'Review current content architecture and identify migration requirements for the new platform.',
    status: 'completed',
    priority: 'high',
    type: 'assessment',
    projectId: 'proj-1-1',
    workspaceId: '1',
    assignedTo: {
      id: 'user-1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      initials: 'SJ'
    },
    createdBy: {
      id: 'user-1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      initials: 'SJ'
    },
    createdAt: '2024-01-16T08:00:00Z',
    updatedAt: '2024-02-15T16:30:00Z',
    dueDate: '2024-02-15T23:59:59Z',
    estimatedHours: 40,
    actualHours: 42,
    tags: ['content', 'analysis', 'architecture'],
    dependencies: [],
    artifacts: [
      {
        id: 'artifact-1',
        name: 'Content Architecture Report',
        type: 'document',
        createdAt: '2024-02-10T10:00:00Z',
        createdBy: {
          id: 'user-1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com',
          initials: 'SJ'
        }
      }
    ],
    comments: [
      {
        id: 'comment-1',
        content: 'Initial analysis shows complex nested content structure that will require careful mapping.',
        author: {
          id: 'user-1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com',
          initials: 'SJ'
        },
        createdAt: '2024-01-20T14:30:00Z',
        isAIGenerated: false
      }
    ]
  },
  {
    id: 'task-1-2',
    title: 'Create content mapping strategy',
    description: 'Define how existing content types will map to new platform structures.',
    status: 'completed',
    priority: 'high',
    type: 'assessment',
    projectId: 'proj-1-1',
    workspaceId: '1',
    assignedTo: {
      id: 'user-2',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      initials: 'MC'
    },
    createdBy: {
      id: 'user-1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      initials: 'SJ'
    },
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-28T15:00:00Z',
    dueDate: '2024-02-28T23:59:59Z',
    estimatedHours: 24,
    actualHours: 26,
    tags: ['mapping', 'strategy', 'content'],
    dependencies: ['task-1-1']
  },
  {
    id: 'task-2-1',
    title: 'Audit existing React components',
    description: 'Review all current MVC components and assess headless migration feasibility.',
    status: 'in-progress',
    priority: 'high',
    type: 'migration',
    projectId: 'proj-1-2',
    workspaceId: '1',
    assignedTo: {
      id: 'user-2',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      initials: 'MC'
    },
    createdBy: {
      id: 'user-2',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      initials: 'MC'
    },
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-08-14T11:30:00Z',
    dueDate: '2024-08-30T23:59:59Z',
    estimatedHours: 60,
    actualHours: 45,
    tags: ['components', 'audit', 'react'],
    dependencies: []
  },
  {
    id: 'task-2-2',
    title: 'Migrate header component',
    description: 'Convert existing MVC header component to headless React component.',
    status: 'review',
    priority: 'medium',
    type: 'migration',
    projectId: 'proj-1-2',
    workspaceId: '1',
    assignedTo: {
      id: 'user-3',
      name: 'Emma Wilson',
      email: 'emma.wilson@company.com',
      initials: 'EW'
    },
    createdBy: {
      id: 'user-2',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      initials: 'MC'
    },
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-08-12T14:20:00Z',
    dueDate: '2024-08-25T23:59:59Z',
    estimatedHours: 16,
    actualHours: 14,
    tags: ['header', 'component', 'migration'],
    dependencies: ['task-2-1']
  },
  {
    id: 'task-3-1',
    title: 'Setup authentication provider',
    description: 'Configure and test authentication system integration.',
    status: 'todo',
    priority: 'high',
    type: 'setup',
    projectId: 'proj-1-3',
    workspaceId: '1',
    assignedTo: {
      id: 'user-3',
      name: 'Emma Wilson',
      email: 'emma.wilson@company.com',
      initials: 'EW'
    },
    createdBy: {
      id: 'user-3',
      name: 'Emma Wilson',
      email: 'emma.wilson@company.com',
      initials: 'EW'
    },
    createdAt: '2024-03-20T08:00:00Z',
    updatedAt: '2024-08-10T16:00:00Z',
    dueDate: '2024-09-15T23:59:59Z',
    estimatedHours: 32,
    tags: ['authentication', 'security', 'setup'],
    dependencies: []
  },
  {
    id: 'task-3-2',
    title: 'Implement role-based permissions',
    description: 'Create user role management and permission system.',
    status: 'blocked',
    priority: 'medium',
    type: 'setup',
    projectId: 'proj-1-3',
    workspaceId: '1',
    assignedTo: {
      id: 'user-3',
      name: 'Emma Wilson',
      email: 'emma.wilson@company.com',
      initials: 'EW'
    },
    createdBy: {
      id: 'user-3',
      name: 'Emma Wilson',
      email: 'emma.wilson@company.com',
      initials: 'EW'
    },
    createdAt: '2024-04-01T09:00:00Z',
    updatedAt: '2024-08-08T10:15:00Z',
    dueDate: '2024-10-01T23:59:59Z',
    estimatedHours: 40,
    tags: ['permissions', 'roles', 'security'],
    dependencies: ['task-3-1'],
    comments: [
      {
        id: 'comment-2',
        content: 'Blocked pending authentication provider configuration completion.',
        author: {
          id: 'user-3',
          name: 'Emma Wilson',
          email: 'emma.wilson@company.com',
          initials: 'EW'
        },
        createdAt: '2024-08-08T10:15:00Z',
        isAIGenerated: false
      }
    ]
  }
];

export const INITIAL_WORKSPACES: Workspace[] = [
  { 
    id: '1', 
    name: 'Enterprise Portal Migration',
    description: 'Large-scale enterprise portal migration from legacy Sitecore to cloud-native architecture',
    status: 'active',
    sourceSystem: 'Sitecore XP 10.2 MVC',
    targetSystem: 'Sitecore XM Cloud',
    progress: 75,
    phase: 'migrate',
    createdAt: '2024-01-15T08:00:00Z',
    lastActivity: '2024-08-14T16:30:00Z',
    teamSize: 8,
    estimatedDuration: '8 months',
    createdBy: {
      id: 'user-1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      initials: 'SJ'
    },
    phaseProgress: {
      assessment: 100,
      setup: 100,
      migrate: 65,
      reconstruct: 20,
      launch: 0
    },
    workspaceStats: {
      totalProjects: 5,
      activeProjects: 3,
      totalTasks: 6,
      completedTasks: 2
    },
    projects: [
      {
        id: 'proj-1-1',
        name: 'Content Architecture Analysis',
        description: 'Analyze existing content structure and mapping requirements',
        status: 'completed',
        progress: 100,
        workspaceId: '1',
        createdBy: {
          id: 'user-1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com',
          initials: 'SJ'
        },
        createdAt: '2024-01-16T08:00:00Z',
        updatedAt: '2024-02-28T17:00:00Z',
        dueDate: '2024-02-28T23:59:59Z',
        tags: ['analysis', 'content', 'architecture'],
        tasks: SAMPLE_TASKS.filter(t => t.projectId === 'proj-1-1'),
        taskStats: {
          total: 2,
          completed: 2,
          inProgress: 0,
          blocked: 0
        }
      },
      {
        id: 'proj-1-2',
        name: 'Component Library Migration',
        description: 'Migrate existing MVC components to headless architecture',
        status: 'active',
        progress: 60,
        workspaceId: '1',
        createdBy: {
          id: 'user-2',
          name: 'Michael Chen',
          email: 'michael.chen@company.com',
          initials: 'MC'
        },
        createdAt: '2024-02-01T09:00:00Z',
        updatedAt: '2024-08-14T14:30:00Z',
        dueDate: '2024-09-30T23:59:59Z',
        tags: ['components', 'migration', 'development'],
        tasks: SAMPLE_TASKS.filter(t => t.projectId === 'proj-1-2'),
        taskStats: {
          total: 2,
          completed: 0,
          inProgress: 1,
          blocked: 0
        }
      },
      {
        id: 'proj-1-3',
        name: 'User Authentication Setup',
        description: 'Configure authentication and authorization for new platform',
        status: 'active',
        progress: 30,
        workspaceId: '1',
        createdBy: {
          id: 'user-3',
          name: 'Emma Wilson',
          email: 'emma.wilson@company.com',
          initials: 'EW'
        },
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-08-10T15:45:00Z',
        dueDate: '2024-10-15T23:59:59Z',
        tags: ['security', 'authentication', 'configuration'],
        tasks: SAMPLE_TASKS.filter(t => t.projectId === 'proj-1-3'),
        taskStats: {
          total: 2,
          completed: 0,
          inProgress: 0,
          blocked: 1
        }
      },
      {
        id: 'proj-1-4',
        name: 'Performance Testing',
        description: 'Comprehensive performance testing and optimization',
        status: 'planning',
        progress: 0,
        workspaceId: '1',
        createdBy: {
          id: 'user-1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com',
          initials: 'SJ'
        },
        createdAt: '2024-04-01T09:00:00Z',
        updatedAt: '2024-08-05T11:20:00Z',
        tags: ['testing', 'performance', 'optimization'],
        tasks: [],
        taskStats: {
          total: 0,
          completed: 0,
          inProgress: 0,
          blocked: 0
        }
      },
      {
        id: 'proj-1-5',
        name: 'SEO Migration Strategy',
        description: 'Ensure SEO rankings are maintained during migration',
        status: 'planning',
        progress: 0,
        workspaceId: '1',
        createdBy: {
          id: 'user-2',
          name: 'Michael Chen',
          email: 'michael.chen@company.com',
          initials: 'MC'
        },
        createdAt: '2024-04-10T08:30:00Z',
        updatedAt: '2024-08-01T16:10:00Z',
        tags: ['seo', 'strategy', 'marketing'],
        tasks: [],
        taskStats: {
          total: 0,
          completed: 0,
          inProgress: 0,
          blocked: 0
        }
      }
    ]
  },
  { 
    id: '2', 
    name: 'E-commerce Platform Migration',
    description: 'Migration of commerce platform with complex product catalog and integrations',
    status: 'planning',
    sourceSystem: 'Sitecore Commerce 10.1',
    targetSystem: 'Optimizely Commerce',
    progress: 15,
    phase: 'setup',
    createdAt: '2024-07-20T09:00:00Z',
    lastActivity: '2024-08-12T14:20:00Z',
    teamSize: 5,
    estimatedDuration: '12 months',
    createdBy: {
      id: 'user-2',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      initials: 'MC'
    },
    phaseProgress: {
      assessment: 100,
      setup: 60,
      migrate: 0,
      reconstruct: 0,
      launch: 0
    },
    workspaceStats: {
      totalProjects: 3,
      activeProjects: 1,
      totalTasks: 0,
      completedTasks: 0
    },
    projects: [
      {
        id: 'proj-2-1',
        name: 'Product Catalog Assessment',
        description: 'Analyze current product catalog structure and requirements',
        status: 'active',
        progress: 45,
        workspaceId: '2',
        createdBy: {
          id: 'user-2',
          name: 'Michael Chen',
          email: 'michael.chen@company.com',
          initials: 'MC'
        },
        createdAt: '2024-07-21T10:00:00Z',
        updatedAt: '2024-08-12T16:30:00Z',
        dueDate: '2024-09-15T23:59:59Z',
        tags: ['catalog', 'assessment', 'products'],
        tasks: [],
        taskStats: {
          total: 0,
          completed: 0,
          inProgress: 0,
          blocked: 0
        }
      },
      {
        id: 'proj-2-2',
        name: 'Payment Gateway Integration',
        description: 'Setup and configure payment processing systems',
        status: 'planning',
        progress: 0,
        workspaceId: '2',
        createdBy: {
          id: 'user-2',
          name: 'Michael Chen',
          email: 'michael.chen@company.com',
          initials: 'MC'
        },
        createdAt: '2024-08-01T09:30:00Z',
        updatedAt: '2024-08-10T11:15:00Z',
        tags: ['payment', 'integration', 'commerce'],
        tasks: [],
        taskStats: {
          total: 0,
          completed: 0,
          inProgress: 0,
          blocked: 0
        }
      },
      {
        id: 'proj-2-3',
        name: 'Order Management System',
        description: 'Design and implement order processing workflows',
        status: 'planning',
        progress: 0,
        workspaceId: '2',
        createdBy: {
          id: 'user-3',
          name: 'Emma Wilson',
          email: 'emma.wilson@company.com',
          initials: 'EW'
        },
        createdAt: '2024-08-05T14:00:00Z',
        updatedAt: '2024-08-08T09:45:00Z',
        tags: ['orders', 'workflow', 'management'],
        tasks: [],
        taskStats: {
          total: 0,
          completed: 0,
          inProgress: 0,
          blocked: 0
        }
      }
    ]
  },
  { 
    id: '3', 
    name: 'Corporate Website Modernization',
    description: 'Complete modernization of corporate website with improved performance and UX',
    status: 'completed',
    sourceSystem: 'Sitecore XP 9.3',
    targetSystem: 'Sitecore XM Cloud + Next.js',
    progress: 100,
    phase: 'completed',
    createdAt: '2023-10-05T08:00:00Z',
    lastActivity: '2024-06-15T17:30:00Z',
    teamSize: 6,
    estimatedDuration: '6 months',
    createdBy: {
      id: 'user-3',
      name: 'Emma Wilson',
      email: 'emma.wilson@company.com',
      initials: 'EW'
    },
    phaseProgress: {
      assessment: 100,
      setup: 100,
      migrate: 100,
      reconstruct: 100,
      launch: 100
    },
    workspaceStats: {
      totalProjects: 2,
      activeProjects: 0,
      totalTasks: 0,
      completedTasks: 0
    },
    projects: [
      {
        id: 'proj-3-1',
        name: 'Design System Implementation',
        description: 'Implement modern design system across all pages',
        status: 'completed',
        progress: 100,
        workspaceId: '3',
        createdBy: {
          id: 'user-3',
          name: 'Emma Wilson',
          email: 'emma.wilson@company.com',
          initials: 'EW'
        },
        createdAt: '2023-10-06T09:00:00Z',
        updatedAt: '2024-02-15T16:00:00Z',
        tags: ['design', 'system', 'ui'],
        tasks: [],
        taskStats: {
          total: 0,
          completed: 0,
          inProgress: 0,
          blocked: 0
        }
      },
      {
        id: 'proj-3-2',
        name: 'Content Migration',
        description: 'Migrate all existing content to new platform',
        status: 'completed',
        progress: 100,
        workspaceId: '3',
        createdBy: {
          id: 'user-1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com',
          initials: 'SJ'
        },
        createdAt: '2023-11-01T10:00:00Z',
        updatedAt: '2024-04-30T15:30:00Z',
        tags: ['content', 'migration', 'data'],
        tasks: [],
        taskStats: {
          total: 0,
          completed: 0,
          inProgress: 0,
          blocked: 0
        }
      }
    ]
  }
];
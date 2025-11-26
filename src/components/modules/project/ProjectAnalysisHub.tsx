import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { TaskContextChatPanel } from '@/components/modules/chat/TaskContextChatPanel';
import { TaskDetailView } from '@/components/modules/task/TaskDetailView';
import type { RouteContext, Task as TaskType, TaskStatus } from '@/types';
import { 
  Settings,
  Filter,
  Search,
  Calendar,
  User,
  Clock,

  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Circle,
  Zap,
  Bot,
  Users,
  FileText,
  Code,
  Database,
  TestTube,
  Rocket,
  BarChart3,
  ListTodo,
  CalendarDays,
  ExternalLink,
  Star,
  MessageSquare,
  ArrowRight,
  Activity,

  GitBranch,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Edit3,
  Check,
  X,
  Save,
  RotateCcw,
  PanelRightClose,
  PanelRightOpen,
  ArrowLeft
} from 'lucide-react';

// Using Task and TaskStatus types from @/types

import { type Workspace, type Project } from '@/types';

interface ProjectAnalysisHubProps {
  selectedProject: Project | Workspace | any;
  selectedWorkspace?: Workspace | null;
  onTaskTrigger: (taskId: string, context?: string, task?: TaskType) => void;
  onJiraSync: (tasks: any[]) => void;
  chatCollapsed: boolean;
  onChatToggle: () => void;
  chatPanelSize: number;
  onChatPanelResize: (size: number) => void;
  taskPrompt?: string;
  onPromptProcessed?: () => void;
}

// Mock data - this would come from AI task generation in a real implementation
const generateAITasks = (project: any): TaskType[] => {
  const baseDate = new Date();
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  };

  // If we have a workspace with projects, map tasks to specific projects
  let targetProjectId = project?.id;
  
  // For workspace-level view, we'll link tasks to specific projects
  if (project?.projects && project.projects.length > 0) {
    // Content Architecture Analysis project for architecture tasks
    const contentArchProject = project.projects.find((p: any) => p.name === 'Content Architecture Analysis');
    // Component Library Migration project for development tasks
    const componentProject = project.projects.find((p: any) => p.name === 'Component Library Migration');
    
    // Default to Content Architecture Analysis project
    if (contentArchProject) {
      targetProjectId = contentArchProject.id;
    }
  }

  return [
    // Architecture Tasks
    {
      id: 'arch-001',
      projectId: targetProjectId || '1',
      title: 'Analyze Current Sitecore Architecture',
      description: `## Scope
Comprehensive analysis of existing Sitecore XP architecture, including custom modules, integrations, and dependencies. This task involves deep-dive analysis of the current system to understand all components, their relationships, and potential migration challenges.

## Acceptance Criteria
- Complete inventory of all Sitecore components
- Dependency mapping documented
- Integration points identified  
- Custom code analysis completed

## AI Execution Strategy
The Architecture Analyst AI will systematically scan the Sitecore XP implementation, analyzing configuration files, custom code repositories, and integration points. It will use static code analysis tools and dependency mapping algorithms to create a comprehensive architecture blueprint that serves as the foundation for migration planning.`,
      status: 'completed',
      priority: 'high',
      assignedAgent: 'Architecture Analyst AI',
      humanReviewer: 'Senior Architect',
      estimatedHours: 16,
      dependencies: [],
      tags: ['analysis', 'architecture', 'documentation'],
      jiraTicket: 'MIGR-101',
      aiContext: 'Analyze Sitecore XP architecture with focus on custom implementations and third-party integrations',
      createdAt: addDays(baseDate, -15),
      updatedAt: addDays(baseDate, -2),
      createdBy: { id: 'user-1', name: 'System' }
    },
    {
      id: 'arch-002',
      projectId: targetProjectId || '1',
      title: 'Design Headless Architecture Blueprint',
      description: `## Scope
Create detailed architecture design for Sitecore XM Cloud headless implementation with Next.js frontend. This includes defining the technology stack, API strategies, security considerations, and integration patterns for the new headless architecture.

## Acceptance Criteria
- Headless architecture diagram created
- Technology stack defined
- API strategy documented
- Security considerations outlined

## AI Execution Strategy
The Solution Designer AI will leverage the analysis from the architecture assessment task to design an optimal headless architecture. It will consider modern best practices, performance requirements, scalability needs, and integration requirements to create a comprehensive blueprint that guides the entire migration effort.`,
      status: 'in-progress',
      priority: 'high',
      assignedAgent: 'Solution Designer AI',
      humanReviewer: 'Lead Architect',
      estimatedHours: 24,
      dependencies: [
        { id: 'arch-001', title: 'Architecture Analysis', jiraKey: 'MIGR-101' }
      ],
      tags: ['architecture', 'headless', 'design'],
      aiContext: 'Design modern headless architecture leveraging Sitecore XM Cloud capabilities',
      createdAt: addDays(baseDate, -10),
      updatedAt: addDays(baseDate, 0),
      createdBy: { id: 'user-1', name: 'System' }
    },
    
    // Development Tasks
    {
      id: 'dev-001',
      projectId: (project?.projects?.find((p: any) => p.name === 'Component Library Migration')?.id) || targetProjectId || '1',
      title: 'Setup Next.js Frontend Project',
      description: `## Scope
Initialize Next.js project with TypeScript, configure build pipeline, and setup development environment. This foundational task establishes the frontend development environment with all necessary tooling, linting, and build processes.

## Acceptance Criteria
- Next.js project initialized with TypeScript
- Build pipeline setup and configured
- Development server running and accessible
- ESLint and Prettier configured for code quality

## AI Execution Strategy
The Frontend Setup AI will create a modern Next.js project following industry best practices. It will configure TypeScript for type safety, setup build optimization, configure development tooling, and establish coding standards that will be used throughout the migration project.`,
      status: 'completed',
      priority: 'high',
      assignedAgent: 'Frontend Setup AI',
      humanReviewer: 'Senior Developer',
      estimatedHours: 8,
      dependencies: [
        { id: 'arch-002', title: 'Architecture Blueprint' }
      ],
      tags: ['frontend', 'nextjs', 'setup'],
      jiraTicket: 'MIGR-201',
      aiContext: 'Setup Next.js frontend with best practices for Sitecore headless integration',
      createdAt: addDays(baseDate, -8),
      updatedAt: addDays(baseDate, -3),
      createdBy: { id: 'user-1', name: 'System' }
    },
    {
      id: 'dev-002',
      projectId: (project?.projects?.find((p: any) => p.name === 'Component Library Migration')?.id) || targetProjectId || '1',
      title: 'Migrate Component Library',
      description: `## Scope
Convert existing Sitecore MVC components to React components compatible with Next.js and Sitecore JSS. This involves analyzing the current component library, creating modern React equivalents, and ensuring proper integration with the headless architecture.

## Acceptance Criteria
- All components migrated to React with TypeScript
- Component library documentation updated
- Unit tests created for all components
- Storybook integration completed for component showcase

## AI Execution Strategy
The Component Migration AI will systematically analyze each MVC component, understanding its functionality, data requirements, and rendering logic. It will then generate modern React components using functional patterns, hooks, and TypeScript interfaces that work seamlessly with the Sitecore JSS framework.`,
      status: 'in-progress',
      priority: 'high',
      assignedAgent: 'Component Migration AI',
      humanReviewer: 'Frontend Lead',
      estimatedHours: 40,
      dependencies: [
        { id: 'dev-001', title: 'Frontend Setup' },
        { id: 'cont-001', title: 'Content Model Migration' }
      ],
      tags: ['components', 'migration', 'react'],
      aiContext: 'Migrate Sitecore MVC components to modern React components with TypeScript',
      createdAt: addDays(baseDate, -5),
      updatedAt: addDays(baseDate, 0),
      createdBy: { id: 'user-1', name: 'System' }
    },
    
    // Content Tasks
    {
      id: 'cont-001',
      title: 'Migrate Content Models',
      description: `## Scope
Analyze and migrate Sitecore data templates to headless-compatible content models in XM Cloud. This includes mapping existing template structures, preserving field relationships, and creating migration scripts for seamless content transfer.

## Acceptance Criteria
- All templates mapped to headless-compatible models
- Field mappings documented with type conversions
- Content relationships preserved and validated
- Migration scripts created and tested

## AI Execution Strategy
The Content Model AI will analyze the existing Sitecore template hierarchy, identify field types and relationships, and generate corresponding content models for XM Cloud. It will create comprehensive mapping documentation and automated migration scripts to ensure data integrity during the transition.`,
      status: 'in-progress',
      priority: 'medium',
      assignedAgent: 'Content Model AI',
      humanReviewer: 'Content Architect',
      estimatedHours: 20,
      dependencies: [
        { id: 'arch-001', title: 'Architecture Analysis' }
      ],
      tags: ['content', 'templates', 'migration'],
      jiraTicket: 'MIGR-301',
      aiContext: 'Migrate Sitecore data templates preserving relationships and field types',
      createdAt: addDays(baseDate, -7),
      updatedAt: addDays(baseDate, 0),
      projectId: project?.id || '1',
      createdBy: { id: 'user-1', name: 'System' }
    },
    {
      id: 'cont-002',
      title: 'Content Migration Strategy',
      description: `## Scope
Develop comprehensive strategy for migrating existing content from Sitecore XP to XM Cloud. This includes content auditing, migration planning, timeline development, and rollback planning to ensure minimal disruption during the migration process.

## Acceptance Criteria
- Migration strategy documented with detailed phases
- Content audit completed with inventory and assessment
- Migration timeline defined with dependencies
- Rollback plan created for risk mitigation

## AI Execution Strategy
The Content Strategy AI will analyze the content volume, complexity, and dependencies to create an optimal migration strategy. It will identify content that needs updates, plan batch migration approaches, and develop contingency plans to ensure smooth content transition with minimal downtime.`,
      status: 'todo',
      priority: 'medium',
      assignedAgent: 'Content Strategy AI',
      humanReviewer: 'Content Manager',
      estimatedHours: 12,
      dependencies: [
        { id: 'cont-001', title: 'Content Model Migration' }
      ],
      tags: ['content', 'strategy', 'planning'],
      aiContext: 'Develop content migration strategy with minimal downtime and data integrity',
      createdAt: addDays(baseDate, -3),
      updatedAt: addDays(baseDate, -3),
      projectId: project?.id || '1',
      createdBy: { id: 'user-1', name: 'System' }
    },
    
    // Testing Tasks
    {
      id: 'test-001',
      title: 'Automated Testing Setup',
      description: `## Scope
Configure automated testing pipeline including unit tests, integration tests, and E2E testing. This establishes the quality assurance framework for the headless Sitecore application with comprehensive test coverage and CI/CD integration.

## Acceptance Criteria
- Jest and Testing Library configured for unit testing
- Cypress E2E tests setup and running
- CI/CD pipeline integration completed
- Test coverage reporting configured and accessible

## AI Execution Strategy
The QA Automation AI will establish a robust testing framework covering all application layers. It will configure testing tools, create sample test cases, integrate with the build pipeline, and establish coverage reporting to ensure high-quality code delivery throughout the migration process.`,
      status: 'blocked',
      priority: 'medium',
      assignedAgent: 'QA Automation AI',
      humanReviewer: 'QA Lead',
      estimatedHours: 16,
      dependencies: [
        { id: 'dev-001', title: 'Frontend Setup' }
      ],
      tags: ['testing', 'automation', 'qa'],
      jiraTicket: 'MIGR-401',
      aiContext: 'Setup comprehensive testing strategy for headless Sitecore application',
      createdAt: addDays(baseDate, -4),
      updatedAt: addDays(baseDate, -1),
      projectId: project?.id || '1',
      createdBy: { id: 'user-1', name: 'System' }
    },
    
    // Deployment Tasks
    {
      id: 'deploy-001',
      title: 'Production Environment Setup',
      description: `## Scope
Configure production hosting environment for headless Sitecore application with CDN and monitoring. This includes setting up scalable infrastructure, performance optimization, security configuration, and comprehensive monitoring for the production deployment.

## Acceptance Criteria
- Production environment configured with proper scaling
- CDN setup completed for optimal content delivery
- Monitoring and logging configured for observability
- SSL certificates installed and configured

## AI Execution Strategy
The DevOps AI will design and implement a production-ready infrastructure using cloud best practices. It will configure auto-scaling, implement security measures, setup monitoring and alerting systems, and ensure optimal performance for the headless Sitecore application in production.`,
      status: 'todo',
      priority: 'high',
      assignedAgent: 'DevOps AI',
      humanReviewer: 'DevOps Engineer',
      estimatedHours: 20,
      dependencies: [
        { id: 'test-001', title: 'Testing Setup' },
        { id: 'dev-002', title: 'Component Migration' }
      ],
      tags: ['deployment', 'production', 'infrastructure'],
      aiContext: 'Setup production environment with optimal performance and monitoring for headless Sitecore',
      createdAt: addDays(baseDate, -2),
      updatedAt: addDays(baseDate, -2),
      projectId: project?.id || '1',
      createdBy: { id: 'user-1', name: 'System' }
    }
  ];
};

export function ProjectAnalysisHub({ selectedProject, selectedWorkspace, onTaskTrigger, onJiraSync, chatCollapsed, onChatToggle, chatPanelSize, onChatPanelResize, taskPrompt, onPromptProcessed }: ProjectAnalysisHubProps) {
  const [tasks, setTasks] = useState<TaskType[]>(generateAITasks(selectedProject));
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'task-detail'>('list');
  const [chatContext, setChatContext] = useState<RouteContext>({
    projectId: selectedProject?.id || '1',
    type: 'project'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [labelFilter, setLabelFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [editingTasks, setEditingTasks] = useState<Set<string>>(new Set());
  const [editingFields, setEditingFields] = useState<Record<string, Record<string, any>>>({});

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      
      const matchesLabel = labelFilter === 'all' || task.tags?.includes(labelFilter);
      
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesLabel && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, labelFilter, priorityFilter]);

  // Get unique labels from all tasks for filter dropdown
  const availableLabels = useMemo(() => {
    const allLabels = new Set<string>();
    tasks.forEach(task => {
      task.tags?.forEach(tag => allLabels.add(tag));
    });
    return Array.from(allLabels).sort();
  }, [tasks]);



  // Calculate progress statistics
  const projectStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const blockedTasks = tasks.filter(t => t.status === 'blocked').length;
    const totalHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      blockedTasks,
      completionRate: Math.round((completedTasks / totalTasks) * 100),
      totalHours
    };
  }, [tasks]);



  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="size-4 text-success" />;
      case 'in-progress': return <Play className="size-4 text-primary" />;
      case 'under-review': return <User className="size-4 text-primary" />;
      case 'blocked': return <AlertTriangle className="size-4 text-destructive" />;
      case 'cancelled': return <Circle className="size-4 text-muted-foreground" />;
      default: return <Circle className="size-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed': 
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Done</Badge>;
      case 'in-progress': 
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">In Progress</Badge>;
      case 'under-review': 
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Under Review</Badge>;
      case 'blocked': 
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Blocked</Badge>;
      case 'cancelled': 
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/20">Cancelled</Badge>;
      default: 
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/20">To Do</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high': return 'bg-warning/10 text-warning border-warning/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-muted text-muted-foreground border-muted-foreground/20';
      default: return 'bg-muted text-muted-foreground border-muted-foreground/20';
    }
  };






  const handleTaskSelect = (taskId: string, checked: boolean) => {
    const newSelected = new Set(selectedTasks);
    if (checked) {
      newSelected.add(taskId);
    } else {
      newSelected.delete(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const handleBulkAction = (action: 'jira-sync' | 'export' | 'ai-execute') => {
    const selectedTaskData = tasks.filter(t => selectedTasks.has(t.id));
    
    switch (action) {
      case 'jira-sync':
        onJiraSync(selectedTaskData);
        break;
      case 'export':
        console.log('Export tasks:', selectedTaskData);
        break;
      case 'ai-execute':
        selectedTaskData.forEach(task => {
          if (task.status === 'todo' || task.status === 'in-progress') {
            onTaskTrigger(task.id, task.aiContext, task);
          }
        });
        break;
    }
  };

  const handleEditTask = (taskId: string) => {
    // Navigate to task detail view where inline editing happens
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    handleTaskRowClick(task);
  };

  const handleCancelEdit = (taskId: string) => {
    setEditingTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(taskId);
      return newSet;
    });
    setEditingFields(prev => {
      const newFields = { ...prev };
      delete newFields[taskId];
      return newFields;
    });
  };

  const handleSaveTask = (taskId: string) => {
    const editedFields = editingFields[taskId];
    if (!editedFields) return;

    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? {
            ...task,
            ...editedFields,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : task
    ));

    handleCancelEdit(taskId);
  };

  const handleFieldChange = (taskId: string, field: string, value: any) => {
    setEditingFields(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value
      }
    }));
  };

  const handleTaskRowClick = (task: TaskType) => {
    setSelectedTaskId(task.id);
    setViewMode('task-detail');
    setChatContext({
      projectId: selectedProject?.id || '1',
      taskId: task.id,
      type: 'task'
    });
    
    // Note: Task context is now only sent when Execute button is explicitly clicked
    // This improves UX by preventing unnecessary context transmission
  };

  const handleBackToTaskList = () => {
    setViewMode('list');
    setSelectedTaskId(null);
    setChatContext({
      projectId: selectedProject?.id || '1',
      type: 'project'
    });
  };

  const handleChatContextChange = (newContext: RouteContext) => {
    setChatContext(newContext);
    if (newContext.type === 'project') {
      setSelectedTaskId(null);
      setViewMode('list');
    } else if (newContext.taskId) {
      setSelectedTaskId(newContext.taskId);
      setViewMode('task-detail');
    }
  };

  // Task Controls Toolbar Component
  const TaskControlsToolbar = () => {
    return (
      <div className="border-b bg-card/50 backdrop-blur-sm flex-shrink-0" style={{ padding: 'var(--spacing-4)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between" style={{ gap: 'var(--spacing-4)' }}>
          {/* Left Section: Task Stats */}
          <div className="flex items-center" style={{ gap: 'var(--spacing-4)' }}>
            {/* Quick Stats */}
            <div className="flex items-center text-muted-foreground" style={{ gap: 'var(--spacing-3)' }}>
              <span className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                <Circle className="size-3 fill-current text-muted-foreground/60" />
                {filteredTasks.length} tasks
              </span>
              {selectedTasks.size > 0 && (
                <span className="flex items-center text-primary" style={{ gap: 'var(--spacing-1)' }}>
                  <CheckCircle2 className="size-3" />
                  {selectedTasks.size} selected
                </span>
              )}
            </div>
          </div>
          
          {/* Right Section: Search + Filters */}
          <div className="flex items-center" style={{ gap: 'var(--spacing-3)' }}>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-3.5 text-muted-foreground/70" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 lg:w-80 pl-9 h-9"
              />
              {searchQuery && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="size-3" />
                </Button>
              )}
            </div>
            
            {/* Filters */}
            <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                <SelectTrigger className="w-28 h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={labelFilter} onValueChange={setLabelFilter}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue placeholder="Labels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Labels</SelectItem>
                  {availableLabels.map((label) => (
                    <SelectItem key={label} value={label}>
                      {label.charAt(0).toUpperCase() + label.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-28 h-9">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear filters button */}
              {(statusFilter !== 'all' || labelFilter !== 'all' || priorityFilter !== 'all' || searchQuery) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setStatusFilter('all');
                    setLabelFilter('all');
                    setPriorityFilter('all');
                    setSearchQuery('');
                  }}
                  className="h-9"
                  style={{ padding: 'var(--spacing-3)' }}
                >
                  <RotateCcw className="size-3.5" style={{ marginRight: 'var(--spacing-1)' }} />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Bulk Action Toolbar Component
  const BulkActionToolbar = () => {
    if (selectedTasks.size === 0) return null;

    return (
      <div className="bg-primary/10 border border-primary/20 rounded-lg" style={{ padding: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
            <span>{selectedTasks.size} task(s) selected</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedTasks(new Set())}
              className="h-6"
              style={{ padding: 'var(--spacing-2)' }}
            >
              <X className="size-3" />
              Clear
            </Button>
          </div>
          <div className="flex" style={{ gap: 'var(--spacing-2)' }}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('jira-sync')}
              className="h-7"
              style={{ padding: 'var(--spacing-3)' }}
            >
              <ExternalLink className="size-3" style={{ marginRight: 'var(--spacing-1)' }} />
              Sync to JIRA
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('ai-execute')}
              className="h-7"
              style={{ padding: 'var(--spacing-3)' }}
            >
              <Zap className="size-3" style={{ marginRight: 'var(--spacing-1)' }} />
              Execute with AI
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="h-full flex flex-col">
      {/* Content Area with Chat Panel */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup 
          direction="horizontal" 
          className="h-full"
          onLayout={(sizes) => {
            if (!chatCollapsed && sizes.length === 2) {
              onChatPanelResize(sizes[0]);
            }
          }}
        >
          {/* AI Chat Panel - Left Side */}
          {!chatCollapsed && (
            <>
              <ResizablePanel 
                id="chat-panel" 
                defaultSize={chatPanelSize} 
                minSize={20} 
                maxSize={40}
              >
                <div className="h-full border-r">
                  <TaskContextChatPanel 
                    context={chatContext}
                    task={selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : undefined}
                    onContextChange={handleChatContextChange}
                    taskPrompt={taskPrompt}
                    onPromptProcessed={onPromptProcessed}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle className="w-2 bg-border hover:bg-primary/20 active:bg-primary/30 transition-colors cursor-col-resize flex items-center justify-center group">
                <div className="w-1 h-8 bg-border group-hover:bg-primary/50 rounded-full transition-colors"></div>
              </ResizableHandle>
            </>
          )}

          {/* Task Content Panel - Right Side */}
          <ResizablePanel 
            id="tasks-panel" 
            defaultSize={chatCollapsed ? 100 : (100 - chatPanelSize)} 
            minSize={chatCollapsed ? 100 : 50}
          >
            <div className="h-full flex flex-col">
              {viewMode === 'task-detail' ? (
                /* Task Detail View - Full Panel */
                <>
                  {/* Back Button Header */}
                  <div className="border-b bg-card/50" style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                    <Button
                      variant="ghost"
                      onClick={handleBackToTaskList}
                    >
                      <ArrowLeft className="size-4" style={{ marginRight: 'var(--spacing-2)' }} />
                      Back to Tasks
                    </Button>
                  </div>
                  
                  {/* Task Detail Content */}
                  <div className="flex-1 overflow-hidden">
                    {selectedTaskId && (
                      <TaskDetailView
                        task={tasks.find(t => t.id === selectedTaskId)!}
                        projectId={selectedProject?.id || '1'}
                        onEdit={(task) => console.log('Edit task:', task)}
                        onExecute={(task) => {
                          if (onTaskTrigger && typeof onTaskTrigger === 'function') {
                            if (chatCollapsed) {
                              onChatToggle();
                            }
                            
                            const taskContext = `Please help me execute this task: ${task.title}\n\nDescription: ${task.description}\nPriority: ${task.priority}\nStatus: ${task.status}`;
                            onTaskTrigger(task.id, taskContext, task);
                          }
                        }}
                        className="h-full"
                      />
                    )}
                  </div>
                </>
              ) : (
                /* Task List View */
                <>
                  {/* Task Controls Toolbar */}
                  <TaskControlsToolbar />
              
                  {/* Task Content Area */}
                  <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto">
                      <div style={{ padding: 'var(--spacing-4)' }}>
                        <BulkActionToolbar />
                        
                        {/* Task List */}
                        <div style={{ gap: 'var(--spacing-3)' }} className="flex flex-col">
                          {filteredTasks.length === 0 ? (
                            <div className="text-center" style={{ paddingTop: 'var(--spacing-12)', paddingBottom: 'var(--spacing-12)' }}>
                              <Circle className="size-12 text-muted-foreground mx-auto" style={{ marginBottom: 'var(--spacing-4)' }} />
                              <h3 style={{ marginBottom: 'var(--spacing-2)' }}>No tasks found</h3>
                              <p className="text-muted-foreground">
                                Try adjusting your filters or search terms
                              </p>
                            </div>
                          ) : (
                            filteredTasks.map((task) => (
                              <Card 
                                key={task.id} 
                                className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                                  selectedTaskId === task.id ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' : ''
                                }`}
                                onClick={() => handleTaskRowClick(task)}
                              >
                                <CardContent style={{ padding: 'var(--spacing-4)', margin: '0' }}>
                                  {/* Top row with checkbox, status icon, title, and badges */}
                                  <div className="flex items-start" style={{ gap: 'var(--spacing-3)', margin: '0' }}>
                                    <Checkbox
                                      checked={selectedTasks.has(task.id)}
                                      onCheckedChange={(checked) => handleTaskSelect(task.id, checked as boolean)}
                                      onClick={(e) => e.stopPropagation()}
                                      className="mt-0.5"
                                    />
                                    
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                                        {getStatusIcon(task.status)}
                                        <h4>{task.title}</h4>
                                        <div className="flex ml-auto" style={{ gap: 'var(--spacing-2)' }}>
                                          <Badge variant="outline" className={getPriorityColor(task.priority || 'medium')}>
                                            {task.priority || 'medium'}
                                          </Badge>
                                          {getStatusBadge(task.status)}
                                        </div>
                                      </div>
                                      
                                      {/* Description */}
                                      {task.description && (
                                        <p className="text-muted-foreground line-clamp-2" style={{ marginBottom: 'var(--spacing-3)' }}>
                                          {task.description.split('\n')[0].replace(/^#+\s*/, '')}
                                        </p>
                                      )}
                                      
                                      {/* Labels */}
                                      {task.tags && task.tags.length > 0 && (
                                        <div className="flex flex-wrap" style={{ gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-3)' }}>
                                          {task.tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="h-5" style={{ padding: 'var(--spacing-2)' }}>
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                      
                                      {/* Bottom metadata row */}
                                      <div className="flex items-center justify-between text-muted-foreground" style={{ marginBottom: 'var(--spacing-3)' }}>
                                        <div className="flex items-center" style={{ gap: 'var(--spacing-4)' }}>
                                          {task.assignedAgent && (
                                            <span className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                                              <Bot className="size-3" />
                                              {task.assignedAgent}
                                            </span>
                                          )}
                                          {task.estimatedHours && (
                                            <span className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                                              <Clock className="size-3" />
                                              {task.estimatedHours}h
                                            </span>
                                          )}
                                          {task.humanReviewer && (
                                            <span className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                                              <User className="size-3" />
                                              {task.humanReviewer}
                                            </span>
                                          )}
                                        </div>
                                        <span>
                                          {task.updatedAt || task.createdAt}
                                        </span>
                                      </div>
                                      
                                      {/* Action buttons */}
                                      <div className="flex" style={{ gap: 'var(--spacing-2)' }}>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditTask(task.id);
                                          }}
                                          className="h-8"
                                          style={{ padding: 'var(--spacing-3)' }}
                                        >
                                          <Edit3 className="size-3" style={{ marginRight: 'var(--spacing-1)' }} />
                                          Edit
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            
                                            if (onTaskTrigger && typeof onTaskTrigger === 'function') {
                                              // Ensure chat is visible when executing task
                                              if (chatCollapsed) {
                                                onChatToggle();
                                              }
                                              
                                              // Prepare comprehensive task context for AI execution
                                              const taskContext = `Please help me execute this task with detailed guidance and actionable recommendations.

Task: ${task.title}
Description: ${task.description}
Priority: ${task.priority}
Status: ${task.status}
Tags: ${task.tags?.join(', ') || 'None'}

Please provide:
1. Step-by-step execution plan
2. Best practices and recommendations
3. Code examples if applicable
4. Potential challenges and solutions
5. Success criteria and validation steps

${task.acceptanceCriteria?.length ? `Acceptance Criteria:\n${task.acceptanceCriteria.map((criteria: string, index: number) => `${index + 1}. ${criteria}`).join('\n')}` : ''}

${task.dependencies?.length ? `Dependencies:\n${task.dependencies.map((dep: any) => `- ${dep.title || dep.name} (${dep.status || 'unknown'})`).join('\n')}` : ''}`;

                                              // Trigger the task execution with the AI chat system
                                              onTaskTrigger(task.id, taskContext, task);
                                            }
                                          }}
                                          disabled={task.status === 'completed' || task.status === 'cancelled'}
                                          className="h-8 hover:bg-accent"
                                          style={{ padding: 'var(--spacing-3)' }}
                                        >
                                          <Zap className="size-3" style={{ marginRight: 'var(--spacing-1)' }} />
                                          Execute with AI
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>


    </div>
  );
}
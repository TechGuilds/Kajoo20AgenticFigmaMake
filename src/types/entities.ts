// Core entity types for the application hierarchy

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed' | 'blocked' | 'cancelled' | 'under-review';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'assessment' | 'setup' | 'migration' | 'reconstruction' | 'launch' | 'validation';
  projectId: string;
  workspaceId?: string;
  assignedTo?: User;
  assignee?: string; // String version for simple display
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  dependencies?: string[]; // Task IDs this task depends on
  artifacts?: Artifact[];
  comments?: TaskComment[];
  // API-specific extensions
  linkedIssues?: Array<{
    provider: "jira";
    key: string;
    url: string;
  }>;
  artifactIds?: string[];
  assignedAgent?: string;
  humanReviewer?: string;
  acceptanceCriteria?: string[];
  jiraTicket?: string;
  aiContext?: string;
  category?: string;
  phase?: string;
}

export interface TaskComment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  isAIGenerated?: boolean;
}

// Alias for API compatibility
export interface Comment extends TaskComment {}

export interface Artifact {
  id: string;
  title: string;
  name?: string;
  label?: string; // Alias for title/name for API compatibility
  type: 'document' | 'code' | 'config' | 'asset' | 'report' | 'sitecore' | 'hybrid' | 'text' | 'diagram' | 'checklist';
  description?: string;
  url?: string;
  content?: string;
  summary?: string;
  status?: 'draft' | 'in-progress' | 'completed' | 'archived';
  projectId: string;
  taskId?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: User;
  // API compatibility
  meta?: Record<string, any>;
  // For hybrid artifacts that contain both Sitecore and Code components
  hybridData?: {
    sitecoreComponent: any;
    codeComponent: any;
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  workspaceId: string;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
  lastActivity?: string;
  dueDate?: string;
  tags?: string[];
  tasks?: Task[];
  taskStats?: {
    total: number;
    completed: number;
    inProgress: number;
    blocked: number;
  };
}

export interface PhaseProgress {
  assessment: number;
  setup: number;
  migrate: number;
  reconstruct: number;
  launch: number;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  status?: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  sourceSystem: string;
  targetSystem: string;
  progress?: number;
  phase?: 'assessment' | 'setup' | 'migrate' | 'reconstruct' | 'launch' | 'completed';
  createdAt: string;
  updatedAt: string;
  lastActivity?: string;
  teamSize?: number;
  estimatedDuration?: string;
  createdBy?: User;
  projects: Project[];
  phaseProgress?: PhaseProgress;
  workspaceStats?: {
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    completedTasks: number;
  };
}

// Navigation and view types
export type View = 
  | 'dashboard'
  | 'workspaces'
  | 'workspace-overview'
  | 'project-list'
  | 'project-overview'
  | 'task-detail'
  | 'workspace-setup'
  | 'workspace-settings'
  | 'project-settings'
  | 'general-settings'
  | 'artifacts'
  | 'credit-demo';

export type TabPanel = 
  | 'project-analysis'
  | 'project-settings'
  | 'workspace-settings'
  | null;

// Chat and API-specific types
export type ChatThreadType = "project" | "task";

// Type alias for API compatibility  
export type ArtifactType = Artifact['type'];

// API-specific types for chat and external integrations
export interface LinkedIssue {
  provider: "jira";
  key: string;
  url: string;
}

// Extended task properties for API operations (extends base Task from entities.ts)
export interface TaskApiExtensions {
  linkedIssues?: LinkedIssue[];
  artifactIds?: string[];
  assignedAgent?: string;
  humanReviewer?: string;
  acceptanceCriteria?: string[];
  jiraTicket?: string;
  aiContext?: string;
  category?: string;
  phase?: string;
}

export interface ChatThread {
  id: string;
  projectId: string;
  taskId?: string;           // undefined for project threads
  type: ChatThreadType;
  createdAt: string;
  updatedAt: string;
}

export interface AiLog {
  id: string; 
  threadId: string; 
  at: string;
  role: "system" | "agent" | "human";
  message: string;
  attachments?: Array<{
    type: "link" | "json" | "code" | "sitecore-diff";
    label: string;
    href?: string;
    content?: string;        // code/text/json
    createArtifact?: ArtifactType; // hint for artifact capture
  }>;
}

// Route context for task-specific navigation
export interface RouteContext {
  projectId: string;
  taskId?: string;
  type: ChatThreadType;
}

// Credit-related types
export interface CreditData {
  currentCredits: number;
  totalCredits: number;
  usedThisMonth: number;
  dailyAverage: number;
  planType: 'free' | 'pro' | 'enterprise';
  nextResetDate: string;
}

export interface CreditUsage {
  id: string;
  timestamp: string;
  credits: number;
  operation: string;
  projectId?: string;
  taskId?: string;
}

export interface AIOperation {
  name: string;
  credits: number;
  description: string;
  category: 'chat' | 'analysis' | 'generation' | 'migration' | 'testing';
}
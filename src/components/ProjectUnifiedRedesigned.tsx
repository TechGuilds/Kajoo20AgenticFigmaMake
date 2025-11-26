import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Resizable, ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { ChatLayout } from './modules/chat/ChatLayout';
import { ArtifactPreviewModal, ArtifactCards } from './modules/artifact';
import { InstructionsScreen } from './modules/composite';
import { IntegrationManager } from './modules/integration';
import { AIInbox } from './modules/ai/AIInbox';
import { type Task, type Project, type Artifact } from '~/types';
import { 
  MessageCircle,
  Layers,
  Mail,
  Kanban,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  User,
  Tag,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Eye,
  Download,
  ExternalLink,
  Code,
  Database,
  Edit2,
  Trash2,
  Check,
  X,
  Reply,
  Info,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Bot,
  Loader2,
  ArrowLeft,
  Play,
  AlertTriangle,
  Save,
  Edit3,
  Paperclip,
  MessageSquare,
  Settings
} from 'lucide-react';

// Mock data for different sections
const mockChatSessions = [
  { id: '1', title: 'Migration Planning Discussion', lastMessage: 'Let\'s review the content architecture...', timestamp: '2 minutes ago', unread: 2 },
  { id: '2', title: 'Component Analysis', lastMessage: 'Found 23 custom components that need mapping', timestamp: '15 minutes ago', unread: 0 },
  { id: '3', title: 'Performance Review', lastMessage: 'Baseline metrics look good', timestamp: '1 hour ago', unread: 1 },
  { id: '4', title: 'Content Audit Session', lastMessage: 'Content types documented', timestamp: '3 hours ago', unread: 0 },
];

const mockArtifacts: Artifact[] = [
  {
    id: 'art-1',
    title: 'Content Architecture Diagram',
    label: 'Content Architecture Diagram',
    type: 'sitecore',
    description: 'Visual representation of the content structure and relationships',
    summary: 'Visual representation of the content structure and relationships',
    content: 'Content architecture diagram content here...',
    status: 'completed',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    projectId: 'proj-1',
    tags: ['architecture', 'content']
  },
  {
    id: 'art-2',
    title: 'Component Mapping Report',
    label: 'Component Mapping Report',
    type: 'code',
    description: 'Detailed mapping of existing components to new architecture',
    summary: 'Detailed mapping of existing components to new architecture',
    content: 'Component mapping report content...',
    status: 'in-progress',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T11:30:00Z',
    projectId: 'proj-1',
    tags: ['components', 'mapping']
  },
  {
    id: 'art-3',
    title: 'Migration Checklist',
    label: 'Migration Checklist',
    type: 'hybrid',
    description: 'Step-by-step checklist for the migration process',
    summary: 'Step-by-step checklist for the migration process',
    content: 'Migration checklist items...',
    status: 'completed',
    createdAt: '2024-01-14T15:00:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    projectId: 'proj-1',
    tags: ['migration', 'checklist']
  }
];

const mockInboxItems = [
  { 
    id: 'inbox-1', 
    type: 'approval_request',
    title: 'Content Model Changes',
    message: 'AI agent suggests modifying the Page content model to include new fields for SEO optimization. This will improve search engine visibility and content discoverability.',
    timestamp: '5 minutes ago',
    priority: 'high',
    agent: 'Content Analyzer',
    status: 'pending'
  },
  { 
    id: 'inbox-2', 
    type: 'info_requested',
    title: 'Component Dependencies Clarification',
    message: 'Need clarification on third-party component dependencies. Which external libraries should be included in the migration scope?',
    timestamp: '15 minutes ago',
    priority: 'medium',
    agent: 'Migration Planner',
    status: 'pending'
  },
  { 
    id: 'inbox-3', 
    type: 'recommendation',
    title: 'Performance Optimization',
    message: 'Detected performance bottleneck in component rendering. Suggest implementing lazy loading for improved user experience.',
    timestamp: '20 minutes ago',
    priority: 'medium',
    agent: 'Performance Auditor',
    status: 'pending'
  },
  { 
    id: 'inbox-4', 
    type: 'alert',
    title: 'Deprecated Component Found',
    message: 'Found usage of deprecated Sitecore.Mvc.Presentation.RenderingView in 3 components.',
    timestamp: '1 hour ago',
    priority: 'low',
    agent: 'Code Analyzer',
    status: 'reviewed'
  }
];

type LeftPanelSection = 'chat' | 'artifacts' | 'inbox' | 'plan' | 'instructions';

interface ProjectProps {
  selectedProject: Project;
  selectedTask?: Task | null;
  onTaskTrigger: (taskId: string, context?: string, task?: Task) => void;
  onJiraSync: (tasks: any[]) => void;
  chatCollapsed: boolean;
  onChatToggle: () => void;
  chatPanelSize: number;
  onChatPanelResize: (size: number) => void;
  taskPrompt: string | null;
  onPromptProcessed: () => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onCommentAdd: (taskId: string, comment: string) => Promise<void>;
  onTaskDelete: (taskId: string) => Promise<void>;
  onCreateTask: (taskData?: any) => Promise<void>;
  onGenerateTasks?: () => Promise<void>;
  pendingProjectMessage?: { userMessage: string; aiResponse: string } | null;
  onClearPendingMessage?: () => void;
}

export function ProjectUnifiedRedesigned({
  selectedProject,
  selectedTask: globalSelectedTask,
  onTaskTrigger,
  onJiraSync,
  chatCollapsed, 
  onChatToggle, 
  chatPanelSize, 
  onChatPanelResize, 
  taskPrompt, 
  onPromptProcessed,
  onTaskUpdate,
  onCommentAdd,
  onTaskDelete,
  onCreateTask,
  onGenerateTasks,
  pendingProjectMessage,
  onClearPendingMessage
}: ProjectProps) {
  const [activeSection, setActiveSection] = useState<LeftPanelSection>('chat');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [showArtifactModal, setShowArtifactModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false);
  const [selectedChatSession, setSelectedChatSession] = useState<string | null>(null);
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState(mockChatSessions);
  
  // Add state for manage connections drawer
  const [showManageConnections, setShowManageConnections] = useState(false);

  // Create Task Form State
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    type: 'assessment' as Task['type'],
    assignee: '',
    tags: [] as string[],
    dependencies: [] as string[]
  });

  // New search query state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Inbox state management
  const [expandedInboxItems, setExpandedInboxItems] = useState<Set<string>>(new Set());
  const [replyingToItem, setReplyingToItem] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [inboxItemsState, setInboxItemsState] = useState(mockInboxItems);
  
  // State for passing inbox actions to chat
  const [inboxMessages, setInboxMessages] = useState<Array<{
    id: string;
    role: 'assistant' | 'user';
    content: string;
    timestamp: string;
    source: 'inbox-action';
  }>>([]);

  // Task execution state
  const [executingTasks, setExecutingTasks] = useState<Set<string>>(new Set());
  
  // Plan panel state - for showing task list vs task details
  const [planView, setPlanView] = useState<'list' | 'detail'>('list');
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);
  
  // Task highlighting state for navigation from AI Inbox
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);
  
  // Task editing state for in-panel editing
  const [isEditingInPanel, setIsEditingInPanel] = useState(false);
  const [editedTaskInPanel, setEditedTaskInPanel] = useState<Partial<Task>>({});
  const [newCommentInPanel, setNewCommentInPanel] = useState('');

  // Artifact preview state for task details
  const [selectedArtifactForPreview, setSelectedArtifactForPreview] = useState<Artifact | null>(null);
  const [isArtifactPreviewOpen, setIsArtifactPreviewOpen] = useState(false);

  // Filter state management
  const [filters, setFilters] = useState({
    status: 'all-status',
    priority: 'all-priority',
    tags: [] as string[]
  });
  const [showFilterPopover, setShowFilterPopover] = useState(false);

  // Calculate active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status !== 'all-status') count++;
    if (filters.priority !== 'all-priority') count++;
    if (filters.tags.length > 0) count++;
    return count;
  };

  // Handle filter changes
  const handleFilterChange = (filterType: 'status' | 'priority' | 'tags', value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      status: 'all-status',
      priority: 'all-priority',
      tags: []
    });
  };
  
  // Mock available tags for filter
  const availableTags = ['sitecore', 'migration', 'components', 'architecture', 'content', 'typescript', 'react', 'nextjs', 'api', 'configuration'];

  // Enhanced task execution handler with loading state
  const handleTaskExecution = async (taskId: string, context?: string, task?: Task) => {
    // Add task to executing set to show loading state
    setExecutingTasks(prev => new Set(prev).add(taskId));
    
    try {
      // Call the original onTaskTrigger function
      onTaskTrigger(taskId, context, task);
      
      // Simulate execution delay (remove this in production)
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Task execution failed:', error);
    } finally {
      // Remove task from executing set after delay
      setTimeout(() => {
        setExecutingTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(taskId);
          return newSet;
        });
      }, 2000);
    }
  };

  const handleArtifactClick = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setShowArtifactModal(true);
  };

  // Handle create task form submission
  const handleCreateTaskSubmit = async () => {
    if (!newTaskData.title.trim()) return;
    
    try {
      await onCreateTask(newTaskData);
      
      // Reset form and close modal
      setNewTaskData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        type: 'assessment',
        assignee: '',
        tags: [],
        dependencies: []
      });
      setShowCreateTaskDialog(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleCancelCreateTask = () => {
    setNewTaskData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      type: 'assessment',
      assignee: '',
      tags: [],
      dependencies: []
    });
    setShowCreateTaskDialog(false);
  };

  // Handle pending project message from workspace
  useEffect(() => {
    if (pendingProjectMessage) {
      console.log('🎯 Processing pending project message for new project:', selectedProject.name);
      
      // Clear existing chat sessions to start fresh
      setChatSessions([]);
      
      // Create a new chat session with the pending message
      const newSessionTitle = `Project Creation: ${selectedProject.name}`;
      const sessionId = `chat-${Date.now()}`;
      
      const newSession = {
        id: sessionId,
        title: newSessionTitle,
        lastMessage: pendingProjectMessage.userMessage,
        timestamp: 'just now',
        unread: 0
      };
      
      // Add the new session to chat sessions
      setChatSessions([newSession]);
      
      // Set active section to chat and select the new session
      setActiveSection('chat');
      setSelectedChatSession(sessionId);
      
      console.log('✅ Successfully set up new project chat session with initial conversation');
      
      // Clear the pending message after a short delay to allow ChatLayout to process it
      setTimeout(() => {
        if (onClearPendingMessage) {
          onClearPendingMessage();
        }
      }, 100);
    }
  }, [pendingProjectMessage, selectedProject.name, onClearPendingMessage]);
  
  // Close task detail panel when switching navigation sections
  useEffect(() => {
    setSelectedTaskId(null);
    
    // Reset plan view when switching sections
    if (activeSection !== 'plan') {
      setPlanView('list');
      setSelectedTaskForDetail(null);
    }
  }, [activeSection]);

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      await onTaskDelete(taskToDelete.id);
      setTaskToDelete(null);
      setSelectedTaskId(null);
      
      // If we deleted the task being viewed in detail, go back to list
      if (selectedTaskForDetail?.id === taskToDelete.id) {
        setPlanView('list');
        setSelectedTaskForDetail(null);
      }
    }
  };

  // New handlers for in-panel task details
  const handleTaskClickInPlan = (task: Task) => {
    setSelectedTaskForDetail(task);
    setPlanView('detail');
    setIsEditingInPanel(false);
  };
  
  const handleBackToTaskList = () => {
    setPlanView('list');
    setSelectedTaskForDetail(null);
    setIsEditingInPanel(false);
    setEditedTaskInPanel({});
  };

  // Handlers for task menu actions from cards
  const handleEditTaskFromCard = (task: Task, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    setActiveSection('plan');
    setSelectedTaskForDetail(task);
    setPlanView('detail');
    setIsEditingInPanel(true);
    setEditedTaskInPanel(task);
  };

  const handleDeleteTaskFromCard = (task: Task, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    setTaskToDelete(task);
  };

  // Handler for navigating to a specific task from AI Inbox
  const handleNavigateToTask = (taskId: string, taskName: string) => {
    console.log('🎯 Navigating to task:', taskId, taskName);
    
    // Switch to Plan section
    setActiveSection('plan');
    
    // Highlight the task
    setHighlightedTaskId(taskId);
    
    // Clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightedTaskId(null);
    }, 3000);
    
    // Find and select the task if it exists
    const task = selectedProject.tasks?.find(t => t.id === taskId);
    if (task) {
      setSelectedTaskForDetail(task);
      setPlanView('detail');
    } else {
      // If task not found, stay on list view but highlight would still work
      setPlanView('list');
    }
  };

  // Handler for AI Inbox actions that transition to chat
  const handleInboxTransitionToChat = (actionData: {
    action: 'approve' | 'reject' | 'reply';
    item: any;
    userResponse?: string;
  }) => {
    console.log('🚀 Adding AI Inbox action to existing chat:', actionData);
    
    // Create appropriate messages based on the action
    let userMessage: string;
    let aiResponse: string;
    
    if (actionData.action === 'approve') {
      userMessage = `I approve the suggestion: "${actionData.item.title}"`;
      aiResponse = `Great! I've approved your suggestion for "${actionData.item.title}". I'll proceed with implementing this change. Here's what I'll do:\\n\\n${actionData.item.details}\\n\\nI'll get started on this right away and keep you updated on the progress.`;
    } else if (actionData.action === 'reject') {
      userMessage = `I reject the suggestion: "${actionData.item.title}"`;
      aiResponse = `Understood. I've noted that you've rejected the suggestion for "${actionData.item.title}". I'll remove this from the recommended actions and won't proceed with this change.\\n\\nIs there anything specific about this suggestion you'd like me to address differently in the future?`;
    } else if (actionData.action === 'reply' && actionData.userResponse) {
      userMessage = `Reply to: "${actionData.item.title}"\\n\\n${actionData.userResponse}`;
      aiResponse = `Thank you for providing that information regarding "${actionData.item.title}". Based on your response, I now have the details I need to proceed effectively.\\n\\nI'll use this information to update my recommendations and continue with the project tasks. Let me know if you need any clarification or have additional input.`;
    } else {
      // Fallback
      userMessage = `Action taken on: "${actionData.item.title}"`;
      aiResponse = `I've processed your action on "${actionData.item.title}". Thanks for the feedback!`;
    }
    
    // Instead of creating a new chat session, add the messages to the existing chat
    // Create messages that will be added to the current chat session
    const userMessageObj = {
      id: `inbox-user-${Date.now()}`,
      role: 'user' as const,
      content: userMessage,
      timestamp: new Date().toISOString(),
      source: 'inbox-action' as const
    };
    
    const aiMessageObj = {
      id: `inbox-ai-${Date.now() + 1}`,
      role: 'assistant' as const,
      content: aiResponse,
      timestamp: new Date().toISOString(),
      source: 'inbox-action' as const
    };
    
    // Add messages to the inbox messages state (which will be passed to ChatLayout)
    setInboxMessages(prev => [...prev, userMessageObj, aiMessageObj]);
    
    // Keep the inbox panel open by NOT switching to chat section
    // The messages will be visible in the chat when user manually navigates to it
    // This ensures the inbox stays open as requested
    console.log('✅ AI Inbox action processed - keeping inbox panel open');
    
    // Optional: Show a brief toast notification that the message was added to chat
    // This gives user feedback that their action was processed without switching panels
  };

  const handleInboxAction = (item: any, action: 'approve' | 'reject' | 'review') => {
    // Update the item status in the inbox
    setInboxItemsState(prev => prev.map(inboxItem => 
      inboxItem.id === item.id 
        ? { ...inboxItem, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'reviewed' }
        : inboxItem
    ));

    const message = {
      id: `inbox-${Date.now()}`,
      role: 'assistant' as const,
      content: `${action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Marked for review'}: ${item.title}\n\n${item.message}`,
      timestamp: new Date().toISOString(),
      source: 'inbox-action' as const
    };
    
    setInboxMessages(prev => [...prev, message]);
  };

  const toggleInboxItemExpansion = (itemId: string) => {
    setExpandedInboxItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleStartReply = (itemId: string) => {
    setReplyingToItem(itemId);
    setReplyText('');
  };

  const handleSendReply = (item: any) => {
    if (!replyText.trim()) return;

    // Update the item status to replied
    setInboxItemsState(prev => prev.map(inboxItem => 
      inboxItem.id === item.id 
        ? { ...inboxItem, status: 'replied' }
        : inboxItem
    ));

    const message = {
      id: `inbox-reply-${Date.now()}`,
      role: 'user' as const,
      content: `Reply to: ${item.title}\\n\\n${replyText}`,
      timestamp: new Date().toISOString(),
      source: 'inbox-action' as const
    };
    
    setInboxMessages(prev => [...prev, message]);
    setReplyingToItem(null);
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyingToItem(null);
    setReplyText('');
  };

  const handleChatSessionSelect = (sessionId: string) => {
    setSelectedChatSession(sessionId);
  };

  const handleCreateNewChat = () => {
    // Set to null to trigger the "new chat" state in ChatLayout
    setSelectedChatSession(null);
  };

  const handleCreateNewChatSessionWithMessages = (title: string, userMessage: string, aiResponse: string): string => {
    const newSession = {
      id: `chat-${Date.now()}`,
      title: title,
      lastMessage: userMessage,
      timestamp: 'just now',
      unread: 0
    };
    
    setChatSessions(prev => [newSession, ...prev]);
    setSelectedChatSession(newSession.id);
    return newSession.id;
  };

  const handleCreateNewChatSession = (title: string, firstMessage: string): string => {
    const newSession = {
      id: `chat-${Date.now()}`,
      title: title,
      lastMessage: firstMessage,
      timestamp: 'just now',
      unread: 0
    };
    
    setChatSessions(prev => [newSession, ...prev]);
    setSelectedChatSession(newSession.id);
    return newSession.id;
  };

  const handleRenameSession = (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // TODO: Implement rename functionality
    console.log('Rename session:', sessionId);
  };

  const handleDeleteSession = (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setChatSessions(prev => prev.filter(session => session.id !== sessionId));
    if (selectedChatSession === sessionId) {
      setSelectedChatSession(null);
    }
  };

  // Mock task artifacts data for tabs
  const mockTaskArtifacts: Artifact[] = [
    {
      id: 'task-art-1',
      title: 'Sitecore Content Types Schema',
      label: 'Sitecore Content Types Schema',
      type: 'sitecore',
      description: 'Complete schema definition for all Sitecore content types including templates, fields, and inheritance relationships',
      summary: 'Comprehensive content type schema with field mappings and template hierarchy',
      content: `{
  "contentTypes": [
    {
      "name": "ArticlePage",
      "baseTemplate": "StandardTemplate", 
      "fields": [
        { "name": "Title", "type": "Text", "required": true },
        { "name": "Summary", "type": "MultiText", "required": false },
        { "name": "Body", "type": "RichText", "required": true },
        { "name": "Author", "type": "Droplink", "source": "/sitecore/content/Authors" }
      ]
    }
  ]
}`,
      status: 'completed',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      projectId: 'proj-1',
      tags: ['sitecore', 'schema', 'content-types']
    },
    {
      id: 'task-art-2',
      title: 'React Component Migration Guide',
      label: 'React Component Migration Guide',
      type: 'code',
      description: 'Detailed implementation guide for migrating Sitecore MVC components to React components with Next.js',
      summary: 'Step-by-step component migration patterns and code examples',
      content: `# React Component Migration Guide

## Component Structure

### Legacy MVC Component
\`\`\`csharp
public class ArticleComponent : GlassController<ArticleItem>
{
    public override ActionResult Index()
    {
        var model = GetDataSourceItem<ArticleItem>();
        return View(model);
    }
}
\`\`\`

### Migrated React Component
\`\`\`tsx
export const Article: React.FC<ArticleProps> = ({ rendering, params }) => {
  const { fields } = rendering.datasource || {};
  
  return (
    <article className="article">
      <h1><Text field={fields?.Title} /></h1>
      <div className="content">
        <RichText field={fields?.Body} />
      </div>
    </article>
  );
};
\`\`\``,
      status: 'in-progress',
      createdAt: '2024-01-15T11:00:00Z',
      updatedAt: '2024-01-15T15:45:00Z',
      projectId: 'proj-1',
      tags: ['react', 'migration', 'components', 'nextjs']
    },
    {
      id: 'task-art-3',
      title: 'TypeScript Interface Definitions',
      label: 'TypeScript Interface Definitions',
      type: 'code',
      description: 'TypeScript interfaces and type definitions for Sitecore field types and component props',
      summary: 'Comprehensive type definitions for type-safe component development',
      content: `// TypeScript Interface Definitions for Sitecore JSS

export interface SitecoreField<T = string> {
  value: T;
  editable?: string;
}

export interface TextField extends SitecoreField<string> {}

export interface RichTextField extends SitecoreField<string> {
  value: string;
}

export interface ImageField extends SitecoreField {
  value: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
}

export interface ComponentRendering<T = any> {
  uid: string;
  componentName: string;
  dataSource?: string;
  fields?: T;
}`,
      status: 'completed',
      createdAt: '2024-01-15T08:45:00Z',
      updatedAt: '2024-01-15T12:30:00Z',
      projectId: 'proj-1',
      tags: ['typescript', 'interfaces', 'types', 'sitecore-jss']
    },
    {
      id: 'task-art-4',
      title: 'Sitecore Layout Service Configuration',
      label: 'Sitecore Layout Service Configuration',
      type: 'sitecore',
      description: 'Configuration settings for Sitecore Layout Service API endpoints and rendering parameters',
      summary: 'Layout Service setup for headless architecture with API configurations',
      content: `<!-- Sitecore Layout Service Configuration -->
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/">
  <sitecore>
    <layoutService>
      <configurations>
        <config name="jss">
          <rendering>
            <layoutSerializer ref="layoutService/rendering/layoutSerializers/default" />
            <renderingContentsResolver type="Sitecore.LayoutService.Serialization.ContentsResolvers.RenderingContentsResolver, Sitecore.LayoutService">
              <IncludeServerUrlInMediaUrls>true</IncludeServerUrlInMediaUrls>
            </renderingContentsResolver>
          </rendering>
        </config>
      </configurations>
    </layoutService>
  </sitecore>
</configuration>`,
      status: 'completed',
      createdAt: '2024-01-14T16:30:00Z',
      updatedAt: '2024-01-15T09:15:00Z',
      projectId: 'proj-1',
      tags: ['sitecore', 'layout-service', 'api', 'configuration']
    },
    {
      id: 'task-art-5',
      title: 'Next.js API Routes Implementation',
      label: 'Next.js API Routes Implementation',
      type: 'code',
      description: 'API route implementations for handling Sitecore data fetching and form submissions in Next.js',
      summary: 'Server-side API handlers for Sitecore integration and data processing',
      content: `// pages/api/sitecore/layout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLLayoutService } from '@sitecore-jss/sitecore-jss-nextjs';

const layoutService = new GraphQLLayoutService({
  endpoint: process.env.SITECORE_API_HOST + '/sitecore/api/graph/edge',
  apiKey: process.env.SITECORE_API_KEY,
  siteName: process.env.SITECORE_SITE_NAME,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { route, language = 'en' } = req.query;
  
  try {
    const result = await layoutService.fetchLayoutData(
      route as string,
      language as string
    );
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Layout fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch layout data' });
  }
}`,
      status: 'completed',
      createdAt: '2024-01-15T14:00:00Z',
      updatedAt: '2024-01-15T17:30:00Z',
      projectId: 'proj-1',
      tags: ['nextjs', 'api-routes', 'sitecore', 'forms']
    }
  ];

  // Render function for left panel content
  const renderLeftPanelContent = () => {
    switch (activeSection) {
      case 'chat':
        return (
          <div className="h-full flex flex-col">
            {/* Chat Sessions Header */}
            <div className="p-4 border-b border-border flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h2>Chat Sessions</h2>
                <Button size="sm" onClick={handleCreateNewChat}>
                  <Plus className="size-4 mr-1" />
                  New Chat
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                <Input placeholder="Search sessions..." className="pl-9" />
              </div>
            </div>
            
            {/* Sessions List */}
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-2">
                  {chatSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleChatSessionSelect(session.id)}
                      onMouseEnter={() => setHoveredSession(session.id)}
                      onMouseLeave={() => setHoveredSession(null)}
                      className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors relative group ${
                        selectedChatSession === session.id 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <MessageCircle className="size-4 text-muted-foreground flex-shrink-0" />
                          <h4 className="truncate pr-2">{session.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`size-6 p-0 hover:bg-accent-foreground/10 transition-opacity ${
                                  hoveredSession === session.id ? 'opacity-100' : 'opacity-0'
                                }`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="size-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 z-50">
                              <DropdownMenuItem onClick={(e) => handleRenameSession(session.id, e)}>
                                <Edit2 className="size-4 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => handleDeleteSession(session.id, e)}
                                className="text-destructive"
                              >
                                <Trash2 className="size-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <p className="text-muted-foreground line-clamp-2 mb-2">
                        {session.lastMessage}
                      </p>
                      <div className="text-muted-foreground">
                        {session.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        );

      case 'artifacts':
        return (
          <div className="h-full flex flex-col">
            {/* Artifacts Header */}
            <div className="p-4 border-b border-border flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3>Artifacts</h3>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                <Input placeholder="Search artifacts..." className="pl-9" />
              </div>
            </div>
            
            {/* Artifacts List */}
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <ArtifactCards
                  artifacts={mockArtifacts}
                  taskId={selectedProject?.id || 'project'}
                  context="project"
                  selectedArtifact={selectedArtifact}
                  onArtifactSelect={handleArtifactClick}
                />
              </ScrollArea>
            </div>
          </div>
        );

      case 'inbox':
        return (
          <AIInbox 
            selectedProject={selectedProject}
            onApprovalAction={(item, action, details) => {
              console.log('Inbox action:', action, 'for item:', item.title);
              // Handle the action in the current context if needed
            }}
            onInlineReply={(item, reply) => {
              console.log('Inbox reply for item:', item.title, 'Reply:', reply);
              // Handle the reply in the current context if needed
            }}
            onNavigateToTask={handleNavigateToTask}
            onTransitionToChat={handleInboxTransitionToChat}
          />
        );

      case 'inbox-disabled':
        return (
          <div className="h-full flex flex-col">
            {/* Inbox Header */}
            <div className="p-4 border-b border-border flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3>AI Inbox</h3>
                <Badge variant="secondary">
                  {mockInboxItems.filter(item => item.status === 'pending').length} pending
                </Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                <Input placeholder="Search inbox..." className="pl-9" />
              </div>
            </div>
            
            {/* Inbox List */}
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-2">
                  {inboxItemsState.map((item) => {
                    const isExpanded = expandedInboxItems.has(item.id);
                    const isReplying = replyingToItem === item.id;
                    
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border mb-3 bg-card transition-all duration-200 ${
                          item.status === 'approved' ? 'border-success/50 bg-success/5 dark:border-success/30 dark:bg-success/10' :
                          item.status === 'rejected' ? 'border-destructive/50 bg-destructive/5 dark:border-destructive/30 dark:bg-destructive/10' :
                          item.status === 'replied' ? 'border-info/50 bg-info/5 dark:border-info/30 dark:bg-info/10' :
                          'hover:border-border/80'
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              {/* Status Tag */}
                              <Badge 
                                variant="outline"
                                className={`text-xs ${
                                  item.status === 'pending' ? 'text-warning border-warning/30 bg-warning/10' :
                                  item.status === 'approved' ? 'text-success border-success/30 bg-success/10' :
                                  item.status === 'rejected' ? 'text-destructive border-destructive/30 bg-destructive/10' :
                                  item.status === 'replied' ? 'text-info border-info/30 bg-info/10' :
                                  'text-gray-600 border-gray-300'
                                }`}
                              >
                                {item.status}
                              </Badge>
                              
                              {/* Type Tag */}
                              <Badge 
                                variant="outline"
                                className={`text-xs ${
                                  item.type === 'info_requested' ? 'text-info border-info/30 bg-info/10' :
                                  item.type === 'approval_request' ? 'text-warning border-warning/30 bg-warning/10' :
                                  item.type === 'recommendation' ? 'text-accent-purple border-accent-purple/30 bg-accent-purple/10' :
                                  'text-gray-600 border-gray-300'
                                }`}
                              >
                                {item.type === 'info_requested' ? 'info requested' : 
                                 item.type === 'approval_request' ? 'actions' : 
                                 item.type === 'recommendation' ? 'actions' : 
                                 item.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-muted-foreground flex-shrink-0">
                            {item.timestamp}
                          </div>
                        </div>
                        
                        {/* Title */}
                        <h4 className="font-medium mb-2">{item.title}</h4>

                        {/* Message */}
                        <div className="mb-3">
                          <p className={`text-xs text-muted-foreground ${isExpanded ? '' : 'line-clamp-2'}`}>
                            {item.message}
                          </p>
                          {item.message.length > 120 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-auto p-0 text-primary hover:bg-transparent mt-1"
                              onClick={() => toggleInboxItemExpansion(item.id)}
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="size-3 mr-1" />
                                  Show less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="size-3 mr-1" />
                                  Show more
                                </>
                              )}
                            </Button>
                          )}
                        </div>

                        {/* Reply Input */}
                        {isReplying && (
                          <div className="mb-3 p-3 bg-muted/50 rounded-md border">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your reply..."
                              className="w-full bg-transparent border-none outline-none resize-none min-h-[60px]"
                              autoFocus
                            />
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                className="h-7 px-3"
                                onClick={() => handleSendReply(item)}
                                disabled={!replyText.trim()}
                              >
                                Send Reply
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-3"
                                onClick={handleCancelReply}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="space-y-2">
                          <div className="text-muted-foreground">
                            <span className="font-medium">{item.agent}</span> • <span>{item.timestamp}</span>
                          </div>
                          
                          {/* Action Buttons */}
                          {item.status === 'pending' && (
                            <div className="flex gap-2">
                              {item.type === 'info_requested' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-7 px-3 border-info/30 text-info hover:bg-info/10"
                                  onClick={() => handleStartReply(item.id)}
                                >
                                  <Reply className="size-3 mr-1" />
                                  Reply
                                </Button>
                              )}
                              {(item.type === 'approval_request' || item.type === 'recommendation') && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-7 px-3 border-destructive/30 text-destructive hover:bg-destructive/10"
                                    onClick={() => handleInboxAction(item, 'reject')}
                                  >
                                    <X className="size-3 mr-1" />
                                    Reject
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-7 px-3 border-success/30 text-success hover:bg-success/10"
                                    onClick={() => handleInboxAction(item, 'approve')}
                                  >
                                    <Check className="size-3 mr-1" />
                                    Approve
                                  </Button>
                                </>
                              )}
                              {item.type === 'alert' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-7 px-3 border-info/30 text-info hover:bg-info/10"
                                  onClick={() => handleInboxAction(item, 'review')}
                                >
                                  <Eye className="size-3 mr-1" />
                                  Review
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
        );

      case 'plan':
        if (planView === 'detail' && selectedTaskForDetail) {
          // Task Detail View - Full editing interface from TaskDetailFlyout
          return (
            <div className="h-full flex flex-col">
              {/* Task Detail Header with Back Navigation */}
              <div className="p-4 border-b border-border flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Button size="sm" variant="ghost" onClick={handleBackToTaskList}>
                      <ArrowLeft className="size-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                      {selectedTaskForDetail.status === 'completed' ? (
                        <CheckCircle2 className="size-4 text-success" />
                      ) : selectedTaskForDetail.status === 'in-progress' ? (
                        <Play className="size-4 text-info" />
                      ) : selectedTaskForDetail.status === 'blocked' ? (
                        <AlertTriangle className="size-4 text-destructive" />
                      ) : (
                        <Clock className="size-4 text-muted-foreground" />
                      )}
                      <Badge variant="outline" className={`text-xs ${
                        selectedTaskForDetail.status === 'completed' ? 'bg-success/10 text-success border-success/20' :
                        selectedTaskForDetail.status === 'in-progress' ? 'bg-info/10 text-info border-info/20' :
                        selectedTaskForDetail.status === 'blocked' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                        selectedTaskForDetail.status === 'review' ? 'bg-warning/10 text-warning border-warning/20' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {selectedTaskForDetail.status?.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!isEditingInPanel ? (
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setIsEditingInPanel(true);
                                setEditedTaskInPanel(selectedTaskForDetail);
                              }}
                            >
                              <Edit2 className="size-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setTaskToDelete(selectedTaskForDetail)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="size-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Task Title */}
                {isEditingInPanel ? (
                  <Input
                    value={editedTaskInPanel.title || ''}
                    onChange={(e) => setEditedTaskInPanel({ ...editedTaskInPanel, title: e.target.value })}
                    placeholder="Task title"
                    className="font-medium border-none p-0 h-auto bg-transparent"
                  />
                ) : (
                  <h2 className="font-medium">{selectedTaskForDetail.title}</h2>
                )}
              </div>

              {/* Tabs for Details and Artifacts */}
              <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
                <div className="px-4 py-2 border-b border-border">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
                  </TabsList>
                </div>

                {/* Details Tab Content */}
                <TabsContent value="details" className="flex-1 min-h-0 mt-0">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-6">
                      {/* Description */}
                      <div>
                        <label className="font-medium text-muted-foreground mb-2 block">Description</label>
                        {isEditingInPanel ? (
                          <Textarea
                            value={editedTaskInPanel.description || ''}
                            onChange={(e) => setEditedTaskInPanel({ ...editedTaskInPanel, description: e.target.value })}
                            placeholder="Task description"
                            rows={4}
                          />
                        ) : (
                          <p className="text-muted-foreground">
                            {selectedTaskForDetail.description || 'No description provided.'}
                          </p>
                        )}
                      </div>

                      {/* Status and Priority */}
                      <div>
                        {/* Status */}
                        <div>
                          <label className="text-muted-foreground">Status</label>
                          {isEditingInPanel ? (
                            <Select 
                              value={editedTaskInPanel.status} 
                              onValueChange={(value) => setEditedTaskInPanel({ ...editedTaskInPanel, status: value as Task['status'] })}
                            >
                              <SelectTrigger className="mt-2 h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="todo">To Do</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="review">Review</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="blocked">Blocked</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="mt-2">
                              <Badge variant="outline" className={`text-xs ${
                                selectedTaskForDetail.status === 'completed' ? 'bg-success/10 text-success border-success/20' :
                                selectedTaskForDetail.status === 'in-progress' ? 'bg-info/10 text-info border-info/20' :
                                selectedTaskForDetail.status === 'blocked' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                                selectedTaskForDetail.status === 'review' ? 'bg-warning/10 text-warning border-warning/20' :
                                'bg-gray-100 text-gray-800 border-gray-200'
                              }`}>
                                {selectedTaskForDetail.status?.replace('-', ' ')}
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Priority */}
                        <div>
                          <label className="text-muted-foreground">Priority</label>
                          {isEditingInPanel ? (
                            <Select 
                              value={editedTaskInPanel.priority} 
                              onValueChange={(value) => setEditedTaskInPanel({ ...editedTaskInPanel, priority: value as Task['priority'] })}
                            >
                              <SelectTrigger className="mt-2 h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="flex items-center gap-2 mt-2">
                              <div className={`w-3 h-3 rounded-full ${
                                selectedTaskForDetail.priority === 'critical' ? 'bg-destructive' :
                                selectedTaskForDetail.priority === 'high' ? 'bg-warning' :
                                selectedTaskForDetail.priority === 'medium' ? 'bg-warning' :
                                'bg-gray-400'
                              }`} />
                              <span className="capitalize">{selectedTaskForDetail.priority}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Assignee */}
                      <div>
                        <label className="text-muted-foreground">Assignee</label>
                        {isEditingInPanel ? (
                          <Select 
                            value={editedTaskInPanel.assignee || 'unassigned'} 
                            onValueChange={(value) => {
                              if (value === 'unassigned') {
                                setEditedTaskInPanel({ ...editedTaskInPanel, assignee: null });
                              } else {
                                setEditedTaskInPanel({ ...editedTaskInPanel, assignee: value });
                              }
                            }}>
                            <SelectTrigger className="mt-2 h-9">
                              <SelectValue placeholder="Select assignee..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">Unassigned</SelectItem>
                              <SelectItem value="John Doe">John Doe</SelectItem>
                              <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                              <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                              <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                              <SelectItem value="Alex Chen">Alex Chen</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex items-center gap-3 mt-2">
                            {selectedTaskForDetail.assignee ? (
                              <>
                                <div className="size-6 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-primary">
                                    {selectedTaskForDetail.assignee.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </span>
                                </div>
                                <span>{selectedTaskForDetail.assignee}</span>
                              </>
                            ) : (
                              <>
                                <div className="size-6 bg-muted rounded-full flex items-center justify-center">
                                  <User className="size-3 text-muted-foreground" />
                                </div>
                                <span className="text-muted-foreground">Unassigned</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {selectedTaskForDetail.tags && selectedTaskForDetail.tags.length > 0 && (
                        <div>
                          <label className="text-muted-foreground">Tags</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedTaskForDetail.tags.map((tag, index) => (
                              <Badge key={index} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Meta Information */}
                      <div className="space-y-3">
                        <h3 className="font-medium text-muted-foreground">Information</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Created</span>
                            <span>{new Date(selectedTaskForDetail.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Updated</span>
                            <span>{new Date(selectedTaskForDetail.updatedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Created by</span>
                            <span>{selectedTaskForDetail.createdBy?.name || 'System'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type</span>
                            <Badge variant="outline" className="capitalize">
                              {selectedTaskForDetail.type}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Comments */}
                      <div className="space-y-4">
                        <h3 className="font-medium text-muted-foreground flex items-center gap-2">
                          <MessageSquare className="size-4" />
                          Comments ({selectedTaskForDetail.comments?.length || 0})
                        </h3>

                        {/* Add Comment */}
                        <div className="space-y-3">
                          <Textarea
                            value={newCommentInPanel}
                            onChange={(e) => setNewCommentInPanel(e.target.value)}
                            placeholder="Add a comment..."
                            rows={3}
                          />
                          <div className="flex justify-end">
                            <Button 
                              size="sm" 
                              onClick={() => {
                                if (newCommentInPanel.trim()) {
                                  onCommentAdd(selectedTaskForDetail.id, newCommentInPanel.trim());
                                  setNewCommentInPanel('');
                                }
                              }} 
                              disabled={!newCommentInPanel.trim()} 
                              className="h-8 px-4"
                            >
                              <Plus className="size-4 mr-2" />
                              Add Comment
                            </Button>
                          </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-4">
                          {selectedTaskForDetail.comments?.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <Avatar className="size-7">
                                <AvatarImage src={comment.author?.avatar} />
                                <AvatarFallback>{comment.author?.initials || 'U'}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium">{comment.author?.name || 'User'}</span>
                                  <span className="text-muted-foreground">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                  {comment.isAIGenerated && (
                                    <Badge variant="secondary">AI</Badge>
                                  )}
                                </div>
                                <p>{comment.content}</p>
                              </div>
                            </div>
                          )) || (
                            <p className="text-center text-muted-foreground py-6">
                              No comments yet. Be the first to comment!
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* Artifacts Tab Content */}
                <TabsContent value="artifacts" className="flex-1 min-h-0 mt-0">
                  <ScrollArea className="h-full">
                    <div className="space-y-6 px-[0px] py-[14px] p-[0px]">
                      <div className="w-full max-w-full">
                        <ArtifactCards 
                          artifacts={mockTaskArtifacts}
                          taskId={selectedTaskForDetail.id}
                          context="task-detail"
                          selectedArtifact={selectedArtifactForPreview}
                          onArtifactSelect={(artifact) => {
                            setSelectedArtifactForPreview(artifact);
                            setIsArtifactPreviewOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              {/* Fixed Footer for Edit Mode */}
              {isEditingInPanel && (
                <div className="border-t bg-card p-4 flex-shrink-0">
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => {
                      setEditedTaskInPanel({});
                      setIsEditingInPanel(false);
                    }}>
                      <X className="size-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      onTaskUpdate(selectedTaskForDetail.id, editedTaskInPanel);
                      setIsEditingInPanel(false);
                    }}>
                      <Save className="size-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
  
        // Task List View (default)
        return (
          <div className="h-full flex flex-col">
            {/* Plan Header */}
            <div className="p-4 border-b border-border flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3>Project Plan</h3>
                <Button size="sm" onClick={() => setShowCreateTaskDialog(true)}>
                  <Plus className="size-4 mr-1" />
                  New Task
                </Button>
              </div>
              
              {/* Search and Filters */}
              <div className="flex gap-2 mb-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search tasks..." 
                    className="pl-9 h-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Popover open={showFilterPopover} onOpenChange={setShowFilterPopover}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 relative">
                      <Filter className="size-4 mr-2" />
                      Filters
                      {getActiveFilterCount() > 0 && (
                        <Badge 
                          variant="secondary" 
                          className="ml-2 h-4 w-4 p-0 flex items-center justify-center"
                        >
                          {getActiveFilterCount()}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Filter Tasks</h4>
                        {getActiveFilterCount() > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={clearAllFilters}
                            className="h-auto p-1 text-muted-foreground hover:text-foreground"
                          >
                            Clear all
                          </Button>
                        )}
                      </div>
                      
                      {/* Status Filter - removed Label */}
                      <div className="space-y-2">
                        <Select 
                          value={filters.status} 
                          onValueChange={(value) => handleFilterChange('status', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all-status">All Status</SelectItem>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Priority Filter - removed Label */}
                      <div className="space-y-2">
                        <Select 
                          value={filters.priority} 
                          onValueChange={(value) => handleFilterChange('priority', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all-priority">All Priority</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Tags Filter */}
                      <div className="space-y-2">
                        <Label className="font-medium">Tags</Label>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                            {availableTags.map((tag) => (
                              <Button
                                key={tag}
                                variant={filters.tags.includes(tag) ? "default" : "outline"}
                                size="sm"
                                className="h-6 px-2"
                                onClick={() => {
                                  const newTags = filters.tags.includes(tag)
                                    ? filters.tags.filter(t => t !== tag)
                                    : [...filters.tags, tag];
                                  handleFilterChange('tags', newTags);
                                }}
                              >
                                <Tag className="size-3 mr-1" />
                                {tag}
                              </Button>
                            ))}
                          </div>
                          {filters.tags.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Selected:</span>
                              <div className="flex flex-wrap gap-1">
                                {filters.tags.map((tag) => (
                                  <Badge 
                                    key={tag} 
                                    variant="secondary" 
                                    className="h-5 px-2 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                    onClick={() => {
                                      const newTags = filters.tags.filter(t => t !== tag);
                                      handleFilterChange('tags', newTags);
                                    }}
                                  >
                                    {tag}
                                    <X className="size-3 ml-1" />
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Tasks List */}
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-2">
                  {selectedProject?.tasks && selectedProject.tasks.length > 0 ? (
                    selectedProject.tasks.map((task) => {
                      const isSelected = selectedTaskForDetail?.id === task.id;
                      return (
                        <div
                          key={task.id}
                          className={`p-3 rounded-lg hover:bg-accent cursor-pointer mb-2 border transition-colors ${
                            isSelected 
                              ? 'bg-accent border-primary ring-1 ring-primary' 
                              : 'border-border'
                          }`}
                          onClick={() => handleTaskClickInPlan(task)}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {task.status === 'completed' ? (
                                <CheckCircle2 className="size-4 text-success flex-shrink-0" />
                              ) : task.status === 'in-progress' ? (
                                <Clock className="size-4 text-info flex-shrink-0" />
                              ) : (
                                <Circle className="size-4 text-muted-foreground flex-shrink-0" />
                              )}
                              <h4 className="truncate">{task.title}</h4>
                            </div>
                            
                            {/* Three-dot menu */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 flex-shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={(e) => handleEditTaskFromCard(task, e)}>
                                  <Edit3 className="size-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={(e) => handleDeleteTaskFromCard(task, e)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="size-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <p className="text-muted-foreground line-clamp-2 mb-2">
                            {task.description}
                          </p>
                          
                          {/* Execute with AI Button */}
                          <div className="mb-2">
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTaskExecution(task.id, 'task-list', task);
                              }}
                              disabled={executingTasks.has(task.id)}
                              className={`h-7 px-3 transition-all duration-200 ${executingTasks.has(task.id) ? 'border-success/50 text-success/50 cursor-not-allowed' : 'border-success text-success hover:bg-success hover:text-success-foreground hover:scale-[1.02] active:scale-[0.98]'}`}
                            >
                              {executingTasks.has(task.id) ? (
                                <>
                                  <Loader2 className="size-3 mr-1 animate-spin" />
                                  Executing...
                                </>
                              ) : (
                                <>
                                  <Bot className="size-3 mr-1" />
                                  Execute with AI
                                </>
                              )}
                            </Button>
                          </div>                        
                          
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <div className="flex items-center justify-between w-full text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={task.priority === 'critical' ? 'destructive' : task.priority === 'high' ? 'secondary' : 'outline'}
                                >
                                  {task.priority}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                {task.assignee ? (
                                  <div className="size-5 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span className="font-medium text-primary">
                                      {task.assignee.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="size-5 bg-muted rounded-full flex items-center justify-center">
                                    <User className="size-3 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center">
                        <Kanban className="size-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No tasks found</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        ); 

      case 'instructions':
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="px-[14px] py-[0px]">
                  <InstructionsScreen project={selectedProject} />
                </div>
              </ScrollArea>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* Left Panel */}
      <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
        <div className="h-full flex border-r border-border">
          {/* Section Navigation */}
          <div className="border-r border-border w-16 min-w-16 max-w-16 h-full flex flex-col py-4 gap-2 bg-card flex-shrink-0">
            <Button
              variant={activeSection === 'chat' ? 'default' : 'ghost'}
              size="icon"
              className="w-10 h-10 min-w-10 max-w-10 rounded-lg mx-auto transition-colors"
              onClick={() => setActiveSection('chat')}
            >
              <MessageCircle className="size-5" />
            </Button>
            <Button
              variant={activeSection === 'plan' ? 'default' : 'ghost'}
              size="icon"
              className="w-10 h-10 min-w-10 max-w-10 rounded-lg mx-auto transition-colors"
              onClick={() => setActiveSection('plan')}
            >
              <Kanban className="size-5" />
            </Button>
            <Button
              variant={activeSection === 'artifacts' ? 'default' : 'ghost'}
              size="icon"
              className="w-10 h-10 min-w-10 max-w-10 rounded-lg mx-auto transition-colors"
              onClick={() => setActiveSection('artifacts')}
            >
              <Layers className="size-5" />
            </Button>
            <Button
              variant={activeSection === 'inbox' ? 'default' : 'ghost'}
              size="icon"
              className="w-10 h-10 min-w-10 max-w-10 rounded-lg mx-auto transition-colors"
              onClick={() => setActiveSection('inbox')}
            >
              <Mail className="size-5" />
            </Button>
            <Button
              variant={activeSection === 'instructions' ? 'default' : 'ghost'}
              size="icon"
              className="w-10 h-10 min-w-10 max-w-10 rounded-lg mx-auto transition-colors"
              onClick={() => setActiveSection('instructions')}
            >
              <BookOpen className="size-5" />
            </Button>
          </div>
          
          {/* Section Content */}
          <div className="flex-1 h-full">
            {renderLeftPanelContent()}
          </div>
        </div>
      </ResizablePanel>

      {/* Resize Handle */}
      <ResizableHandle withHandle />

      {/* Main Chat Area */}
      <ResizablePanel defaultSize={75} minSize={40}>
        <div className="h-full">
          <ChatLayout 
            projectId={selectedProject.id}
            inboxMessages={inboxMessages}
            onClearInboxMessages={() => setInboxMessages([])}
            selectedChatSession={selectedChatSession}
            chatSessions={chatSessions}
            onCreateNewChatSession={handleCreateNewChatSessionWithMessages}
            taskPrompt={taskPrompt}
            onTaskPromptProcessed={onPromptProcessed}
            pendingProjectMessage={pendingProjectMessage}
            onClearPendingMessage={onClearPendingMessage}
          />
        </div>
      </ResizablePanel>

      {/* Create Task Dialog */}
      <Dialog open={showCreateTaskDialog} onOpenChange={setShowCreateTaskDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Create a new task for your project. Fill in the details below to get started.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="task-title">Title *</Label>
              <Input
                id="task-title"
                value={newTaskData.title}
                onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                placeholder="Enter task title..."
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={newTaskData.description}
                onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                placeholder="Enter task description..."
                rows={4}
              />
            </div>

            {/* Two column layout for Status, Priority, Type, Assignee */}
            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="task-status">Status</Label>
                <Select value={newTaskData.status} onValueChange={(value) => setNewTaskData({ ...newTaskData, status: value as Task['status'] })}>
                  <SelectTrigger id="task-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select value={newTaskData.priority} onValueChange={(value) => setNewTaskData({ ...newTaskData, priority: value as Task['priority'] })}>
                  <SelectTrigger id="task-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="task-type">Type</Label>
                <Select value={newTaskData.type} onValueChange={(value) => setNewTaskData({ ...newTaskData, type: value as Task['type'] })}>
                  <SelectTrigger id="task-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assessment">Assessment</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                    <SelectItem value="migration">Migration</SelectItem>
                    <SelectItem value="validation">Validation</SelectItem>
                    <SelectItem value="optimization">Optimization</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assignee */}
              <div className="space-y-2">
                <Label htmlFor="task-assignee">Assignee</Label>
                <Select value={newTaskData.assignee || 'unassigned'} onValueChange={(value) => setNewTaskData({ ...newTaskData, assignee: value === 'unassigned' ? '' : value })}>
                  <SelectTrigger id="task-assignee">
                    <SelectValue placeholder="Select assignee..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="John Doe">John Doe</SelectItem>
                    <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                    <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                    <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                    <SelectItem value="Alex Chen">Alex Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelCreateTask}>
              Cancel
            </Button>
            <Button onClick={handleCreateTaskSubmit} disabled={!newTaskData.title.trim()}>
              <Plus className="size-4 mr-2" />
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Connections Sheet */}
      <Sheet 
        open={showManageConnections} 
        onOpenChange={setShowManageConnections}
      >
        <SheetContent 
          side="right" 
          className="w-full max-w-lg sm:max-w-lg"
        >
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="flex items-center gap-2">
              <Database className="size-5" />
              Manage Connections
            </SheetTitle>
            <SheetDescription>
              Configure and manage your system connections and integrations.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 py-4">
            <ScrollArea className="h-full">
              <IntegrationManager />
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Artifact Preview Modal */}
      <ArtifactPreviewModal 
        open={isArtifactPreviewOpen}
        onOpenChange={setIsArtifactPreviewOpen}
        artifact={selectedArtifactForPreview}
      />

      {/* Task Delete Confirmation Dialog */}
      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteTask} 
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Artifact Modal */}
      <ArtifactPreviewModal
        open={showArtifactModal}
        onOpenChange={setShowArtifactModal}
        artifact={selectedArtifact}
      />
    </ResizablePanelGroup>
  );
}
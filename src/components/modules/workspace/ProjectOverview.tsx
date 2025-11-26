import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { ScrollArea } from '../../ui/scroll-area';
import { Textarea } from '../../ui/textarea';
import { WorkspaceConfigurationModal } from '../workspace/WorkspaceConfigurationModal';
import { ProjectList } from '../project';
import { WorkspaceDropdown } from '../workspace/WorkspaceDropdown';
import { type Workspace, type Project } from '~/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { 
  Plus, 
  Folder,
  Settings,
  Users,
  Calendar,
  Clock,
  BarChart3,
  Target,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  FileSearch,
  Bot,
  Send,
  Sparkles,
  FileText,
  Code,
  Network,
  Shield,
  Activity,
  Lightbulb,
  AlertTriangle,
  Search,
  TrendingUp,
  Rocket,
  Zap,
  Database,
  X,
  ChevronDown
} from 'lucide-react';

interface ProjectOverviewProps {
  selectedWorkspace: Workspace | null;
  availableWorkspaces?: Workspace[];
  onProjectClick?: (project: Project) => void;
  onProjectCreate?: (workspaceId: string, projectData: any) => void;
  onProjectDelete?: (projectId: string) => void;
  onConfigureWorkspace?: () => void;
  onWorkspaceUpdate?: (workspaceId: string, updates: Partial<Workspace>) => void;
  onWorkspaceSelect?: (workspace: Workspace) => void;
  onCreateWorkspace?: () => void;
  standalone?: boolean;
  onSetProjectMessage?: (message: { userMessage: string; aiResponse: string } | null) => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  prompt: string;
  category: 'workspace' | 'projects' | 'analysis' | 'help';
  description: string;
}

const WORKSPACE_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'analyze-workspace',
    label: 'Analyze Workspace',
    icon: BarChart3,
    prompt: 'Analyze the current workspace and provide insights on project distribution, progress, and optimization opportunities',
    category: 'analysis',
    description: 'Get comprehensive workspace analytics and insights'
  },
  {
    id: 'create-project',
    label: 'Create Project',
    icon: Plus,
    prompt: 'Help me create a new migration project in this workspace with proper setup and planning',
    category: 'projects',
    description: 'Set up a new project with AI guidance'
  },
  {
    id: 'workspace-optimization',
    label: 'Optimize Workflow',
    icon: Target,
    prompt: 'Review my workspace structure and suggest optimizations for better project management',
    category: 'workspace',
    description: 'Improve workspace organization and efficiency'
  },
  {
    id: 'best-practices',
    label: 'Best Practices',
    icon: Lightbulb,
    prompt: 'What are the best practices for organizing and managing migration projects in this workspace?',
    category: 'help',
    description: 'Learn workspace and project management best practices'
  }
];

const SAMPLE_WORKSPACE_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    type: 'ai',
    content: 'Hello! I\'m your AI Workspace Assistant. I can help you analyze your workspace, optimize project organization, create new projects, and provide guidance on migration strategies.\n\n🎯 **Ready to help with:**\n• Workspace analysis and optimization\n• Project creation and planning\n• Migration strategy guidance\n• Team collaboration insights\n\nWhat would you like to focus on today?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  }
];

export function ProjectOverview({ 
  selectedWorkspace, 
  availableWorkspaces,
  onProjectClick, 
  onProjectCreate,
  onProjectDelete,
  onConfigureWorkspace, 
  onWorkspaceUpdate,
  onWorkspaceSelect,
  onCreateWorkspace,
  standalone = false,
  onSetProjectMessage
}: ProjectOverviewProps) {
  const [configModalOpen, setConfigModalOpen] = useState(false);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(SAMPLE_WORKSPACE_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Prompt templates and agent mentions state
  const [showCommands, setShowCommands] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [showAgents, setShowAgents] = useState(false);
  const [agentSearch, setAgentSearch] = useState('');
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(0);
  const [mentionedAgents, setMentionedAgents] = useState<typeof availableAgents>([]);

  // Prompt templates data
  const quickCommands = [
    {
      id: 'analyze',
      label: 'Analyze Content',
      description: 'Analyze existing content structure and templates',
      icon: Target
    },
    {
      id: 'migrate',
      label: 'Start Migration',
      description: 'Begin migrating components to new platform',
      icon: Zap
    },
    {
      id: 'generate',
      label: 'Generate Tasks',
      description: 'Create migration tasks automatically',
      icon: Lightbulb
    },
    {
      id: 'review',
      label: 'Review Architecture',
      description: 'Review current system architecture',
      icon: FileText
    },
    {
      id: 'test',
      label: 'Run Tests',
      description: 'Execute migration validation tests',
      icon: Database
    },
    {
      id: 'deploy',
      label: 'Deploy Changes',
      description: 'Deploy migrated components to staging',
      icon: Code
    }
  ];

  // Available agents data
  const availableAgents = [
    {
      id: 'analyzer',
      name: 'Code Analyzer',
      handle: 'analyzer',
      role: 'Legacy Code Analysis',
      description: 'Analyzes legacy codebase structure, dependencies, and migration requirements',
      avatar: { bg: 'bg-success', icon: Search }
    },
    {
      id: 'designer',
      name: 'UI Migration Designer',
      handle: 'designer', 
      role: 'Design System Migration',
      description: 'Migrates design systems, components, and UI patterns to new platform',
      avatar: { bg: 'bg-accent-purple', icon: FileText }
    },
    {
      id: 'content',
      name: 'Content Migration Assistant',
      handle: 'content',
      role: 'Content & Data Migration',
      description: 'Handles content migration, data mapping, and content structure optimization',
      avatar: { bg: 'bg-warning', icon: Database }
    },
    {
      id: 'architect',
      name: 'System Architect',
      handle: 'architect',
      role: 'Architecture & Planning',
      description: 'Reviews system architecture and creates migration strategy plans',
      avatar: { bg: 'bg-info', icon: Target }
    },
    {
      id: 'tester',
      name: 'Quality Assurance Agent',
      handle: 'tester',
      role: 'Testing & Validation',
      description: 'Performs automated testing and validation of migrated components',
      avatar: { bg: 'bg-destructive', icon: Zap }
    }
  ];

  // Filter commands and agents based on search
  const filteredCommands = quickCommands.filter(command =>
    command.label.toLowerCase().includes(commandSearch.toLowerCase()) ||
    command.description.toLowerCase().includes(commandSearch.toLowerCase())
  );

  const filteredAgents = availableAgents.filter(agent =>
    agent.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
    agent.handle.toLowerCase().includes(agentSearch.toLowerCase()) ||
    agent.role.toLowerCase().includes(agentSearch.toLowerCase()) ||
    agent.description.toLowerCase().includes(agentSearch.toLowerCase())
  );

  // Extract mentioned agents from text
  const extractMentionedAgents = (text: string) => {
    const mentionMatches = text.match(/@\w+/g) || [];
    const mentionedHandles = mentionMatches.map(mention => mention.substring(1));
    const agents = availableAgents.filter(agent => 
      mentionedHandles.includes(agent.handle)
    );
    return agents;
  };

  // Handle text input changes for commands and mentions
  const handleTextChange = (newValue: string) => {
    setInputValue(newValue);
    
    // Update mentioned agents
    const agents = extractMentionedAgents(newValue);
    setMentionedAgents(agents);
    
    // Get cursor position (simplified - using end of text)
    const cursorPosition = newValue.length;
    const textBeforeCursor = newValue.substring(0, cursorPosition);
    
    // Check for prompt templates (/)
    const commandMatch = textBeforeCursor.match(/\/(\w*)$/);
    if (commandMatch) {
      setCommandSearch(commandMatch[1]);
      setShowCommands(true);
      setShowAgents(false);
      setSelectedCommandIndex(0);
    } else {
      setShowCommands(false);
      setCommandSearch('');
    }
    
    // Check for agent mentions (@)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    if (mentionMatch) {
      setAgentSearch(mentionMatch[1]);
      setShowAgents(true);
      setShowCommands(false);
      setSelectedAgentIndex(0);
    } else if (!commandMatch) {
      setShowAgents(false);
      setAgentSearch('');
    }
  };

  // Handle command selection
  const handleCommandSelect = (command: any) => {
    const textBeforeCursor = inputValue;
    const commandMatch = textBeforeCursor.match(/\/\w*$/);
    
    if (commandMatch) {
      const beforeCommand = textBeforeCursor.substring(0, commandMatch.index);
      const newValue = `${beforeCommand}${command.label} `;
      setInputValue(newValue);
    }
    
    setShowCommands(false);
    setCommandSearch('');
  };

  // Handle agent selection
  const handleAgentSelect = (agent: any) => {
    const textBeforeCursor = inputValue;
    const mentionMatch = textBeforeCursor.match(/@\w*$/);
    
    if (mentionMatch) {
      const beforeMention = textBeforeCursor.substring(0, mentionMatch.index);
      const newValue = `${beforeMention}@${agent.handle} `;
      setInputValue(newValue);
    }
    
    setShowAgents(false);
    setAgentSearch('');
  };

  // Remove agent mention
  const removeAgentMention = (agentHandle: string) => {
    const mentionPattern = new RegExp(`@${agentHandle}\\s*`, 'g');
    const newValue = inputValue.replace(mentionPattern, '');
    setInputValue(newValue);
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAITyping]);

  const handleConfigureWorkspace = () => {
    setConfigModalOpen(true);
  };

  const handleProjectUpdate = (projectId: string, updates: Partial<Project>) => {
    if (!selectedWorkspace || !onWorkspaceUpdate) return;
    
    const updatedProjects = selectedWorkspace.projects.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    );
    
    onWorkspaceUpdate(selectedWorkspace.id, { projects: updatedProjects });
  };

  const handleProjectDelete = (projectId: string) => {
    if (onProjectDelete) {
      onProjectDelete(projectId);
    } else if (selectedWorkspace && onWorkspaceUpdate) {
      const updatedProjects = selectedWorkspace.projects.filter(project => project.id !== projectId);
      onWorkspaceUpdate(selectedWorkspace.id, { projects: updatedProjects });
    }
  };

  const handleCreateProject = (workspaceId: string, projectData: Partial<Project>) => {
    if (onProjectCreate) {
      onProjectCreate(workspaceId, projectData);
    } else if (selectedWorkspace && onWorkspaceUpdate) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: projectData.name || '',
        description: projectData.description || '',
        status: 'planning',
        priority: projectData.priority || 'medium',
        progress: 0,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        tags: projectData.tags || [],
        workspaceId,
        assignedTo: projectData.assignedTo,
        dueDate: projectData.dueDate,
        ...projectData
      };
      
      const updatedProjects = [...selectedWorkspace.projects, newProject];
      onWorkspaceUpdate(selectedWorkspace.id, { projects: updatedProjects });
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !selectedWorkspace) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsAITyping(true);

    // Auto-create project based on message content
    const projectData = {
      name: generateProjectName(content),
      description: `Project created from: "${content.trim()}"`,
      status: 'active' as const,
      priority: 'medium' as const,
      tags: extractTagsFromMessage(content),
      createdFromMessage: content.trim()
    };

    // Set the project message FIRST before creating the project
    if (onSetProjectMessage) {
      onSetProjectMessage({ 
        userMessage: content.trim(), 
        aiResponse: generateProjectCreationResponse(content, projectData.name) 
      });
    }

    try {
      // Create the project
      if (onProjectCreate) {
        console.log('🎯 Creating project from chat message with data:', projectData);
        await onProjectCreate(selectedWorkspace.id, projectData);
      }

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: generateProjectCreationResponse(content, projectData.name),
          timestamp: new Date()
        };

        setChatMessages(prev => [...prev, aiResponse]);
        setIsAITyping(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to create project:', error);
      setIsAITyping(false);
      // Clear the pending message if project creation failed
      if (onSetProjectMessage) {
        onSetProjectMessage(null);
      }
    }
  };

  const generateProjectName = (content: string): string => {
    const input = content.toLowerCase();
    
    // Extract key terms and create meaningful project name
    if (input.includes('migrate') || input.includes('migration')) {
      if (input.includes('component')) return 'Component Migration Project';
      if (input.includes('page') || input.includes('template')) return 'Page Migration Project';
      if (input.includes('api') || input.includes('service')) return 'API Migration Project';
      return 'Migration Project';
    }
    
    if (input.includes('analyze') || input.includes('analysis')) {
      return 'Analysis & Assessment Project';
    }
    
    if (input.includes('test') || input.includes('qa') || input.includes('quality')) {
      return 'Testing & QA Project';
    }
    
    if (input.includes('content') || input.includes('cms')) {
      return 'Content Migration Project';
    }
    
    if (input.includes('setup') || input.includes('config') || input.includes('configure')) {
      return 'Setup & Configuration Project';
    }
    
    // Default: extract first few meaningful words
    const words = content.trim().split(' ').slice(0, 3);
    const cleanWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return `${cleanWords.join(' ')} Project`;
  };

  const extractTagsFromMessage = (content: string): string[] => {
    const input = content.toLowerCase();
    const tags: string[] = [];
    
    if (input.includes('urgent') || input.includes('asap') || input.includes('priority')) tags.push('urgent');
    if (input.includes('migrate') || input.includes('migration')) tags.push('migration');
    if (input.includes('component')) tags.push('components');
    if (input.includes('page') || input.includes('template')) tags.push('pages');
    if (input.includes('api') || input.includes('service')) tags.push('api');
    if (input.includes('test') || input.includes('qa')) tags.push('testing');
    if (input.includes('content') || input.includes('cms')) tags.push('content');
    if (input.includes('analyze') || input.includes('analysis')) tags.push('analysis');
    if (input.includes('setup') || input.includes('config')) tags.push('setup');
    
    return tags.length > 0 ? tags : ['auto-created'];
  };

  const generateProjectCreationResponse = (userMessage: string, projectName: string): string => {
    return `🚀 **Project Created Successfully!**

I've created a new project "${projectName}" based on your request: "${userMessage}"

**What's Next:**
• Setting up project structure and workflows
• Analyzing requirements and scope
• Creating initial task breakdown
• Preparing migration strategy

**Project Details:**
✅ **Name:** ${projectName}
✅ **Status:** Active and ready for development
✅ **Auto-tagged:** Based on your message content
✅ **Initial Setup:** Complete

I'm now transitioning you to the project workspace where we can dive deeper into the specific requirements and start building your migration plan. You'll see the project dashboard in just a moment...

Ready to get started? 🎯`;
  };

  const handleQuickAction = (action: QuickAction) => {
    setInputValue(action.prompt);
    handleSendMessage(action.prompt);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <PlayCircle className="text-success" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
      case 'paused': return <PauseCircle className="text-warning" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
      case 'completed': return <CheckCircle2 className="text-success" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
      case 'planning': return <FileSearch className="text-primary" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
      default: return <PlayCircle style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success border-success/20';
      case 'paused': return 'bg-warning/10 text-warning border-warning/20';
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'planning': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground border-muted-foreground/20';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'assessment': return 'bg-primary/10 text-primary';
      case 'setup': return 'bg-primary/10 text-primary';
      case 'migrate': return 'bg-warning/10 text-warning';
      case 'reconstruct': return 'bg-primary/10 text-primary';
      case 'launch': return 'bg-success/10 text-success';
      case 'completed': return 'bg-success/10 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate workspace stats
  const workspaceStats = selectedWorkspace ? {
    totalProjects: selectedWorkspace.projects.length,
    activeProjects: selectedWorkspace.projects.filter(p => p.status === 'active').length,
    completedProjects: selectedWorkspace.projects.filter(p => p.status === 'completed').length,
    avgProgress: selectedWorkspace.projects.length > 0 
      ? Math.round(selectedWorkspace.projects.reduce((sum, p) => sum + p.progress, 0) / selectedWorkspace.projects.length)
      : 0
  } : null;

  if (!selectedWorkspace) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Folder className="text-muted-foreground mx-auto" style={{ width: 'var(--spacing-12)', height: 'var(--spacing-12)', marginBottom: 'var(--spacing-4)' }} />
          <h3>No Workspace Selected</h3>
          <p className="text-muted-foreground">Select a workspace to view its overview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-primary/18 via-accent/22 through-secondary/16 to-primary/14 relative overflow-y-auto" style={{ padding: 'var(--spacing-16)' }}>
      {/* Prominent AI Chat Box - Top Center */}
      <div className="flex-shrink-0 min-h-[65vh] relative overflow-hidden flex items-center justify-center" style={{ padding: 'var(--spacing-16)' }}>
        {/* Subtle background pattern */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/3 via-transparent to-accent/4 opacity-40 pointer-events-none z-0"></div>
        
        <div className="max-w-4xl w-full relative z-10">
          <div className="text-center" style={{ marginBottom: 'var(--spacing-8)' }}>
            <h1 className="flex items-center justify-center" style={{ marginBottom: 'var(--spacing-2)', fontSize: '32px', gap: 'var(--spacing-2)' }}>
              Build with {selectedWorkspace.name} Workspace
              {availableWorkspaces && availableWorkspaces.length > 1 && onWorkspaceSelect && (
                <WorkspaceDropdown
                  selectedWorkspace={selectedWorkspace}
                  availableWorkspaces={availableWorkspaces}
                  onWorkspaceSelect={onWorkspaceSelect}
                  onCreateWorkspace={onCreateWorkspace}
                  showCreateOption={true}
                />
              )}
            </h1>
            <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
              Create projects and manage tasks with AI assistance
            </p>
          </div>
          
          {/* Central AI Chat Input */}
          <Card className="max-w-3xl mx-auto shadow-lg border border-border/60 hover:border-primary/30 transition-colors backdrop-blur-sm bg-card/95" style={{ borderRadius: 'var(--radius-5)' }}>
            <CardContent className="relative border border-primary transition-all duration-300 hover:border-primary/80 hover:shadow-lg hover:shadow-primary/10 active:border-primary/60 active:shadow-md active:shadow-primary/20 active:scale-[0.995]" style={{ padding: 'var(--spacing-6)', borderRadius: 'var(--radius-5)' }}>
              <div className="relative">
                {/* Prompt Templates Dropdown */}
                {showCommands && filteredCommands.length > 0 && (
                  <div className="absolute bottom-full left-0 w-80 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden flex flex-col max-h-80" style={{ marginBottom: 'var(--spacing-2)' }}>
                    <div className="flex-shrink-0" style={{ padding: 'var(--spacing-2)' }}>
                      <div className="text-muted-foreground" style={{ fontSize: 'var(--font-size-xs)', marginBottom: 'var(--spacing-2)', paddingLeft: 'var(--spacing-2)', paddingRight: 'var(--spacing-2)' }}>
                        Prompt Templates ({filteredCommands.length})
                      </div>
                    </div>
                    <div className="overflow-y-auto" style={{ paddingLeft: 'var(--spacing-2)', paddingRight: 'var(--spacing-2)', paddingBottom: 'var(--spacing-2)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                        {filteredCommands.map((command, index) => {
                          const Icon = command.icon;
                          return (
                            <div
                              key={command.id}
                              className={`flex items-center rounded-lg cursor-pointer transition-colors ${
                                index === selectedCommandIndex 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'hover:bg-muted'
                              }`}
                              onClick={() => handleCommandSelect(command)}
                              style={{ gap: 'var(--spacing-3)', padding: 'var(--spacing-2)' }}
                            >
                              <div className="flex-shrink-0">
                                <Icon style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="truncate">{command.label}</div>
                                <div className={`truncate ${
                                  index === selectedCommandIndex 
                                    ? 'text-primary-foreground/80' 
                                    : 'text-muted-foreground'
                                }`} style={{ fontSize: 'var(--font-size-xs)' }}>
                                  {command.description}
                                </div>
                              </div>
                              {index === selectedCommandIndex && (
                                <div className="text-primary-foreground/60 flex-shrink-0" style={{ fontSize: 'var(--font-size-xs)' }}>
                                  ↵
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="border-t bg-muted/30 flex-shrink-0" style={{ padding: 'var(--spacing-2)' }}>
                      <div className="text-muted-foreground flex items-center" style={{ fontSize: 'var(--font-size-xs)', gap: 'var(--spacing-4)' }}>
                        <span>↑↓ Navigate</span>
                        <span>↵ Select</span>
                        <span>Esc Close</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Agent Mentions Dropdown */}
                {showAgents && filteredAgents.length > 0 && (
                  <div className="absolute bottom-full left-0 w-80 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden" style={{ marginBottom: 'var(--spacing-2)' }}>
                    <div style={{ padding: 'var(--spacing-2)' }}>
                      <div className="text-muted-foreground" style={{ fontSize: 'var(--font-size-xs)', marginBottom: 'var(--spacing-2)', paddingLeft: 'var(--spacing-2)', paddingRight: 'var(--spacing-2)' }}>
                        Available Agents ({filteredAgents.length})
                      </div>
                      <div className="max-h-48 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                        {filteredAgents.map((agent, index) => {
                          const Icon = agent.avatar.icon;
                          return (
                            <div
                              key={agent.id}
                              className={`flex items-center rounded-lg cursor-pointer transition-colors ${
                                index === selectedAgentIndex 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'hover:bg-muted'
                              }`}
                              onClick={() => handleAgentSelect(agent)}
                              style={{ gap: 'var(--spacing-3)', padding: 'var(--spacing-2)' }}
                            >
                              <div className="flex-shrink-0">
                                <div className={`rounded-lg ${agent.avatar.bg} text-white`} style={{ padding: 'var(--spacing-2)' }}>
                                  <Icon style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                                  <span className="truncate">{agent.name}</span>
                                  <Badge 
                                    variant="secondary" 
                                    className={`${index === selectedAgentIndex ? 'bg-primary-foreground/20' : ''}`}
                                    style={{ fontSize: 'var(--font-size-xs)' }}
                                  >
                                    @{agent.handle}
                                  </Badge>
                                </div>
                                <div className={`truncate ${
                                  index === selectedAgentIndex 
                                    ? 'text-primary-foreground/80' 
                                    : 'text-muted-foreground'
                                }`} style={{ fontSize: 'var(--font-size-xs)' }}>
                                  {agent.role}
                                </div>
                                <div className={`truncate ${
                                  index === selectedAgentIndex 
                                    ? 'text-primary-foreground/70' 
                                    : 'text-muted-foreground'
                                }`} style={{ fontSize: 'var(--font-size-xs)' }}>
                                  {agent.description}
                                </div>
                              </div>
                              {index === selectedAgentIndex && (
                                <div className="text-primary-foreground/60 flex-shrink-0" style={{ fontSize: 'var(--font-size-xs)' }}>
                                  ↵
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="border-t bg-muted/30" style={{ padding: 'var(--spacing-2)' }}>
                      <div className="text-muted-foreground flex items-center" style={{ fontSize: 'var(--font-size-xs)', gap: 'var(--spacing-4)' }}>
                        <span>↑↓ Navigate</span>
                        <span>↵ Select</span>
                        <span>Esc Close</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mentioned Agents Chips */}
                {mentionedAgents.length > 0 && (
                  <div className="flex flex-wrap bg-muted/30 rounded-lg border" style={{ gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-2)', padding: 'var(--spacing-2)' }}>
                    <div className="text-muted-foreground flex items-center" style={{ fontSize: 'var(--font-size-xs)', marginRight: 'var(--spacing-2)' }}>
                      Mentioned:
                    </div>
                    {mentionedAgents.map((agent) => (
                      <div key={agent.id} className={`inline-flex items-center rounded-full text-white ${agent.avatar.bg}`} style={{ gap: 'var(--spacing-1-5)', paddingLeft: 'var(--spacing-2)', paddingRight: 'var(--spacing-2)', paddingTop: 'var(--spacing-1)', paddingBottom: 'var(--spacing-1)', marginRight: 'var(--spacing-1)', marginBottom: 'var(--spacing-1)' }}>
                        <agent.avatar.icon style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
                        <span>@{agent.handle}</span>
                        <button
                          type="button"
                          onClick={() => removeAgentMention(agent.handle)}
                          className="hover:bg-white/20 rounded-full transition-colors"
                          style={{ marginLeft: 'var(--spacing-0-5)', padding: 'var(--spacing-0-5)' }}
                        >
                          <X style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Textarea
                  value={inputValue}
                  onChange={(e) => handleTextChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown' && (showCommands || showAgents)) {
                      e.preventDefault();
                      if (showCommands) {
                        setSelectedCommandIndex(prev => 
                          prev < filteredCommands.length - 1 ? prev + 1 : 0
                        );
                      } else if (showAgents) {
                        setSelectedAgentIndex(prev => 
                          prev < filteredAgents.length - 1 ? prev + 1 : 0
                        );
                      }
                    } else if (e.key === 'ArrowUp' && (showCommands || showAgents)) {
                      e.preventDefault();
                      if (showCommands) {
                        setSelectedCommandIndex(prev => 
                          prev > 0 ? prev - 1 : filteredCommands.length - 1
                        );
                      } else if (showAgents) {
                        setSelectedAgentIndex(prev => 
                          prev > 0 ? prev - 1 : filteredAgents.length - 1
                        );
                      }
                    } else if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (showCommands && filteredCommands[selectedCommandIndex]) {
                        handleCommandSelect(filteredCommands[selectedCommandIndex]);
                      } else if (showAgents && filteredAgents[selectedAgentIndex]) {
                        handleAgentSelect(filteredAgents[selectedAgentIndex]);
                      } else {
                        handleSendMessage(inputValue);
                      }
                    } else if (e.key === 'Escape' && (showCommands || showAgents)) {
                      e.preventDefault();
                      setShowCommands(false);
                      setShowAgents(false);
                      setCommandSearch('');
                      setAgentSearch('');
                    }
                  }}
                  placeholder="Ask me anything about your project..."
                  className="min-h-[80px] max-h-[120px] border-0 shadow-none resize-none focus-visible:ring-0 bg-transparent"
                  style={{ fontSize: '14px', padding: 0 }}
                  disabled={isAITyping}
                />
              </div>
              
              {/* Helper Text */}
              <div className="border-t border-border/60" style={{ marginTop: 'var(--spacing-3)', paddingTop: 'var(--spacing-3)' }}>
                <p className="text-muted-foreground">
                  Tip: Type / for prompt templates, @ for agents, or just start typing your question
                </p>
              </div>
              
              {/* Send Button - Positioned absolutely in bottom right of CardContent */}
              <Button
                size="sm"
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isAITyping}
                className="absolute bg-primary hover:bg-primary/90"
                style={{ bottom: 'var(--spacing-6)', right: 'var(--spacing-6)', height: 'var(--spacing-8)', width: 'var(--spacing-8)', padding: 0 }}
              >
                <Send style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
              </Button>
            </CardContent>
          </Card>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap justify-center" style={{ gap: 'var(--spacing-2)', marginTop: 'var(--spacing-6)' }}>
            {WORKSPACE_QUICK_ACTIONS.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action)}
                className="bg-background/80 hover:bg-background border-border/60 backdrop-blur-sm"
                style={{ gap: 'var(--spacing-2)', height: 'var(--spacing-8)' }}
              >
                <action.icon style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="flex-1">
        <div className="max-w-6xl mx-auto bg-card" style={{ borderRadius: 'var(--radius-4)', padding: 'var(--spacing-6)', marginLeft: 'var(--spacing-56)', marginRight: 'var(--spacing-56)', marginTop: 0, marginBottom: 0 }}>
          <ProjectList
            projects={selectedWorkspace.projects}
            workspaceId={selectedWorkspace.id}
            selectedWorkspace={selectedWorkspace}
            availableWorkspaces={availableWorkspaces}
            onProjectUpdate={handleProjectUpdate}
            onProjectDelete={handleProjectDelete}
            onCreateProject={handleCreateProject}
            onProjectSelect={onProjectClick}
            onWorkspaceSelect={onWorkspaceSelect}
          />
        </div>
      </div>

      {/* Workspace Configuration Modal */}
      <WorkspaceConfigurationModal 
        open={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        workspaceName={selectedWorkspace.name}
      />
    </div>
  );
}
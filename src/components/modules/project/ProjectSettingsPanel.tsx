import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/modules/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Settings, 
  Monitor, 
  Palette, 
  MessageSquare,
  Save,
  Bot,
  Cpu,
  Code,
  FileText,
  CheckCircle,
  AlertCircle,
  Edit3,
  Check,
  X,
  Upload,
  Moon,
  Sun,
  Zap
} from 'lucide-react';

interface ProjectSettingsPanelProps {
  selectedProject: any;
  onProjectUpdate?: (projectId: string, updates: any) => void;
}

type SettingsCategory = 'general' | 'agents' | 'instructions';

// Agent interface and data (same as MentionInput)
interface Agent {
  id: string;
  name: string;
  handle: string;
  role: string;
  avatar: React.ComponentType<{ className?: string }>;
  status: 'online' | 'busy' | 'away' | 'offline';
  description: string;
  color: string;
  customName?: string;
  enabled: boolean;
  instructions?: string;
}

// Initial agents data
const initialAgents: Agent[] = [
  {
    id: 'architect',
    name: 'Strategy',
    handle: 'architect',
    role: 'Lead Migration Planning',
    avatar: Cpu,
    status: 'online',
    description: 'Plans and orchestrates migration strategies',
    color: 'bg-info',
    enabled: true
  },
  {
    id: 'data',
    name: 'Data',
    handle: 'data',
    role: 'Legacy Code Analysis',
    avatar: Code,
    status: 'online',
    description: 'Handles data migration and transformations',
    color: 'bg-success',
    enabled: true
  },
  {
    id: 'sitecore',
    name: 'Sitecore',
    handle: 'sitecore',
    role: 'Design System Migration',
    avatar: Palette,
    status: 'busy',
    description: 'Specialized in Sitecore architecture',
    color: 'bg-warning',
    enabled: true
  },
  {
    id: 'frontend',
    name: 'Frontend',
    handle: 'frontend',
    role: 'Content & Data Migration',
    avatar: FileText,
    status: 'online',
    description: 'Migrates design systems and UI components',
    color: 'bg-accent-purple',
    enabled: true
  },
  {
    id: 'tester',
    name: 'QA Testing Agent',
    handle: 'tester',
    role: 'Quality Assurance',
    avatar: CheckCircle,
    status: 'away',
    description: 'Automated testing and quality validation',
    color: 'bg-teal-500',
    enabled: false
  },
  {
    id: 'validator',
    name: 'Validation Agent',
    handle: 'validator',
    role: 'Compliance & Standards',
    avatar: AlertCircle,
    status: 'online',
    description: 'Validates accessibility and SEO compliance',
    color: 'bg-warning',
    enabled: true
  },
  {
    id: 'deployer',
    name: 'Deployment Agent',
    handle: 'deployer',
    role: 'Infrastructure & Deployment',
    avatar: Settings,
    status: 'offline',
    description: 'Manages deployment and infrastructure setup',
    color: 'bg-gray-500',
    enabled: false
  },
  {
    id: 'optimizer',
    name: 'Performance Optimizer',
    handle: 'optimizer',
    role: 'Performance Enhancement',
    avatar: Zap,
    status: 'online',
    description: 'Optimizes performance and monitors metrics',
    color: 'bg-destructive',
    enabled: true
  }
];

export function ProjectSettingsPanel({ selectedProject, onProjectUpdate }: ProjectSettingsPanelProps) {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('general');
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [settings, setSettings] = useState({
    // Appearance
    animationsEnabled: true,
    fontSize: 14,
    
    // Layout
    defaultLayout: 'two-panel',
    sidebarCollapsed: false,
    showPhaseProgress: true,
    autoHidePanels: false,
    
    // Notifications
    taskNotifications: true,
    agentUpdates: true,
    jiraSync: false,
    emailDigest: 'weekly',
    
    // Privacy & Security
    dataRetention: '12-months',
    analyticsEnabled: true,
    crashReporting: true,
    
    // AI & Automation
    autoTaskGeneration: true,
    smartSuggestions: true,
    agentConfidenceThreshold: 0.8,
    
    // Integrations
    jiraEnabled: false,
    githubEnabled: false,
    slackNotifications: false
  });

  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [instructionsDialogAgent, setInstructionsDialogAgent] = useState<Agent | null>(null);
  const [agentInstructions, setAgentInstructions] = useState('');
  
  // Project instructions state
  const [projectInstructions, setProjectInstructions] = useState('');
  
  // Project name state
  const [projectName, setProjectName] = useState(selectedProject?.name || '');

  // Update project name when selectedProject changes
  useEffect(() => {
    setProjectName(selectedProject?.name || '');
  }, [selectedProject?.name]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'general', icon: Settings, label: 'General' },
    { id: 'agents', icon: Bot, label: 'AI Agents' },
    { id: 'instructions', icon: FileText, label: 'Instructions' }
  ];

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Agent management functions
  const updateAgent = (agentId: string, updates: Partial<Agent>) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, ...updates } : agent
    ));
  };

  const toggleAgentEnabled = (agentId: string) => {
    updateAgent(agentId, { enabled: !agents.find(a => a.id === agentId)?.enabled });
  };

  const startEditingAgent = (agent: Agent) => {
    setEditingAgent(agent.id);
    setEditingName(agent.customName || agent.name);
  };

  const saveAgentName = (agentId: string) => {
    updateAgent(agentId, { customName: editingName.trim() || undefined });
    setEditingAgent(null);
    setEditingName('');
  };

  const cancelEditing = () => {
    setEditingAgent(null);
    setEditingName('');
  };

  const openInstructionsDialog = (agent: Agent) => {
    setInstructionsDialogAgent(agent);
    setAgentInstructions(agent.instructions || '');
  };

  const saveAgentInstructions = () => {
    if (instructionsDialogAgent) {
      updateAgent(instructionsDialogAgent.id, { instructions: agentInstructions.trim() || undefined });
      setInstructionsDialogAgent(null);
      setAgentInstructions('');
    }
  };

  const cancelInstructionsDialog = () => {
    setInstructionsDialogAgent(null);
    setAgentInstructions('');
  };

  const getStatusIndicator = (status: Agent['status']) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'busy': return 'bg-destructive';
      case 'away': return 'bg-warning';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  // File upload handlers for project instructions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  // Project name update handler
  const handleProjectNameSave = () => {
    if (selectedProject && onProjectUpdate && projectName.trim()) {
      onProjectUpdate(selectedProject.id, { name: projectName.trim() });
    }
  };

  const renderContent = () => {
    switch (activeCategory) {
      case 'general':
        return (
          <div style={{ padding: 'var(--spacing-6)', gap: 'var(--spacing-6)' }} className="flex flex-col">
            <div>
              <h2 className="text-foreground" style={{ marginBottom: 'var(--spacing-1)' }}>General Settings</h2>
              <p className="text-muted-foreground">Customize the appearance and behavior of your project</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                  <Settings className="size-5" />
                  Project Information
                </CardTitle>
                <CardDescription>
                  Update basic project details and information
                </CardDescription>
              </CardHeader>
              <CardContent style={{ gap: 'var(--spacing-6)' }} className="flex flex-col">
                <div style={{ gap: 'var(--spacing-2)' }} className="flex flex-col">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                  />
                  <p className="text-muted-foreground">
                    This name will be displayed across the workspace and in project lists
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    size="sm"
                    onClick={handleProjectNameSave}
                    disabled={!projectName.trim() || projectName.trim() === selectedProject?.name}
                  >
                    <Save className="size-4" style={{ marginRight: 'var(--spacing-2)' }} />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                  <Palette className="size-5" />
                  Theme & Appearance
                </CardTitle>
              </CardHeader>
              <CardContent style={{ gap: 'var(--spacing-6)' }} className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Theme</Label>
                    <p className="text-muted-foreground">Choose your preferred color scheme</p>
                  </div>
                  <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'auto') => setTheme(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                          <Sun className="size-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                          <Moon className="size-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="auto">
                        <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                          <Monitor className="size-4" />
                          Auto
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </CardContent>
            </Card>
          </div>
        );

      case 'agents':
        return (
          <div style={{ padding: 'var(--spacing-6)', gap: 'var(--spacing-6)' }} className="flex flex-col">
            {/* Header */}
            <div>
              <h2 className="text-foreground" style={{ marginBottom: 'var(--spacing-1)' }}>AI Agent Management</h2>
              <p className="text-muted-foreground">Manage your AI agents, customize their names, and control their availability</p>
            </div>

            <Card>
              <CardContent style={{ padding: 'var(--spacing-6)' }}>
                <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'var(--spacing-4)' }}>
                  {agents.map((agent) => {
                    const Icon = agent.avatar;
                    const displayName = agent.customName || agent.name;
                    const isEditing = editingAgent === agent.id;
                    
                    return (
                      <Card key={agent.id} className={`relative transition-all ${agent.enabled ? 'border-primary/20' : 'opacity-60'}`}>
                        <CardContent style={{ padding: 'var(--spacing-4)' }}>
                          {/* Header: Agent Icon, Switch, and More Options */}
                          <div className="flex items-start justify-between" style={{ marginBottom: 'var(--spacing-3)' }}>
                            <div className="relative">
                              <div className={`rounded-lg ${agent.color} text-white`} style={{ padding: 'var(--spacing-3)' }}>
                                <Icon className="size-6" />
                              </div>
                              <div 
                                className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-background ${getStatusIndicator(agent.status)}`}
                              />
                            </div>
                            
                            <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openInstructionsDialog(agent)}
                                className="h-8 w-8 p-0 opacity-60 hover:opacity-100 rounded-full"
                                title="Configure agent instructions"
                              >
                                <MessageSquare className="size-4" />
                              </Button>
                              <Switch 
                                checked={agent.enabled}
                                onCheckedChange={() => toggleAgentEnabled(agent.id)}
                                size="sm"
                              />
                            </div>
                          </div>

                          {/* Agent Name with Hover-to-Edit */}
                          <div style={{ gap: 'var(--spacing-2)' }} className="flex flex-col">
                            {isEditing ? (
                              <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                                <Input
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  className="h-8"
                                  placeholder="Agent name"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveAgentName(agent.id);
                                    if (e.key === 'Escape') cancelEditing();
                                  }}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => saveAgentName(agent.id)}
                                  className="h-8 w-8 p-0 text-success"
                                >
                                  <Check className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={cancelEditing}
                                  className="h-8 w-8 p-0 text-destructive"
                                >
                                  <X className="size-4" />
                                </Button>
                              </div>
                            ) : (
                              <div 
                                className="group cursor-pointer rounded hover:bg-muted transition-colors" 
                                style={{ padding: 'var(--spacing-1) var(--spacing-2)', margin: 'calc(-1 * var(--spacing-1)) calc(-1 * var(--spacing-2))' }}
                                onClick={() => startEditingAgent(agent)}
                              >
                                <h4 
                                  className="truncate"
                                  style={{ padding: 'var(--spacing-1)' }}
                                  title="Click to edit name"
                                >
                                  {displayName}
                                </h4>
                              </div>
                            )}
                            
                            <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginTop: 'var(--spacing-3)' }}>
                              <Badge variant="secondary">@{agent.handle}</Badge>
                              <Badge variant="outline" className="capitalize">
                                {agent.status}
                              </Badge>
                            </div>
                            
                            <p className="text-muted-foreground">{agent.role}</p>
                            <p className="text-muted-foreground">{agent.description}</p>
                          </div>

                          {/* Indicators */}
                          <div style={{ marginTop: 'var(--spacing-3)', gap: 'var(--spacing-1)' }} className="flex flex-col">
                            {agent.customName && (
                              <div className="flex items-center text-muted-foreground" style={{ gap: 'var(--spacing-1)' }}>
                                <Edit3 className="size-3" />
                                <span>Custom name set</span>
                              </div>
                            )}
                            {agent.instructions && (
                              <div className="flex items-center text-muted-foreground" style={{ gap: 'var(--spacing-1)' }}>
                                <MessageSquare className="size-3" />
                                <span>Custom instructions configured</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Agent Instructions Dialog */}
            <Dialog open={!!instructionsDialogAgent} onOpenChange={() => !instructionsDialogAgent || cancelInstructionsDialog()}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                    {instructionsDialogAgent && (
                      <>
                        <div className={`rounded-lg ${instructionsDialogAgent.color} text-white`} style={{ padding: 'var(--spacing-2)' }}>
                          <instructionsDialogAgent.avatar className="size-4" />
                        </div>
                        Configure {instructionsDialogAgent.customName || instructionsDialogAgent.name}
                      </>
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    Provide specific instructions to customize how this agent behaves and what it should focus on during migration tasks.
                  </DialogDescription>
                </DialogHeader>
                <div style={{ gap: 'var(--spacing-4)' }} className="flex flex-col">
                  <div style={{ gap: 'var(--spacing-2)' }} className="flex flex-col">
                    <Label htmlFor="agent-instructions">Agent Instructions</Label>
                    <Textarea
                      id="agent-instructions"
                      placeholder="Enter specific instructions for this agent... 

Examples:
- Focus on accessibility compliance when analyzing components
- Prioritize performance optimization in code reviews  
- Always suggest modern React patterns for component migration
- Include security considerations in deployment planning"
                      value={agentInstructions}
                      onChange={(e) => setAgentInstructions(e.target.value)}
                      className="min-h-[200px] resize-none"
                    />
                    <p className="text-muted-foreground">
                      These instructions will guide the agent's behavior and recommendations throughout the migration process.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={cancelInstructionsDialog}>
                    Cancel
                  </Button>
                  <Button onClick={saveAgentInstructions}>
                    <Save className="size-4" style={{ marginRight: 'var(--spacing-2)' }} />
                    Save Instructions
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case 'instructions':
        return (
          <div style={{ padding: 'var(--spacing-6)', gap: 'var(--spacing-6)' }} className="flex flex-col">
            <div>
              <h2 className="text-foreground" style={{ marginBottom: 'var(--spacing-1)' }}>Project Instructions</h2>
              <p className="text-muted-foreground">
                Provide specific instructions and context for this project
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Custom Instructions</CardTitle>
                <CardDescription>
                  Provide detailed instructions and context for this project
                </CardDescription>
              </CardHeader>
              <CardContent style={{ gap: 'var(--spacing-6)' }} className="flex flex-col">
                <div style={{ gap: 'var(--spacing-3)' }} className="flex flex-col">
                  <Label htmlFor="project-instructions">Instructions</Label>
                  <Textarea
                    id="project-instructions"
                    placeholder="Provide specific instructions for this project. Include any special requirements, constraints, coding standards, or project-specific context that would help with understanding and working with your codebase..."
                    className="min-h-[200px] resize-none"
                    value={projectInstructions}
                    onChange={(e) => setProjectInstructions(e.target.value)}
                  />
                  <p className="text-muted-foreground">
                    These instructions will be used to provide context when working on tasks for this project.
                  </p>
                </div>

                <div style={{ gap: 'var(--spacing-3)' }} className="flex flex-col">
                  <Label>Supporting Documents</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg" style={{ padding: 'var(--spacing-6)' }}>
                    {uploadedFile ? (
                      <div className="flex items-center justify-between bg-muted/50 rounded-lg" style={{ padding: 'var(--spacing-3)' }}>
                        <div className="flex items-center" style={{ gap: 'var(--spacing-3)' }}>
                          <FileText className="size-5 text-muted-foreground" />
                          <div>
                            <div>{uploadedFile.name}</div>
                            <div className="text-muted-foreground">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveFile}
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <div style={{ marginTop: 'var(--spacing-4)' }}>
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="text-primary hover:text-primary/80">
                              Click to upload
                            </span>
                            <input
                              id="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileUpload}
                              accept=".txt,.md,.pdf,.doc,.docx"
                            />
                          </label>
                          <span className="text-muted-foreground"> or drag and drop</span>
                        </div>
                        <p className="text-muted-foreground" style={{ marginTop: 'var(--spacing-2)' }}>
                          Upload documentation, requirements, or reference materials (TXT, MD, PDF, DOC, DOCX)
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    Upload additional documentation that will help provide context and requirements for your project.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card flex-shrink-0">
        <div style={{ padding: 'var(--spacing-5) var(--spacing-4)' }}>
          <h2 style={{ margin: '0' }} className="text-left">Project Settings</h2>
        </div>
        
        <nav style={{ padding: '0 var(--spacing-4)', gap: 'var(--spacing-1)' }} className="flex flex-col">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveCategory(item.id as SettingsCategory)}
                className={`w-full flex items-center rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                style={{ gap: 'var(--spacing-3)', padding: 'var(--spacing-2) var(--spacing-3)' }}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}
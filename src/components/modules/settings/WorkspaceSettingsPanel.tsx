import React, { useState } from 'react';
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
  Zap,
  Trash2
} from 'lucide-react';

interface WorkspaceSettingsPanelProps {
  selectedProject: any;
  onWorkspaceUpdate?: (workspaceId: string, updates: any) => void;
}

type SettingsCategory = 'general' | 'connectors' | 'agents' | 'instructions';

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
    name: 'Migration Architect',
    handle: 'architect',
    role: 'Lead Migration Planning',
    avatar: Cpu,
    status: 'online',
    description: 'Plans and orchestrates migration strategies',
    color: 'bg-primary',
    enabled: true
  },
  {
    id: 'analyzer',
    name: 'Code Analyzer',
    handle: 'analyzer',
    role: 'Legacy Code Analysis',
    avatar: Code,
    status: 'online',
    description: 'Analyzes legacy codebases and dependencies',
    color: 'bg-success',
    enabled: true
  },
  {
    id: 'designer',
    name: 'UI Migration Designer',
    handle: 'designer',
    role: 'Design System Migration',
    avatar: Palette,
    status: 'busy',
    description: 'Migrates design systems and UI components',
    color: 'bg-primary',
    enabled: true
  },
  {
    id: 'content',
    name: 'Content Migration Agent',
    handle: 'content',
    role: 'Content & Data Migration',
    avatar: FileText,
    status: 'online',
    description: 'Handles content and data transformation',
    color: 'bg-warning',
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
    color: 'bg-success',
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
    color: 'bg-muted',
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

// Team members data
const teamMembers = [
  { id: '1', name: 'John Smith', email: 'john@company.com', role: 'Project Lead', avatar: 'JS', status: 'online' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Developer', avatar: 'SJ', status: 'away' },
  { id: '3', name: 'Mike Chen', email: 'mike@company.com', role: 'Designer', avatar: 'MC', status: 'online' },
  { id: '4', name: 'Emma Wilson', email: 'emma@company.com', role: 'QA Engineer', avatar: 'EW', status: 'offline' }
];

export function WorkspaceSettingsPanel({ selectedProject, onWorkspaceUpdate }: WorkspaceSettingsPanelProps) {
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
  
  // Workspace instructions state
  const [workspaceInstructions, setWorkspaceInstructions] = useState('');
  
  // Workspace name and description state
  const [workspaceName, setWorkspaceName] = useState(selectedProject?.name || '');
  const [workspaceDescription, setWorkspaceDescription] = useState(selectedProject?.description || '');

  // Update workspace name and description when selectedProject changes
  React.useEffect(() => {
    setWorkspaceName(selectedProject?.name || '');
    setWorkspaceDescription(selectedProject?.description || '');
  }, [selectedProject?.name, selectedProject?.description]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Delete workspace state
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

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
      case 'offline': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  // File upload handlers for workspace instructions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  // Workspace update handler
  const handleWorkspaceSave = () => {
    if (selectedProject && onWorkspaceUpdate && workspaceName.trim()) {
      onWorkspaceUpdate(selectedProject.id, { 
        name: workspaceName.trim(),
        description: workspaceDescription.trim()
      });
    }
  };
  
  // Delete workspace handler
  const handleDeleteWorkspace = () => {
    if (deleteConfirmText.toLowerCase() === 'delete' && selectedProject) {
      // Handle deletion logic here
      console.log('Deleting workspace:', selectedProject.id);
      // You can add the actual deletion logic or callback here
    }
  };

  const renderContent = () => {
    switch (activeCategory) {
      case 'general':
        return (
          <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <h2 className="text-foreground" style={{ marginBottom: 'var(--spacing-1)' }}>General Settings</h2>
              <p className="text-muted-foreground">Configure workspace information and manage workspace lifecycle</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                  <Settings className="size-5" />
                  Workspace Information
                </CardTitle>
                <CardDescription>
                  Update workspace name and description
                </CardDescription>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <Label htmlFor="workspace-name">Workspace Name</Label>
                  <Input
                    id="workspace-name"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="Enter workspace name"
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <Label htmlFor="workspace-description">Workspace Description</Label>
                  <Textarea
                    id="workspace-description"
                    value={workspaceDescription}
                    onChange={(e) => setWorkspaceDescription(e.target.value)}
                    placeholder="Enter workspace description"
                    className="min-h-[100px] resize-none"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    size="sm"
                    onClick={handleWorkspaceSave}
                    disabled={
                      !workspaceName.trim() || 
                      (workspaceName.trim() === selectedProject?.name && 
                       workspaceDescription.trim() === (selectedProject?.description || ''))
                    }
                  >
                    <Save className="size-4" style={{ marginRight: 'var(--spacing-2)' }} />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle>Delete Workspace</CardTitle>
                <CardDescription>
                  Permanently delete this workspace and all its data
                </CardDescription>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <Label htmlFor="delete-confirm">Type "Delete" to confirm workspace deletion</Label>
                  <Input
                    id="delete-confirm"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder='Type "Delete" to confirm'
                  />
                  <p className="text-muted-foreground">
                    This action cannot be undone. This will permanently delete the workspace and all associated tasks, comments, and data.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteWorkspace}
                    disabled={deleteConfirmText.toLowerCase() !== 'delete'}
                  >
                    Delete Workspace Forever
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'agents':
        return (
          <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
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
                              <div className={`text-white ${agent.color}`} style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--radius)' }}>
                                <Icon className="size-6" />
                              </div>
                              <div 
                                className={`absolute border-2 border-background ${getStatusIndicator(agent.status)}`}
                                style={{ 
                                  bottom: '-4px',
                                  right: '-4px',
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '9999px'
                                }}
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
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
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
                                className="group cursor-pointer hover:bg-muted transition-colors" 
                                onClick={() => startEditingAgent(agent)}
                                style={{ 
                                  borderRadius: 'var(--radius)',
                                  padding: 'var(--spacing-1) var(--spacing-2)',
                                  margin: '-var(--spacing-1) -var(--spacing-2)'
                                }}
                              >
                                <h4 
                                  className="truncate"
                                  title="Click to edit name"
                                  style={{ padding: 'var(--spacing-1)' }}
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
                          <div style={{ marginTop: 'var(--spacing-3)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
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
                        <div className={`text-white ${instructionsDialogAgent.color}`} style={{ padding: 'var(--spacing-2)', borderRadius: 'var(--radius)' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
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
          <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <h2 className="text-foreground" style={{ marginBottom: 'var(--spacing-1)' }}>Workspace Instructions</h2>
              <p className="text-muted-foreground">
                Provide specific instructions and context for this workspace
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Custom Instructions</CardTitle>
                <CardDescription>
                  Provide detailed instructions and context for this workspace
                </CardDescription>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  <Label htmlFor="workspace-instructions">Instructions</Label>
                  <Textarea
                    id="workspace-instructions"
                    placeholder="Provide specific instructions for this workspace. Include any special requirements, constraints, coding standards, or project-specific context that would help with understanding and working with your codebase..."
                    className="min-h-[200px] resize-none"
                    value={workspaceInstructions}
                    onChange={(e) => setWorkspaceInstructions(e.target.value)}
                  />
                  <p className="text-muted-foreground">
                    These instructions will be used to provide context when working on tasks for this workspace.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  <Label>Supporting Documents</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25" style={{ borderRadius: 'var(--radius)', padding: 'var(--spacing-6)' }}>
                    {uploadedFile ? (
                      <div className="flex items-center justify-between bg-muted/50" style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--radius)' }}>
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
                    Upload additional documentation that will help provide context and requirements for your workspace.
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
        <div style={{ padding: 'var(--spacing-5) var(--spacing-4) var(--spacing-4)' }}>
          <h2 className="m-0 text-left">Workspace Settings</h2>
        </div>
        
        <nav style={{ padding: '0 var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveCategory(item.id as SettingsCategory)}
                className={`w-full flex items-center text-left transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                style={{ 
                  gap: 'var(--spacing-3)', 
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  borderRadius: 'var(--radius)' 
                }}
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

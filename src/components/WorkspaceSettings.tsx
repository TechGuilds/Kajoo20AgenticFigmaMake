import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MarkdownField } from '@/components/modules/chat';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner@2.0.3';
import { useIsMobile } from '@/components/ui/use-mobile';
import { useTheme } from '@/components/modules/shared';
import { AICreditTracker } from '@/components/modules/credit';
import kajooLogo from 'figma:asset/48a871c3a64e669a3735fda2a78b4f1e5cf569cd.png';
import { 
  Trash2,
  Link,
  FileText,
  Globe,
  Settings2,
  Zap,
  Bot,
  Code,
  Target,
  TestTube,
  Shield,
  Check,
  Plus,
  Save,
  X,
  Loader2,
  ArrowLeft,
  Settings,
  Moon,
  Sun,
  WifiOff,
  LogOut,
  Upload,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ChevronRight,
  Edit2,
  MoreHorizontal,
  Search,
  RefreshCw
} from 'lucide-react';

type SettingsSection = 'general' | 'connectors' | 'agents' | 'instructions' | 'promptTemplates';

// Connector interface
interface Connector {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  bgColor: string;
  connected: boolean;
  category: 'development' | 'migration';
  isUserCreated?: boolean;
  mcpData?: {
    remoteUrl: string;
    authType: 'interactive' | 'clientId' | 'customHeader';
    clientKey?: string;
    clientValue?: string;
    headerKey?: string;
    headerValue?: string;
  };
}

// Connection interface for multiple connections per connector
interface Connection {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  createdAt: string;
  lastUsed: string;
  config?: {
    graphqlEndpoint?: string;
    graphqlApiKey?: string;
    graphqlHeaders?: Record<string, string>;
    itemServiceDomain?: string;
    itemServiceUsername?: string;
    itemServicePassword?: string;
    itemServiceServerUrl?: string;
    // Legacy fields for backward compatibility
    apiKey?: string;
    domain?: string;
    url?: string;
    repository?: string;
  };
}

// Top Navigation Actions Component (Settings, Theme Toggle, User Menu)
function TopNavigationActions() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'auto') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('auto');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Demo Mode Badge - Optional, showing for consistency */}
      <Badge variant="outline" className="gap-1 text-warning border-warning/20 bg-warning/10">
        <WifiOff className="size-3" />
        Demo Mode
      </Badge>
      
      {/* AI Credit Tracker */}
      <AICreditTracker />
      
      {/* Settings Button */}
      <Button variant="ghost" size="sm" className="h-9 w-9 p-0" title="Settings">
        <Settings className="size-5" />
      </Button>
      
      {/* Theme Toggle */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-9 w-9 p-0" 
        onClick={toggleTheme}
        title={`Current theme: ${theme}`}
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="size-5" />
        ) : (
          <Sun className="size-5" />
        )}
      </Button>
      
      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
            <Avatar className="size-8">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                JD
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-3">
            <Settings className="size-4" />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-3 text-destructive">
            <LogOut className="size-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function WorkspaceSettings() {
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  
  // General settings state
  const [workspaceName, setWorkspaceName] = useState('E-commerce Platform Migration');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Connections management state
  const [connectionsDrawerOpen, setConnectionsDrawerOpen] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [addConnectionModalOpen, setAddConnectionModalOpen] = useState(false);
  const [newConnectionForm, setNewConnectionForm] = useState({
    name: '',
    description: '',
    graphqlEndpoint: '',
    graphqlApiKey: '',
    graphqlHeaders: '',
    itemServiceDomain: '',
    itemServiceUsername: '',
    itemServicePassword: '',
    itemServiceServerUrl: '',
    clientId: '',
    clientSecret: ''
  });
  
  // Test connection state
  const [testConnectionStatus, setTestConnectionStatus] = useState<'idle' | 'loading' | 'success' | 'failed'>('idle');
  
  // Loading states for different actions
  const [isSavingWorkspace, setIsSavingWorkspace] = useState(false);
  const [isDeletingWorkspace, setIsDeletingWorkspace] = useState(false);
  const [isCreatingConnection, setIsCreatingConnection] = useState(false);
  const [deletingConnectionId, setDeletingConnectionId] = useState<string | null>(null);
  const [isSavingInstructions, setIsSavingInstructions] = useState(false);

  // Default connectors - only GitHub and Sitecore
  const [connectors, setConnectors] = useState<Connector[]>([
    {
      id: 'github',
      name: 'GitHub',
      description: 'Repository management and code deployment',
      icon: Globe,
      bgColor: 'bg-muted-foreground',
      connected: true,
      category: 'development',
      isUserCreated: false
    },
    {
      id: 'sitecore-xp',
      name: 'Sitecore XP',
      description: 'Source system content and configuration',
      icon: Settings2,
      bgColor: 'bg-destructive',
      connected: true,
      category: 'migration',
      isUserCreated: false
    },
    {
      id: 'sitecore-xmc',
      name: 'Sitecore XMC',
      description: 'Content management cloud platform and services',
      icon: Zap,
      bgColor: 'bg-destructive',
      connected: true,
      category: 'migration',
      isUserCreated: false
    }
  ]);

  // Mock connections data - this would come from your backend
  const [connections, setConnections] = useState<Record<string, Connection[]>>({
    github: [
      {
        id: 'gh-1',
        name: 'Main Repository',
        description: '',
        type: 'GitHub',
        status: 'active',
        createdAt: '2024-01-15',
        lastUsed: '2024-01-20',
        config: { repository: 'org/main-repo' }
      },
      {
        id: 'gh-2',
        name: 'Legacy Codebase',
        description: '',
        type: 'GitHub',
        status: 'active',
        createdAt: '2024-01-10',
        lastUsed: '2024-01-18',
        config: { repository: 'org/legacy-app' }
      }
    ],
    'sitecore-xp': [
      {
        id: 'sc-1',
        name: 'Production Environment',
        description: '',
        type: 'Sitecore XP',
        status: 'active',
        createdAt: '2024-01-12',
        lastUsed: '2024-01-19',
        config: {
          graphqlEndpoint: 'https://prod.sitecore.net/sitecore/api/graph/edge',
          graphqlApiKey: 'sc-prod-api-key-example',
          graphqlHeaders: {
            'Authorization': 'Bearer sc-token-example',
            'Content-Type': 'application/json'
          },
          itemServiceDomain: 'prod.sitecore.net',
          itemServiceUsername: 'admin',
          itemServicePassword: 'encrypted-password',
          itemServiceServerUrl: 'https://prod.sitecore.net'
        }
      },
      {
        id: 'sc-2',
        name: 'Staging Environment',
        description: '',
        type: 'Sitecore XP',
        status: 'inactive',
        createdAt: '2024-01-08',
        lastUsed: '2024-01-15',
        config: {
          graphqlEndpoint: 'https://staging.sitecore.net/sitecore/api/graph/edge',
          graphqlApiKey: 'sc-staging-api-key-example',
          itemServiceDomain: 'staging.sitecore.net',
          itemServiceUsername: 'admin',
          itemServicePassword: 'encrypted-password',
          itemServiceServerUrl: 'https://staging.sitecore.net'
        }
      }
    ],
    'sitecore-xmc': [
      {
        id: 'xmc-1',
        name: 'Production XMC',
        description: '',
        type: 'Sitecore XMC',
        status: 'active',
        createdAt: '2024-01-14',
        lastUsed: '2024-01-21',
        config: {
          graphqlEndpoint: 'https://xmc.sitecorecloud.io/api/graphql/v1',
          clientId: 'xmc-client-id-prod',
          clientSecret: 'xmc-client-secret-prod',
          graphqlHeaders: {
            'Authorization': 'Bearer token-example',
            'Content-Type': 'application/json'
          }
        }
      },
      {
        id: 'xmc-2',
        name: 'Development XMC',
        description: '',
        type: 'Sitecore XMC',
        status: 'active',
        createdAt: '2024-01-10',
        lastUsed: '2024-01-20',
        config: {
          graphqlEndpoint: 'https://xmc-dev.sitecorecloud.io/api/graphql/v1',
          clientId: 'xmc-client-id-dev',
          clientSecret: 'xmc-client-secret-dev'
        }
      }
    ]
  });

  // Instruction popup state for agents
  const [instructionPopup, setInstructionPopup] = useState<{
    open: boolean;
    agentId: string | null;
    agentName: string;
    agentDescription: string;
    instructions: string;
  }>({
    open: false,
    agentId: null,
    agentName: '',
    agentDescription: '',
    instructions: ''
  });

  // AI Agent settings state - updated to match new agent list
  const [agentSettings, setAgentSettings] = useState({
    architectAgent: true,
    auditAgent: true,
    migrationAgent: true,
    developerAgent: false,
    qaValidationAgent: true,
  });

  // Create Agent View State
  const [showCreateAgentView, setShowCreateAgentView] = useState(false);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [agentNameError, setAgentNameError] = useState('');
  const [customAgents, setCustomAgents] = useState<any[]>([]);
  
  interface McpConnection {
    url: string;
    urlError?: string;
    header: { key: string; value: string };
    status?: 'idle' | 'success' | 'error';
    testing?: boolean;
  }

  const [newAgentForm, setNewAgentForm] = useState({
    name: '',
    description: '',
    avatarUrl: null as string | null,
    systemInstructions: '',
    mcpConnections: [] as string[] // Store connector IDs instead of full connection data
  });

  const [mcpConnectionSelectorOpen, setMcpConnectionSelectorOpen] = useState(false);

  // Agent Detail View State
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [originalAgent, setOriginalAgent] = useState<any | null>(null); // To track changes
  const [selectedAgentTab, setSelectedAgentTab] = useState('instructions');
  const [isSavingAgent, setIsSavingAgent] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // MCP Connection Modal State
  const [addMcpModalOpen, setAddMcpModalOpen] = useState(false);
  const [agentMcpConnectionSelectorOpen, setAgentMcpConnectionSelectorOpen] = useState(false);
  const [selectedMcpConnectionsForAgent, setSelectedMcpConnectionsForAgent] = useState<string[]>([]);
  const [isAddingMcpConnection, setIsAddingMcpConnection] = useState(false);
  const [mcpConnectionPopoverOpen, setMcpConnectionPopoverOpen] = useState(false);
  
  // Expandable MCP cards state
  const [expandedMcpCards, setExpandedMcpCards] = useState<Set<number>>(new Set());
  
  // Search state for MCP tools
  const [mcpToolsSearchTerm, setMcpToolsSearchTerm] = useState<{ [key: number]: string }>({});
  
  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    connectionIndex: number | null;
  }>({ open: false, connectionIndex: null });
  
  // Delete connector confirmation state
  const [deleteConnectorConfirmation, setDeleteConnectorConfirmation] = useState<{
    open: boolean;
    connectorId: string | null;
    connectorName: string | null;
  }>({ open: false, connectorId: null, connectorName: null });
  
  // Loading state for tabs
  const [isLoadingTab, setIsLoadingTab] = useState(false);
  
  // Create MCP Modal State
  const [createMcpModalOpen, setCreateMcpModalOpen] = useState(false);
  const [editingMcpId, setEditingMcpId] = useState<string | null>(null); // Track if editing
  const [createMcpFormData, setCreateMcpFormData] = useState({
    name: '',
    description: '',
    remoteUrl: '',
    headers: [{ key: '', value: '' }] as Array<{ key: string, value: string }>
  });
  const [originalMcpFormData, setOriginalMcpFormData] = useState({
    name: '',
    description: '',
    remoteUrl: '',
    headers: [{ key: '', value: '' }] as Array<{ key: string, value: string }>
  });
  const [createMcpFormErrors, setCreateMcpFormErrors] = useState({
    name: '',
    remoteUrl: ''
  });
  const [createMcpTestStatus, setCreateMcpTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [createMcpTestMessage, setCreateMcpTestMessage] = useState('');
  const [isSavingNewMcp, setIsSavingNewMcp] = useState(false);

  // Prompt Templates State
  const [promptTemplates, setPromptTemplates] = useState([
    {
      id: 'template-1',
      name: 'Content Migration Analysis',
      description: 'Analyze source content structure and generate migration recommendations',
      status: 'active' as const,
      type: 'instruction' as const,
      lastModified: 'Nov 08, 2025',
      fullPrompt: 'You are analyzing content from a Sitecore XP instance for migration to Sitecore XM Cloud. Please review the provided content structure, identify all content types, templates, and relationships. Generate a comprehensive migration plan that includes:\n\n1. Content inventory and classification\n2. Template mapping from source to target\n3. Field-level transformation requirements\n4. Dependencies and relationship preservation strategies\n5. Potential risks and mitigation approaches\n\nProvide your analysis in a structured format with clear recommendations for each content type.'
    },
    {
      id: 'template-2',
      name: 'Component Architecture Review',
      description: 'Review JSS component architecture and provide optimization suggestions',
      status: 'active' as const,
      type: 'chat' as const,
      lastModified: 'Nov 05, 2025',
      fullPrompt: 'Review the provided JSS component architecture for a Sitecore headless implementation. Analyze component structure, data fetching patterns, and rendering strategies. Provide specific recommendations for:\n\n1. Component composition and reusability\n2. Data fetching optimization (GraphQL queries)\n3. Performance improvements\n4. Best practices alignment\n5. Accessibility considerations\n\nHighlight any anti-patterns and suggest concrete improvements with code examples where applicable.'
    },
    {
      id: 'template-3',
      name: 'Quality Assurance Checklist',
      description: 'Generate comprehensive QA checklist for migration deliverables',
      status: 'inactive' as const,
      type: 'chat' as const,
      lastModified: 'Oct 28, 2025',
      fullPrompt: 'Generate a comprehensive quality assurance checklist for the following migration deliverable. The checklist should cover:\n\n1. Functional requirements validation\n2. Content completeness verification\n3. Performance benchmarks\n4. Cross-browser compatibility tests\n5. Accessibility compliance (WCAG 2.1 AA)\n6. SEO optimization checks\n7. Security validation\n\nFor each category, provide specific test cases with clear pass/fail criteria. Include any automated testing recommendations.'
    }
  ]);

  // Create Template State
  const [showCreateTemplateView, setShowCreateTemplateView] = useState(false);
  const [createTemplateForm, setCreateTemplateForm] = useState({
    name: '',
    description: '',
    fullPrompt: '',
    tags: '',
    status: 'active' as 'active' | 'inactive',
    type: 'chat' as 'chat' | 'instruction'
  });
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  
  // Edit Template State
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  
  // Delete Template State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<{ id: string; name: string } | null>(null);

  // Template Filters State
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [templateTypeFilter, setTemplateTypeFilter] = useState<'all' | 'chat' | 'instruction'>('all');
  const [templateStatusFilter, setTemplateStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // MCP Connection Modal Handlers
  const handleOpenAddMcpModal = () => {
    setSelectedMcpConnectionsForAgent([]);
    setAgentMcpConnectionSelectorOpen(false);
    setAddMcpModalOpen(true);
  };

  const handleAddMcpConnectionToAgent = (connectorId: string) => {
    // Check if already added
    if (!selectedMcpConnectionsForAgent.includes(connectorId)) {
      setSelectedMcpConnectionsForAgent([...selectedMcpConnectionsForAgent, connectorId]);
    }
    setAgentMcpConnectionSelectorOpen(false);
  };

  const handleRemoveMcpConnectionFromAgent = (connectorId: string) => {
    setSelectedMcpConnectionsForAgent(selectedMcpConnectionsForAgent.filter(id => id !== connectorId));
  };

  // Handle direct MCP connection addition from popover
  const handleDirectAddMcpConnection = async (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId);
    if (!connector) return;

    // Create connection object
    const newConnection = {
      url: connector.mcpData?.remoteUrl || '',
      headers: connector.mcpData?.headers || [],
      status: 'success',
      owner: connector.isUserCreated ? 'User' : 'System',
      enabled: true,
      connectorName: connector.name,
      connectorIcon: connector.icon,
      connectorBgColor: connector.bgColor,
      tools: [
        { name: 'File System', description: 'Read and write files on the local system', hitlBehavior: 'auto', enabled: true },
        { name: 'Web Search', description: 'Search the web for information and retrieve results', hitlBehavior: 'approval-required', enabled: true },
        { name: 'Code Execution', description: 'Execute code snippets in a sandboxed environment', hitlBehavior: 'ask-first', enabled: false }
      ]
    };

    const updatedAgent = {
      ...selectedAgent,
      mcpConnections: [...(selectedAgent.mcpConnections || []), newConnection]
    };

    setSelectedAgent(updatedAgent);
    setHasUnsavedChanges(true);
    setMcpConnectionPopoverOpen(false);
    
    toast.success(`${connector.name} connection added successfully`);
  };

  // Connections management handlers
  const handleOpenConnectionsDrawer = (connector: Connector) => {
    setSelectedConnector(connector);
    setConnectionsDrawerOpen(true);
  };

  const handleDeleteConnection = async (connectorId: string, connectionId: string) => {
    setDeletingConnectionId(connectionId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setConnections(prev => ({
      ...prev,
      [connectorId]: prev[connectorId]?.filter(conn => conn.id !== connectionId) || []
    }));
    
    setDeletingConnectionId(null);
    toast.success('Connection deleted successfully');
  };

  const handleAddNewConnection = () => {
    // Always open the modal for adding connections, including GitHub
    setAddConnectionModalOpen(true);
  };

  const handleCreateConnection = async () => {
    if (!selectedConnector || !newConnectionForm.name) return;

    setIsCreatingConnection(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    let config = {};

    // Build config based on connector type
    if (selectedConnector.id === 'github') {
      config = {
        repository: newConnectionForm.name // Use name as repository for GitHub
      };
    } else if (selectedConnector.id === 'sitecore-xp') {
      config = {
        graphqlEndpoint: newConnectionForm.graphqlEndpoint,
        graphqlApiKey: newConnectionForm.graphqlApiKey,
        itemServiceDomain: newConnectionForm.itemServiceDomain,
        itemServiceUsername: newConnectionForm.itemServiceUsername,
        itemServicePassword: newConnectionForm.itemServicePassword,
        itemServiceServerUrl: newConnectionForm.itemServiceServerUrl
      };
    } else if (selectedConnector.id === 'sitecore-xmc') {
      config = {
        graphqlEndpoint: newConnectionForm.graphqlEndpoint,
        clientId: newConnectionForm.clientId,
        clientSecret: newConnectionForm.clientSecret,
        graphqlHeaders: newConnectionForm.graphqlHeaders ? JSON.parse(newConnectionForm.graphqlHeaders) : undefined
      };
    }

    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      name: newConnectionForm.name,
      description: newConnectionForm.description,
      type: selectedConnector.name,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: new Date().toISOString().split('T')[0],
      config
    };

    setConnections(prev => ({
      ...prev,
      [selectedConnector.id]: [...(prev[selectedConnector.id] || []), newConnection]
    }));

    // Reset form
    setNewConnectionForm({
      name: '',
      description: '',
      graphqlEndpoint: '',
      graphqlApiKey: '',
      graphqlHeaders: '',
      itemServiceDomain: '',
      itemServiceUsername: '',
      itemServicePassword: '',
      itemServiceServerUrl: '',
      clientId: '',
      clientSecret: ''
    });

    setIsCreatingConnection(false);
    setAddConnectionModalOpen(false);
    setTestConnectionStatus('idle');
    toast.success('Connection added successfully');
  };

  // Test connection handler
  const handleTestConnection = async () => {
    setTestConnectionStatus('loading');
    
    // Simulate API call to test connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Randomly determine success/failure for demo (you would replace this with actual connection test)
    const isSuccess = Math.random() > 0.3; // 70% success rate for demo
    
    if (isSuccess) {
      setTestConnectionStatus('success');
      toast.success('Connection test passed');
    } else {
      setTestConnectionStatus('failed');
      toast.error('Connection test failed');
    }
  };

  // Connector handlers
  const handleConnectorsToggle = (connectorId: string) => {
    setConnectors(prev => prev.map(connector => 
      connector.id === connectorId 
        ? { ...connector, connected: !connector.connected }
        : connector
    ));
    
    const connector = connectors.find(c => c.id === connectorId);
    if (connector) {
      toast.success(
        connector.connected 
          ? `Disconnected from ${connector.name}`
          : `Connected to ${connector.name}`
      );
    }
  };

  const handleConnectGitHub = () => {
    // Simulate GitHub OAuth flow
    toast.success('Redirecting to GitHub for authorization...');
    // In a real implementation, this would open a new window to GitHub OAuth
    window.open('https://github.com/login/oauth/authorize', '_blank');
  };

  const getConnectedConnectors = () => {
    return connectors.filter(connector => connector.connected);
  };

  const getCategorizedConnectors = () => {
    const categories = {
      development: connectors.filter(c => c.category === 'development'),
      collaboration: connectors.filter(c => c.category === 'collaboration'),
      migration: connectors.filter(c => c.category === 'migration'),
      deployment: connectors.filter(c => c.category === 'deployment')
    };
    return categories;
  };

  // Agent settings update function
  const updateAgentSetting = (key: string, value: any) => {
    setAgentSettings(prev => ({ ...prev, [key]: value }));
  };

  // Instruction popup handlers
  const openInstructionPopup = (agentId: string, agentName: string, agentDescription: string) => {
    setInstructionPopup({
      open: true,
      agentId,
      agentName,
      agentDescription,
      instructions: '' // Load existing instructions if available
    });
  };

  const closeInstructionPopup = () => {
    setInstructionPopup(prev => ({ ...prev, open: false }));
  };

  const saveInstructions = async () => {
    setIsSavingInstructions(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save instructions logic here
    console.log(`Saving instructions for ${instructionPopup.agentName}:`, instructionPopup.instructions);
    
    setIsSavingInstructions(false);
    toast.success(`Instructions updated for ${instructionPopup.agentName}`);
    closeInstructionPopup();
  };

  // Create Agent Handlers
  const existingAgentNames = ['Architect Agent', 'Audit Agent', 'Migration (ETL) Agent', 'Developer Agent', 'QA/Validation Agent'];

  const validateAgentName = (name: string) => {
    if (!name.trim()) {
      setAgentNameError('');
      return;
    }
    const allNames = [...existingAgentNames, ...customAgents.map(a => a.name)];
    if (allNames.some(n => n.toLowerCase() === name.trim().toLowerCase())) {
      setAgentNameError('Name already exists');
    } else {
      setAgentNameError('');
    }
  };

  const handleAddMcpConnection = (connectorId: string) => {
    // Check if already added
    if (!newAgentForm.mcpConnections.includes(connectorId)) {
      setNewAgentForm({
        ...newAgentForm,
        mcpConnections: [...newAgentForm.mcpConnections, connectorId]
      });
    }
    setMcpConnectionSelectorOpen(false);
  };

  const handleRemoveMcpConnection = (connectorId: string) => {
    setNewAgentForm({
      ...newAgentForm,
      mcpConnections: newAgentForm.mcpConnections.filter(id => id !== connectorId)
    });
  };

  const isCreateAgentFormValid = () => {
    const hasName = newAgentForm.name.trim().length > 0;
    const hasDescription = newAgentForm.description.trim().length > 0;
    const hasInstructions = newAgentForm.systemInstructions.trim().length > 0;
    const noNameError = !agentNameError;
    
    return hasName && hasDescription && hasInstructions && noNameError;
  };

  const resetCreateAgentForm = () => {
    setNewAgentForm({
      name: '',
      description: '',
      avatarUrl: null,
      systemInstructions: '',
      mcpConnections: []
    });
    setAgentNameError('');
    setMcpConnectionSelectorOpen(false);
  };

  const handleCreateAgent = async () => {
    if (!isCreateAgentFormValid()) return;

    setIsCreatingAgent(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Map connector IDs to full connection objects for the agent
    const mcpConnectionsData = newAgentForm.mcpConnections.map(connectorId => {
      const connector = connectors.find(c => c.id === connectorId);
      if (!connector) return null;
      
      return {
        url: connector.mcpData?.remoteUrl || '',
        headers: connector.mcpData?.headerKey && connector.mcpData?.headerValue 
          ? [{ key: connector.mcpData.headerKey, value: connector.mcpData.headerValue }]
          : [],
        status: 'success',
        owner: connector.isUserCreated ? 'User' : 'System',
        connectorName: connector.name,
        connectorIcon: connector.icon,
        connectorBgColor: connector.bgColor,
        tools: []
      };
    }).filter(Boolean);

    const newAgent = {
      id: `custom-${Date.now()}`,
      name: newAgentForm.name,
      handle: `@${newAgentForm.name.toLowerCase().replace(/\s+/g, '')}`,
      description: newAgentForm.description,
      systemInstructions: newAgentForm.systemInstructions,
      avatarUrl: newAgentForm.avatarUrl,
      mcpConnections: mcpConnectionsData,
      isOnline: true,
      isCustom: true
    };

    setCustomAgents([...customAgents, newAgent]);
    setIsCreatingAgent(false);
    setShowCreateAgentView(false);
    resetCreateAgentForm();
    
    // Navigate to the created agent's detail view
    setSelectedAgent(newAgent);
    setOriginalAgent(JSON.parse(JSON.stringify(newAgent)));
    setSelectedAgentTab('instructions');
    
    toast.success('Agent created successfully');
  };

  const sidebarItems = [
    { id: 'general', label: 'General', icon: Settings2 },
    { id: 'connectors', label: 'MCP Servers', icon: Link },
    { id: 'agents', label: 'AI Agent', icon: Bot },
    { id: 'promptTemplates', label: 'Prompt Templates', icon: FileText }
  ];

  // Default agents data
  const defaultAgents = [
    {
      id: 'architect',
      name: 'Architect Agent',
      handle: '@architect',
      description: 'Technical Architecture Planning',
      longDescription: 'Defines Sitecore headless implementation architecture, JSS framework, assets to migrate, execution plan with dependencies',
      icon: Target,
      bgColor: 'bg-primary',
      isOnline: agentSettings.architectAgent,
      isCustom: false,
      systemInstructions: `You are the Architect Agent for Kajoo 2.0, a specialized AI agent focused on technical architecture planning for Sitecore headless implementations.

Your primary responsibilities include:

1. **Architecture Design**
   - Design and define headless Sitecore implementation architectures
   - Recommend JSS framework configurations and best practices
   - Define component architecture and data flow patterns
   - Establish integration patterns between Sitecore and frontend applications

2. **Migration Planning**
   - Identify and categorize assets that need migration
   - Create detailed execution plans with clear dependencies
   - Define migration phases and milestones
   - Assess technical risks and mitigation strategies

3. **Technical Standards**
   - Establish coding standards and conventions
   - Define component patterns and reusability guidelines
   - Set performance benchmarks and optimization targets
   - Document architecture decisions and rationale

4. **Collaboration**
   - Work closely with other agents to ensure architectural consistency
   - Provide technical guidance and recommendations
   - Review and validate architectural implementations
   - Communicate technical decisions to stakeholders

Always prioritize scalability, maintainability, and performance in your recommendations. Base your decisions on Sitecore best practices and modern frontend development patterns.`,
      mcpConnections: [
        {
          url: 'https://api.sitecore.architecture/v1/mcp',
          headers: [
            { key: 'Authorization', value: 'Bearer sk-arch-xxxxxxxxxxxxx' }
          ],
          owner: 'User',
          status: 'success',
          connectorName: 'Sitecore XP',
          connectorIcon: Settings2,
          connectorBgColor: 'bg-destructive',
          tools: [
            {
              name: 'analyze_architecture',
              description: 'Analyzes current Sitecore architecture and provides recommendations',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'generate_component_spec',
              description: 'Generates component specifications based on requirements',
              hitlBehavior: 'approval-required',
              enabled: true
            },
            {
              name: 'validate_dependencies',
              description: 'Validates architectural dependencies and identifies conflicts',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'create_migration_plan',
              description: 'Creates detailed migration plans with phases and milestones',
              hitlBehavior: 'approval-required',
              enabled: true
            },
            {
              name: 'assess_technical_debt',
              description: 'Assesses technical debt in existing codebase',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'generate_api_contracts',
              description: 'Generates API contracts and interface definitions',
              hitlBehavior: 'approval-required',
              enabled: true
            },
            {
              name: 'design_data_model',
              description: 'Designs data models and entity relationships',
              hitlBehavior: 'approval-required',
              enabled: false
            },
            {
              name: 'optimize_graphql_queries',
              description: 'Optimizes GraphQL queries for performance',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'validate_security_patterns',
              description: 'Validates security patterns and implementations',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'generate_integration_docs',
              description: 'Generates integration documentation and specifications',
              hitlBehavior: 'approval-required',
              enabled: true
            },
            {
              name: 'analyze_performance_metrics',
              description: 'Analyzes application performance metrics and bottlenecks',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'create_deployment_strategy',
              description: 'Creates deployment strategies and rollback plans',
              hitlBehavior: 'approval-required',
              enabled: true
            },
            {
              name: 'validate_accessibility',
              description: 'Validates accessibility compliance (WCAG 2.1)',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'generate_test_scenarios',
              description: 'Generates comprehensive test scenarios and test cases',
              hitlBehavior: 'approval-required',
              enabled: false
            },
            {
              name: 'review_code_quality',
              description: 'Reviews code quality and suggests improvements',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'analyze_bundle_size',
              description: 'Analyzes JavaScript bundle sizes and optimization opportunities',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'create_component_library',
              description: 'Creates reusable component library structures',
              hitlBehavior: 'approval-required',
              enabled: true
            },
            {
              name: 'validate_seo_implementation',
              description: 'Validates SEO implementation and meta tags',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'generate_error_handling',
              description: 'Generates error handling patterns and implementations',
              hitlBehavior: 'approval-required',
              enabled: true
            },
            {
              name: 'analyze_caching_strategy',
              description: 'Analyzes caching strategies and recommendations',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'create_monitoring_setup',
              description: 'Creates monitoring and logging setup configurations',
              hitlBehavior: 'approval-required',
              enabled: false
            },
            {
              name: 'validate_responsive_design',
              description: 'Validates responsive design implementation',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'generate_ci_cd_pipeline',
              description: 'Generates CI/CD pipeline configurations',
              hitlBehavior: 'approval-required',
              enabled: true
            },
            {
              name: 'analyze_database_schema',
              description: 'Analyzes database schema and optimization opportunities',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'create_backup_strategy',
              description: 'Creates backup and disaster recovery strategies',
              hitlBehavior: 'approval-required',
              enabled: false
            },
            {
              name: 'validate_internationalization',
              description: 'Validates i18n implementation and multi-language support',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'generate_api_documentation',
              description: 'Generates comprehensive API documentation',
              hitlBehavior: 'approval-required',
              enabled: true
            }
          ]
        },
        {
          url: 'https://api.github.com/graphql',
          headers: [
            { key: 'Authorization', value: 'Bearer ghp_xxxxxxxxxxxxxxxxxxxxx' }
          ],
          owner: 'System',
          status: 'success',
          connectorName: 'GitHub',
          connectorIcon: Globe,
          connectorBgColor: 'bg-muted-foreground',
          tools: [
            {
              name: 'search_repositories',
              description: 'Search GitHub repositories for similar implementations',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'analyze_codebase',
              description: 'Analyze existing codebase structure and patterns',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'get_best_practices',
              description: 'Retrieve community best practices and examples',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'check_compatibility',
              description: 'Check package compatibility and versions',
              hitlBehavior: 'auto',
              enabled: true
            }
          ]
        },
        {
          url: 'https://api.jss.sitecore.net/v2/mcp',
          headers: [
            { key: 'Authorization', value: 'Bearer jss-api-key-xxxxxxx' }
          ],
          owner: 'System',
          status: 'success',
          connectorName: 'Sitecore XMC',
          connectorIcon: Zap,
          connectorBgColor: 'bg-destructive',
          tools: [
            {
              name: 'validate_jss_config',
              description: 'Validates JSS configuration and setup',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'generate_manifest',
              description: 'Generates JSS manifest files from specifications',
              hitlBehavior: 'approval-required',
              enabled: true
            },
            {
              name: 'sync_components',
              description: 'Synchronizes component definitions with Sitecore',
              hitlBehavior: 'approval-required',
              enabled: false
            }
          ]
        }
      ]
    },
    {
      id: 'audit',
      name: 'Audit Agent',
      handle: '@audit',
      description: 'Sitecore Implementation Audit',
      longDescription: 'Code audit, optimization ACs, SEO/AEO audit, accessibility audit from technical perspective',
      icon: Shield,
      bgColor: 'bg-warning',
      isOnline: agentSettings.auditAgent,
      isCustom: false,
      systemInstructions: `You are the Audit Agent for Kajoo 2.0, responsible for comprehensive quality audits of Sitecore implementations.

Your audit scope includes:

1. **Code Quality Audit**
   - Review code quality, patterns, and best practices
   - Identify technical debt and areas for improvement
   - Check for security vulnerabilities and anti-patterns
   - Validate proper error handling and logging

2. **Performance Optimization**
   - Analyze application performance metrics
   - Identify bottlenecks and optimization opportunities
   - Review caching strategies and implementations
   - Validate bundle sizes and loading performance

3. **SEO/AEO Audit**
   - Check meta tags, structured data, and schema markup
   - Validate semantic HTML and heading structure
   - Review canonical URLs and sitemap configuration
   - Assess mobile-friendliness and Core Web Vitals

4. **Accessibility Audit**
   - Verify WCAG 2.1 AA compliance
   - Check keyboard navigation and screen reader support
   - Validate color contrast and text alternatives
   - Review ARIA attributes and roles

Provide actionable recommendations with priority levels (Critical, High, Medium, Low) and estimated effort for each finding.`,
      mcpConnections: [
        {
          url: 'https://api.lighthouse.analysis/mcp',
          headers: [
            { key: 'Authorization', value: 'Bearer sk-audit-xxxxxxxxxxxxx' }
          ],
          owner: 'System',
          status: 'success',
          connectorName: 'Sitecore XP',
          connectorIcon: Settings2,
          connectorBgColor: 'bg-destructive',
          tools: [
            {
              name: 'run_lighthouse_audit',
              description: 'Runs Google Lighthouse audit on specified URLs',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'check_accessibility',
              description: 'Performs WCAG 2.1 accessibility compliance check',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'analyze_seo',
              description: 'Analyzes SEO implementation and provides recommendations',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'scan_security',
              description: 'Scans for common security vulnerabilities',
              hitlBehavior: 'approval-required',
              enabled: true
            }
          ]
        }
      ]
    },
    {
      id: 'migration',
      name: 'Migration (ETL) Agent',
      handle: '@migration',
      description: 'Data & Content Migration',
      longDescription: 'Extracts, transfers all data including content items, templates, pages. Content modeling for changes',
      icon: Code,
      bgColor: 'bg-primary',
      isOnline: agentSettings.migrationAgent,
      isCustom: false,
      systemInstructions: `You are the Migration (ETL) Agent for Kajoo 2.0, specialized in Sitecore content and data migration.

Your responsibilities include:

1. **Content Extraction**
   - Extract content items, templates, and media from source Sitecore instances
   - Preserve content relationships and references
   - Handle multilingual content and variants
   - Extract metadata and workflow states

2. **Content Transformation**
   - Map source content structure to target schema
   - Transform field values and data types
   - Handle content modeling changes
   - Validate data integrity during transformation

3. **Content Loading**
   - Import content into target Sitecore instance
   - Maintain content hierarchy and relationships
   - Update references and links
   - Verify successful migration

4. **Data Quality**
   - Validate completeness of migrated content
   - Identify and report missing or corrupted data
   - Generate migration reports and statistics
   - Support rollback scenarios

Always ensure data integrity and create comprehensive logs of all migration activities. Follow a test-verify-migrate-verify workflow for production migrations.`,
      mcpConnections: [
        {
          url: 'https://api.sitecore-etl.service/mcp',
          headers: [
            { key: 'Authorization', value: 'Bearer sk-mig-xxxxxxxxxxxxx' },
            { key: 'X-Migration-Mode', value: 'incremental' }
          ],
          owner: 'System',
          status: 'success',
          connectorName: 'Sitecore XMC',
          connectorIcon: Zap,
          connectorBgColor: 'bg-destructive',
          tools: [
            {
              name: 'extract_content',
              description: 'Extracts content items from source Sitecore instance',
              hitlBehavior: 'ask-first',
              enabled: true
            },
            {
              name: 'transform_schema',
              description: 'Transforms content to match target schema',
              hitlBehavior: 'approval-required',
              enabled: true
            },
            {
              name: 'load_content',
              description: 'Loads transformed content into target instance',
              hitlBehavior: 'approval-required',
              enabled: true
            },
            {
              name: 'validate_migration',
              description: 'Validates migration completeness and data integrity',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'rollback_migration',
              description: 'Rolls back migration to previous state',
              hitlBehavior: 'approval-required',
              enabled: false
            }
          ]
        }
      ]
    },
    {
      id: 'developer',
      name: 'Developer Agent',
      handle: '@developer',
      description: 'Code Generation & Testing',
      longDescription: 'Generates code, unit tests, UI testing (Playwright), creates PRs',
      icon: Code,
      bgColor: 'bg-success',
      isOnline: agentSettings.developerAgent,
      isCustom: false,
      isBusy: true,
      systemInstructions: `You are the Developer Agent for Kajoo 2.0, responsible for code generation, testing, and development workflows.

Your core functions include:

1. **Code Generation**
   - Generate React components following best practices
   - Create TypeScript interfaces and types
   - Implement Sitecore JSS components and integrations
   - Follow established coding standards and patterns

2. **Testing**
   - Write comprehensive unit tests using Jest
   - Create integration tests for components
   - Generate end-to-end tests using Playwright
   - Ensure adequate test coverage (>80%)

3. **Version Control**
   - Create well-structured pull requests
   - Write clear commit messages following conventions
   - Include relevant documentation updates
   - Request appropriate reviewers

4. **Code Quality**
   - Follow TypeScript strict mode guidelines
   - Implement proper error handling
   - Use ESLint and Prettier configurations
   - Write self-documenting code with clear naming

Always prioritize code quality, maintainability, and test coverage. Follow the repository's contributing guidelines and coding standards.`,
      mcpConnections: [
        {
          url: 'https://api.github.com/mcp/v1',
          headers: [
            { key: 'Authorization', value: 'Bearer ghp_xxxxxxxxxxxxx' },
            { key: 'Accept', value: 'application/vnd.github.v3+json' }
          ],
          owner: 'User',
          status: 'success',
          connectorName: 'GitHub',
          connectorIcon: Globe,
          connectorBgColor: 'bg-muted-foreground',
          tools: [
            {
              name: 'create_branch',
              description: 'Creates a new Git branch for development',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'commit_changes',
              description: 'Commits code changes with proper message',
              hitlBehavior: 'approval-required',
              enabled: true
            },
            {
              name: 'create_pull_request',
              description: 'Creates a pull request with generated code',
              hitlBehavior: 'approval-required',
              enabled: true
            },
            {
              name: 'run_tests',
              description: 'Executes test suite and returns results',
              hitlBehavior: 'auto',
              enabled: true
            }
          ]
        },
        {
          url: 'https://api.playwright.testing/mcp',
          headers: [
            { key: 'Authorization', value: 'Bearer pw-xxxxxxxxxxxxx' }
          ],
          owner: 'System',
          status: 'success',
          connectorName: 'Sitecore XP',
          connectorIcon: Settings2,
          connectorBgColor: 'bg-destructive',
          tools: [
            {
              name: 'generate_e2e_test',
              description: 'Generates Playwright end-to-end test',
              hitlBehavior: 'approval-required',
              enabled: true
            },
            {
              name: 'run_visual_test',
              description: 'Runs visual regression tests',
              hitlBehavior: 'auto',
              enabled: true
            }
          ]
        }
      ]
    },
    {
      id: 'qa',
      name: 'QA/Validation Agent',
      handle: '@qa',
      description: 'Quality Validation & Communication',
      longDescription: 'Validates jobs, asks clarifying questions, validates results, communicates back to user',
      icon: TestTube,
      bgColor: 'bg-primary',
      isOnline: agentSettings.qaValidationAgent,
      isCustom: false,
      systemInstructions: `You are the QA/Validation Agent for Kajoo 2.0, ensuring quality and facilitating clear communication.

Your responsibilities include:

1. **Task Validation**
   - Review task requirements for completeness
   - Identify ambiguities and missing information
   - Ask clarifying questions to stakeholders
   - Ensure acceptance criteria are measurable

2. **Quality Assurance**
   - Validate deliverables against requirements
   - Perform functional testing
   - Verify edge cases and error scenarios
   - Check cross-browser and device compatibility

3. **Communication**
   - Translate technical details for non-technical stakeholders
   - Provide clear status updates and progress reports
   - Document findings and recommendations
   - Facilitate resolution of blockers and issues

4. **Process Improvement**
   - Identify recurring quality issues
   - Suggest process improvements
   - Document lessons learned
   - Promote quality best practices

Always maintain a user-focused perspective and ensure that all deliverables meet the stated requirements and quality standards.`,
      mcpConnections: [
        {
          url: 'https://api.testing.platform/mcp',
          headers: [
            { key: 'Authorization', value: 'Bearer sk-qa-xxxxxxxxxxxxx' }
          ],
          owner: 'System',
          status: 'success',
          tools: [
            {
              name: 'validate_requirements',
              description: 'Validates requirements completeness and clarity',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'run_functional_tests',
              description: 'Executes functional test suite',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'check_browser_compat',
              description: 'Checks cross-browser compatibility',
              hitlBehavior: 'auto',
              enabled: true
            },
            {
              name: 'generate_qa_report',
              description: 'Generates comprehensive QA report',
              hitlBehavior: 'auto',
              enabled: true
            }
          ]
        }
      ]
    }
  ];

  // Handle agent card click
  const handleAgentClick = (agent: any) => {
    // Clone the agent, preserving the icon component reference
    const agentCopy = {
      ...agent,
      mcpConnections: agent.mcpConnections ? [...agent.mcpConnections.map((conn: any) => ({
        ...conn,
        headers: conn.headers ? [...conn.headers] : [],
        tools: conn.tools ? [...conn.tools.map((tool: any) => ({ ...tool }))] : []
      }))] : []
    };
    
    const originalCopy = {
      ...agent,
      mcpConnections: agent.mcpConnections ? [...agent.mcpConnections.map((conn: any) => ({
        ...conn,
        headers: conn.headers ? [...conn.headers] : [],
        tools: conn.tools ? [...conn.tools.map((tool: any) => ({ ...tool }))] : []
      }))] : []
    };
    
    setSelectedAgent(agentCopy);
    setOriginalAgent(originalCopy);
    setSelectedAgentTab('instructions');
    setHasUnsavedChanges(false);
    setIsLoadingTab(true);
    // Simulate loading
    setTimeout(() => setIsLoadingTab(false), 300);
  };

  // Handle back to agents list
  const handleBackToAgents = () => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Are you sure you want to go back?')) {
        return;
      }
    }
    setSelectedAgent(null);
    setOriginalAgent(null);
    setHasUnsavedChanges(false);
    setExpandedMcpCards(new Set());
  };

  // Track changes
  const handleAgentChange = (updates: any) => {
    setSelectedAgent({ ...selectedAgent, ...updates });
    setHasUnsavedChanges(true);
  };

  // Handle save agent changes
  const handleSaveAgent = async () => {
    if (!selectedAgent) return;
    
    // Validation
    if (!selectedAgent.systemInstructions || selectedAgent.systemInstructions.trim() === '') {
      toast.error('System instructions cannot be empty');
      return;
    }
    
    setIsSavingAgent(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the agent in customAgents or agentSettings
    if (selectedAgent.isCustom) {
      const updated = customAgents.map(a => 
        a.id === selectedAgent.id ? selectedAgent : a
      );
      setCustomAgents(updated);
    } else {
      // Update default agent settings
      updateAgentSetting(selectedAgent.id + 'Agent', selectedAgent.isOnline);
    }
    
    // Update original agent copy without losing icon reference
    const updatedOriginal = {
      ...selectedAgent,
      mcpConnections: selectedAgent.mcpConnections ? [...selectedAgent.mcpConnections.map((conn: any) => ({
        ...conn,
        headers: conn.headers ? [...conn.headers] : [],
        tools: conn.tools ? [...conn.tools.map((tool: any) => ({ ...tool }))] : []
      }))] : []
    };
    setOriginalAgent(updatedOriginal);
    setHasUnsavedChanges(false);
    setIsSavingAgent(false);
    toast.success('All changes saved successfully');
  };

  // MCP Connection Handlers for Agent Detail View
  const handleAddAgentMcpConnection = async () => {
    if (selectedMcpConnectionsForAgent.length === 0) {
      toast.error('Please select at least one connection');
      return;
    }

    setIsAddingMcpConnection(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Map connector IDs to full connection objects
    const newConnections = selectedMcpConnectionsForAgent.map(connectorId => {
      const connector = connectors.find(c => c.id === connectorId);
      if (!connector) return null;
      
      return {
        url: connector.mcpData?.remoteUrl || '',
        headers: connector.mcpData?.headers || [],
        status: 'success',
        owner: connector.isUserCreated ? 'User' : 'System',
        enabled: true,
        connectorName: connector.name,
        connectorIcon: connector.icon,
        connectorBgColor: connector.bgColor,
        tools: [
          { name: 'File System', description: 'Read and write files on the local system', hitlBehavior: 'auto', enabled: true },
          { name: 'Web Search', description: 'Search the web for information and retrieve results', hitlBehavior: 'approval-required', enabled: true },
          { name: 'Code Execution', description: 'Execute code snippets in a sandboxed environment', hitlBehavior: 'ask-first', enabled: false }
        ]
      };
    }).filter(Boolean);

    const updatedAgent = {
      ...selectedAgent,
      mcpConnections: [...(selectedAgent.mcpConnections || []), ...newConnections]
    };

    setSelectedAgent(updatedAgent);
    setHasUnsavedChanges(true);
    setIsAddingMcpConnection(false);
    setAddMcpModalOpen(false);
    setSelectedMcpConnectionsForAgent([]);
    
    toast.success(`${newConnections.length} MCP connection(s) added successfully`);
  };

  const handleDeleteMcpConnection = async () => {
    if (deleteConfirmation.connectionIndex === null) return;

    const updatedConnections = selectedAgent.mcpConnections.filter(
      (_: any, idx: number) => idx !== deleteConfirmation.connectionIndex
    );

    setSelectedAgent({
      ...selectedAgent,
      mcpConnections: updatedConnections
    });
    setHasUnsavedChanges(true);
    setDeleteConfirmation({ open: false, connectionIndex: null });
    toast.success('Connection deleted successfully');
  };

  const toggleMcpCard = (index: number) => {
    const newExpanded = new Set(expandedMcpCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedMcpCards(newExpanded);
  };

  const handleToolChange = (connIndex: number, toolIndex: number, field: string, value: any) => {
    const updatedConnections = [...selectedAgent.mcpConnections];
    updatedConnections[connIndex].tools[toolIndex][field] = value;
    setSelectedAgent({
      ...selectedAgent,
      mcpConnections: updatedConnections
    });
    setHasUnsavedChanges(true);
  };

  // Create Agent Form Content (shared between Dialog and Sheet)
  const renderCreateAgentFormContent = () => (
    <div className="max-w-2xl">
      {/* Avatar and Basic Information */}
      <div className="mb-8 space-y-4">
        {/* Avatar Upload */}
        <div>
          <input
            id="agent-avatar"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setNewAgentForm({ ...newAgentForm, avatarUrl: reader.result as string });
                };
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
          />
          <label 
            htmlFor="agent-avatar"
            className="cursor-pointer block"
          >
            <div className={`size-20 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-border relative group transition-colors hover:border-primary ${newAgentForm.avatarUrl ? 'bg-primary border-solid' : 'bg-muted/30'}`}>
              {newAgentForm.avatarUrl ? (
                <img 
                  src={newAgentForm.avatarUrl} 
                  alt="Agent avatar" 
                  className="size-full object-cover"
                />
              ) : (
                <Bot className="size-8 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="size-5 text-white" />
              </div>
            </div>
          </label>
        </div>

        {/* Name & Description */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agent-name">
              Agent Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="agent-name"
              placeholder="e.g., Content Strategist"
              value={newAgentForm.name}
              onChange={(e) => {
                setNewAgentForm({ ...newAgentForm, name: e.target.value });
                validateAgentName(e.target.value);
              }}
              className={agentNameError ? 'border-destructive' : ''}
            />
            {agentNameError && (
              <p className="text-sm text-destructive">{agentNameError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="agent-description"
              placeholder="Brief purpose of this agent..."
              value={newAgentForm.description}
              onChange={(e) => setNewAgentForm({ ...newAgentForm, description: e.target.value })}
              className="resize-none"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* System Instructions Section */}
      <div className="mb-8">
        <div className="mb-4">
          <h3>System Instructions <span className="text-destructive">*</span></h3>
          <p className="text-muted-foreground mt-1">Define the agent's behavior, tone, and capabilities</p>
        </div>
        <MarkdownField
          value={newAgentForm.systemInstructions}
          onChange={(value) => setNewAgentForm({ ...newAgentForm, systemInstructions: value })}
          placeholder="You are a helpful AI agent specialized in... Your primary responsibilities include..."
          minHeight="244px"
        />
      </div>

      {/* MCP Connections Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3>MCP Connections</h3>
            <p className="text-muted-foreground mt-1">Connect external tools and services to enhance agent capabilities</p>
          </div>
          <Popover open={mcpConnectionSelectorOpen} onOpenChange={setMcpConnectionSelectorOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Plus className="size-4" />
                Add Connection
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0" align="end">
              <Command>
                <CommandInput placeholder="Search connections..." />
                <CommandList>
                  <CommandEmpty>No connections found.</CommandEmpty>
                  <CommandGroup>
                    {connectors.filter(c => !newAgentForm.mcpConnections.includes(c.id)).map((connector) => (
                      <CommandItem
                        key={connector.id}
                        value={connector.name}
                        onSelect={() => handleAddMcpConnection(connector.id)}
                        className="flex items-center gap-3 py-2.5"
                      >
                        <div className={`size-9 ${connector.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <connector.icon className="size-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div>{connector.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{connector.description}</div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Selected Connections List */}
        {newAgentForm.mcpConnections.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-xl bg-muted/20">
            <div className="size-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Link className="size-5 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              No connections added yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Add MCP connections to extend your agent's capabilities
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {newAgentForm.mcpConnections.map((connectorId) => {
              const connector = connectors.find(c => c.id === connectorId);
              if (!connector) return null;
              
              return (
                <div key={connectorId} className="p-3 border border-border rounded-lg bg-card hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 ${connector.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <connector.icon className="size-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div>{connector.name}</div>
                      <div className="text-sm text-muted-foreground truncate">{connector.description}</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMcpConnection(connectorId)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // MCP Creation Handlers
  const handleOpenCreateMcpModal = () => {
    const initialData = {
      name: '',
      description: '',
      remoteUrl: '',
      headers: [{ key: '', value: '' }] as Array<{ key: string, value: string }>
    };
    setEditingMcpId(null);
    setCreateMcpFormData(initialData);
    setOriginalMcpFormData(initialData);
    setCreateMcpFormErrors({ name: '', remoteUrl: '' });
    setCreateMcpTestStatus('idle');
    setCreateMcpTestMessage('');
    setCreateMcpModalOpen(true);
  };

  // MCP Edit Handler
  const handleOpenEditMcpModal = (connector: Connector) => {
    const headers = connector.mcpData?.headers || [];
    const formData = {
      name: connector.name,
      description: connector.description,
      remoteUrl: connector.mcpData?.remoteUrl || '',
      headers: headers.length > 0 ? headers : [{ key: '', value: '' }] as Array<{ key: string, value: string }>
    };
    setEditingMcpId(connector.id);
    setCreateMcpFormData(formData);
    setOriginalMcpFormData(formData);
    setCreateMcpFormErrors({ name: '', remoteUrl: '' });
    setCreateMcpTestStatus('success'); // Assume existing connection is valid
    setCreateMcpTestMessage('');
    setCreateMcpModalOpen(true);
  };

  const validateCreateMcpForm = (): boolean => {
    const errors = { name: '', remoteUrl: '' };
    let isValid = true;

    // Validate name
    if (!createMcpFormData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    } else {
      // Check if name already exists in connectors (excluding current when editing)
      const nameExists = connectors.some(
        c => c.id !== editingMcpId && c.name.toLowerCase() === createMcpFormData.name.trim().toLowerCase()
      );
      if (nameExists) {
        errors.name = 'A connector with this name already exists';
        isValid = false;
      }
    }

    // Validate URL
    if (!createMcpFormData.remoteUrl.trim()) {
      errors.remoteUrl = 'Remote URL is required';
      isValid = false;
    } else {
      try {
        new URL(createMcpFormData.remoteUrl);
      } catch {
        errors.remoteUrl = 'Please enter a valid URL';
        isValid = false;
      }
    }

    setCreateMcpFormErrors(errors);
    return isValid;
  };

  // Check if MCP form has changes
  const hasMcpFormChanges = (): boolean => {
    return JSON.stringify(createMcpFormData) !== JSON.stringify(originalMcpFormData);
  };

  const handleTestNewMcpConnection = async () => {
    // Bypass strict validation - allow testing with any values
    setCreateMcpTestStatus('testing');
    setCreateMcpTestMessage('');

    // Simulate API call to test connection
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate success (90% success rate for demo)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      setCreateMcpTestStatus('success');
      setCreateMcpTestMessage('Connection successful');
      toast.success('Connection test successful');
    } else {
      setCreateMcpTestStatus('error');
      setCreateMcpTestMessage('Connection failed. Please check your details.');
      toast.error('Connection test failed');
    }
  };

  const handleSaveNewMcp = async () => {
    // Bypass strict validation - allow saving even without test
    setIsSavingNewMcp(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (editingMcpId) {
      // Edit existing MCP
      const updatedConnectors = connectors.map(conn => {
        if (conn.id === editingMcpId) {
          return {
            ...conn,
            name: createMcpFormData.name.trim() || conn.name,
            description: createMcpFormData.description.trim() || conn.description,
            mcpData: {
              remoteUrl: createMcpFormData.remoteUrl,
              headers: createMcpFormData.headers
            }
          };
        }
        return conn;
      });
      setConnectors(updatedConnectors);
      toast.success('MCP updated successfully');
    } else {
      // Create new connector with default name if empty
      const newConnector: Connector = {
        id: `mcp-${Date.now()}`,
        name: createMcpFormData.name.trim() || 'New MCP',
        description: createMcpFormData.description.trim() || 'Custom MCP connection',
        icon: Zap,
        bgColor: 'bg-primary',
        connected: true,
        category: 'development',
        isUserCreated: true,
        mcpData: {
          remoteUrl: createMcpFormData.remoteUrl,
          headers: createMcpFormData.headers
        }
      };

      // Add to connectors list
      setConnectors([...connectors, newConnector]);

      // Initialize empty connections array for this connector
      setConnections(prev => ({
        ...prev,
        [newConnector.id]: []
      }));
      toast.success('MCP created successfully');
    }

    setIsSavingNewMcp(false);
    setCreateMcpModalOpen(false);
    setEditingMcpId(null);
  };

  // Handle Delete Connector
  const handleDeleteConnector = async () => {
    if (!deleteConnectorConfirmation.connectorId) return;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Remove the connector from the list
    const updatedConnectors = connectors.filter(
      conn => conn.id !== deleteConnectorConfirmation.connectorId
    );
    setConnectors(updatedConnectors);

    // Also remove any connections for this connector
    const { [deleteConnectorConfirmation.connectorId]: removed, ...remainingConnections } = connections;
    setConnections(remainingConnections);

    // Close the confirmation dialog
    setDeleteConnectorConfirmation({ open: false, connectorId: null, connectorName: null });

    toast.success(`${deleteConnectorConfirmation.connectorName} deleted successfully`);
  };

  // General settings handlers
  const handleWorkspaceSave = async () => {
    setIsSavingWorkspace(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSavingWorkspace(false);
    toast.success('Workspace information updated successfully');
  };

  const handleDeleteWorkspace = async () => {
    if (deleteConfirmText.toLowerCase() === 'delete') {
      setIsDeletingWorkspace(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Workspace deletion initiated');
      // Add actual deletion logic here
      setIsDeletingWorkspace(false);
      setDeleteConfirmText('');
    }
  };

  const renderGeneralContent = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2>Workspace Settings</h2>
          <p className="text-muted-foreground">
            Configure workspace information and manage workspace lifecycle
            {workspaceName && <span className="ml-2">• {workspaceName}</span>}
          </p>
        </div>

        {/* Workspace Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Workspace Information
            </CardTitle>
            <CardDescription>
              Update workspace name and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Enter workspace name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspace-description">Workspace Description</Label>
                <Textarea
                  id="workspace-description"
                  value={workspaceDescription}
                  onChange={(e) => setWorkspaceDescription(e.target.value)}
                  placeholder="Enter workspace description"
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-3 border-t">
              <Button onClick={handleWorkspaceSave} disabled={isSavingWorkspace} className="gap-2">
                {isSavingWorkspace ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Target className="size-4" />
                )}
                {isSavingWorkspace ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Workspace Deletion Section */}
        <Card>
          <CardHeader>
            <CardTitle>Delete Workspace</CardTitle>
            <CardDescription>
              Permanently delete this workspace and all its data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="delete-confirm">
                  Type &quot;Delete&quot; to confirm workspace deletion
                </Label>
                <Input
                  id="delete-confirm"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder='Type "Delete" to confirm'
                />
                <p className="text-xs text-muted-foreground">
                  This action cannot be undone. This will permanently delete the workspace and all associated projects, tasks, comments, and data.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end pt-3 border-t">
              <Button 
                onClick={handleDeleteWorkspace}
                variant="destructive"
                disabled={deleteConfirmText !== 'Delete' || isDeletingWorkspace}
                className="gap-2"
              >
                {isDeletingWorkspace ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                {isDeletingWorkspace ? 'Deleting...' : 'Delete Workspace Forever'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderConnectorsContent = () => {
    const connectedConnectors = getConnectedConnectors();
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2>MCP Servers</h2>
            <p className="text-muted-foreground mt-1">Allow Kajoo to reference other apps and services for more context.</p>
          </div>
          <Button
            onClick={handleOpenCreateMcpModal}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Plus className="size-4" />
            Create New MCP
          </Button>
        </div>

        {/* Connected Connectors List */}
        <div className="space-y-3">
          {connectedConnectors.length > 0 ? (
            connectedConnectors.map(connector => (
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card" key={connector.id}>
                <div className="flex items-center gap-3">
                  <div className={`size-10 ${connector.bgColor} rounded-lg flex items-center justify-center`}>
                    <connector.icon className="size-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{connector.name}</span>
                      {connector.isUserCreated && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          Custom
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">{connector.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!connector.isUserCreated && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5 text-[12px] text-center">
                      {connections[connector.id]?.length || 0} connections
                    </Badge>
                  )}
                  {connector.isUserCreated ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenEditMcpModal(connector)}
                        className="gap-2"
                      >
                        <Edit2 className="size-4" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDeleteConnectorConfirmation({ 
                          open: true, 
                          connectorId: connector.id,
                          connectorName: connector.name
                        })}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenConnectionsDrawer(connector)}
                    >
                      Manage Connections
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Link className="size-8 text-muted-foreground" />
              </div>
              <h3>No Connected MCP Servers</h3>
              <p className="text-muted-foreground mb-4">
                Configure your GitHub and Sitecore MCP servers to get started
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAgentsContent = () => {
    // If creating a new agent, show the create agent view
    if (showCreateAgentView) {
      return (
        <div className="flex flex-col h-full">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-background">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCreateAgentView(false);
                  resetCreateAgentForm();
                }}
                className="gap-1 -ml-3 text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="size-4" />
                Back to Agents
              </Button>
              <Button
                size="sm"
                onClick={handleCreateAgent}
                disabled={!isCreateAgentFormValid() || isCreatingAgent}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isCreatingAgent ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Bot className="size-4 mr-2" />
                    Create Agent
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <h2 className="mb-6 text-[18px]">Create New Agent</h2>
            {renderCreateAgentFormContent()}
          </div>
        </div>
      );
    }

    // If an agent is selected, show the detail view
    if (selectedAgent) {
      return (
        <div className="flex flex-col h-full">
          {/* Sticky Header */}
          <div className="sticky top-0 z-[200] bg-background">
            <div className="py-4">
              {/* Top Row: Back button + Actions */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToAgents}
                  className="gap-1 -ml-3 text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="size-4" />
                  Back to Agents
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveAgent}
                    disabled={isSavingAgent || !hasUnsavedChanges}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isSavingAgent ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="size-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Agent Identity Row */}
              <div className="mb-6">
                {/* Avatar and Content */}
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative group flex-shrink-0">
                    <div className={`size-14 rounded-[var(--radius-xl)] flex items-center justify-center overflow-hidden ${selectedAgent.isCustom ? (selectedAgent.avatarUrl ? 'bg-primary' : 'bg-muted') : selectedAgent.bgColor}`}>
                      {selectedAgent.isCustom && selectedAgent.avatarUrl ? (
                        <img 
                          src={selectedAgent.avatarUrl} 
                          alt={`${selectedAgent.name} avatar`}
                          className="size-full object-cover"
                        />
                      ) : selectedAgent.isCustom || !selectedAgent.icon ? (
                        <Bot className="size-7 text-muted-foreground" />
                      ) : (
                        React.createElement(selectedAgent.icon, { className: "size-7 text-white" })
                      )}
                    </div>
                    {selectedAgent.isCustom && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-[var(--radius-xl)] flex items-center justify-center cursor-pointer">
                        <Upload className="size-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Right Content: Name + Description with Toggle */}
                  <div className="flex-1 relative">
                    {/* Toggle - Absolute Right */}
                    <div className="absolute top-0 right-0 flex items-center gap-2">
                      <Switch
                        checked={selectedAgent.isOnline}
                        onCheckedChange={(checked) => handleAgentChange({ isOnline: checked })}
                      />
                    </div>

                    {/* Name and Description Stack */}
                    <div className="space-y-2 pr-32">
                      {/* Name Input */}
                      <div className="max-w-md">
                        <Input
                          value={selectedAgent.name}
                          onChange={(e) => {
                            const newName = e.target.value;
                            const newHandle = `@${newName.toLowerCase().replace(/\s+/g, '')}`;
                            handleAgentChange({ name: newName, handle: newHandle });
                          }}
                          className="border-input bg-background hover:bg-accent/50 focus:bg-background transition-colors px-3 py-2 h-9 rounded-[var(--radius-md)]"
                          placeholder="Agent name"
                        />
                      </div>

                      {/* Description Input */}
                      <div className="max-w-2xl">
                        <Input
                          value={selectedAgent.description}
                          onChange={(e) => handleAgentChange({ description: e.target.value })}
                          placeholder="Short description"
                          className="border-input bg-background hover:bg-accent/50 focus:bg-background transition-colors px-3 py-2 h-9 rounded-[var(--radius-md)] text-muted-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Navigation - Simple underlined style */}
              <div className="flex gap-6 border-b border-border -mb-px">
                <button
                  onClick={() => {
                    setSelectedAgentTab('instructions');
                    setIsLoadingTab(true);
                    setTimeout(() => setIsLoadingTab(false), 300);
                  }}
                  className={`pb-3 transition-colors relative flex items-center gap-2 ${
                    selectedAgentTab === 'instructions'
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Instructions
                  {hasUnsavedChanges && selectedAgentTab !== 'instructions' && (
                    <div className="size-1.5 rounded-full bg-warning" />
                  )}
                  {selectedAgentTab === 'instructions' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedAgentTab('connections');
                    setIsLoadingTab(true);
                    setTimeout(() => setIsLoadingTab(false), 300);
                  }}
                  className={`pb-3 transition-colors relative flex items-center gap-2 ${
                    selectedAgentTab === 'connections'
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Connections & Tools
                  {hasUnsavedChanges && selectedAgentTab !== 'connections' && (
                    <div className="size-1.5 rounded-full bg-warning" />
                  )}
                  {selectedAgentTab === 'connections' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedAgentTab === 'instructions' && (
              <div className="pt-4">
                {isLoadingTab ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full max-w-2xl" />
                    <Skeleton className="h-48 w-full" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <h3>System Instructions</h3>
                        {hasUnsavedChanges && (
                          <span className="flex items-center gap-1 text-xs text-warning">
                            <div className="size-2 rounded-full bg-warning" />
                            Unsaved changes
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Describe the agent's tone, role, and behavior.
                      </p>
                    </div>
                    
                    <MarkdownField
                      value={selectedAgent.systemInstructions || ''}
                      onChange={(value) => handleAgentChange({ systemInstructions: value })}
                      placeholder="You are a Sitecore expert who assists with migration and content architecture..."
                      minHeight="320px"
                    />
                    {selectedAgent.systemInstructions === '' && (
                      <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                        <AlertCircle className="size-3" />
                        Instructions cannot be empty
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {selectedAgentTab === 'connections' && (
              <div className="pt-4">
                {isLoadingTab ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full max-w-2xl" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h3>MCP Connections</h3>
                          {hasUnsavedChanges && (
                            <span className="flex items-center gap-1 text-xs text-warning">
                              <div className="size-2 rounded-full bg-warning" />
                              Unsaved changes
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Configure Model Context Protocol connections for this agent to access external tools and data sources.
                        </p>
                      </div>
                      <Popover open={mcpConnectionPopoverOpen} onOpenChange={setMcpConnectionPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="size-4 mr-2" />
                            Add MCP Connection
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[320px] p-0" align="end">
                          <Command>
                            <CommandInput placeholder="Search connections..." />
                            <CommandList>
                              <CommandEmpty>No connections found.</CommandEmpty>
                              <CommandGroup>
                                {connectors.map((connector) => (
                                  <CommandItem
                                    key={connector.id}
                                    value={connector.name}
                                    onSelect={() => handleDirectAddMcpConnection(connector.id)}
                                    className="flex items-center gap-3 py-2.5 cursor-pointer"
                                  >
                                    <div className={`size-9 ${connector.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                      <connector.icon className="size-4 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm">{connector.name}</div>
                                      <div className="text-xs text-muted-foreground truncate">{connector.description}</div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* MCP Connections List */}
                    {selectedAgent.mcpConnections && selectedAgent.mcpConnections.length > 0 ? (
                      <div className="space-y-6">
                        {selectedAgent.mcpConnections.map((conn: any, connIndex: number) => {
                          const isExpanded = expandedMcpCards.has(connIndex);
                          return (
                            <Card key={connIndex} className="overflow-hidden border-border shadow-sm">
                              {/* Card Header - Clickable */}
                              <div
                                className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                                onClick={() => toggleMcpCard(connIndex)}
                              >
                                <div className="flex items-start gap-3">
                                  {/* Icon Avatar */}
                                  {conn.connectorIcon && conn.connectorBgColor && (
                                    <div className={`size-10 ${conn.connectorBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                      <conn.connectorIcon className="size-5 text-white" />
                                    </div>
                                  )}
                                  
                                  <div className="flex-1 min-w-0 space-y-3">
                                    {/* Top Row: Domain, Badges */}
                                    <div className="flex items-center gap-2">
                                      <h4 className="truncate">
                                        {conn.connectorName || conn.url.replace(/^https?:\/\//, '').split('/')[0]}
                                      </h4>
                                      <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                                        {conn.owner || 'User'}
                                      </Badge>
                                      {conn.status === 'success' && (
                                        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                                          <Check className="size-3 mr-1" />
                                          Connected
                                        </Badge>
                                      )}
                                      {conn.status === 'error' && (
                                        <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10">
                                          Failed
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    {/* Connection Details - Always Visible */}
                                    <div className="space-y-2">
                                      {/* Connection URL */}
                                      <p className="text-sm text-muted-foreground break-all">{conn.url}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <Switch
                                      checked={conn.enabled !== false}
                                      onCheckedChange={(checked) => {
                                        const updatedConnections = [...selectedAgent.mcpConnections];
                                        updatedConnections[connIndex] = { ...updatedConnections[connIndex], enabled: checked };
                                        setSelectedAgent({
                                          ...selectedAgent,
                                          mcpConnections: updatedConnections
                                        });
                                        setHasUnsavedChanges(true);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteConfirmation({ open: true, connectionIndex: connIndex });
                                      }}
                                    >
                                      <Trash2 className="size-4" />
                                    </Button>
                                    {isExpanded ? (
                                      <ChevronUp className="size-5 text-muted-foreground" />
                                    ) : (
                                      <ChevronDown className="size-5 text-muted-foreground" />
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Expanded Content - Tools Only */}
                              {isExpanded && (
                                <div className="animate-in slide-in-from-top-2 duration-200 -mt-2">
                                  {/* Tools Table */}
                                  {conn.tools && conn.tools.length > 0 && (
                                    <div className="px-4 pb-4 space-y-3">
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                          <h3 className="text-[14px]">Available Tools</h3>
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-6 w-6 p-0 hover:bg-muted"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    toast.success('Tools refreshed');
                                                  }}
                                                >
                                                  <RefreshCw className="size-3.5" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Refresh</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </div>
                                        
                                        <div className="relative w-64">
                                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                          <Input
                                            type="text"
                                            placeholder="Search tools..."
                                            value={mcpToolsSearchTerm[connIndex] || ''}
                                            onChange={(e) => {
                                              setMcpToolsSearchTerm({
                                                ...mcpToolsSearchTerm,
                                                [connIndex]: e.target.value
                                              });
                                              // Reset to page 1 when searching
                                              setMcpToolsPage({
                                                ...mcpToolsPage,
                                                [connIndex]: 1
                                              });
                                            }}
                                            className="h-8 pl-9 pr-3"
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-3">
                                        {/* Tools Grid */}
                                        {(() => {
                                          const filteredTools = conn.tools.filter((tool: any) => {
                                            const searchTerm = mcpToolsSearchTerm[connIndex]?.toLowerCase() || '';
                                            if (!searchTerm) return true;
                                            return (
                                              tool.name?.toLowerCase().includes(searchTerm) ||
                                              tool.description?.toLowerCase().includes(searchTerm)
                                            );
                                          });
                                          
                                          if (filteredTools.length === 0) {
                                            return (
                                              <div className="text-center py-8 text-muted-foreground">
                                                No tools found matching "{mcpToolsSearchTerm[connIndex]}"
                                              </div>
                                            );
                                          }
                                          
                                          return (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                              {filteredTools.map((tool: any, toolIndex: number) => {
                                                return (
                                                  <Card key={toolIndex} className="border border-border bg-accent/30 hover:border-primary/50 transition-colors">
                                                    <CardContent className="p-4 space-y-3">
                                                      {/* Tool Name & Toggle */}
                                                      <div className="flex items-start justify-between gap-3">
                                                        <h4 className="line-clamp-1 flex-1">{tool.name}</h4>
                                                        <Switch
                                                          checked={tool.enabled}
                                                          onCheckedChange={(checked) => handleToolChange(connIndex, toolIndex, 'enabled', checked)}
                                                        />
                                                      </div>
                                                      
                                                      {/* Tool Description */}
                                                      <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                                                        {tool.description || 'No description available'}
                                                      </p>
                                                      
                                                      {/* HITL Behavior Dropdown */}
                                                      <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">HITL Behavior</Label>
                                                        <Select
                                                          value={tool.hitlBehavior}
                                                          onValueChange={(value) => handleToolChange(connIndex, toolIndex, 'hitlBehavior', value)}
                                                        >
                                                          <SelectTrigger className="h-8">
                                                            <SelectValue />
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                            <SelectItem value="auto">Auto</SelectItem>
                                                            <SelectItem value="approval-required">Approval Required</SelectItem>
                                                            <SelectItem value="ask-first">Ask First</SelectItem>
                                                          </SelectContent>
                                                        </Select>
                                                      </div>
                                                    </CardContent>
                                                  </Card>
                                                );
                                              })}
                                            </div>
                                          );
                                        })()}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-16 border border-dashed border-border rounded-lg bg-muted/20">
                        <div className="size-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <Link className="size-7 text-muted-foreground" />
                        </div>
                        <h4 className="mb-2">No MCP Connections</h4>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          Add an MCP connection to extend this agent's capabilities with external tools and data sources.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Default: Show agents grid
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2>AI Agent Management</h2>
            <p className="text-muted-foreground mt-1">Manage your AI agents, customize their names, and control their availability for this workspace</p>
          </div>
          <Button 
            onClick={() => setShowCreateAgentView(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="size-4 mr-2" />
            Create Agent
          </Button>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Default Agents */}
        {defaultAgents.map((agent) => (
          <Card 
            key={agent.id}
            className="p-6 transition-all duration-200 hover:shadow-md hover:bg-accent/50"
          >
            <div className="flex items-start justify-between">
              <div 
                className="flex items-start gap-4 flex-1 cursor-pointer"
                onClick={() => handleAgentClick(agent)}
              >
              <div className="relative">
                <div className={`size-12 ${agent.bgColor} rounded-lg flex items-center justify-center`}>
                  <agent.icon className="size-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="group-hover:underline transition-all duration-200">{agent.name}</h3>
                </div>
                <div className="mb-2">
                  <Badge variant="secondary" className="px-2 py-0.5">{agent.handle}</Badge>
                </div>
                <p className="text-muted-foreground mb-2 text-sm">{agent.description}</p>
                <p className="text-xs text-muted-foreground">{agent.longDescription}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <Switch 
                checked={agent.isOnline} 
                onCheckedChange={(checked) => updateAgentSetting(agent.id + 'Agent', checked)} 
              />
            </div>
          </div>
        </Card>
        ))}

        {/* Custom Agents */}
        {customAgents.map((agent) => {
          return (
            <Card 
              key={agent.id} 
              className="group p-6 transition-all duration-200 hover:shadow-md hover:bg-accent/50 animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="flex items-start justify-between">
                <div 
                  className="flex items-start gap-4 flex-1 cursor-pointer"
                  onClick={() => handleAgentClick(agent)}
                >
                  <div className="relative">
                    <div className={`size-12 rounded-lg flex items-center justify-center overflow-hidden ${agent.avatarUrl ? 'bg-primary' : 'bg-muted'}`}>
                      {agent.avatarUrl ? (
                        <img 
                          src={agent.avatarUrl} 
                          alt={`${agent.name} avatar`}
                          className="size-full object-cover"
                        />
                      ) : (
                        <Bot className="size-6 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="group-hover:underline transition-all duration-200">{agent.name}</h3>
                    </div>
                    <div className="mb-2">
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">{agent.handle}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2 text-sm">{agent.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <Switch 
                    checked={agent.isOnline} 
                    onCheckedChange={(checked) => {
                      const updated = customAgents.map(a => 
                        a.id === agent.id ? { ...a, isOnline: checked } : a
                      );
                      setCustomAgents(updated);
                    }} 
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
    );
  };



  // Create Template Handlers
  const handleOpenCreateTemplateModal = () => {
    setCreateTemplateForm({
      name: '',
      description: '',
      fullPrompt: '',
      tags: '',
      status: 'active',
      type: 'chat'
    });
    setEditingTemplate(null);
    setShowCreateTemplateView(true);
  };

  const resetCreateTemplateForm = () => {
    setCreateTemplateForm({
      name: '',
      description: '',
      fullPrompt: '',
      tags: '',
      status: 'active',
      type: 'chat'
    });
  };

  const handleSaveTemplate = async () => {
    setIsSavingTemplate(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (editingTemplate) {
      // Update existing template
      setPromptTemplates(promptTemplates.map(template => 
        template.id === editingTemplate
          ? {
              ...template,
              name: createTemplateForm.name,
              description: createTemplateForm.description,
              status: createTemplateForm.status,
              type: createTemplateForm.type,
              lastModified: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
              fullPrompt: createTemplateForm.fullPrompt
            }
          : template
      ));
      toast.success('Template updated successfully');
    } else {
      // Create new template
      const newTemplate = {
        id: `template-${Date.now()}`,
        name: createTemplateForm.name,
        description: createTemplateForm.description,
        status: createTemplateForm.status,
        type: createTemplateForm.type,
        lastModified: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        fullPrompt: createTemplateForm.fullPrompt
      };
      setPromptTemplates([...promptTemplates, newTemplate]);
      toast.success('Template created successfully');
    }
    
    setIsSavingTemplate(false);
    setShowCreateTemplateView(false);
    setEditingTemplate(null);
    resetCreateTemplateForm();
  };

  const isCreateTemplateFormValid = () => {
    return createTemplateForm.name.trim() && 
           createTemplateForm.description.trim() && 
           createTemplateForm.fullPrompt.trim();
  };

  const renderPromptTemplatesContent = () => {
    // If creating a new template, show the create template view
    if (showCreateTemplateView) {
      return (
        <div className="flex flex-col h-full">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-background">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCreateTemplateView(false);
                  setEditingTemplate(null);
                  resetCreateTemplateForm();
                }}
                className="gap-1 -ml-3 text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="size-4" />
                Back to Templates
              </Button>
              <div className="flex items-center gap-2">
                {editingTemplate && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (editingTemplate) {
                        const template = promptTemplates.find(t => t.id === editingTemplate);
                        if (template) {
                          handleDeleteTemplate(editingTemplate, template.name);
                        }
                      }
                    }}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                  >
                    <Trash2 className="size-4 mr-2" />
                    Delete
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleSaveTemplate}
                  disabled={!isCreateTemplateFormValid() || isSavingTemplate}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isSavingTemplate ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      {editingTemplate ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="size-4 mr-2" />
                      {editingTemplate ? 'Save' : 'Create Template'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <h2 className="mb-6 text-[18px]">{editingTemplate ? 'Edit Template' : 'Create New Template'}</h2>
            
            <div className="max-w-2xl space-y-6">
              {/* Template Name */}
              <div className="space-y-2">
                <Label htmlFor="template-name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="template-name"
                  placeholder="e.g., Content Migration Analysis"
                  value={createTemplateForm.name}
                  onChange={(e) => setCreateTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                />
                <p className="text-sm text-muted-foreground">
                  Give your template a clear, descriptive name
                </p>
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <Label htmlFor="template-description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="template-description"
                  placeholder="Brief description of what this template does (max 200 characters)"
                  value={createTemplateForm.description}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 200) {
                      setCreateTemplateForm(prev => ({ ...prev, description: value }));
                    }
                  }}
                  className="min-h-[80px] resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  {createTemplateForm.description.length}/200 characters
                </p>
              </div>

              {/* Type Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="template-type">
                  Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={createTemplateForm.type}
                  onValueChange={(value: 'chat' | 'instruction') => 
                    setCreateTemplateForm(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger id="template-type">
                    <SelectValue placeholder="Select template type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chat">Chat-style prompt</SelectItem>
                    <SelectItem value="instruction">Instruction-style prompt</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Choose the style that best fits your template's purpose
                </p>
              </div>

              {/* Status Toggle */}
              <div className="space-y-2">
                <Label htmlFor="template-status">Status</Label>
                <div className="flex items-center gap-3">
                  <Switch
                    id="template-status"
                    checked={createTemplateForm.status === 'active'}
                    onCheckedChange={(checked) => setCreateTemplateForm(prev => ({ 
                      ...prev, 
                      status: checked ? 'active' : 'inactive' 
                    }))}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {createTemplateForm.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      • Active templates are available for immediate use
                    </span>
                  </div>
                </div>
              </div>

              {/* Full Prompt Content */}
              <div className="mb-8">
                <div className="mb-4">
                  <h3>Full Prompt Content <span className="text-destructive">*</span></h3>
                  <p className="text-muted-foreground mt-1">Enter the complete prompt template content</p>
                </div>
                <MarkdownField
                  value={createTemplateForm.fullPrompt}
                  onChange={(value) => setCreateTemplateForm(prev => ({ ...prev, fullPrompt: value }))}
                  placeholder="Enter the complete prompt template content here..."
                  minHeight="400px"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    const handleEditTemplate = (templateId: string) => {
      const template = promptTemplates.find(t => t.id === templateId);
      if (template) {
        setCreateTemplateForm({
          name: template.name,
          description: template.description,
          fullPrompt: template.fullPrompt,
          tags: '',
          status: template.status,
          type: template.type
        });
        setEditingTemplate(templateId);
        setShowCreateTemplateView(true);
      }
    };

    const toggleTemplateStatus = (templateId: string) => {
      setPromptTemplates(promptTemplates.map(template => 
        template.id === templateId 
          ? { ...template, status: template.status === 'active' ? 'inactive' : 'active' }
          : template
      ));
      toast.success('Template status updated');
    };

    const handleDeleteTemplate = (templateId: string, templateName: string) => {
      setTemplateToDelete({ id: templateId, name: templateName });
      setDeleteConfirmOpen(true);
    };
    
    const confirmDeleteTemplate = () => {
      if (templateToDelete) {
        setPromptTemplates(promptTemplates.filter(t => t.id !== templateToDelete.id));
        toast.success('Template deleted successfully');
        setDeleteConfirmOpen(false);
        setTemplateToDelete(null);
      }
    };
    
    const cancelDeleteTemplate = () => {
      setDeleteConfirmOpen(false);
      setTemplateToDelete(null);
    };

    // Filter templates based on search query and type filter
    const filteredTemplates = promptTemplates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(templateSearchQuery.toLowerCase());
      const matchesType = templateTypeFilter === 'all' || template.type === templateTypeFilter;
      const matchesStatus = templateStatusFilter === 'all' || template.status === templateStatusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2>Prompt Templates</h2>
            <p className="text-muted-foreground mt-1">Create and manage reusable prompt templates for AI interactions</p>
          </div>
          <Button onClick={handleOpenCreateTemplateModal}>
            <Plus className="size-4 mr-2" />
            New Template
          </Button>
        </div>

        {/* Filters */}
        {promptTemplates.length > 0 && (
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={templateSearchQuery}
                onChange={(e) => setTemplateSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Type Filter */}
            <Select value={templateTypeFilter} onValueChange={(value: 'all' | 'chat' | 'instruction') => setTemplateTypeFilter(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="chat">Chat-style</SelectItem>
                <SelectItem value="instruction">Instruction-style</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={templateStatusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setTemplateStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Prompt Templates Table */}
        {promptTemplates.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg bg-muted/20">
            <div className="size-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="size-7 text-muted-foreground" />
            </div>
            <h4 className="mb-2">No Prompt Templates</h4>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Create reusable prompt templates to streamline common AI requests and maintain consistency across your workspace.
            </p>
            <Button size="sm" variant="outline" onClick={handleOpenCreateTemplateModal}>
              <Plus className="size-4 mr-2" />
              Create Your First Template
            </Button>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[250px]">Template Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[130px]">Type</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[140px]">Last Modified</TableHead>
                  <TableHead className="w-[140px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-[400px]">
                      <div className="text-center py-16">
                        <div className="size-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="size-7 text-muted-foreground" />
                        </div>
                        <h4 className="mb-2">No Templates Found</h4>
                        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                          No templates match your current filters. Try adjusting your search or filter criteria.
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setTemplateSearchQuery('');
                            setTemplateTypeFilter('all');
                            setTemplateStatusFilter('all');
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTemplates.map((template) => {
                    return (
                    <TableRow 
                      key={template.id}
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => handleEditTemplate(template.id)}
                    >
                      <TableCell className="py-3">
                        {template.name}
                      </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">
                          {template.description}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge 
                            className={`text-xs ${
                              template.type === 'chat' 
                                ? 'bg-primary/10 text-primary border-primary/20' 
                                : 'bg-muted text-muted-foreground border-border'
                            }`}
                          >
                            {template.type === 'chat' ? 'Chat-style' : 'Instruction-style'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge 
                            className={`text-xs lowercase ${
                              template.status === 'active' 
                                ? 'bg-success/10 text-success border-success/20' 
                                : 'bg-muted/50 text-muted-foreground'
                            }`}
                          >
                            {template.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">
                          {template.lastModified}
                        </TableCell>
                        <TableCell className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Switch 
                              checked={template.status === 'active'}
                              onCheckedChange={() => toggleTemplateStatus(template.id)}
                              title={template.status === 'active' ? 'Deactivate' : 'Activate'}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteTemplate(template.id, template.name)}
                              title="Delete template"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Template</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{templateToDelete?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDeleteTemplate}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteTemplate}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-background">
        <div className="p-4 border-b border-border">
          <h2>Workspace Settings</h2>
        </div>
        
        <nav className="p-4">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as SettingsSection)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="size-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-[28px]">
        <div className="px-[0px] p-[0px]">
          {activeSection === 'general' && renderGeneralContent()}
          {activeSection === 'connectors' && renderConnectorsContent()}
          {activeSection === 'agents' && renderAgentsContent()}
          {activeSection === 'promptTemplates' && renderPromptTemplatesContent()}
        </div>
      </div>

      {/* Manage Connections Drawer */}
      <Sheet open={connectionsDrawerOpen} onOpenChange={setConnectionsDrawerOpen}>
        <SheetContent className="w-[500px] min-w-[500px] max-w-[500px]" style={{ width: '500px' }}>
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-3">
              {selectedConnector && (
                <>
                  <div className={`size-8 ${selectedConnector.bgColor} rounded-lg flex items-center justify-center`}>
                    <selectedConnector.icon className="size-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{selectedConnector.name} Connections</div>
                    <div className="text-sm text-muted-foreground font-normal">Manage all connections for {selectedConnector.name}</div>
                  </div>
                </>
              )}
            </SheetTitle>
          </SheetHeader>
          
          <div className="space-y-6">
            {selectedConnector && (
              <>
                {/* Active Connections Section */}
                <div className="space-y-4 px-[16px] px-[16px] py-[0px]">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Active Connections</h4>
                    <Button 
                      onClick={handleAddNewConnection}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      size="sm"
                    >
                      Add New Connection
                    </Button>
                  </div>
                  
                  {connections[selectedConnector.id]?.length > 0 ? (
                    <div className="border border-border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-medium">Name</TableHead>
                            <TableHead className="font-medium">Status</TableHead>
                            <TableHead className="font-medium text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {connections[selectedConnector.id].map(connection => (
                            <TableRow key={connection.id} className="hover:bg-muted/50">
                              <TableCell className="py-3 text-left">
                                <div className="font-medium">{connection.name}</div>
                              </TableCell>
                              <TableCell className="py-3">
                                <Badge className={`text-xs lowercase ${
                                  connection.status === 'active' 
                                    ? 'bg-success/10 text-success border-success/20' 
                                    : 'bg-muted/50 text-muted-foreground'
                                }`}>
                                  {connection.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-3 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteConnection(selectedConnector.id, connection.id)}
                                  disabled={deletingConnectionId === connection.id}
                                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                >
                                  {deletingConnectionId === connection.id ? (
                                    <Loader2 className="size-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="size-4" />
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-border rounded-lg">
                      <div className="size-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                        <selectedConnector.icon className="size-6 text-muted-foreground" />
                      </div>
                      <h5 className="font-medium mb-1">No connections yet</h5>
                      <p className="text-sm text-muted-foreground">
                        Add your first {selectedConnector.name} connection to get started
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Connection Modal */}
      <Dialog open={addConnectionModalOpen} onOpenChange={setAddConnectionModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedConnector && (
                <>
                  <div className={`size-8 ${selectedConnector.bgColor} rounded-lg flex items-center justify-center`}>
                    <selectedConnector.icon className="size-4 text-white" />
                  </div>
                  Add {selectedConnector.name} Connection
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedConnector?.id === 'github' 
                ? 'Connect your GitHub repository to enable code deployment and version control integration.'
                : `Configure a new connection to ${selectedConnector?.name}`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="connection-name">Connection Name</Label>
              <Input
                id="connection-name"
                placeholder="Enter a name for this connection"
                value={newConnectionForm.name}
                onChange={(e) => setNewConnectionForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="connection-description">Description (Optional)</Label>
              <Input
                id="connection-description"
                placeholder="Describe this connection"
                value={newConnectionForm.description}
                onChange={(e) => setNewConnectionForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            {selectedConnector?.id === 'github' && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-3">
                  Click the button below to authorize Kajoo to access your GitHub repositories.
                </p>
                <Button 
                  onClick={handleConnectGitHub}
                  className="w-full bg-[#24292F] hover:bg-[#24292F]/90 text-white"
                  style={{ backgroundColor: '#24292F' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#24292Fe5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#24292F')}
                >
                  <Globe className="size-4 mr-2" />
                  Connect GitHub
                </Button>
              </div>
            )}

            {selectedConnector?.id === 'sitecore-xp' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="graphql-endpoint">GraphQL Endpoint</Label>
                  <Input
                    id="graphql-endpoint"
                    placeholder="https://your-sitecore.net/sitecore/api/graph/edge"
                    value={newConnectionForm.graphqlEndpoint}
                    onChange={(e) => setNewConnectionForm(prev => ({ ...prev, graphqlEndpoint: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="graphql-api-key">GraphQL API Key</Label>
                  <Input
                    id="graphql-api-key"
                    type="password"
                    placeholder="Your Sitecore GraphQL API key"
                    value={newConnectionForm.graphqlApiKey}
                    onChange={(e) => setNewConnectionForm(prev => ({ ...prev, graphqlApiKey: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graphql-headers">GraphQL Headers (Optional)</Label>
                  <Textarea
                    id="graphql-headers"
                    placeholder='{"Authorization": "Bearer token", "Custom-Header": "value"}'
                    value={newConnectionForm.graphqlHeaders}
                    onChange={(e) => setNewConnectionForm(prev => ({ ...prev, graphqlHeaders: e.target.value }))}
                    className="min-h-[80px] resize-none font-mono text-sm"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional JSON object with custom headers for GraphQL requests
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="item-service-domain">Item Service Domain</Label>
                  <Input
                    id="item-service-domain"
                    placeholder="your-sitecore.net"
                    value={newConnectionForm.itemServiceDomain}
                    onChange={(e) => setNewConnectionForm(prev => ({ ...prev, itemServiceDomain: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item-service-username">Item Service Username</Label>
                  <Input
                    id="item-service-username"
                    placeholder="Your Sitecore username"
                    value={newConnectionForm.itemServiceUsername}
                    onChange={(e) => setNewConnectionForm(prev => ({ ...prev, itemServiceUsername: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item-service-password">Item Service Password</Label>
                  <Input
                    id="item-service-password"
                    type="password"
                    placeholder="Your Sitecore password"
                    value={newConnectionForm.itemServicePassword}
                    onChange={(e) => setNewConnectionForm(prev => ({ ...prev, itemServicePassword: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item-service-server-url">Item Service Server URL</Label>
                  <Input
                    id="item-service-server-url"
                    placeholder="https://your-sitecore.net"
                    value={newConnectionForm.itemServiceServerUrl}
                    onChange={(e) => setNewConnectionForm(prev => ({ ...prev, itemServiceServerUrl: e.target.value }))}
                  />
                </div>
              </>
            )}

            {selectedConnector?.id === 'sitecore-xmc' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="xmc-graphql-endpoint">GraphQL Endpoint</Label>
                  <Input
                    id="xmc-graphql-endpoint"
                    placeholder="https://xmc.sitecorecloud.io/api/graphql/v1"
                    value={newConnectionForm.graphqlEndpoint}
                    onChange={(e) => setNewConnectionForm(prev => ({ ...prev, graphqlEndpoint: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="xmc-client-id">Client ID</Label>
                  <Input
                    id="xmc-client-id"
                    placeholder="Your XMC Client ID"
                    value={newConnectionForm.clientId}
                    onChange={(e) => setNewConnectionForm(prev => ({ ...prev, clientId: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="xmc-client-secret">Client Secret</Label>
                  <Input
                    id="xmc-client-secret"
                    type="password"
                    placeholder="Your XMC Client Secret"
                    value={newConnectionForm.clientSecret}
                    onChange={(e) => setNewConnectionForm(prev => ({ ...prev, clientSecret: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="xmc-graphql-headers">GraphQL Headers (Optional)</Label>
                  <Textarea
                    id="xmc-graphql-headers"
                    placeholder='{"Authorization": "Bearer token", "Custom-Header": "value"}'
                    value={newConnectionForm.graphqlHeaders}
                    onChange={(e) => setNewConnectionForm(prev => ({ ...prev, graphqlHeaders: e.target.value }))}
                    className="min-h-[80px] resize-none font-mono text-sm"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional JSON object with custom headers for GraphQL requests
                  </p>
                </div>
              </>
            )}
          </div>

          <div className={`flex gap-3 ${selectedConnector?.id === 'github' ? 'justify-end' : 'justify-between'}`}>
            {selectedConnector?.id !== 'github' && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={testConnectionStatus === 'loading' || !newConnectionForm.name}
                  className="gap-2"
                >
                  {testConnectionStatus === 'loading' && <Loader2 className="size-4 animate-spin" />}
                  {testConnectionStatus === 'loading' ? 'Testing...' : 'Test Connection'}
                </Button>
                
                {testConnectionStatus === 'success' && (
                  <Badge className="bg-success/10 text-success hover:bg-success/20">
                    <Check className="mr-1 h-3 w-3" />
                    Passed
                  </Badge>
                )}
                
                {testConnectionStatus === 'failed' && (
                  <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
                    <X className="mr-1 h-3 w-3" />
                    Failed
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setAddConnectionModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateConnection}
                disabled={
                  !newConnectionForm.name || 
                  (selectedConnector?.id !== 'github' && testConnectionStatus !== 'success' && testConnectionStatus !== 'failed') ||
                  isCreatingConnection
                }
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                {isCreatingConnection && <Loader2 className="size-4 animate-spin" />}
                {isCreatingConnection ? 'Adding...' : 'Add Connection'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Instruction Popup */}
      <Dialog open={instructionPopup.open} onOpenChange={closeInstructionPopup}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Instructions for {instructionPopup.agentName}
            </DialogTitle>
            <DialogDescription>
              {instructionPopup.agentDescription}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="agent-instructions">Custom Instructions</Label>
              <Textarea
                id="agent-instructions"
                placeholder={`Enter specific instructions for ${instructionPopup.agentName}...`}
                value={instructionPopup.instructions}
                onChange={(e) => setInstructionPopup(prev => ({ ...prev, instructions: e.target.value }))}
                className="min-h-[120px] resize-none"
                rows={5}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={closeInstructionPopup}>
              Cancel
            </Button>
            <Button 
              onClick={saveInstructions}
              disabled={isSavingInstructions}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              {isSavingInstructions && <Loader2 className="size-4 animate-spin" />}
              {isSavingInstructions ? 'Saving...' : 'Save Instructions'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add MCP Connection Modal */}
      <Dialog open={addMcpModalOpen} onOpenChange={setAddMcpModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New MCP Connection</DialogTitle>
            <DialogDescription>
              Configure a Model Context Protocol connection to extend this agent's capabilities.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* MCP Connection Selector */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>MCP Connections</Label>
                <Popover open={agentMcpConnectionSelectorOpen} onOpenChange={setAgentMcpConnectionSelectorOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="size-4" />
                      Add Connection
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="end">
                    <Command>
                      <CommandInput placeholder="Search connections..." />
                      <CommandList>
                        <CommandEmpty>No connections found.</CommandEmpty>
                        <CommandGroup>
                          {connectors.filter(c => !selectedMcpConnectionsForAgent.includes(c.id)).map((connector) => (
                            <CommandItem
                              key={connector.id}
                              value={connector.name}
                              onSelect={() => handleAddMcpConnectionToAgent(connector.id)}
                              className="flex items-center gap-3 py-2"
                            >
                              <div className={`size-8 ${connector.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <connector.icon className="size-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">{connector.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{connector.description}</div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Selected Connections List - Fixed Height Container */}
              <div className="h-[280px] overflow-y-auto">
                {selectedMcpConnectionsForAgent.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-border rounded-lg bg-muted/20">
                    <div className="size-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                      <Link className="size-6 text-muted-foreground" />
                    </div>
                    <h5 className="font-medium mb-1">No connections selected</h5>
                    <p className="text-sm text-muted-foreground">
                      Select connections from existing MCP connectors
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedMcpConnectionsForAgent.map((connectorId) => {
                      const connector = connectors.find(c => c.id === connectorId);
                      if (!connector) return null;
                      
                      return (
                        <Card key={connectorId} className="p-3">
                          <div className="flex items-center gap-3">
                            <div className={`size-10 ${connector.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <connector.icon className="size-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{connector.name}</div>
                              <div className="text-sm text-muted-foreground truncate">{connector.description}</div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMcpConnectionFromAgent(connectorId)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive flex-shrink-0"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => {
              setAddMcpModalOpen(false);
              setSelectedMcpConnectionsForAgent([]);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddAgentMcpConnection}
              disabled={selectedMcpConnectionsForAgent.length === 0 || isAddingMcpConnection}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              {isAddingMcpConnection && <Loader2 className="size-4 animate-spin" />}
              {isAddingMcpConnection ? 'Adding...' : `Add ${selectedMcpConnectionsForAgent.length > 0 ? `${selectedMcpConnectionsForAgent.length} ` : ''}Connection${selectedMcpConnectionsForAgent.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Connection Confirmation */}
      <AlertDialog open={deleteConfirmation.open} onOpenChange={(open) => setDeleteConfirmation({ ...deleteConfirmation, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete MCP Connection?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the connection and all its configured tools. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMcpConnection}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Connection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create New MCP Modal */}
      <Dialog open={createMcpModalOpen} onOpenChange={setCreateMcpModalOpen}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>{editingMcpId ? 'Edit MCP' : 'Create New MCP'}</DialogTitle>
            <DialogDescription>
              {editingMcpId ? 'Update your custom MCP connection settings' : 'Configure a new custom Model Context Protocol connection'}
            </DialogDescription>
            <button
              onClick={() => {
                setCreateMcpModalOpen(false);
                setEditingMcpId(null);
              }}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="mcp-name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="mcp-name"
                placeholder="Sitecore XMC"
                value={createMcpFormData.name}
                onChange={(e) => {
                  setCreateMcpFormData({ ...createMcpFormData, name: e.target.value });
                  if (createMcpFormErrors.name) {
                    setCreateMcpFormErrors({ ...createMcpFormErrors, name: '' });
                  }
                }}
                className={createMcpFormErrors.name ? 'border-destructive' : ''}
              />
              {createMcpFormErrors.name && (
                <p className="text-sm text-destructive">{createMcpFormErrors.name}</p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="mcp-description">Description</Label>
              <Textarea
                id="mcp-description"
                placeholder="Handles Sitecore content exchange and context data operations."
                value={createMcpFormData.description}
                onChange={(e) => setCreateMcpFormData({ ...createMcpFormData, description: e.target.value })}
                className="min-h-[80px] resize-none"
                rows={3}
              />
            </div>

            {/* Remote URL Field */}
            <div className="space-y-2">
              <Label htmlFor="mcp-url">
                Remote URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="mcp-url"
                type="url"
                placeholder="https://api.sitecorexmc.com/mcp"
                value={createMcpFormData.remoteUrl}
                onChange={(e) => {
                  setCreateMcpFormData({ ...createMcpFormData, remoteUrl: e.target.value });
                  if (createMcpFormErrors.remoteUrl) {
                    setCreateMcpFormErrors({ ...createMcpFormErrors, remoteUrl: '' });
                  }
                }}
                className={createMcpFormErrors.remoteUrl ? 'border-destructive' : ''}
              />
              {createMcpFormErrors.remoteUrl && (
                <p className="text-sm text-destructive">{createMcpFormErrors.remoteUrl}</p>
              )}
            </div>

            {/* Headers Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Headers</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCreateMcpFormData({
                      ...createMcpFormData,
                      headers: [...createMcpFormData.headers, { key: '', value: '' }]
                    });
                  }}
                  className="gap-2 h-8"
                >
                  <Plus className="size-3" />
                  Add Header
                </Button>
              </div>
              
              <div className="space-y-2">
                {createMcpFormData.headers.map((header, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Key"
                      value={header.key}
                      onChange={(e) => {
                        const updatedHeaders = [...createMcpFormData.headers];
                        updatedHeaders[index] = { ...updatedHeaders[index], key: e.target.value };
                        setCreateMcpFormData({ ...createMcpFormData, headers: updatedHeaders });
                      }}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value"
                      value={header.value}
                      onChange={(e) => {
                        const updatedHeaders = [...createMcpFormData.headers];
                        updatedHeaders[index] = { ...updatedHeaders[index], value: e.target.value };
                        setCreateMcpFormData({ ...createMcpFormData, headers: updatedHeaders });
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={createMcpFormData.headers.length === 1}
                      onClick={() => {
                        if (createMcpFormData.headers.length > 1) {
                          const updatedHeaders = createMcpFormData.headers.filter((_, i) => i !== index);
                          setCreateMcpFormData({ ...createMcpFormData, headers: updatedHeaders });
                        }
                      }}
                      className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t pt-4">
            {/* Left: Test Connection */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleTestNewMcpConnection}
                disabled={createMcpTestStatus === 'testing'}
                className="gap-2"
              >
                {createMcpTestStatus === 'testing' && <Loader2 className="size-4 animate-spin" />}
                Test Connection
              </Button>
              
              {createMcpTestStatus === 'success' && (
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  <Check className="size-3 mr-1" />
                  Connection successful
                </Badge>
              )}
              
              {createMcpTestStatus === 'error' && (
                <span className="text-sm text-destructive">{createMcpTestMessage}</span>
              )}
            </div>

            {/* Right: Cancel and Save */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCreateMcpModalOpen(false);
                  setEditingMcpId(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveNewMcp}
                disabled={isSavingNewMcp || (!editingMcpId && createMcpTestStatus !== 'success') || (editingMcpId && !hasMcpFormChanges())}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                {isSavingNewMcp && <Loader2 className="size-4 animate-spin" />}
                {isSavingNewMcp ? 'Saving...' : (editingMcpId ? 'Save Changes' : 'Create MCP')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Connector Confirmation */}
      <AlertDialog 
        open={deleteConnectorConfirmation.open} 
        onOpenChange={(open) => setDeleteConnectorConfirmation({ ...deleteConnectorConfirmation, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Custom MCP Server?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConnectorConfirmation.connectorName}"? This will remove the MCP server and all its data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConnector}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Server
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
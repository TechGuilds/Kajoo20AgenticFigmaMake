import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MentionInput } from './MentionInput';
import { AIInboxCard } from '@/components/modules/ai/AIInboxCard';
import { type InboxItem } from '@/components/modules/ai/AIInbox';
import { 
  Send, 
  Bot, 
  User, 
  Brain, 
  Sparkles, 
  FileText, 
  Code, 
  Database, 
  Globe, 
  BarChart3, 
  Settings,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Zap,
  TrendingUp,
  Target,
  Calendar,
  PlusCircle,
  MoreHorizontal,
  Paperclip,
  X,
  MessageSquare,
  ArrowUp,
  Hash,
  Plus,
  Pause,
  Search,
  Activity,
  Users,
  Download,
  Copy,
  Pin,
  RefreshCw,
  PlayCircle,
  PauseCircle,
  StopCircle,
  AlertCircle,
  CheckCircle,
  Eye,
  ExternalLink,
  Filter,
  FileCode,
  FileImage,
  FileCog,
  Cpu,
  Network,
  Shield,
  TestTube,
  Rocket,
  GitBranch,
  Terminal,
  Monitor,
  Server,
  CloudUpload
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  context?: {
    action?: string;
    data?: any;
  };
  attachments?: {
    type: 'progress' | 'chart' | 'list' | 'recommendation' | 'artifact' | 'agent-status' | 'inbox-item';
    data: any;
  }[];
  pinned?: boolean;
  agentId?: string;
}

interface Agent {
  id: string;
  name: string;
  type: 'analysis' | 'migration' | 'testing' | 'deployment' | 'monitoring';
  status: 'idle' | 'active' | 'busy' | 'error' | 'offline';
  progress: number;
  currentTask?: string;
  lastActivity: Date;
  health: 'excellent' | 'good' | 'warning' | 'critical';
  capabilities: string[];
}

interface Artifact {
  id: string;
  name: string;
  type: 'code' | 'document' | 'config' | 'report' | 'image';
  category: 'migration' | 'analysis' | 'testing' | 'deployment';
  size: number;
  createdAt: Date;
  createdBy: string;
  description: string;
  url: string;
  tags: string[];
}

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  prompt: string;
  category: 'audit' | 'agents' | 'artifacts' | 'execution' | 'planning' | 'help';
  description: string;
}

interface AIChatPanelProps {
  selectedProject?: any;
  taskPrompt?: string;
  onPromptProcessed?: () => void;
}

const MOCK_AGENTS: Agent[] = [
  {
    id: 'analyzer-01',
    name: 'Code Analysis Agent',
    type: 'analysis',
    status: 'active',
    progress: 85,
    currentTask: 'Analyzing deprecated APIs in legacy components',
    lastActivity: new Date(Date.now() - 2 * 60 * 1000),
    health: 'excellent',
    capabilities: ['Code Analysis', 'Dependency Mapping', 'Security Scanning']
  },
  {
    id: 'migrator-01',
    name: 'Component Migration Agent',
    type: 'migration',
    status: 'busy',
    progress: 45,
    currentTask: 'Converting MVC views to React components',
    lastActivity: new Date(Date.now() - 30 * 1000),
    health: 'good',
    capabilities: ['Component Migration', 'Template Conversion', 'Data Binding']
  },
  {
    id: 'tester-01',
    name: 'Quality Assurance Agent',
    type: 'testing',
    status: 'idle',
    progress: 0,
    lastActivity: new Date(Date.now() - 15 * 60 * 1000),
    health: 'good',
    capabilities: ['Automated Testing', 'Accessibility Validation', 'Performance Testing']
  },
  {
    id: 'deployer-01',
    name: 'Deployment Agent',
    type: 'deployment',
    status: 'offline',
    progress: 0,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    health: 'warning',
    capabilities: ['CI/CD Pipeline', 'Environment Management', 'Monitoring Setup']
  }
];

const MOCK_ARTIFACTS: Artifact[] = [
  {
    id: 'art-001',
    name: 'Migration Analysis Report.pdf',
    type: 'report',
    category: 'analysis',
    size: 2456789,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    createdBy: 'Code Analysis Agent',
    description: 'Comprehensive analysis of legacy codebase with migration recommendations',
    url: '#',
    tags: ['analysis', 'migration', 'recommendations']
  },
  {
    id: 'art-002',
    name: 'ComponentMigration.tsx',
    type: 'code',
    category: 'migration',
    size: 45678,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    createdBy: 'Component Migration Agent',
    description: 'Migrated HeroBanner component from MVC to React',
    url: '#',
    tags: ['component', 'react', 'migration']
  },
  {
    id: 'art-003',
    name: 'deployment-config.yml',
    type: 'config',
    category: 'deployment',
    size: 12345,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdBy: 'Deployment Agent',
    description: 'Docker configuration for headless environment',
    url: '#',
    tags: ['docker', 'deployment', 'configuration']
  },
  {
    id: 'art-004',
    name: 'Test Results Dashboard.html',
    type: 'report',
    category: 'testing',
    size: 678901,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    createdBy: 'Quality Assurance Agent',
    description: 'Interactive dashboard showing test coverage and results',
    url: '#',
    tags: ['testing', 'coverage', 'dashboard']
  }
];

const QUICK_ACTIONS: QuickAction[] = [
  // Audit Actions
  {
    id: 'audit-summary',
    label: 'Audit Summary',
    icon: FileText,
    prompt: 'Give me a comprehensive summary of the current audit results and key findings',
    category: 'audit',
    description: 'Get an overview of all audit findings and recommendations'
  },
  {
    id: 'critical-issues',
    label: 'Critical Issues',
    icon: AlertTriangle,
    prompt: 'What are the most critical issues I need to address for this migration?',
    category: 'audit',
    description: 'Identify high-priority issues requiring immediate attention'
  },
  {
    id: 'dependency-analysis',
    label: 'Dependencies',
    icon: Network,
    prompt: 'Analyze the dependency tree and identify potential conflicts or outdated packages',
    category: 'audit',
    description: 'Review project dependencies and compatibility issues'
  },
  {
    id: 'security-scan',
    label: 'Security Scan',
    icon: Shield,
    prompt: 'Perform a security analysis and identify vulnerabilities in the codebase',
    category: 'audit',
    description: 'Scan for security vulnerabilities and compliance issues'
  },
  
  // Agent Actions
  {
    id: 'agent-status',
    label: 'Agent Status',
    icon: Activity,
    prompt: 'Show me the current status and health of all migration agents',
    category: 'agents',
    description: 'Monitor all agent activities and performance metrics'
  },
  {
    id: 'assign-agent',
    label: 'Assign Task',
    icon: Users,
    prompt: 'Help me assign a specific task to the most appropriate agent',
    category: 'agents',
    description: 'Intelligently route tasks to optimal agents'
  },
  {
    id: 'agent-logs',
    label: 'Activity Logs',
    icon: Terminal,
    prompt: 'Show me detailed activity logs from all agents',
    category: 'agents',
    description: 'Review detailed logs and agent execution history'
  },
  {
    id: 'scale-agents',
    label: 'Scale Resources',
    icon: Server,
    prompt: 'Analyze current workload and recommend agent scaling options',
    category: 'agents',
    description: 'Optimize agent allocation and resource usage'
  },
  
  // Artifact Actions
  {
    id: 'recent-artifacts',
    label: 'Recent Artifacts',
    icon: FileCode,
    prompt: 'Show me the latest artifacts generated by the migration agents',
    category: 'artifacts',
    description: 'Browse recently created files and reports'
  },
  {
    id: 'artifact-search',
    label: 'Search Artifacts',
    icon: Search,
    prompt: 'Help me find specific artifacts based on type, category, or content',
    category: 'artifacts',
    description: 'Intelligently search through all generated artifacts'
  },
  {
    id: 'generate-report',
    label: 'Generate Report',
    icon: BarChart3,
    prompt: 'Create a comprehensive migration progress report with all artifacts',
    category: 'artifacts',
    description: 'Compile all artifacts into a stakeholder report'
  },
  {
    id: 'artifact-analysis',
    label: 'Analyze Artifacts',
    icon: Brain,
    prompt: 'Analyze the quality and completeness of generated artifacts',
    category: 'artifacts',
    description: 'Review artifact quality and identify gaps'
  },
  
  // Execution Actions
  {
    id: 'next-steps',
    label: 'Next Steps',
    icon: CheckCircle2,
    prompt: 'What should I work on next based on the current progress?',
    category: 'execution',
    description: 'Get prioritized recommendations for next actions'
  },
  {
    id: 'component-migration',
    label: 'Component Help',
    icon: Code,
    prompt: 'Help me understand how to migrate the most complex components',
    category: 'execution',
    description: 'Get guidance on component migration strategies'
  },
  {
    id: 'create-tickets',
    label: 'Create JIRA Tickets',
    icon: Settings,
    prompt: 'Create JIRA tickets for the high-priority migration tasks',
    category: 'execution',
    description: 'Generate structured tickets for project management'
  },
  {
    id: 'deploy-preview',
    label: 'Deploy Preview',
    icon: Rocket,
    prompt: 'Help me deploy a preview environment with the current migration progress',
    category: 'execution',
    description: 'Set up staging environment for testing'
  },
  
  // Planning Actions
  {
    id: 'progress-report',
    label: 'Progress Report',
    icon: TrendingUp,
    prompt: 'Generate a comprehensive progress report for stakeholders',
    category: 'planning',
    description: 'Create detailed progress summary with metrics'
  },
  {
    id: 'timeline-optimization',
    label: 'Optimize Timeline',
    icon: Calendar,
    prompt: 'Analyze current progress and optimize the project timeline',
    category: 'planning',
    description: 'Adjust timelines based on current velocity'
  },
  {
    id: 'resource-planning',
    label: 'Resource Planning',
    icon: Users,
    prompt: 'Analyze resource allocation and suggest optimizations',
    category: 'planning',
    description: 'Optimize team and resource allocation'
  },
  
  // Help Actions
  {
    id: 'best-practices',
    label: 'Best Practices',
    icon: Lightbulb,
    prompt: 'What are the best practices for Sitecore to headless migration?',
    category: 'help',
    description: 'Learn migration best practices and guidelines'
  },
  {
    id: 'troubleshooting',
    label: 'Troubleshooting',
    icon: AlertCircle,
    prompt: 'Help me troubleshoot common migration issues and errors',
    category: 'help',
    description: 'Get help with common problems and solutions'
  },
  {
    id: 'documentation',
    label: 'Documentation',
    icon: FileText,
    prompt: 'Find relevant documentation and guides for my current task',
    category: 'help',
    description: 'Access contextual documentation and guides'
  }
];

const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    type: 'ai',
    content: 'Hello! I\'m your AI Migration Assistant. I can help you with audit analysis, agent orchestration, artifact management, and execution guidance. What would you like to work on today?\n\n💡 **Quick tip:** Type `/` to see available commands or use the quick action buttons below!',
    timestamp: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    id: '2',
    type: 'system',
    content: 'Code Analysis Agent has completed scanning 127 files. Found 14 deprecated APIs and 8 security vulnerabilities.',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    agentId: 'analyzer-01',
    attachments: [{
      type: 'agent-status',
      data: {
        agentId: 'analyzer-01',
        action: 'completed',
        details: 'Code analysis completed with findings'
      }
    }]
  },
  {
    id: '3',
    type: 'user',
    content: 'What are the main issues found in the code audit?',
    timestamp: new Date(Date.now() - 7 * 60 * 1000)
  },
  {
    id: '4',
    type: 'ai',
    content: 'Based on the code audit results, I\'ve identified several key issues:',
    timestamp: new Date(Date.now() - 6 * 60 * 1000),
    context: {
      action: 'code_audit_analysis'
    },
    attachments: [{
      type: 'list',
      data: {
        title: 'Critical Issues Found',
        items: [
          { label: 'Deprecated Sitecore APIs', count: 14, severity: 'high', icon: 'AlertTriangle' },
          { label: 'Legacy NuGet packages', count: 8, severity: 'medium', icon: 'Settings' },
          { label: 'Components needing rework', count: 5, severity: 'high', icon: 'Code' }
        ]
      }
    }, {
      type: 'progress',
      data: {
        title: 'Headless Readiness',
        value: 67,
        target: 90,
        color: 'yellow'
      }
    }]
  },
  {
    id: '5',
    type: 'system',
    content: 'Component Migration Agent has successfully converted HeroBanner.cshtml to React component. Artifact saved: ComponentMigration.tsx',
    timestamp: new Date(Date.now() - 1 * 60 * 1000),
    agentId: 'migrator-01',
    attachments: [{
      type: 'artifact',
      data: {
        id: 'art-002',
        name: 'ComponentMigration.tsx',
        type: 'code',
        description: 'Migrated HeroBanner component from MVC to React'
      }
    }]
  },
  {
    id: '6',
    type: 'ai',
    content: 'I\'ve analyzed your project and identified an opportunity to improve the migration process. Here\'s a suggestion that requires your approval:',
    timestamp: new Date(Date.now() - 30 * 1000),
    attachments: [{
      type: 'inbox-item',
      data: {
        id: 'inbox-demo-1',
        title: 'Create Migration Validation Checklist',
        summary: 'Generate comprehensive checklist for validating component migrations',
        details: 'Based on the current migration progress, I recommend creating a detailed validation checklist to ensure quality and consistency across all migrated components. This will help catch issues early and maintain standards.',
        type: 'approval',
        status: 'pending',
        priority: 'high',
        createdAt: new Date(Date.now() - 30 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 1000).toISOString(),
        suggestedBy: 'ai-agent',
        relatedTaskId: 'task-001',
        relatedTaskName: 'Component Library Migration',
        estimatedImpact: 'High - Will improve migration quality and reduce rework',
        aiReasoning: 'I analyzed 47 migrated components and found 12 inconsistencies in naming conventions and 8 missing accessibility attributes. A validation checklist would prevent these issues.'
      }
    }]
  }
];

// Progress Attachment Component
interface ProgressAttachmentProps {
  data: {
    title: string;
    value: number;
    target?: number;
    color?: 'green' | 'yellow' | 'red';
  };
}

function ProgressAttachment({ data }: ProgressAttachmentProps) {
  const getColor = () => {
    switch (data.color) {
      case 'green': return 'text-success';
      case 'yellow': return 'text-warning';
      case 'red': return 'text-destructive';
      default: return 'text-primary';
    }
  };

  return (
    <div className="bg-background border" style={{ marginTop: 'var(--spacing-3)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius)' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-2)' }}>
        <span className="font-medium">{data.title}</span>
        <span className={`font-bold ${getColor()}`}>{data.value}%</span>
      </div>
      <Progress value={data.value} className="h-2" />
      {data.target && (
        <div className="text-muted-foreground" style={{ marginTop: 'var(--spacing-1)' }}>
          Target: {data.target}%
        </div>
      )}
    </div>
  );
}

// List Attachment Component
interface ListAttachmentProps {
  data: {
    title: string;
    items: Array<{
      label: string;
      count: number;
      severity: 'high' | 'medium' | 'low';
      icon: string;
    }>;
  };
}

function ListAttachment({ data }: ListAttachmentProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-destructive bg-destructive/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-primary bg-primary/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-background border" style={{ marginTop: 'var(--spacing-3)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius)' }}>
      <h4 className="font-medium" style={{ marginBottom: 'var(--spacing-2)' }}>{data.title}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        {data.items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
              {item.icon === 'AlertTriangle' && <AlertTriangle className="size-3 text-destructive" />}
              {item.icon === 'Settings' && <Settings className="size-3 text-warning" />}
              {item.icon === 'Code' && <Code className="size-3 text-primary" />}
              <span>{item.label}</span>
            </div>
            <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
              <span className="font-medium">{item.count}</span>
              <Badge className={getSeverityColor(item.severity)}>
                {item.severity}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Artifact Attachment Component
interface ArtifactAttachmentProps {
  data: {
    id: string;
    name: string;
    type: string;
    description: string;
  };
}

function ArtifactAttachment({ data }: ArtifactAttachmentProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'code': return <FileCode className="size-4 text-primary" />;
      case 'document': return <FileText className="size-4 text-success" />;
      case 'config': return <FileCog className="size-4 text-warning" />;
      case 'report': return <BarChart3 className="size-4 text-primary" />;
      case 'image': return <FileImage className="size-4 text-destructive" />;
      default: return <FileText className="size-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="bg-background border" style={{ marginTop: 'var(--spacing-3)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius)' }}>
      <div className="flex items-start" style={{ gap: 'var(--spacing-3)' }}>
        {getTypeIcon(data.type)}
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-1" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
            <span className="font-medium truncate">{data.name}</span>
            <Badge variant="outline">{data.type}</Badge>
          </div>
          <p className="text-muted-foreground" style={{ marginBottom: 'var(--spacing-2)' }}>{data.description}</p>
          <div className="flex" style={{ gap: 'var(--spacing-1)' }}>
            <Button size="sm" variant="outline" style={{ height: 'var(--spacing-6)' }}>
              <Download className="size-3" style={{ marginRight: 'var(--spacing-1)' }} />
              Download
            </Button>
            <Button size="sm" variant="outline" style={{ height: 'var(--spacing-6)' }}>
              <Eye className="size-3" style={{ marginRight: 'var(--spacing-1)' }} />
              Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Agent Status Attachment Component
interface AgentStatusAttachmentProps {
  data: {
    agentId: string;
    action: string;
    details: string;
  };
}

function AgentStatusAttachment({ data }: AgentStatusAttachmentProps) {
  const agent = MOCK_AGENTS.find(a => a.id === data.agentId);
  if (!agent) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'busy': return 'text-primary bg-primary/10';
      case 'idle': return 'text-muted-foreground bg-muted';
      case 'error': return 'text-destructive bg-destructive/10';
      case 'offline': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-background border" style={{ marginTop: 'var(--spacing-3)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius)' }}>
      <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
        <Bot className="size-4 text-primary" />
        <span className="font-medium">{agent.name}</span>
        <Badge className={getStatusColor(agent.status)}>
          {agent.status}
        </Badge>
      </div>
      <p className="text-muted-foreground">{data.details}</p>
    </div>
  );
}

// Inbox Item Attachment Component
interface InboxItemAttachmentProps {
  data: InboxItem;
}

function InboxItemAttachment({ data }: InboxItemAttachmentProps) {
  const handleApprove = (item: InboxItem) => {
    console.log('Approved inbox item:', item);
    // Handle approve action
  };

  const handleReject = (item: InboxItem, note?: string) => {
    console.log('Rejected inbox item:', item, 'Note:', note);
    // Handle reject action
  };

  const handleReply = (item: InboxItem, reply: string) => {
    console.log('Reply to inbox item:', item, 'Reply:', reply);
    // Handle reply action
  };

  const handleNavigateToTask = (taskId: string, taskName: string) => {
    console.log('Navigate to task:', taskId, taskName);
    // Handle task navigation
  };

  return (
    <div className="max-w-2xl" style={{ marginTop: 'var(--spacing-3)' }}>
      <AIInboxCard
        item={data}
        onApprove={handleApprove}
        onReject={handleReject}
        onReply={handleReply}
        onNavigateToTask={handleNavigateToTask}
      />
    </div>
  );
}

export function AIChatPanel({ selectedProject, taskPrompt, onPromptProcessed }: AIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showSlashCommands, setShowSlashCommands] = useState(false);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isTaskPromptLoaded, setIsTaskPromptLoaded] = useState(false);

  const [agents] = useState<Agent[]>(MOCK_AGENTS);
  const [artifacts] = useState<Artifact[]>(MOCK_ARTIFACTS);
  const [pinnedMessages, setPinnedMessages] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    // Show slash commands when input starts with "/"
    if (inputValue.startsWith('/') && inputValue.length > 0) {
      setShowSlashCommands(true);
    } else {
      setShowSlashCommands(false);
      setSelectedCommandIndex(0);
    }
  }, [inputValue]);

  useEffect(() => {
    // Handle task prompt injection
    if (taskPrompt && !isTaskPromptLoaded) {
      setInputValue(taskPrompt);
      setIsTaskPromptLoaded(true);
      if (onPromptProcessed) {
        onPromptProcessed();
      }
    }
  }, [taskPrompt, isTaskPromptLoaded, onPromptProcessed]);

  useEffect(() => {
    // Reset task prompt state when input is cleared or message is sent
    if (!inputValue.trim() && isTaskPromptLoaded) {
      setIsTaskPromptLoaded(false);
    }
  }, [inputValue, isTaskPromptLoaded]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() && attachedFiles.length === 0) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim() || `Uploaded ${attachedFiles.length} file(s)`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachedFiles([]);
    setIsTaskPromptLoaded(false);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(content),
        timestamp: new Date(),
        attachments: generateAttachments(content)
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getFilteredCommands = () => {
    if (!inputValue.startsWith('/')) return [];
    const query = inputValue.slice(1).toLowerCase();
    return QUICK_ACTIONS.filter(action => 
      action.label.toLowerCase().includes(query) ||
      action.category.toLowerCase().includes(query) ||
      action.description.toLowerCase().includes(query)
    );
  };

  const handleCommandSelect = (command: QuickAction) => {
    setInputValue('');
    setShowSlashCommands(false);
    handleSendMessage(command.prompt);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileAttach = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSlashCommands) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedCommandIndex(prev => 
          prev < getFilteredCommands().length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedCommandIndex(prev => 
          prev > 0 ? prev - 1 : getFilteredCommands().length - 1
        );
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        const commands = getFilteredCommands();
        if (commands[selectedCommandIndex]) {
          handleCommandSelect(commands[selectedCommandIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSlashCommands(false);
        break;
    }
  };

  const generateAttachments = (userInput: string) => {
    const input = userInput.toLowerCase();
    const attachments = [];

    if (input.includes('audit') || input.includes('summary')) {
      attachments.push({
        type: 'progress' as const,
        data: {
          title: 'Migration Readiness',
          value: 78,
          target: 95,
          color: 'yellow' as const
        }
      });
    }

    if (input.includes('issue') || input.includes('critical')) {
      attachments.push({
        type: 'list' as const,
        data: {
          title: 'Priority Issues',
          items: [
            { label: 'Deprecated APIs', count: 14, severity: 'high' as const, icon: 'AlertTriangle' },
            { label: 'Accessibility Issues', count: 67, severity: 'high' as const, icon: 'BarChart3' },
            { label: 'Legacy Dependencies', count: 8, severity: 'medium' as const, icon: 'Settings' }
          ]
        }
      });
    }

    if (input.includes('agent') || input.includes('status')) {
      attachments.push({
        type: 'agent-status' as const,
        data: {
          agentId: 'analyzer-01',
          action: 'status_update',
          details: 'All agents are operational and processing tasks'
        }
      });
    }

    if (input.includes('artifact') || input.includes('recent')) {
      attachments.push({
        type: 'artifact' as const,
        data: {
          id: 'art-001',
          name: 'Migration Analysis Report.pdf',
          type: 'report',
          description: 'Comprehensive analysis with migration recommendations'
        }
      });
    }

    return attachments.length > 0 ? attachments : undefined;
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('audit') || input.includes('results')) {
      return 'Here\'s your comprehensive audit overview:\n\n**Migration Readiness: 78%** 🎯\n\nThe analysis shows strong foundational work with some areas needing attention. Your codebase has good architectural patterns, but we need to address legacy dependencies and accessibility compliance.\n\n**Top Priorities:**\n• Upgrade deprecated Sitecore APIs (14 instances)\n• Fix accessibility issues (67 items)\n• Update legacy NuGet packages (8 packages)\n\nWould you like me to create JIRA tickets for these priority items?';
    }
    
    if (input.includes('agent') || input.includes('status')) {
      return '**Agent Status Overview** 🤖\n\n✅ **Code Analysis Agent** - Active (85% complete)\n🔄 **Component Migration Agent** - Busy (45% complete)\n⏸️ **Quality Assurance Agent** - Idle\n⚠️ **Deployment Agent** - Offline (needs attention)\n\nAll critical agents are operational. The deployment agent went offline 2 hours ago - would you like me to restart it?';
    }
    
    if (input.includes('next') || input.includes('recommend')) {
      return '**Recommended Next Steps** 📋\n\nBased on current progress, here\'s what I suggest:\n\n1. **Address Critical Issues** (Priority: High)\n   - Fix the 14 deprecated API calls\n   - Update security vulnerabilities\n\n2. **Component Migration** (Priority: Medium)\n   - Continue React component conversion\n   - Focus on complex interactive components\n\n3. **Testing Setup** (Priority: Medium)\n   - Activate QA agent for automated testing\n   - Set up accessibility validation\n\nShall I create detailed execution plans for any of these?';
    }
    
    if (input.includes('help') || input.includes('how')) {
      return 'I\'m here to help! 💡\n\n**What I can assist with:**\n• **Code Analysis** - Review and audit your codebase\n• **Agent Management** - Monitor and control migration agents\n• **Task Planning** - Break down complex migration tasks\n• **Artifact Generation** - Create reports, configs, and documentation\n• **JIRA Integration** - Generate tickets and track progress\n\n**Pro tip:** Use `/` commands for quick actions, or just tell me what you\'d like to work on!';
    }
    
    return 'I understand you\'d like assistance with your migration project. Could you provide more details about what specific aspect you\'d like help with? I can assist with code analysis, agent management, artifact generation, or planning next steps.';
  };

  const renderAttachment = (attachment: any, messageId: string) => {
    switch (attachment.type) {
      case 'progress':
        return <ProgressAttachment key={`${messageId}-progress`} data={attachment.data} />;
      case 'list':
        return <ListAttachment key={`${messageId}-list`} data={attachment.data} />;
      case 'artifact':
        return <ArtifactAttachment key={`${messageId}-artifact`} data={attachment.data} />;
      case 'agent-status':
        return <AgentStatusAttachment key={`${messageId}-agent`} data={attachment.data} />;
      case 'inbox-item':
        return <InboxItemAttachment key={`${messageId}-inbox`} data={attachment.data} />;
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-card border-l border-l-border shadow-sm">
        {/* Messages */}
        <div className="flex-1 h-0">
          <div 
            ref={messagesContainerRef} 
            className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
            style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}
          >
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'flex-row-reverse' : ''}`} style={{ gap: 'var(--spacing-3)' }}>
                <div 
                  className={`rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : message.type === 'system'
                      ? 'bg-warning/20 text-warning'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  style={{ width: 'var(--spacing-8)', height: 'var(--spacing-8)' }}
                >
                  {message.type === 'user' ? (
                    <User className="size-4" />
                  ) : message.type === 'system' ? (
                    <Settings className="size-4" />
                  ) : (
                    <Bot className="size-4" />
                  )}
                </div>
                <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <div 
                    className={`inline-block max-w-sm ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : message.type === 'system'
                        ? 'bg-warning/10 border border-warning/30'
                        : 'bg-muted'
                    }`}
                    style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--radius)' }}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {/* Render attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className={message.type === 'user' ? 'text-left' : ''} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                      {message.attachments.map((attachment, index) => 
                        renderAttachment(attachment, `${message.id}-${index}`)
                      )}
                    </div>
                  )}
                  
                  <div className="text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex" style={{ gap: 'var(--spacing-3)' }}>
                <div className="rounded-full bg-muted flex items-center justify-center" style={{ width: 'var(--spacing-8)', height: 'var(--spacing-8)' }}>
                  <Bot className="size-4 text-muted-foreground" />
                </div>
                <div className="bg-muted" style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--radius)' }}>
                  <div className="flex space-x-1">
                    <div className="size-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="size-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="size-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t shrink-0 relative bg-card">
          {/* Enhanced Slash Commands Dropdown */}
          {showSlashCommands && (
            <div className="absolute bottom-full bg-popover border shadow-lg z-50 max-h-80 overflow-y-auto" style={{ left: 'var(--spacing-4)', right: 'var(--spacing-4)', marginBottom: 'var(--spacing-2)', borderRadius: 'calc(var(--radius) * 1.5)' }}>
              <div style={{ padding: 'var(--spacing-3)' }}>
                <div className="text-muted-foreground flex items-center" style={{ paddingLeft: 'var(--spacing-2)', paddingRight: 'var(--spacing-2)', paddingTop: 'var(--spacing-1)', paddingBottom: 'var(--spacing-1)', marginBottom: 'var(--spacing-3)', gap: 'var(--spacing-2)' }}>
                  <Hash className="size-3" />
                  <span>Advanced Commands</span>
                  {inputValue.length > 1 && (
                    <Badge variant="outline">
                      {getFilteredCommands().length} results
                    </Badge>
                  )}
                </div>
                {getFilteredCommands().length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                    {getFilteredCommands().slice(0, 8).map((command, index) => {
                      const Icon = command.icon;
                      return (
                        <button
                          key={command.id}
                          onClick={() => handleCommandSelect(command)}
                          className={`w-full flex items-start text-left transition-colors ${
                            index === selectedCommandIndex
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-accent/50'
                          }`}
                          style={{ padding: 'var(--spacing-3)', gap: 'var(--spacing-3)', borderRadius: 'var(--radius)' }}
                        >
                          <Icon className="size-4 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{command.label}</div>
                            <div className="text-muted-foreground truncate" style={{ marginBottom: 'var(--spacing-1)' }}>
                              {command.description}
                            </div>
                            <div className="text-muted-foreground opacity-75">
                              {command.prompt.slice(0, 80)}...
                            </div>
                          </div>
                          <Badge variant="outline" className="capitalize" style={{ marginTop: 'var(--spacing-1)' }}>
                            {command.category}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground" style={{ padding: 'var(--spacing-4)' }}>
                    No commands found for "{inputValue.slice(1)}"
                  </div>
                )}
                <div className="text-muted-foreground border-t bg-muted/30" style={{ marginTop: 'var(--spacing-3)', padding: 'var(--spacing-2)', borderRadius: 'var(--radius-sm)' }}>
                  Use ↑↓ to navigate, Enter to select, Esc to close
                </div>
              </div>
            </div>
          )}

          {/* Task Context Banner */}
          {isTaskPromptLoaded && (
            <div className="bg-primary/10 border border-primary/30" style={{ marginLeft: 'var(--spacing-4)', marginRight: 'var(--spacing-4)', marginTop: 'var(--spacing-4)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius)' }}>
              <div className="flex items-center text-primary" style={{ gap: 'var(--spacing-2)' }}>
                <Target className="size-4" />
                <span>Task context loaded - ready to execute</span>
              </div>
            </div>
          )}

          {/* Attached Files */}
          {attachedFiles.length > 0 && (
            <div className="bg-muted/30 border" style={{ marginLeft: 'var(--spacing-4)', marginRight: 'var(--spacing-4)', marginTop: 'var(--spacing-4)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius)' }}>
              <div className="text-muted-foreground" style={{ marginBottom: 'var(--spacing-2)' }}>
                {attachedFiles.length} file(s) attached
              </div>
              <div className="flex flex-wrap" style={{ gap: 'var(--spacing-2)' }}>
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center bg-background border" style={{ padding: 'var(--spacing-1) var(--spacing-2)', gap: 'var(--spacing-2)', borderRadius: 'var(--radius-sm)' }}>
                    <FileText className="size-3" />
                    <span className="max-w-24 truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0"
                      onClick={() => removeAttachedFile(index)}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File attachment input (hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt,.csv,.json,.xml,.md,.js,.ts,.tsx,.jsx,.css,.scss"
          />

          {/* Main Chat Input Container */}
          <div style={{ padding: 'var(--spacing-4)' }}>
            <div className="bg-background border border-border overflow-hidden transition-colors" style={{ borderRadius: 'var(--radius)' }}>
              {/* Large Text Input Area */}
              <div style={{ padding: 'var(--spacing-4)' }}>
                <MentionInput
                  value={inputValue}
                  onChange={setInputValue}
                  onSubmit={handleSendMessage}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask for changes"
                  disabled={isTyping}
                  className="min-h-24 max-h-48 resize-none border-0 bg-transparent shadow-none focus:ring-0 focus:outline-none focus:border-0 focus-visible:ring-0 focus-visible:outline-none placeholder:text-muted-foreground/60 leading-relaxed p-0"
                />
              </div>

              {/* Bottom Toolbar */}
              <div className="bg-white" style={{ paddingLeft: 'var(--spacing-4)', paddingRight: 'var(--spacing-4)', paddingTop: 'var(--spacing-3)', paddingBottom: 'var(--spacing-3)' }}>
                <div className="flex items-center justify-end">
                  {/* Send Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        onClick={() => {
                          if (!showSlashCommands && inputValue.trim()) {
                            handleSendMessage(inputValue);
                          }
                        }}
                        disabled={(!inputValue.trim() && attachedFiles.length === 0) || isTyping}
                        size="sm"
                        className={`rounded-full transition-all duration-200 ${
                          inputValue.trim() || attachedFiles.length > 0
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                        style={{ height: 'var(--spacing-8)', width: 'var(--spacing-8)', padding: 0 }}
                      >
                        {isTyping ? (
                          <div className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ArrowUp className="size-3" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Send message
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
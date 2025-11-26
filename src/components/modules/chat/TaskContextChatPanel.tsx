import React, { useState, useEffect, useRef } from 'react';
import { ArtifactCards } from '@/components/modules/artifact';
import { AIInbox } from '@/components/modules/chat/AIInbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { 
  Send, 
  Bot, 
  User, 
  Settings,
  Loader2,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Code,
  FileText,
  Zap,
  Search,
  Brain,
  Target,
  GitBranch,
  Database
} from 'lucide-react';
import type { Task, RouteContext, ChatThread, AiLog, Artifact } from '~/types';
import { PROJECT_ARTIFACTS } from '@/constants/artifacts';

interface TaskContextChatPanelProps {
  context: RouteContext;
  task?: Task;
  onContextChange: (context: RouteContext) => void;
  className?: string;
  taskPrompt?: string;
  onPromptProcessed?: () => void;
  selectedArtifact?: Artifact | null;
  onArtifactSelect?: (artifact: Artifact | null) => void;
}

export function TaskContextChatPanel({ 
  context, 
  task, 
  onContextChange, 
  className = '',
  taskPrompt,
  onPromptProcessed,
  selectedArtifact,
  onArtifactSelect
}: TaskContextChatPanelProps) {
  // Mock data for demonstration - in a real app, this would come from API calls
  const mockMessages: AiLog[] = [
    {
      id: '1',
      threadId: 'thread-1',
      at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      role: 'system',
      message: `Task execution context initialized.

Task: ${task?.title || 'Sample Task'}
Project: ${context.projectId}
Status: ${task?.status || 'in-progress'}

I'm ready to assist with task execution, code generation, and guidance.`
    },
    {
      id: '2',
      threadId: 'thread-1',
      at: new Date(Date.now() - 240000).toISOString(), // 4 minutes ago
      role: 'human',
      message: 'Can you help me understand the requirements for this component migration task?'
    },
    {
      id: '3',
      threadId: 'thread-1',
      at: new Date(Date.now() - 180000).toISOString(), // 3 minutes ago
      role: 'agent',
      message: `I'll help you break down the component migration requirements:

**Key Steps:**
1. Analyze existing MVC component structure
2. Identify dependencies and data sources
3. Create headless component architecture
4. Implement React/Next.js components
5. Set up GraphQL queries for content
6. Test component functionality

**Deliverables:**
- Component mapping document
- New React components
- GraphQL queries
- Unit tests

Would you like me to start with analyzing your existing components?`,
      attachments: [
        {
          type: 'link',
          label: 'Component Migration Guide',
          href: '#'
        },
        {
          type: 'json',
          label: 'Component Analysis Template',
          content: '{"componentType": "ViewComponent", "dependencies": [], "props": {}}'
        }
      ]
    },
    {
      id: '4',
      threadId: 'thread-1',
      at: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
      role: 'agent',
      message: '',
      attachments: [
        {
          type: 'agent-delegation',
          agents: [
            {
              id: 'migration-agent',
              name: 'Migration Agent',
              status: 'working',
              statusLabel: 'Working...',
              preview: "I'm connecting to the Sitecore environment to fetch the latest component configurations and dependencies...",
              color: 'var(--primary)',
              icon: 'database',
              messages: [
                "I'm fetching the configuration files.",
                'Analyzing data structure.',
                'Preparing migration checklist.'
              ]
            },
            {
              id: 'sitecore-agent',
              name: 'Sitecore Agent',
              status: 'working',
              statusLabel: 'Working...',
              preview: 'Analyzing component templates, rendering variants, and data source configurations from your Sitecore XP instance. Found 12 hero-related templates with complex field structures.',
              color: 'var(--primary)',
              icon: 'code',
              messages: [
                'Connected to Sitecore XP instance.',
                'Scanning component templates.',
                'Found 12 hero-related templates.',
                'Analyzing field structures and dependencies.'
              ]
            },
            {
              id: 'qa-agent',
              name: 'QA Agent',
              status: 'waiting',
              statusLabel: 'Awaiting Approval',
              preview: "I've detected some potential quality issues in the hero components. Would you like me to create automated test suites for the migrated components?",
              color: 'var(--success)',
              icon: 'check',
              messages: [
                'Waiting for migration completion.',
                'Test suite templates ready.',
                'Will validate accessibility standards.',
                'Will check responsive behavior.'
              ],
              needsApproval: true
            }
          ]
        }
      ]
    }
  ];

  const mockArtifacts: Artifact[] = [
    {
      id: 'artifact-1',
      projectId: context.projectId,
      taskId: context.taskId || 'task-1',
      type: 'code',
      label: 'React Component Template',
      summary: 'Generated React component based on MVC analysis',
      content: `import React from 'react';
import { GraphQLQuery } from '@/lib/graphql';

export function MigratedComponent({ data }) {
  return (
    <div className="component">
      <h2>{data.title}</h2>
      <p>{data.description}</p>
    </div>
  );
}`,
      createdAt: new Date(Date.now() - 120000).toISOString(),
      updatedAt: new Date(Date.now() - 120000).toISOString()
    },
    {
      id: 'artifact-2',
      projectId: context.projectId,
      taskId: context.taskId || 'task-1',
      type: 'sitecore',
      label: 'GraphQL Query Definition',
      summary: 'GraphQL query for component data fetching',
      content: `query GetComponentData($id: ID!) {
  item(path: $id) {
    title: field(name: "Title") { value }
    description: field(name: "Description") { value }
    image: field(name: "Image") {
      value {
        src
        alt
      }
    }
  }
}`,
      createdAt: new Date(Date.now() - 60000).toISOString(),
      updatedAt: new Date(Date.now() - 60000).toISOString()
    }
  ];

  const [messages, setMessages] = useState<AiLog[]>(mockMessages);
  const [artifacts, setArtifacts] = useState<Artifact[]>(mockArtifacts);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [pendingApprovalTransition, setPendingApprovalTransition] = useState<string | null>(null);
  const [thread, setThread] = useState<ChatThread | null>({
    id: 'thread-1',
    projectId: context.projectId,
    taskId: context.taskId,
    type: context.type,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Slash command dropdown state
  const [showCommandDropdown, setShowCommandDropdown] = useState(false);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [commandFilter, setCommandFilter] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Agent mention dropdown state
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(0);
  const [agentFilter, setAgentFilter] = useState('');
  const agentDropdownRef = useRef<HTMLDivElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Slash commands configuration
  const slashCommands = [
    {
      command: '/analyze',
      label: 'Analyze Code',
      description: 'Analyze code structure and dependencies',
      icon: <Search className="size-4" />
    },
    {
      command: '/generate',
      label: 'Generate Code',
      description: 'Generate code templates and components',
      icon: <Code className="size-4" />
    },
    {
      command: '/plan',
      label: 'Create Plan',
      description: 'Create implementation or migration plan',
      icon: <Target className="size-4" />
    },
    {
      command: '/docs',
      label: 'Generate Docs',
      description: 'Generate documentation and guides',
      icon: <FileText className="size-4" />
    },
    {
      command: '/migrate',
      label: 'Migration Help',
      description: 'Get migration-specific guidance',
      icon: <GitBranch className="size-4" />
    },
    {
      command: '/optimize',
      label: 'Optimize',
      description: 'Optimize performance and code quality',
      icon: <Zap className="size-4" />
    },
    {
      command: '/explain',
      label: 'Explain',
      description: 'Explain concepts and implementations',
      icon: <Brain className="size-4" />
    },
    {
      command: '/query',
      label: 'Query Data',
      description: 'Help with database queries and data structure',
      icon: <Database className="size-4" />
    }
  ];

  // Filter commands based on current input
  const filteredCommands = slashCommands.filter(cmd => 
    cmd.command.toLowerCase().includes(commandFilter.toLowerCase()) ||
    cmd.label.toLowerCase().includes(commandFilter.toLowerCase())
  );

  // Available agents in workspace - updated to use CSS variables
  const workspaceAgents = [
    {
      id: 'analyzer',
      name: 'Code Analyzer',
      handle: 'analyzer',
      description: 'Legacy Code Analysis',
      details: 'Analyzes legacy codebases and dependencies',
      colorClass: 'bg-success text-success-foreground',
      icon: <Search className="size-4" />
    },
    {
      id: 'designer',
      name: 'UI Migration Designer',
      handle: 'designer', 
      description: 'Design System Migration',
      details: 'Migrates design systems and UI components',
      colorClass: 'bg-primary text-primary-foreground',
      icon: <Bot className="size-4" />
    },
    {
      id: 'content',
      name: 'Content Migration Assistant',
      handle: 'content',
      description: 'Content & Data Migration',
      details: 'Handles content migration and data transformation',
      colorClass: 'bg-warning text-warning-foreground',
      icon: <Database className="size-4" />
    },
    {
      id: 'architect',
      name: 'System Architect',
      handle: 'architect',
      description: 'Architecture & Planning',
      details: 'Designs system architecture and migration strategy',
      colorClass: 'bg-primary text-primary-foreground',
      icon: <Target className="size-4" />
    },
    {
      id: 'tester',
      name: 'QA Automation Agent',
      handle: 'tester',
      description: 'Testing & Validation',
      details: 'Automated testing and quality assurance',
      colorClass: 'bg-destructive text-destructive-foreground',
      icon: <CheckCircle2 className="size-4" />
    }
  ];

  // Filter agents based on current input
  const filteredAgents = workspaceAgents.filter(agent => 
    agent.handle.toLowerCase().includes(agentFilter.toLowerCase()) ||
    agent.name.toLowerCase().includes(agentFilter.toLowerCase())
  );

  // Update mock data when context changes
  useEffect(() => {
    if (context.type === 'task') {
      setArtifacts(mockArtifacts);
    } else if (context.type === 'project') {
      // Convert PROJECT_ARTIFACTS to Artifact format for project context
      const projectArtifacts: Artifact[] = PROJECT_ARTIFACTS.slice(0, 12).map(artifact => ({
        id: artifact.id,
        projectId: context.projectId,
        taskId: undefined,
        type: artifact.type as 'code' | 'sitecore',
        label: artifact.name,
        summary: artifact.description || `${artifact.category} artifact`,
        content: `// ${artifact.name}
// Path: ${artifact.path}
// Type: ${artifact.category}
// Size: ${artifact.size}
// Status: ${artifact.status}
// Complexity: ${artifact.migrationComplexity || 'unknown'}

// This is a ${artifact.type} artifact discovered during project analysis.`,
        createdAt: artifact.lastModified,
        updatedAt: artifact.lastModified
      }));
      setArtifacts(projectArtifacts);
    } else {
      setArtifacts([]);
    }
  }, [context]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle taskPrompt when provided
  useEffect(() => {
    if (taskPrompt && thread) {
      // Add the task prompt as a user message to trigger AI execution
      const taskMessage: AiLog = {
        id: `task-${Date.now()}`,
        threadId: thread.id,
        at: new Date().toISOString(),
        role: 'human',
        message: taskPrompt
      };
      
      setMessages(prev => [...prev, taskMessage]);
      
      // Simulate AI response with task execution guidance
      setTimeout(() => {
        const aiResponse: AiLog = {
          id: `task-response-${Date.now()}`,
          threadId: thread.id,
          at: new Date().toISOString(),
          role: 'agent',
          message: `🚀 **Task Execution Started**

I've received your task execution request and I'm ready to help you implement this step by step.

**Let me break this down:**

1. **Analysis Phase** - I'll analyze the current requirements and dependencies
2. **Planning Phase** - Create a detailed execution plan with milestones
3. **Implementation Phase** - Provide code examples and best practices
4. **Validation Phase** - Define testing criteria and success metrics

**Next Steps:**
- I'll review the task details and existing context
- Provide specific implementation guidance
- Generate any necessary code artifacts
- Help with JIRA ticket creation if needed

Would you like me to start with a specific aspect of this task, or shall I provide a comprehensive execution plan covering all requirements?

*Ready to assist with Sitecore migration, code generation, and technical guidance.*`
        };
        
        setMessages(prev => [...prev, aiResponse]);
        
        // Call the onPromptProcessed callback to clear the pending prompt
        if (onPromptProcessed) {
          onPromptProcessed();
        }
      }, 1000);
    }
  }, [taskPrompt, thread, onPromptProcessed]);

  // Handle approval/rejection actions from AI Inbox
  const handleApprovalAction = (item: any, action: 'approve' | 'reject', details?: string) => {
    if (!thread) return;
    
    // Set transition state
    setPendingApprovalTransition(item.id);
    
    // Create system message for the approval/rejection
    const systemMessage: AiLog = {
      id: `approval-${Date.now()}`,
      threadId: thread.id,
      at: new Date().toISOString(),
      role: 'system',
      message: action === 'approve' 
        ? `✅ **User Approved**: ${item.title}

*"${item.summary}"*

**Context sent to AI for implementation**

The AI will now proceed with this recommendation and provide implementation guidance.`
        : `❌ **User Rejected**: ${item.title}

*"${item.summary}"*

**Reason**: ${details || 'Not needed at this time'}

The AI has been notified of this decision and will adjust future recommendations accordingly.`
    };
    
    // Add system message to chat
    setMessages(prev => [...prev, systemMessage]);
    
    // Simulate AI response after approval
    if (action === 'approve') {
      setTimeout(() => {
        const aiResponse: AiLog = {
          id: `ai-approval-response-${Date.now()}`,
          threadId: thread.id,
          at: new Date().toISOString(),
          role: 'agent',
          message: `🚀 **Implementation Started**: ${item.title}

Thank you for approving this recommendation! I'm now proceeding with implementation.

**Next Steps:**
1. Analyzing current project context
2. Creating detailed implementation plan
3. Generating necessary code artifacts
4. Setting up validation criteria

**Estimated Impact**: ${item.estimatedImpact || 'Positive contribution to project goals'}

I'll keep you updated on progress and create any necessary artifacts or tasks. Feel free to ask questions or provide additional context!`
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setPendingApprovalTransition(null);
      }, 1500);
    } else {
      // For rejections, just clear the transition after a short delay
      setTimeout(() => {
        setPendingApprovalTransition(null);
      }, 800);
    }
    
    // Switch to chat tab with smooth transition
    setTimeout(() => {
      setActiveTab('chat');
    }, 300);
  };

  // Handle inline replies from AI Inbox
  const handleInlineReply = (item: any, reply: string) => {
    if (!thread) return;
    
    // Create system message for the inline reply
    const systemMessage: AiLog = {
      id: `inline-reply-${Date.now()}`,
      threadId: thread.id,
      at: new Date().toISOString(),
      role: 'system',
      message: `💬 **User Response to Info Request**: ${item.title}

**Original Question**: "${item.requestedInfo}"

**User Reply**: "${reply}"

**Forwarded to AI for processing**

The AI will now use this information to provide updated recommendations.`
    };
    
    // Add system message to chat
    setMessages(prev => [...prev, systemMessage]);
    
    // Simulate AI response after inline reply
    setTimeout(() => {
      const aiResponse: AiLog = {
        id: `ai-inline-response-${Date.now()}`,
        threadId: thread.id,
        at: new Date().toISOString(),
        role: 'agent',
        message: `🙏 **Thank you for the clarification!**

Based on your response: *"${reply}"*

I now have the context I need for: **${item.title}**

**Updated Recommendation:**
I'll incorporate this information and provide a more targeted approach. This will help me:

• Better align with your specific requirements
• Provide more accurate implementation guidance
• Ensure the solution fits your team's workflow

**Next Steps:**
1. Processing your requirements
2. Updating the recommendation with your input
3. Creating implementation artifacts if needed

I'll provide an updated recommendation shortly. Feel free to ask any follow-up questions!`
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
    
    // Switch to chat tab with smooth transition
    setTimeout(() => {
      setActiveTab('chat');
    }, 300);
  };

  // API functions commented out for demo - using mock data instead
  /*
  const loadChatThread = async () => { ... };
  const loadMessages = async (threadId: string) => { ... };
  const loadTaskArtifacts = async () => { ... };
  const bootstrapTaskContext = async (threadId: string) => { ... };
  */

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !thread || loading) return;
    
    setLoading(true);
    setShowCommandDropdown(false); // Hide dropdown when sending
    setShowAgentDropdown(false); // Hide agent dropdown when sending
    
    // Add user message immediately
    const userMessage: AiLog = {
      id: `msg-${Date.now()}`,
      threadId: thread.id,
      at: new Date().toISOString(),
      role: 'human',
      message: inputValue.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: AiLog = {
        id: `msg-${Date.now()}-ai`,
        threadId: thread.id,
        at: new Date().toISOString(),
        role: 'agent',
        message: `I understand your question about "${userMessage.message}". Let me help you with that.

Based on the current task context, here are some suggestions:

• Review the existing implementation patterns
• Consider the target architecture requirements
• Plan for testing and validation steps

Would you like me to provide more specific guidance or generate code examples?`
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  // Handle input changes and slash command/agent mention detection
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const lastChar = value[value.length - 1];
    const prevChar = value.length > 1 ? value[value.length - 2] : '';
    
    // Check if user typed "/" at the beginning or after a space
    if (lastChar === '/' && (value.length === 1 || prevChar === ' ')) {
      setShowCommandDropdown(true);
      setShowAgentDropdown(false);
      setSelectedCommandIndex(0);
      setCommandFilter('');
    }
    // Check if user typed "@" at the beginning or after a space  
    else if (lastChar === '@' && (value.length === 1 || prevChar === ' ')) {
      setShowAgentDropdown(true);
      setShowCommandDropdown(false);
      setSelectedAgentIndex(0);
      setAgentFilter('');
    }
    // Handle filtering for active slash command dropdown
    else if (showCommandDropdown) {
      const lastSlashIndex = value.lastIndexOf('/');
      if (lastSlashIndex !== -1) {
        const filter = value.substring(lastSlashIndex + 1);
        setCommandFilter(filter);
        setSelectedCommandIndex(0);
      } else {
        setShowCommandDropdown(false);
      }
    }
    // Handle filtering for active agent mention dropdown
    else if (showAgentDropdown) {
      const lastAtIndex = value.lastIndexOf('@');
      if (lastAtIndex !== -1) {
        const filter = value.substring(lastAtIndex + 1);
        setAgentFilter(filter);
        setSelectedAgentIndex(0);
      } else {
        setShowAgentDropdown(false);
      }
    }
  };

  // Handle keyboard navigation in dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle slash command dropdown navigation
    if (showCommandDropdown && filteredCommands.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCommandIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCommandIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        selectCommand(filteredCommands[selectedCommandIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowCommandDropdown(false);
      }
    }
    // Handle agent mention dropdown navigation
    else if (showAgentDropdown && filteredAgents.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedAgentIndex(prev => 
          prev < filteredAgents.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedAgentIndex(prev => 
          prev > 0 ? prev - 1 : filteredAgents.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        selectAgent(filteredAgents[selectedAgentIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowAgentDropdown(false);
      }
    }
    // Handle regular enter key for sending message
    else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Select a command and insert it into input
  const selectCommand = (command: any) => {
    const lastSlashIndex = inputValue.lastIndexOf('/');
    const beforeSlash = inputValue.substring(0, lastSlashIndex);
    const newValue = beforeSlash + command.command + ' ';
    
    setInputValue(newValue);
    setShowCommandDropdown(false);
    setCommandFilter('');
  };

  // Select an agent and insert it as mention into input
  const selectAgent = (agent: any) => {
    const lastAtIndex = inputValue.lastIndexOf('@');
    const beforeAt = inputValue.substring(0, lastAtIndex);
    const newValue = beforeAt + `@${agent.handle} `;
    
    setInputValue(newValue);
    setShowAgentDropdown(false);
    setAgentFilter('');
  };

  // Extract mentions from input value
  const extractMentions = (text: string) => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      const agent = workspaceAgents.find(a => a.handle === match[1]);
      if (agent) {
        mentions.push(agent);
      }
    }
    
    return mentions;
  };

  const currentMentions = extractMentions(inputValue);

  // Render message content with highlighted mentions
  const renderMessageWithMentions = (message: string) => {
    const mentionRegex = /@(\w+)/g;
    const parts = message.split(mentionRegex);
    
    return parts.map((part, index) => {
      // If this part is a mention handle (odd indices after split)
      if (index % 2 === 1) {
        const agent = workspaceAgents.find(a => a.handle === part);
        if (agent) {
          return (
            <span 
              key={index}
              className="inline-flex items-center rounded-md bg-primary/10 text-primary border border-primary/20"
              style={{ 
                gap: 'var(--spacing-1)', 
                padding: 'var(--spacing-0-5) var(--spacing-2)' 
              }}
            >
              <span 
                className={`rounded-full ${agent.colorClass}`}
                style={{ 
                  width: 'var(--spacing-2)', 
                  height: 'var(--spacing-2)' 
                }}
              ></span>
              @{agent.handle}
            </span>
          );
        }
        return `@${part}`;
      }
      return part;
    });
  };

  // Render agent delegation accordion - Updated to use CSS variables
  const renderAgentDelegation = (agents: any[]) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'working':
          return 'bg-primary/10 text-primary border-primary/20';
        case 'completed':
          return 'bg-success/10 text-success border-success/20';
        case 'waiting':
          return 'bg-warning/10 text-warning border-warning/20';
        case 'error':
          return 'bg-destructive/10 text-destructive border-destructive/20';
        default:
          return 'bg-muted/50 text-muted-foreground border-border';
      }
    };

    const getAgentIcon = (iconType: string) => {
      switch (iconType) {
        case 'database':
          return <Database className="size-4" />;
        case 'code':
          return <Code className="size-4" />;
        case 'check':
          return <CheckCircle2 className="size-4" />;
        default:
          return <Bot className="size-4" />;
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        {agents.map((agent) => (
          <div 
            key={agent.id} 
            className="flex w-full"
            style={{ gap: 'var(--spacing-3)' }}
          >
            {/* Agent Avatar - outside the accordion */}
            <div 
              className="flex items-center justify-center flex-shrink-0"
              style={{ 
                width: 'var(--spacing-8)',
                height: 'var(--spacing-8)',
                borderRadius: 'var(--radius)',
                backgroundColor: agent.color ? `${agent.color}15` : 'var(--muted)',
                color: agent.color || 'var(--muted-foreground)'
              }}
            >
              {getAgentIcon(agent.icon)}
            </div>

            {/* Accordion Container */}
            <div className="flex-1 min-w-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem 
                  value={agent.id}
                  className="border bg-background overflow-hidden group"
                  style={{ borderRadius: 'var(--radius)' }}
                >
                  <AccordionTrigger 
                    className="hover:no-underline"
                    style={{ 
                      padding: 'var(--spacing-3) var(--spacing-4)' 
                    }}
                  >
                    <div 
                      className="flex items-center w-full"
                      style={{ gap: 'var(--spacing-3)' }}
                    >
                      <div 
                        className="flex-1 min-w-0 text-left"
                        style={{ marginRight: 'var(--spacing-3)' }}
                      >
                        <div 
                          className="flex items-center flex-wrap"
                          style={{ 
                            gap: 'var(--spacing-2)', 
                            marginBottom: 'var(--spacing-1)' 
                          }}
                        >
                          <span 
                            style={{ color: agent.color || 'var(--foreground)' }}
                          >
                            {agent.name}
                          </span>
                          <Badge 
                            variant="outline"
                            className={getStatusColor(agent.status)}
                          >
                            {agent.statusLabel}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground line-clamp-1 group-data-[state=open]:hidden">
                          {agent.preview}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent 
                    style={{ 
                      padding: '0 var(--spacing-4) var(--spacing-4)' 
                    }}
                  >
                    <div>
                      <p>
                        {agent.preview}
                      </p>
                      
                      {agent.messages && agent.messages.length > 0 && (
                        <div 
                          style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 'var(--spacing-2)', 
                            marginTop: 'var(--spacing-3)' 
                          }}
                        >
                          {agent.messages.map((msg: string, msgIndex: number) => (
                            <div 
                              key={msgIndex} 
                              className="flex items-start bg-muted/30"
                              style={{ 
                                gap: 'var(--spacing-2)', 
                                padding: 'var(--spacing-2)', 
                                borderRadius: 'var(--radius-md)' 
                              }}
                            >
                              <div 
                                className="rounded-full flex-shrink-0" 
                                style={{ 
                                  width: 'var(--spacing-1-5)',
                                  height: 'var(--spacing-1-5)',
                                  marginTop: 'var(--spacing-1-5)',
                                  backgroundColor: agent.color || 'var(--primary)'
                                }} 
                              />
                              <p className="text-muted-foreground">
                                {msg}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {agent.needsApproval && (
                        <div 
                          className="flex border-t"
                          style={{ 
                            gap: 'var(--spacing-2)', 
                            marginTop: 'var(--spacing-3)', 
                            paddingTop: 'var(--spacing-3)' 
                          }}
                        >
                          <Button 
                            size="sm" 
                            variant="default" 
                            onClick={() => console.log(`Approved: ${agent.id}`)}
                          >
                            <CheckCircle2 className="size-4" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => console.log(`Rejected: ${agent.id}`)}
                          >
                            <XCircle className="size-4" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        ))}
      </div>
    );
  };



  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'human': return <User className="size-4 text-primary" />;
      case 'agent': return <Bot className="size-4 text-success" />;
      case 'system': return <Settings className="size-4 text-muted-foreground" />;
      default: return <Bot className="size-4" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'human': return <Badge variant="outline">You</Badge>;
      case 'agent': return <Badge variant="outline" className="bg-success/10 text-success border-success/20">AI Agent</Badge>;
      case 'system': return <Badge variant="outline" className="bg-muted text-muted-foreground">System</Badge>;
      default: return null;
    }
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Fixed Header */}
          <div 
            className="flex-shrink-0 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10"
            style={{ padding: 'var(--spacing-2) var(--spacing-4)' }}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger 
                value="chat" 
                className={`transition-all duration-300 ${pendingApprovalTransition ? 'bg-primary/10 border-primary/20 text-primary animate-pulse' : ''}`}
              >
                Chat
                {pendingApprovalTransition && (
                  <div 
                    className="bg-primary rounded-full animate-ping"
                    style={{ 
                      marginLeft: 'var(--spacing-2)', 
                      width: 'var(--spacing-2)', 
                      height: 'var(--spacing-2)' 
                    }}
                  ></div>
                )}
              </TabsTrigger>
              <TabsTrigger value="artifacts">
                Artifacts {artifacts.length > 0 && `(${artifacts.length})`}
              </TabsTrigger>
              <TabsTrigger value="ai-inbox">
                AI Inbox
                <Badge 
                  variant="secondary" 
                  style={{ 
                    marginLeft: 'var(--spacing-1)', 
                    height: 'var(--spacing-4)', 
                    padding: '0 var(--spacing-1)' 
                  }}
                >
                  3
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col m-0 min-h-0">
            {/* Messages Area - Scrollable */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 'var(--spacing-3)', 
                    padding: 'var(--spacing-4)' 
                  }}
                >
                  {loading && messages.length === 0 ? (
                    <div 
                      className="flex items-center justify-center text-muted-foreground"
                      style={{ padding: 'var(--spacing-12) 0' }}
                    >
                      <div 
                        className="text-center"
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: 'var(--spacing-3)' 
                        }}
                      >
                        <div 
                          className="bg-muted rounded-full flex items-center justify-center mx-auto"
                          style={{ 
                            width: 'var(--spacing-10)', 
                            height: 'var(--spacing-10)' 
                          }}
                        >
                          <Loader2 
                            className="animate-spin"
                            style={{ 
                              width: 'var(--spacing-5)', 
                              height: 'var(--spacing-5)' 
                            }}
                          />
                        </div>
                        <p>Loading chat...</p>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div 
                      className="flex items-center justify-center"
                      style={{ padding: 'var(--spacing-12) 0' }}
                    >
                      <div 
                        className="text-center max-w-sm"
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: 'var(--spacing-4)' 
                        }}
                      >
                        <div 
                          className="bg-primary/10 rounded-full flex items-center justify-center mx-auto"
                          style={{ 
                            width: 'var(--spacing-12)', 
                            height: 'var(--spacing-12)' 
                          }}
                        >
                          <Bot 
                            className="text-primary"
                            style={{ 
                              width: 'var(--spacing-6)', 
                              height: 'var(--spacing-6)' 
                            }}
                          />
                        </div>
                        <div 
                          style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 'var(--spacing-2)' 
                          }}
                        >
                          <h3>
                            {context.type === 'task' ? 'Task AI Assistant' : 'Project AI Assistant'}
                          </h3>
                          <p className="text-muted-foreground">
                            Ready to help with your {context.type === 'task' ? 'task execution and guidance' : 'project planning and analysis'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div 
                        key={message.id}
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: 'var(--spacing-2)' 
                        }}
                      >
                        <div 
                          className="flex items-center"
                          style={{ 
                            gap: 'var(--spacing-2)', 
                            marginBottom: 'var(--spacing-1)' 
                          }}
                        >
                          <div 
                            className="flex items-center"
                            style={{ gap: 'var(--spacing-2)' }}
                          >
                            {getRoleIcon(message.role)}
                            {getRoleBadge(message.role)}
                          </div>
                          <span className="text-muted-foreground ml-auto">
                            {new Date(message.at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        
                        {message.message && (
                          <div className="whitespace-pre-wrap break-words">
                            {renderMessageWithMentions(message.message)}
                          </div>
                        )}
                        
                        {/* Render attachments */}
                        {message.attachments?.map((attachment: any, index: number) => {
                          if (attachment.type === 'agent-delegation') {
                            return (
                              <div 
                                key={index}
                                style={{ marginTop: 'var(--spacing-2)' }}
                              >
                                {renderAgentDelegation(attachment.agents)}
                              </div>
                            );
                          }
                          
                          if (attachment.type === 'link') {
                            return (
                              <a
                                key={index}
                                href={attachment.href}
                                className="inline-flex items-center text-primary hover:underline"
                                style={{ gap: 'var(--spacing-1)' }}
                              >
                                <FileText className="size-4" />
                                {attachment.label}
                              </a>
                            );
                          }
                          
                          if (attachment.type === 'json') {
                            return (
                              <div 
                                key={index} 
                                className="bg-muted border"
                                style={{ 
                                  padding: 'var(--spacing-2)', 
                                  borderRadius: 'var(--radius-md)' 
                                }}
                              >
                                <div 
                                  className="flex items-center justify-between"
                                  style={{ marginBottom: 'var(--spacing-1)' }}
                                >
                                  <span className="text-muted-foreground">{attachment.label}</span>
                                  <Code className="size-4 text-muted-foreground" />
                                </div>
                                <pre className="text-muted-foreground overflow-x-auto">
                                  {attachment.content}
                                </pre>
                              </div>
                            );
                          }
                          
                          return null;
                        })}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Input Area - Fixed at Bottom */}
            <div 
              className="flex-shrink-0 border-t bg-background"
              style={{ padding: 'var(--spacing-4)' }}
            >
              <div className="relative">
                {/* Current mentions display */}
                {currentMentions.length > 0 && (
                  <div 
                    className="flex flex-wrap bg-muted/30 border"
                    style={{ 
                      gap: 'var(--spacing-1)', 
                      marginBottom: 'var(--spacing-2)', 
                      padding: 'var(--spacing-2)', 
                      borderRadius: 'var(--radius)' 
                    }}
                  >
                    <span className="text-muted-foreground">Mentioned:</span>
                    {currentMentions.map((agent, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className={agent.colorClass}
                      >
                        @{agent.handle}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center">
                  <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message... (use / for commands, @ to mention agents)"
                    disabled={loading}
                    className="pr-10 bg-background border-input"
                  />
                  
                  {/* Slash Command Dropdown */}
                  {showCommandDropdown && filteredCommands.length > 0 && (
                    <div 
                      ref={dropdownRef}
                      className="absolute bottom-full left-0 right-0 bg-popover border border-border shadow-lg z-50 overflow-hidden flex flex-col"
                      style={{ 
                        marginBottom: 'var(--spacing-2)', 
                        borderRadius: 'var(--radius)', 
                        maxHeight: 'var(--spacing-80)' 
                      }}
                    >
                      <div 
                        className="flex-shrink-0"
                        style={{ padding: 'var(--spacing-2)' }}
                      >
                        <div 
                          className="text-muted-foreground border-b border-border"
                          style={{ 
                            padding: 'var(--spacing-2)', 
                            marginBottom: 'var(--spacing-1)' 
                          }}
                        >
                          Prompt Templates
                        </div>
                      </div>
                      <div 
                        className="overflow-y-auto"
                        style={{ padding: 'var(--spacing-2)', paddingTop: 0 }}
                      >
                        {filteredCommands.map((command, index) => (
                          <button
                            key={command.command}
                            onClick={() => selectCommand(command)}
                            className={`w-full flex items-center text-left transition-colors hover:bg-accent ${
                              index === selectedCommandIndex 
                                ? 'bg-accent text-accent-foreground' 
                                : 'text-foreground'
                            }`}
                            style={{ 
                              gap: 'var(--spacing-3)', 
                              padding: 'var(--spacing-2) var(--spacing-3)', 
                              borderRadius: 'var(--radius-md)' 
                            }}
                          >
                            <div className="flex-shrink-0 text-muted-foreground">
                              {command.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div>{command.label}</div>
                              <div className="text-muted-foreground truncate">
                                {command.description}
                              </div>
                            </div>
                            <div className="text-muted-foreground font-mono">
                              {command.command}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Agent Mention Dropdown */}
                  {showAgentDropdown && filteredAgents.length > 0 && (
                    <div 
                      ref={agentDropdownRef}
                      className="absolute bottom-full left-0 right-0 bg-popover border border-border shadow-lg z-50 overflow-y-auto"
                      style={{ 
                        marginBottom: 'var(--spacing-2)', 
                        borderRadius: 'var(--radius)', 
                        maxHeight: 'var(--spacing-80)' 
                      }}
                    >
                      <div style={{ padding: 'var(--spacing-2)' }}>
                        <div 
                          className="text-muted-foreground border-b border-border"
                          style={{ 
                            padding: 'var(--spacing-2)', 
                            marginBottom: 'var(--spacing-1)' 
                          }}
                        >
                          Available Agents ({filteredAgents.length})
                        </div>
                        {filteredAgents.map((agent, index) => (
                          <button
                            key={agent.id}
                            onClick={() => selectAgent(agent)}
                            className={`w-full flex items-center text-left transition-colors hover:bg-accent ${
                              index === selectedAgentIndex 
                                ? 'bg-accent text-accent-foreground' 
                                : 'text-foreground'
                            }`}
                            style={{ 
                              gap: 'var(--spacing-3)', 
                              padding: 'var(--spacing-2) var(--spacing-3)', 
                              borderRadius: 'var(--radius-md)' 
                            }}
                          >
                            <div 
                              className={`rounded-full flex items-center justify-center ${agent.colorClass}`}
                              style={{ 
                                width: 'var(--spacing-8)', 
                                height: 'var(--spacing-8)' 
                              }}
                            >
                              {agent.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div>{agent.name}</div>
                              <div className="text-muted-foreground truncate">
                                {agent.description}
                              </div>
                              <div className="text-muted-foreground/70 truncate">
                                {agent.details}
                              </div>
                            </div>
                            {index === selectedAgentIndex && (
                              <div className="text-muted-foreground flex-shrink-0">
                                ↵
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || loading}
                    size="sm"
                    className="absolute right-2"
                  >
                    {loading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="artifacts" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div style={{ padding: 'var(--spacing-4)' }}>
                {artifacts.length === 0 ? (
                  <div 
                    className="flex items-center justify-center text-center"
                    style={{ padding: 'var(--spacing-12) 0' }}
                  >
                    <div 
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 'var(--spacing-3)', 
                        maxWidth: '24rem' 
                      }}
                    >
                      <div 
                        className="bg-muted rounded-full flex items-center justify-center mx-auto"
                        style={{ 
                          width: 'var(--spacing-12)', 
                          height: 'var(--spacing-12)' 
                        }}
                      >
                        <FileText 
                          className="text-muted-foreground"
                          style={{ 
                            width: 'var(--spacing-6)', 
                            height: 'var(--spacing-6)' 
                          }}
                        />
                      </div>
                      <div>
                        <h3>No Artifacts Yet</h3>
                        <p className="text-muted-foreground">
                          Artifacts generated during the conversation will appear here
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ArtifactCards
                    artifacts={artifacts}
                    selectedArtifact={selectedArtifact}
                    onArtifactSelect={onArtifactSelect}
                    viewMode="grid"
                    onViewModeChange={() => {}}
                  />
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="ai-inbox" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div style={{ padding: 'var(--spacing-4)' }}>
                <AIInbox
                  context={context}
                  onApprove={(item) => handleApprovalAction(item, 'approve')}
                  onReject={(item, details) => handleApprovalAction(item, 'reject', details)}
                  onReply={handleInlineReply}
                />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { ScrollArea } from '../../ui/scroll-area';
import { Separator } from '../../ui/separator';
import { Badge } from '../../ui/badge';
import { Card, CardContent } from '../../ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { ArtifactPreviewModal } from '../artifact/ArtifactPreviewModal';
import { AIInboxCard } from '../ai/AIInboxCard';
import { type InboxItem } from '../ai/AIInbox';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Bot, 
  Clock, 
  MoreVertical,
  Send,
  Paperclip,
  Eye,
  Code,
  Database,
  FileText,
  Lightbulb,
  Zap,
  Target,
  Inbox,
  Star,
  Edit,
  Trash2,
  X,
  ChevronRight,
  Settings,
  Loader2,
  CheckCircle2,
  RefreshCw,
  Copy,
  Edit2,
  Check
} from 'lucide-react';
import { showSuccess, showError } from '../../toast';

// Mock data for chat sessions
const mockChatSessions = [
  {
    id: '1',
    title: 'Content Migration Strategy',
    lastMessage: 'Let\'s review the content mapping approach...',
    timestamp: '2 min ago',
    unreadCount: 2,
    type: 'agent' as const
  },
  {
    id: '2', 
    title: 'Component Analysis',
    lastMessage: 'The component inventory is complete',
    timestamp: '1 hour ago',
    unreadCount: 0,
    type: 'user' as const
  },
  {
    id: '3',
    title: 'Architecture Review',
    lastMessage: 'Agent completed the technical assessment',
    timestamp: '2 hours ago', 
    unreadCount: 1,
    type: 'agent' as const
  },
  {
    id: '4',
    title: 'Task Planning Session',
    lastMessage: 'Generated 12 tasks for migration phase',
    timestamp: 'Yesterday',
    unreadCount: 0,
    type: 'agent' as const
  }
];

// Mock artifacts data to show in chat
const mockArtifacts = [
  {
    id: 'artifact_1',
    name: 'Navigation Template',
    title: 'Navigation Template',
    type: 'sitecore' as const,
    description: 'Multi-level navigation structure with breadcrumb support',
    summary: 'Multi-level navigation structure with breadcrumb support',
    createdAt: new Date().toISOString()
  },
  {
    id: 'artifact_2', 
    name: 'ArticleController.cs',
    title: 'ArticleController.cs',
    type: 'code' as const,
    description: 'MVC controller handling article display and search functionality',
    summary: 'MVC controller handling article display and search functionality',
    createdAt: new Date().toISOString()
  },
  {
    id: 'artifact_3',
    name: 'Product Catalog System',
    title: 'Product Catalog System',
    type: 'hybrid' as const,
    description: 'Complete e-commerce integration with templates and business logic',
    summary: 'Complete e-commerce integration with templates and business logic',
    createdAt: new Date().toISOString()
  }
];

// Prompt templates data
const quickCommands = [
  {
    id: 'analyze',
    label: 'Analyze Content',
    description: 'Analyze existing content structure and templates',
    icon: Target,
    shortcut: 'Enter'
  },
  {
    id: 'migrate',
    label: 'Start Migration',
    description: 'Begin migrating components to new platform',
    icon: Zap,
    shortcut: 'Enter'
  },
  {
    id: 'generate',
    label: 'Generate Tasks',
    description: 'Create migration tasks automatically',
    icon: Lightbulb,
    shortcut: 'Enter'
  },
  {
    id: 'review',
    label: 'Review Architecture',
    description: 'Review current system architecture',
    icon: FileText,
    shortcut: 'Enter'
  },
  {
    id: 'test',
    label: 'Run Tests',
    description: 'Execute migration validation tests',
    icon: Database,
    shortcut: 'Enter'
  },
  {
    id: 'deploy',
    label: 'Deploy Changes',
    description: 'Deploy migrated components to staging',
    icon: Code,
    shortcut: 'Enter'
  }
];

// Available agents data
const availableAgents = [
  {
    id: 'kajoo',
    name: 'Kajoo Assistant',
    handle: 'kajoo',
    role: 'General Assistant',
    description: 'Your primary AI assistant for all migration tasks and questions',
    avatar: { 
      bg: 'bg-primary/10 dark:bg-primary/20', 
      iconColor: 'text-primary',
      icon: Bot 
    }
  },
  {
    id: 'analyzer',
    name: 'Code Analyzer',
    handle: 'analyzer',
    role: 'Legacy Code Analysis',
    description: 'Analyzes legacy codebase structure, dependencies, and migration requirements',
    avatar: { 
      bg: 'bg-success/10 dark:bg-success/20', 
      iconColor: 'text-success',
      icon: Search 
    }
  },
  {
    id: 'designer',
    name: 'UI Migration Designer',
    handle: 'designer', 
    role: 'Design System Migration',
    description: 'Migrates design systems, components, and UI patterns to new platform',
    avatar: { 
      bg: 'bg-accent-purple/10 dark:bg-accent-purple/20', 
      iconColor: 'text-accent-purple',
      icon: FileText 
    }
  },
  {
    id: 'content',
    name: 'Content Migration Assistant',
    handle: 'content',
    role: 'Content & Data Migration',
    description: 'Handles content migration, data mapping, and content structure optimization',
    avatar: { 
      bg: 'bg-warning/10 dark:bg-warning/20', 
      iconColor: 'text-warning',
      icon: Database 
    }
  },
  {
    id: 'architect',
    name: 'System Architect',
    handle: 'architect',
    role: 'Architecture & Planning',
    description: 'Reviews system architecture and creates migration strategy plans',
    avatar: { 
      bg: 'bg-info/10 dark:bg-info/20', 
      iconColor: 'text-info',
      icon: Target 
    }
  },
  {
    id: 'tester',
    name: 'Quality Assurance Agent',
    handle: 'tester',
    role: 'Testing & Validation',
    description: 'Performs automated testing and validation of migrated components',
    avatar: { 
      bg: 'bg-destructive/10 dark:bg-destructive/20', 
      iconColor: 'text-destructive',
      icon: Zap 
    }
  }
];

// Additional mock artifacts for different sessions
const mockSecondaryArtifacts = [
  {
    id: 'artifact_4',
    name: 'SearchService.cs',
    title: 'SearchService.cs',
    type: 'code' as const,
    description: 'Sitecore search integration with custom indexing logic',
    summary: 'Sitecore search integration with custom indexing logic',
    createdAt: new Date().toISOString()
  },
  {
    id: 'artifact_5',
    name: 'Article Template',
    title: 'Article Template',
    type: 'sitecore' as const,
    description: 'Content template for blog articles with metadata fields',
    summary: 'Content template for blog articles with metadata fields',
    createdAt: new Date().toISOString()
  }
];

const mockComponentArtifacts = [
  {
    id: 'artifact_6',
    name: 'HeroComponent.cs',
    title: 'HeroComponent.cs',
    type: 'code' as const,
    description: 'Dynamic hero banner component with content personalization',
    summary: 'Dynamic hero banner component with content personalization',
    createdAt: new Date().toISOString()
  },
  {
    id: 'artifact_7',
    name: 'Hero Template',
    title: 'Hero Template',
    type: 'sitecore' as const,
    description: 'Hero section template with responsive image handling',
    summary: 'Hero section template with responsive image handling',
    createdAt: new Date().toISOString()
  }
];

// Type definition for messages with optional artifacts and inbox items
type Message = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  artifacts?: any[];
  inboxItems?: any[];
  reasoning?: string;
  reasoningDuration?: number; // in seconds
  toolCalls?: ToolCall[];
  agentResponses?: AgentResponse[]; // Multi-agent workflow responses
};

type ToolCall = {
  id: string;
  toolName: string;
  input?: any;
  output?: any;
  status?: 'executing' | 'success' | 'error';
  error?: string;
};

/**
 * Agent Response Type
 * Represents an action or communication from a specialized AI agent
 * 
 * Agent Types:
 * - migration: Migration-specific tasks and Sitecore environment connections
 * - qa: Quality assurance, testing, and validation
 * - sitecore: Sitecore platform analysis and configuration
 * - content: Content inventory, analysis, and migration
 * 
 * Status:
 * - executing: Agent is currently working on the task (shows loading spinner)
 * - completed: Agent has finished the task
 * - awaiting-approval: Agent is waiting for user approval to proceed
 * 
 * Example usage:
 * {
 *   id: 'agent_1',
 *   agentType: 'migration',
 *   message: 'Connecting to Sitecore environment...',
 *   status: 'executing'
 * }
 */
type AgentResponse = {
  id: string;
  agentType: 'migration' | 'qa' | 'sitecore' | 'content';
  message: string;
  messages?: string[]; // Multiple progress/status messages
  toolCalls?: ToolCall[]; // Tool executions performed by the agent
  status?: 'executing' | 'completed' | 'awaiting-approval';
  requiresApproval?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
};

// Different chat content for each session
const chatContentBySession: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      role: 'assistant' as const,
      content: 'I\'ve completed the analysis of your Sitecore XP implementation. Here\'s what I found:\n\n• 156 content templates\n• 89 rendering variants\n• 23 custom components\n• 4 custom processors\n\nWould you like me to prioritize these for migration?',
      timestamp: '10:30 AM',
      reasoning: 'The user needs a comprehensive overview of their Sitecore implementation before making migration decisions. I should provide quantitative data about templates, components, and customizations to help them understand the scope. This structured breakdown will enable better planning and prioritization.',
      reasoningDuration: 2,
      toolCalls: [
        {
          id: 'tool_1',
          toolName: 'analyze-sitecore-implementation',
          status: 'success' as const,
          input: {
            environment: 'production',
            includeCustomizations: true,
            depth: 'full'
          },
          output: {
            contentTemplates: {
              total: 156,
              custom: 89,
              standard: 67
            },
            renderingVariants: {
              total: 89,
              byType: {
                hero: 12,
                navigation: 8,
                content: 45,
                footer: 6,
                other: 18
              }
            },
            customComponents: {
              total: 23,
              complexity: {
                high: 8,
                medium: 10,
                low: 5
              }
            },
            processors: {
              total: 4,
              types: ['authentication', 'search', 'caching', 'analytics']
            }
          }
        }
      ]
    },
    {
      id: '2', 
      role: 'user' as const,
      content: 'Yes, please prioritize them by complexity and business impact.',
      timestamp: '10:32 AM'
    },
    {
      id: '3',
      role: 'assistant' as const,
      content: 'Based on my analysis, here\'s the prioritization:\n\n**High Priority (Business Critical)**\n• Product catalog templates\n• Navigation components\n• User authentication flows\n\n**Medium Priority**\n• Blog content templates\n• Marketing components\n• Form handlers\n\n**Low Priority**\n• Legacy promotional templates\n• Deprecated components\n\nI\'ve generated detailed artifacts for the high-priority components:',
      timestamp: '10:35 AM',
      reasoning: 'The user requested prioritization by complexity and business impact. I need to evaluate each component against these criteria. Business-critical components like product catalog and authentication should be prioritized first as they directly affect revenue and user access. Marketing and blog content can follow since they have less immediate impact. Legacy items can be deprioritized or potentially excluded from migration.',
      reasoningDuration: 4,
      artifacts: mockArtifacts
    },
    {
      id: '3a',
      role: 'assistant' as const,
      content: 'Coordinating with specialized agents to handle your migration tasks:',
      timestamp: '10:36 AM',
      agentResponses: [
        {
          id: 'agent_migration_1',
          agentType: 'migration' as const,
          message: 'I\'m connecting to the Sitecore environment to fetch the latest component configurations and dependencies...',
          status: 'executing' as const
        },
        {
          id: 'agent_sitecore_1',
          agentType: 'sitecore' as const,
          message: 'Analyzing component templates, rendering variants, and data source configurations from your Sitecore XP instance. Found 12 hero-related templates with complex field structures.',
          status: 'completed' as const
        },
        {
          id: 'agent_qa_1',
          agentType: 'qa' as const,
          message: 'I\'ve detected some potential quality issues in the hero components. Would you like me to create automated test suites for the migrated components?',
          status: 'awaiting-approval' as const,
          requiresApproval: true,
          onApprove: () => console.log('QA Agent approved'),
          onReject: () => console.log('QA Agent rejected')
        },
        {
          id: 'agent_content_1',
          agentType: 'content' as const,
          message: 'Starting content inventory across all templates. Analyzing field structures, validation rules, and content relationships to ensure data integrity during migration.',
          status: 'executing' as const
        }
      ]
    },
    {
      id: '4',
      role: 'user' as const,
      content: 'Can you also analyze the search functionality and content templates?',
      timestamp: '10:38 AM'
    },
    {
      id: '5',
      role: 'assistant' as const,
      content: 'I\'ve analyzed the search functionality and content structure. Here are the additional components I found:',
      timestamp: '10:40 AM',
      artifacts: mockSecondaryArtifacts,
      reasoning: 'After the initial component analysis, I need to dive deeper into search functionality and content architecture. These are often complex areas with custom implementations. I should identify all search-related components, indexing configurations, and content type relationships to provide a complete picture.',
      reasoningDuration: 3
    },
    {
      id: '6',
      role: 'assistant' as const,
      content: 'Based on my analysis of the migration progress, I have an important suggestion that requires your approval:',
      timestamp: '10:45 AM',
      reasoning: 'I\'ve identified inconsistencies in the migrated components that could lead to quality issues. Rather than proceeding without addressing these, I should proactively suggest creating a validation checklist. This recommendation aligns with best practices and will save rework later. I\'ll present this as an approval request so the user can decide whether to invest time in this quality improvement.',
      reasoningDuration: 5,
      inboxItems: [{
        id: 'inbox-chat-1',
        title: 'Create Migration Validation Checklist',
        summary: 'Generate comprehensive checklist for validating component migrations',
        details: 'Based on the current migration progress, I recommend creating a detailed validation checklist to ensure quality and consistency across all migrated components. This will help catch issues early and maintain standards.',
        type: 'approval' as const,
        status: 'pending' as const,
        priority: 'high' as const,
        createdAt: new Date(Date.now() - 30 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 1000).toISOString(),
        suggestedBy: 'ai-agent' as const,
        relatedTaskId: 'task-001',
        relatedTaskName: 'Component Library Migration',
        estimatedImpact: 'High - Will improve migration quality and reduce rework',
        aiReasoning: 'I analyzed 47 migrated components and found 12 inconsistencies in naming conventions and 8 missing accessibility attributes. A validation checklist would prevent these issues.'
      }, {
        id: 'inbox-chat-2',
        title: 'Performance Testing Configuration',
        summary: 'Need details about performance thresholds for automated testing setup',
        details: 'To properly configure automated performance testing, I need more information about your target performance metrics and thresholds. This will help me set up appropriate monitoring and alerts.',
        type: 'info-request' as const,
        status: 'pending' as const,
        priority: 'medium' as const,
        createdAt: new Date(Date.now() - 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 60 * 1000).toISOString(),
        suggestedBy: 'ai-agent' as const,
        relatedTaskId: 'task-002',
        relatedTaskName: 'Performance Baseline',
        requestedInfo: 'Please provide your target page load times, acceptable response times, and any specific performance metrics you want to track.',
        estimatedImpact: 'Medium - Will enable proper performance monitoring',
        aiReasoning: 'Performance testing requires clear thresholds to be effective. Without baseline metrics, automated testing may generate false positives or miss critical issues.'
      }]
    }
  ],
  '2': [
    {
      id: '1',
      role: 'user' as const,
      content: 'I need to understand how our current components are structured before migration.',
      timestamp: '9:15 AM'
    },
    {
      id: '2',
      role: 'assistant' as const,
      content: 'I\'ll analyze your component architecture. Let me scan your Sitecore implementation...\n\n**Component Analysis Complete:**\n• 45 presentation components\n• 12 data provider components\n• 8 sublayout components\n• 23 rendering parameters\n\nThe most complex components are your hero sections and product displays.',
      timestamp: '9:17 AM',
      reasoning: 'The user wants to understand component structure before migration. I need to scan the codebase and categorize components by type and complexity. This will help identify dependencies and migration challenges. I should highlight the most complex components so the user can focus their attention there.',
      reasoningDuration: 3,
      toolCalls: [
        {
          id: 'tool_2',
          toolName: 'scan-component-architecture',
          status: 'success' as const,
          input: {
            path: '/src/components',
            recursive: true,
            includeMetadata: true
          },
          output: {
            presentationComponents: {
              count: 45,
              byCategory: {
                hero: 12,
                navigation: 8,
                content: 15,
                footer: 5,
                forms: 5
              }
            },
            dataProviders: {
              count: 12,
              types: ['REST', 'GraphQL', 'Sitecore Context']
            },
            sublayouts: {
              count: 8,
              complexity: ['simple', 'moderate', 'complex', 'complex', 'simple', 'moderate', 'complex', 'simple']
            },
            renderingParameters: 23,
            dependencies: {
              internal: 145,
              external: 23
            }
          }
        }
      ]
    },
    {
      id: '3',
      role: 'user' as const,
      content: 'Focus on the hero components - they\'re critical for our marketing pages.',
      timestamp: '9:20 AM'
    },
    {
      id: '4',
      role: 'assistant' as const,
      content: 'Perfect! I\'ve done a deep dive into your hero components. Here\'s what I found:\n\n**Hero Component Structure:**\n• 3 different hero variants\n• Personalization rules for 5 user segments\n• Integration with marketing automation\n• Responsive image handling\n\nHere are the migrated components ready for XM Cloud:',
      timestamp: '9:22 AM',
      artifacts: mockComponentArtifacts,
      reasoning: 'The user specifically requested focus on hero components since they\'re critical for marketing. I should analyze all hero variants, personalization rules, and integrations. Since these are marketing-critical, I need to ensure the migration preserves all functionality including personalization and marketing automation. I\'ll generate artifact cards showing the XM Cloud-ready components.',
      reasoningDuration: 4
    },
    {
      id: '5',
      role: 'assistant' as const,
      content: "I've initiated a multi-agent workflow to complete the component migration:",
      timestamp: '9:25 AM',
      agentResponses: [
        {
          id: 'agent_1',
          agentType: 'migration' as const,
          message: "I'm connecting to the Sitecore environment to fetch the latest component configurations and dependencies...",
          status: 'executing' as const,
          messages: [
            "Establishing secure connection to Sitecore instance...",
            "Fetching component configuration files...",
            "Analyzing dependencies and relationships...",
            "Preparing migration checklist..."
          ],
          toolCalls: [
            {
              id: 'tool_migration_1',
              toolName: 'connect-sitecore-environment',
              status: 'executing' as const,
              input: {
                environment: 'production',
                endpoint: 'https://sitecore.example.com',
                authMethod: 'api-key'
              }
            }
          ]
        },
        {
          id: 'agent_2',
          agentType: 'sitecore' as const,
          message: 'Analyzing component templates, rendering variants, and data source configurations from your Sitecore XP instance. Found 12 hero-related templates with complex field structures.',
          status: 'completed' as const,
          messages: [
            "Connected to Sitecore XP environment successfully.",
            "Scanning component templates and rendering variants...",
            "Found 12 hero-related templates with diverse field structures.",
            "Analyzing field dependencies and data source configurations.",
            "Identified 8 templates requiring field mapping updates.",
            "Cataloging rendering parameters and variant rules.",
            "Analysis complete - ready for migration planning."
          ],
          toolCalls: [
            {
              id: 'tool_sitecore_1',
              toolName: 'scan-component-architecture',
              status: 'success' as const,
              input: {
                path: '/sitecore/templates/hero',
                recursive: true,
                includeMetadata: true
              },
              output: {
                presentationComponents: {
                  count: 12,
                  byCategory: {
                    hero: 12,
                    navigation: 0,
                    content: 0
                  }
                },
                templateFields: {
                  count: 45,
                  requiringMapping: 8
                },
                renderingVariants: {
                  count: 6,
                  complexity: ['simple', 'complex', 'complex', 'simple', 'moderate', 'complex']
                }
              }
            }
          ]
        },
        {
          id: 'agent_3',
          agentType: 'qa' as const,
          message: "I've detected some potential quality issues in the hero components. Would you like me to create automated test suites for the migrated components?",
          status: 'awaiting-approval' as const,
          requiresApproval: true,
          messages: [
            "Reviewing code quality standards and best practices...",
            "Running static analysis on hero component implementations.",
            "Detected 3 accessibility issues requiring attention.",
            "Found 2 performance optimization opportunities.",
            "Identified 5 areas for improved error handling.",
            "Test suite templates are ready for deployment.",
            "Awaiting your approval to proceed with test creation."
          ],
          toolCalls: [
            {
              id: 'tool_qa_1',
              toolName: 'analyze-code-quality',
              status: 'success' as const,
              input: {
                components: ['HeroComponent', 'HeroBanner', 'HeroCarousel'],
                checks: ['accessibility', 'performance', 'security', 'best-practices']
              },
              output: {
                accessibilityIssues: {
                  count: 3,
                  severity: ['medium', 'low', 'low'],
                  details: [
                    'Missing ARIA labels on interactive elements',
                    'Insufficient color contrast ratio',
                    'Missing alt text on decorative images'
                  ]
                },
                performanceIssues: {
                  count: 2,
                  opportunities: [
                    'Lazy load hero images',
                    'Optimize bundle size by code splitting'
                  ]
                },
                codeQuality: {
                  score: 78,
                  suggestions: 5
                }
              }
            }
          ],
          onApprove: () => {
            console.log('QA test suite creation approved');
          },
          onReject: () => {
            console.log('QA test suite creation rejected');
          }
        }
      ]
    }
  ],
  '3': [
    {
      id: '1',
      role: 'assistant' as const,
      content: 'I\'ve completed the technical architecture assessment for your XM Cloud migration. Here\'s my evaluation:\n\n**Current Architecture:**\n• Sitecore XP 10.2 with custom scaling\n• 15 custom modules\n• 8 third-party integrations\n• Complex publishing workflows\n\n**Migration Complexity: Medium-High**',
      timestamp: '8:45 AM'
    },
    {
      id: '2',
      role: 'user' as const,
      content: 'What are the main technical challenges we\'ll face?',
      timestamp: '8:48 AM'
    },
    {
      id: '3',
      role: 'assistant' as const,
      content: '**Key Technical Challenges:**\n\n1. **Custom Module Migration**\n   • 6 modules need complete rewrite\n   • 9 modules can be adapted\n\n2. **Data Integration**\n   • CRM integration needs API updates\n   • Analytics tracking migration\n   • Search index rebuild required\n\n3. **Performance Considerations**\n   • CDN configuration changes\n   • Caching strategy updates\n   • Image optimization workflows\n\n**Recommended Migration Path:** Phased approach over 12-16 weeks.',
      timestamp: '8:50 AM',
      toolCalls: [
        {
          id: 'tool_3',
          toolName: 'fetch-crm-integration-config',
          status: 'error' as const,
          input: {
            configPath: '/config/integrations/crm.json',
            environment: 'production'
          },
          error: 'Connection timeout: Unable to reach CRM configuration endpoint after 30s. Please verify network connectivity and endpoint availability.'
        }
      ]
    }
  ],
  '4': [
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Ready to create your migration task plan! Based on my analysis, I can generate detailed tasks for each phase.\n\n**Migration Phases:**\n• Phase 1: Foundation & Setup (2 weeks)\n• Phase 2: Content Migration (4 weeks)\n• Phase 3: Component Development (6 weeks)\n• Phase 4: Testing & Go-Live (4 weeks)\n\nShall I generate specific tasks for each phase?',
      timestamp: 'Yesterday 2:30 PM'
    },
    {
      id: '2',
      role: 'user' as const,
      content: 'Yes, start with Phase 1 tasks please.',
      timestamp: 'Yesterday 2:32 PM'
    },
    {
      id: '3',
      role: 'assistant' as const,
      content: '**Phase 1 Tasks Generated (12 tasks):**\n\n✅ **Setup & Foundation**\n• XM Cloud environment provisioning\n• DevOps pipeline configuration\n• Developer workstation setup\n• Content model analysis\n• Security configuration\n• Integration point mapping\n\n✅ **Assessment Tasks**\n• Content audit completion\n• Component inventory finalization\n• Performance baseline establishment\n• Third-party integration review\n• Testing strategy definition\n• Go-live checklist creation\n\nAll tasks include time estimates and dependencies. Ready to proceed to Phase 2?',
      timestamp: 'Yesterday 2:35 PM'
    }
  ]
};

// Suggested prompts for new chat
const suggestedPrompts = [
  {
    icon: <Target style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} className="text-primary" />,
    title: "Analyze my Sitecore architecture",
    description: "Get a comprehensive assessment of your current implementation"
  },
  {
    icon: <Code style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} className="text-info" />,
    title: "Review custom components",
    description: "Identify migration complexity for custom components"
  },
  {
    icon: <Database style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} className="text-success" />,
    title: "Plan content migration",
    description: "Create a strategy for moving content to XM Cloud"
  },
  {
    icon: <Zap style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} className="text-warning" />,
    title: "Generate migration tasks",
    description: "Auto-create detailed tasks with time estimates"
  },
  {
    icon: <Lightbulb style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} className="text-warning" />,
    title: "Optimize for performance",
    description: "Get recommendations for performance improvements"
  }
];

interface ChatLayoutProps {
  projectId: string;
  inboxMessages?: Array<{
    id: string;
    role: 'assistant' | 'user';
    content: string;
    timestamp: string;
    source: 'inbox-action';
  }>;
  onClearInboxMessages?: () => void;
  selectedChatSession?: string | null;
  chatSessions?: Array<{
    id: string;
    title: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
  }>;
  onCreateNewChatSession?: (title: string, userMessage: string, aiResponse: string) => string;
  taskPrompt?: string | null;
  onTaskPromptProcessed?: () => void;
  pendingProjectMessage?: { userMessage: string; aiResponse: string } | null;
  onClearPendingMessage?: () => void;
}

// Artifact card component for chat messages
const ArtifactCard = ({ 
  artifact, 
  onPreview, 
  isHighlighted = false 
}: { 
  artifact: any; 
  onPreview: (artifact: any) => void;
  isHighlighted?: boolean;
}) => {
  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'code': return <Code style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} className="text-info" />;
      case 'sitecore': return <Database style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} className="text-success" />;
      case 'hybrid': return (
        <div className="flex items-center" style={{ marginLeft: 'calc(var(--spacing-1) * -0.5)' }}>
          <Database style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} className="text-success" />
          <Code style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} className="text-info" />
        </div>
      );
      default: return <FileText style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} className="text-warning" />;
    }
  };

  const getArtifactTypeColor = (type: string) => {
    switch (type) {
      case 'code': return 'bg-info/10 text-info border-info/20';
      case 'sitecore': return 'bg-success/10 text-success border-success/20';
      case 'hybrid': return 'bg-gradient-to-r from-success/10 to-info/10 text-primary border-primary/20';
      default: return 'bg-warning/10 text-warning border-warning/20';
    }
  };

  return (
    <Card className={`w-full hover:bg-muted/30 transition-all duration-300 ${
      isHighlighted ? 'ring-2 ring-primary/50 bg-primary/5 animate-pulse' : ''
    }`}>
      <CardContent style={{ padding: 'var(--spacing-3)' }}>
        <div className="flex items-start justify-between">
          <div className="flex items-start flex-1 min-w-0" style={{ gap: 'var(--spacing-3)' }}>
            {getArtifactIcon(artifact.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                <h4 className="truncate">{artifact.name}</h4>
                <Badge 
                  variant="outline" 
                  className={getArtifactTypeColor(artifact.type)}
                >
                  {artifact.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{artifact.description}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onPreview(artifact)}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">Preview</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Reasoning section component for AI messages
const ReasoningSection = ({ 
  reasoning, 
  duration 
}: { 
  reasoning: string; 
  duration?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full">
      <div className="rounded-lg backdrop-blur-md bg-background/60 border border-border/40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center w-full text-left hover:bg-background/20 transition-colors rounded-lg"
          style={{ gap: 'var(--spacing-2)', padding: 'var(--spacing-3) var(--spacing-2)' }}
        >
          <ChevronRight style={{ width: 'calc(var(--spacing-3) + var(--spacing-0-5))', height: 'calc(var(--spacing-3) + var(--spacing-0-5))' }} className={`transition-transform duration-200 text-muted-foreground ${isExpanded ? 'rotate-90' : ''}`} />
          <span className="text-muted-foreground">
            {duration ? `Thought for ${duration}s` : 'Reasoning'}
          </span>
        </button>
        
        <div 
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div style={{ padding: '0 var(--spacing-3) var(--spacing-3)' }}>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {reasoning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tool Call Visualization component for AI tool execution
const ToolCallVisualization = ({ 
  toolCall 
}: { 
  toolCall: ToolCall;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const displayData = toolCall.error 
    ? { error: toolCall.error }
    : toolCall.output || toolCall.input;

  // Syntax highlight JSON with proper colors matching artifact viewer
  const renderHighlightedJSON = (obj: any, indent = 0, lineNumber = { current: 1 }, parentKey = ''): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    const indentStr = '  '.repeat(indent);
    
    if (obj === null) {
      return [<span key={`${parentKey}-null`} className="text-info">null</span>];
    }
    
    if (typeof obj !== 'object') {
      if (typeof obj === 'string') {
        return [<span key={`${parentKey}-string`} className="text-success">"{obj}"</span>];
      }
      if (typeof obj === 'number') {
        return [<span key={`${parentKey}-number`} className="text-foreground">{obj}</span>];
      }
      if (typeof obj === 'boolean') {
        return [<span key={`${parentKey}-boolean`} className="text-info">{String(obj)}</span>];
      }
      return [String(obj)];
    }

    const isArray = Array.isArray(obj);
    const entries = isArray ? obj.map((v, i) => [i, v]) : Object.entries(obj);
    
    result.push(
      <span key={`${parentKey}-line-${lineNumber.current}`} className="inline-flex">
        <span className="inline-block text-right select-none text-muted-foreground/40" style={{ width: 'calc(var(--spacing-2) * 5)', paddingRight: 'var(--spacing-4)' }}>{lineNumber.current}</span>
        <span className="text-foreground">{isArray ? '[' : '{'}</span>
      </span>
    );
    lineNumber.current++;
    
    entries.forEach(([key, value], index) => {
      const uniqueKey = `${parentKey}-${indent}-${key}-${index}`;
      result.push(<br key={`br1-${uniqueKey}`} />);
      result.push(
        <span key={`line-content-${uniqueKey}-${lineNumber.current}`} className="inline-flex">
          <span className="inline-block text-right select-none text-muted-foreground/40" style={{ width: 'calc(var(--spacing-2) * 5)', paddingRight: 'var(--spacing-4)' }}>{lineNumber.current}</span>
          <span>
            {indentStr}  
            {!isArray && (
              <>
                <span className="text-[#8b5cf6] dark:text-[#a78bfa]">"{key}"</span>
                <span className="text-foreground">: </span>
              </>
            )}
            {typeof value === 'object' && value !== null ? (
              <span className="text-foreground">{Array.isArray(value) ? '[' : '{'}</span>
            ) : typeof value === 'string' ? (
              <span className="text-success">"{value}"</span>
            ) : typeof value === 'boolean' || value === null ? (
              <span className="text-info">{String(value)}</span>
            ) : (
              <span className="text-foreground">{String(value)}</span>
            )}
            {index < entries.length - 1 && typeof value !== 'object' && <span className="text-foreground">,</span>}
          </span>
        </span>
      );
      lineNumber.current++;
      
      if (value && typeof value === 'object') {
        const nested = renderHighlightedJSON(value, indent + 1, lineNumber, uniqueKey);
        result.push(...nested);
        result.push(<br key={`br-after-${uniqueKey}`} />);
        result.push(
          <span key={`line-close-${uniqueKey}-${lineNumber.current}`} className="inline-flex">
            <span className="inline-block text-right select-none text-muted-foreground/40" style={{ width: 'calc(var(--spacing-2) * 5)', paddingRight: 'var(--spacing-4)' }}>{lineNumber.current}</span>
            <span>
              {indentStr}  
              <span className="text-foreground">{Array.isArray(value) ? ']' : '}'}</span>
              {index < entries.length - 1 && <span className="text-foreground">,</span>}
            </span>
          </span>
        );
        lineNumber.current++;
      }
    });
    
    if (entries.length > 0 && indent === 0) {
      result.push(<br key={`br2-${parentKey}-${indent}`} />);
      result.push(
        <span key={`line-final-${parentKey}-${lineNumber.current}`} className="inline-flex">
          <span className="inline-block text-right select-none text-muted-foreground/40" style={{ width: 'calc(var(--spacing-2) * 5)', paddingRight: 'var(--spacing-4)' }}>{lineNumber.current}</span>
          <span className="text-foreground">{isArray ? ']' : '}'}</span>
        </span>
      );
    }
    
    return result;
  };

  return (
    <div className="w-full">
      <div className="rounded-lg border border-border/50 bg-muted/20 overflow-hidden shadow-sm">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center w-full text-left hover:bg-muted/40 transition-colors"
          style={{ gap: 'calc(var(--spacing-2) + var(--spacing-0-5))', padding: 'calc(var(--spacing-2) + var(--spacing-0-5)) var(--spacing-4)' }}
        >
          <Settings style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} className="text-muted-foreground" />
          <span className="font-mono text-foreground/70">
            tool: <span className="text-foreground font-medium">{toolCall.toolName}</span>
          </span>
          <div className="ml-auto flex items-center" style={{ gap: 'var(--spacing-2)' }}>
            {toolCall.status === 'executing' && (
              <Loader2 style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} className="text-muted-foreground animate-spin" />
            )}
            {toolCall.status === 'error' && (
              <span className="text-destructive font-medium">Error</span>
            )}
            <ChevronRight style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} className={`transition-transform duration-200 text-muted-foreground ${isExpanded ? 'rotate-90' : ''}`} />
          </div>
        </button>
        
        {/* JSON Output */}
        <div 
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-border/40 bg-muted/10">
            {toolCall.status === 'executing' ? (
              <div className="text-muted-foreground font-mono" style={{ padding: 'var(--spacing-4)' }}>
                Executing tool...
              </div>
            ) : (
              <div 
                className="overflow-x-auto overflow-y-auto max-h-80 custom-scrollbar"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'var(--muted-foreground) transparent'
                }}
              >
                <style dangerouslySetInnerHTML={{__html: `
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--muted-foreground);
                    border-radius: 4px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--foreground);
                  }
                `}} />
                <pre className={`font-mono whitespace-pre min-w-max ${
                  toolCall.error ? 'text-destructive' : ''
                }`} style={{ padding: 'var(--spacing-3) 0' }}>
                  <code>
                    {toolCall.error ? (
                      <span className="text-destructive">{displayData.error}</span>
                    ) : (
                      renderHighlightedJSON(displayData, 0, { current: 1 })
                    )}
                  </code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Agent configuration with unique colors and icons
const agentConfig = {
  migration: {
    name: 'Migration Agent',
    role: 'Migration Specialist',
    icon: <Database style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />,
    color: '#3B82F6',
    colorClass: 'bg-info/10 dark:bg-info/20',
    borderClass: 'border-info/50 dark:border-info/30',
    iconBgClass: 'bg-info',
    textClass: 'text-info',
    buttonClass: 'bg-info/10 dark:bg-info/20 hover:bg-info/20 dark:hover:bg-info/30 border-info/30'
  },
  qa: {
    name: 'QA Agent',
    role: 'Quality Assurance',
    icon: <Target style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />,
    color: '#22C55E',
    colorClass: 'bg-success/10 dark:bg-success/20',
    borderClass: 'border-success/20 dark:border-success/30',
    iconBgClass: 'bg-success',
    textClass: 'text-success',
    buttonClass: 'bg-success/5 dark:bg-success/10 hover:bg-success/10 dark:hover:bg-success/20 border-success/20'
  },
  sitecore: {
    name: 'Sitecore Agent',
    role: 'Platform Specialist',
    icon: <Code style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />,
    color: '#A855F7',
    colorClass: 'bg-accent-purple/10 dark:bg-accent-purple/20',
    borderClass: 'border-accent-purple/50 dark:border-accent-purple/30',
    iconBgClass: 'bg-accent-purple',
    textClass: 'text-accent-purple',
    buttonClass: 'bg-accent-purple/10 dark:bg-accent-purple/20 hover:bg-accent-purple/20 dark:hover:bg-accent-purple/30 border-accent-purple/30'
  },
  content: {
    name: 'Content Agent',
    role: 'Content Specialist',
    icon: <FileText style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />,
    color: '#F97316',
    colorClass: 'bg-warning/10 dark:bg-warning/20',
    borderClass: 'border-warning/20 dark:border-warning/30',
    iconBgClass: 'bg-warning',
    textClass: 'text-warning',
    buttonClass: 'bg-warning/5 dark:bg-warning/10 hover:bg-warning/10 dark:hover:bg-warning/20 border-warning/20'
  }
};

// Render agent delegation accordion for ask-to-agent messages
const renderAgentDelegation = (agentResponses: AgentResponse[]) => {
  const getStatusColor = (status?: 'executing' | 'completed' | 'awaiting-approval') => {
    switch (status) {
      case 'executing':
        return 'bg-info/10 dark:bg-info/20 text-info border-info/20';
      case 'completed':
        return 'bg-success/10 dark:bg-success/20 text-success border-success/20';
      case 'awaiting-approval':
        return 'bg-warning/10 dark:bg-warning/20 text-warning border-warning/20';
      default:
        return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  const getStatusLabel = (status?: 'executing' | 'completed' | 'awaiting-approval') => {
    switch (status) {
      case 'executing':
        return 'Working...';
      case 'completed':
        return 'Completed';
      case 'awaiting-approval':
        return 'Awaiting Approval';
      default:
        return 'Active';
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      {agentResponses.map((agentResponse) => {
        const config = agentConfig[agentResponse.agentType];
        
        return (
          <div key={agentResponse.id} className="flex w-full" style={{ gap: 'var(--spacing-3)' }}>
            {/* Agent Avatar - outside the accordion */}
            <div 
              className={`rounded-lg flex items-center justify-center flex-shrink-0 ${config.colorClass}`}
              style={{ width: 'var(--spacing-8)', height: 'var(--spacing-8)' }}
            >
              <div className={config.textClass}>
                {config.icon}
              </div>
            </div>

            {/* Accordion Container */}
            <div className="flex-1 min-w-0 max-w-[80%]">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem 
                  value={agentResponse.id}
                  className="!border !border-border rounded-lg bg-background overflow-hidden group"
                >
                  <AccordionTrigger className="hover:no-underline" style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                    <div className="flex items-center w-full" style={{ gap: 'var(--spacing-3)' }}>
                      <div className="flex-1 min-w-0 text-left" style={{ marginRight: 'var(--spacing-3)' }}>
                        <div className="flex items-center flex-wrap" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                          <span className={`font-medium ${config.textClass}`}>
                            {config.name}
                          </span>
                          <Badge 
                            variant="outline"
                            className={getStatusColor(agentResponse.status)}
                          >
                            {agentResponse.status === 'executing' && (
                              <Loader2 style={{ width: 'calc(var(--spacing-2) + var(--spacing-0-5))', height: 'calc(var(--spacing-2) + var(--spacing-0-5))', marginRight: 'var(--spacing-1)' }} className="animate-spin" />
                            )}
                            {getStatusLabel(agentResponse.status)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground line-clamp-1 group-data-[state=open]:hidden">
                          {agentResponse.message}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent style={{ padding: '0 var(--spacing-4) var(--spacing-4)' }}>
                    <div>
                      <p>
                        {agentResponse.message}
                      </p>
                      
                      {/* Display multiple progress messages if available */}
                      {agentResponse.messages && agentResponse.messages.length > 0 && (
                        <div style={{ marginTop: 'var(--spacing-3)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                          {agentResponse.messages.map((msg: string, msgIndex: number) => (
                            <p key={msgIndex} className="text-[rgb(10,10,10)]">
                              {msg}
                            </p>
                          ))}
                        </div>
                      )}
                      
                      {/* Display tool calls if available */}
                      {agentResponse.toolCalls && agentResponse.toolCalls.length > 0 && (
                        <div style={{ marginTop: 'var(--spacing-3)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                          {agentResponse.toolCalls.map((toolCall) => (
                            <ToolCallVisualization key={toolCall.id} toolCall={toolCall} />
                          ))}
                        </div>
                      )}
                      
                      {/* Show approval buttons if needed */}
                      {agentResponse.requiresApproval && agentResponse.status === 'awaiting-approval' && (
                        <div className="flex border-t" style={{ gap: 'var(--spacing-2)', marginTop: 'var(--spacing-3)', paddingTop: 'var(--spacing-3)' }}>
                          <Button 
                            size="sm" 
                            style={{ height: 'var(--spacing-8)' }}
                            onClick={agentResponse.onApprove}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            style={{ height: 'var(--spacing-8)' }}
                            onClick={agentResponse.onReject}
                          >
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
        );
      })}
    </div>
  );
};

// Agent Tool Response component for visualizing agent actions
const AgentToolResponse = ({ 
  agentResponse 
}: { 
  agentResponse: AgentResponse;
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const config = agentConfig[agentResponse.agentType];

  const handleApprove = async () => {
    if (agentResponse.onApprove) {
      setIsApproving(true);
      await agentResponse.onApprove();
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (agentResponse.onReject) {
      setIsRejecting(true);
      await agentResponse.onReject();
      setIsRejecting(false);
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex" style={{ gap: 'var(--spacing-3)' }}>
        {/* Agent Avatar */}
        <div className={`rounded-full flex items-center justify-center flex-shrink-0 ${config.colorClass}`} style={{ width: 'var(--spacing-8)', height: 'var(--spacing-8)' }}>
          <div className={config.textClass}>
            {config.icon}
          </div>
        </div>
        
        {/* Agent Content */}
        <div className="flex-1 min-w-0">
          <div className={`rounded-lg border ${config.borderClass}`}>
            <div style={{ padding: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                {/* Agent Name and Status */}
                <div className="flex items-center flex-wrap" style={{ gap: 'var(--spacing-2)' }}>
                  <span className={`font-medium ${config.textClass}`}>
                    {config.name}
                  </span>
                  {agentResponse.status === 'executing' && (
                    <Badge variant="outline">
                      <Loader2 style={{ width: 'calc(var(--spacing-2) + var(--spacing-0-5))', height: 'calc(var(--spacing-2) + var(--spacing-0-5))', marginRight: 'var(--spacing-1)' }} className="animate-spin" />
                      Working...
                    </Badge>
                  )}
                  {agentResponse.status === 'awaiting-approval' && (
                    <Badge variant="outline" className="border-warning/20 text-warning">
                      Awaiting Approval
                    </Badge>
                  )}
                </div>
                
                {/* Agent Message */}
                <p className="leading-relaxed text-foreground">
                  {agentResponse.message}
                </p>
                
                {/* Approval Buttons */}
                {agentResponse.requiresApproval && agentResponse.status === 'awaiting-approval' && (
                  <div className="flex items-center" style={{ gap: 'var(--spacing-2)', paddingTop: 'var(--spacing-2)' }}>
                    <Button
                      size="sm"
                      onClick={handleApprove}
                      disabled={isApproving || isRejecting}
                      className="bg-primary hover:bg-primary/90"
                      style={{ height: 'var(--spacing-8)' }}
                    >
                      {isApproving ? (
                        <>
                          <Loader2 style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)', marginRight: 'var(--spacing-1)' }} className="animate-spin" />
                          Approving...
                        </>
                      ) : (
                        'Approve'
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleReject}
                      disabled={isApproving || isRejecting}
                      style={{ height: 'var(--spacing-8)' }}
                    >
                      {isRejecting ? (
                        <>
                          <Loader2 style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)', marginRight: 'var(--spacing-1)' }} className="animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        'Reject'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Suggested prompt card component
const SuggestedPromptCard = ({ 
  prompt, 
  onClick 
}: { 
  prompt: any; 
  onClick: (prompt: string) => void;
}) => {
  return (
    <Card className="hover:bg-muted/30 transition-all duration-200 cursor-pointer border-dashed" 
          onClick={() => onClick(prompt.title)}>
      <CardContent style={{ padding: 'var(--spacing-4)' }}>
        <div className="flex items-start" style={{ gap: 'var(--spacing-3)' }}>
          {prompt.icon}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium" style={{ marginBottom: 'var(--spacing-1)' }}>{prompt.title}</h4>
            <p className="text-muted-foreground">{prompt.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function ChatLayout({ 
  projectId, 
  inboxMessages = [], 
  onClearInboxMessages,
  selectedChatSession,
  chatSessions,
  onCreateNewChatSession,
  taskPrompt,
  onTaskPromptProcessed,
  pendingProjectMessage,
  onClearPendingMessage
}: ChatLayoutProps) {
  const [selectedChatId, setSelectedChatId] = useState<string>(selectedChatSession || '1');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [previewArtifact, setPreviewArtifact] = useState<any>(null);
  const [highlightedArtifactId, setHighlightedArtifactId] = useState<string | null>(null);
  const [isNewChat, setIsNewChat] = useState(false);
  const [showInboxNotification, setShowInboxNotification] = useState(false);
  
  // Add a trigger to force re-render when messages are added
  const [messageUpdateTrigger, setMessageUpdateTrigger] = useState(0);
  
  // Prompt templates state
  const [showCommands, setShowCommands] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  
  // Agent mentions state
  const [showAgents, setShowAgents] = useState(false);
  const [agentSearch, setAgentSearch] = useState('');
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(0);
  const [mentionedAgents, setMentionedAgents] = useState<typeof availableAgents>([]);

  // Task execution messages state
  const [taskExecutionMessages, setTaskExecutionMessages] = useState<Message[]>([]);

  // Message action states
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  
  // Active agent state - default to Kajoo Assistant
  const [selectedActiveAgent, setSelectedActiveAgent] = useState(availableAgents[0]);
  const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState(false);

  // Helper function to extract mentioned agents from message input
  const extractMentionedAgents = (text: string) => {
    const mentionMatches = text.match(/@\w+/g) || [];
    const mentionedHandles = mentionMatches.map(mention => mention.substring(1));
    const agents = availableAgents.filter(agent => 
      mentionedHandles.includes(agent.handle)
    );
    return agents;
  };

  // Function to remove an agent mention from the message input
  const removeMentionedAgent = (agentHandle: string) => {
    const mentionPattern = new RegExp(`@${agentHandle}\\s*`, 'g');
    const updatedMessage = messageInput.replace(mentionPattern, '');
    setMessageInput(updatedMessage);
  };

  // Handle text input changes for commands and mentions
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessageInput(newValue);
    
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
    const textBeforeCursor = messageInput;
    const commandMatch = textBeforeCursor.match(/\/\w*$/);
    
    if (commandMatch) {
      const beforeCommand = textBeforeCursor.substring(0, commandMatch.index);
      const newValue = `${beforeCommand}${command.label} `;
      setMessageInput(newValue);
    }
    
    setShowCommands(false);
    setCommandSearch('');
  };

  // Handle keyboard navigation and actions
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle command navigation
    if (showCommands && filteredCommands.length > 0) {
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
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault();
          handleCommandSelect(filteredCommands[selectedCommandIndex]);
        }
      } else if (e.key === 'Escape') {
        setShowCommands(false);
        setCommandSearch('');
      }
    }
    
    // Handle agent navigation
    if (showAgents && filteredAgents.length > 0) {
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
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault();
          handleAgentSelect(filteredAgents[selectedAgentIndex]);
        }
      } else if (e.key === 'Escape') {
        setShowAgents(false);
        setAgentSearch('');
      }
    }
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    console.log('🚀 Sending message:', messageInput);
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageInput.trim(),
      timestamp: timestamp
    };
    
    let targetSessionId = selectedChatId;
    
    if (isNewChat && onCreateNewChatSession) {
      const title = messageInput.trim().slice(0, 30) + (messageInput.trim().length > 30 ? '...' : '');
      targetSessionId = onCreateNewChatSession(title, messageInput.trim(), '');
      
      setSelectedChatId(targetSessionId);
      setIsNewChat(false);
      chatContentBySession[targetSessionId] = [userMessage];
    } else {
      if (!chatContentBySession[targetSessionId]) {
        chatContentBySession[targetSessionId] = [];
      }
      chatContentBySession[targetSessionId].push(userMessage);
    }
    
    console.log('✅ User message added to session:', targetSessionId);
    setMessageInput('');
    
    setTimeout(() => {
      console.log('🔄 Forcing re-render for chat update');
      setMessageUpdateTrigger(Date.now());
    }, 50);
  };

  // Message Action Handlers
  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      showSuccess('Copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
      try {
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showSuccess('Copied to clipboard');
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
        showError('Failed to copy to clipboard');
      }
    }
  };

  const handleRetryMessage = (messageId: string) => {
    const targetSessionId = selectedChatId || '1';
    const sessionMessages = chatContentBySession[targetSessionId] || [];
    
    const messageIndex = sessionMessages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    let userMessage = null;
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (sessionMessages[i].role === 'user') {
        userMessage = sessionMessages[i];
        break;
      }
    }

    if (!userMessage) return;

    const newResponse: Message = {
      id: `retry-${Date.now()}`,
      role: 'assistant',
      content: `🔄 **Regenerated Response**\n\nLet me provide an alternative perspective on: "${userMessage.content}"\n\n**Updated Analysis:**\n\n1. **Alternative Approach** - Consider this different angle to the problem\n2. **Additional Context** - Here are some extra considerations\n3. **Best Practices** - Industry standard recommendations\n4. **Next Steps** - Refined action items based on current context\n\nWould you like me to dive deeper into any of these points?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    chatContentBySession[targetSessionId].push(newResponse);
    setMessageUpdateTrigger(Date.now());
    showSuccess('Response regenerated');

    setTimeout(() => {
      const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }, 100);
  };

  const handleStartEdit = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditedContent(content);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedContent('');
  };

  const handleSaveEdit = (messageId: string) => {
    if (!editedContent.trim()) return;

    const targetSessionId = selectedChatId || '1';
    const sessionMessages = chatContentBySession[targetSessionId] || [];
    
    const messageIndex = sessionMessages.findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
      sessionMessages[messageIndex].content = editedContent;
    }

    const aiResponse: Message = {
      id: `edit-response-${Date.now()}`,
      role: 'assistant',
      content: `I see you've updated your message. Let me respond to your revised question:\n\n"${editedContent}"\n\n**Updated Response:**\n\nBased on your clarification, here's an adjusted perspective:\n\n• **Context Understanding** - I now better understand what you're asking\n• **Targeted Guidance** - Here's more specific advice for your needs\n• **Actionable Steps** - Concrete next steps based on the updated information\n\nFeel free to continue refining your questions!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    chatContentBySession[targetSessionId].push(aiResponse);
    setEditingMessageId(null);
    setEditedContent('');
    setMessageUpdateTrigger(Date.now());
    showSuccess('Message updated');

    setTimeout(() => {
      const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }, 100);
  };

  const handleInboxApprove = (item: InboxItem) => {
    const userMessage: Message = {
      id: `inbox-user-${Date.now()}`,
      role: 'user',
      content: `I approve the suggestion: "${item.title}"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const aiResponse: Message = {
      id: `inbox-ai-${Date.now() + 1}`,
      role: 'assistant',
      content: `Great! I've approved your suggestion for "${item.title}". I'll proceed with implementing this change. Here's what I'll do:\n\n${item.details}\n\nI'll get started on this right away and keep you updated on the progress.`,
      timestamp: new Date(Date.now() + 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const targetSessionId = selectedChatId || '1';
    if (!chatContentBySession[targetSessionId]) {
      chatContentBySession[targetSessionId] = [];
    }
    chatContentBySession[targetSessionId].push(userMessage, aiResponse);
    setMessageUpdateTrigger(Date.now());

    setTimeout(() => {
      const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }, 100);
  };

  const handleInboxReject = (item: InboxItem, note?: string) => {
    const userMessage: Message = {
      id: `inbox-user-${Date.now()}`,
      role: 'user',
      content: `I reject the suggestion: "${item.title}"${note ? `\n\nReason: ${note}` : ''}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const aiResponse: Message = {
      id: `inbox-ai-${Date.now() + 1}`,
      role: 'assistant',
      content: `Understood. I've noted that you've rejected the suggestion for "${item.title}". I'll remove this from the recommended actions and won't proceed with this change.\n\nIs there anything specific about this suggestion you'd like me to address differently in the future?`,
      timestamp: new Date(Date.now() + 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const targetSessionId = selectedChatId || '1';
    if (!chatContentBySession[targetSessionId]) {
      chatContentBySession[targetSessionId] = [];
    }
    chatContentBySession[targetSessionId].push(userMessage, aiResponse);
    setMessageUpdateTrigger(Date.now());

    setTimeout(() => {
      const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }, 100);
  };

  const handleInboxReply = (item: InboxItem, reply: string) => {
    const userMessage: Message = {
      id: `inbox-user-${Date.now()}`,
      role: 'user',
      content: `Reply to: "${item.title}"\n\n${reply}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const aiResponse: Message = {
      id: `inbox-ai-${Date.now() + 1}`,
      role: 'assistant',
      content: `Thank you for providing that information regarding "${item.title}". Based on your response, I now have the details I need to proceed effectively.\n\nI'll use this information to update my recommendations and continue with the project tasks. Let me know if you need any clarification or have additional input.`,
      timestamp: new Date(Date.now() + 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const targetSessionId = selectedChatId || '1';
    if (!chatContentBySession[targetSessionId]) {
      chatContentBySession[targetSessionId] = [];
    }
    chatContentBySession[targetSessionId].push(userMessage, aiResponse);
    setMessageUpdateTrigger(Date.now());

    setTimeout(() => {
      const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }, 100);
  };

  // Effect to sync with external chat session selection
  useEffect(() => {
    if (selectedChatSession === null) {
      setIsNewChat(true);
      setSelectedChatId('');
    } else if (selectedChatSession && selectedChatSession !== selectedChatId) {
      setSelectedChatId(selectedChatSession);
      setIsNewChat(false);
    }
  }, [selectedChatSession]);

  // Effect to handle new inbox messages
  useEffect(() => {
    if (inboxMessages.length > 0) {
      setShowInboxNotification(true);
      
      if (selectedChatId !== '1') {
        setSelectedChatId('1');
        setIsNewChat(false);
      }
      
      setTimeout(() => {
        const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollArea) {
          scrollArea.scrollTop = scrollArea.scrollHeight;
        }
      }, 100);
      
      setTimeout(() => {
        setShowInboxNotification(false);
      }, 3000);
    }
  }, [inboxMessages.length, selectedChatId]);

  // Effect to handle task prompt execution
  useEffect(() => {
    if (taskPrompt && onTaskPromptProcessed) {
      if (selectedChatId !== '1') {
        setSelectedChatId('1');
        setIsNewChat(false);
      }

      const userMessage: Message = {
        id: `task-${Date.now()}`,
        role: 'user',
        content: taskPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const agentResponse: Message = {
        id: `task-agent-${Date.now()}`,
        role: 'assistant',
        content: `✅ **Task execution initiated!**\n\nI've received your task execution request and I'm analyzing the requirements. Here's my approach:\n\n**🔍 Analysis Phase:**\n- Reviewing task specifications and requirements\n- Identifying dependencies and prerequisites\n- Assessing complexity and potential challenges\n\n**📋 Planning Phase:**\n- Creating detailed implementation steps\n- Estimating resource requirements\n- Setting up validation checkpoints\n\n**🚀 Execution Phase:**\n- Implementing the solution following best practices\n- Generating necessary artifacts and documentation\n- Running validation tests\n\nI'll keep you updated as I progress through each phase. You can monitor the execution status in your task dashboard.`,
        timestamp: new Date(Date.now() + 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        artifacts: [
          {
            id: `task-artifact-${Date.now()}`,
            name: 'Task Execution Plan',
            title: 'Task Execution Plan',
            type: 'hybrid',
            description: 'Detailed execution plan with steps, timelines, and deliverables',
            summary: 'Detailed execution plan with steps, timelines, and deliverables',
            createdAt: new Date().toISOString()
          }
        ]
      };

      setTaskExecutionMessages([userMessage, agentResponse]);

      setTimeout(() => {
        setMessageUpdateTrigger(Date.now());
        
        setTimeout(() => {
          const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
          if (scrollArea) {
            scrollArea.scrollTop = scrollArea.scrollHeight;
          }
        }, 100);
      }, 50);

      onTaskPromptProcessed();
    }
  }, [taskPrompt, onTaskPromptProcessed, selectedChatId]);

  // Effect to handle pending project message
  useEffect(() => {
    if (pendingProjectMessage && onClearPendingMessage) {
      console.log('🎯 Processing pending project message in ChatLayout:', pendingProjectMessage);
      
      if (selectedChatSession) {
        console.log('🎯 Setting up chat session with project creation conversation:', selectedChatSession);
        
        setSelectedChatId(selectedChatSession);
        setIsNewChat(false);

        const userMessage: Message = {
          id: `project-user-${Date.now()}`,
          role: 'user',
          content: pendingProjectMessage.userMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const aiResponse: Message = {
          id: `project-ai-${Date.now()}`,
          role: 'assistant',
          content: pendingProjectMessage.aiResponse,
          timestamp: new Date(Date.now() + 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        chatContentBySession[selectedChatSession] = [userMessage, aiResponse];
        
        console.log('✅ Chat session initialized with project creation conversation');

        setMessageUpdateTrigger(Date.now() + Math.random());

        setTimeout(() => {
          const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
          if (scrollArea) {
            scrollArea.scrollTop = scrollArea.scrollHeight;
          }
        }, 200);

        setTimeout(() => {
          onClearPendingMessage();
        }, 500);
      }
    }
  }, [pendingProjectMessage, selectedChatSession, onClearPendingMessage]);

  const sessionsData = chatSessions || mockChatSessions;
  const filteredSessions = sessionsData.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChat = sessionsData.find(chat => chat.id === selectedChatId);
  const baseMessages = isNewChat ? [] : (chatContentBySession[selectedChatId] || [
    {
      id: 'welcome',
      role: 'assistant' as const,
      content: 'Hello! I\'m your AI assistant for the migration project. How can I help you today?',
      timestamp: 'just now'
    }
  ]);
  
  const currentMessages = useMemo(() => {
    if (isNewChat && selectedChatId === '') return baseMessages;
    
    const targetSessionId = selectedChatId || '1';
    const sessionMessages = chatContentBySession[targetSessionId] || [];
    
    const allMessages = [...sessionMessages];
    
    if (inboxMessages.length > 0) {
      allMessages.push(...inboxMessages);
    }
    
    if (taskExecutionMessages.length > 0) {
      allMessages.push(...taskExecutionMessages);
    }
    
    return allMessages.sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.timestamp}`).getTime();
      const timeB = new Date(`1970/01/01 ${b.timestamp}`).getTime();
      return timeA - timeB;
    });
  }, [baseMessages, inboxMessages, taskExecutionMessages, selectedChatId, isNewChat, messageUpdateTrigger]);

  const handleNewChat = () => {
    setIsNewChat(true);
    setSelectedChatId('');
    console.log('Creating new chat...');
  };

  const handleSessionSelect = (sessionId: string) => {
    setSelectedChatId(sessionId);
    setIsNewChat(false);
    setHighlightedArtifactId(null);
    
    if (inboxMessages.length > 0 && onClearInboxMessages) {
      setTimeout(() => {
        onClearInboxMessages();
      }, 2000);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    console.log('🎯 Suggested prompt clicked:', prompt);
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: timestamp
    };
    
    let targetSessionId = selectedChatId;
    
    if (isNewChat && onCreateNewChatSession) {
      const title = prompt.slice(0, 30) + (prompt.length > 30 ? '...' : '');
      targetSessionId = onCreateNewChatSession(title, prompt, '');
      
      setSelectedChatId(targetSessionId);
      setIsNewChat(false);
      
      chatContentBySession[targetSessionId] = [userMessage];
    } else {
      if (!chatContentBySession[targetSessionId]) {
        chatContentBySession[targetSessionId] = [];
      }
      chatContentBySession[targetSessionId].push(userMessage);
    }
    
    console.log('✅ User message added to session:', targetSessionId);
    
    setMessageInput('');
    
    setTimeout(() => {
      console.log('🔄 Forcing re-render for chat update');
      setMessageUpdateTrigger(Date.now());
    }, 50);
  };

  // Filter commands based on search
  const filteredCommands = quickCommands.filter(command =>
    command.label.toLowerCase().includes(commandSearch.toLowerCase()) ||
    command.description.toLowerCase().includes(commandSearch.toLowerCase())
  );

  // Filter agents based on search
  const filteredAgents = availableAgents.filter(agent =>
    agent.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
    agent.handle.toLowerCase().includes(agentSearch.toLowerCase()) ||
    agent.role.toLowerCase().includes(agentSearch.toLowerCase()) ||
    agent.description.toLowerCase().includes(agentSearch.toLowerCase())
  );

  const handleAgentSelect = (agent: typeof availableAgents[0]) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const cursorPosition = textarea.selectionStart || 0;
    const textBeforeCursor = messageInput.slice(0, cursorPosition);
    const textAfterCursor = messageInput.slice(cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    let finalMessage = '';
    let beforeAt = '';
    
    if (lastAtIndex !== -1) {
      beforeAt = messageInput.slice(0, lastAtIndex);
      const mentionText = `@${agent.handle}`;
      const hasTextAfter = textAfterCursor.trim().length > 0;
      finalMessage = beforeAt + mentionText + (hasTextAfter ? ' ' : '') + textAfterCursor;
    } else {
      finalMessage = `@${agent.handle}`;
    }
    
    setMessageInput(finalMessage);
    
    setShowAgents(false);
    setAgentSearch('');
    setSelectedAgentIndex(0);
    
    setTimeout(() => {
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
      if (textarea) {
        const mentionEnd = beforeAt.length + `@${agent.handle}`.length + (textAfterCursor.trim().length > 0 ? 1 : 0);
        textarea.setSelectionRange(mentionEnd, mentionEnd);
        textarea.focus();
      }
    }, 50);
  };

  const handleArtifactPreview = (artifact: any) => {
    console.log('Preview artifact:', artifact);
    setPreviewArtifact(artifact);
  };

  const handleHighlightInChat = (artifactId: string) => {
    setHighlightedArtifactId(artifactId);
    setTimeout(() => {
      setHighlightedArtifactId(null);
    }, 3000);
  };

  const handleStarSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Star session:', sessionId);
  };

  const handleRenameSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Rename session:', sessionId);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Delete session:', sessionId);
  };

  const handleActiveAgentChange = (agent: typeof availableAgents[0]) => {
    setSelectedActiveAgent(agent);
    setIsAgentDropdownOpen(false);
    showSuccess(`Switched to ${agent.name}`);
  };

  const renderChatContent = () => {
    if (isNewChat) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="mx-auto text-center" style={{ maxWidth: '42rem', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div className="mx-auto bg-primary/10 rounded-full flex items-center justify-center" style={{ width: 'var(--spacing-16)', height: 'var(--spacing-16)' }}>
                <Bot className="text-primary" style={{ width: 'var(--spacing-8)', height: 'var(--spacing-8)' }} />
              </div>
              <div>
                <h2 style={{ marginBottom: 'var(--spacing-2)' }}>Start a new conversation</h2>
                <p className="text-muted-foreground">
                  Choose a suggested prompt below or ask me anything about your Sitecore migration.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 justify-center justify-items-center mx-auto" style={{ gap: 'var(--spacing-3)', maxWidth: '64rem' }}>
              {suggestedPrompts.map((prompt, index) => (
                <SuggestedPromptCard
                  key={index}
                  prompt={prompt}
                  onClick={handleSuggestedPrompt}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentMessages.length === 0) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="text-muted-foreground mx-auto" style={{ width: 'var(--spacing-12)', height: 'var(--spacing-12)', marginBottom: 'var(--spacing-4)' }} />
            <h3>No messages yet</h3>
            <p className="text-muted-foreground">Start the conversation below</p>
          </div>
        </div>
      );
    }

    return (
      <ScrollArea className="h-full">
        <div className="w-full flex justify-center" style={{ padding: 'var(--spacing-4)', paddingBottom: 'var(--spacing-6)' }}>
          <div className="w-full" style={{ maxWidth: '64rem', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            {currentMessages.map((message) => (
              <div key={message.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                {message.role === 'assistant' && message.agentResponses && message.agentResponses.length > 0 && (
                  <div className="w-full">
                    {renderAgentDelegation(message.agentResponses)}
                  </div>
                )}
                
                <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : ''}`} style={{ gap: 'var(--spacing-3)' }}>
                  {message.role === 'assistant' ? (
                    <div className="rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0" style={{ width: 'var(--spacing-8)', height: 'var(--spacing-8)' }}>
                      <Bot className="text-primary" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                    </div>
                  ) : (
                    <div className="rounded-full bg-secondary flex items-center justify-center flex-shrink-0" style={{ width: 'var(--spacing-8)', height: 'var(--spacing-8)' }}>
                      <span className="font-medium text-secondary-foreground">
                        You
                      </span>
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[80%] flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                    style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}
                    onMouseEnter={() => setHoveredMessageId(message.id)}
                    onMouseLeave={() => setHoveredMessageId(null)}
                  >
                    {message.role === 'assistant' && message.reasoning && (
                      <ReasoningSection 
                        reasoning={message.reasoning}
                        duration={message.reasoningDuration}
                      />
                    )}
                    
                    {message.role === 'assistant' && message.toolCalls && message.toolCalls.length > 0 && (
                      <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                        {message.toolCalls.map((toolCall) => (
                          <ToolCallVisualization 
                            key={toolCall.id}
                            toolCall={toolCall}
                          />
                        ))}
                      </div>
                    )}
                    
                    {editingMessageId === message.id ? (
                      <div 
                        className="w-full border border-border bg-card rounded-lg"
                        style={{
                          borderRadius: 'var(--radius-md)',
                          padding: 'var(--spacing-2-5)'
                        }}
                      >
                        <Textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full min-h-[100px] resize-none"
                          autoFocus
                          style={{
                            marginBottom: 'var(--spacing-2)'
                          }}
                        />
                        <div className="flex items-center justify-end" style={{ gap: 'var(--spacing-2)' }}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                            style={{
                              height: 'var(--spacing-8)',
                              padding: '0 var(--spacing-3)',
                              borderRadius: 'var(--radius-sm)'
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(message.id)}
                            style={{
                              height: 'var(--spacing-8)',
                              padding: '0 var(--spacing-3)',
                              gap: 'var(--spacing-1-5)',
                              borderRadius: 'var(--radius-sm)'
                            }}
                          >
                            <Send style={{ width: '0.875rem', height: '0.875rem' }} />
                            Send
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className={`w-full rounded-lg whitespace-pre-wrap relative ${message.role === 'user' ? 'bg-primary text-primary-foreground' : (message as any).source === 'inbox-action' ? 'bg-info/10 dark:bg-info/20 border border-info/50 dark:border-info/30' : 'bg-muted'}`} style={{ padding: 'var(--spacing-3)' }}>
                        {(message as any).source === 'inbox-action' && (
                          <div className="flex items-center text-info" style={{ gap: 'var(--spacing-1-5)', marginBottom: 'var(--spacing-2)' }}>
                            <Inbox style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
                            <span className="font-medium">Agent Response</span>
                          </div>
                        )}
                        {message.content}
                      </div>
                    )}
                   
                    {message.artifacts && message.artifacts.length > 0 && (
                      <div className={`w-full ${message.role === 'user' ? 'flex flex-col items-end' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                        {message.artifacts.map((artifact) => (
                          <ArtifactCard
                            key={artifact.id}
                            artifact={artifact}
                            onPreview={handleArtifactPreview}
                            isHighlighted={highlightedArtifactId === artifact.id}
                          />
                        ))}
                      </div>
                    )}
                   
                    {message.inboxItems && message.inboxItems.length > 0 && (
                      <div className={`w-full ${message.role === 'user' ? 'flex flex-col items-end' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                        {message.inboxItems.map((item) => (
                          <AIInboxCard
                            key={item.id}
                            item={item}
                            onApprove={handleInboxApprove}
                            onReject={handleInboxReject}
                            onReply={handleInboxReply}
                            onNavigateToTask={(taskId, taskName) => {
                              console.log('Navigate to task:', taskId, taskName);
                            }}
                          />
                        ))}
                      </div>
                    )}
                   
                    <div 
                      className={`flex items-center ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      style={{ gap: 'var(--spacing-2)' }}
                    >
                      {message.role === 'assistant' || message.role === 'ai' ? (
                        <div className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleRetryMessage(message.id)}
                                className="text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-colors p-0 bg-transparent border-0 cursor-pointer flex items-center justify-center"
                                style={{
                                  height: 'var(--spacing-8)',
                                  width: 'var(--spacing-8)',
                                  borderRadius: 'var(--radius-sm)'
                                }}
                              >
                                <RefreshCw style={{ width: '1.125rem', height: '1.125rem' }} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Regenerate response</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleCopyMessage(message.content)}
                                className="text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-colors p-0 bg-transparent border-0 cursor-pointer flex items-center justify-center"
                                style={{
                                  height: 'var(--spacing-8)',
                                  width: 'var(--spacing-8)',
                                  borderRadius: 'var(--radius-sm)'
                                }}
                              >
                                <Copy style={{ width: '1.125rem', height: '1.125rem' }} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ) : message.role === 'user' && editingMessageId !== message.id ? (
                        <div className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleStartEdit(message.id, message.content)}
                                className={`text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all p-0 bg-transparent border-0 cursor-pointer flex items-center justify-center ${hoveredMessageId === message.id ? 'opacity-100' : 'opacity-0'}`}
                                style={{
                                  height: 'var(--spacing-8)',
                                  width: 'var(--spacing-8)',
                                  borderRadius: 'var(--radius-sm)',
                                  transitionDuration: '300ms'
                                }}
                              >
                                <Edit2 style={{ width: '1.125rem', height: '1.125rem' }} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit message</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ) : null}
                     
                      <div className="flex items-center text-muted-foreground" style={{ gap: 'var(--spacing-1)' }}>
                        <Clock style={{ width: '0.875rem', height: '0.875rem' }} />
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    );
  };

  return (
    <TooltipProvider>
      <div className="flex h-full">
        <div className="flex-1 flex flex-col h-full">
          {/* Chat Header */}
          <div className="border-b border-border bg-card flex-shrink-0" style={{ padding: 'var(--spacing-4)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center" style={{ gap: 'var(--spacing-3)' }}>
                {isNewChat ? (
                  <>
                    <Plus className="text-primary" style={{ width: 'var(--spacing-5)', height: 'var(--spacing-5)' }} />
                    <div>
                      <h3 className="font-medium">New Chat</h3>
                      <p className="text-muted-foreground">AI Migration Agent</p>
                    </div>
                  </>
                ) : selectedChat ? (
                  <>
                    {selectedChat.type === 'agent' ? (
                      <Bot className="text-primary" style={{ width: 'var(--spacing-5)', height: 'var(--spacing-5)' }} />
                    ) : (
                      <MessageSquare className="text-muted-foreground" style={{ width: 'var(--spacing-5)', height: 'var(--spacing-5)' }} />
                    )}
                    <div>
                      <h3 className="font-medium">{selectedChat.title}</h3>
                      <p className="text-muted-foreground">
                        {selectedChat.type === 'agent' ? 'AI Migration Agent' : 'Chat Session'}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <MessageSquare className="text-muted-foreground" style={{ width: 'var(--spacing-5)', height: 'var(--spacing-5)' }} />
                    <div>
                      <h3 className="font-medium">No Chat Selected</h3>
                      <p className="text-muted-foreground">Select a conversation</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                <span className="text-muted-foreground">Active Agent:</span>
                <DropdownMenu open={isAgentDropdownOpen} onOpenChange={setIsAgentDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                      style={{
                        gap: 'var(--spacing-2)',
                        padding: 'var(--spacing-2) var(--spacing-3)',
                        borderRadius: 'var(--radius-md)'
                      }}
                      disabled={false}
                    >
                      <div 
                        className={`rounded flex items-center justify-center ${selectedActiveAgent.avatar.bg}`}
                        style={{
                          width: 'var(--spacing-7)',
                          height: 'var(--spacing-7)',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        <selectedActiveAgent.avatar.icon className={`${selectedActiveAgent.avatar.iconColor}`} style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                      </div>
                      <span className="font-medium">{selectedActiveAgent.name}</span>
                      <ChevronRight className="text-muted-foreground rotate-90" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-72"
                    style={{
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div style={{ padding: 'var(--spacing-2)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                      {availableAgents.map((agent) => {
                        const IconComponent = agent.avatar.icon;
                        const isSelected = agent.id === selectedActiveAgent.id;
                        return (
                          <DropdownMenuItem
                            key={agent.id}
                            onClick={() => handleActiveAgentChange(agent)}
                            className={`flex items-center cursor-pointer ${isSelected ? 'bg-accent' : ''}`}
                            style={{
                              gap: 'var(--spacing-3)',
                              padding: 'var(--spacing-3)',
                              borderRadius: 'var(--radius-sm)'
                            }}
                          >
                            <div 
                              className={`rounded flex items-center justify-center ${agent.avatar.bg}`}
                              style={{
                                width: 'var(--spacing-9)',
                                height: 'var(--spacing-9)',
                                borderRadius: 'var(--radius-sm)'
                              }}
                            >
                              <IconComponent className={agent.avatar.iconColor} style={{ width: 'var(--spacing-5)', height: 'var(--spacing-5)' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                                <span className="font-medium">{agent.name}</span>
                                {isSelected && (
                                  <Check className="text-primary" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                                )}
                              </div>
                              <p className="text-muted-foreground truncate">
                                {agent.role}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        );
                      })}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
           
            {showInboxNotification && (
              <div className="absolute top-full left-4 right-4 z-10 -mt-1">
                <div className="bg-info text-white px-3 py-2 rounded-b-lg shadow-lg animate-in slide-in-from-top-1 fade-in-0">
                  <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                    <Inbox style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
                    <span>Agent responded to your inbox action</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            {renderChatContent()}
          </div>

          <div className="bg-card flex-shrink-0">
            <div className="w-full flex justify-center bg-background/50 backdrop-blur-sm" style={{ padding: 'var(--spacing-6)' }}>
              <div className="w-full" style={{ maxWidth: '80rem' }}>
                <div className="relative">
                  {showCommands && (
                    <div className="absolute bottom-full left-0 right-0 z-50" style={{ marginBottom: 'var(--spacing-3)' }}>
                      <div className="bg-popover border border-border rounded-xl shadow-xl max-h-72 overflow-hidden flex flex-col">
                        <div className="border-b border-border bg-muted/50 flex-shrink-0" style={{ padding: 'var(--spacing-3)' }}>
                          <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                            <Zap className="text-primary" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                            <span className="font-medium">Prompt Templates</span>
                            <Badge variant="outline" className="ml-auto">
                              {filteredCommands.length}
                            </Badge>
                          </div>
                        </div>
                        <div className="overflow-y-auto" style={{ padding: 'var(--spacing-2)' }}>
                          {filteredCommands.length > 0 ? (
                            filteredCommands.map((command, index) => {
                              const IconComponent = command.icon;
                              const isSelected = index === selectedCommandIndex;
                              return (
                                <button
                                  key={command.id}
                                  onClick={() => handleCommandSelect(command)}
                                  className={`w-full flex items-center rounded-lg text-left transition-all duration-200 ${isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50 hover:text-accent-foreground'}`}
                                  style={{
                                    gap: 'var(--spacing-4)',
                                    padding: 'var(--spacing-3) var(--spacing-4)'
                                  }}
                                >
                                  <div className="flex-shrink-0">
                                    <div className={`rounded-lg flex items-center justify-center transition-colors ${isSelected ? 'bg-primary/10' : 'bg-muted'}`} style={{ width: 'var(--spacing-10)', height: 'var(--spacing-10)' }}>
                                      <IconComponent className={`transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} style={{ width: 'var(--spacing-5)', height: 'var(--spacing-5)' }} />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-1)' }}>
                                      <span className="font-medium">
                                        {command.label}
                                      </span>
                                      <Badge variant="outline">
                                        {command.shortcut}
                                      </Badge>
                                    </div>
                                    <p className="text-muted-foreground">
                                      {command.description}
                                    </p>
                                  </div>
                                </button>
                              );
                            })
                          ) : (
                            <div className="text-center text-muted-foreground" style={{ padding: 'var(--spacing-4) var(--spacing-4) var(--spacing-6)' }}>
                              <Zap className="mx-auto opacity-50" style={{ width: 'var(--spacing-8)', height: 'var(--spacing-8)', marginBottom: 'var(--spacing-2)' }} />
                              <p>No commands found</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {showAgents && (
                    <div className="absolute bottom-full left-0 right-0 z-50" style={{ marginBottom: 'var(--spacing-3)' }}>
                      <div className="bg-popover border border-border rounded-xl shadow-xl max-h-72 overflow-y-auto">
                        <div className="border-b border-border bg-muted/50" style={{ padding: 'var(--spacing-3)' }}>
                          <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                            <Bot className="text-primary" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                            <span className="font-medium">Available Agents</span>
                            <Badge variant="outline" className="ml-auto">
                              {filteredAgents.length}
                            </Badge>
                          </div>
                        </div>
                        <div style={{ padding: 'var(--spacing-2)' }}>
                          {filteredAgents.length > 0 ? (
                            filteredAgents.map((agent, index) => {
                              const IconComponent = agent.avatar.icon;
                              return (
                                <button
                                  key={agent.id}
                                  onClick={() => handleAgentSelect(agent)}
                                  className={`w-full flex items-center rounded-lg text-left transition-all duration-200 ${index === selectedAgentIndex ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm scale-[1.02]' : 'hover:bg-accent hover:text-accent-foreground'}`}
                                  style={{
                                    gap: 'var(--spacing-4)',
                                    padding: 'var(--spacing-3) var(--spacing-4)'
                                  }}
                                >
                                  <div className="flex-shrink-0">
                                    <div className={`rounded-xl flex items-center justify-center shadow-sm ${agent.avatar.bg}`} style={{ width: 'var(--spacing-12)', height: 'var(--spacing-12)' }}>
                                      <IconComponent className="text-white" style={{ width: 'var(--spacing-6)', height: 'var(--spacing-6)' }} />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-1)' }}>
                                      <span className={`font-medium transition-colors ${index === selectedAgentIndex ? 'text-primary' : ''}`}>{agent.name}</span>
                                      <Badge variant={index === selectedAgentIndex ? "default" : "secondary"}>
                                        @{agent.handle}
                                      </Badge>
                                    </div>
                                    <p className={`transition-colors ${index === selectedAgentIndex ? 'text-primary/70' : 'text-muted-foreground'}`} style={{ marginBottom: 'var(--spacing-1)' }}>
                                      {agent.role}
                                    </p>
                                    <p className={`line-clamp-1 transition-colors ${index === selectedAgentIndex ? 'text-primary/60' : 'text-muted-foreground/80'}`}>
                                      {agent.description}
                                    </p>
                                  </div>
                                </button>
                              );
                            })
                          ) : (
                            <div className="text-center text-muted-foreground" style={{ padding: 'var(--spacing-4) var(--spacing-4) var(--spacing-6)' }}>
                              <Bot className="mx-auto opacity-50" style={{ width: 'var(--spacing-8)', height: 'var(--spacing-8)', marginBottom: 'var(--spacing-2)' }} />
                              <p>No agents found</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                 
                  <div className="relative">
                    {mentionedAgents.length > 0 && (
                      <div style={{ marginBottom: 'var(--spacing-3)', padding: '0 var(--spacing-1)' }}>
                        <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                          <span className="font-medium text-muted-foreground">Mentioned:</span>
                        </div>
                        <div className="flex items-center flex-wrap" style={{ gap: 'var(--spacing-2)' }}>
                          {mentionedAgents.map((agent) => {
                            const IconComponent = agent.avatar.icon;
                            return (
                              <div 
                                key={agent.id}
                                className="inline-flex items-center bg-primary/10 text-primary border border-primary/20 rounded-lg"
                                style={{
                                  gap: 'var(--spacing-2)',
                                  padding: 'var(--spacing-1-5) var(--spacing-3)'
                                }}
                              >
                                <div className={`rounded flex items-center justify-center ${agent.avatar.bg}`} style={{ width: 'var(--spacing-5)', height: 'var(--spacing-5)' }}>
                                  <IconComponent className="text-white" style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
                                </div>
                                <span className="font-medium">@{agent.handle}</span>
                                <button
                                  onClick={() => removeMentionedAgent(agent.handle)}
                                  className="hover:bg-primary/20 rounded-full transition-colors"
                                  style={{ marginLeft: 'var(--spacing-1)', padding: 'var(--spacing-0-5)' }}
                                >
                                  <X style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                   
                    <Textarea
                      placeholder={isNewChat ? "Ask me anything about your migration...\n\nTip: Type / for prompt templates, @ for agents, or just start typing your question" : "Type your message...\n\nTip: Use / for prompt templates, @ for agents, Enter to send (Shift+Enter for new line)"}
                      value={messageInput}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      onKeyDown={handleKeyDown}
                      className="resize-none overflow-y-auto rounded-xl border-2 border-border/50 focus:border-primary/50 bg-background shadow-sm transition-all duration-200"
                      rows={6}
                      style={{
                        height: '10.5rem',
                        padding: 'var(--spacing-4) var(--spacing-6)',
                        paddingBottom: 'var(--spacing-16)'
                      }}
                    />
                    <div className="absolute flex items-center" style={{ right: 'var(--spacing-4)', bottom: 'var(--spacing-4)', gap: 'var(--spacing-2)' }}>
                      <Button 
                        size="sm" 
                        className="rounded-lg shadow-sm"
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        style={{
                          height: 'var(--spacing-9)',
                          width: 'var(--spacing-9)'
                        }}
                      >
                        <Send style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ArtifactPreviewModal
          artifact={previewArtifact}
          isOpen={!!previewArtifact}
          onClose={() => setPreviewArtifact(null)}
          onHighlightInChat={handleHighlightInChat}
        />
      </div>
    </TooltipProvider>
  );
}
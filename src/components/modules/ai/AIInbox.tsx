import React, { useState, useMemo } from 'react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';
import { Textarea } from '../../ui/textarea';
import { type Project } from '../../../types/entities';
import { 
  MessageSquare,
  CheckCircle2,
  Search,
  Check,
  X,
  RefreshCw,
  Send,
  Brain,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Settings,
  Link
} from 'lucide-react';

export type InboxItemStatus = 'pending' | 'approved' | 'rejected' | 'info-requested' | 'archived';
export type InboxItemType = 'approval' | 'info-request';

export interface InboxItem {
  id: string;
  title: string;
  summary: string;
  details: string;
  type: InboxItemType;
  status: InboxItemStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  suggestedBy: 'ai-agent' | 'system';
  relatedTaskId: string; // Now required - every inbox item must be linked to a task
  relatedTaskName: string; // Display name for the linked task
  relatedArtifactId?: string;
  estimatedImpact: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  requestedInfo?: string;
  aiReasoning?: string;
  inlineReply?: string;
}

interface AIInboxProps {
  className?: string;
  selectedProject?: Project | null;
  onApprovalAction?: (item: InboxItem, action: 'approve' | 'reject', details?: string) => void;
  onInlineReply?: (item: InboxItem, reply: string) => void;
  onNavigateToTask?: (taskId: string, taskName: string) => void;
  onTransitionToChat?: (actionData: {
    action: 'approve' | 'reject' | 'reply';
    item: InboxItem;
    userResponse?: string;
  }) => void;
}

export function AIInbox({ className = '', selectedProject, onApprovalAction, onInlineReply, onNavigateToTask, onTransitionToChat }: AIInboxProps) {
  // Use the first few tasks from the project for realistic data
  const getInboxItemsWithRealTasks = () => {
    const projectTasks = selectedProject?.tasks || [];
    
    return [
      {
        id: 'inbox-1',
        title: 'Create Migration Validation Checklist',
        summary: 'Generate comprehensive checklist for validating component migrations',
        details: `Based on the current migration progress for the "${projectTasks[0]?.title || 'Component Library Migration'}" task, I recommend creating a detailed validation checklist to ensure quality and consistency across all migrated components.`,
        type: 'approval' as InboxItemType,
        status: 'pending' as InboxItemStatus,
        priority: 'high' as const,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        suggestedBy: 'ai-agent' as const,
        relatedTaskId: projectTasks[0]?.id || 'task-001',
        relatedTaskName: projectTasks[0]?.title || 'Component Library Migration',
        estimatedImpact: 'High - Will improve migration quality and reduce rework',
        aiReasoning: 'I analyzed 47 migrated components and found 12 inconsistencies in naming conventions and 8 missing accessibility attributes. A validation checklist would prevent these issues.'
      },
      {
        id: 'inbox-2', 
        title: 'Update Architecture Documentation',
        summary: 'Refresh architecture diagrams based on recent component migrations',
        details: `The current architecture documentation is outdated following recent component migrations. This relates to the "${projectTasks[1]?.title || 'System Architecture Review'}" task and requires updating system diagrams and API flows.`,
        type: 'approval' as InboxItemType,
        status: 'pending' as InboxItemStatus,
        priority: 'medium' as const,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
        suggestedBy: 'ai-agent' as const,
        relatedTaskId: projectTasks[1]?.id || 'task-002',
        relatedTaskName: projectTasks[1]?.title || 'System Architecture Review',
        relatedArtifactId: 'arch-docs-1',
        estimatedImpact: 'Medium - Improves team alignment and onboarding',
        aiReasoning: 'Current documentation shows 23 deprecated components still in use. New API endpoints for headless CMS integration need to be documented.'
      },
      {
        id: 'inbox-3',
        title: 'Performance Testing Configuration',
        summary: 'Need details about performance thresholds for automated testing setup',
        details: `To implement automated performance testing effectively for the "${projectTasks[2]?.title || 'Performance Optimization'}" task, I need to understand what performance thresholds and metrics are most important for your migration project.`,
        type: 'info-request' as InboxItemType,
        status: 'info-requested' as InboxItemStatus,
        priority: 'medium' as const,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        suggestedBy: 'ai-agent' as const,
        relatedTaskId: projectTasks[2]?.id || 'task-003',
        relatedTaskName: projectTasks[2]?.title || 'Performance Optimization',
        estimatedImpact: 'High - Prevents performance regressions',
        requestedInfo: 'What performance thresholds should we use for page load times, Core Web Vitals, and API response times?'
      },
      {
        id: 'inbox-4',
        title: 'Generate JIRA Epic for Content Migration',
        summary: 'Create structured JIRA epic with breakdown of content migration tasks',
        details: `I can create a comprehensive JIRA epic with all necessary stories for the "${projectTasks[3]?.title || 'Content Strategy Development'}" task content migration phase.`,
        type: 'approval' as InboxItemType,
        status: 'approved' as InboxItemStatus,
        priority: 'high' as const,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        suggestedBy: 'ai-agent' as const,
        relatedTaskId: projectTasks[3]?.id || 'task-004',
        relatedTaskName: projectTasks[3]?.title || 'Content Strategy Development',
        estimatedImpact: 'High - Organizes content migration workflow',
        aiReasoning: 'Identified 247 content items across 8 content types. Breaking down into templates, content models, and data migration will streamline the process.',
        approvedBy: 'Sarah Johnson',
        approvedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'inbox-5',
        title: 'Component Dependencies Clarification',
        summary: 'Need information about third-party libraries for migration scope',
        details: `To create an accurate migration plan for the "${projectTasks[4]?.title || 'Dependency Analysis'}" task, I need to understand which third-party components and libraries should be included in the migration scope.`,
        type: 'info-request' as InboxItemType,
        status: 'pending' as InboxItemStatus,
        priority: 'medium' as const,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        suggestedBy: 'ai-agent' as const,
        relatedTaskId: projectTasks[4]?.id || 'task-005',
        relatedTaskName: projectTasks[4]?.title || 'Dependency Analysis',
        estimatedImpact: 'Medium - Ensures complete migration scope',
        requestedInfo: 'Which third-party component libraries are currently in use and should be migrated or replaced?'
      }
    ];
  };

  const mockInboxItems: InboxItem[] = getInboxItemsWithRealTasks();

  const [inboxItems, setInboxItems] = useState<InboxItem[]>(mockInboxItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InboxItemStatus | 'all'>('all');
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [inlineReplies, setInlineReplies] = useState<Record<string, string>>({});
  const [sendingReplies, setSendingReplies] = useState<Set<string>>(new Set());
  const [visibleReplies, setVisibleReplies] = useState<Set<string>>(new Set());
  const [visibleRejectBoxes, setVisibleRejectBoxes] = useState<Set<string>>(new Set());
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({});

  // Filter items
  const filteredItems = useMemo(() => {
    return inboxItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [inboxItems, searchQuery, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = inboxItems.length;
    const pending = inboxItems.filter(item => item.status === 'pending').length;
    const approved = inboxItems.filter(item => item.status === 'approved').length;
    const needsAttention = inboxItems.filter(item => 
      item.status === 'info-requested' || item.priority === 'critical'
    ).length;
    
    return { total, pending, approved, needsAttention };
  }, [inboxItems]);

  // Helper functions
  const getItemIcon = (type: InboxItemType) => {
    switch (type) {
      case 'approval': return <CheckCircle2 className="text-primary" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
      case 'info-request': return <MessageSquare className="text-primary" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
      default: return <MessageSquare className="text-muted-foreground" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
    }
  };

  const getStatusBadge = (status: InboxItemStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-accent text-accent-foreground border-border">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Rejected</Badge>;
      case 'info-requested':
        return <Badge variant="outline" className="bg-secondary text-secondary-foreground border-border">Info Requested</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border">Archived</Badge>;
      default:
        return <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border">Unknown</Badge>;
    }
  };

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <div className="rounded-full bg-primary ring-2 ring-primary/20" style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />;
      case 'high':
        return <div className="rounded-full bg-primary" style={{ width: 'var(--spacing-2-5)', height: 'var(--spacing-2-5)' }} />;
      case 'medium':
        return <div className="rounded-full bg-primary/70" style={{ width: 'var(--spacing-2)', height: 'var(--spacing-2)' }} />;
      case 'low':
        return <div className="rounded-full bg-muted-foreground" style={{ width: 'var(--spacing-1-5)', height: 'var(--spacing-1-5)' }} />;
      default:
        return <div className="rounded-full bg-muted-foreground" style={{ width: 'var(--spacing-1-5)', height: 'var(--spacing-1-5)' }} />;
    }
  };

  const getRelativeTime = (date: string) => {
    const now = new Date();
    const itemDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getAgentName = (item: InboxItem) => {
    // Determine agent based on item context
    const title = item.title.toLowerCase();
    const summary = item.summary.toLowerCase();
    const taskName = item.relatedTaskName.toLowerCase();
    
    if (title.includes('migration') || taskName.includes('migration') || title.includes('validation') || summary.includes('migration')) {
      return 'Migration Agent';
    } else if (title.includes('content') || taskName.includes('content') || taskName.includes('strategy') || summary.includes('content')) {
      return 'Content Agent';
    } else if (title.includes('performance') || title.includes('testing') || taskName.includes('qa') || taskName.includes('quality') || summary.includes('performance')) {
      return 'QA Agent';
    } else if (title.includes('architecture') || title.includes('documentation') || taskName.includes('architecture') || summary.includes('architecture')) {
      return 'Sitecore Agent';
    } else if (title.includes('component') || title.includes('dependencies') || taskName.includes('component') || summary.includes('component')) {
      return 'Migration Agent';
    } else if (title.includes('jira') || title.includes('epic') || summary.includes('jira')) {
      return 'Content Agent';
    }
    
    return 'AI Agent';
  };

  // Action handlers
  const handleItemAction = (itemId: string, action: 'approve' | 'reject') => {
    setProcessingItems(prev => new Set([...prev, itemId]));
    
    const item = inboxItems.find(i => i.id === itemId);
    if (item) {
      // Trigger the chat transition with smooth animation
      if (onTransitionToChat) {
        onTransitionToChat({
          action,
          item,
        });
      }
      
      // Call the original approval action handler if provided
      if (onApprovalAction) {
        const details = action === 'reject' ? 'Not needed at this time' : undefined;
        onApprovalAction(item, action, details);
      }
    }
    
    setTimeout(() => {
      setProcessingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 1000);
    
    setInboxItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const now = new Date().toISOString();
        return action === 'approve'
          ? { ...item, status: 'approved' as InboxItemStatus, approvedBy: 'Current User', approvedAt: now, updatedAt: now }
          : { ...item, status: 'rejected' as InboxItemStatus, rejectedReason: 'Not needed at this time', updatedAt: now };
      }
      return item;
    }));
  };

  const handleToggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleCardClick = (item: InboxItem) => {
    // Transition to the chat to show this inbox message with actions
    if (onTransitionToChat) {
      onTransitionToChat({
        action: item.type === 'approval' ? 'approve' : 'reply',
        item,
      });
    }
  };

  const handleInlineReply = async (itemId: string) => {
    const reply = inlineReplies[itemId];
    if (!reply?.trim()) return;

    const item = inboxItems.find(i => i.id === itemId);
    if (!item) return;

    setSendingReplies(prev => new Set([...prev, itemId]));

    // Trigger the chat transition with the reply
    if (onTransitionToChat) {
      onTransitionToChat({
        action: 'reply',
        item,
        userResponse: reply,
      });
    }

    setTimeout(() => {
      setInboxItems(prev => prev.map(i => 
        i.id === itemId 
          ? { ...i, inlineReply: reply, status: 'pending' as InboxItemStatus, updatedAt: new Date().toISOString() }
          : i
      ));

      setInlineReplies(prev => ({ ...prev, [itemId]: '' }));
      setVisibleReplies(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });

      // Call the original inline reply handler if provided
      if (onInlineReply) {
        onInlineReply(item, reply);
      }

      setSendingReplies(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 1000);
  };

  const handleReplyChange = (itemId: string, value: string) => {
    setInlineReplies(prev => ({ ...prev, [itemId]: value }));
  };

  const handleShowReply = (itemId: string) => {
    setVisibleReplies(prev => new Set([...prev, itemId]));
  };

  const handleHideReply = (itemId: string) => {
    setVisibleReplies(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
    setInlineReplies(prev => ({ ...prev, [itemId]: '' }));
  };

  const handleShowRejectBox = (itemId: string) => {
    setVisibleRejectBoxes(prev => new Set([...prev, itemId]));
  };

  const handleHideRejectBox = (itemId: string) => {
    setVisibleRejectBoxes(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
    setRejectNotes(prev => ({ ...prev, [itemId]: '' }));
  };

  const handleRejectNoteChange = (itemId: string, value: string) => {
    setRejectNotes(prev => ({ ...prev, [itemId]: value }));
  };

  const handleRejectWithNote = (itemId: string) => {
    const note = rejectNotes[itemId] || '';
    const item = inboxItems.find(i => i.id === itemId);
    
    if (item) {
      setProcessingItems(prev => new Set([...prev, itemId]));
      
      // Trigger the chat transition with the rejection note
      if (onTransitionToChat) {
        onTransitionToChat({
          action: 'reject',
          item,
          userResponse: note.trim() || undefined,
        });
      }
      
      // Call the original approval action handler if provided
      if (onApprovalAction) {
        const details = note.trim() || 'Not needed at this time';
        onApprovalAction(item, 'reject', details);
      }
    }
    
    setTimeout(() => {
      setProcessingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 1000);
    
    setInboxItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const now = new Date().toISOString();
        return { 
          ...item, 
          status: 'rejected' as InboxItemStatus, 
          rejectedReason: note.trim() || 'Not needed at this time', 
          updatedAt: now 
        };
      }
      return item;
    }));
    
    // Clear the reject box
    handleHideRejectBox(itemId);
  };

  return (
    <div className={`h-full flex flex-col bg-background ${className}`}>
      {/* Modern Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          {/* Title */}
          <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
            <Brain className="text-primary" style={{ width: 'var(--spacing-5)', height: 'var(--spacing-5)' }} />
            <h2>AI Inbox</h2>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
            <Input
              placeholder="Search AI suggestions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-input-background border-input-border focus:bg-background"
              style={{ paddingLeft: 'calc(var(--spacing-10))' }}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-t border-border bg-background/50">
          <div className="flex items-center" style={{ gap: 'var(--spacing-1)', paddingLeft: 'var(--spacing-4)', paddingRight: 'var(--spacing-4)' }}>
            {[
              { key: 'all', label: 'All', count: inboxItems.length },
              { key: 'approved', label: 'Done', count: stats.approved }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key as InboxItemStatus | 'all')}
                className={`border-b-2 transition-colors ${
                  statusFilter === filter.key
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                style={{ paddingLeft: 'var(--spacing-4)', paddingRight: 'var(--spacing-4)', paddingTop: 'var(--spacing-3)', paddingBottom: 'var(--spacing-3)' }}
              >
                {filter.label}
                {filter.count > 0 && (
                  <Badge variant="secondary" className="h-4" style={{ marginLeft: 'var(--spacing-2)', paddingLeft: 'var(--spacing-1-5)', paddingRight: 'var(--spacing-1-5)' }}>
                    {filter.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center" style={{ paddingTop: 'var(--spacing-16)', paddingBottom: 'var(--spacing-16)', paddingLeft: 'var(--spacing-6)', paddingRight: 'var(--spacing-6)' }}>
              <div className="rounded-full bg-primary/10 flex items-center justify-center" style={{ width: 'var(--spacing-16)', height: 'var(--spacing-16)', marginBottom: 'var(--spacing-4)' }}>
                <Brain className="text-primary" style={{ width: 'var(--spacing-8)', height: 'var(--spacing-8)' }} />
              </div>
              <h3 style={{ marginBottom: 'var(--spacing-2)' }}>No AI suggestions found</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your filters to see more AI suggestions'
                  : 'AI agents will suggest improvements and optimizations here as they analyze your project'
                }
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-hidden" style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {filteredItems.map((item) => {
                const agentName = getAgentName(item);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleCardClick(item)}
                    className={`group relative bg-card rounded-lg border border-border transition-all duration-200 hover:border-primary/20 hover:shadow-sm w-full text-left cursor-pointer ${
                      item.status === 'approved' 
                        ? 'opacity-70' 
                        : ''
                    }`}
                  >
                    <div className="w-full" style={{ padding: 'var(--spacing-4)' }}>
                      <div className="flex items-start justify-between" style={{ gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                            <h4 className="line-clamp-1">{agentName}</h4>
                            {getStatusBadge(item.status)}
                          </div>
                          <p className="text-foreground/70 line-clamp-2 text-[rgba(10,10,10,0.7999999999999999)]">
                            {item.summary}
                          </p>
                        </div>
                        <ChevronRight className="text-muted-foreground flex-shrink-0 group-hover:text-foreground transition-colors" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                      </div>
                      <span className="text-muted-foreground" style={{ fontSize: 'var(--font-size-xs)' }}>
                        {getRelativeTime(item.createdAt)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

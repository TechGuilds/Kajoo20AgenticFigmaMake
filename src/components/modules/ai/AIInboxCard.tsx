import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare,
  CheckCircle2,
  Check,
  X,
  Send,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Link,
  RefreshCw
} from 'lucide-react';
import { type InboxItem, type InboxItemStatus } from './AIInbox';

interface AIInboxCardProps {
  item: InboxItem;
  onApprove?: (item: InboxItem) => void;
  onReject?: (item: InboxItem, note?: string) => void;
  onReply?: (item: InboxItem, reply: string) => void;
  onNavigateToTask?: (taskId: string, taskName: string) => void;
  compact?: boolean;
}

export function AIInboxCard({ 
  item, 
  onApprove, 
  onReject, 
  onReply, 
  onNavigateToTask,
  compact = false 
}: AIInboxCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isRejectBoxVisible, setIsRejectBoxVisible] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle2 className="size-4 text-primary" />;
      case 'info-request': return <MessageSquare className="size-4 text-primary" />;
      default: return <MessageSquare className="size-4 text-muted-foreground" />;
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
        return <div className="size-3 rounded-full bg-primary ring-2 ring-primary/20" />;
      case 'high':
        return <div className="size-2.5 rounded-full bg-primary" />;
      case 'medium':
        return <div className="size-2 rounded-full bg-primary/70" />;
      case 'low':
        return <div className="size-1.5 rounded-full bg-muted-foreground" />;
      default:
        return <div className="size-1.5 rounded-full bg-muted-foreground" />;
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

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (onApprove) {
        onApprove(item);
      }
      setIsProcessing(false);
    }, 500);
  };

  const handleRejectWithNote = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (onReject) {
        onReject(item, rejectNote.trim() || undefined);
      }
      setIsRejectBoxVisible(false);
      setRejectNote('');
      setIsProcessing(false);
    }, 500);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    
    setIsSendingReply(true);
    setTimeout(() => {
      if (onReply) {
        onReply(item, replyText);
      }
      setReplyText('');
      setIsReplyVisible(false);
      setIsSendingReply(false);
    }, 500);
  };

  return (
    <div
      className={`group relative bg-card rounded-lg border border-border transition-all duration-200 hover:border-primary/20 hover:shadow-sm w-full ${
        item.status === 'approved' || item.status === 'rejected' 
          ? 'opacity-70' 
          : ''
      } ${
        isProcessing 
          ? 'ring-1 ring-primary/30 animate-pulse' 
          : ''
      }`}
    >
      <div style={{ padding: compact ? 'var(--spacing-3)' : 'var(--spacing-4)' }}>
        <div className="flex items-start w-full" style={{ gap: 'var(--spacing-3)' }}>
          <div className="flex-shrink-0" style={{ marginTop: 'var(--spacing-0-5)' }}>
            {getItemIcon(item.type)}
          </div>
          
          <div className="flex-1 min-w-0 w-full overflow-hidden" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {/* Header */}
            <div className="w-full">
              <div className="flex items-start justify-between w-full" style={{ gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-start" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                    <h4 className="line-clamp-2 flex-1 min-w-0 break-words">{item.title}</h4>
                    <div className="flex-shrink-0" style={{ marginTop: 'var(--spacing-0-5)' }}>
                      {getPriorityIndicator(item.priority)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col xs:flex-row xs:items-center" style={{ gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-2)' }}>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {getRelativeTime(item.createdAt)}
                    </span>
                    {item.relatedTaskName && (
                      <button 
                        className="flex items-center cursor-pointer hover:text-foreground transition-colors self-start"
                        style={{ gap: 'var(--spacing-1)', minHeight: 'var(--spacing-6)' }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (onNavigateToTask) {
                            onNavigateToTask(item.relatedTaskId, item.relatedTaskName);
                          }
                        }}
                        aria-label={`Navigate to task: ${item.relatedTaskName}`}
                      >
                        <Link className="size-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {item.relatedTaskName}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end flex-shrink-0" style={{ gap: 'var(--spacing-2)' }}>
                  {getStatusBadge(item.status)}
                  {!compact && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsExpanded(!isExpanded)}
                      style={{ height: 'var(--spacing-8)', width: 'var(--spacing-8)', padding: 0 }}
                    >
                      {isExpanded ? (
                        <ChevronDown className="size-4" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
              
              <p className="text-muted-foreground line-clamp-2 break-words" style={{ marginBottom: 'var(--spacing-2)' }}>
                {item.summary}
              </p>
            </div>

            {/* Inline Actions for Approval Items */}
            {item.type === 'approval' && item.status === 'pending' && !isExpanded && !isRejectBoxVisible && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full" style={{ gap: 'var(--spacing-2)' }}>
                <Button
                  size="sm"
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex-1 sm:flex-none bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15"
                  style={{ height: 'var(--spacing-10)', padding: '0 var(--spacing-4)' }}
                >
                  <Check className="size-3" style={{ marginRight: 'var(--spacing-2)' }} />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsRejectBoxVisible(true)}
                  disabled={isProcessing}
                  className="flex-1 sm:flex-none bg-muted/50 text-muted-foreground border-border hover:bg-muted/70"
                  style={{ height: 'var(--spacing-10)', padding: '0 var(--spacing-4)' }}
                >
                  <X className="size-3" style={{ marginRight: 'var(--spacing-2)' }} />
                  Reject
                </Button>
              </div>
            )}

            {/* Reject Input Box for Approval Items */}
            {item.type === 'approval' && item.status === 'pending' && !isExpanded && isRejectBoxVisible && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg w-full animate-in slide-in-from-top-2 duration-200" style={{ padding: 'var(--spacing-3)' }}>
                <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)' }}>
                  <AlertCircle className="size-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-primary">Rejection Response</span>
                </div>
                <p className="text-sm text-muted-foreground break-words" style={{ marginBottom: 'var(--spacing-3)' }}>Provide an optional note or feedback for rejecting this suggestion</p>
                
                <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  <Textarea
                    placeholder="Add an optional note or feedback…"
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    className="min-h-[80px] bg-background text-sm w-full resize-none"
                  />
                  <div className="flex flex-col sm:flex-row w-full" style={{ gap: 'var(--spacing-2)' }}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsRejectBoxVisible(false);
                        setRejectNote('');
                      }}
                      className="order-2 sm:order-1 w-full sm:w-auto"
                      style={{ height: 'var(--spacing-10)', padding: '0 var(--spacing-4)' }}
                    >
                      <X className="size-3" style={{ marginRight: 'var(--spacing-2)' }} />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleRejectWithNote}
                      disabled={isProcessing}
                      className="order-1 sm:order-2 w-full sm:w-auto bg-primary hover:bg-primary/90"
                      style={{ height: 'var(--spacing-10)', padding: '0 var(--spacing-4)' }}
                    >
                      <Send className="size-3" style={{ marginRight: 'var(--spacing-2)' }} />
                      Send Response
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Reply CTA for Info Request Items */}
            {item.type === 'info-request' && (item.status === 'pending' || item.status === 'info-requested') && !isExpanded && !isReplyVisible && (
              <div className="flex justify-start w-full">
                <Button
                  size="sm"
                  onClick={() => setIsReplyVisible(true)}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                  style={{ height: 'var(--spacing-10)', padding: '0 var(--spacing-4)' }}
                >
                  <MessageSquare className="size-3" style={{ marginRight: 'var(--spacing-2)' }} />
                  Reply
                </Button>
              </div>
            )}

            {/* Inline Reply for Info Request Items */}
            {item.type === 'info-request' && (item.status === 'pending' || item.status === 'info-requested') && !isExpanded && isReplyVisible && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg w-full" style={{ padding: 'var(--spacing-3)' }}>
                <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                  <AlertCircle className="size-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-primary">Information Requested</span>
                </div>
                <p className="text-sm text-muted-foreground break-words" style={{ marginBottom: 'var(--spacing-3)' }}>{item.requestedInfo}</p>
                
                <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  <Textarea
                    placeholder="Provide the requested information..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[80px] bg-background text-sm w-full resize-none"
                  />
                  <div className="flex flex-col sm:flex-row w-full" style={{ gap: 'var(--spacing-2)' }}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsReplyVisible(false);
                        setReplyText('');
                      }}
                      className="order-2 sm:order-1 w-full sm:w-auto"
                      style={{ height: 'var(--spacing-10)', padding: '0 var(--spacing-4)' }}
                    >
                      <X className="size-3" style={{ marginRight: 'var(--spacing-2)' }} />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || isSendingReply}
                      className="order-1 sm:order-2 w-full sm:w-auto bg-primary hover:bg-primary/90"
                      style={{ height: 'var(--spacing-10)', padding: '0 var(--spacing-4)' }}
                    >
                      {isSendingReply ? (
                        <RefreshCw className="size-3 animate-spin" style={{ marginRight: 'var(--spacing-2)' }} />
                      ) : (
                        <Send className="size-3" style={{ marginRight: 'var(--spacing-2)' }} />
                      )}
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Expanded Content */}
            {isExpanded && (
              <div className="w-full overflow-hidden border-t border-border" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', paddingTop: 'var(--spacing-3)' }}>
                <div>
                  <h5 style={{ marginBottom: 'var(--spacing-2)' }}>Details</h5>
                  <p className="text-muted-foreground break-words">{item.details}</p>
                </div>
                
                {item.aiReasoning && (
                  <div>
                    <h5 style={{ marginBottom: 'var(--spacing-2)' }}>AI Reasoning</h5>
                    <p className="text-muted-foreground break-words">{item.aiReasoning}</p>
                  </div>
                )}
                
                <div>
                  <h5 style={{ marginBottom: 'var(--spacing-2)' }}>Estimated Impact</h5>
                  <p className="text-muted-foreground break-words">{item.estimatedImpact}</p>
                </div>

                {/* Expanded Action Buttons for Approval Items */}
                {item.type === 'approval' && item.status === 'pending' && !isRejectBoxVisible && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full" style={{ gap: 'var(--spacing-2)', paddingTop: 'var(--spacing-2)' }}>
                    <Button
                      size="sm"
                      onClick={handleApprove}
                      disabled={isProcessing}
                      className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
                      style={{ height: 'var(--spacing-10)' }}
                    >
                      <Check className="size-3" style={{ marginRight: 'var(--spacing-2)' }} />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsRejectBoxVisible(true)}
                      disabled={isProcessing}
                      className="flex-1 sm:flex-none border-muted text-muted-foreground hover:bg-muted/50"
                      style={{ height: 'var(--spacing-10)' }}
                    >
                      <X className="size-3" style={{ marginRight: 'var(--spacing-2)' }} />
                      Reject
                    </Button>
                  </div>
                )}

                {/* Reject Input Box in Expanded View */}
                {item.type === 'approval' && item.status === 'pending' && isRejectBoxVisible && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg w-full animate-in slide-in-from-top-2 duration-200" style={{ padding: 'var(--spacing-3)' }}>
                    <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)' }}>
                      <AlertCircle className="size-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-primary">Rejection Response</span>
                    </div>
                    <p className="text-sm text-muted-foreground break-words" style={{ marginBottom: 'var(--spacing-3)' }}>Provide an optional note or feedback for rejecting this suggestion</p>
                    
                    <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                      <Textarea
                        placeholder="Add an optional note or feedback…"
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        className="min-h-[100px] bg-background w-full resize-none"
                      />
                      <div className="flex flex-col sm:flex-row w-full" style={{ gap: 'var(--spacing-2)' }}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsRejectBoxVisible(false);
                            setRejectNote('');
                          }}
                          className="order-2 sm:order-1 w-full sm:w-auto"
                          style={{ height: 'var(--spacing-10)' }}
                        >
                          <X className="size-3" style={{ marginRight: 'var(--spacing-2)' }} />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleRejectWithNote}
                          disabled={isProcessing}
                          className="order-1 sm:order-2 w-full sm:w-auto bg-primary hover:bg-primary/90"
                          style={{ height: 'var(--spacing-10)' }}
                        >
                          <Send className="size-3" style={{ marginRight: 'var(--spacing-2)' }} />
                          Send Response
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expanded Info Request Reply */}
                {item.type === 'info-request' && (item.status === 'pending' || item.status === 'info-requested') && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg w-full" style={{ padding: 'var(--spacing-3)' }}>
                    <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                      <AlertCircle className="size-4 text-primary flex-shrink-0" />
                      <h5 className="text-primary">Information Requested</h5>
                    </div>
                    <p className="text-muted-foreground break-words" style={{ marginBottom: 'var(--spacing-3)' }}>{item.requestedInfo}</p>
                    
                    {!isReplyVisible ? (
                      <div className="flex justify-start w-full">
                        <Button
                          size="sm"
                          onClick={() => setIsReplyVisible(true)}
                          className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                          style={{ height: 'var(--spacing-10)' }}
                        >
                          <MessageSquare className="size-3" style={{ marginRight: 'var(--spacing-2)' }} />
                          Reply
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                        <Textarea
                          placeholder="Provide the requested information..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="min-h-[100px] bg-background w-full resize-none"
                        />
                        <div className="flex flex-col sm:flex-row w-full" style={{ gap: 'var(--spacing-2)' }}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setIsReplyVisible(false);
                              setReplyText('');
                            }}
                            className="order-2 sm:order-1 w-full sm:w-auto"
                            style={{ height: 'var(--spacing-10)' }}
                          >
                            <X className="size-3" style={{ marginRight: 'var(--spacing-2)' }} />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSendReply}
                            disabled={!replyText.trim() || isSendingReply}
                            className="order-1 sm:order-2 w-full sm:w-auto bg-primary hover:bg-primary/90"
                            style={{ height: 'var(--spacing-10)' }}
                          >
                            {isSendingReply ? (
                              <RefreshCw className="size-3 animate-spin" style={{ marginRight: 'var(--spacing-2)' }} />
                            ) : (
                              <Send className="size-3" style={{ marginRight: 'var(--spacing-2)' }} />
                            )}
                            Send Reply
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

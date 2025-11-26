import React, { useState } from 'react';
import { TaskContextChatPanel } from '../chat/TaskContextChatPanel';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Progress } from '../../ui/progress';

import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';
import { 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle2,
  Tag,
  ExternalLink,
  Activity,
  MessageSquare,
  FileText,
  Settings,
  Calendar,
  Zap,

  GitBranch,
  Hash
} from 'lucide-react';
import type { Task, RouteContext } from '../../../types';

interface TaskDetailViewProps {
  task: Task;
  projectId: string;
  onContextChange?: (context: RouteContext) => void;
  className?: string;
}

export function TaskDetailView({ 
  task, 
  projectId, 
  onContextChange = () => {},
  className = '' 
}: TaskDetailViewProps) {
  const [context] = useState<RouteContext>({
    projectId,
    taskId: task.id,
    type: 'task'
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': 
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Done</Badge>;
      case 'in-progress': 
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">In Progress</Badge>;
      case 'review': 
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Under Review</Badge>;
      case 'pending': 
        return <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted/20">Pending</Badge>;
      case 'blocked':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Blocked</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': 
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20" variant="outline">High</Badge>;
      case 'medium': 
        return <Badge className="bg-warning/10 text-warning border-warning/20" variant="outline">Medium</Badge>;
      case 'low': 
        return <Badge className="bg-info/10 text-info border-info/20" variant="outline">Low</Badge>;
      default: 
        return <Badge className="bg-muted text-muted-foreground border-muted-foreground/20" variant="outline">Normal</Badge>;
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'completed': return 100;
      case 'in-progress': return 60;
      case 'under-review': return 80;
      case 'blocked': return 40;
      default: return 0;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`h-full flex ${className}`}>
      {/* Left Panel - Task Details */}
      <div className="w-[420px] border-r bg-card/50 flex-shrink-0">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {/* Task Header */}
          <div style={{ padding: 'var(--spacing-6)' }} className="border-b bg-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              {/* Task ID & Status */}
              <div className="flex items-center justify-between">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }} className="text-muted-foreground">
                    <Hash style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                    <span className="font-mono">{task.id}</span>
                  </div>

                </div>
                {getStatusBadge(task.status)}
              </div>

              {/* Task Title */}
              <div>
                <h1 style={{ marginBottom: 'var(--spacing-2)' }} className="leading-tight">{task.title}</h1>
                {task.description && (
                  <p className="text-muted-foreground leading-relaxed">{task.description}</p>
                )}
              </div>



              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', paddingTop: 'var(--spacing-2)' }}>
                <Button size="sm" style={{ gap: 'var(--spacing-2)' }}>
                  <Zap style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                  Execute
                </Button>

              </div>
            </div>
          </div>

          {/* Task Information Panel */}
          <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            {/* Consolidated Task Information */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader style={{ paddingBottom: 'var(--spacing-4)' }}>
                <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <div style={{ padding: 'var(--spacing-2)' }} className="bg-primary/10 rounded-lg">
                    <FileText style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} className="text-primary" />
                  </div>
                  Task Information
                </CardTitle>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                {/* Priority */}
                {task.priority && (
                  <div className="flex items-center justify-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }} className="text-muted-foreground">
                      <AlertCircle style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                      <span>Priority</span>
                    </div>
                    {getPriorityBadge(task.priority)}
                  </div>
                )}

                {/* Assignee */}
                {task.assignee && (
                  <div className="flex items-center justify-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }} className="text-muted-foreground">
                      <User style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                      <span>Assignee</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                      <Avatar style={{ width: 'var(--spacing-7)', height: 'var(--spacing-7)' }}>
                        <AvatarImage src={task.assignee.avatarUrl} />
                        <AvatarFallback>
                          {task.assignee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{task.assignee.name}</span>
                    </div>
                  </div>
                )}

                {/* AI Agent */}
                {task.assignedAgent && (
                  <div className="flex items-center justify-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }} className="text-muted-foreground">
                      <Settings style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                      <span>AI Agent</span>
                    </div>
                    <Badge variant="secondary">
                      {task.assignedAgent}
                    </Badge>
                  </div>
                )}

                {/* Human Reviewer */}
                {task.humanReviewer && (
                  <div className="flex items-center justify-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }} className="text-muted-foreground">
                      <User style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                      <span>Reviewer</span>
                    </div>
                    <span>{task.humanReviewer}</span>
                  </div>
                )}

                {/* Estimated Hours */}
                {task.estimatedHours && (
                  <div className="flex items-center justify-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }} className="text-muted-foreground">
                      <Clock style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                      <span>Estimate</span>
                    </div>
                    <span>{task.estimatedHours}h</span>
                  </div>
                )}

                {/* Due Date */}
                {task.dueDate && (
                  <div className="flex items-center justify-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }} className="text-muted-foreground">
                      <Calendar style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                      <span>Due Date</span>
                    </div>
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                )}

                {/* Labels/Tags */}
                {task.tags && task.tags.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }} className="text-muted-foreground">
                      <Tag style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                      <span>Labels</span>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-2)' }} className="flex-wrap">
                      {task.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Created Information */}
                <div style={{ paddingTop: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }} className="border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }} className="text-muted-foreground">
                      <Activity style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                      <span>Created</span>
                    </div>
                    <span>{formatDate(task.createdAt)}</span>
                  </div>
                  {task.createdBy && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Created By</span>
                      <span>
                        {typeof task.createdBy === 'string' ? task.createdBy : task.createdBy.name}
                      </span>
                    </div>
                  )}
                  {task.updatedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span>{formatDate(task.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Acceptance Criteria */}
            {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
              <Card className="border-border/50 shadow-sm">
                <CardHeader style={{ paddingBottom: 'var(--spacing-4)' }}>
                  <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <div style={{ padding: 'var(--spacing-2)' }} className="bg-success/10 rounded-lg">
                      <CheckCircle2 style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} className="text-success" />
                    </div>
                    Acceptance Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                    {task.acceptanceCriteria.map((criteria, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)' }}>
                        <div 
                          style={{ 
                            width: 'var(--spacing-6)', 
                            height: 'var(--spacing-6)', 
                            marginTop: 'calc(var(--spacing-1) / 2)' 
                          }} 
                          className="rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0"
                        >
                          <span className="text-primary">{index + 1}</span>
                        </div>
                        <span className="leading-relaxed">{criteria}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dependencies */}
            {task.dependencies && task.dependencies.length > 0 && (
              <Card className="border-border/50 shadow-sm">
                <CardHeader style={{ paddingBottom: 'var(--spacing-4)' }}>
                  <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <div style={{ padding: 'var(--spacing-2)' }} className="bg-warning/10 rounded-lg">
                      <GitBranch style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} className="text-warning" />
                    </div>
                    Dependencies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    {task.dependencies.map((dep, index) => (
                      <div 
                        key={index} 
                        style={{ padding: 'var(--spacing-3)' }} 
                        className="flex items-center justify-between border border-border/50 rounded-lg bg-muted/20"
                      >
                        <span>{dep.title}</span>
                        {dep.jiraKey && (
                          <Badge variant="outline">
                            {dep.jiraKey}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Linked Issues */}
            {task.linkedIssues && task.linkedIssues.length > 0 && (
              <Card className="border-border/50 shadow-sm">
                <CardHeader style={{ paddingBottom: 'var(--spacing-4)' }}>
                  <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <div style={{ padding: 'var(--spacing-2)' }} className="bg-info/10 rounded-lg">
                      <ExternalLink style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} className="text-info" />
                    </div>
                    Linked Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ display: 'flex', gap: 'var(--spacing-2)' }} className="flex-wrap">
                    {task.linkedIssues.map((issue, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="hover:bg-primary/5 hover:border-primary/20"
                        onClick={() => window.open(issue.url, '_blank')}
                        style={{ height: 'var(--spacing-9)' }}
                      >
                        <ExternalLink style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)', marginRight: 'var(--spacing-2)' }} />
                        {issue.key}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}


          </div>
        </div>
      </div>

      {/* Right Panel - Chat & Artifacts */}
      <div className="flex-1 flex flex-col min-w-0">
        <TaskContextChatPanel
          context={context}
          task={task}
          onContextChange={onContextChange}
          className="h-full"
        />
      </div>
    </div>
  );
}
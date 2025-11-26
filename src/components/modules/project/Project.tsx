import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { TaskContextChatPanel } from '@/components/modules/chat/TaskContextChatPanel';
import { TaskDetailView } from '@/components/modules/task/TaskDetailView';
import { type Task, type Project } from '@/types/entities';
import { 
  Settings,
  Filter,
  Search,
  Calendar,
  User,
  Clock,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Circle,
  Zap,
  Bot,
  Users,
  FileText,
  Code,
  Database,
  TestTube,
  Rocket,
  BarChart3,
  ListTodo,
  CalendarDays,
  ExternalLink,
  Star,
  MessageSquare,
  ArrowRight,
  Activity,
  GitBranch,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Edit3,
  Check,
  X,
  Save,
  RotateCcw,
  PanelRightClose,
  PanelRightOpen,
  ArrowLeft
} from 'lucide-react';

interface ProjectProps {
  selectedProject: Project;
  onTaskTrigger: (taskId: string, context?: string, task?: Task) => void;
  onJiraSync: (tasks: any[]) => void;
  chatCollapsed: boolean;
  onChatToggle: () => void;
  chatPanelSize: number;
  onChatPanelResize: (size: number) => void;
  taskPrompt?: string;
  onPromptProcessed?: () => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onCommentAdd?: (taskId: string, comment: string) => void;
}

interface RouteContext {
  projectId: string;
  taskId?: string;
  type: 'project' | 'task';
}

export function Project({ 
  selectedProject, 
  onTaskTrigger, 
  onJiraSync, 
  chatCollapsed, 
  onChatToggle, 
  chatPanelSize, 
  onChatPanelResize, 
  taskPrompt, 
  onPromptProcessed,
  onTaskUpdate,
  onCommentAdd
}: ProjectProps) {
  const [tasks, setTasks] = useState<Task[]>(selectedProject.tasks || []);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'task-detail'>('list');
  const [chatContext, setChatContext] = useState<RouteContext>({
    projectId: selectedProject.id,
    type: 'project'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todo' | 'in-progress' | 'review' | 'completed' | 'blocked' | 'all'>('all');
  const [labelFilter, setLabelFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      
      const matchesLabel = labelFilter === 'all' || task.tags?.includes(labelFilter);
      
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesLabel && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, labelFilter, priorityFilter]);

  // Get unique labels from all tasks for filter dropdown
  const availableLabels = useMemo(() => {
    const allLabels = new Set<string>();
    tasks.forEach(task => {
      task.tags?.forEach(tag => allLabels.add(tag));
    });
    return Array.from(allLabels).sort();
  }, [tasks]);

  // Calculate progress statistics
  const projectStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const blockedTasks = tasks.filter(t => t.status === 'blocked').length;
    const totalHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      blockedTasks,
      completionRate: Math.round((completedTasks / totalTasks) * 100),
      totalHours
    };
  }, [tasks]);

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="size-4 text-success" />;
      case 'in-progress': return <Play className="size-4 text-primary" />;
      case 'review': return <User className="size-4 text-primary" />;
      case 'blocked': return <AlertTriangle className="size-4 text-destructive" />;
      default: return <Circle className="size-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: Task['status']) => {
    switch (status) {
      case 'completed': 
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Done</Badge>;
      case 'in-progress': 
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">In Progress</Badge>;
      case 'review': 
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Under Review</Badge>;
      case 'blocked': 
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Blocked</Badge>;
      default: 
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/20">To Do</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high': return 'bg-warning/10 text-warning border-warning/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-muted text-muted-foreground border-muted-foreground/20';
      default: return 'bg-muted text-muted-foreground border-muted-foreground/20';
    }
  };

  const handleTaskSelect = (taskId: string, checked: boolean) => {
    const newSelected = new Set(selectedTasks);
    if (checked) {
      newSelected.add(taskId);
    } else {
      newSelected.delete(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const handleBulkAction = (action: 'jira-sync' | 'export' | 'ai-execute') => {
    const selectedTaskData = tasks.filter(t => selectedTasks.has(t.id));
    
    switch (action) {
      case 'jira-sync':
        onJiraSync(selectedTaskData);
        break;
      case 'export':
        console.log('Export tasks:', selectedTaskData);
        break;
      case 'ai-execute':
        selectedTaskData.forEach(task => {
          if (task.status === 'todo' || task.status === 'in-progress') {
            onTaskTrigger(task.id, `Execute task: ${task.title}`, task);
          }
        });
        break;
    }
  };

  const handleTaskRowClick = (task: Task) => {
    setSelectedTaskId(task.id);
    setViewMode('task-detail');
    setChatContext({
      projectId: selectedProject.id,
      taskId: task.id,
      type: 'task'
    });
  };

  const handleBackToTaskList = () => {
    setViewMode('list');
    setSelectedTaskId(null);
    setChatContext({
      projectId: selectedProject.id,
      type: 'project'
    });
  };

  const handleChatContextChange = (newContext: RouteContext) => {
    setChatContext(newContext);
    if (newContext.type === 'project') {
      setSelectedTaskId(null);
      setViewMode('list');
    } else if (newContext.taskId) {
      setSelectedTaskId(newContext.taskId);
      setViewMode('task-detail');
    }
  };

  // Task Controls Toolbar Component
  const TaskControlsToolbar = () => {
    return (
      <div className="border-b bg-card/50 backdrop-blur-sm flex-shrink-0" style={{ padding: 'var(--spacing-4)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between" style={{ gap: 'var(--spacing-4)' }}>
          {/* Left Section: Task Stats */}
          <div className="flex items-center" style={{ gap: 'var(--spacing-4)' }}>
            {/* Quick Stats */}
            <div className="flex items-center text-muted-foreground" style={{ gap: 'var(--spacing-3)' }}>
              <span className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                <Circle className="size-3 fill-current text-muted-foreground/60" />
                {filteredTasks.length} tasks
              </span>
              {selectedTasks.size > 0 && (
                <span className="flex items-center text-primary" style={{ gap: 'var(--spacing-1)' }}>
                  <CheckCircle2 className="size-3" />
                  {selectedTasks.size} selected
                </span>
              )}
            </div>
          </div>
          
          {/* Right Section: Search + Filters */}
          <div className="flex items-center" style={{ gap: 'var(--spacing-3)' }}>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-3.5 text-muted-foreground/70" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 lg:w-80 pl-9 h-9"
              />
              {searchQuery && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="size-3" />
                </Button>
              )}
            </div>
            
            {/* Filters */}
            <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                <SelectTrigger className="w-28 h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={labelFilter} onValueChange={setLabelFilter}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue placeholder="Labels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Labels</SelectItem>
                  {availableLabels.map((label) => (
                    <SelectItem key={label} value={label}>
                      {label.charAt(0).toUpperCase() + label.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-28 h-9">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear filters button */}
              {(statusFilter !== 'all' || labelFilter !== 'all' || priorityFilter !== 'all' || searchQuery) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setStatusFilter('all');
                    setLabelFilter('all');
                    setPriorityFilter('all');
                    setSearchQuery('');
                  }}
                  className="h-9"
                  style={{ padding: 'var(--spacing-3)' }}
                >
                  <RotateCcw className="size-3.5" style={{ marginRight: 'var(--spacing-1)' }} />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Bulk Action Toolbar Component
  const BulkActionToolbar = () => {
    if (selectedTasks.size === 0) return null;

    return (
      <div className="bg-primary/10 border border-primary/20 rounded-lg" style={{ padding: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
            <span>{selectedTasks.size} task(s) selected</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedTasks(new Set())}
              className="h-6"
              style={{ padding: 'var(--spacing-2)' }}
            >
              <X className="size-3" />
              Clear
            </Button>
          </div>
          <div className="flex" style={{ gap: 'var(--spacing-2)' }}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('jira-sync')}
              className="h-7"
              style={{ padding: 'var(--spacing-3)' }}
            >
              <ExternalLink className="size-3" style={{ marginRight: 'var(--spacing-1)' }} />
              Sync to JIRA
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('ai-execute')}
              className="h-7"
              style={{ padding: 'var(--spacing-3)' }}
            >
              <Zap className="size-3" style={{ marginRight: 'var(--spacing-1)' }} />
              Execute with AI
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="h-full flex flex-col">
      {/* Content Area with Chat Panel */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup 
          direction="horizontal" 
          className="h-full"
          onLayout={(sizes) => {
            if (!chatCollapsed && sizes.length === 2) {
              onChatPanelResize(sizes[0]);
            }
          }}
        >
          {/* AI Chat Panel - Left Side */}
          {!chatCollapsed && (
            <>
              <ResizablePanel 
                id="chat-panel" 
                defaultSize={chatPanelSize} 
                minSize={20} 
                maxSize={40}
              >
                <div className="h-full border-r">
                  <TaskContextChatPanel 
                    context={chatContext}
                    task={selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : undefined}
                    onContextChange={handleChatContextChange}
                    taskPrompt={taskPrompt}
                    onPromptProcessed={onPromptProcessed}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle className="w-2 bg-border hover:bg-primary/20 active:bg-primary/30 transition-colors cursor-col-resize flex items-center justify-center group">
                <div className="w-1 h-8 bg-border group-hover:bg-primary/50 rounded-full transition-colors"></div>
              </ResizableHandle>
            </>
          )}

          {/* Task Content Panel - Right Side */}
          <ResizablePanel 
            id="tasks-panel" 
            defaultSize={chatCollapsed ? 100 : (100 - chatPanelSize)} 
            minSize={chatCollapsed ? 100 : 50}
          >
            <div className="h-full flex flex-col">
              {viewMode === 'task-detail' ? (
                /* Task Detail View - Full Panel */
                <>
                  {/* Back Button Header */}
                  <div className="border-b bg-card/50" style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                    <Button
                      variant="ghost"
                      onClick={handleBackToTaskList}
                    >
                      <ArrowLeft className="size-4" style={{ marginRight: 'var(--spacing-2)' }} />
                      Back to Tasks
                    </Button>
                  </div>
                  
                  {/* Task Detail Content */}
                  <div className="flex-1 overflow-hidden">
                    {selectedTaskId && (
                      <TaskDetailView
                        task={tasks.find(t => t.id === selectedTaskId)!}
                        projectId={selectedProject.id}
                        onEdit={(task) => console.log('Edit task:', task)}
                        onExecute={(task) => {
                          if (chatCollapsed) {
                            onChatToggle();
                          }
                          
                          const taskContext = `Please help me execute this task: ${task.title}\n\nDescription: ${task.description}\nPriority: ${task.priority}\nStatus: ${task.status}`;
                          onTaskTrigger(task.id, taskContext, task);
                        }}
                        className="h-full"
                      />
                    )}
                  </div>
                </>
              ) : (
                /* Task List View */
                <>
                  {/* Task Controls Toolbar */}
                  <TaskControlsToolbar />
              
                  {/* Task Content Area */}
                  <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto">
                      <div style={{ padding: 'var(--spacing-4)' }}>
                        <BulkActionToolbar />
                        
                        {/* Task List */}
                        <div style={{ gap: 'var(--spacing-3)' }} className="flex flex-col">
                          {filteredTasks.length === 0 ? (
                            <div className="text-center" style={{ paddingTop: 'var(--spacing-12)', paddingBottom: 'var(--spacing-12)' }}>
                              <Circle className="size-12 text-muted-foreground mx-auto" style={{ marginBottom: 'var(--spacing-4)' }} />
                              <h3>No tasks found</h3>
                              <p className="text-muted-foreground">
                                Try adjusting your filters or search terms
                              </p>
                            </div>
                          ) : (
                            filteredTasks.map((task) => (
                              <Card 
                                key={task.id} 
                                className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                                  selectedTaskId === task.id ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' : ''
                                }`}
                                onClick={() => handleTaskRowClick(task)}
                              >
                                <CardContent style={{ padding: 'var(--spacing-4)' }}>
                                  <div className="flex items-start" style={{ gap: 'var(--spacing-3)' }}>
                                    <Checkbox
                                      checked={selectedTasks.has(task.id)}
                                      onCheckedChange={(checked) => handleTaskSelect(task.id, checked as boolean)}
                                      onClick={(e) => e.stopPropagation()}
                                      className="mt-0.5"
                                    />
                                    
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                                        {getStatusIcon(task.status)}
                                        <h4>{task.title}</h4>
                                        <div className="flex ml-auto" style={{ gap: 'var(--spacing-2)' }}>
                                          <Badge variant="outline" className={getPriorityColor(task.priority || 'medium')}>
                                            {task.priority || 'medium'}
                                          </Badge>
                                          {getStatusBadge(task.status)}
                                        </div>
                                      </div>
                                      
                                      {/* Description */}
                                      {task.description && (
                                        <p className="text-muted-foreground line-clamp-2" style={{ marginBottom: 'var(--spacing-3)' }}>
                                          {task.description.split('\n')[0]}
                                        </p>
                                      )}
                                      
                                      {/* Labels */}
                                      {task.tags && task.tags.length > 0 && (
                                        <div className="flex flex-wrap" style={{ gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-3)' }}>
                                          {task.tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="h-5" style={{ padding: 'var(--spacing-2)' }}>
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                      
                                      {/* Metadata */}
                                      <div className="flex items-center justify-between text-muted-foreground" style={{ marginBottom: 'var(--spacing-3)' }}>
                                        <div className="flex items-center" style={{ gap: 'var(--spacing-4)' }}>
                                          {task.assignedTo && (
                                            <span className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                                              <User className="size-3" />
                                              {task.assignedTo.name}
                                            </span>
                                          )}
                                          {task.estimatedHours && (
                                            <span className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                                              <Clock className="size-3" />
                                              {task.estimatedHours}h
                                            </span>
                                          )}
                                        </div>
                                        <span>
                                          {task.updatedAt || task.createdAt}
                                        </span>
                                      </div>
                                      
                                      {/* Action buttons */}
                                      <div className="flex" style={{ gap: 'var(--spacing-2)' }}>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('Edit task:', task);
                                          }}
                                          className="h-8"
                                          style={{ padding: 'var(--spacing-3)' }}
                                        >
                                          <Edit3 className="size-3" style={{ marginRight: 'var(--spacing-1)' }} />
                                          Edit
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            
                                            if (chatCollapsed) {
                                              onChatToggle();
                                            }
                                            
                                            const taskContext = `Execute task: ${task.title}\n\nDescription: ${task.description}\nPriority: ${task.priority}`;
                                            onTaskTrigger(task.id, taskContext, task);
                                          }}
                                          disabled={task.status === 'completed'}
                                          className="h-8"
                                          style={{ padding: 'var(--spacing-3)' }}
                                        >
                                          <Zap className="size-3" style={{ marginRight: 'var(--spacing-1)' }} />
                                          Execute with AI
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
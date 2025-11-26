import React, { useState, memo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Separator } from '../../ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../../ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../ui/alert-dialog';
import { 
  Search, 
  Plus, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Play,
  MoreHorizontal,
  Calendar,
  User,
  Tag,
  ArrowUpRight,
  Zap,
  Bot,
  Edit3,
  Trash2
} from 'lucide-react';
import { type Task, type Project } from '../../../types/entities';

interface TaskListViewProps {
  project: Project;
  onTaskSelect: (task: Task) => void;
  onCreateTask: () => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  onGenerateTasks?: () => void;
}

export const TaskListView = memo(function TaskListView({
  project,
  onTaskSelect,
  onCreateTask,
  onTaskUpdate,
  onTaskDelete,
  onGenerateTasks
}: TaskListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const getTaskStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="text-success" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
      case 'in-progress':
        return <Play className="text-info" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
      case 'blocked':
        return <AlertTriangle className="text-destructive" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
      default:
        return <Clock className="text-muted-foreground" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'in-progress':
        return 'bg-info/10 text-info border-info/20';
      case 'blocked':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'review':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-destructive';
      case 'high':
        return 'bg-warning';
      case 'medium':
        return 'bg-warning';
      default:
        return 'bg-gray-400';
    }
  };

  const filteredTasks = project.tasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];

  const projectHasNoTasks = !project.tasks || project.tasks.length === 0;
  
  React.useEffect(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
  }, [project.id]);
  
  const userHasAppliedFilters = searchQuery.trim() !== '' || statusFilter !== 'all' || priorityFilter !== 'all';
  const shouldShowAIGenerationCTA = projectHasNoTasks && !userHasAppliedFilters;
  const shouldShowFilteredEmptyState = filteredTasks.length === 0 && userHasAppliedFilters;

  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    review: filteredTasks.filter(t => t.status === 'review'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
    blocked: filteredTasks.filter(t => t.status === 'blocked')
  };

  const handleStatusChange = (task: Task, newStatus: Task['status']) => {
    onTaskUpdate(task.id, { status: newStatus });
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      onTaskDelete(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const renderTaskCard = (task: Task) => (
    <Card key={task.id} className="hover:shadow-sm transition-shadow group relative">
      <CardContent style={{ padding: 'var(--spacing-4)' }}>
        <div className="flex items-start justify-between" style={{ gap: 'var(--spacing-3)' }}>
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onTaskSelect(task)}>
            <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
              {getTaskStatusIcon(task.status)}
              <h4 className="font-medium line-clamp-1 group-hover:text-primary">{task.title}</h4>
              <div className={`rounded-full ${getPriorityColor(task.priority)}`} style={{ width: 'var(--spacing-2)', height: 'var(--spacing-2)' }} />
            </div>
            
            {task.description && (
              <p className="text-muted-foreground line-clamp-2" style={{ marginBottom: 'var(--spacing-3)' }}>{task.description}</p>
            )}
            
            <div className="flex items-center text-muted-foreground" style={{ gap: 'var(--spacing-4)' }}>
              {task.dueDate && (
                <div className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                  <Calendar style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}
              {task.assignedTo && (
                <div className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                  <User style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
                  <span>{task.assignedTo.name}</span>
                </div>
              )}
              {task.estimatedHours && (
                <div className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                  <Clock style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
                  <span>{task.estimatedHours}h</span>
                </div>
              )}
            </div>
            
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center" style={{ gap: 'var(--spacing-1)', marginTop: 'var(--spacing-2)' }}>
                <Tag className="text-muted-foreground" style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
                <div className="flex" style={{ gap: 'var(--spacing-1)' }}>
                  {task.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {task.tags.length > 3 && (
                    <Badge variant="outline">
                      +{task.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end" style={{ gap: 'var(--spacing-2)' }}>
            <Badge className={getStatusColor(task.status)} variant="outline">
              {task.status.replace('-', ' ')}
            </Badge>
            
            <div className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100" onClick={() => onTaskSelect(task)}>
                <ArrowUpRight style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onTaskSelect(task)}>
                    <Edit3 className="mr-2" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                    Edit Task
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => handleStatusChange(task, 'todo')} disabled={task.status === 'todo'}>
                    <Clock className="mr-2" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                    Move to To Do
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => handleStatusChange(task, 'in-progress')} disabled={task.status === 'in-progress'}>
                    <Play className="mr-2" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                    Move to In Progress
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => handleStatusChange(task, 'review')} disabled={task.status === 'review'}>
                    <CheckCircle2 className="mr-2" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                    Move to Review
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => handleStatusChange(task, 'completed')} disabled={task.status === 'completed'}>
                    <CheckCircle2 className="mr-2" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                    Mark Completed
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => handleStatusChange(task, 'blocked')} disabled={task.status === 'blocked'}>
                    <AlertTriangle className="mr-2" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                    Mark Blocked
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={() => handleDeleteTask(task)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-card" style={{ padding: 'var(--spacing-6)' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-4)' }}>
          <div>
            <h1>Tasks</h1>
            <p className="text-muted-foreground">
              {project.taskStats?.total || 0} tasks • {project.taskStats?.completed || 0} completed
            </p>
          </div>
          <Button onClick={onCreateTask}>
            <Plus className="mr-2" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
            New Task
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex items-center" style={{ gap: 'var(--spacing-4)' }}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute text-muted-foreground" style={{ left: 'var(--spacing-3)', top: '50%', transform: 'translateY(-50%)', width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 'var(--spacing-10)' }}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="mr-2" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Task Columns */}
      <div className="flex-1 overflow-auto" style={{ padding: 'var(--spacing-6)' }}>
        {shouldShowAIGenerationCTA ? (
          <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center">
            <div className="rounded-full bg-primary/10 flex items-center justify-center" style={{ width: 'var(--spacing-20)', height: 'var(--spacing-20)', marginBottom: 'var(--spacing-6)' }}>
              <Bot className="text-primary" style={{ width: 'var(--spacing-10)', height: 'var(--spacing-10)' }} />
            </div>
            
            <h3 style={{ marginBottom: 'var(--spacing-2)' }}>No tasks yet</h3>
            <p className="text-muted-foreground leading-relaxed" style={{ marginBottom: 'var(--spacing-6)' }}>
              Get started by having our AI agents analyze your project scope and automatically create a comprehensive task list tailored to your migration needs.
            </p>
            
            <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {onGenerateTasks && (
                <Button 
                  onClick={onGenerateTasks}
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25"
                >
                  <Zap className="mr-2" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                  Generate Task List with AI
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={onCreateTask}
                className="w-full"
              >
                <Plus className="mr-2" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                Create Task Manually
              </Button>
            </div>
            
            <div className="bg-muted/50 rounded-lg text-left w-full" style={{ marginTop: 'var(--spacing-6)', padding: 'var(--spacing-4)' }}>
              <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                <Bot className="text-primary" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                <span className="font-medium">AI will analyze:</span>
              </div>
              <ul className="text-muted-foreground" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                <li>• Project scope and requirements</li>
                <li>• Source system complexity</li>
                <li>• Migration phases and dependencies</li>
                <li>• Team capacity and timeline</li>
              </ul>
            </div>
          </div>
        ) : shouldShowFilteredEmptyState ? (
          <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center">
            <div className="rounded-full bg-muted/50 flex items-center justify-center" style={{ width: 'var(--spacing-16)', height: 'var(--spacing-16)', marginBottom: 'var(--spacing-4)' }}>
              <Search className="text-muted-foreground" style={{ width: 'var(--spacing-8)', height: 'var(--spacing-8)' }} />
            </div>
            <h3 style={{ marginBottom: 'var(--spacing-2)' }}>No tasks found</h3>
            <p className="text-muted-foreground leading-relaxed" style={{ marginBottom: 'var(--spacing-4)' }}>
              No tasks match your current filters. Try adjusting your search or filter criteria.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 h-full" style={{ gap: 'var(--spacing-6)' }}>
            {Object.entries(tasksByStatus).map(([status, tasks]) => (
              <div key={status} className="flex flex-col">
                <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
                  <h3 className="font-medium capitalize">{status.replace('-', ' ')}</h3>
                  <Badge variant="secondary">
                    {tasks.length}
                  </Badge>
                </div>
                
                <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  {tasks.map(renderTaskCard)}
                  {tasks.length === 0 && (
                    <div className="text-center text-muted-foreground" style={{ padding: 'var(--spacing-8) 0' }}>
                      <Clock className="mx-auto opacity-50" style={{ width: 'var(--spacing-8)', height: 'var(--spacing-8)', marginBottom: 'var(--spacing-2)' }} />
                      <p>No {status.replace('-', ' ')} tasks</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone and will also delete all associated comments and artifacts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});
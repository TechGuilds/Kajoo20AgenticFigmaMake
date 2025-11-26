import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Progress } from '../../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../ui/alert-dialog';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { type Project, type Workspace } from '~/types';
import { 
  Search, 
  Calendar,
  Users,
  Clock,
  ArrowUpRight,
  PlayCircle,
  PauseCircle,
  CheckCircle,
  FileSearch,
  MoreHorizontal,
  Edit3,
  Trash2,
  Plus,
  FolderIcon,
  Target,
  AlertCircle,
  Layers,
  ChevronDown
} from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  workspaceId: string;
  selectedWorkspace?: Workspace | null;
  availableWorkspaces?: Workspace[];
  onProjectUpdate?: (projectId: string, updates: Partial<Project>) => void;
  onProjectDelete?: (projectId: string) => void;
  onCreateProject?: (workspaceId: string, projectData: Partial<Project>) => void;
  onProjectSelect?: (project: Project) => void;
  onWorkspaceSelect?: (workspace: Workspace) => void;
}

export function ProjectList({
  projects,
  workspaceId,
  selectedWorkspace,
  availableWorkspaces,
  onProjectUpdate,
  onProjectDelete,
  onCreateProject,
  onProjectSelect,
  onWorkspaceSelect
}: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: ''
  });

  const getStatusIcon = (status: string) => {
    const iconStyle = { width: 'var(--spacing-4)', height: 'var(--spacing-4)' };
    switch (status) {
      case 'active': return <PlayCircle className="text-success" style={iconStyle} />;
      case 'paused': return <PauseCircle className="text-muted-foreground" style={iconStyle} />;
      case 'completed': return <CheckCircle className="text-success" style={iconStyle} />;
      case 'planning': return <FileSearch className="text-primary" style={iconStyle} />;
      default: return <PlayCircle style={iconStyle} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success border-success/20';
      case 'paused': return 'bg-warning/10 text-warning border-warning/20';
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'planning': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground border-muted-foreground/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground border-muted-foreground/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateProject = () => {
    if (onCreateProject && newProject.name.trim()) {
      const projectData: Partial<Project> = {
        name: newProject.name.trim(),
        description: newProject.description.trim(),
        priority: newProject.priority,
        dueDate: newProject.dueDate || undefined,
        status: 'planning',
        progress: 0,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        tags: [],
        workspaceId
      };
      
      onCreateProject(workspaceId, projectData);
      setCreateDialogOpen(false);
      setNewProject({ name: '', description: '', priority: 'medium', dueDate: '' });
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
  };

  const handleDeleteProject = (project: Project) => {
    setDeleteProject(project);
  };

  const handleConfirmDelete = () => {
    if (deleteProject && onProjectDelete) {
      onProjectDelete(deleteProject.id);
    }
    setDeleteProject(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h2>Projects</h2>
          <p className="text-muted-foreground">
            Manage individual projects within this workspace
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} style={{ gap: 'var(--spacing-2)' }}>
          <Plus style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row" style={{ gap: 'var(--spacing-4)' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
          <Input
            placeholder="Search projects by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 'calc(var(--spacing-10))' }}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: 'var(--spacing-6)' }}>
        {filteredProjects.map((project) => (
          <Card 
            key={project.id} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20 group h-full"
            onClick={() => onProjectSelect?.(project)}
          >
            <CardContent className="h-full flex flex-col" style={{ padding: 'var(--spacing-6)' }}>
              {/* Header with icon, title and menu */}
              <div className="flex items-start justify-between" style={{ marginBottom: 'var(--spacing-4)' }}>
                <div className="flex items-start flex-1 min-w-0" style={{ gap: 'var(--spacing-3)' }}>
                  <div className="rounded-lg flex-shrink-0 bg-primary/8 border border-primary/10" style={{ padding: 'var(--spacing-2-5)' }}>
                    <Target className="text-primary" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="truncate group-hover:text-primary transition-colors leading-snug" style={{ marginBottom: 'var(--spacing-1-5)' }}>
                      {project.name}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 hover:bg-muted/50">
                      <MoreHorizontal style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProject(project);
                      }}
                      style={{ gap: 'var(--spacing-2)' }}
                    >
                      <Edit3 style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                      Edit project
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project);
                      }}
                      className="text-destructive focus:text-destructive"
                      style={{ gap: 'var(--spacing-2)' }}
                    >
                      <Trash2 style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                      Delete project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Status and Priority Badges */}
              <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
                <Badge variant="outline" className={`${getStatusColor(project.status)} border-current/20 bg-current/5`} style={{ fontSize: 'var(--font-size-xs)' }}>
                  {getStatusIcon(project.status)}
                  <span className="capitalize" style={{ marginLeft: 'var(--spacing-1-5)' }}>{project.status}</span>
                </Badge>
              </div>

              {/* Progress Section */}
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-2)' }}>
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-primary">{project.progress}%</span>
                </div>
                <Progress value={project.progress} style={{ height: 'var(--spacing-2)' }} />
              </div>

              {/* Metadata - Improved spacing and typography */}
              <div className="flex-grow" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2-5)', marginBottom: 'var(--spacing-4)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">{formatDate(project.createdAt)}</span>
                </div>
                {project.dueDate && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-muted-foreground" style={{ gap: 'var(--spacing-1-5)' }}>
                      <Calendar style={{ width: 'var(--spacing-3-5)', height: 'var(--spacing-3-5)' }} />
                      <span>Due</span>
                    </div>
                    <span className="text-foreground">{formatDate(project.dueDate)}</span>
                  </div>
                )}
                {project.assignedTo && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-muted-foreground" style={{ gap: 'var(--spacing-1-5)' }}>
                      <Users style={{ width: 'var(--spacing-3-5)', height: 'var(--spacing-3-5)' }} />
                      <span>Assigned</span>
                    </div>
                    <span className="text-foreground truncate max-w-24" title={project.assignedTo}>{project.assignedTo}</span>
                  </div>
                )}
              </div>

              {/* Tags - Bottom with improved styling */}
              {project.tags.length > 0 && (
                <div className="flex flex-wrap mt-auto border-t border-border/40" style={{ gap: 'var(--spacing-1-5)', paddingTop: 'var(--spacing-2)' }}>
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-secondary/50 text-secondary-foreground border-0" style={{ fontSize: 'var(--font-size-xs)', paddingLeft: 'var(--spacing-2)', paddingRight: 'var(--spacing-2)', paddingTop: 'var(--spacing-1)', paddingBottom: 'var(--spacing-1)' }}>
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-0" style={{ fontSize: 'var(--font-size-xs)', paddingLeft: 'var(--spacing-2)', paddingRight: 'var(--spacing-2)', paddingTop: 'var(--spacing-1)', paddingBottom: 'var(--spacing-1)' }}>
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center" style={{ paddingTop: 'var(--spacing-12)', paddingBottom: 'var(--spacing-12)' }}>
          <Target className="text-muted-foreground mx-auto" style={{ width: 'var(--spacing-12)', height: 'var(--spacing-12)', marginBottom: 'var(--spacing-4)' }} />
          <h3>No projects found</h3>
          <p className="text-muted-foreground" style={{ marginBottom: 'var(--spacing-4)' }}>
            {projects.length === 0 
              ? "This workspace doesn't have any projects yet. Create your first project to get started."
              : "Try adjusting your search or filter criteria"}
          </p>
          {projects.length === 0 && (
            <Button onClick={() => setCreateDialogOpen(true)} style={{ gap: 'var(--spacing-2)' }}>
              <Plus style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
              Create First Project
            </Button>
          )}
        </div>
      )}

      {/* Create Project Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to this workspace.
            </DialogDescription>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', paddingBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={newProject.name}
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter project name"
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter project description"
                rows={3}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Label htmlFor="project-priority">Priority</Label>
              <Select value={newProject.priority} onValueChange={(value) => setNewProject(prev => ({ ...prev, priority: value as 'high' | 'medium' | 'low' }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Label htmlFor="project-due-date">Due Date (Optional)</Label>
              <Input
                id="project-due-date"
                type="date"
                value={newProject.dueDate}
                onChange={(e) => setNewProject(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} disabled={!newProject.name.trim()}>
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProject} onOpenChange={() => setDeleteProject(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteProject?.name}"? This action cannot be undone and will permanently remove all project data and progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

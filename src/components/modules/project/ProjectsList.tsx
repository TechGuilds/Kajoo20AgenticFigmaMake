import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { WorkspaceConfigurationModal } from '@/components/modules/workspace';
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
  FolderIcon,
  Settings,
  Plus
} from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'planning';
  sourceSystem: string;
  targetSystem: string;
  progress: number;
  phase: 'assessment' | 'setup' | 'migrate' | 'reconstruct' | 'launch' | 'completed';
  createdAt: string;
  lastActivity: string;
  teamSize: number;
  estimatedDuration: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    initials: string;
  };
  phaseProgress: {
    assessment: number;
    setup: number;
    migrate: number;
    reconstruct: number;
    launch: number;
  };
  projectCount: number; // Number of projects in this workspace
}

interface ProjectsListProps {
  projects: Workspace[];
  onProjectSelect: (project: Workspace) => void;
  onProjectUpdate?: (projectId: string, updates: Partial<Workspace>) => void;
  onProjectDelete?: (projectId: string) => void;
  onCreateWorkspace?: () => void;
}

export function ProjectsList({
  projects,
  onProjectSelect,
  onProjectUpdate,
  onProjectDelete,
  onCreateWorkspace
}: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [editingProject, setEditingProject] = useState<Workspace | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deleteProject, setDeleteProject] = useState<Workspace | null>(null);
  const [configureWorkspace, setConfigureWorkspace] = useState<Workspace | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <PlayCircle className="size-4 text-primary" />;
      case 'paused': return <PauseCircle className="size-4 text-muted-foreground" />;
      case 'completed': return <CheckCircle className="size-4 text-success" />;
      case 'planning': return <FileSearch className="size-4 text-primary" />;
      default: return <PlayCircle className="size-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success border-success/20';
      case 'paused': return 'bg-warning/10 text-warning border-warning/20';
      case 'completed': return 'bg-primary/10 text-primary border-primary/20';
      case 'planning': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground border-muted-foreground/20';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'assessment': return 'bg-primary/10 text-primary';
      case 'setup': return 'bg-primary/10 text-primary';
      case 'migrate': return 'bg-warning/10 text-warning';
      case 'reconstruct': return 'bg-primary/10 text-primary';
      case 'launch': return 'bg-success/10 text-success';
      case 'completed': return 'bg-primary/10 text-primary';
      default: return 'bg-muted text-muted-foreground';
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
                         project.sourceSystem.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.targetSystem.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPhase = phaseFilter === 'all' || project.phase === phaseFilter;
    
    return matchesSearch && matchesStatus && matchesPhase;
  });

  // Get project count for workspace
  const getProjectCount = (workspace: Workspace) => {
    return workspace.projectCount || 0;
  };

  const handleEditProject = (project: Workspace) => {
    setEditingProject(project);
    setEditingName(project.name);
  };

  const handleSaveEdit = () => {
    if (editingProject && editingName.trim() && onProjectUpdate) {
      onProjectUpdate(editingProject.id, { name: editingName.trim() });
    }
    setEditingProject(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setEditingName('');
  };

  const handleDeleteProject = (project: Workspace) => {
    setDeleteProject(project);
  };

  const handleConfirmDelete = () => {
    if (deleteProject && onProjectDelete) {
      onProjectDelete(deleteProject.id);
    }
    setDeleteProject(null);
  };

  const handleCancelDelete = () => {
    setDeleteProject(null);
  };

  const handleConfigureWorkspace = (workspace: Workspace) => {
    setConfigureWorkspace(workspace);
  };

  const handleCloseWorkspaceConfig = () => {
    setConfigureWorkspace(null);
  };

  return (
    <div style={{ gap: 'var(--spacing-6)' }} className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1>Migration Workspaces</h1>
          <p className="text-muted-foreground">
            Manage and monitor all your DXP migration workspaces
          </p>
        </div>
        <Button onClick={onCreateWorkspace} style={{ gap: 'var(--spacing-2)' }}>
          <Plus className="size-4" />
          Create new workspace
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row" style={{ gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search workspaces, systems, or technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
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

        <Select value={phaseFilter} onValueChange={setPhaseFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by phase" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Phases</SelectItem>
            <SelectItem value="assessment">Assessment</SelectItem>
            <SelectItem value="setup">Setup</SelectItem>
            <SelectItem value="migrate">Migrate</SelectItem>
            <SelectItem value="reconstruct">Reconstruct</SelectItem>
            <SelectItem value="launch">Launch</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Workspaces Grid - Simple Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: 'var(--spacing-4)' }}>
        {filteredProjects.map((workspace) => (
          <Card 
            key={workspace.id} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20 group"
            onClick={() => onProjectSelect(workspace)}
          >
            <CardContent style={{ padding: 'var(--spacing-6)' }}>
              <div className="flex items-start justify-between" style={{ marginBottom: 'var(--spacing-4)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center" style={{ gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FolderIcon className="size-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate group-hover:text-primary transition-colors">{workspace.name}</h3>
                      <div className="flex items-center" style={{ gap: 'var(--spacing-1)', marginTop: 'var(--spacing-1)' }}>
                        <span className="text-muted-foreground">{getProjectCount(workspace)} projects</span>
                      </div>
                    </div>
                  </div>
                  

                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfigureWorkspace(workspace);
                      }}
                      style={{ gap: 'var(--spacing-2)' }}
                    >
                      <Settings className="size-4" />
                      Workspace settings
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProject(workspace);
                      }}
                      style={{ gap: 'var(--spacing-2)' }}
                    >
                      <Edit3 className="size-4" />
                      Edit name
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(workspace);
                      }}
                      className="text-destructive focus:text-destructive"
                      style={{ gap: 'var(--spacing-2)' }}
                    >
                      <Trash2 className="size-4" />
                      Delete workspace
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Basic Info */}
              <div style={{ gap: 'var(--spacing-2)' }} className="flex flex-col">
                <div className="text-muted-foreground">Created {formatDate(workspace.createdAt)}</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                    <Users className="size-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{workspace.teamSize} members</span>
                  </div>
                  <Avatar className="size-5">
                    <AvatarImage src={workspace.createdBy.avatar} alt={workspace.createdBy.name} />
                    <AvatarFallback>{workspace.createdBy.initials}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center" style={{ paddingTop: 'var(--spacing-12)', paddingBottom: 'var(--spacing-12)' }}>
          <FileSearch className="size-12 text-muted-foreground mx-auto" style={{ marginBottom: 'var(--spacing-4)' }} />
          <h3>No workspaces found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={handleCancelEdit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Workspace Name</DialogTitle>
            <DialogDescription>
              Update the name for this migration workspace.
            </DialogDescription>
          </DialogHeader>
          <div style={{ gap: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', paddingBottom: 'var(--spacing-4)' }} className="flex flex-col">
            <div style={{ gap: 'var(--spacing-2)' }} className="flex flex-col">
              <Label htmlFor="project-name">Workspace Name</Label>
              <Input
                id="project-name"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="Enter workspace name"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveEdit();
                  }
                  if (e.key === 'Escape') {
                    handleCancelEdit();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editingName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProject} onOpenChange={handleCancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteProject?.name}"? This action cannot be undone and will permanently remove all workspace data, migration progress, and associated files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Workspace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Workspace Configuration Modal */}
      <WorkspaceConfigurationModal
        open={!!configureWorkspace}
        onClose={handleCloseWorkspaceConfig}
        workspaceName={configureWorkspace?.name}
      />
    </div>
  );
}
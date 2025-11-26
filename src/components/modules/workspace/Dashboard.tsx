import React, { useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../ui/alert-dialog';
import { Label } from '../../ui/label';
import { WorkspaceConfigurationModal } from '../../WorkspaceConfigurationModal';
import { 
  Users,
  Plus,
  Search,
  PlayCircle,
  PauseCircle,
  CheckCircle,
  FileSearch,
  MoreHorizontal,
  Edit3,
  Trash2,
  FolderIcon,
  Settings,
  Layers
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
  projectCount: number;
  description?: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    initials: string;
  };
  projects?: any[];
  phaseProgress: {
    assessment: number;
    setup: number;
    migrate: number;
    reconstruct: number;
    launch: number;
  };
}

interface DashboardProps {
  projects: Workspace[];
  onProjectSelect: (project: Workspace) => void;
  onCreateProject: () => void;
  onViewAllProjects: () => void;
  onWorkspaceUpdate?: (workspaceId: string, updates: Partial<Workspace>) => void;
  onWorkspaceDelete?: (workspaceId: string) => void;
}

export function Dashboard({ 
  projects, 
  onProjectSelect, 
  onCreateProject, 
  onViewAllProjects, 
  onWorkspaceUpdate, 
  onWorkspaceDelete 
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deleteWorkspace, setDeleteWorkspace] = useState<Workspace | null>(null);
  const [configureWorkspace, setConfigureWorkspace] = useState<Workspace | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <PlayCircle className="text-success" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
      case 'paused': return <PauseCircle className="text-warning" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
      case 'completed': return <CheckCircle className="text-success" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
      case 'planning': return <FileSearch className="text-primary" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
      default: return <PlayCircle style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
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

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'assessment': return 'bg-primary/10 text-primary';
      case 'setup': return 'bg-primary/10 text-primary';
      case 'migrate': return 'bg-warning/10 text-warning';
      case 'reconstruct': return 'bg-primary/10 text-primary';
      case 'launch': return 'bg-success/10 text-success';
      case 'completed': return 'bg-success/10 text-success';
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

  const filteredWorkspaces = projects.filter(workspace => {
    const matchesSearch = workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workspace.sourceSystem.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workspace.targetSystem.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (workspace.description && workspace.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || workspace.status === statusFilter;
    const matchesPhase = phaseFilter === 'all' || workspace.phase === phaseFilter;
    
    return matchesSearch && matchesStatus && matchesPhase;
  });

  const getProjectCount = (workspace: Workspace) => {
    return workspace.projects?.length || 0;
  };

  const getActiveProjectCount = (workspace: Workspace) => {
    return workspace.projects?.filter(project => project.status === 'active').length || 0;
  };

  const handleEditWorkspace = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setEditingName(workspace.name);
  };

  const handleSaveEdit = () => {
    if (editingWorkspace && editingName.trim() && onWorkspaceUpdate) {
      onWorkspaceUpdate(editingWorkspace.id, { name: editingName.trim() });
    }
    setEditingWorkspace(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingWorkspace(null);
    setEditingName('');
  };

  const handleDeleteWorkspace = (workspace: Workspace) => {
    setDeleteWorkspace(workspace);
  };

  const handleConfirmDelete = () => {
    if (deleteWorkspace && onWorkspaceDelete) {
      onWorkspaceDelete(deleteWorkspace.id);
    }
    setDeleteWorkspace(null);
  };

  const handleCancelDelete = () => {
    setDeleteWorkspace(null);
  };

  const handleConfigureWorkspace = (workspace: Workspace) => {
    setConfigureWorkspace(workspace);
  };

  const handleCloseWorkspaceConfig = () => {
    setConfigureWorkspace(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', padding: 'var(--spacing-6)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Manage and monitor all your solution workspaces and their projects
          </p>
        </div>
        <Button onClick={onCreateProject} style={{ gap: 'var(--spacing-2)' }}>
          <Plus style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
          Create new workspace
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row" style={{ gap: 'var(--spacing-4)' }}>
        <div className="relative flex-1">
          <Search className="absolute text-muted-foreground" style={{ left: 'var(--spacing-3)', top: '50%', transform: 'translateY(-50%)', width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
          <Input
            placeholder="Search workspaces, systems, or technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 'var(--spacing-10)' }}
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

      {/* Workspaces Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ gap: 'var(--spacing-4)' }}>
        {filteredWorkspaces.map((workspace) => (
          <Card 
            key={workspace.id} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer border hover:border-primary/20 group"
            onClick={() => onProjectSelect(workspace)}
          >
            <CardContent style={{ padding: 'var(--spacing-6)' }}>
              <div className="flex items-start justify-between" style={{ marginBottom: 'var(--spacing-4)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center" style={{ gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
                    <div className="bg-primary/10 rounded-lg" style={{ padding: 'var(--spacing-2)' }}>
                      <FolderIcon className="text-primary" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate group-hover:text-primary transition-colors">
                        {workspace.name}
                      </h3>
                      <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginTop: 'var(--spacing-1)' }}>
                        <div className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                          <Layers className="text-muted-foreground" style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
                          <span className="text-muted-foreground">
                            {getProjectCount(workspace)} projects
                          </span>
                        </div>
                        {getActiveProjectCount(workspace) > 0 && (
                          <Badge variant="secondary">
                            {getActiveProjectCount(workspace)} active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ height: 'var(--spacing-8)', width: 'var(--spacing-8)', padding: 0 }}>
                      <MoreHorizontal style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
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
                      <Settings style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                      Workspace settings
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditWorkspace(workspace);
                      }}
                      style={{ gap: 'var(--spacing-2)' }}
                    >
                      <Edit3 style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                      Edit name
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWorkspace(workspace);
                      }}
                      className="text-destructive focus:text-destructive"
                      style={{ gap: 'var(--spacing-2)' }}
                    >
                      <Trash2 style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                      Delete workspace
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Status and Phase Badges */}
              <div className="flex" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
                <Badge variant="outline" className={getStatusColor(workspace.status)}>
                  {getStatusIcon(workspace.status)}
                  <span style={{ marginLeft: 'var(--spacing-1)' }} className="capitalize">{workspace.status}</span>
                </Badge>
                <Badge variant="outline" className={getPhaseColor(workspace.phase)}>
                  <span className="capitalize">{workspace.phase}</span>
                </Badge>
              </div>

              {/* Basic Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <div className="text-muted-foreground">
                  Created {formatDate(workspace.createdAt)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                    <Users className="text-muted-foreground" style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
                    <span className="text-muted-foreground">
                      {workspace.teamSize} members
                    </span>
                  </div>
                  <Avatar style={{ width: 'var(--spacing-5)', height: 'var(--spacing-5)' }}>
                    <AvatarImage src={workspace.createdBy.avatar} alt={workspace.createdBy.name} />
                    <AvatarFallback>{workspace.createdBy.initials}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkspaces.length === 0 && (
        <div className="text-center" style={{ padding: 'var(--spacing-12) 0' }}>
          <FileSearch className="text-muted-foreground mx-auto" style={{ width: 'var(--spacing-12)', height: 'var(--spacing-12)', marginBottom: 'var(--spacing-4)' }} />
          <h3>No workspaces found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Edit Workspace Dialog */}
      <Dialog open={!!editingWorkspace} onOpenChange={handleCancelEdit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Workspace Name</DialogTitle>
            <DialogDescription>
              Update the name for this migration workspace.
            </DialogDescription>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', padding: 'var(--spacing-4) 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
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
      <AlertDialog open={!!deleteWorkspace} onOpenChange={handleCancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteWorkspace?.name}"? This action cannot be undone and will permanently remove all workspace data, projects, migration progress, and associated files.
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

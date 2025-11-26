import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Progress } from '../../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { WorkspaceConfigurationModal } from '../../WorkspaceConfigurationModal';
import { StatusCard } from '../shared/cards';
import { ConfirmDialog } from '../shared/dialogs';
import { useFilteredList } from '@/hooks/useFilteredList';
import { useDialogs } from '@/hooks/useDialog';
import { getStatusIcon, getStatusColor, getPhaseColor, type Status, type Phase } from '@/utils/statusUtils';
import { formatDateShort } from '@/utils/dateUtils';
import { 
  Search, 
  Calendar,
  Users,
  Clock,
  ArrowUpRight,
  Edit3,
  Trash2,
  FolderIcon,
  Settings,
  Plus,
  Layers
} from 'lucide-react';

import { type Workspace, type Project } from '~/types';

interface WorkspaceListProps {
  workspaces: Workspace[];
  onWorkspaceSelect: (workspace: Workspace) => void;
  onWorkspaceUpdate?: (workspaceId: string, updates: Partial<Workspace>) => void;
  onWorkspaceDelete?: (workspaceId: string) => void;
  onCreateWorkspace?: () => void;
}

export function WorkspaceList({
  workspaces,
  onWorkspaceSelect,
  onWorkspaceUpdate,
  onWorkspaceDelete,
  onCreateWorkspace
}: WorkspaceListProps) {
  // Use custom hooks for filtering
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    filteredItems: filteredWorkspaces
  } = useFilteredList(workspaces, {
    searchFields: ['name', 'sourceSystem', 'targetSystem', 'description'],
    filterConfigs: {
      status: { defaultValue: 'all' },
      phase: { defaultValue: 'all' }
    },
    filterFn: (workspace, filters) => {
      if (filters.status !== 'all' && workspace.status !== filters.status) return false;
      if (filters.phase !== 'all' && workspace.phase !== filters.phase) return false;
      return true;
    }
  });

  // Use dialogs hook for managing edit, delete, configure dialogs
  const { dialogs, open, close } = useDialogs<Workspace>({
    edit: null,
    delete: null,
    configure: null
  });

  // Editing state
  const [editingName, setEditingName] = React.useState('');

  // Get project count for workspace
  const getProjectCount = (workspace: Workspace) => {
    return workspace.projects?.length || 0;
  };

  // Get active project count for workspace
  const getActiveProjectCount = (workspace: Workspace) => {
    return workspace.projects?.filter(project => project.status === 'active').length || 0;
  };

  const handleEditWorkspace = (workspace: Workspace) => {
    open('edit', workspace);
    setEditingName(workspace.name);
  };

  const handleSaveEdit = () => {
    const editData = dialogs.edit.data;
    if (editData && editingName.trim() && onWorkspaceUpdate) {
      onWorkspaceUpdate(editData.id, { name: editingName.trim() });
    }
    close('edit');
    setEditingName('');
  };

  const handleCancelEdit = () => {
    close('edit');
    setEditingName('');
  };

  const handleDeleteWorkspace = (workspace: Workspace) => {
    open('delete', workspace);
  };

  const handleConfirmDelete = () => {
    const deleteData = dialogs.delete.data;
    if (deleteData && onWorkspaceDelete) {
      onWorkspaceDelete(deleteData.id);
    }
    close('delete');
  };

  const handleCancelDelete = () => {
    close('delete');
  };

  const handleConfigureWorkspace = (workspace: Workspace) => {
    open('configure', workspace);
  };

  const handleCloseWorkspaceConfig = () => {
    close('configure');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1>Workspaces</h1>
          <p className="text-muted-foreground">
            Manage and monitor all your solution workspaces and their projects
          </p>
        </div>
        <Button onClick={onCreateWorkspace} style={{ gap: 'var(--spacing-2)' }}>
          <Plus style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
          Create new workspace
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row" style={{ gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
          <Input
            placeholder="Search workspaces, systems, or technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 'calc(var(--spacing-10))' }}
          />
        </div>
        
        <Select value={filters.status} onValueChange={(value) => setFilter('status', value)}>
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

        <Select value={filters.phase} onValueChange={(value) => setFilter('phase', value)}>
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

      {/* Workspaces Grid - Enhanced Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: 'var(--spacing-4)' }}>
        {filteredWorkspaces.map((workspace) => (
          <Card 
            key={workspace.id} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20 group"
            onClick={() => onWorkspaceSelect(workspace)}
          >
            <CardContent style={{ padding: 'var(--spacing-6)' }}>
              <div className="flex items-start justify-between" style={{ marginBottom: 'var(--spacing-4)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center" style={{ gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
                    <div className="bg-primary/10 rounded-lg" style={{ padding: 'var(--spacing-2)' }}>
                      <FolderIcon className="text-primary" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate group-hover:text-primary transition-colors">{workspace.name}</h3>
                      <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginTop: 'var(--spacing-1)' }}>
                        <div className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                          <Layers className="text-muted-foreground" style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
                          <span className="text-muted-foreground">{getProjectCount(workspace)} projects</span>
                        </div>
                        {getActiveProjectCount(workspace) > 0 && (
                          <Badge variant="secondary" style={{ fontSize: 'var(--font-size-xs)' }}>
                            {getActiveProjectCount(workspace)} active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
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
              <div className="flex" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)' }}>
                <Badge variant="outline" className={getStatusColor(workspace.status)}>
                  {getStatusIcon(workspace.status)}
                  <span className="capitalize" style={{ marginLeft: 'var(--spacing-1)' }}>{workspace.status}</span>
                </Badge>
                <Badge variant="outline" className={getPhaseColor(workspace.phase)}>
                  <span className="capitalize">{workspace.phase}</span>
                </Badge>
              </div>

              {/* Progress */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Progress</span>
                  <span>{workspace.progress}%</span>
                </div>
                <Progress value={workspace.progress} style={{ height: 'var(--spacing-2)' }} />
              </div>

              {/* Basic Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <div className="text-muted-foreground" style={{ fontSize: 'var(--font-size-xs)' }}>
                  Created {formatDateShort(workspace.createdAt)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                    <Users className="text-muted-foreground" style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
                    <span className="text-muted-foreground" style={{ fontSize: 'var(--font-size-xs)' }}>
                      {workspace.teamSize} members
                    </span>
                  </div>
                  <Avatar style={{ width: 'var(--spacing-5)', height: 'var(--spacing-5)' }}>
                    <AvatarImage src={workspace.createdBy.avatar} alt={workspace.createdBy.name} />
                    <AvatarFallback style={{ fontSize: 'var(--font-size-xs)' }}>
                      {workspace.createdBy.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkspaces.length === 0 && (
        <div className="text-center" style={{ paddingTop: 'var(--spacing-12)', paddingBottom: 'var(--spacing-12)' }}>
          <FileSearch className="text-muted-foreground mx-auto" style={{ width: 'var(--spacing-12)', height: 'var(--spacing-12)', marginBottom: 'var(--spacing-4)' }} />
          <h3>No workspaces found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Edit Workspace Dialog */}
      <Dialog open={!!dialogs.edit} onOpenChange={handleCancelEdit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Workspace Name</DialogTitle>
            <DialogDescription>
              Update the name for this migration workspace.
            </DialogDescription>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', paddingBottom: 'var(--spacing-4)' }}>
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
      <ConfirmDialog
        open={!!dialogs.delete.data}
        onOpenChange={(open) => !open && handleCancelDelete()}
        title="Delete Workspace"
        description={`Are you sure you want to delete "${dialogs.delete.data?.name}"? This action cannot be undone and will permanently remove all workspace data, projects, migration progress, and associated files.`}
        confirmText="Delete Workspace"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />

      {/* Workspace Configuration Modal */}
      <WorkspaceConfigurationModal
        open={!!dialogs.configure}
        onClose={handleCloseWorkspaceConfig}
        workspaceName={dialogs.configure?.name}
      />
    </div>
  );
}
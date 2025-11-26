import React from 'react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '../../ui/dropdown-menu';
import { ChevronDown, Plus, Folder } from 'lucide-react';
import { type Workspace } from '../../../types/entities';

interface WorkspaceDropdownProps {
  selectedWorkspace: Workspace;
  availableWorkspaces: Workspace[];
  onWorkspaceSelect: (workspace: Workspace) => void;
  onCreateWorkspace?: () => void;
  getStatusColor?: (status: string) => string;
  showCreateOption?: boolean;
}

export function WorkspaceDropdown({
  selectedWorkspace,
  availableWorkspaces,
  onWorkspaceSelect,
  onCreateWorkspace,
  getStatusColor,
  showCreateOption = false
}: WorkspaceDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 hover:bg-muted/50"
          style={{ marginLeft: 'var(--spacing-1)' }}
        >
          <ChevronDown style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" style={{ width: '16rem' }}>
        {/* Create New Workspace CTA */}
        {showCreateOption && onCreateWorkspace && (
          <>
            <DropdownMenuItem
              onClick={() => onCreateWorkspace()}
              className="cursor-pointer border-b border-border"
              style={{ marginBottom: 'var(--spacing-1)', paddingBottom: 'var(--spacing-2)' }}
            >
              <div className="flex items-center w-full" style={{ gap: 'var(--spacing-3)' }}>
                <div className="rounded bg-primary/10 border border-primary/20" style={{ padding: 'var(--spacing-1-5)' }}>
                  <Plus className="text-primary" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-primary">Create New Workspace</div>
                  <div className="text-muted-foreground" style={{ fontSize: 'var(--font-size-xs)' }}>
                    Set up a new migration workspace
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
            <div style={{ marginLeft: 'var(--spacing-2)', marginRight: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
              <div className="h-px bg-border"></div>
            </div>
          </>
        )}
        
        {/* Existing Workspaces */}
        {availableWorkspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => onWorkspaceSelect(workspace)}
            className={`cursor-pointer ${workspace.id === selectedWorkspace.id ? 'bg-accent' : ''}`}
          >
            <div className="flex items-center w-full" style={{ gap: 'var(--spacing-3)' }}>
              <Folder className="text-muted-foreground" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
              <div className="flex-1 min-w-0">
                <div className="truncate">{workspace.name}</div>
                {workspace.description && (
                  <div className="text-muted-foreground truncate" style={{ fontSize: 'var(--font-size-xs)' }}>
                    {workspace.description}
                  </div>
                )}
              </div>
              {workspace.id === selectedWorkspace.id && (
                <div className="rounded-full bg-primary flex-shrink-0" style={{ width: 'var(--spacing-2)', height: 'var(--spacing-2)' }} />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

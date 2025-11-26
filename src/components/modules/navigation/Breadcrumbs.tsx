import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { WorkspaceDropdown } from '@/components/modules/workspace/WorkspaceDropdown';
import { 
  ChevronRight,
  ChevronDown,
  Home,
  FolderOpen,
  Database,
  BarChart3,
  Settings,
  FileText,
  CheckSquare,
  Plus,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';

import { type View, type TabPanel, type Workspace, type Project, type Task } from '~/types';

interface BreadcrumbsProps {
  currentView: View;
  selectedWorkspace: Workspace | null;
  selectedProject: Project | null;
  selectedTask: Task | null;
  activeTab: TabPanel;
  workspaces: Workspace[];
  onViewChange: (view: View) => void;
  onWorkspaceSelect: (workspace: Workspace) => void;
  onProjectSelect: (project: Project) => void;
  onTaskSelect?: (task: Task) => void;
  onTaskClose?: () => void;
  getStatusColor: (status: string) => string;
  onBackFromSettings?: () => void;
  onCreateWorkspace?: () => void;
}

interface BreadcrumbItem {
  label: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  action?: () => void;
  current?: boolean;
  badge?: string;
  dropdown?: boolean;
  items?: Array<{
    label: string;
    action: () => void;
    badge?: string;
    status?: string;
  }>;
}

export function Breadcrumbs({
  currentView,
  selectedWorkspace,
  selectedProject,
  selectedTask,
  activeTab,
  workspaces,
  onViewChange,
  onWorkspaceSelect,
  onProjectSelect,
  onTaskSelect,
  onTaskClose,
  getStatusColor,
  onBackFromSettings,
  onCreateWorkspace
}: BreadcrumbsProps) {

  const buildBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];

    // Check if we're in settings mode
    const isSettingsMode = currentView === 'workspace-settings' || currentView === 'project-settings' || currentView === 'general-settings';
    
    if (isSettingsMode) {
      // Settings mode: show only back button
      const settingsTitle = currentView === 'workspace-settings' 
        ? `Configure ${selectedWorkspace?.name || 'Workspace'}` 
        : currentView === 'project-settings'
        ? `Configure ${selectedProject?.name || 'Project'}`
        : 'General Settings';
        
      items.push({
        label: settingsTitle,
        icon: ArrowLeft,
        action: onBackFromSettings,
        current: true
      });
      
      return items;
    }

    // Normal navigation mode
    // Start with workspaces overview as the root
    items.push({
      label: 'Workspaces',
      icon: Home,
      action: () => onViewChange('workspace-overview'),
      current: currentView === 'workspace-overview' && !selectedWorkspace
    });

    // Add workspace level (only when a specific workspace is selected)
    if (selectedWorkspace && currentView !== 'workspace-setup') {
      // Workspace dropdown with all workspaces
      items.push({
        label: selectedWorkspace.name,
        icon: Database,
        dropdown: true,
        current: currentView === 'workspace-overview',
        items: workspaces.map(workspace => ({
          label: workspace.name,
          action: () => onWorkspaceSelect(workspace),
          status: workspace.status,
          badge: workspace.projects?.length.toString()
        }))
      });

      // Add project level if we're deeper
      if (selectedProject && (currentView === 'project-overview' || currentView === 'task-list' || currentView === 'task-detail')) {
        items.push({
          label: selectedProject.name,
          icon: FolderOpen,
          dropdown: selectedWorkspace.projects && selectedWorkspace.projects.length > 1,
          current: currentView === 'project-overview',
          items: selectedWorkspace.projects?.map(project => ({
            label: project.name,
            action: () => onProjectSelect(project),
            status: project.status,
            badge: project.tasks?.length?.toString()
          }))
        });

        // Add task level if we're in task views
        if (currentView === 'task-list') {
          items.push({
            label: 'Tasks',
            icon: CheckSquare,
            current: true,
            badge: selectedProject.taskStats?.total?.toString()
          });
        } else if (selectedTask && currentView === 'task-detail') {
          items.push({
            label: 'Tasks',
            icon: CheckSquare,
            action: () => onViewChange('task-list')
          });
          items.push({
            label: selectedTask.title,
            icon: FileText,
            current: true,
            badge: selectedTask.status
          });
        }
      }
    }

    // Handle special views
    if (currentView === 'settings') {
      items.push({
        label: 'Settings',
        icon: Settings,
        current: true
      });
    }

    if (currentView === 'workspace-setup') {
      items.push({
        label: 'New Workspace',
        icon: Plus,
        current: true
      });
    }

    return items;
  };

  const breadcrumbs = buildBreadcrumbs();

  const renderBreadcrumbItem = (item: BreadcrumbItem, index: number) => {
    const isLast = index === breadcrumbs.length - 1;
    const Icon = item.icon;

    const content = (
      <div className={`flex items-center ${item.current ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'} transition-colors`} style={{ gap: 'var(--spacing-2)' }}>
        {Icon && <Icon style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />}
        <span>{item.label}</span>
        {item.badge && (
          <Badge 
            variant="outline"
            className={`${item.badge === 'completed' ? 'bg-success/10 text-success' : 
                       item.badge === 'active' ? 'bg-info/10 text-info' : 
                       item.badge === 'paused' ? 'bg-warning/10 text-warning' : ''}`}
            style={{ fontSize: 'var(--text-xs)', padding: '2px 8px' }}
          >
            {item.badge}
          </Badge>
        )}
        {item.dropdown && <ChevronDown className="ml-1" style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />}
      </div>
    );

    // Special handling for workspace dropdown using WorkspaceDropdown component
    if (item.dropdown && item.icon === Database && selectedWorkspace) {
      return (
        <div key={index} className="flex items-center">
          <div className={`flex items-center ${item.current ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'} transition-colors`} style={{ gap: 'var(--spacing-2)', paddingLeft: 'var(--spacing-2)', paddingRight: 'var(--spacing-2)', paddingTop: 'var(--spacing-2)', paddingBottom: 'var(--spacing-2)' }}>
            <Database style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
            <span>{selectedWorkspace.name}</span>
          </div>
          <WorkspaceDropdown
            selectedWorkspace={selectedWorkspace}
            availableWorkspaces={workspaces}
            onWorkspaceSelect={onWorkspaceSelect}
            onCreateWorkspace={onCreateWorkspace}
            getStatusColor={getStatusColor}
            showCreateOption={true}
          />
        </div>
      );
    }

    if (item.dropdown && item.items) {
      return (
        <DropdownMenu key={index}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={`h-auto hover:bg-muted ${item.current ? 'bg-muted' : ''}`}
              style={{ padding: 'var(--spacing-2)' }}
            >
              {content}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" style={{ width: '16rem' }}>
            {item.items.map((dropdownItem, dropdownIndex) => (
              <DropdownMenuItem 
                key={dropdownIndex}
                onClick={dropdownItem.action}
                className="flex items-center justify-between"
              >
                <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                  <span>{dropdownItem.label}</span>
                  {dropdownItem.status && (
                    <div className={`rounded-full ${getStatusColor(dropdownItem.status)}`} style={{ width: 'var(--spacing-2)', height: 'var(--spacing-2)' }} />
                  )}
                </div>
                {dropdownItem.badge && (
                  <Badge variant="secondary" style={{ fontSize: 'var(--font-size-xs)' }}>
                    {dropdownItem.badge}
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (item.action) {
      // Check if this is a settings item with back functionality
      const isSettingsMode = currentView === 'workspace-settings' || currentView === 'project-settings' || currentView === 'general-settings';
      
      if (isSettingsMode && item.icon === ArrowLeft) {
        return (
          <Button 
            key={index}
            variant="ghost" 
            onClick={item.action}
            className={`h-auto hover:bg-muted ${item.current ? 'bg-muted' : ''}`}
            style={{ padding: 'var(--spacing-2)', gap: 'var(--spacing-2)' }}
          >
            <ArrowLeft style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
            Back
          </Button>
        );
      }
      
      // Regular breadcrumb button
      return (
        <Button 
          key={index}
          variant="ghost" 
          onClick={item.action}
          className={`h-auto hover:bg-muted ${item.current ? 'bg-muted' : ''}`}
          style={{ padding: 'var(--spacing-2)' }}
        >
          {content}
        </Button>
      );
    }

    return (
      <div key={index} style={{ paddingLeft: 'var(--spacing-2)', paddingRight: 'var(--spacing-2)', paddingTop: 'var(--spacing-2)', paddingBottom: 'var(--spacing-2)' }}>
        {content}
      </div>
    );
  };

  return (
    <div className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          {renderBreadcrumbItem(item, index)}
          {index < breadcrumbs.length - 1 && (
            <ChevronRight className="text-muted-foreground" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)', marginLeft: 'var(--spacing-1)', marginRight: 'var(--spacing-1)' }} />
          )}
        </React.Fragment>
      ))}

      {/* Task close button if we're in a task detail view */}
      {selectedTask && currentView === 'task-detail' && onTaskClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onTaskClose}
          className="text-muted-foreground hover:text-foreground"
          style={{ marginLeft: 'var(--spacing-4)' }}
        >
          <MessageSquare className="mr-1" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
          Close Task
        </Button>
      )}
    </div>
  );
}

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/components/modules/shared';

import { 
  Home,
  FolderOpen,
  Settings,
  Users,
  BarChart3,
  Monitor,
  Database,
  Clock,
  GitBranch,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Code,
  Search,
  Target,
  Rocket,
  Shield,
  Globe,
  ArrowLeft,
  FolderTree,
  User,
  LogOut,
  CreditCard,
  Bell,
  Keyboard,
  Moon,
  Sun,
  ChevronUp,
  MessageSquare
} from 'lucide-react';

import { type View, type TabPanel, type Workspace, type Project } from '~/types/entities';

interface MainNavigationProps {
  currentView: View;
  selectedWorkspace: Workspace | null;
  selectedProject: Project | null;
  activeTab: TabPanel;
  onViewChange: (view: View) => void;
  onTabChange: (tab: TabPanel) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  view?: View;
  tab?: TabPanel;
  badge?: string;
  disabled?: boolean;
  description?: string;
  hasNotification?: boolean;
}

export function MainNavigation({ 
  currentView, 
  selectedWorkspace,
  selectedProject, 
  activeTab, 
  onViewChange, 
  onTabChange 
}: MainNavigationProps) {
  
  const { theme, toggleTheme, resolvedTheme } = useTheme();
  // Show icon-only navigation only when in workspace view with a selected project
  const isIconOnly = selectedProject !== null && currentView === 'workspace';

  // Navigation items when no project is selected
  const globalNavItems: NavItem[] = [
    {
      id: 'workspaces',
      label: 'Workspaces',
      icon: Home,
      view: 'workspace-overview',
      description: 'Manage your migration workspaces',
      hasNotification: false
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      view: 'general-settings',
      description: 'Application settings and preferences',
      hasNotification: false
    }
  ];

  // Navigation items when a project is selected (icon-only mode)
  const projectNavItems: NavItem[] = [
    {
      id: 'project-analysis',
      label: 'Analysis & Tasks',
      icon: BarChart3,
      tab: 'project-analysis',
      badge: '48',
      description: 'Task management and progress tracking'
    },
    {
      id: 'project-settings',
      label: 'Settings',
      icon: Settings,
      tab: 'project-settings',
      description: 'Project settings and configuration'
    }
  ];

  const handleItemClick = (item: NavItem) => {
    if (item.disabled) return;
    
    if (item.view) {
      onViewChange(item.view);
    } else if (item.tab !== undefined) {
      onTabChange(item.tab);
    }
  };

  const isActive = (item: NavItem) => {
    if (item.view) {
      // Show "workspace-overview" as active when in workspace or project views
      if (item.view === 'workspace-overview' && (currentView === 'workspace-overview' || currentView === 'project-overview' || currentView === 'task-list' || currentView === 'task-detail')) {
        return true;
      }
      return currentView === item.view;
    } else if (item.tab !== undefined) {
      return activeTab === item.tab;
    }
    return false;
  };

  const renderNavButton = (item: NavItem) => {
    const Icon = item.icon;
    const active = isActive(item);
    const disabled = item.disabled;
    
    const buttonContent = (
      <button
        onClick={() => handleItemClick(item)}
        disabled={disabled}
        className={`flex items-center ${isIconOnly ? 'justify-center' : 'justify-start'} rounded-lg transition-all duration-200 group relative ${
          active
            ? isIconOnly 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-primary text-primary-foreground'
            : disabled
            ? 'text-muted-foreground cursor-not-allowed'
            : isIconOnly
              ? 'text-foreground hover:bg-muted'
              : 'text-foreground hover:bg-muted'
        }`}
        style={
          isIconOnly 
            ? { width: 'var(--spacing-12)', height: 'var(--spacing-12)', padding: 0, marginLeft: 'auto', marginRight: 'auto' }
            : { width: '100%', paddingLeft: 'var(--spacing-4)', paddingRight: 'var(--spacing-4)', paddingTop: 'var(--spacing-3)', paddingBottom: 'var(--spacing-3)', gap: 'var(--spacing-3)' }
        }
      >
        <Icon className="flex-shrink-0 transition-colors duration-200" style={{ width: 'var(--spacing-5)', height: 'var(--spacing-5)' }} />
        {!isIconOnly && (
          <>
            <span className="truncate text-left flex-1 transition-colors duration-200">{item.label}</span>
            {item.badge && !disabled && (
              <Badge variant="secondary" className="ml-auto" style={{ fontSize: 'var(--font-size-xs)' }}>
                {item.badge}
              </Badge>
            )}
            {item.hasNotification && !active && (
              <div className="ml-auto bg-warning rounded-full" style={{ width: 'var(--spacing-2)', height: 'var(--spacing-2)' }}></div>
            )}
          </>
        )}
        {isIconOnly && item.badge && !disabled && (
          <div className="absolute bg-primary text-primary-foreground rounded-full flex items-center justify-center" style={{ top: 'calc(-1 * var(--spacing-1))', right: 'calc(-1 * var(--spacing-1))', minWidth: '18px', height: '18px', fontSize: 'var(--font-size-xs)', paddingLeft: 'var(--spacing-1)', paddingRight: 'var(--spacing-1)' }}>
            {item.badge}
          </div>
        )}
      </button>
    );

    if (isIconOnly) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
            <span>{item.label}</span>
            {item.badge && !disabled && (
              <Badge variant="secondary" style={{ fontSize: 'var(--font-size-xs)' }}>
                {item.badge}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return buttonContent;
  };

  return (
    <TooltipProvider>
      <div className="bg-card border-r border-border flex flex-col h-full transition-all duration-300" style={{ width: isIconOnly ? 'var(--spacing-16)' : '16rem' }}>
        {/* Navigation Content */}
        <div className="flex-1" style={isIconOnly ? { paddingLeft: 'var(--spacing-2)', paddingRight: 'var(--spacing-2)', paddingTop: 'var(--spacing-4)', paddingBottom: 'var(--spacing-4)' } : { padding: 'var(--spacing-4)' }}>
          {/* Global Navigation (when no project selected or in standalone mode) */}
          {(!selectedProject || currentView !== 'workspace') && (
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
              {globalNavItems.map((item) => (
                <React.Fragment key={item.id}>
                  {renderNavButton(item)}
                </React.Fragment>
              ))}
            </nav>
          )}

          {/* Project Navigation (when project is selected and in workspace) */}
          {selectedProject && currentView === 'workspace' && (
            <nav style={{ display: 'flex', flexDirection: 'column', gap: isIconOnly ? 'var(--spacing-2)' : 'var(--spacing-1)' }}>
              {projectNavItems.map((item) => (
                <React.Fragment key={item.id}>
                  {renderNavButton(item)}
                </React.Fragment>
              ))}
              
              {/* Back to Projects & Theme Toggle (icon-only mode) */}
              {isIconOnly && (
                <>
                  <div style={{ marginTop: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)', marginLeft: 'var(--spacing-2)', marginRight: 'var(--spacing-2)' }}>
                    <Separator className="bg-border" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => onViewChange('workspaces')}
                          className="mx-auto flex items-center justify-center rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted"
                          style={{ width: 'var(--spacing-12)', height: 'var(--spacing-12)' }}
                        >
                          <ArrowLeft style={{ width: 'var(--spacing-5)', height: 'var(--spacing-5)' }} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        All Workspaces
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={toggleTheme}
                          className="mx-auto flex items-center justify-center rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted"
                          style={{ width: 'var(--spacing-12)', height: 'var(--spacing-12)' }}
                        >
                          {resolvedTheme === 'dark' ? (
                            <Moon style={{ width: 'var(--spacing-5)', height: 'var(--spacing-5)' }} />
                          ) : (
                            <Sun style={{ width: 'var(--spacing-5)', height: 'var(--spacing-5)' }} />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {theme === 'auto' ? `Auto (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})` : theme === 'light' ? 'Light Theme' : 'Dark Theme'}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </>
              )}
            </nav>
          )}

          {/* Theme Toggle - Global Navigation */}
          {(!selectedProject || currentView !== 'workspace') && (
            <>
              <div style={{ marginTop: 'var(--spacing-6)', marginBottom: 'var(--spacing-6)' }}>
                <Separator className="bg-border" />
              </div>
              <div style={{ paddingLeft: 'var(--spacing-1)', paddingRight: 'var(--spacing-1)' }}>
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="w-full justify-start rounded-lg transition-all duration-200 text-foreground hover:text-foreground hover:bg-muted"
                  style={{ gap: 'var(--spacing-3)', paddingLeft: 'var(--spacing-4)', paddingRight: 'var(--spacing-4)', paddingTop: 'var(--spacing-3)', paddingBottom: 'var(--spacing-3)' }}
                >
                  {resolvedTheme === 'dark' ? (
                    <Moon style={{ width: 'var(--spacing-5)', height: 'var(--spacing-5)' }} />
                  ) : (
                    <Sun style={{ width: 'var(--spacing-5)', height: 'var(--spacing-5)' }} />
                  )}
                  <span>
                    {theme === 'auto' ? `Auto (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})` : theme === 'light' ? 'Light Theme' : 'Dark Theme'}
                  </span>
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Profile Section - Extended Navigation */}
        {!isIconOnly && (
          <div className="border-t border-border">
            {/* Project Stats */}
            {selectedProject && currentView === 'workspace' && (
              <div className="border-b border-border" style={{ padding: 'var(--spacing-4)' }}>
                <div className="text-muted-foreground" style={{ fontSize: 'var(--font-size-xs)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <div className="flex items-center justify-between">
                    <span>Team Members</span>
                    <span className="text-foreground">{selectedProject.teamSize}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Duration</span>
                    <span className="text-foreground">{selectedProject.estimatedDuration}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* User Profile */}

          </div>
        )}

      </div>
    </TooltipProvider>
  );
}

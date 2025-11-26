import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/modules/shared';
import { 
  LayoutDashboard, 
  Settings, 
  Settings as SettingsIcon,
  Database, 
  FolderOpen,
  ArrowLeft,
  LogOut,
  Moon,
  Sun,
  Zap,
  WifiOff
} from 'lucide-react';
import { type View, type TabPanel, type Workspace, type Project, type Task } from '@/types';
import kajooLogo from 'figma:asset/48a871c3a64e669a3735fda2a78b4f1e5cf569cd.png';
import { Breadcrumbs } from '@/components/modules/navigation';
import { AICreditTracker } from '@/components/modules/credit';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: View;
  selectedWorkspace: Workspace | null;
  selectedProject?: Project | null;
  selectedTask?: Task | null;
  activeTab?: TabPanel;
  workspaces?: Workspace[];
  onViewChange: (view: View) => void;
  onTabChange: (tab: TabPanel) => void;
  onWorkspaceSelect?: (workspace: Workspace) => void;
  onProjectSelect?: (project: Project) => void;
  onTaskSelect?: (task: Task) => void;
  onTaskClose?: () => void;
  getStatusColor?: (status: string) => string;
  onBackFromSettings?: () => void;
  onCreateWorkspace?: () => void;
}

export function AppLayout({ 
  children, 
  currentView, 
  selectedWorkspace,
  selectedProject,
  selectedTask,
  activeTab,
  workspaces = [],
  onViewChange, 
  onTabChange,
  onWorkspaceSelect,
  onProjectSelect,
  onTaskSelect,
  onTaskClose,
  getStatusColor,
  onBackFromSettings,
  onCreateWorkspace
}: AppLayoutProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'auto') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('auto');
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Navigation Header */}
      <header className="border-b bg-card flex-shrink-0 w-full">
        <div style={{ padding: 'var(--spacing-3) var(--spacing-6)' }} className="bg-[rgba(0,0,0,0)]">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Main Navigation */}
            <div 
              className="flex items-center"
              style={{ gap: 'var(--spacing-4)' }}
            >
              <button
                onClick={() => onViewChange('workspace-overview')}
                className="h-6 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-sm"
                aria-label="Go to Workspace Overview"
              >
                <img 
                  src={kajooLogo} 
                  alt="Kajoo" 
                  className="h-6 w-auto object-contain"
                />
              </button>
              
              <div className="w-px h-6 bg-border"></div>
              
              <div className="flex items-center gap-1">
                {currentView === 'general-settings' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBackFromSettings}
                    className="hover:bg-muted"
                    style={{ gap: 'var(--spacing-2)' }}
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>
                )}
                {(currentView !== 'workspace-setup' && currentView !== 'general-settings') && (
                  <Breadcrumbs
                    currentView={currentView}
                    selectedWorkspace={selectedWorkspace}
                    selectedProject={selectedProject}
                    selectedTask={selectedTask}
                    activeTab={activeTab}
                    workspaces={workspaces}
                    onViewChange={onViewChange}
                    onWorkspaceSelect={onWorkspaceSelect}
                    onProjectSelect={onProjectSelect}
                    onTaskSelect={onTaskSelect}
                    onTaskClose={onTaskClose}
                    getStatusColor={getStatusColor}
                    onBackFromSettings={onBackFromSettings}
                    onCreateWorkspace={onCreateWorkspace}
                  />
                )}
              </div>
               
              {currentView === 'workspace-setup' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewChange('workspace-overview')}
                  className="hover:bg-muted"
                  style={{ gap: 'var(--spacing-2)' }}
                >
                  <ArrowLeft className="size-4" />
                  Back to Workspaces
                </Button>
              )}
            </div>

            {/* Right: Actions */}
            <div 
              className="flex items-center"
              style={{ gap: 'var(--spacing-2)' }}
            >
              {/* Offline Mode Indicator */}
              {(selectedWorkspace?.id?.includes('demo') || selectedWorkspace?.id?.includes('offline') || selectedWorkspace?.id?.includes('emergency')) && (
                <div className="flex items-center">
                  <Badge variant="outline" className="gap-1 text-warning border-warning/20 bg-warning/10">
                    <WifiOff className="size-3" />
                    Demo Mode
                  </Badge>
                </div>
              )}
              
              {/* AI Credit Tracker */}
              <AICreditTracker />
              
              {/* Global Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0" title="Settings">
                    <Settings className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" className="w-56">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* General Settings - Always visible */}
                  <DropdownMenuItem 
                    style={{ gap: 'var(--spacing-3)' }}
                    onClick={() => onViewChange('general-settings')}
                  >
                    <SettingsIcon className="size-5" />
                    General Settings
                  </DropdownMenuItem>
                  
                  {/* Credit Management Demo */}
                  <DropdownMenuItem 
                    style={{ gap: 'var(--spacing-3)' }}
                    onClick={() => onViewChange('credit-demo')}
                  >
                    <Zap className="size-5" />
                    Credit Management Demo
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {/* Workspace Settings */}
                  {selectedWorkspace && (
                    <>
                      <DropdownMenuItem 
                        style={{ gap: 'var(--spacing-3)' }}
                        onClick={() => onViewChange('workspace-settings')}
                      >
                        <Database className="size-5" />
                        Configure Workspace
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  {/* Project Settings */}
                  {selectedProject && (
                    <>
                      <DropdownMenuItem 
                        style={{ gap: 'var(--spacing-3)' }}
                        onClick={() => onViewChange('project-settings')}
                      >
                        <FolderOpen className="size-5" />
                        Configure Project
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  

                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  // Direct toggle between light and dark only, bypassing auto mode
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                }}
                className="h-9 w-9 p-0 rounded-lg transition-all duration-200 hover:bg-muted"
                title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="size-5 text-foreground" />
                ) : (
                  <Moon className="size-5 text-foreground" />
                )}
              </Button>
              
              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 p-0 rounded-lg transition-all duration-200 hover:bg-muted">
                    <Avatar className="size-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1739298061757-7a3339cee982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMGhlYWRzaG90fGVufDF8fHx8MTc1NjcyNDY5M3ww&ixlib=rb-4.1.0&q=80&w=64&h=64&fit=crop&crop=face" />
                      <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" className="w-56">
                  <DropdownMenuLabel style={{ paddingBottom: 'var(--spacing-2)' }}>
                    <div 
                      className="flex items-center"
                      style={{ gap: 'var(--spacing-3)' }}
                    >
                      <Avatar className="size-9">
                        <AvatarImage src="https://images.unsplash.com/photo-1739298061757-7a3339cee982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMGhlYWRzaG90fGVufDF8fHx8MTc1NjcyNDY5M3ww&ixlib=rb-4.1.0&q=80&w=64&h=64&fit=crop&crop=face" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <div>John Doe</div>
                        <div className="text-muted-foreground">john.doe@company.com</div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    style={{ gap: 'var(--spacing-3)' }}
                    className="text-destructive"
                  >
                    <LogOut className="size-5" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
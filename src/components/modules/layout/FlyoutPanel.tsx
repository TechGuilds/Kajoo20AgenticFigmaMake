import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ProjectAnalysisHub } from '@/components/modules/project';
import { MigrationPreviewCanvas } from '@/components/modules/migration';
import { DesignSystemPanel } from '@/components/modules/shared';
import { WorkspaceSettingsPanel } from '@/components/modules/settings';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { TabPanel } from '@/components/modules/navigation';

interface FlyoutPanelProps {
  tab: TabPanel;
  onClose: () => void;
  selectedProject: any;
  onTaskTrigger: (taskId: string, context?: string) => void;
  onJiraSync: (tasks: any[]) => void;
}

export function FlyoutPanel({ 
  tab, 
  onClose, 
  selectedProject, 
  onTaskTrigger, 
  onJiraSync 
}: FlyoutPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isMaximized, setIsMaximized] = React.useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const navBar = document.querySelector('[data-vertical-nav]');
        if (!navBar?.contains(e.target as Node)) {
          onClose();
        }
      }
    };

    if (tab) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tab, onClose]);

  if (!tab) return null;

  const getTabContent = () => {
    switch (tab) {
      case 'project-analysis':
        return (
          <ProjectAnalysisHub
            selectedProject={selectedProject}
            onTaskTrigger={onTaskTrigger}
            onJiraSync={onJiraSync}
          />
        );
      case 'migration-preview':
        return (
          <div className="h-full">
            <MigrationPreviewCanvas selectedProject={selectedProject} />
          </div>
        );
      case 'design-system':
        return <DesignSystemPanel />;
      case 'integrations':
        return (
          <div style={{ padding: 'var(--spacing-6)' }} className="h-full flex items-center justify-center">
            <div className="text-center">
              <div 
                className="bg-muted rounded-full flex items-center justify-center mx-auto"
                style={{ 
                  width: 'var(--spacing-16)',
                  height: 'var(--spacing-16)',
                  marginBottom: 'var(--spacing-4)'
                }}
              >
                <div className="size-8 bg-muted-foreground/20 rounded-full"></div>
              </div>
              <h3>Integrations</h3>
              <p className="text-muted-foreground">API connections and external tools coming soon</p>
            </div>
          </div>
        );
      case 'workspace-settings':
        return <WorkspaceSettingsPanel selectedProject={selectedProject} />;
      default:
        return null;
    }
  };

  const getTabTitle = () => {
    switch (tab) {
      case 'project-analysis':
        return 'Project Analysis';
      case 'migration-preview':
        return 'Migration Preview';
      case 'design-system':
        return 'Design System';
      case 'integrations':
        return 'Integrations';
      case 'workspace-settings':
        return 'Workspace Settings';
      default:
        return '';
    }
  };

  const getTabDescription = () => {
    switch (tab) {
      case 'project-analysis':
        return 'Task management, execution planning, and progress tracking';
      case 'migration-preview':
        return 'Visual preview of migration artifacts and components';
      case 'design-system':
        return 'Design tokens, color palette, typography, and component specifications';
      case 'integrations':
        return 'API connections, JIRA sync, and external tools';
      case 'workspace-settings':
        return 'Preferences, configurations, and workspace customization';
      default:
        return '';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-200" />
      
      {/* Right Panel - slides from right */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full bg-card border-l shadow-2xl z-50 transition-all duration-300 ease-out ${
          isMaximized ? 'left-0' : 'w-96 md:w-[600px] lg:w-[700px]'
        }`}
        style={{
          transform: tab ? 'translateX(0)' : 'translateX(100%)'
        }}
      >
        {/* Panel Header */}
        <div 
          className="flex items-center justify-between border-b bg-card/95 backdrop-blur"
          style={{ padding: 'var(--spacing-4)' }}
        >
          <div>
            <h2>{getTabTitle()}</h2>
            <p className="text-muted-foreground">
              {getTabDescription()}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMaximized(!isMaximized)}
              className="size-8 p-0"
            >
              {isMaximized ? (
                <Minimize2 className="size-4" />
              ) : (
                <Maximize2 className="size-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="size-8 p-0"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Panel Content */}
        <div className="h-full pb-16 overflow-hidden">
          {getTabContent()}
        </div>
      </div>
    </>
  );
}
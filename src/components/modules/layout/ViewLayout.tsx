import React from 'react';
import { Breadcrumbs } from '@/components/modules/navigation/Breadcrumbs';
import { type View, type TabPanel, type Workspace, type Project } from '@/types';

interface ViewLayoutProps {
  children: React.ReactNode;
  currentView: View;
  selectedWorkspace: Workspace | null;
  selectedProject: Project | null;
  activeTab: TabPanel;
  currentTaskName: string | null;
  projects: Workspace[];
  onViewChange: (view: View) => void;
  onTabChange: (tab: TabPanel) => void;
  onProjectSelect: (workspace: Workspace) => void;
  onTaskClose: () => void;
  getStatusColor: (status: string) => string;
  onProjectAnalysisClick: (project: Project) => void;
  showBreadcrumbs?: boolean;
}

export function ViewLayout({
  children,
  currentView,
  selectedWorkspace,
  selectedProject,
  activeTab,
  currentTaskName,
  projects,
  onViewChange,
  onTabChange,
  onProjectSelect,
  onTaskClose,
  getStatusColor,
  onProjectAnalysisClick,
  showBreadcrumbs = true
}: ViewLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      {showBreadcrumbs && (
        <div style={{ padding: 'var(--spacing-6) var(--spacing-6) var(--spacing-4)' }} className="border-b bg-card">
          <Breadcrumbs
            currentView={currentView}
            selectedWorkspace={selectedWorkspace}
            selectedProject={selectedProject}
            activeTab={activeTab}
            currentTaskName={currentTaskName}
            projects={projects}
            onViewChange={onViewChange}
            onTabChange={onTabChange}
            onProjectSelect={onProjectSelect}
            onTaskClose={onTaskClose}
            getStatusColor={getStatusColor}
            onProjectAnalysisClick={onProjectAnalysisClick}
          />
        </div>
      )}
      {children}
    </div>
  );
}
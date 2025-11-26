
import { type Workspace, type Project } from '../components/WorkspaceList';
import { type View, type TabPanel } from '../components/MainNavigation';
import { DEFAULT_USER, DEFAULT_WORKSPACE_CONFIG } from '../constants/defaults';

interface UseWorkspaceHandlersProps {
  workspaces: Workspace[];
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>;
  setSelectedWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>;
  setSelectedProject: React.Dispatch<React.SetStateAction<Project | null>>;
  setCurrentView: React.Dispatch<React.SetStateAction<View>>;
  setActiveTab: React.Dispatch<React.SetStateAction<TabPanel>>;
  selectedWorkspace: Workspace | null;
}

export const useWorkspaceHandlers = ({
  workspaces,
  setWorkspaces,
  setSelectedWorkspace,
  setSelectedProject,
  setCurrentView,
  setActiveTab,
  selectedWorkspace
}: UseWorkspaceHandlersProps) => {
  
  const handleWorkspaceCreate = (workspaceData: any) => {
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name: workspaceData.name,
      description: workspaceData.description || '',
      status: 'active',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      createdBy: DEFAULT_USER,
      ...DEFAULT_WORKSPACE_CONFIG
    };
    
    setWorkspaces([...workspaces, newWorkspace]);
    setSelectedWorkspace(newWorkspace);
    setCurrentView('project-overview-standalone');
    setActiveTab(null);
  };

  const handleWorkspaceSelect = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setSelectedProject(null);
    setCurrentView('project-overview-standalone');
    setActiveTab(null);
  };

  const handleProjectSelect = (project: Project) => {
    const workspace = workspaces.find(w => w.id === project.workspaceId);
    if (workspace) {
      setSelectedWorkspace(workspace);
    }
    setSelectedProject(project);
    setCurrentView('workspace');
    setActiveTab('project-analysis');
  };

  const handleProjectAnalysisClick = (project: Project) => {
    const workspace = workspaces.find(w => w.id === project.workspaceId);
    if (workspace) {
      setSelectedWorkspace(workspace);
    }
    setSelectedProject(project);
    setCurrentView('workspace');
    setActiveTab('project-analysis');
  };

  const handleWorkspaceUpdate = (workspaceId: string, updates: Partial<Workspace>) => {
    setWorkspaces(prevWorkspaces => 
      prevWorkspaces.map(workspace => 
        workspace.id === workspaceId ? { ...workspace, ...updates } : workspace
      )
    );
    
    if (selectedWorkspace?.id === workspaceId) {
      setSelectedWorkspace(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleWorkspaceDelete = (workspaceId: string) => {
    setWorkspaces(prevWorkspaces => prevWorkspaces.filter(workspace => workspace.id !== workspaceId));
    
    if (selectedWorkspace?.id === workspaceId) {
      setSelectedWorkspace(null);
      setCurrentView('projects');
    }
  };

  return {
    handleWorkspaceCreate,
    handleWorkspaceSelect,
    handleProjectSelect,
    handleProjectAnalysisClick,
    handleWorkspaceUpdate,
    handleWorkspaceDelete
  };
};
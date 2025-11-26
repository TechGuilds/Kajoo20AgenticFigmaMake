import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner@2.0.3';
import { 
  Settings as SettingsIcon,
  Zap,
  Users,
  Clock,
  Target,
  FileText,
  Database,
  Rocket,
  Upload,
  Trash2
} from 'lucide-react';
import { type Project } from '@/types';

type SettingsSection = 'general' | 'integrations';

interface ProjectSettingsProps {
  project?: Project;
  onProjectUpdate?: (projectId: string, updates: Partial<Project>) => void;
}

export function ProjectSettings({ project, onProjectUpdate }: ProjectSettingsProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  
  // Project settings state
  const [settings, setSettings] = useState({
    // General Project Settings
    autoAssignTasks: true,
    notificationsEnabled: true,
    smartSuggestions: true,
    
    // Migration Settings
    batchSize: 50,
    parallelTasks: 3,
    validationLevel: 'thorough'
  });



  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    if (project && onProjectUpdate) {
      try {
        await onProjectUpdate(project.id, {
          metadata: {
            ...project.metadata,
            projectSettings: settings
          }
        });
        toast.success('Project settings saved successfully');
      } catch (error) {
        console.error('Failed to save project settings:', error);
        toast.error('Failed to save project settings');
      }
    }
  };

  const sidebarItems = [
    { id: 'general', label: 'General', icon: SettingsIcon }
  ];

  // Add state for project editing and deletion
  const [editedProjectName, setEditedProjectName] = useState(project?.name || '');
  const [editedProjectDescription, setEditedProjectDescription] = useState(project?.description || '');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleProjectInfoUpdate = async () => {
    if (project && onProjectUpdate) {
      try {
        await onProjectUpdate(project.id, {
          name: editedProjectName,
          description: editedProjectDescription
        });
        toast.success('Project information updated successfully');
      } catch (error) {
        console.error('Failed to update project information:', error);
        toast.error('Failed to update project information');
      }
    }
  };

  const handleProjectDelete = async () => {
    if (deleteConfirmation !== 'Delete') {
      toast.error('Please type "Delete" to confirm');
      return;
    }
    
    if (project && onProjectUpdate) {
      try {
        // This would need to be handled by a delete function in the parent
        console.log('Deleting project:', project.id);
        toast.success('Project deletion initiated');
        setDeleteConfirmation('');
      } catch (error) {
        console.error('Failed to delete project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  const renderGeneralContent = () => (
    <div style={{ gap: 'var(--spacing-6)' }} className="flex flex-col">
      {/* Header */}
      <div>
        <h2>Project Settings</h2>
        <p className="text-muted-foreground">
          Configure project information and manage project lifecycle
          {project && <span style={{ marginLeft: 'var(--spacing-2)' }}>• {project.name}</span>}
        </p>
      </div>

      {/* Project Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
            <FileText className="size-5" />
            Project Information
          </CardTitle>
          <CardDescription>
            Update project name and description
          </CardDescription>
        </CardHeader>
        <CardContent style={{ gap: 'var(--spacing-6)' }} className="flex flex-col">
          <div style={{ gap: 'var(--spacing-3)' }} className="flex flex-col">
            <div style={{ gap: 'var(--spacing-2)' }} className="flex flex-col">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={editedProjectName}
                onChange={(e) => setEditedProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            <div style={{ gap: 'var(--spacing-2)' }} className="flex flex-col">
              <Label htmlFor="project-description">Project Description</Label>
              <Textarea
                id="project-description"
                value={editedProjectDescription}
                onChange={(e) => setEditedProjectDescription(e.target.value)}
                placeholder="Enter project description"
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          
          <div className="flex justify-end border-t" style={{ paddingTop: 'var(--spacing-3)' }}>
            <Button onClick={handleProjectInfoUpdate} style={{ gap: 'var(--spacing-2)' }}>
              <Target className="size-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Project Deletion Section */}
      <Card>
        <CardHeader>
          <CardTitle>Delete Project</CardTitle>
          <CardDescription>
            Permanently delete this project and all its data
          </CardDescription>
        </CardHeader>
        <CardContent style={{ gap: 'var(--spacing-6)' }} className="flex flex-col">
          <div style={{ gap: 'var(--spacing-3)' }} className="flex flex-col">
            <div style={{ gap: 'var(--spacing-2)' }} className="flex flex-col">
              <Label htmlFor="delete-confirmation">
                Type "Delete" to confirm project deletion
              </Label>
              <Input
                id="delete-confirmation"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder='Type "Delete" to confirm'
              />
              <p className="text-muted-foreground">
                This action cannot be undone. This will permanently delete the project and all associated tasks, comments, and data.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end border-t" style={{ paddingTop: 'var(--spacing-3)' }}>
            <Button 
              onClick={handleProjectDelete} 
              variant="destructive"
              disabled={deleteConfirmation !== 'Delete'}
              style={{ gap: 'var(--spacing-2)' }}
            >
              <Trash2 className="size-4" />
              Delete Project Forever
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );




  const renderMainContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralContent();
      default:
        return null;
    }
  };

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <SettingsIcon className="size-12 text-muted-foreground mx-auto" style={{ marginBottom: 'var(--spacing-4)' }} />
          <h3>No Project Selected</h3>
          <p className="text-muted-foreground">Select a project to configure its settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Settings Sidebar */}
      <div className="w-52 border-r bg-card flex-shrink-0">
        <div style={{ padding: 'var(--spacing-6)' }}>
          <h2 style={{ marginBottom: 'var(--spacing-4)' }}>Project Settings</h2>
          <nav style={{ gap: 'var(--spacing-1)' }} className="flex flex-col">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as SettingsSection)}
                  className={`w-full flex items-center rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  style={{ gap: 'var(--spacing-3)', padding: 'var(--spacing-2) var(--spacing-3)' }}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Settings Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div style={{ padding: 'var(--spacing-6)' }}>
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}

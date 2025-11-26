import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plug,
  FileText,
  ExternalLink,
  Github,
  Mail,
  Building2,
  Database,
  Cloud,
  Zap,
  FolderOpen,
  Upload,
  X
} from 'lucide-react';

interface Connector {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'connected' | 'disconnected';
  category: 'development' | 'project-management' | 'cms' | 'communication' | 'storage';
}

interface WorkspaceConfigurationModalProps {
  open: boolean;
  onClose: () => void;
  workspaceName?: string;
}

type ConfigurationSection = 'connectors' | 'instructions';

export function WorkspaceConfigurationModal({ open, onClose, workspaceName }: WorkspaceConfigurationModalProps) {
  const [activeSection, setActiveSection] = useState<ConfigurationSection>('connectors');
  const [instructions, setInstructions] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const connectors: Connector[] = [
    {
      id: 'github',
      name: 'GitHub',
      description: 'Repository management and code deployment',
      icon: Github,
      status: 'disconnected',
      category: 'development'
    },
    {
      id: 'jira',
      name: 'JIRA',
      description: 'Project management and issue tracking',
      icon: Building2,
      status: 'disconnected',
      category: 'project-management'
    },
    {
      id: 'sitecore',
      name: 'Sitecore XP',
      description: 'Source system content and configuration',
      icon: Database,
      status: 'disconnected',
      category: 'cms'
    },
    {
      id: 'xm-cloud',
      name: 'Sitecore XM Cloud',
      description: 'Target system deployment and content',
      icon: Cloud,
      status: 'disconnected',
      category: 'cms'
    },
    {
      id: 'azure-devops',
      name: 'Azure DevOps',
      description: 'CI/CD pipelines and deployment automation',
      icon: Zap,
      status: 'disconnected',
      category: 'development'
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: 'Document storage and collaboration',
      icon: FolderOpen,
      status: 'disconnected',
      category: 'storage'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and notifications',
      icon: Mail,
      status: 'disconnected',
      category: 'communication'
    },
    {
      id: 'confluence',
      name: 'Confluence',
      description: 'Documentation and knowledge base',
      icon: FileText,
      status: 'disconnected',
      category: 'project-management'
    }
  ];

  const handleConnect = (connectorId: string) => {
    console.log(`Connecting to ${connectorId}`);
    // Implementation for connector authentication
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const sidebarItems = [
    { id: 'connectors', label: 'Connectors', icon: Plug },
    { id: 'instructions', label: 'Instructions', icon: FileText }
  ];

  const renderMainContent = () => {
    switch (activeSection) {
      case 'connectors':
        return (
          <div className="space-y-[var(--spacing-6)]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-foreground mb-[var(--spacing-1)]">Connectors</h2>
                <p className="text-muted-foreground">
                  Allow Kajoo to reference other apps and services for more context.
                </p>
              </div>
              <div className="flex gap-[var(--spacing-3)]">
                <Button variant="outline" size="sm">
                  Browse connectors
                </Button>
                <Button variant="outline" size="sm">
                  Add custom connector
                </Button>
              </div>
            </div>

            <div className="grid gap-[var(--spacing-4)]">
              {connectors.map((connector) => {
                const IconComponent = connector.icon;
                return (
                  <Card key={connector.id} className="p-[var(--spacing-4)]">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-[var(--spacing-3)]">
                          <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-lg)] bg-muted">
                            <IconComponent className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-[var(--spacing-2)]">
                              <span>{connector.name}</span>
                              <Badge 
                                variant={connector.status === 'connected' ? 'default' : 'secondary'}
                              >
                                {connector.status === 'connected' ? 'Connected' : 'Disconnected'}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">
                              {connector.description}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleConnect(connector.id)}
                          className="gap-[var(--spacing-2)]"
                        >
                          {connector.status === 'connected' ? 'Manage' : 'Connect'}
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'instructions':
        return (
          <div className="space-y-[var(--spacing-6)]">
            <div>
              <h2 className="text-foreground mb-[var(--spacing-1)]">Workspace Instructions</h2>
              <p className="text-muted-foreground">
                Provide specific instructions and context for this workspace
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Custom Instructions</CardTitle>
                <CardDescription>
                  Provide detailed instructions and context for this workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-[var(--spacing-6)]">
                <div className="space-y-[var(--spacing-3)]">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Provide specific instructions for this workspace. Include any special requirements, constraints, coding standards, or project-specific context that would help with understanding and working with your codebase..."
                    className="min-h-[200px] resize-none"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                  <p className="text-muted-foreground">
                    These instructions will be used to provide context when working on tasks for this workspace.
                  </p>
                </div>

                <div className="space-y-[var(--spacing-3)]">
                  <Label>Supporting Documents</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-[var(--radius-lg)] p-[var(--spacing-6)]">
                    {uploadedFile ? (
                      <div className="flex items-center justify-between p-[var(--spacing-3)] bg-muted/50 rounded-[var(--radius-lg)]">
                        <div className="flex items-center gap-[var(--spacing-3)]">
                          <FileText className="size-5 text-muted-foreground" />
                          <div>
                            <div>{uploadedFile.name}</div>
                            <div className="text-muted-foreground">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveFile}
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <div className="mt-[var(--spacing-4)]">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80">
                              Click to upload
                            </span>
                            <input
                              id="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileUpload}
                              accept=".txt,.md,.pdf,.doc,.docx"
                            />
                          </label>
                          <span className="text-muted-foreground"> or drag and drop</span>
                        </div>
                        <p className="text-muted-foreground mt-[var(--spacing-2)]">
                          Upload documentation, requirements, or reference materials (TXT, MD, PDF, DOC, DOCX)
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    Upload additional documentation that will help provide context and requirements for your workspace.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-[80vw] !w-[80vw] h-[90vh] overflow-hidden p-0 flex flex-col" style={{ maxWidth: '80vw', width: '80vw' }}>
        {/* Fixed Header */}
        <DialogHeader className="p-[var(--spacing-6)] pb-[var(--spacing-4)] border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-[var(--spacing-2)]">
            <Plug className="size-5" />
            Configure Workspace
            {workspaceName && (
              <Badge variant="secondary" className="ml-[var(--spacing-2)]">
                {workspaceName}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Manage workspace settings, connectors, and instructions
          </DialogDescription>
        </DialogHeader>

        {/* Main Content Area - Flexible */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Settings Sidebar */}
          <div className="w-64 border-r bg-card flex-shrink-0">
            <div className="h-full p-[var(--spacing-4)]">
              <nav className="space-y-[var(--spacing-1)]">
                {sidebarItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id as ConfigurationSection)}
                      className={`w-full flex items-center gap-[var(--spacing-3)] px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-lg)] text-left transition-colors ${
                        activeSection === item.id
                          ? 'bg-[var(--color-primary)] text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Settings Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-[var(--spacing-6)]">
              {renderMainContent()}
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex justify-end gap-[var(--spacing-3)] p-[var(--spacing-6)] pt-[var(--spacing-4)] border-t flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
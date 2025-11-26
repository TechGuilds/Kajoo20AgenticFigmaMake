import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle2,
  FolderPlus,
  Rocket
} from 'lucide-react';

interface ProjectSetupProps {
  onProjectCreate: (workspace: any) => void;
  onCancel?: () => void;
}

export function ProjectSetup({ onProjectCreate, onCancel }: ProjectSetupProps) {
  const [workspaceData, setWorkspaceData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = () => {
    console.log('📝 ProjectSetup submitting workspace data:', workspaceData);
    
    if (!workspaceData.name.trim()) {
      console.warn('⚠️ Workspace name is empty');
      return;
    }
    
    onProjectCreate(workspaceData);
  };

  const renderWorkspaceForm = () => (
    <div style={{ gap: 'var(--spacing-6)' }} className="flex flex-col">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto" style={{ marginBottom: 'var(--spacing-4)' }}>
          <FolderPlus className="w-8 h-8 text-primary" />
        </div>
        <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Create New Migration Workspace</h3>
        <p className="text-muted-foreground">Get started by providing some basic information about your workspace</p>
      </div>
      
      <div style={{ gap: 'var(--spacing-4)' }} className="flex flex-col">
        <div style={{ gap: 'var(--spacing-2)' }} className="flex flex-col">
          <Label htmlFor="workspace-name">Workspace Name *</Label>
          <Input
            id="workspace-name"
            placeholder="e.g. Enterprise Portal Migration"
            value={workspaceData.name}
            onChange={(e) => setWorkspaceData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>
        
        <div style={{ gap: 'var(--spacing-2)' }} className="flex flex-col">
          <Label htmlFor="workspace-description">Description</Label>
          <Textarea
            id="workspace-description"
            placeholder="Describe your migration workspace goals, scope, and any key requirements..."
            value={workspaceData.description}
            onChange={(e) => setWorkspaceData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
          />
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg" style={{ padding: 'var(--spacing-4)' }}>
        <h4 style={{ marginBottom: 'var(--spacing-2)' }}>What happens next?</h4>
        <ul className="text-muted-foreground" style={{ gap: 'var(--spacing-1)' }}>
          <li>• Configure source and target systems in workspace settings</li>
          <li>• Upload codebase and assets for analysis</li>
          <li>• Set up AI agents and automation preferences</li>
          <li>• Create projects within the workspace for specific migration tasks</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="h-full flex items-center justify-center" style={{ padding: 'var(--spacing-6)' }}>
      <div className="max-w-2xl w-full">
        <Card>
          <CardContent style={{ padding: 'var(--spacing-8)' }}>
            {renderWorkspaceForm()}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center" style={{ gap: 'var(--spacing-3)', marginTop: 'var(--spacing-6)' }}>
          {onCancel && (
            <Button 
              variant="outline"
              onClick={onCancel}
              style={{ paddingLeft: 'var(--spacing-8)', paddingRight: 'var(--spacing-8)' }}
            >
              Cancel
            </Button>
          )}
          <Button 
            onClick={handleSubmit} 
            disabled={!workspaceData.name.trim()}
            style={{ gap: 'var(--spacing-2)', paddingLeft: 'var(--spacing-8)', paddingRight: 'var(--spacing-8)' }}
          >
            <Rocket className="size-4" />
            Create Workspace
          </Button>
        </div>
      </div>
    </div>
  );
}

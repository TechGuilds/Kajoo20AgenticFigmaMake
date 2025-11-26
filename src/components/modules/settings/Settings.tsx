import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useTheme } from '@/components/modules/shared';
import { seedDatabase, clearDatabase, resetDatabase } from '@/utils/seedData';
import { apiClient } from '@/utils/api';
import { testWorkspaceCreation, testWorkspaceList, testProjectDeletion } from '@/utils/debugWorkspace';
import { toast } from 'sonner@2.0.3';
import { 
  Users, 
  Settings as SettingsIcon,
  Palette,
  Shield,
  Sun,
  Moon,
  ExternalLink,
  Database,
  RefreshCw,
  Trash2,
  Upload,
  Download
} from 'lucide-react';

type SettingsSection = 'general' | 'teams' | 'database';



export function Settings() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  


  // Settings state
  const [settings, setSettings] = useState({
    // Privacy & Security
    dataRetention: '12-months',
    analyticsEnabled: true,
    crashReporting: true
  });

  // Database management state
  const [dbLoading, setDbLoading] = useState({
    seed: false,
    clear: false,
    reset: false,
    health: false
  });
  const [dbStats, setDbStats] = useState<any>(null);



  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Database management functions
  const handleSeedDatabase = async () => {
    setDbLoading(prev => ({ ...prev, seed: true }));
    try {
      await seedDatabase();
      toast.success('Database seeded successfully');
      await loadDbStats();
    } catch (error) {
      console.error('Failed to seed database:', error);
      toast.error('Failed to seed database');
    } finally {
      setDbLoading(prev => ({ ...prev, seed: false }));
    }
  };

  const handleClearDatabase = async () => {
    setDbLoading(prev => ({ ...prev, clear: true }));
    try {
      await clearDatabase();
      toast.success('Database cleared successfully');
      await loadDbStats();
    } catch (error) {
      console.error('Failed to clear database:', error);
      toast.error('Failed to clear database');
    } finally {
      setDbLoading(prev => ({ ...prev, clear: false }));
    }
  };

  const handleResetDatabase = async () => {
    setDbLoading(prev => ({ ...prev, reset: true }));
    try {
      await resetDatabase();
      toast.success('Database reset successfully');
      await loadDbStats();
    } catch (error) {
      console.error('Failed to reset database:', error);
      toast.error('Failed to reset database');
    } finally {
      setDbLoading(prev => ({ ...prev, reset: false }));
    }
  };

  const handleHealthCheck = async () => {
    setDbLoading(prev => ({ ...prev, health: true }));
    try {
      const health = await apiClient.healthCheck();
      toast.success(`Server health: ${health.status}`);
      await loadDbStats();
    } catch (error) {
      console.error('Health check failed:', error);
      toast.error('Health check failed');
    } finally {
      setDbLoading(prev => ({ ...prev, health: false }));
    }
  };

  const handleTestWorkspaceCreation = async () => {
    try {
      const result = await testWorkspaceCreation();
      toast.success('Test workspace created successfully');
      await loadDbStats();
    } catch (error) {
      console.error('Test workspace creation failed:', error);
      toast.error('Test workspace creation failed');
    }
  };

  const handleTestWorkspaceList = async () => {
    try {
      const workspaces = await testWorkspaceList();
      toast.success(`Found ${workspaces.length} workspaces`);
    } catch (error) {
      console.error('Test workspace list failed:', error);
      toast.error('Test workspace list failed');
    }
  };

  const handleTestProjectDeletion = async () => {
    try {
      const result = await testProjectDeletion();
      toast.success('✅ Project deletion test passed');
      await loadDbStats();
    } catch (error) {
      console.error('❌ Project deletion test failed:', error);
      toast.error(`Project deletion test failed: ${error.message}`);
    }
  };

  const handleTestTaskCrud = async () => {
    try {
      console.log('🧪 Starting task CRUD test...');
      
      // First, get all workspaces to find a project to test with
      const workspaces = await apiClient.getWorkspaces();
      console.log('📋 Found workspaces:', workspaces);
      
      // Find a workspace with projects
      let testProject = null;
      
      for (const workspace of workspaces) {
        if (workspace.projects && workspace.projects.length > 0) {
          testProject = workspace.projects[0];
          break;
        }
      }
      
      if (!testProject) {
        // Create a test workspace and project first
        console.log('🧪 No projects found, creating test workspace and project...');
        const testWorkspace = await testWorkspaceCreation();
        testProject = await apiClient.createProject(testWorkspace.id, {
          name: 'Test Project for Task CRUD ' + Date.now(),
          description: 'Test project for task CRUD validation',
          status: 'planning'
        });
        console.log('✅ Test project created:', testProject);
      }
      
      // Test task creation
      console.log('🧪 Testing task creation...');
      const testTask = await apiClient.createTask(testProject.id, {
        title: 'Test Task CRUD ' + Date.now(),
        description: 'Test task for CRUD validation',
        status: 'todo',
        priority: 'medium',
        type: 'assessment',
        estimatedHours: 8
      });
      console.log('✅ Task created:', testTask);
      
      // Test task update
      console.log('🧪 Testing task update...');
      const updatedTask = await apiClient.updateTask(testTask.id, {
        status: 'in-progress',
        description: 'Updated task description for testing'
      });
      console.log('✅ Task updated:', updatedTask);
      
      // Test task deletion
      console.log('🧪 Testing task deletion...');
      await apiClient.deleteTask(testTask.id);
      console.log('✅ Task deleted');
      
      // Verify deletion by checking if task still exists
      console.log('🔍 Verifying task deletion...');
      const updatedProject = await apiClient.getProject(testProject.id);
      console.log('📊 Updated project:', updatedProject);
      const taskStillExists = updatedProject.tasks?.some(t => t.id === testTask.id);
      
      if (taskStillExists) {
        console.error('❌ Task still exists after deletion!');
        throw new Error('Task deletion verification failed - task still exists');
      } else {
        console.log('✅ Task deletion verified - task no longer exists');
      }
      
      toast.success('✅ Task CRUD operations completed successfully!');
      await loadDbStats();
      
    } catch (error) {
      console.error('❌ Task CRUD test failed:', error);
      toast.error(`Task CRUD test failed: ${error.message}`);
    }
  };

  const handleTestAllCrud = async () => {
    try {
      console.log('🧪 Starting comprehensive CRUD test...');
      
      // Test workspace creation
      console.log('🧪 Testing workspace creation...');
      const testWorkspace = await testWorkspaceCreation();
      
      // Test project creation
      console.log('🧪 Testing project creation...');
      const testProject = await apiClient.createProject(testWorkspace.id, {
        name: 'Test Project ' + Date.now(),
        description: 'Test project for CRUD validation',
        status: 'planning'
      });
      console.log('✅ Project created:', testProject);
      
      // Test task creation
      console.log('🧪 Testing task creation...');
      const testTask = await apiClient.createTask(testProject.id, {
        title: 'Test Task ' + Date.now(),
        description: 'Test task for CRUD validation',
        status: 'todo',
        priority: 'medium',
        type: 'assessment'
      });
      console.log('✅ Task created:', testTask);
      
      // Test task update
      console.log('🧪 Testing task update...');
      const updatedTask = await apiClient.updateTask(testTask.id, {
        status: 'completed',
        description: 'Updated task description'
      });
      console.log('✅ Task updated:', updatedTask);
      
      // Test artifact creation
      console.log('🧪 Testing artifact creation...');
      const testArtifact = await apiClient.createArtifact(testTask.id, {
        name: 'Test Artifact',
        type: 'document',
        content: 'Test content for artifact'
      });
      console.log('✅ Artifact created:', testArtifact);
      
      // Test comment creation
      console.log('🧪 Testing comment creation...');
      const testComment = await apiClient.createComment(testTask.id, {
        content: 'Test comment for CRUD validation',
        isAIGenerated: false
      });
      console.log('✅ Comment created:', testComment);
      
      // Test task deletion
      console.log('🧪 Testing task deletion...');
      await apiClient.deleteTask(testTask.id);
      console.log('✅ Task deleted');
      
      // Test project deletion
      console.log('🧪 Testing project deletion...');
      await apiClient.deleteProject(testProject.id);
      console.log('✅ Project deleted');
      
      toast.success('✅ All CRUD operations completed successfully!');
      await loadDbStats();
      
    } catch (error) {
      console.error('❌ CRUD test failed:', error);
      toast.error(`CRUD test failed: ${error.message}`);
    }
  };

  const loadDbStats = async () => {
    try {
      const workspaces = await apiClient.getWorkspaces();
      let totalProjects = 0;
      let totalTasks = 0;
      
      for (const workspace of workspaces) {
        if (workspace.projects) {
          totalProjects += workspace.projects.length;
          for (const project of workspace.projects) {
            if (project.tasks) {
              totalTasks += project.tasks.length;
            }
          }
        }
      }
      
      setDbStats({
        workspaces: workspaces.length,
        projects: totalProjects,
        tasks: totalTasks,
        lastUpdated: new Date().toLocaleString()
      });
    } catch (error) {
      console.error('Failed to load database stats:', error);
    }
  };

  // Load database stats on component mount
  React.useEffect(() => {
    if (activeSection === 'database') {
      loadDbStats();
    }
  }, [activeSection]);





  const sidebarItems = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'database', label: 'Database', icon: Database }
  ];





  const renderGeneralContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', paddingTop: 'var(--spacing-5)', paddingBottom: 'var(--spacing-5)' }}>
      {/* Header */}
      <div>
        <h2 className="text-foreground" style={{ marginBottom: 'var(--spacing-1)' }}>General Settings</h2>
        <p className="text-muted-foreground">Customize the appearance and behavior of your workspace</p>
      </div>

      <Card style={{ marginBottom: 'var(--spacing-6)' }}>
        <CardHeader style={{ padding: 'var(--spacing-4)', paddingBottom: '0' }}>
          <CardTitle className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
            <Palette className="size-5" />
            Theme & Appearance
          </CardTitle>
          <CardDescription>
            Customize the visual appearance of your workspace
          </CardDescription>
        </CardHeader>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', padding: 'var(--spacing-4)', paddingTop: '0' }}>
          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-muted-foreground">Choose your preferred color scheme</p>
            </div>
            <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'auto') => setTheme(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                    <Sun className="size-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                    <Moon className="size-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="auto">
                  <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                    {resolvedTheme === 'dark' ? (
                      <Moon className="size-4" />
                    ) : (
                      <Sun className="size-4" />
                    )}
                    Auto ({resolvedTheme === 'dark' ? 'Dark' : 'Light'})
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>


        </CardContent>
      </Card>

      <Card>
        <CardHeader style={{ padding: 'var(--spacing-4)', paddingBottom: '0' }}>
          <CardTitle className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
            <Shield className="size-5" />
            Privacy & Data
          </CardTitle>
          <CardDescription>
            Control data retention and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', padding: 'var(--spacing-4)', paddingTop: '0' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-4)' }}>
            <div>
              <Label>Data Retention</Label>
              <p className="text-muted-foreground">How long to keep project data</p>
            </div>
            <Select value={settings.dataRetention} onValueChange={(value) => updateSetting('dataRetention', value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3-months">3 Months</SelectItem>
                <SelectItem value="6-months">6 Months</SelectItem>
                <SelectItem value="12-months">12 Months</SelectItem>
                <SelectItem value="indefinite">Indefinite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-4)' }}>
            <div>
              <Label>Analytics</Label>
              <p className="text-muted-foreground">Help improve Kajoo with usage analytics</p>
            </div>
            <Switch 
              checked={settings.analyticsEnabled} 
              onCheckedChange={(checked) => updateSetting('analyticsEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Crash Reporting</Label>
              <p className="text-muted-foreground">Automatically send error reports</p>
            </div>
            <Switch 
              checked={settings.crashReporting} 
              onCheckedChange={(checked) => updateSetting('crashReporting', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );



  const renderTeamsContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', paddingTop: 'var(--spacing-5)', paddingBottom: 'var(--spacing-5)' }}>
      {/* Header */}
      <div>
        <h2 className="text-foreground" style={{ marginBottom: 'var(--spacing-1)' }}>Team Management</h2>
        <p className="text-muted-foreground">Manage team members and collaboration settings</p>
      </div>

      <Card style={{ marginBottom: 'var(--spacing-6)' }}>
        <CardContent 
          className="flex flex-col items-center justify-center text-center" 
          style={{ paddingTop: 'var(--spacing-16)', paddingBottom: 'var(--spacing-16)' }}
        >
          <div 
            className="bg-muted flex items-center justify-center" 
            style={{ 
              width: 'var(--spacing-16)', 
              height: 'var(--spacing-16)', 
              borderRadius: '9999px',
              marginBottom: 'var(--spacing-6)' 
            }}
          >
            <Users className="size-8 text-muted-foreground" />
          </div>
          
          <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Team Settings Available in Kajoo</h3>
          <p className="text-muted-foreground max-w-md" style={{ marginBottom: 'var(--spacing-6)' }}>
            You can manage your own profile, team settings, invite members, and configure collaboration preferences in your main Kajoo application.
          </p>
          
          <Button 
            onClick={() => window.open('https://app.kajoo.ai', '_blank')}
            style={{ gap: 'var(--spacing-2)' }}
          >
            <ExternalLink className="size-4" />
            Open Kajoo App
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderDatabaseContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', paddingTop: 'var(--spacing-5)', paddingBottom: 'var(--spacing-5)' }}>
      {/* Header */}
      <div>
        <h2 className="text-foreground" style={{ marginBottom: 'var(--spacing-1)' }}>Database Management</h2>
        <p className="text-muted-foreground">Manage database operations and view statistics</p>
      </div>

      {/* Database Statistics */}
      <Card style={{ marginBottom: 'var(--spacing-6)' }}>
        <CardHeader style={{ padding: 'var(--spacing-4)', paddingBottom: '0' }}>
          <CardTitle className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
            <Database className="size-5" />
            Database Statistics
          </CardTitle>
          <CardDescription>
            Current database state and content overview
          </CardDescription>
        </CardHeader>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', padding: 'var(--spacing-4)', paddingTop: '0' }}>
          {dbStats ? (
            <div className="grid grid-cols-3" style={{ gap: 'var(--spacing-4)' }}>
              <div className="text-center bg-muted" style={{ padding: 'var(--spacing-4)', borderRadius: 'var(--radius)' }}>
                <div className="text-primary">
                  {dbStats.workspaces}
                </div>
                <div className="text-muted-foreground">Workspaces</div>
              </div>
              <div className="text-center bg-muted" style={{ padding: 'var(--spacing-4)', borderRadius: 'var(--radius)' }}>
                <div className="text-primary">
                  {dbStats.projects}
                </div>
                <div className="text-muted-foreground">Projects</div>
              </div>
              <div className="text-center bg-muted" style={{ padding: 'var(--spacing-4)', borderRadius: 'var(--radius)' }}>
                <div className="text-primary">
                  {dbStats.tasks}
                </div>
                <div className="text-muted-foreground">Tasks</div>
              </div>
            </div>
          ) : (
            <div className="text-center" style={{ paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-8)' }}>
              <RefreshCw className="size-8 animate-spin text-muted-foreground mx-auto" style={{ marginBottom: 'var(--spacing-2)' }} />
              <p className="text-muted-foreground">Loading statistics...</p>
            </div>
          )}
          
          {dbStats && (
            <div className="text-muted-foreground text-center">
              Last updated: {dbStats.lastUpdated}
            </div>
          )}
          
          <Button 
            onClick={loadDbStats} 
            variant="outline" 
            size="sm"
            className="w-full"
          >
            <RefreshCw className="size-4" style={{ marginRight: 'var(--spacing-2)' }} />
            Refresh Statistics
          </Button>
        </CardContent>
      </Card>

      {/* Database Operations */}
      <Card>
        <CardHeader style={{ padding: 'var(--spacing-4)', paddingBottom: '0' }}>
          <CardTitle className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
            <Database className="size-5" />
            Database Operations
          </CardTitle>
          <CardDescription>
            Manage database content and perform maintenance operations
          </CardDescription>
        </CardHeader>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', padding: 'var(--spacing-4)', paddingTop: '0' }}>
          <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-4)' }}>
            <Button
              onClick={handleHealthCheck}
              disabled={dbLoading.health}
              variant="outline"
              className="flex items-center"
              style={{ gap: 'var(--spacing-2)' }}
            >
              {dbLoading.health ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                <Database className="size-4" />
              )}
              Health Check
            </Button>
            
            <Button
              onClick={handleSeedDatabase}
              disabled={dbLoading.seed}
              variant="outline"
              className="flex items-center"
              style={{ gap: 'var(--spacing-2)' }}
            >
              {dbLoading.seed ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              Seed Database
            </Button>

            <Button
              onClick={handleTestWorkspaceCreation}
              variant="outline"
              className="flex items-center"
              style={{ gap: 'var(--spacing-2)' }}
            >
              <Database className="size-4" />
              Test Create
            </Button>
            
            <Button
              onClick={handleTestWorkspaceList}
              variant="outline"
              className="flex items-center"
              style={{ gap: 'var(--spacing-2)' }}
            >
              <Database className="size-4" />
              Test List
            </Button>
          </div>

          <div style={{ marginTop: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <Button
              onClick={handleTestProjectDeletion}
              variant="secondary"
              className="w-full flex items-center"
              style={{ gap: 'var(--spacing-2)' }}
            >
              <Database className="size-4" />
              Test Project Deletion
            </Button>
            
            <Button
              onClick={handleTestTaskCrud}
              variant="secondary"
              className="w-full flex items-center"
              style={{ gap: 'var(--spacing-2)' }}
            >
              <Database className="size-4" />
              Test Task CRUD
            </Button>
            
            <Button
              onClick={handleTestAllCrud}
              variant="default"
              className="w-full flex items-center"
              style={{ gap: 'var(--spacing-2)' }}
            >
              <Database className="size-4" />
              Test All CRUD Operations
            </Button>
          </div>
          
          <div className="border-t" style={{ paddingTop: 'var(--spacing-4)' }}>
            <h4 className="text-destructive" style={{ marginBottom: 'var(--spacing-3)' }}>Danger Zone</h4>
            <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-4)' }}>
              <Button
                onClick={handleClearDatabase}
                disabled={dbLoading.clear}
                variant="destructive"
                className="flex items-center"
                style={{ gap: 'var(--spacing-2)' }}
              >
                {dbLoading.clear ? (
                  <RefreshCw className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Clear Database
              </Button>
              
              <Button
                onClick={handleResetDatabase}
                disabled={dbLoading.reset}
                variant="destructive"
                className="flex items-center"
                style={{ gap: 'var(--spacing-2)' }}
              >
                {dbLoading.reset ? (
                  <RefreshCw className="size-4 animate-spin" />
                ) : (
                  <RefreshCw className="size-4" />
                )}
                Reset Database
              </Button>
            </div>
            <p className="text-muted-foreground" style={{ marginTop: 'var(--spacing-2)' }}>
              These operations cannot be undone. Use with caution.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );



  const renderMainContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralContent();
      case 'teams':
        return renderTeamsContent();
      case 'database':
        return renderDatabaseContent();
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex">
      {/* Settings Sidebar */}
      <div className="w-52 border-r bg-card flex-shrink-0">
        <div style={{ padding: 'var(--spacing-6) var(--spacing-4) var(--spacing-4)' }}>
          <h2 style={{ marginBottom: 'var(--spacing-4)' }}>Settings</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as SettingsSection)}
                  className={`w-full flex items-center text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  style={{ 
                    gap: 'var(--spacing-3)', 
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    borderRadius: 'var(--radius)' 
                  }}
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

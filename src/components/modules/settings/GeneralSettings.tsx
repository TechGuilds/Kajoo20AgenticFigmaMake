import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/components/modules/shared';
import { toast } from 'sonner@2.0.3';
import { 
  Users, 
  Settings as SettingsIcon,
  Palette,
  Shield,
  Sun,
  Moon,
  ExternalLink
} from 'lucide-react';

type SettingsSection = 'general' | 'teams';

export function GeneralSettings() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  
  // Settings state
  const [settings, setSettings] = useState({
    // Privacy & Security
    dataRetention: '12-months',
    analyticsEnabled: true,
    crashReporting: true
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const sidebarItems = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'teams', label: 'Teams', icon: Users }
  ];

  const renderGeneralContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      {/* Header */}
      <div>
        <h2>General Settings</h2>
        <p className="text-muted-foreground" style={{ marginTop: 'var(--spacing-1)' }}>Configure global preferences and behavior for your account</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
            <Palette className="size-5" />
            Theme & Appearance
          </CardTitle>
          <CardDescription>
            Customize the visual appearance across all workspaces
          </CardDescription>
        </CardHeader>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
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
        <CardHeader>
          <CardTitle className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
            <Shield className="size-5" />
            Privacy & Data
          </CardTitle>
          <CardDescription>
            Control data retention and privacy settings for your account
          </CardDescription>
        </CardHeader>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <div className="flex items-center justify-between">
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

          <div className="flex items-center justify-between">
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      {/* Header */}
      <div>
        <h2>Team Management</h2>
        <p className="text-muted-foreground" style={{ marginTop: 'var(--spacing-1)' }}>Manage team members and collaboration settings</p>
      </div>

      <Card>
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
          
          <h3>Team Settings Available in Kajoo</h3>
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

  const renderMainContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralContent();
      case 'teams':
        return renderTeamsContent();
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex">
      {/* Settings Sidebar */}
      <div className="w-52 border-r bg-card flex-shrink-0">
        <div style={{ padding: 'var(--spacing-6)' }}>
          <h2 style={{ marginBottom: 'var(--spacing-4)' }}>General Settings</h2>
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

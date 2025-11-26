import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  BarChart3,
  Monitor,
  Network,
  Palette,
  Zap,
  Settings
} from 'lucide-react';

export type TabPanel = 'project-analysis' | 'migration-preview' | 'sitemap' | 'design-system' | 'integrations' | 'workspace-settings' | null;

interface VerticalNavBarProps {
  activeTab: TabPanel;
  onTabChange: (tab: TabPanel) => void;
  selectedProject: any;
}

interface NavTab {
  id: TabPanel;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  badge?: string;
  disabled?: boolean;
}

export function VerticalNavBar({ activeTab, onTabChange, selectedProject }: VerticalNavBarProps) {
  const navTabs: NavTab[] = [
    {
      id: 'project-analysis',
      icon: BarChart3,
      label: 'Project Analysis',
      description: 'Task management, execution planning, and progress tracking',
      badge: '48'
    },
    {
      id: 'migration-preview',
      icon: Monitor,
      label: 'Migration Preview',
      description: 'Visual preview of migration artifacts and components'
    },
    {
      id: 'sitemap',
      icon: Network,
      label: 'Site Map',
      description: 'Interactive site architecture and page template visualization'
    },
    {
      id: 'design-system',
      icon: Palette,
      label: 'Design System',
      description: 'Design tokens, color palette, typography, and component specifications'
    },
    {
      id: 'integrations',
      icon: Zap,
      label: 'Integrations',
      description: 'API connections, JIRA sync, and external tools',
      disabled: true
    },
    {
      id: 'workspace-settings',
      icon: Settings,
      label: 'Workspace Settings',
      description: 'Manage AI agents, preferences, and workspace customization'
      // Removed disabled: true - Settings are now fully functional!
    }
  ];

  const handleTabClick = (tabId: TabPanel) => {
    if (activeTab === tabId) {
      onTabChange(null); // Close if already open
    } else {
      onTabChange(tabId);
    }
  };

  if (!selectedProject) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="w-14 bg-card border-r border-border flex flex-col items-center py-4 gap-2 h-full">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isDisabled = tab.disabled;
          
          return (
            <Tooltip key={tab.id} delayDuration={300}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className={`size-10 p-0 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !isDisabled && handleTabClick(tab.id)}
                    disabled={isDisabled}
                  >
                    <Icon className="size-5" />
                  </Button>
                  {tab.badge && !isDisabled && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-1 -right-1 size-5 text-xs p-0 flex items-center justify-center bg-info text-white"
                    >
                      {tab.badge}
                    </Badge>
                  )}
                  {isDisabled && (
                    <div className="absolute -top-1 -right-1 size-3 bg-warning rounded-full"></div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <div>
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{tab.description}</div>
                  {isDisabled && (
                    <div className="text-xs text-warning mt-1 font-medium">Coming Soon</div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

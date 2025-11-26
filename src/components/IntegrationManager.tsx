import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { 
  Check, 
  X, 
  ExternalLink, 
  Key, 
  AlertTriangle,
  GitBranch,
  Database,
  BarChart3,
  Globe,
  Zap,
  Settings,
  RefreshCw,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { ManageConnectionsDrawer } from './ManageConnectionsDrawer';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'connected' | 'disconnected' | 'error' | 'configuring';
  apiKey?: string;
  endpoint?: string;
  lastSync?: string;
  features: string[];
  isActive: boolean;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'jira',
    name: 'JIRA',
    description: 'Project management and issue tracking',
    icon: BarChart3,
    status: 'connected',
    endpoint: 'https://yourcompany.atlassian.net',
    lastSync: '2 minutes ago',
    features: ['Epic Creation', 'Story Tracking', 'Sprint Planning', 'Progress Updates'],
    isActive: true
  },
  {
    id: 'productive',
    name: 'Productive',
    description: 'Alternative project management platform',
    icon: Database,
    status: 'disconnected',
    features: ['Task Management', 'Time Tracking', 'Budget Planning', 'Resource Allocation'],
    isActive: false
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Source code repository and version control',
    icon: GitBranch,
    status: 'connected',
    endpoint: 'https://api.github.com',
    lastSync: '5 minutes ago',
    features: ['Repository Access', 'Code Analysis', 'PR Creation', 'Branch Management'],
    isActive: true
  },
  {
    id: 'azure-devops',
    name: 'Azure DevOps',
    description: 'Microsoft DevOps platform',
    icon: GitBranch,
    status: 'configuring',
    features: ['Repository Access', 'Build Pipelines', 'Work Items', 'Testing'],
    isActive: false
  },
  {
    id: 'sitecore-cloud',
    name: 'Sitecore XM Cloud',
    description: 'Target headless CMS platform',
    icon: Globe,
    status: 'connected',
    endpoint: 'https://xmcloud.sitecorecloud.io',
    lastSync: '1 minute ago',
    features: ['Content Import', 'Template Creation', 'Publishing', 'Preview'],
    isActive: true
  },
  {
    id: 'sitecore-xmc',
    name: 'Sitecore XMC',
    description: 'Sitecore Experience Management Cloud platform',
    icon: Globe,
    status: 'disconnected',
    features: ['GraphQL API', 'Content Management', 'Headless Architecture', 'Multi-site Support'],
    isActive: false
  },
  {
    id: 'optimizely',
    name: 'Optimizely CMS',
    description: 'Alternative target CMS platform',
    icon: Globe,
    status: 'disconnected',
    features: ['Content Migration', 'Model Creation', 'API Integration', 'Deployment'],
    isActive: false
  },
  {
    id: 'lighthouse',
    name: 'Google Lighthouse',
    description: 'SEO and performance auditing',
    icon: Zap,
    status: 'connected',
    lastSync: '10 minutes ago',
    features: ['Performance Audit', 'SEO Analysis', 'Accessibility Check', 'Best Practices'],
    isActive: true
  },
  {
    id: 'axe-core',
    name: 'axe-core',
    description: 'Accessibility testing engine',
    icon: CheckCircle2,
    status: 'connected',
    lastSync: '15 minutes ago',
    features: ['WCAG Compliance', 'Automated Testing', 'Remediation Suggestions', 'Reporting'],
    isActive: true
  }
];

export function IntegrationManager() {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConnectionDrawerOpen, setIsConnectionDrawerOpen] = useState(false);
  const [selectedConnectorType, setSelectedConnectorType] = useState<string | null>(null);

  // Mock connections for Sitecore XMC
  const sitecoreXmcConnections = [
    {
      id: '1',
      name: 'Production XMC',
      type: 'integration' as const,
      status: 'connected' as const,
      lastSync: '10 minutes ago',
      description: 'Production Sitecore XMC environment'
    },
    {
      id: '2', 
      name: 'Staging XMC',
      type: 'integration' as const,
      status: 'disconnected' as const,
      description: 'Staging Sitecore XMC environment'
    }
  ];

  const handleIntegrationClick = (integration: Integration) => {
    if (integration.id === 'sitecore-xmc') {
      setSelectedConnectorType('sitecore-xmc');
      setIsConnectionDrawerOpen(true);
    } else {
      setSelectedIntegration(integration);
    }
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return <CheckCircle2 className="size-4 text-success" />;
      case 'error': return <XCircle className="size-4 text-destructive" />;
      case 'configuring': return <RefreshCw className="size-4 text-warning animate-spin" />;
      default: return <XCircle className="size-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return <Badge className="bg-success/10 text-success border-success/20">Connected</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
      case 'configuring': return <Badge className="bg-warning/10 text-warning border-warning/20">Configuring</Badge>;
      default: return <Badge variant="secondary">Disconnected</Badge>;
    }
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, isActive: !integration.isActive }
        : integration
    ));
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const activeCount = integrations.filter(i => i.isActive).length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Connected</p>
                <p className="font-bold">{connectedCount}</p>
              </div>
              <CheckCircle2 className="size-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Active</p>
                <p className="font-bold">{activeCount}</p>
              </div>
              <Zap className="size-8 text-info" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Total</p>
                <p className="font-bold">{integrations.length}</p>
              </div>
              <Settings className="size-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <Card key={integration.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleIntegrationClick(integration)}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-lg">
                          <Icon className="size-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{integration.name}</h3>
                          <p className="text-muted-foreground">{integration.description}</p>
                          {integration.lastSync && (
                            <p className="text-muted-foreground mt-1">
                              Last sync: {integration.lastSync}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(integration.status)}
                          {getStatusBadge(integration.status)}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`toggle-${integration.id}`}>Active</Label>
                          <Switch 
                            id={`toggle-${integration.id}`}
                            checked={integration.isActive}
                            onCheckedChange={() => toggleIntegration(integration.id)}
                            disabled={integration.status === 'disconnected'}
                          />
                        </div>
                        
                        <ExternalLink className="size-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    {integration.features.length > 0 && (
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                          {integration.features.slice(0, 4).map((feature) => (
                            <Badge key={feature} variant="outline">
                              {feature}
                            </Badge>
                          ))}
                          {integration.features.length > 4 && (
                            <Badge variant="outline">
                              +{integration.features.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="configure" className="space-y-6">
          {selectedIntegration ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <selectedIntegration.icon className="size-6" />
                  Configure {selectedIntegration.name}
                </CardTitle>
                <CardDescription>
                  Set up connection details and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="endpoint">API Endpoint</Label>
                    <Input 
                      id="endpoint"
                      placeholder="https://api.example.com"
                      value={selectedIntegration.endpoint || ''}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="api-key">API Key / Token</Label>
                    <Input 
                      id="api-key"
                      type="password"
                      placeholder="Enter your API key"
                      value={selectedIntegration.apiKey || ''}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Available Features</h4>
                  <div className="space-y-2">
                    {selectedIntegration.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="size-4 text-success" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button>Test Connection</Button>
                  <Button variant="outline">Save Configuration</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Settings className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold mb-2">Select Integration to Configure</h3>
                <p className="text-muted-foreground">
                  Choose an integration from the overview tab to configure its settings
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Activity</CardTitle>
              <CardDescription>Recent API calls and synchronization events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: '2 minutes ago', event: 'JIRA: Created epic "Code Migration Phase 1"', status: 'success' },
                  { time: '5 minutes ago', event: 'GitHub: Analyzed repository structure', status: 'success' },
                  { time: '8 minutes ago', event: 'Sitecore XM Cloud: Content model sync completed', status: 'success' },
                  { time: '12 minutes ago', event: 'Lighthouse: Performance audit completed', status: 'success' },
                  { time: '15 minutes ago', event: 'axe-core: Accessibility scan completed', status: 'success' },
                  { time: '20 minutes ago', event: 'Azure DevOps: Connection timeout', status: 'error' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    {log.status === 'success' ? (
                      <CheckCircle2 className="size-4 text-success" />
                    ) : (
                      <AlertTriangle className="size-4 text-destructive" />
                    )}
                    <div className="flex-1">
                      <div>{log.event}</div>
                      <div className="text-muted-foreground">{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sitecore XMC Connections Drawer */}
      <ManageConnectionsDrawer
        isOpen={isConnectionDrawerOpen}
        onOpenChange={setIsConnectionDrawerOpen}
        connections={selectedConnectorType === 'sitecore-xmc' ? sitecoreXmcConnections : []}
        connectorType={selectedConnectorType}
        onConnectionAdd={(connection) => {
          console.log('Adding Sitecore XMC connection:', connection);
        }}
        onConnectionUpdate={(id, updates) => {
          console.log('Updating Sitecore XMC connection:', id, updates);
        }}
        onConnectionDelete={(id) => {
          console.log('Deleting Sitecore XMC connection:', id);
        }}
      />
    </div>
  );
}
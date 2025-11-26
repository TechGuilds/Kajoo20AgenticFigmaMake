import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Database,
  Plug,
  CheckCircle2,
  AlertCircle,
  Settings,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Globe
} from 'lucide-react';

interface Connection {
  id: string;
  name: string;
  type: 'database' | 'api' | 'integration';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  description?: string;
}

interface ManageConnectionsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  connections?: Connection[];
  connectorType?: string | null;
  onConnectionAdd?: (connection: Omit<Connection, 'id'>) => void;
  onConnectionUpdate?: (id: string, updates: Partial<Connection>) => void;
  onConnectionDelete?: (id: string) => void;
}

const mockConnections: Connection[] = [
  {
    id: '1',
    name: 'Sitecore Database',
    type: 'database',
    status: 'connected',
    lastSync: '2 minutes ago',
    description: 'Primary Sitecore content database'
  },
  {
    id: '2',
    name: 'JIRA Integration',
    type: 'integration',
    status: 'connected',
    lastSync: '5 minutes ago',
    description: 'Project management and task tracking'
  },
  {
    id: '3',
    name: 'Legacy API',
    type: 'api',
    status: 'error',
    lastSync: '2 hours ago',
    description: 'Legacy system API endpoint'
  }
];

export function ManageConnectionsDrawer({
  isOpen,
  onOpenChange,
  connections = mockConnections,
  connectorType = null,
  onConnectionAdd,
  onConnectionUpdate,
  onConnectionDelete
}: ManageConnectionsDrawerProps) {
  const [showNewConnectionForm, setShowNewConnectionForm] = useState(false);
  const [showSitecoreXmcDialog, setShowSitecoreXmcDialog] = useState(false);
  const [newConnection, setNewConnection] = useState({
    name: '',
    type: 'database' as Connection['type'],
    description: ''
  });

  // Sitecore XMC configuration state
  const [sitecoreXmcConfig, setSitecoreXmcConfig] = useState({
    name: '',
    description: '',
    graphqlEndpoint: '',
    clientId: '',
    clientSecret: '',
    graphqlHeaders: {} as Record<string, string>
  });

  const handleAddConnection = () => {
    if (newConnection.name.trim()) {
      onConnectionAdd?.({
        ...newConnection,
        status: 'disconnected'
      });
      setNewConnection({ name: '', type: 'database', description: '' });
      setShowNewConnectionForm(false);
    }
  };

  const handleAddSitecoreXmcConnection = () => {
    if (sitecoreXmcConfig.name.trim() && sitecoreXmcConfig.graphqlEndpoint.trim()) {
      onConnectionAdd?.({
        name: sitecoreXmcConfig.name,
        type: 'integration',
        description: sitecoreXmcConfig.description || 'Sitecore XMC Connection',
        status: 'disconnected'
      });
      setSitecoreXmcConfig({
        name: '',
        description: '',
        graphqlEndpoint: '',
        clientId: '',
        clientSecret: '',
        graphqlHeaders: {}
      });
      setShowSitecoreXmcDialog(false);
    }
  };

  const handleAddNewConnectionClick = () => {
    if (connectorType === 'sitecore-xmc') {
      setShowSitecoreXmcDialog(true);
    } else {
      setShowNewConnectionForm(!showNewConnectionForm);
    }
  };

  const getStatusColor = (status: Connection['status']) => {
    switch (status) {
      case 'connected':
        return 'text-success border-success/20 bg-success/10';
      case 'error':
        return 'text-destructive border-destructive/20 bg-destructive/10';
      case 'disconnected':
        return 'text-muted-foreground border-border bg-muted/50';
      default:
        return 'text-muted-foreground border-border bg-muted/50';
    }
  };

  const getStatusIcon = (status: Connection['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="size-4" />;
      case 'error':
        return <AlertCircle className="size-4" />;
      case 'disconnected':
        return <Plug className="size-4" />;
      default:
        return <Plug className="size-4" />;
    }
  };

  const getTypeIcon = (type: Connection['type']) => {
    switch (type) {
      case 'database':
        return <Database className="size-4" />;
      case 'api':
        return <Plug className="size-4" />;
      case 'integration':
        return <Settings className="size-4" />;
      default:
        return <Plug className="size-4" />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2">
            {connectorType === 'sitecore-xmc' ? (
              <>
                <Globe className="size-5" />
                Sitecore XMC Connections
              </>
            ) : (
              <>
                <Database className="size-5" />
                Manage Connections
              </>
            )}
          </SheetTitle>
          <SheetDescription>
            {connectorType === 'sitecore-xmc' 
              ? 'Configure and manage your Sitecore XMC connections.'
              : 'Configure and manage your system connections and integrations.'
            }
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 py-4">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {/* Add Connection Button */}
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Active Connections</h3>
                <Button
                  size="sm"
                  onClick={() => handleAddNewConnectionClick()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="size-4 mr-1" />
                  Add Connection
                </Button>
              </div>

              {/* New Connection Form */}
              {showNewConnectionForm && (
                <div className="p-4 border border-border rounded-lg bg-card space-y-4">
                  <h4 className="font-medium">New Connection</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="connection-name">Name</Label>
                      <Input
                        id="connection-name"
                        placeholder="Connection name"
                        value={newConnection.name}
                        onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="connection-type">Type</Label>
                      <select
                        id="connection-type"
                        className="w-full px-3 py-2 border border-input-border rounded-md bg-input-background text-foreground"
                        value={newConnection.type}
                        onChange={(e) => setNewConnection(prev => ({ ...prev, type: e.target.value as Connection['type'] }))}
                      >
                        <option value="database">Database</option>
                        <option value="api">API</option>
                        <option value="integration">Integration</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="connection-description">Description</Label>
                      <Textarea
                        id="connection-description"
                        placeholder="Connection description"
                        value={newConnection.description}
                        onChange={(e) => setNewConnection(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewConnectionForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddConnection}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Add Connection
                    </Button>
                  </div>
                </div>
              )}

              {/* Sitecore XMC Connection Form */}
              {showSitecoreXmcDialog && (
                <div className="p-4 border border-border rounded-lg bg-card space-y-4">
                  <h4 className="font-medium">Sitecore XMC Connection</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="xmc-name">Name</Label>
                      <Input
                        id="xmc-name"
                        placeholder="Connection name"
                        value={sitecoreXmcConfig.name}
                        onChange={(e) => setSitecoreXmcConfig(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="xmc-description">Description</Label>
                      <Input
                        id="xmc-description"
                        placeholder="Connection description"
                        value={sitecoreXmcConfig.description}
                        onChange={(e) => setSitecoreXmcConfig(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="xmc-graphql-endpoint">GraphQL Endpoint</Label>
                      <Input
                        id="xmc-graphql-endpoint"
                        placeholder="GraphQL endpoint URL"
                        value={sitecoreXmcConfig.graphqlEndpoint}
                        onChange={(e) => setSitecoreXmcConfig(prev => ({ ...prev, graphqlEndpoint: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="xmc-client-id">Client ID</Label>
                      <Input
                        id="xmc-client-id"
                        placeholder="Client ID"
                        value={sitecoreXmcConfig.clientId}
                        onChange={(e) => setSitecoreXmcConfig(prev => ({ ...prev, clientId: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="xmc-client-secret">Client Secret</Label>
                      <Input
                        id="xmc-client-secret"
                        placeholder="Client Secret"
                        value={sitecoreXmcConfig.clientSecret}
                        onChange={(e) => setSitecoreXmcConfig(prev => ({ ...prev, clientSecret: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="xmc-graphql-headers">GraphQL Headers</Label>
                      <Input
                        id="xmc-graphql-headers"
                        placeholder="GraphQL headers (JSON format)"
                        value={JSON.stringify(sitecoreXmcConfig.graphqlHeaders, null, 2)}
                        onChange={(e) => {
                          try {
                            setSitecoreXmcConfig(prev => ({ ...prev, graphqlHeaders: JSON.parse(e.target.value) }));
                          } catch (error) {
                            console.error('Invalid JSON format for GraphQL headers');
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSitecoreXmcDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddSitecoreXmcConnection}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Add Connection
                    </Button>
                  </div>
                </div>
              )}

              <Separator />

              {/* Connections List */}
              <div className="space-y-3">
                {connections.map((connection) => (
                  <div
                    key={connection.id}
                    className="p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-muted">
                          {getTypeIcon(connection.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{connection.name}</h4>
                          <p className="text-muted-foreground">
                            {connection.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={getStatusColor(connection.status)}
                        >
                          {getStatusIcon(connection.status)}
                          <span className="ml-1 capitalize">{connection.status}</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-muted-foreground">
                        {connection.lastSync && `Last sync: ${connection.lastSync}`}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2"
                        >
                          <Settings className="size-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                          onClick={() => onConnectionDelete?.(connection.id)}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {connections.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="size-12 mx-auto mb-4 opacity-50" />
                  <p>No connections configured</p>
                  <p>Add your first connection to get started</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Example usage trigger component
export function ManageConnectionsTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Database className="size-4" />
        Manage Connections
      </Button>
      
      <ManageConnectionsDrawer
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onConnectionAdd={(connection) => {
          console.log('Adding connection:', connection);
        }}
        onConnectionUpdate={(id, updates) => {
          console.log('Updating connection:', id, updates);
        }}
        onConnectionDelete={(id) => {
          console.log('Deleting connection:', id);
        }}
      />
    </>
  );
}
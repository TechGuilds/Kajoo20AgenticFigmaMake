import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  Brain, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  Zap,
  MessageSquare,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface AgentMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  type: 'request' | 'response' | 'notification' | 'error';
  message: string;
  timestamp: string;
  data?: any;
}

interface AgentWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'error' | 'paused';
  progress: number;
  steps: WorkflowStep[];
  dependencies: string[];
}

interface WorkflowStep {
  id: string;
  name: string;
  agent: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  duration?: string;
  outputs?: string[];
}

const AGENT_WORKFLOWS: AgentWorkflow[] = [
  {
    id: 'discovery-workflow',
    name: 'Discovery & Audit Workflow',
    description: 'Comprehensive analysis of source system',
    status: 'running',
    progress: 65,
    dependencies: [],
    steps: [
      { id: 'security-scan', name: 'Security & Compliance Scan', agent: 'Security Agent', status: 'completed', duration: '2m 15s', outputs: ['PII scan complete', 'License compliance verified'] },
      { id: 'code-analysis', name: 'Code Structure Analysis', agent: 'Code Audit Agent', status: 'running', duration: '5m 30s' },
      { id: 'content-crawl', name: 'Content Inventory', agent: 'Content Audit Agent', status: 'running' },
      { id: 'experience-mapping', name: 'Experience Layer Mapping', agent: 'Experience Agent', status: 'pending' },
      { id: 'seo-baseline', name: 'SEO Baseline Assessment', agent: 'SEO Agent', status: 'pending' }
    ]
  },
  {
    id: 'design-workflow',
    name: 'Solution Design Workflow',
    description: 'Architecture planning and component mapping',
    status: 'idle',
    progress: 0,
    dependencies: ['discovery-workflow'],
    steps: [
      { id: 'architecture-design', name: 'Architecture Design', agent: 'Architecture Agent', status: 'pending' },
      { id: 'content-modeling', name: 'Content Model Creation', agent: 'Content Modeling Agent', status: 'pending' },
      { id: 'component-mapping', name: 'Component Mapping', agent: 'Component Mapping Agent', status: 'pending' },
      { id: 'work-breakdown', name: 'Work Breakdown Structure', agent: 'Work Breakdown Agent', status: 'pending' }
    ]
  },
  {
    id: 'execution-workflow',
    name: 'Migration Execution Workflow',
    description: 'Code and content migration implementation',
    status: 'idle',
    progress: 0,
    dependencies: ['design-workflow'],
    steps: [
      { id: 'scaffold-setup', name: 'Project Scaffolding', agent: 'Scaffold Agent', status: 'pending' },
      { id: 'code-migration', name: 'Code Migration', agent: 'Code Migration Agent', status: 'pending' },
      { id: 'content-etl', name: 'Content ETL Process', agent: 'Content ETL Agent', status: 'pending' },
      { id: 'seo-optimization', name: 'SEO Optimization', agent: 'SEO Optimization Agent', status: 'pending' },
      { id: 'accessibility-remediation', name: 'Accessibility Remediation', agent: 'Accessibility Agent', status: 'pending' }
    ]
  }
];

const RECENT_MESSAGES: AgentMessage[] = [
  {
    id: '1',
    fromAgent: 'Orchestrator',
    toAgent: 'Code Audit Agent',
    type: 'request',
    message: 'Begin code structure analysis for Enterprise Portal',
    timestamp: '2 minutes ago',
    data: { repository: 'https://github.com/enterprise/portal.git' }
  },
  {
    id: '2',
    fromAgent: 'Code Audit Agent',
    toAgent: 'Orchestrator',
    type: 'response',
    message: 'Found 147 controllers, analyzing dependencies...',
    timestamp: '1 minute ago',
    data: { controllersFound: 147, viewsFound: 89 }
  },
  {
    id: '3',
    fromAgent: 'Content Audit Agent',
    toAgent: 'Security Agent',
    type: 'request',
    message: 'Request PII validation for content items',
    timestamp: '1 minute ago'
  },
  {
    id: '4',
    fromAgent: 'Security Agent',
    toAgent: 'Content Audit Agent',
    type: 'response',
    message: 'PII scan completed. 23 items flagged for review',
    timestamp: '30 seconds ago',
    data: { flaggedItems: 23, severity: 'medium' }
  },
  {
    id: '5',
    fromAgent: 'Orchestrator',
    toAgent: 'All Agents',
    type: 'notification',
    message: 'Discovery phase 65% complete. Proceeding to experience mapping',
    timestamp: '15 seconds ago'
  }
];

export function AgentOrchestration() {
  const [workflows, setWorkflows] = useState<AgentWorkflow[]>(AGENT_WORKFLOWS);
  const [messages, setMessages] = useState<AgentMessage[]>(RECENT_MESSAGES);
  const [selectedWorkflow, setSelectedWorkflow] = useState<AgentWorkflow | null>(workflows[0]);

  useEffect(() => {
    // Simulate real-time message updates
    const interval = setInterval(() => {
      const newMessage: AgentMessage = {
        id: Date.now().toString(),
        fromAgent: 'Code Audit Agent',
        toAgent: 'Orchestrator',
        type: 'notification',
        message: 'Processing rendering variant #' + Math.floor(Math.random() * 100),
        timestamp: 'Just now'
      };
      setMessages(prev => [newMessage, ...prev.slice(0, 9)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="size-4 text-success" />;
      case 'running': return <Activity className="size-4 text-primary animate-pulse" />;
      case 'error': return <AlertTriangle className="size-4 text-destructive" />;
      default: return <Clock className="size-4 text-muted-foreground" />;
    }
  };

  const getMessageTypeColor = (type: AgentMessage['type']) => {
    switch (type) {
      case 'request': return 'bg-primary/10 text-primary';
      case 'response': return 'bg-success/10 text-success';
      case 'notification': return 'bg-warning/10 text-warning';
      case 'error': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const pauseWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, status: w.status === 'running' ? 'paused' : 'running' } : w
    ));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      {/* Orchestration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: 'var(--spacing-4)' }}>
        <Card>
          <CardContent style={{ padding: 'var(--spacing-6)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Active Workflows</p>
                <p>{workflows.filter(w => w.status === 'running').length}</p>
              </div>
              <Brain className="size-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent style={{ padding: 'var(--spacing-6)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Completed Steps</p>
                <p>
                  {workflows.reduce((acc, w) => acc + w.steps.filter(s => s.status === 'completed').length, 0)}
                </p>
              </div>
              <CheckCircle2 className="size-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent style={{ padding: 'var(--spacing-6)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Messages/Hour</p>
                <p>247</p>
              </div>
              <MessageSquare className="size-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent style={{ padding: 'var(--spacing-6)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Efficiency</p>
                <p>94%</p>
              </div>
              <Zap className="size-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="messages">Agent Messages</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--spacing-6)' }}>
            {/* Workflow List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              {workflows.map((workflow) => (
                <Card 
                  key={workflow.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedWorkflow?.id === workflow.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedWorkflow(workflow)}
                >
                  <CardHeader style={{ paddingBottom: 'var(--spacing-3)' }}>
                    <div className="flex items-center justify-between">
                      <CardTitle>{workflow.name}</CardTitle>
                      <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                        <Badge className={
                          workflow.status === 'running' ? 'bg-primary/10 text-primary' :
                          workflow.status === 'completed' ? 'bg-success/10 text-success' :
                          workflow.status === 'paused' ? 'bg-warning/10 text-warning' :
                          'bg-muted text-muted-foreground'
                        }>
                          {workflow.status}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            pauseWorkflow(workflow.id);
                          }}
                        >
                          {workflow.status === 'running' ? <Pause className="size-4" /> : <Play className="size-4" />}
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{workflow.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                      <div className="flex justify-between">
                        <span>Progress</span>
                        <span>{workflow.progress}%</span>
                      </div>
                      <Progress value={workflow.progress} className="h-2" />
                      
                      <div className="flex justify-between text-muted-foreground">
                        <span>{workflow.steps.filter(s => s.status === 'completed').length}/{workflow.steps.length} steps</span>
                        <span>{workflow.dependencies.length} dependencies</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Workflow Details */}
            <div>
              {selectedWorkflow ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedWorkflow.name} Steps</CardTitle>
                    <CardDescription>Detailed step-by-step execution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                      {selectedWorkflow.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center border rounded-lg" style={{ gap: 'var(--spacing-3)', padding: 'var(--spacing-3)' }}>
                          <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                            <div className="rounded-full bg-muted flex items-center justify-center" style={{ width: 'var(--spacing-6)', height: 'var(--spacing-6)' }}>
                              {index + 1}
                            </div>
                            {getStepIcon(step.status)}
                          </div>
                          
                          <div className="flex-1">
                            <div>{step.name}</div>
                            <div className="text-muted-foreground">{step.agent}</div>
                            {step.duration && (
                              <div className="text-muted-foreground">Duration: {step.duration}</div>
                            )}
                            {step.outputs && step.outputs.length > 0 && (
                              <div style={{ marginTop: 'var(--spacing-2)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                                {step.outputs.map((output, i) => (
                                  <div key={i} className="text-success flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                                    <CheckCircle2 className="size-3" />
                                    {output}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {index < selectedWorkflow.steps.length - 1 && (
                            <ArrowRight className="size-4 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center" style={{ padding: 'var(--spacing-12)' }}>
                    <Brain className="size-16 mx-auto text-muted-foreground opacity-50" style={{ marginBottom: 'var(--spacing-4)' }} />
                    <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Select a Workflow</h3>
                    <p className="text-muted-foreground">Choose a workflow to view detailed step execution</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="messages" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <Card>
            <CardHeader>
              <CardTitle>Real-time Agent Communication</CardTitle>
              <CardDescription>Live message stream between AI agents</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  {messages.map((message) => (
                    <div key={message.id} className="flex items-start border rounded-lg" style={{ gap: 'var(--spacing-3)', padding: 'var(--spacing-3)' }}>
                      <Badge className={getMessageTypeColor(message.type)}>
                        {message.type}
                      </Badge>
                      <div className="flex-1">
                        <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                          <span>{message.fromAgent}</span>
                          <ArrowRight className="size-3" />
                          <span>{message.toAgent}</span>
                          <span className="text-muted-foreground ml-auto">{message.timestamp}</span>
                        </div>
                        <div style={{ marginTop: 'var(--spacing-1)' }}>{message.message}</div>
                        {message.data && (
                          <div className="bg-muted rounded font-mono" style={{ marginTop: 'var(--spacing-2)', padding: 'var(--spacing-2)' }}>
                            {JSON.stringify(message.data, null, 2)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dependencies" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <Card>
            <CardHeader>
              <CardTitle>Workflow Dependencies</CardTitle>
              <CardDescription>Dependency graph and execution order</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center border rounded-lg" style={{ gap: 'var(--spacing-4)', padding: 'var(--spacing-4)' }}>
                    <div className="flex-1">
                      <div>{workflow.name}</div>
                      <div className="text-muted-foreground">
                        {workflow.dependencies.length === 0 
                          ? 'No dependencies - can run immediately'
                          : `Depends on: ${workflow.dependencies.join(', ')}`
                        }
                      </div>
                    </div>
                    <Badge className={
                      workflow.status === 'completed' ? 'bg-success/10 text-success' :
                      workflow.status === 'running' ? 'bg-primary/10 text-primary' :
                      'bg-muted text-muted-foreground'
                    }>
                      {workflow.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

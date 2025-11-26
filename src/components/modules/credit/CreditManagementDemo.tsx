import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Brain, 
  Code, 
  BarChart3, 
  Wrench, 
  TestTube, 
  Play,
  Settings,
  AlertTriangle,
  FlaskConical
} from 'lucide-react';
import { useCreditManager } from '@/hooks/useCreditManager';
import { CreditGate } from './CreditGate';
import { CreditGatedChatInput } from './CreditGatedChatInput';
import { CreditTestingPanel } from './CreditTestingPanel';
import { toast } from 'sonner@2.0.3';

const AI_OPERATIONS = [
  {
    id: 'simple-chat',
    name: 'Simple Chat',
    icon: Brain,
    credits: 1,
    description: 'Basic AI conversation and simple questions',
    category: 'discovery'
  },
  {
    id: 'code-analysis',
    name: 'Code Analysis',
    icon: Code,
    credits: 5,
    description: 'Analyze code quality, patterns, and potential issues',
    category: 'analysis'
  },
  {
    id: 'component-migration',
    name: 'Component Migration',
    icon: Wrench,
    credits: 10,
    description: 'Migrate components from legacy to modern frameworks',
    category: 'migration'
  },
  {
    id: 'comprehensive-audit',
    name: 'Comprehensive Audit',
    icon: BarChart3,
    credits: 15,
    description: 'Full system audit with detailed recommendations',
    category: 'analysis'
  },
  {
    id: 'generate-tests',
    name: 'Generate Tests',
    icon: TestTube,
    credits: 8,
    description: 'Create automated tests for components and functions',
    category: 'testing'
  },
  {
    id: 'architecture-review',
    name: 'Architecture Review',
    icon: Settings,
    credits: 12,
    description: 'Review and optimize system architecture',
    category: 'analysis'
  }
];

export function CreditManagementDemo() {
  const { creditData, consumeCredits, canPerformOperation } = useCreditManager();
  const [chatInput, setChatInput] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleOperationTest = async (operation: typeof AI_OPERATIONS[0]) => {
    if (!canPerformOperation(operation.credits)) {
      toast.error('Insufficient Credits', {
        description: `This operation requires ${operation.credits} credits, but you only have ${creditData.currentCredits} remaining.`
      });
      return;
    }

    setIsProcessing(operation.id);
    
    try {
      const success = await consumeCredits(operation.credits, operation.name);
      if (success) {
        toast.success('Operation Completed!', {
          description: `${operation.name} executed successfully. ${operation.credits} credits consumed.`
        });
      }
    } finally {
      setIsProcessing(null);
    }
  };

  const handleChatSend = (message: string) => {
    toast.success('Message Sent!', {
      description: `AI processing: "${message.slice(0, 50)}${message.length > 50 ? '...' : ''}"`
    });
    setChatInput('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'discovery': return Brain;
      case 'analysis': return BarChart3;
      case 'migration': return Wrench;
      case 'testing': return TestTube;
      default: return Settings;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'discovery': return 'bg-info/10 text-info border-info/20';
      case 'analysis': return 'bg-accent-purple/10 text-accent-purple border-accent-purple/20';
      case 'migration': return 'bg-success/10 text-success border-success/20';
      case 'testing': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-[var(--spacing-6)] space-y-[var(--spacing-8)]">
      <div className="text-center">
        <h1>AI Credit Management System</h1>
        <p className="text-muted-foreground">
          Demonstration and testing of credit-gated AI operations with intelligent cost estimation
        </p>
      </div>

      <Tabs defaultValue="demo" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="demo" className="flex items-center gap-[var(--spacing-2)]">
            <Zap className="size-4" />
            Live Demo
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-[var(--spacing-2)]">
            <FlaskConical className="size-4" />
            Credit Testing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demo" className="space-y-[var(--spacing-8)]">

      {/* Current Credit Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-[var(--spacing-2)]">
            <Zap className="size-5 text-[var(--color-primary)]" />
            Current Credit Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[var(--spacing-4)]">
            <div className="bg-primary/10 rounded-[var(--radius-lg)] p-[var(--spacing-4)]">
              <div className="text-muted-foreground">Available Credits</div>
              <div className="text-[var(--color-primary)]">
                {creditData.currentCredits.toLocaleString()}
              </div>
            </div>
            <div className="bg-muted/50 rounded-[var(--radius-lg)] p-[var(--spacing-4)]">
              <div className="text-muted-foreground">Total Credits</div>
              <div>
                {creditData.totalCredits.toLocaleString()}
              </div>
            </div>
            <div className="bg-warning/10 rounded-[var(--radius-lg)] p-[var(--spacing-4)]">
              <div className="text-muted-foreground">Used This Month</div>
              <div className="text-warning">
                {creditData.usedThisMonth.toLocaleString()}
              </div>
            </div>
            <div className="bg-success/10 rounded-[var(--radius-lg)] p-[var(--spacing-4)]">
              <div className="text-muted-foreground">Daily Average</div>
              <div className="text-success">
                {creditData.dailyAverage}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit-Gated Chat Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Credit-Gated AI Chat</CardTitle>
          <p className="text-muted-foreground">
            Try typing different types of requests to see dynamic credit cost estimation
          </p>
        </CardHeader>
        <CardContent>
          <CreditGatedChatInput
            value={chatInput}
            onChange={setChatInput}
            onSend={handleChatSend}
            placeholder="Try typing 'audit my code' or 'migrate this component' to see cost estimation..."
          />
        </CardContent>
      </Card>

      {/* AI Operations Grid */}
      <div>
        <h2 className="mb-[var(--spacing-4)]">Available AI Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-4)]">
          {AI_OPERATIONS.map((operation) => {
            const IconComponent = operation.icon;
            const hasEnoughCredits = canPerformOperation(operation.credits);
            
            return (
              <Card 
                key={operation.id}
                className={`relative ${!hasEnoughCredits ? 'opacity-60' : 'hover:shadow-md'} transition-all`}
              >
                <CardHeader className="pb-[var(--spacing-3)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[var(--spacing-2)]">
                      <div className={`p-[var(--spacing-2)] rounded-[var(--radius-lg)] ${getCategoryColor(operation.category)}`}>
                        <IconComponent className="size-4" />
                      </div>
                      <div>
                        <CardTitle>{operation.name}</CardTitle>
                        <Badge variant="outline" className="mt-[var(--spacing-1)]">
                          {operation.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge 
                      variant={hasEnoughCredits ? "default" : "destructive"}
                    >
                      <Zap className="size-3 mr-[var(--spacing-1)]" />
                      {operation.credits}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-[var(--spacing-4)]">
                    {operation.description}
                  </p>
                  
                  {hasEnoughCredits ? (
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleOperationTest(operation)}
                      disabled={isProcessing === operation.id}
                    >
                      {isProcessing === operation.id ? (
                        <div className="animate-spin size-4 border-2 border-current border-t-transparent rounded-full mr-[var(--spacing-2)]" />
                      ) : (
                        <Play className="size-4 mr-[var(--spacing-2)]" />
                      )}
                      {isProcessing === operation.id ? 'Processing...' : 'Run Operation'}
                    </Button>
                  ) : (
                    <CreditGate
                      creditsRequired={operation.credits}
                      operation={operation.name}
                      className="p-0 border-0 bg-transparent"
                    />
                  )}
                </CardContent>

                {!hasEnoughCredits && (
                  <div className="absolute inset-0 bg-background/80 rounded-[var(--radius-lg)] flex items-center justify-center">
                    <div className="text-center">
                      <AlertTriangle className="size-8 text-destructive mx-auto mb-[var(--spacing-2)]" />
                      <p className="text-destructive">Insufficient Credits</p>
                      <p className="text-muted-foreground">
                        Need {operation.credits - creditData.currentCredits} more credits
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Management Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-[var(--spacing-4)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-4)]">
            <div className="bg-info/10 dark:bg-info/20 rounded-[var(--radius-lg)] p-[var(--spacing-4)]">
              <h4 className="mb-[var(--spacing-2)] flex items-center gap-[var(--spacing-2)]">
                <Brain className="size-4 text-info" />
                Smart Cost Estimation
              </h4>
              <p className="text-muted-foreground">
                The system automatically estimates credit costs based on your message content and operation complexity.
              </p>
            </div>
            
            <div className="bg-success/10 dark:bg-success/20 rounded-[var(--radius-lg)] p-[var(--spacing-4)]">
              <h4 className="mb-[var(--spacing-2)] flex items-center gap-[var(--spacing-2)]">
                <Zap className="size-4 text-success" />
                Real-time Prevention
              </h4>
              <p className="text-muted-foreground">
                Operations are blocked before execution if you don't have sufficient credits, preventing unexpected charges.
              </p>
            </div>
            
            <div className="bg-warning/10 dark:bg-warning/20 rounded-[var(--radius-lg)] p-[var(--spacing-4)]">
              <h4 className="mb-[var(--spacing-2)] flex items-center gap-[var(--spacing-2)]">
                <AlertTriangle className="size-4 text-warning" />
                Low Credit Warnings
              </h4>
              <p className="text-muted-foreground">
                Get notified when credits are running low, with easy access to purchase more credits.
              </p>
            </div>
            
            <div className="bg-accent-purple/10 dark:bg-accent-purple/20 rounded-[var(--radius-lg)] p-[var(--spacing-4)]">
              <h4 className="mb-[var(--spacing-2)] flex items-center gap-[var(--spacing-2)]">
                <BarChart3 className="size-4 text-accent-purple" />
                Usage Analytics
              </h4>
              <p className="text-muted-foreground">
                Track your credit usage patterns and optimize your AI operations for better efficiency.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

        </TabsContent>

        <TabsContent value="testing" className="space-y-[var(--spacing-8)]">
          <CreditTestingPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
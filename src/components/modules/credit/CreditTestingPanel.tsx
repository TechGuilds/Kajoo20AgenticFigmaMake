import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Settings,
  Zap, 
  TestTube,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause
} from 'lucide-react';
import { useCreditManager } from '@/hooks/useCreditManager';
import { toast } from 'sonner@2.0.3';

export function CreditTestingPanel() {
  const { creditData, consumeCredits, canPerformOperation } = useCreditManager();
  const [testCredits, setTestCredits] = useState<number>(creditData.currentCredits);
  const [testOperation, setTestOperation] = useState<string>('');
  const [testCost, setTestCost] = useState<number>(5);
  const [isRunningTest, setIsRunningTest] = useState(false);

  // Test scenarios
  const testScenarios = [
    {
      id: 'low-credits',
      name: 'Test Low Credits (10 remaining)',
      description: 'Simulate having only 10 credits to test warning behavior',
      targetCredits: 10,
      color: 'bg-warning/10 text-warning border-warning/20'
    },
    {
      id: 'no-credits',
      name: 'Test No Credits (0 remaining)',
      description: 'Simulate having no credits to test blocking behavior',
      targetCredits: 0,
      color: 'bg-destructive/10 text-destructive border-destructive/20'
    },
    {
      id: 'moderate-credits',
      name: 'Test Moderate Credits (50 remaining)',
      description: 'Simulate moderate credit level for normal operations',
      targetCredits: 50,
      color: 'bg-primary/10 text-primary border-primary/20'
    },
    {
      id: 'high-credits',
      name: 'Test High Credits (500 remaining)',
      description: 'Simulate high credit level for unrestricted usage',
      targetCredits: 500,
      color: 'bg-success/10 text-success border-success/20'
    }
  ];

  const quickTests = [
    { name: 'Simple Chat', cost: 1 },
    { name: 'Code Analysis', cost: 5 },
    { name: 'Component Migration', cost: 10 },
    { name: 'Architecture Review', cost: 15 },
    { name: 'Full System Audit', cost: 25 }
  ];

  const handleSetTestCredits = (credits: number) => {
    // Note: This would need to be implemented in the credit manager
    // For now, we'll just update local state and show what would happen
    setTestCredits(credits);
    toast.info('Test Credits Set', {
      description: `Simulating ${credits} credits for testing purposes`
    });
  };

  const handleTestOperation = async (operationName: string, cost: number) => {
    setIsRunningTest(true);
    setTestOperation(operationName);
    
    // Check if operation can be performed
    const canPerform = testCredits >= cost;
    
    if (!canPerform) {
      toast.error('Operation Blocked', {
        description: `Cannot perform "${operationName}" - requires ${cost} credits but only ${testCredits} available`
      });
      setIsRunningTest(false);
      return;
    }

    // Simulate operation delay
    setTimeout(() => {
      const newCredits = testCredits - cost;
      setTestCredits(newCredits);
      
      toast.success('Test Operation Completed', {
        description: `"${operationName}" consumed ${cost} credits. ${newCredits} remaining.`
      });
      
      setIsRunningTest(false);
      setTestOperation('');
    }, 1500);
  };

  const handleCustomTest = () => {
    if (!testOperation.trim()) {
      toast.error('Please enter an operation name');
      return;
    }
    
    if (testCost <= 0) {
      toast.error('Credit cost must be greater than 0');
      return;
    }
    
    handleTestOperation(testOperation, testCost);
  };

  const resetToActualCredits = () => {
    setTestCredits(creditData.currentCredits);
    toast.info('Reset to Actual Credits', {
      description: `Test credits reset to actual balance: ${creditData.currentCredits}`
    });
  };

  return (
    <div className="space-y-[var(--spacing-6)]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-[var(--spacing-2)]">
            <TestTube className="size-5 text-[var(--color-primary)]" />
            Credit Limit Testing Panel
          </CardTitle>
          <p className="text-muted-foreground">
            Test different credit scenarios to verify the credit management system behavior
          </p>
        </CardHeader>
        <CardContent className="space-y-[var(--spacing-6)]">
          
          {/* Current Test State */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-4)]">
            <div className="bg-primary/10 rounded-[var(--radius-lg)] p-[var(--spacing-4)]">
              <div className="text-muted-foreground">Test Credits</div>
              <div className="flex items-center gap-[var(--spacing-2)] text-[var(--color-primary)]">
                <Zap className="size-5" />
                {testCredits}
              </div>
            </div>
            <div className="bg-muted/50 rounded-[var(--radius-lg)] p-[var(--spacing-4)]">
              <div className="text-muted-foreground">Actual Credits</div>
              <div>
                {creditData.currentCredits}
              </div>
            </div>
            <div className="bg-accent/50 rounded-[var(--radius-lg)] p-[var(--spacing-4)]">
              <div className="text-muted-foreground">Status</div>
              <div className="flex items-center gap-[var(--spacing-2)]">
                {testCredits > 20 ? (
                  <>
                    <CheckCircle className="size-4 text-success" />
                    <span className="text-success">Good</span>
                  </>
                ) : testCredits > 5 ? (
                  <>
                    <AlertTriangle className="size-4 text-warning" />
                    <span className="text-warning">Low</span>
                  </>
                ) : (
                  <>
                    <XCircle className="size-4 text-destructive" />
                    <span className="text-destructive">Critical</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Test Scenarios */}
          <div>
            <h4 className="mb-[var(--spacing-4)]">Quick Test Scenarios</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-3)]">
              {testScenarios.map((scenario) => (
                <Button
                  key={scenario.id}
                  variant="outline"
                  className={`h-auto p-[var(--spacing-4)] text-left justify-start ${scenario.color}`}
                  onClick={() => handleSetTestCredits(scenario.targetCredits)}
                  disabled={isRunningTest}
                >
                  <div>
                    <div>{scenario.name}</div>
                    <div className="opacity-70 mt-[var(--spacing-1)]">{scenario.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Quick Operation Tests */}
          <div>
            <h4 className="mb-[var(--spacing-4)]">Test Operations</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-[var(--spacing-2)]">
              {quickTests.map((test) => {
                const canAfford = testCredits >= test.cost;
                return (
                  <Button
                    key={test.name}
                    variant={canAfford ? "default" : "destructive"}
                    size="sm"
                    className="flex flex-col h-auto p-[var(--spacing-3)]"
                    onClick={() => handleTestOperation(test.name, test.cost)}
                    disabled={isRunningTest}
                  >
                    <div>{test.name}</div>
                    <div className="opacity-70 flex items-center gap-[var(--spacing-1)]">
                      <Zap className="size-3" />
                      {test.cost}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Custom Test */}
          <div>
            <h4 className="mb-[var(--spacing-4)]">Custom Operation Test</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-4)]">
              <div className="space-y-[var(--spacing-2)]">
                <Label htmlFor="operation-name">Operation Name</Label>
                <Input
                  id="operation-name"
                  placeholder="e.g., Custom Analysis"
                  value={testOperation}
                  onChange={(e) => setTestOperation(e.target.value)}
                  disabled={isRunningTest}
                />
              </div>
              <div className="space-y-[var(--spacing-2)]">
                <Label htmlFor="credit-cost">Credit Cost</Label>
                <Input
                  id="credit-cost"
                  type="number"
                  min="1"
                  max="100"
                  value={testCost}
                  onChange={(e) => setTestCost(parseInt(e.target.value) || 1)}
                  disabled={isRunningTest}
                />
              </div>
              <div className="space-y-[var(--spacing-2)]">
                <Label>Action</Label>
                <Button
                  onClick={handleCustomTest}
                  disabled={isRunningTest || !testOperation.trim()}
                  className="w-full"
                >
                  {isRunningTest ? (
                    <>
                      <div className="animate-spin size-4 border-2 border-current border-t-transparent rounded-full mr-[var(--spacing-2)]" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className="size-4 mr-[var(--spacing-2)]" />
                      Test Operation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reset Controls */}
          <div className="flex gap-[var(--spacing-3)]">
            <Button
              variant="outline"
              onClick={resetToActualCredits}
              disabled={isRunningTest}
            >
              <RefreshCw className="size-4 mr-[var(--spacing-2)]" />
              Reset to Actual Credits
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleSetTestCredits(100)}
              disabled={isRunningTest}
            >
              <Settings className="size-4 mr-[var(--spacing-2)]" />
              Set Test Credits (100)
            </Button>
          </div>

          {/* Current Test Status */}
          {isRunningTest && (
            <div className="bg-primary/10 rounded-[var(--radius-lg)] p-[var(--spacing-4)] border border-primary/20">
              <div className="flex items-center gap-[var(--spacing-2)]">
                <div className="animate-spin size-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
                <span>Testing: {testOperation}</span>
              </div>
              <div className="text-muted-foreground mt-[var(--spacing-1)]">
                Simulating AI operation execution...
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

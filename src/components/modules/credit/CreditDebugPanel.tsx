import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Bug,
  Zap,
  Plus,
  Minus,
  RotateCcw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useCreditManager } from '@/hooks/useCreditManager';
import { toast } from 'sonner@2.0.3';

interface CreditDebugPanelProps {
  className?: string;
}

export function CreditDebugPanel({ className }: CreditDebugPanelProps) {
  const { creditData, canPerformOperation } = useCreditManager();
  const [debugCredits, setDebugCredits] = useState(creditData.currentCredits);

  // Quick credit presets for testing
  const creditPresets = [
    { label: 'Empty (0)', value: 0, color: 'destructive' },
    { label: 'Low (5)', value: 5, color: 'warning' },
    { label: 'Medium (25)', value: 25, color: 'default' },
    { label: 'High (100)', value: 100, color: 'success' },
    { label: 'Unlimited (1000)', value: 1000, color: 'primary' }
  ];

  const setCredits = (amount: number) => {
    setDebugCredits(amount);
    toast.info(`Debug Credits Set: ${amount}`, {
      description: 'This is for testing only - actual credits unchanged'
    });
  };

  const adjustCredits = (change: number) => {
    const newAmount = Math.max(0, debugCredits + change);
    setCredits(newAmount);
  };

  const resetToActual = () => {
    setDebugCredits(creditData.currentCredits);
    toast.info('Reset to actual credit balance');
  };

  // Test different operations
  const testOperations = [1, 5, 10, 15, 25];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-[var(--spacing-2)]">
          <Bug className="size-4" />
          Credit Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-[var(--spacing-4)]">
        
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <div className="space-y-[var(--spacing-1)]">
            <div className="text-muted-foreground">Debug Credits</div>
            <div className="flex items-center gap-[var(--spacing-2)]">
              <Zap className="size-4 text-[var(--color-primary)]" />
              <span>{debugCredits}</span>
            </div>
          </div>
          <div className="space-y-[var(--spacing-1)]">
            <div className="text-muted-foreground">Actual Credits</div>
            <div className="flex items-center gap-[var(--spacing-2)]">
              <span>{creditData.currentCredits}</span>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <Label className="mb-[var(--spacing-2)] block">Quick Presets</Label>
          <div className="grid grid-cols-3 gap-[var(--spacing-1)]">
            {creditPresets.map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => setCredits(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Manual Input */}
        <div className="flex items-center gap-[var(--spacing-2)]">
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustCredits(-5)}
            disabled={debugCredits <= 0}
          >
            <Minus className="size-3" />
          </Button>
          <Input
            type="number"
            value={debugCredits}
            onChange={(e) => setDebugCredits(Math.max(0, parseInt(e.target.value) || 0))}
            className="h-8 text-center"
            min="0"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustCredits(5)}
          >
            <Plus className="size-3" />
          </Button>
        </div>

        {/* Operation Tests */}
        <div>
          <Label className="mb-[var(--spacing-2)] block">Test Operations</Label>
          <div className="grid grid-cols-5 gap-[var(--spacing-1)]">
            {testOperations.map((cost) => {
              const canAfford = debugCredits >= cost;
              return (
                <Button
                  key={cost}
                  variant={canAfford ? "default" : "destructive"}
                  size="sm"
                  className="h-8 flex flex-col p-[var(--spacing-1)]"
                  onClick={() => {
                    if (canAfford) {
                      setCredits(debugCredits - cost);
                      toast.success(`Used ${cost} credits`);
                    } else {
                      toast.error(`Need ${cost} credits, only have ${debugCredits}`);
                    }
                  }}
                >
                  <span>{cost}</span>
                  {canAfford ? (
                    <CheckCircle className="size-2" />
                  ) : (
                    <AlertTriangle className="size-2" />
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        <Button
          variant="outline"
          size="sm"
          onClick={resetToActual}
          className="w-full"
        >
          <RotateCcw className="size-3 mr-[var(--spacing-1)]" />
          Reset to Actual
        </Button>

        {/* Status Indicator */}
        <div className="text-center">
          <Badge 
            variant={debugCredits > 20 ? "default" : debugCredits > 5 ? "secondary" : "destructive"}
          >
            {debugCredits > 20 ? "Good Balance" : debugCredits > 5 ? "Low Credits" : "Critical"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

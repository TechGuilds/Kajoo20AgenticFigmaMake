import React from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { AlertTriangle, Zap, X } from 'lucide-react';
import { useCreditManager } from '../../../hooks/useCreditManager';

interface LowCreditWarningProps {
  onBuyCredits: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function LowCreditWarning({ onBuyCredits, onDismiss, className }: LowCreditWarningProps) {
  const { creditData, isLowCredit, isCriticalCredit } = useCreditManager();

  // Don't show if credits are sufficient
  if (!isLowCredit) return null;

  const projectedDaysLeft = creditData.dailyAverage > 0 
    ? Math.floor(creditData.currentCredits / creditData.dailyAverage)
    : 29;

  return (
    <Alert className={`border-warning bg-warning/10 ${className}`}>
      <AlertTriangle className="size-4 text-warning" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">
                {isCriticalCredit ? 'Critical: AI Credits Almost Depleted!' : 'Low AI Credits'}
              </span>
              <Badge variant={isCriticalCredit ? 'destructive' : 'secondary'} className="text-xs">
                {creditData.currentCredits} remaining
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {isCriticalCredit 
                ? `Only ${creditData.currentCredits} credits left. AI features will stop working when depleted.`
                : `You have ${creditData.currentCredits} credits remaining (~${projectedDaysLeft} days at current usage).`
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={onBuyCredits}
          >
            <Zap className="size-4 mr-1" />
            Buy Credits
          </Button>
          
          {onDismiss && !isCriticalCredit && (
            <Button 
              variant="ghost" 
              size="sm"
              className="p-1 h-auto"
              onClick={onDismiss}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

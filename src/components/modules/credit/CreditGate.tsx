import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { AlertCircle, Zap, Lock } from 'lucide-react';
import { useCreditManager } from '../../../hooks/useCreditManager';
import { PurchaseCreditsDialog } from './PurchaseCreditsDialog';

interface CreditGateProps {
  creditsRequired: number;
  operation: string;
  onProceed?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function CreditGate({ 
  creditsRequired, 
  operation, 
  onProceed, 
  children, 
  className 
}: CreditGateProps) {
  const { creditData, canPerformOperation, consumeCredits } = useCreditManager();
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const hasEnoughCredits = canPerformOperation(creditsRequired);

  const handleProceed = async () => {
    if (!hasEnoughCredits) {
      setShowPurchaseDialog(true);
      return;
    }

    if (onProceed) {
      setIsProcessing(true);
      try {
        const success = await consumeCredits(creditsRequired, operation);
        if (success) {
          onProceed();
        }
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // If no credits required or user has enough credits, render children
  if (creditsRequired === 0 || hasEnoughCredits) {
    return <>{children}</>;
  }

  // Show credit gate when insufficient credits
  return (
    <>
      <Card className={`border-warning bg-warning/5 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-warning">
            <Lock className="size-5" />
            Insufficient AI Credits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="size-4" />
            <AlertDescription>
              This operation requires <strong>{creditsRequired} credits</strong> but you only have{' '}
              <strong>{creditData.currentCredits} credits</strong> remaining.
            </AlertDescription>
          </Alert>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Operation: {operation}</span>
              <span className="text-sm text-muted-foreground">{creditsRequired} credits</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Your balance:</span>
              <span className="text-sm font-medium">{creditData.currentCredits} credits</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
              <span className="text-sm font-medium text-destructive">Shortfall:</span>
              <span className="text-sm font-medium text-destructive">
                -{(creditsRequired - creditData.currentCredits)} credits
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setShowPurchaseDialog(true)}
            >
              <Zap className="size-4 mr-2" />
              Buy Credits
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              disabled
            >
              <Lock className="size-4 mr-2" />
              Proceed ({creditsRequired} credits)
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Purchase credits to unlock all AI-powered features and continue your work.
          </div>
        </CardContent>
      </Card>

      <PurchaseCreditsDialog 
        open={showPurchaseDialog} 
        onOpenChange={setShowPurchaseDialog} 
      />
    </>
  );
}

// Higher-order component wrapper for easy use
export function withCreditGate<T extends object>(
  Component: React.ComponentType<T>,
  creditsRequired: number,
  operation: string
) {
  return function CreditGatedComponent(props: T) {
    const { canPerformOperation } = useCreditManager();
    
    if (!canPerformOperation(creditsRequired)) {
      return (
        <CreditGate creditsRequired={creditsRequired} operation={operation}>
          <Component {...props} />
        </CreditGate>
      );
    }
    
    return <Component {...props} />;
  };
}

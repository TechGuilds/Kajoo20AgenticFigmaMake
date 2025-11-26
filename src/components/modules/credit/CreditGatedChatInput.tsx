import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import { Send, Zap, Lock, AlertCircle } from 'lucide-react';
import { useCreditManager } from '../../../hooks/useCreditManager';
import { useCreditContext } from './CreditProvider';

interface CreditGatedChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const AI_OPERATION_COSTS = {
  'simple_chat': 1,
  'code_analysis': 5,
  'component_migration': 10,
  'comprehensive_audit': 15,
  'generate_report': 8,
  'create_tasks': 12
};

function estimateOperationCost(message: string): { cost: number; operation: string } {
  const msg = message.toLowerCase();
  
  if (msg.includes('audit') || msg.includes('comprehensive') || msg.includes('analysis report')) {
    return { cost: AI_OPERATION_COSTS.comprehensive_audit, operation: 'Comprehensive Audit' };
  }
  if (msg.includes('migrate') || msg.includes('component') || msg.includes('convert')) {
    return { cost: AI_OPERATION_COSTS.component_migration, operation: 'Component Migration' };
  }
  if (msg.includes('generate tasks') || msg.includes('create tickets') || msg.includes('jira')) {
    return { cost: AI_OPERATION_COSTS.create_tasks, operation: 'Generate Tasks' };
  }
  if (msg.includes('analyze') || msg.includes('code') || msg.includes('scan')) {
    return { cost: AI_OPERATION_COSTS.code_analysis, operation: 'Code Analysis' };
  }
  if (msg.includes('report') || msg.includes('summary') || msg.includes('progress')) {
    return { cost: AI_OPERATION_COSTS.generate_report, operation: 'Generate Report' };
  }
  
  return { cost: AI_OPERATION_COSTS.simple_chat, operation: 'Chat Message' };
}

export function CreditGatedChatInput({
  value,
  onChange,
  onSend,
  placeholder = "Type your message...",
  disabled = false,
  className = ""
}: CreditGatedChatInputProps) {
  const { creditData, canPerformOperation, isLowCredit, isCriticalCredit } = useCreditManager();
  const { showPurchaseDialog, consumeCreditsForOperation } = useCreditContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const { cost, operation } = estimateOperationCost(value);
  const hasEnoughCredits = canPerformOperation(cost);
  const showCostIndicator = value.trim().length > 10; // Show cost indicator for longer messages

  const handleSend = async () => {
    if (!value.trim() || disabled || isProcessing) return;

    if (!hasEnoughCredits) {
      showPurchaseDialog();
      return;
    }

    setIsProcessing(true);
    try {
      const success = await consumeCreditsForOperation(cost, operation);
      if (success) {
        onSend(value);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Credit Warning */}
      {isLowCredit && (
        <Alert className={`${isCriticalCredit ? 'border-destructive bg-destructive/10' : 'border-warning bg-warning/10'}`}>
          <AlertCircle className={`size-4 ${isCriticalCredit ? 'text-destructive' : 'text-warning'}`} />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-sm">
              {isCriticalCredit 
                ? `Critical: Only ${creditData.currentCredits} credits remaining!` 
                : `Low credits: ${creditData.currentCredits} remaining`
              }
            </span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={showPurchaseDialog}
              className="ml-2"
            >
              <Zap className="size-4 mr-1" />
              Buy Credits
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Cost Indicator */}
      {showCostIndicator && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Estimated operation:</span>
            <Badge variant="outline" className="text-xs">
              {operation}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Cost:</span>
            <Badge 
              variant={hasEnoughCredits ? "default" : "destructive"} 
              className="text-xs"
            >
              <Zap className="size-3 mr-1" />
              {cost} credits
            </Badge>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={hasEnoughCredits ? placeholder : "Insufficient credits for AI operations..."}
          disabled={disabled || isProcessing || !hasEnoughCredits}
          className={`min-h-[80px] pr-12 resize-none ${
            !hasEnoughCredits ? 'bg-muted/50 border-destructive/30' : ''
          }`}
        />
        
        {/* Send Button */}
        <div className="absolute bottom-2 right-2">
          {hasEnoughCredits ? (
            <Button
              size="sm"
              onClick={handleSend}
              disabled={!value.trim() || disabled || isProcessing}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isProcessing ? (
                <div className="animate-spin size-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={showPurchaseDialog}
              variant="destructive"
            >
              <Lock className="size-4 mr-1" />
              Buy Credits
            </Button>
          )}
        </div>
      </div>

      {/* Insufficient Credits Warning */}
      {!hasEnoughCredits && value.trim() && (
        <Alert className="border-destructive bg-destructive/10">
          <Lock className="size-4 text-destructive" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-destructive">Insufficient Credits</p>
                <p className="text-sm text-muted-foreground">
                  This operation requires {cost} credits, but you only have {creditData.currentCredits} remaining.
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={showPurchaseDialog}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Zap className="size-4 mr-1" />
                Buy Credits
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Credit Balance Indicator */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          AI Credits: {creditData.currentCredits.toLocaleString()} / {creditData.totalCredits.toLocaleString()}
        </span>
        <span>
          Daily average: {creditData.dailyAverage} credits
        </span>
      </div>
    </div>
  );
}

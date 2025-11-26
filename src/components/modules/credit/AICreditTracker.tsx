import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  Zap, 
  TrendingUp, 
  Calendar,
  Info,
  Plus
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui/popover';
import { Separator } from '../../ui/separator';
import { useCreditManager } from '../../../hooks/useCreditManager';
import { PurchaseCreditsDialog } from './PurchaseCreditsDialog';
import { CreditUsageDialog } from './CreditUsageDialog';

interface AICreditTrackerProps {
  className?: string;
}

export function AICreditTracker({ className }: AICreditTrackerProps) {
  const { creditData, isLowCredit, isCriticalCredit } = useCreditManager();
  const [isOpen, setIsOpen] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showUsageDialog, setShowUsageDialog] = useState(false);

  // Calculate usage percentage
  const usagePercentage = ((creditData.totalCredits - creditData.currentCredits) / creditData.totalCredits) * 100;
  
  // Determine status color based on remaining credits
  const getStatusColor = () => {
    const remainingPercentage = (creditData.currentCredits / creditData.totalCredits) * 100;
    if (remainingPercentage > 50) return 'bg-success';
    if (remainingPercentage > 20) return 'bg-warning';
    return 'bg-destructive';
  };

  const getStatusVariant = () => {
    const remainingPercentage = (creditData.currentCredits / creditData.totalCredits) * 100;
    if (remainingPercentage > 50) return 'default';
    if (remainingPercentage > 20) return 'secondary';
    return 'destructive';
  };

  // Projected days until exhaustion
  const projectedDaysLeft = creditData.dailyAverage > 0 
    ? Math.floor(creditData.currentCredits / creditData.dailyAverage)
    : 29;

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-9 px-3 gap-2 hover:bg-muted transition-all duration-200 ${className}`}
            title="AI Credits"
          >
            <Zap className="size-4" />
            <span className="hidden sm:inline">
              {creditData.currentCredits.toLocaleString()}
            </span>
            <Badge 
              variant={getStatusVariant()} 
              className="h-5 px-1.5 text-xs"
            >
              {Math.round((creditData.currentCredits / creditData.totalCredits) * 100)}%
            </Badge>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent side="bottom" align="end" className="w-80 p-0">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="size-5 text-primary" />
                <h3 className="font-medium">AI Credits</h3>
              </div>
              <Badge variant="outline" className="text-xs">
                {creditData.planType.charAt(0).toUpperCase() + creditData.planType.slice(1)} Plan
              </Badge>
            </div>

            {/* Current Usage Display */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Available Credits</span>
                <span className="font-medium">
                  {creditData.currentCredits.toLocaleString()} / {creditData.totalCredits.toLocaleString()}
                </span>
              </div>
              
              <Progress 
                value={usagePercentage} 
                className="h-2"
              />
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{Math.round(usagePercentage)}% used</span>
                <span>Resets {creditData.nextResetDate}</span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Usage Statistics */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-muted-foreground" />
                <span className="text-sm">Usage Statistics</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">This Month</div>
                  <div className="font-medium">{creditData.usedThisMonth.toLocaleString()}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Daily Average</div>
                  <div className="font-medium">{creditData.dailyAverage}</div>
                </div>
              </div>
            </div>

            {/* Projected Usage */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-sm">Projected Usage</span>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estimated days remaining</span>
                  <span className="font-medium">
                    {projectedDaysLeft} days
                  </span>
                </div>
                {projectedDaysLeft < 7 && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-warning">
                    <Info className="size-3" />
                    <span>Consider upgrading your plan</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => {
                  setIsOpen(false);
                  setShowPurchaseDialog(true);
                }}
              >
                <Plus className="size-4" />
                Buy Credits
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  setIsOpen(false);
                  setShowUsageDialog(true);
                }}
              >
                View Usage
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <PurchaseCreditsDialog 
        open={showPurchaseDialog} 
        onOpenChange={setShowPurchaseDialog} 
      />
      
      <CreditUsageDialog 
        open={showUsageDialog} 
        onOpenChange={setShowUsageDialog} 
      />
    </>
  );
}

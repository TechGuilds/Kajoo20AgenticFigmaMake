import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCreditManager } from '../../../hooks/useCreditManager';
import { LowCreditWarning } from './LowCreditWarning';
import { PurchaseCreditsDialog } from './PurchaseCreditsDialog';

interface CreditContextType {
  showPurchaseDialog: () => void;
  consumeCreditsForOperation: (credits: number, operation: string, context?: { projectId?: string; taskId?: string }) => Promise<boolean>;
}

const CreditContext = createContext<CreditContextType | null>(null);

export function useCreditContext() {
  const context = useContext(CreditContext);
  if (!context) {
    throw new Error('useCreditContext must be used within a CreditProvider');
  }
  return context;
}

interface CreditProviderProps {
  children: React.ReactNode;
}

export function CreditProvider({ children }: CreditProviderProps) {
  const { isLowCredit, isCriticalCredit, consumeCredits } = useCreditManager();
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showLowCreditWarning, setShowLowCreditWarning] = useState(true);

  // Auto-show purchase dialog for critical credit levels
  useEffect(() => {
    if (isCriticalCredit) {
      setShowPurchaseDialog(true);
    }
  }, [isCriticalCredit]);

  const handleShowPurchaseDialog = () => {
    setShowPurchaseDialog(true);
  };

  const handleDismissWarning = () => {
    setShowLowCreditWarning(false);
    // Re-show warning after 30 minutes
    setTimeout(() => {
      setShowLowCreditWarning(true);
    }, 30 * 60 * 1000);
  };

  const consumeCreditsForOperation = async (
    credits: number, 
    operation: string, 
    context?: { projectId?: string; taskId?: string }
  ): Promise<boolean> => {
    return await consumeCredits(credits, operation, context);
  };

  const contextValue: CreditContextType = {
    showPurchaseDialog: handleShowPurchaseDialog,
    consumeCreditsForOperation
  };

  return (
    <CreditContext.Provider value={contextValue}>
      {/* Low Credit Warning - Show at top of app when credits are low */}
      {isLowCredit && showLowCreditWarning && (
        <LowCreditWarning 
          onBuyCredits={handleShowPurchaseDialog}
          onDismiss={!isCriticalCredit ? handleDismissWarning : undefined}
          className="mx-4 mt-4"
        />
      )}
      
      {children}
      
      {/* Purchase Dialog */}
      <PurchaseCreditsDialog 
        open={showPurchaseDialog} 
        onOpenChange={setShowPurchaseDialog} 
      />
    </CreditContext.Provider>
  );
}

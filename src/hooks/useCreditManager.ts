import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner@2.0.3';

export interface CreditData {
  currentCredits: number;
  totalCredits: number;
  usedThisMonth: number;
  dailyAverage: number;
  planType: 'free' | 'pro' | 'enterprise';
  nextResetDate: string;
  usageHistory: CreditUsage[];
}

export interface CreditUsage {
  id: string;
  timestamp: string;
  credits: number;
  operation: string;
  projectId?: string;
  taskId?: string;
}

export interface CreditPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
  isPopular?: boolean;
}

interface CreditManager {
  creditData: CreditData;
  loading: boolean;
  error: string | null;
  isLowCredit: boolean;
  isCriticalCredit: boolean;
  canPerformOperation: (creditsRequired: number) => boolean;
  consumeCredits: (credits: number, operation: string, context?: { projectId?: string; taskId?: string }) => Promise<boolean>;
  refreshCredits: () => Promise<void>;
  purchaseCredits: (planId: string) => Promise<boolean>;
  getAvailablePlans: () => CreditPlan[];
  clearError: () => void;
}

const CREDIT_PLANS: CreditPlan[] = [
  {
    id: 'starter-100',
    name: 'Starter Pack',
    credits: 100,
    price: 9.99,
    description: 'Perfect for small projects'
  },
  {
    id: 'professional-500',
    name: 'Professional',
    credits: 500,
    price: 39.99,
    description: 'Great for regular use',
    isPopular: true
  },
  {
    id: 'business-1000',
    name: 'Business',
    credits: 1000,
    price: 69.99,
    description: 'For heavy usage teams'
  },
  {
    id: 'enterprise-2500',
    name: 'Enterprise',
    credits: 2500,
    price: 149.99,
    description: 'Maximum credits for large projects'
  }
];

// Simulate API calls - in a real app, these would be actual API endpoints
const mockApiDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export function useCreditManager(): CreditManager {
  const [creditData, setCreditData] = useState<CreditData>({
    currentCredits: 1247,
    totalCredits: 2500,
    usedThisMonth: 1253,
    dailyAverage: 42,
    planType: 'pro',
    nextResetDate: 'Jan 31, 2025',
    usageHistory: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate status thresholds
  const creditPercentage = (creditData.currentCredits / creditData.totalCredits) * 100;
  const isLowCredit = creditPercentage <= 20; // 20% or less
  const isCriticalCredit = creditPercentage <= 5; // 5% or less

  // Load credit data on mount
  useEffect(() => {
    refreshCredits();
  }, []);

  // Show warnings for low credits
  useEffect(() => {
    if (isCriticalCredit && creditData.currentCredits > 0) {
      toast.error('Critical: AI Credits Almost Depleted!', {
        description: `Only ${creditData.currentCredits} credits remaining. Purchase more to continue using AI features.`,
        duration: 8000,
        action: {
          label: 'Buy Credits',
          onClick: () => {
            // This would trigger the purchase modal
            console.log('Open purchase modal');
          }
        }
      });
    } else if (isLowCredit && creditData.currentCredits > 0) {
      toast.warning('Low AI Credits', {
        description: `${creditData.currentCredits} credits remaining. Consider purchasing more.`,
        duration: 5000
      });
    }
  }, [isCriticalCredit, isLowCredit, creditData.currentCredits]);

  const refreshCredits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call to fetch credit data
      await mockApiDelay(300);
      
      // In a real implementation, this would fetch from your backend
      const updatedData = { ...creditData };
      
      // Calculate days remaining based on daily average
      const projectedDaysLeft = updatedData.dailyAverage > 0 
        ? Math.floor(updatedData.currentCredits / updatedData.dailyAverage)
        : 30;
      
      setCreditData(prev => ({
        ...prev,
        ...updatedData,
        // You could add a projectedDaysLeft field if needed
      }));
      
    } catch (err) {
      setError('Failed to refresh credit data');
      console.error('Credit refresh error:', err);
    } finally {
      setLoading(false);
    }
  }, [creditData]);

  const canPerformOperation = useCallback((creditsRequired: number): boolean => {
    return creditData.currentCredits >= creditsRequired;
  }, [creditData.currentCredits]);

  const consumeCredits = useCallback(async (
    credits: number, 
    operation: string, 
    context?: { projectId?: string; taskId?: string }
  ): Promise<boolean> => {
    try {
      if (!canPerformOperation(credits)) {
        toast.error('Insufficient Credits', {
          description: `This operation requires ${credits} credits, but you only have ${creditData.currentCredits} remaining.`,
          action: {
            label: 'Buy Credits',
            onClick: () => console.log('Open purchase modal')
          }
        });
        return false;
      }

      setLoading(true);
      
      // Simulate API call to consume credits
      await mockApiDelay(200);
      
      const usageRecord: CreditUsage = {
        id: `usage-${Date.now()}`,
        timestamp: new Date().toISOString(),
        credits,
        operation,
        projectId: context?.projectId,
        taskId: context?.taskId
      };

      setCreditData(prev => ({
        ...prev,
        currentCredits: prev.currentCredits - credits,
        usedThisMonth: prev.usedThisMonth + credits,
        usageHistory: [usageRecord, ...prev.usageHistory.slice(0, 49)] // Keep last 50 records
      }));

      return true;
    } catch (err) {
      setError('Failed to consume credits');
      console.error('Credit consumption error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [creditData.currentCredits, canPerformOperation]);

  const purchaseCredits = useCallback(async (planId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const plan = CREDIT_PLANS.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Invalid plan selected');
      }

      // Simulate payment processing
      await mockApiDelay(2000);
      
      // Simulate successful payment - in real app, integrate with Stripe/PayPal
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      if (success) {
        setCreditData(prev => ({
          ...prev,
          currentCredits: prev.currentCredits + plan.credits,
          totalCredits: prev.totalCredits + plan.credits
        }));

        toast.success('Credits Purchased Successfully!', {
          description: `${plan.credits} credits have been added to your account.`,
          duration: 5000
        });

        return true;
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase credits';
      setError(errorMessage);
      toast.error('Purchase Failed', {
        description: errorMessage,
        duration: 5000
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAvailablePlans = useCallback(() => {
    return CREDIT_PLANS;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    creditData,
    loading,
    error,
    isLowCredit,
    isCriticalCredit,
    canPerformOperation,
    consumeCredits,
    refreshCredits,
    purchaseCredits,
    getAvailablePlans,
    clearError
  };
}
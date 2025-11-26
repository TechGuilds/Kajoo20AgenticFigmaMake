import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent } from '../../ui/card';
import { Separator } from '../../ui/separator';
import { 
  Zap, 
  CreditCard, 
  Check, 
  Star,
  Shield,
  Clock,
  Loader2
} from 'lucide-react';
import { useCreditManager, type CreditPlan } from '../../../hooks/useCreditManager';

interface PurchaseCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PurchaseCreditsDialog({ open, onOpenChange }: PurchaseCreditsDialogProps) {
  const { purchaseCredits, getAvailablePlans, loading } = useCreditManager();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const plans = getAvailablePlans();

  const handlePurchase = async () => {
    if (!selectedPlan) return;
    
    setProcessing(true);
    const success = await purchaseCredits(selectedPlan);
    
    if (success) {
      onOpenChange(false);
      setSelectedPlan(null);
    }
    setProcessing(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const calculatePricePerCredit = (plan: CreditPlan) => {
    return (plan.price / plan.credits).toFixed(3);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-screen max-w-none h-screen max-h-none m-0 p-0 rounded-none border-none"
        style={{ width: '100vw', height: '100vh', maxWidth: 'none', maxHeight: 'none' }}
      >
        <div className="h-full overflow-y-auto p-12">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Header */}
            <DialogHeader className="text-center space-y-4">
              <DialogTitle className="flex items-center justify-center gap-3 text-3xl">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Zap className="size-8 text-primary" />
                </div>
                Purchase AI Credits
              </DialogTitle>
              <DialogDescription className="text-lg max-w-2xl mx-auto">
                Choose a credit package to continue using AI features in your workspace. Credits are used for AI-powered analysis, content generation, and automated tasks.
              </DialogDescription>
            </DialogHeader>

            {/* Benefits Section */}
            <div className="bg-accent/30 rounded-2xl p-8 border border-accent">
              <h3 className="text-xl mb-6 text-center">Why Purchase More Credits?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="bg-primary/10 p-4 rounded-2xl">
                    <Zap className="size-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-medium">Unlimited AI Power</div>
                    <div className="text-muted-foreground">Access all AI features without restrictions</div>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="bg-success/10 p-4 rounded-2xl">
                    <Clock className="size-8 text-success" />
                  </div>
                  <div>
                    <div className="text-lg font-medium">No Interruptions</div>
                    <div className="text-muted-foreground">Continuous workflow and productivity</div>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="bg-warning/10 p-4 rounded-2xl">
                    <Shield className="size-8 text-warning" />
                  </div>
                  <div>
                    <div className="text-lg font-medium">Priority Support</div>
                    <div className="text-muted-foreground">Faster response times and assistance</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Plans Grid - Much Wider */}
            <div className="space-y-8">
              <h3 className="text-xl text-center">Choose Your Credit Package</h3>
              <div className="grid grid-cols-4 gap-12">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id}
                    className={`relative cursor-pointer transition-all duration-300 min-h-[500px] ${
                      selectedPlan === plan.id 
                        ? 'ring-4 ring-primary shadow-2xl bg-primary/5 scale-105' 
                        : 'hover:shadow-xl border-border hover:border-primary/30'
                    } ${plan.isPopular ? 'border-primary/50' : ''}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge className="bg-primary text-primary-foreground px-6 py-2 text-sm shadow-lg">
                          <Star className="size-4 mr-2" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardContent className="p-8 h-full flex flex-col justify-between space-y-6">
                      {/* Plan Header */}
                      <div className="text-center space-y-3">
                        <h4 className="text-xl font-medium">{plan.name}</h4>
                        <p className="text-muted-foreground">{plan.description}</p>
                      </div>

                      {/* Pricing */}
                      <div className="text-center space-y-2">
                        <div className="text-4xl font-bold text-primary">
                          {formatPrice(plan.price)}
                        </div>
                        <div className="text-muted-foreground">
                          ${calculatePricePerCredit(plan)} per credit
                        </div>
                      </div>

                      {/* Credits Info */}
                      <div className="bg-muted/30 rounded-xl p-6 text-center space-y-3">
                        <div className="text-2xl font-semibold">
                          {plan.credits.toLocaleString()}
                        </div>
                        <div className="text-muted-foreground">
                          AI Credits
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ~{Math.floor(plan.credits / 42)} days at current usage
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Check className="size-5 text-success flex-shrink-0" />
                          <span>Instant activation</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="size-5 text-success flex-shrink-0" />
                          <span>No expiration</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="size-5 text-success flex-shrink-0" />
                          <span>All AI features</span>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {selectedPlan === plan.id && (
                        <div className="absolute inset-0 bg-primary/5 rounded-xl pointer-events-none">
                          <div className="absolute top-6 right-6 bg-primary text-primary-foreground rounded-full p-2">
                            <Check className="size-4" />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator className="my-12" />

            {/* Payment Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-center gap-3">
                <CreditCard className="size-8 text-muted-foreground" />
                <h3 className="text-xl">Secure Payment</h3>
              </div>
              
              {/* Security Badges */}
              <div className="bg-muted/20 rounded-2xl p-6 border border-muted">
                <div className="flex items-center justify-center gap-12 text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Shield className="size-6" />
                    <span className="text-lg">SSL Encrypted</span>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex items-center gap-3">
                    <CreditCard className="size-6" />
                    <span className="text-lg">Stripe Powered</span>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex items-center gap-3">
                    <Clock className="size-6" />
                    <span className="text-lg">Instant Delivery</span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              {selectedPlan && (
                <div className="bg-accent/30 rounded-2xl p-8 border border-accent max-w-2xl mx-auto">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="text-xl font-medium">
                        {plans.find(p => p.id === selectedPlan)?.name}
                      </div>
                      <div className="text-muted-foreground">
                        {plans.find(p => p.id === selectedPlan)?.credits.toLocaleString()} AI Credits
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-3xl font-bold text-primary">
                        {formatPrice(plans.find(p => p.id === selectedPlan)?.price || 0)}
                      </div>
                      <div className="text-muted-foreground">
                        One-time payment
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-6 pt-8 max-w-md mx-auto">
              <Button 
                variant="outline" 
                className="flex-1 h-12" 
                onClick={() => onOpenChange(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground" 
                onClick={handlePurchase}
                disabled={!selectedPlan || processing || loading}
              >
                {processing ? (
                  <>
                    <Loader2 className="size-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="size-5 mr-2" />
                    Complete Purchase
                  </>
                )}
              </Button>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

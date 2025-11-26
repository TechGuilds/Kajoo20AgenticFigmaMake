# AI Credit Management System

## Overview

The AI Credit Management System provides comprehensive credit tracking, consumption monitoring, and purchase flow for AI-powered operations in Kajoo 2.0. This system ensures users never exceed their credit limits and provides a seamless purchase experience when credits run low.

## Key Features

### 🎯 **Credit Tracking & Display**
- Real-time credit balance in the top navigation
- Usage statistics and analytics
- Daily/monthly consumption tracking
- Projected days remaining based on usage patterns

### 🚦 **Smart Credit Gating**
- Prevents AI operations when credits are insufficient
- Dynamic cost estimation based on operation complexity
- Real-time validation before operation execution

### 💳 **Integrated Purchase Flow**
- Multiple credit packages (100, 500, 1000, 2500 credits)
- Secure payment processing simulation
- Instant credit delivery after purchase

### 📊 **Usage Analytics**
- Detailed usage breakdowns by operation type
- Daily and weekly usage trends
- Operation efficiency insights
- Cost optimization recommendations

### ⚠️ **Smart Warnings**
- Low credit notifications (≤20% remaining)
- Critical credit alerts (≤5% remaining)
- Automatic purchase prompts for critical situations

## Components

### Core Components

1. **`useCreditManager`** - Central hook for credit management
2. **`AICreditTracker`** - Top navigation credit display widget
3. **`PurchaseCreditsDialog`** - Credit purchase interface
4. **`CreditUsageDialog`** - Detailed usage analytics
5. **`LowCreditWarning`** - Warning banner for low credits
6. **`CreditGate`** - Blocks operations with insufficient credits
7. **`CreditProvider`** - Context provider for credit state

### Specialized Components

- **`CreditGatedChatInput`** - Chat input with dynamic cost estimation
- **`CreditManagementDemo`** - Comprehensive demo of all features

## Usage Examples

### Basic Credit Checking

```tsx
import { useCreditManager } from './hooks/useCreditManager';

function MyComponent() {
  const { creditData, canPerformOperation, consumeCredits } = useCreditManager();
  
  const handleAIOperation = async () => {
    if (!canPerformOperation(5)) {
      // Show purchase dialog
      return;
    }
    
    const success = await consumeCredits(5, 'Code Analysis');
    if (success) {
      // Proceed with operation
    }
  };
}
```

### Credit-Gated Component

```tsx
import { CreditGate } from './components/CreditGate';

function ExpensiveAIOperation() {
  return (
    <CreditGate creditsRequired={15} operation="Comprehensive Audit">
      <MyExpensiveComponent />
    </CreditGate>
  );
}
```

### Higher-Order Component

```tsx
import { withCreditGate } from './components/CreditGate';

const CreditGatedComponent = withCreditGate(MyComponent, 10, 'Component Migration');
```

## Credit Costs

| Operation Type | Credits | Description |
|---------------|---------|-------------|
| Simple Chat | 1 | Basic AI conversation |
| Code Analysis | 5 | Code quality and pattern analysis |
| Generate Report | 8 | Progress and summary reports |
| Component Migration | 10 | Legacy to modern framework migration |
| Create Tasks | 12 | AI-generated task breakdown |
| Comprehensive Audit | 15 | Full system analysis |

## Purchase Plans

| Plan | Credits | Price | Cost per Credit |
|------|---------|-------|----------------|
| Starter | 100 | $9.99 | $0.100 |
| Professional | 500 | $39.99 | $0.080 |
| Business | 1,000 | $69.99 | $0.070 |
| Enterprise | 2,500 | $149.99 | $0.060 |

## Integration Guide

### 1. Wrap Your App with Providers

```tsx
import { CreditProvider } from './components/CreditProvider';

function App() {
  return (
    <ThemeProvider>
      <CreditProvider>
        <YourAppContent />
      </CreditProvider>
    </ThemeProvider>
  );
}
```

### 2. Add Credit Tracker to Navigation

```tsx
import { AICreditTracker } from './components/AICreditTracker';

function Navigation() {
  return (
    <nav>
      {/* Other navigation items */}
      <AICreditTracker />
    </nav>
  );
}
```

### 3. Gate AI Operations

```tsx
import { useCreditContext } from './components/CreditProvider';

function MyAIComponent() {
  const { consumeCreditsForOperation } = useCreditContext();
  
  const handleAICall = async () => {
    const success = await consumeCreditsForOperation(5, 'Code Analysis', {
      projectId: 'project-123',
      taskId: 'task-456'
    });
    
    if (success) {
      // Proceed with AI operation
    }
  };
}
```

## Configuration

### Environment Variables

```env
# Credit system configuration
REACT_APP_CREDIT_API_URL=https://api.kajoo.io/credits
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_ENABLE_CREDIT_SYSTEM=true
```

### Default Settings

```tsx
const CREDIT_SETTINGS = {
  lowCreditThreshold: 0.2,      // 20% remaining
  criticalCreditThreshold: 0.05, // 5% remaining
  warningDismissTimeout: 30 * 60 * 1000, // 30 minutes
  autoShowPurchaseDialog: true,
  enableUsageAnalytics: true
};
```

## API Integration

### Backend Endpoints

```typescript
// Credit balance
GET /api/credits/balance
Response: { currentCredits: number, totalCredits: number }

// Consume credits
POST /api/credits/consume
Body: { credits: number, operation: string, context?: object }
Response: { success: boolean, remainingCredits: number }

// Purchase credits
POST /api/credits/purchase
Body: { planId: string, paymentMethodId: string }
Response: { success: boolean, transaction: object }

// Usage analytics
GET /api/credits/usage?period=month
Response: { usage: CreditUsage[], statistics: object }
```

## Testing the System

1. Navigate to **Settings > Credit Management Demo**
2. Try different operations to see cost estimation
3. Test the chat input with various message types
4. Simulate low credit scenarios
5. Test the purchase flow

## Best Practices

### For Developers

1. **Always check credits before AI operations**
2. **Use appropriate cost estimation for operations**
3. **Provide clear feedback on credit consumption**
4. **Handle credit failures gracefully**

### For Users

1. **Monitor credit usage in the navigation bar**
2. **Purchase credits before running low**
3. **Use the usage analytics to optimize workflows**
4. **Consider upgrading to higher plans for better rates**

## Customization

### Styling

All components use CSS custom properties from the design system:

```css
:root {
  --color-primary: #5F55EE;
  --color-success: #54a69b;
  --color-warning: #e1584a;
  --color-destructive: #d4183d;
}
```

### Operation Costs

Modify costs in `useCreditManager.ts`:

```tsx
const OPERATION_COSTS = {
  'simple_chat': 1,
  'code_analysis': 5,
  'component_migration': 10,
  // Add custom operations
};
```

## Support

For questions about the credit system:

1. Check the demo page for examples
2. Review the usage analytics for optimization tips
3. Contact support for billing issues
4. Submit feature requests for new functionality

---

**Note**: This system is designed to be production-ready with proper backend integration. The current implementation includes mock data for demonstration purposes.
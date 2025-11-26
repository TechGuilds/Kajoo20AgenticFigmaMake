# Toast Notification System - Kajoo 2.0

## Overview

The Kajoo 2.0 toast notification system provides a comprehensive, accessible, and beautifully designed way to show real-time feedback and status updates across the entire application. Built on top of Sonner, it features glassmorphism design, smart stacking, and full accessibility support.

## Features

✅ **Multiple Variants**: Success, Error, Warning, Info, and General Message  
✅ **Glassmorphism Design**: Translucent backgrounds with blur effects matching the app theme  
✅ **Left Accent Borders**: Color-coded borders and icons for quick visual identification  
✅ **Smart Stacking**: Maximum of 3 visible toasts with elegant layering  
✅ **Auto-dismiss**: Configurable duration with pause-on-hover support  
✅ **Responsive**: Top-right positioning on desktop, bottom-center on mobile  
✅ **Dark Mode**: Full support for light and dark themes  
✅ **Accessibility**: ARIA live regions and keyboard navigation  
✅ **Action Buttons**: Support for interactive buttons within toasts  
✅ **Promise Integration**: Automatic state management for async operations  

## Quick Start

### Import the Toast Functions

```tsx
import { showSuccess, showError, showWarning, showInfo, showMessage } from './components/toast';
```

### Basic Usage

```tsx
// Success notification
showSuccess('Connection added successfully');

// Error notification
showError('Failed to disable Migration Agent');

// Warning notification
showWarning('Unsaved changes will be lost');

// Info notification
showInfo('QA Agent is reviewing your last action');

// General message
showMessage('Agent synchronized successfully');
```

### With Descriptions

```tsx
showSuccess('Workspace created successfully', {
  description: 'Your new workspace is ready to use.',
});

showError('Failed to save settings', {
  description: 'Please check your connection and try again.',
});
```

### With Action Buttons

```tsx
showWarning('Unsaved changes detected', {
  description: 'Do you want to save before leaving?',
  action: {
    label: 'Save Changes',
    onClick: () => {
      // Handle save action
    },
  },
  cancel: {
    label: 'Discard',
    onClick: () => {
      // Handle discard action
    },
  },
});
```

### Persistent Toasts (Manual Dismissal Required)

```tsx
showError('Critical connection failure', {
  description: 'Unable to reach the server.',
  important: true, // Won't auto-dismiss
});
```

### Loading States

```tsx
import { showLoading, dismissToast } from './components/toast';

const loadingId = showLoading('Processing your request', {
  description: 'This may take a few moments...',
});

// Later, dismiss and show result
setTimeout(() => {
  dismissToast(loadingId);
  showSuccess('Request completed successfully');
}, 3000);
```

### Promise-based Toasts

```tsx
import { showPromise } from './components/toast';

const saveData = async () => {
  // Your async operation
  return await api.saveWorkspace(data);
};

showPromise(saveData(), {
  loading: 'Saving workspace...',
  success: 'Workspace saved successfully',
  error: 'Failed to save workspace',
});
```

## API Reference

### `showSuccess(message, options?)`

Displays a success toast with a green accent and checkmark icon.

**Parameters:**
- `message` (string): The main message to display
- `options` (ToastOptions, optional):
  - `title` (string): Optional title (message becomes description)
  - `description` (string): Additional context
  - `duration` (number): Duration in ms (default: 3500)
  - `important` (boolean): If true, requires manual dismissal
  - `action` (object): Action button configuration
  - `cancel` (object): Cancel button configuration

### `showError(message, options?)`

Displays an error toast with a red accent and alert icon.

### `showWarning(message, options?)`

Displays a warning toast with a yellow/orange accent and warning icon.

### `showInfo(message, options?)`

Displays an info toast with a blue accent and info icon.

### `showMessage(message, options?)`

Displays a general message toast with a neutral accent and message icon.

### `showLoading(message, options?)`

Displays a persistent loading toast with a spinner. Returns a toast ID for later dismissal.

### `showPromise(promise, messages)`

Automatically manages toast state based on promise resolution.

**Parameters:**
- `promise` (Promise): The promise to track
- `messages` (object):
  - `loading` (string): Message while pending
  - `success` (string | function): Message on success
  - `error` (string | function): Message on error

### `dismissToast(id)`

Dismisses a specific toast by its ID.

### `dismissAllToasts()`

Dismisses all active toasts.

## Real-world Usage Examples

### Agent Actions

```tsx
// Enable agent
showSuccess('Migration Agent enabled successfully', {
  description: 'The agent is now monitoring your project.',
});

// Disable agent
showInfo('QA Agent disabled', {
  description: 'You can re-enable it anytime from settings.',
});
```

### Connection Management

```tsx
// Add connection
showSuccess('GitHub connection added successfully', {
  description: 'You can now sync repositories and issues.',
});

// Connection error
showError('Failed to connect to Sitecore XP', {
  description: 'Please verify your credentials and try again.',
  action: {
    label: 'Retry',
    onClick: () => retryConnection(),
  },
});
```

### Settings Changes

```tsx
// Save settings
showSuccess('Settings saved', {
  description: 'Your preferences have been updated.',
});

// Unsaved changes warning
showWarning('You have unsaved changes', {
  description: 'Save them before leaving to avoid losing your work.',
  action: {
    label: 'Save Now',
    onClick: () => saveSettings(),
  },
  cancel: {
    label: 'Discard',
  },
});
```

### Background Operations

```tsx
// Sync in progress
const syncId = showLoading('Syncing workspace data', {
  description: 'This may take a few moments...',
});

// After sync completes
api.syncWorkspace().then(() => {
  dismissToast(syncId);
  showSuccess('Workspace synced successfully');
}).catch((error) => {
  dismissToast(syncId);
  showError('Failed to sync workspace', {
    description: error.message,
  });
});
```

### Form Validation

```tsx
// Validation error
showError('Invalid form data', {
  description: 'Please fix the highlighted fields and try again.',
});

// Form submission
const submitForm = async (data) => {
  return await api.submitForm(data);
};

showPromise(submitForm(formData), {
  loading: 'Submitting form...',
  success: 'Form submitted successfully',
  error: 'Failed to submit form. Please try again.',
});
```

## Design Specifications

### Visual Design

- **Background**: Glassmorphism with 95% opacity and backdrop blur
- **Border**: Thin border using design system border color
- **Accent**: 4px left border in variant-specific color
- **Shadow**: Subtle elevation shadow for depth
- **Radius**: Uses global `--radius` variable (0.625rem)
- **Icon**: 40px colored background with centered icon
- **Typography**: Uses design system font weights and sizes

### Colors (Light Mode)

- **Success**: `#54a69b` (teal/green)
- **Error**: `#d4183d` (red)
- **Warning**: `#e1584a` (orange/red)
- **Info**: `#5F55EE` (primary purple)
- **Border**: `rgba(0, 0, 0, 0.1)`

### Colors (Dark Mode)

- **Success**: `#4ade80` (bright green)
- **Error**: `#f87171` (bright red)
- **Warning**: `#fb7185` (bright pink/red)
- **Info**: `#7B73F0` (primary purple)
- **Border**: Adjusted for dark theme

### Animations

- **Entry**: Slide in from right with fade (desktop), from bottom (mobile)
- **Exit**: Slide out with fade
- **Duration**: 300ms cubic-bezier easing
- **Stacking**: Offset and scale transforms for depth

### Responsive Behavior

**Desktop (> 640px)**:
- Position: Top-right corner
- Offset: 1rem from edges
- Width: Auto (max content)

**Mobile (≤ 640px)**:
- Position: Bottom-center
- Offset: 1rem from edges
- Width: Full width minus 2rem padding

## Accessibility

### ARIA Support

- Success/Info: `aria-live="polite"`
- Error/Warning: `aria-live="assertive"`
- Role: `status` or `alert` based on variant

### Keyboard Navigation

- Tab: Navigate to action buttons
- Enter/Space: Activate buttons
- Escape: Dismiss toast (when focused)

### Screen Reader Support

All toasts are announced to screen readers with appropriate urgency levels.

### High Contrast Mode

In high contrast mode:
- Border width increases to 2px
- Accent border increases to 6px
- Enhanced color contrast

## Advanced Usage

### Custom Duration

```tsx
showSuccess('Quick message', {
  duration: 1500, // 1.5 seconds
});

showInfo('Important information', {
  duration: 10000, // 10 seconds
});
```

### Stacking Multiple Toasts

```tsx
// Toasts automatically stack (max 3 visible)
showSuccess('First operation completed');
showInfo('Second operation in progress');
showSuccess('Third operation completed');
// Oldest toast will auto-dismiss when 4th is added
```

### Pause on Hover

Toasts automatically pause their auto-dismiss timer when hovered over, giving users time to read longer messages.

## Integration Examples

### With WorkspaceSettings Component

```tsx
import { showSuccess, showError } from './toast';

const handleConnectionCreate = async () => {
  try {
    await createConnection(connectionData);
    showSuccess('Connection added successfully', {
      description: 'Your new connection is ready to use.',
    });
  } catch (error) {
    showError('Failed to add connection', {
      description: error.message,
    });
  }
};
```

### With Agent Orchestration

```tsx
import { showInfo, showSuccess, showWarning } from './toast';

const handleAgentToggle = async (agentId, enabled) => {
  if (enabled) {
    showInfo(`${agentName} is starting up`, {
      description: 'This may take a few moments...',
    });
  } else {
    showWarning(`Are you sure you want to disable ${agentName}?`, {
      description: 'This will stop all active tasks.',
      action: {
        label: 'Disable',
        onClick: async () => {
          await disableAgent(agentId);
          showSuccess(`${agentName} disabled`);
        },
      },
      cancel: { label: 'Cancel' },
    });
  }
};
```

## Best Practices

1. **Be Concise**: Keep messages short and actionable
2. **Provide Context**: Use descriptions for additional details
3. **Choose Appropriate Variants**: Match severity to toast type
4. **Use Action Buttons Sparingly**: Only for important decisions
5. **Don't Overwhelm**: Limit simultaneous toasts to important events
6. **Persist Critical Errors**: Use `important: true` for errors requiring attention
7. **Provide Recovery Options**: Include action buttons for recoverable errors

## Testing

The `ToastExamples` component provides an interactive playground for testing all toast variants and features. To view:

```tsx
import { ToastExamples } from './components/ToastExamples';

// Add to your view for testing
<ToastExamples />
```

## Migration from Old Toast System

If you were using the old toast system:

**Before:**
```tsx
import { toast } from 'sonner@2.0.3';
toast.success('Message');
```

**After:**
```tsx
import { showSuccess } from './components/toast';
showSuccess('Message');
```

The new system provides better defaults, consistent styling, and more features while maintaining backward compatibility through the exported `toast` object.

## Troubleshooting

### Toasts not appearing?

- Ensure `<Toaster />` is included in your App component
- Check that it's inside the `ThemeProvider`

### Styling issues?

- Verify `globals.css` includes the toast styles
- Check for conflicting CSS classes
- Ensure design system CSS variables are defined

### Toasts disappearing too quickly?

- Increase duration: `showSuccess('Message', { duration: 5000 })`
- Use `important: true` for critical messages

### Accessibility concerns?

- All toasts automatically include ARIA attributes
- Ensure interactive elements are keyboard accessible
- Test with screen readers

## License

Part of Kajoo 2.0 platform - Internal use only.

/**
 * Toast notification utilities for Kajoo 2.0
 * Provides consistent, themed toast notifications across the application
 */

import { toast as sonnerToast } from 'sonner@2.0.3';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, MessageSquare } from 'lucide-react';

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick?: () => void;
  };
  important?: boolean; // If true, requires manual dismissal
}

/**
 * Show a success toast notification
 */
export function showSuccess(message: string, options?: ToastOptions) {
  const { title, description, duration, action, cancel, important } = options || {};
  
  return sonnerToast.success(title || message, {
    description: title ? message : description,
    duration: important ? Infinity : duration,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
    cancel: cancel ? {
      label: cancel.label,
      onClick: cancel.onClick,
    } : undefined,
    icon: <CheckCircle2 className="size-5" />,
  });
}

/**
 * Show an error toast notification
 */
export function showError(message: string, options?: ToastOptions) {
  const { title, description, duration, action, cancel, important } = options || {};
  
  return sonnerToast.error(title || message, {
    description: title ? message : description,
    duration: important ? Infinity : duration,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
    cancel: cancel ? {
      label: cancel.label,
      onClick: cancel.onClick,
    } : undefined,
    icon: <AlertCircle className="size-5" />,
  });
}

/**
 * Show a warning toast notification
 */
export function showWarning(message: string, options?: ToastOptions) {
  const { title, description, duration, action, cancel, important } = options || {};
  
  return sonnerToast.warning(title || message, {
    description: title ? message : description,
    duration: important ? Infinity : duration,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
    cancel: cancel ? {
      label: cancel.label,
      onClick: cancel.onClick,
    } : undefined,
    icon: <AlertTriangle className="size-5" />,
  });
}

/**
 * Show an info toast notification
 */
export function showInfo(message: string, options?: ToastOptions) {
  const { title, description, duration, action, cancel, important } = options || {};
  
  return sonnerToast.info(title || message, {
    description: title ? message : description,
    duration: important ? Infinity : duration,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
    cancel: cancel ? {
      label: cancel.label,
      onClick: cancel.onClick,
    } : undefined,
    icon: <Info className="size-5" />,
  });
}

/**
 * Show a general message toast notification (neutral variant)
 */
export function showMessage(message: string, options?: ToastOptions) {
  const { title, description, duration, action, cancel, important } = options || {};
  
  return sonnerToast(title || message, {
    description: title ? message : description,
    duration: important ? Infinity : duration,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
    cancel: cancel ? {
      label: cancel.label,
      onClick: cancel.onClick,
    } : undefined,
    icon: <MessageSquare className="size-5" />,
  });
}

/**
 * Dismiss a specific toast by ID
 */
export function dismissToast(id: string | number) {
  sonnerToast.dismiss(id);
}

/**
 * Dismiss all active toasts
 */
export function dismissAllToasts() {
  sonnerToast.dismiss();
}

/**
 * Show a loading toast that persists until dismissed
 */
export function showLoading(message: string, options?: Omit<ToastOptions, 'important'>) {
  const { title, description } = options || {};
  
  return sonnerToast.loading(title || message, {
    description: title ? message : description,
  });
}

/**
 * Show a promise-based toast that updates based on promise state
 */
export function showPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: Error) => string);
  }
) {
  return sonnerToast.promise(promise, messages);
}

// Re-export the main toast object for advanced usage
export { sonnerToast as toast };

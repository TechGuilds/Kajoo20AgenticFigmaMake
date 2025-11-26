import React, { ReactNode, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

/**
 * Reusable confirmation dialog component
 * Consolidates delete confirmations and other destructive actions
 * 100% design system compliant - uses CSS variables only
 */

export interface ConfirmDialogProps {
  /**
   * Whether dialog is open
   */
  open: boolean;
  
  /**
   * Change handler for open state
   */
  onOpenChange: (open: boolean) => void;
  
  /**
   * Dialog title
   */
  title: string;
  
  /**
   * Dialog description/message
   */
  description: string | ReactNode;
  
  /**
   * Confirm button text
   */
  confirmText?: string;
  
  /**
   * Cancel button text
   */
  cancelText?: string;
  
  /**
   * Confirm button variant
   */
  variant?: 'default' | 'destructive';
  
  /**
   * Confirm action handler (can be async)
   */
  onConfirm: () => void | Promise<void>;
  
  /**
   * Cancel action handler
   */
  onCancel?: () => void;
  
  /**
   * Whether action is loading
   */
  loading?: boolean;
  
  /**
   * Icon to display
   */
  icon?: ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
  loading: externalLoading = false,
  icon
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = externalLoading || internalLoading;

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('Confirm action failed:', error);
    } finally {
      setInternalLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {icon && (
            <div style={{ marginBottom: 'var(--spacing-2)' }}>
              {icon}
            </div>
          )}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={loading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
          >
            {loading ? (
              <>
                <Loader2 
                  className="animate-spin" 
                  style={{ 
                    width: 'var(--spacing-4)', 
                    height: 'var(--spacing-4)',
                    marginRight: 'var(--spacing-2)'
                  }} 
                />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

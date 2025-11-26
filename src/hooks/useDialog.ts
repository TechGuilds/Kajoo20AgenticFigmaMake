import { useState, useCallback } from 'react';

/**
 * Generic hook for managing dialog/modal state
 * Reduces duplication across components with dialogs
 * 
 * @example
 * ```typescript
 * const editDialog = useDialog<Project>();
 * 
 * // Open dialog with data
 * editDialog.open(project);
 * 
 * // In JSX
 * <Dialog open={editDialog.isOpen} onOpenChange={editDialog.setIsOpen}>
 *   {editDialog.data && <EditForm project={editDialog.data} />}
 * </Dialog>
 * ```
 */

export interface UseDialogReturn<T = any> {
  /**
   * Whether dialog is open
   */
  isOpen: boolean;
  
  /**
   * Data associated with the dialog
   */
  data: T | null;
  
  /**
   * Open dialog with optional data
   */
  open: (data?: T) => void;
  
  /**
   * Close dialog and clear data
   */
  close: () => void;
  
  /**
   * Toggle dialog state
   */
  toggle: () => void;
  
  /**
   * Set open state directly (for Dialog onOpenChange)
   */
  setIsOpen: (open: boolean) => void;
  
  /**
   * Update dialog data without closing
   */
  setData: (data: T | null) => void;
}

/**
 * Hook for managing dialog state
 */
export function useDialog<T = any>(initialData: T | null = null): UseDialogReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(initialData);

  const open = useCallback((newData?: T) => {
    if (newData !== undefined) {
      setData(newData);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Small delay before clearing data to allow exit animation
    setTimeout(() => setData(null), 150);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      close();
    } else {
      setIsOpen(true);
    }
  }, [close]);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    setIsOpen: handleOpenChange,
    setData
  };
}

/**
 * Hook for managing multiple related dialogs
 * Useful when you have edit, delete, create dialogs for the same entity
 * 
 * @example
 * ```typescript
 * const { dialogs, open, close } = useDialogs<Project>({
 *   edit: null,
 *   delete: null,
 *   create: null
 * });
 * 
 * // Open specific dialog
 * open('edit', project);
 * 
 * // Close specific dialog
 * close('edit');
 * 
 * // Use in JSX
 * <Dialog open={dialogs.edit.isOpen} onOpenChange={() => close('edit')}>
 *   {dialogs.edit.data && <EditForm project={dialogs.edit.data} />}
 * </Dialog>
 * ```
 */

export type DialogsState<T, K extends string = string> = Record<K, { isOpen: boolean; data: T | null }>;

export interface UseDialogsReturn<T, K extends string = string> {
  /**
   * State of all dialogs
   */
  dialogs: DialogsState<T, K>;
  
  /**
   * Open a specific dialog with data
   */
  open: (key: K, data?: T) => void;
  
  /**
   * Close a specific dialog
   */
  close: (key: K) => void;
  
  /**
   * Toggle a specific dialog
   */
  toggle: (key: K, data?: T) => void;
  
  /**
   * Close all dialogs
   */
  closeAll: () => void;
  
  /**
   * Get data for a specific dialog
   */
  getData: (key: K) => T | null;
  
  /**
   * Check if a specific dialog is open
   */
  isOpen: (key: K) => boolean;
}

export function useDialogs<T, K extends string = string>(
  initialState: Record<K, T | null>
): UseDialogsReturn<T, K> {
  const [dialogs, setDialogs] = useState<DialogsState<T, K>>(() => {
    const initial: any = {};
    Object.keys(initialState).forEach(key => {
      initial[key] = { isOpen: false, data: initialState[key as K] };
    });
    return initial;
  });

  const open = useCallback((key: K, data?: T) => {
    setDialogs(prev => ({
      ...prev,
      [key]: { isOpen: true, data: data !== undefined ? data : prev[key].data }
    }));
  }, []);

  const close = useCallback((key: K) => {
    setDialogs(prev => ({
      ...prev,
      [key]: { ...prev[key], isOpen: false }
    }));
    
    // Clear data after animation
    setTimeout(() => {
      setDialogs(prev => ({
        ...prev,
        [key]: { isOpen: false, data: null }
      }));
    }, 150);
  }, []);

  const toggle = useCallback((key: K, data?: T) => {
    setDialogs(prev => {
      const current = prev[key];
      if (current.isOpen) {
        return {
          ...prev,
          [key]: { ...current, isOpen: false }
        };
      } else {
        return {
          ...prev,
          [key]: { isOpen: true, data: data !== undefined ? data : current.data }
        };
      }
    });
  }, []);

  const closeAll = useCallback(() => {
    setDialogs(prev => {
      const updated: any = {};
      Object.keys(prev).forEach(key => {
        updated[key] = { ...prev[key as K], isOpen: false };
      });
      return updated;
    });
    
    // Clear all data after animation
    setTimeout(() => {
      setDialogs(prev => {
        const updated: any = {};
        Object.keys(prev).forEach(key => {
          updated[key] = { isOpen: false, data: null };
        });
        return updated;
      });
    }, 150);
  }, []);

  const getData = useCallback((key: K) => {
    return dialogs[key]?.data || null;
  }, [dialogs]);

  const isDialogOpen = useCallback((key: K) => {
    return dialogs[key]?.isOpen || false;
  }, [dialogs]);

  return {
    dialogs,
    open,
    close,
    toggle,
    closeAll,
    getData,
    isOpen: isDialogOpen
  };
}

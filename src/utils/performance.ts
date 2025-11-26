import { memo } from 'react';

/**
 * Higher-order component for memoizing components
 * Use for components that receive complex props or render frequently
 */
export const withMemo = <T extends object>(
  Component: React.ComponentType<T>,
  areEqual?: (prevProps: T, nextProps: T) => boolean
) => {
  return memo(Component, areEqual);
};

/**
 * Check if two workspace objects are equal for memoization
 */
export const areWorkspacesEqual = (
  prevWorkspaces: any[],
  nextWorkspaces: any[]
): boolean => {
  if (prevWorkspaces.length !== nextWorkspaces.length) return false;
  
  return prevWorkspaces.every((workspace, index) => {
    const nextWorkspace = nextWorkspaces[index];
    return (
      workspace.id === nextWorkspace.id &&
      workspace.name === nextWorkspace.name &&
      workspace.status === nextWorkspace.status &&
      workspace.progress === nextWorkspace.progress &&
      workspace.lastActivity === nextWorkspace.lastActivity
    );
  });
};

/**
 * Debounce function for expensive operations
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
export const handleAsyncError = (error: any, context: string) => {
  console.error(`Error in ${context}:`, error);
  // In a real app, you might want to send this to an error reporting service
};

export const createErrorBoundary = (fallback: React.ComponentType<any>) => {
  // This would be used for React Error Boundaries
  return fallback;
};

export const validateWorkspaceData = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Workspace name is required');
  }
  
  if (data.name && data.name.length > 100) {
    errors.push('Workspace name must be less than 100 characters');
  }
  
  return errors;
};

export const validateProjectData = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Project name is required');
  }
  
  if (data.name && data.name.length > 100) {
    errors.push('Project name must be less than 100 characters');
  }
  
  return errors;
};
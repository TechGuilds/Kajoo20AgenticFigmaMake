export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': 
      return 'bg-green-500';
    case 'planning': 
      return 'bg-amber-500';
    case 'paused': 
      return 'bg-muted-foreground';
    case 'completed': 
      return 'bg-primary';
    default: 
      return 'bg-muted-foreground/60';
  }
};
// Utility functions for Kajoo 2.0
// All utilities are design system compliant and fully typed

// Status utilities
export {
  getStatusIcon,
  getStatusColor,
  getPriorityColor,
  getPhaseColor,
  getStatusLabel,
  getPriorityLabel,
  getPhaseLabel,
  type Status,
  type Priority,
  type Phase
} from './statusUtils';

// Icon utilities
export {
  getArtifactIcon,
  getArtifactBadgeClass,
  getTemplateIcon,
  getTemplateTypeColor,
  getFileIcon,
  getArtifactTypeLabel,
  getTemplateTypeLabel,
  type ArtifactType,
  type TemplateType,
  type FileType
} from './iconUtils';

// Date utilities
export {
  formatDate,
  formatDateShort,
  formatDateLong,
  formatDateTime,
  formatRelativeTime,
  isToday,
  isPast,
  isFuture,
  getTimeRemaining,
  formatDuration,
  startOfDay,
  endOfDay,
  addDays,
  subtractDays
} from './dateUtils';

export const formatDate = (value?: string): string => {
  if (!value) return 'Date unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

export const formatTransportMode = (mode: string): string => {
  switch (mode) {
    case 'foot':
      return 'On foot';
    case 'horse':
      return 'Mounted';
    case 'ship':
      return 'Naval';
    case 'supply':
      return 'Supply';
    default:
      return mode;
  }
};

export const modeIcon = (mode: string): string => {
  switch (mode) {
    case 'foot':
      return '🚶';
    case 'horse':
      return '🐎';
    case 'ship':
      return '⛵';
    case 'supply':
      return '📦';
    default:
      return '➤';
  }
};

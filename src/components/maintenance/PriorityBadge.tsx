
interface PriorityBadgeProps {
  priority: string;
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(priority)}`}>
      {priority.toUpperCase()} PRIORITY
    </span>
  );
};

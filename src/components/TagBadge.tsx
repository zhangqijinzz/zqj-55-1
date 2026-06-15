import { X } from 'lucide-react';

interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
  color?: 'default' | 'mint' | 'coral' | 'sky' | 'lavender' | 'amber';
  size?: 'sm' | 'md';
}

const colorMap = {
  default: 'bg-primary-100 text-primary-700',
  mint: 'bg-mint-400/30 text-mint-600',
  coral: 'bg-coral-400/30 text-coral-600',
  sky: 'bg-sky-400/30 text-sky-600',
  lavender: 'bg-lavender-400/30 text-lavender-600',
  amber: 'bg-amber-100 text-amber-700',
};

const sizeMap = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
};

export default function TagBadge({ tag, onRemove, color = 'default', size = 'sm' }: TagBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${colorMap[color]} ${sizeMap[size]}`}
    >
      <span className="truncate max-w-[120px]">{tag}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}

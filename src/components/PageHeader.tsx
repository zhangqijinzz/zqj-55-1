import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  variant?: 'default' | 'primary' | 'mint' | 'coral' | 'sky' | 'lavender';
}

const variantStyles = {
  default: 'bg-white',
  primary: 'bg-gradient-to-br from-primary-400 to-primary-600 text-white',
  mint: 'bg-gradient-to-br from-mint-400 to-mint-600 text-white',
  coral: 'bg-gradient-to-br from-coral-400 to-coral-600 text-white',
  sky: 'bg-gradient-to-br from-sky-400 to-sky-600 text-white',
  lavender: 'bg-gradient-to-br from-lavender-400 to-lavender-600 text-white',
};

export default function PageHeader({
  title,
  subtitle,
  showBack = false,
  rightAction,
  variant = 'default',
}: PageHeaderProps) {
  const navigate = useNavigate();
  const isColored = variant !== 'default';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${variantStyles[variant]} px-6 pb-6 pt-12 relative overflow-hidden`}
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all btn-bounce ${
                isColored
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <ChevronLeft size={22} />
            </button>
          ) : (
            <div className="w-10" />
          )}
          
          {rightAction && <div>{rightAction}</div>}
        </div>
        
        <div>
          <h1 className="text-2xl font-bold mb-1">{title}</h1>
          {subtitle && (
            <p className={`text-sm ${isColored ? 'text-white/80' : 'text-gray-500'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.header>
  );
}

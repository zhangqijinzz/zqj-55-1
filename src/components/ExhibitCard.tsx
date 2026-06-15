import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Layers, AlertCircle, Edit3 } from 'lucide-react';
import TagBadge from './TagBadge';
import type { Exhibit } from '../types';

interface ExhibitCardProps {
  exhibit: Exhibit;
  index?: number;
  variant?: 'default' | 'compact' | 'route';
  showOrder?: boolean;
  onEdit?: (id: string) => void;
}

export default function ExhibitCard({ exhibit, index = 0, variant = 'default', showOrder = false, onEdit }: ExhibitCardProps) {
  const colors = ['bg-mint-400', 'bg-coral-400', 'bg-sky-400', 'bg-lavender-400', 'bg-amber-300', 'bg-rose-300'];
  const bgColor = colors[index % colors.length];
  const isPending = exhibit.status === 'pending';
  const displayName = exhibit.name || '未命名展品';
  
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`bg-white rounded-2xl shadow-soft overflow-hidden border ${
          isPending ? 'border-amber-300' : 'border-primary-100'
        }`}
      >
        <Link to={`/collection/${exhibit.id}`} className="block">
          <div className={`aspect-square ${bgColor} flex items-center justify-center relative`}>
            {exhibit.image ? (
              <img
                src={exhibit.image}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-5xl">🏺</span>
            )}
            {showOrder && (
              <div className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-primary-600 shadow">
                {exhibit.visitOrder}
              </div>
            )}
            {isPending && (
              <div className="absolute top-2 right-2 bg-amber-400 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-0.5 font-medium shadow">
                <AlertCircle size={10} />
                待完善
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className={`font-semibold text-sm truncate ${isPending && !exhibit.name ? 'text-gray-400 italic' : 'text-gray-800'}`}>
              {displayName}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Calendar size={10} />
              {exhibit.era || '未填写年代'}
            </p>
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === 'route') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`bg-white rounded-2xl shadow-card overflow-hidden border paper-texture ${
          isPending ? 'border-amber-200' : 'border-primary-100'
        }`}
      >
        <div className="flex items-stretch">
          <Link to={`/collection/${exhibit.id}`} className="flex-1 flex items-stretch">
            <div className={`w-24 flex-shrink-0 ${bgColor} flex items-center justify-center relative`}>
              {exhibit.image ? (
                <img
                  src={exhibit.image}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl">🏺</span>
              )}
              {isPending && (
                <div className="absolute top-1.5 left-1.5 bg-amber-400 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow">
                  待完善
                </div>
              )}
            </div>
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold truncate ${isPending && !exhibit.name ? 'text-gray-400 italic' : 'text-gray-800'}`}>
                    {displayName}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <Calendar size={12} />
                    {exhibit.era || '未填写年代'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Layers size={10} />
                    {exhibit.material || '未填写材质'}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {exhibit.visitOrder}
                </div>
              </div>
              {exhibit.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {exhibit.tags.slice(0, 3).map((tag) => (
                    <TagBadge key={tag} tag={tag} size="sm" color="amber" />
                  ))}
                </div>
              )}
            </div>
          </Link>
          {isPending && (
            <div className="flex items-center px-3">
              <button
                onClick={() => onEdit?.(exhibit.id)}
                className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center hover:bg-amber-100 transition-colors"
              >
                <Edit3 size={18} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border paper-texture ${
        isPending ? 'border-amber-200' : 'border-primary-100'
      }`}
    >
      <Link to={`/collection/${exhibit.id}`} className="block">
        <div className={`aspect-[4/3] ${bgColor} flex items-center justify-center relative overflow-hidden`}>
          {exhibit.image ? (
            <img
              src={exhibit.image}
              alt={displayName}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <span className="text-7xl animate-float">🏺</span>
          )}
          {showOrder && (
            <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-sm font-bold text-primary-600 shadow-lg">
              {exhibit.visitOrder}
            </div>
          )}
          {isPending && (
            <div className="absolute top-3 right-3 bg-amber-400 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium shadow-lg">
              <AlertCircle size={12} />
              待完善
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
        <div className="p-5">
          <h3 className={`font-bold text-lg mb-2 ${isPending && !exhibit.name ? 'text-gray-400 italic' : 'text-gray-800'}`}>
            {displayName}
          </h3>
          
          <div className="space-y-1.5 mb-4">
            <p className={`text-sm flex items-center gap-2 ${exhibit.era ? 'text-gray-600' : 'text-gray-400'}`}>
              <Calendar size={14} className={exhibit.era ? 'text-primary-400' : 'text-gray-300'} />
              <span>{exhibit.era || '未填写年代'}</span>
            </p>
            <p className={`text-sm flex items-center gap-2 ${exhibit.material ? 'text-gray-600' : 'text-gray-400'}`}>
              <Layers size={14} className={exhibit.material ? 'text-primary-400' : 'text-gray-300'} />
              <span>{exhibit.material || '未填写材质'}</span>
            </p>
          </div>
          
          {exhibit.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {exhibit.tags.slice(0, 3).map((tag, i) => (
                <TagBadge key={tag} tag={tag} size="sm" color={i % 2 === 0 ? 'mint' : 'amber'} />
              ))}
              {exhibit.tags.length > 3 && (
                <span className="text-xs text-gray-400 self-center">+{exhibit.tags.length - 3}</span>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">未添加标签</p>
          )}
          
          {isPending && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onEdit?.(exhibit.id);
              }}
              className="mt-4 w-full py-2.5 rounded-xl bg-amber-50 text-amber-600 font-medium text-sm flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-colors"
            >
              <Edit3 size={14} />
              去完善信息
            </button>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

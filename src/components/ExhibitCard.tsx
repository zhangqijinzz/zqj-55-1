import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Layers } from 'lucide-react';
import TagBadge from './TagBadge';
import type { Exhibit } from '../types';

interface ExhibitCardProps {
  exhibit: Exhibit;
  index?: number;
  variant?: 'default' | 'compact' | 'route';
  showOrder?: boolean;
}

export default function ExhibitCard({ exhibit, index = 0, variant = 'default', showOrder = false }: ExhibitCardProps) {
  const colors = ['bg-mint-400', 'bg-coral-400', 'bg-sky-400', 'bg-lavender-400', 'bg-amber-300', 'bg-rose-300'];
  const bgColor = colors[index % colors.length];
  
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-2xl shadow-soft overflow-hidden border border-primary-100"
      >
        <Link to={`/collection/${exhibit.id}`} className="block">
          <div className={`aspect-square ${bgColor} flex items-center justify-center relative`}>
            {exhibit.image ? (
              <img
                src={exhibit.image}
                alt={exhibit.name}
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
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-gray-800 text-sm truncate">{exhibit.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Calendar size={10} />
              {exhibit.era}
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
        className="bg-white rounded-2xl shadow-card overflow-hidden border border-primary-100 paper-texture"
      >
        <Link to={`/collection/${exhibit.id}`} className="block">
          <div className="flex items-stretch">
            <div className={`w-24 flex-shrink-0 ${bgColor} flex items-center justify-center`}>
              {exhibit.image ? (
                <img
                  src={exhibit.image}
                  alt={exhibit.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl">🏺</span>
              )}
            </div>
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">{exhibit.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <Calendar size={12} />
                    {exhibit.era}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Layers size={10} />
                    {exhibit.material}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
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
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-primary-100 paper-texture"
    >
      <Link to={`/collection/${exhibit.id}`} className="block">
        <div className={`aspect-[4/3] ${bgColor} flex items-center justify-center relative overflow-hidden`}>
          {exhibit.image ? (
            <img
              src={exhibit.image}
              alt={exhibit.name}
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
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-800 mb-2">{exhibit.name}</h3>
          
          <div className="space-y-1.5 mb-4">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Calendar size={14} className="text-primary-400" />
              <span>{exhibit.era}</span>
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Layers size={14} className="text-primary-400" />
              <span>{exhibit.material}</span>
            </p>
          </div>
          
          {exhibit.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {exhibit.tags.slice(0, 3).map((tag, i) => (
                <TagBadge key={tag} tag={tag} size="sm" color={i % 2 === 0 ? 'mint' : 'amber'} />
              ))}
              {exhibit.tags.length > 3 && (
                <span className="text-xs text-gray-400 self-center">+{exhibit.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

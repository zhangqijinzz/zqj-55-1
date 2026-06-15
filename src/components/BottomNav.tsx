import { NavLink } from 'react-router-dom';
import { Home, Bookmark, LayoutGrid, Route, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/collection', icon: Bookmark, label: '展品' },
  { path: '/exhibitions', icon: LayoutGrid, label: '策展' },
  { path: '/route', icon: Route, label: '路线' },
  { path: '/challenge', icon: Trophy, label: '挑战' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-primary-100 z-50 safe-bottom">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-2xl transition-all duration-300 min-w-[60px] ${
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-400 hover:text-primary-400'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                className="flex flex-col items-center gap-0.5"
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

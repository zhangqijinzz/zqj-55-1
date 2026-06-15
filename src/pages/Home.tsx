import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bookmark,
  LayoutGrid,
  Route,
  Trophy,
  Sparkles,
  Calendar,
  Star,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useMuseumStore } from '../store/useMuseumStore';
import { inspirationThemes } from '../utils/mockData';
import ExhibitCard from '../components/ExhibitCard';
import { useEffect, useState } from 'react';

const quickLinks = [
  {
    path: '/collection',
    icon: Bookmark,
    label: '展品收藏',
    desc: '记录你喜欢的展品',
    gradient: 'from-mint-400 to-mint-600',
    bg: 'bg-mint-50',
    text: 'text-mint-600',
  },
  {
    path: '/exhibitions',
    icon: LayoutGrid,
    label: '主题策展',
    desc: '创建你的小展览',
    gradient: 'from-coral-400 to-coral-600',
    bg: 'bg-coral-50',
    text: 'text-coral-600',
  },
  {
    path: '/route',
    icon: Route,
    label: '路线拼图',
    desc: '回顾参观路线',
    gradient: 'from-sky-400 to-sky-600',
    bg: 'bg-sky-50',
    text: 'text-sky-600',
  },
  {
    path: '/challenge',
    icon: Trophy,
    label: '讲解挑战',
    desc: '来试试讲解吧',
    gradient: 'from-lavender-400 to-lavender-600',
    bg: 'bg-lavender-50',
    text: 'text-lavender-600',
  },
];

export default function Home() {
  const { exhibits, exhibitions, getVisitRecords, getTodayVisits, getChallengeStats } = useMuseumStore();
  const [dailyInspiration, setDailyInspiration] = useState('');
  const [greeting, setGreeting] = useState('');
  
  const visitRecords = getVisitRecords();
  const todayVisits = getTodayVisits();
  const challengeStats = getChallengeStats();
  
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    setDailyInspiration(inspirationThemes[dayOfYear % inspirationThemes.length]);
    
    const hour = today.getHours();
    if (hour < 12) setGreeting('早上好');
    else if (hour < 18) setGreeting('下午好');
    else setGreeting('晚上好');
  }, []);

  const recentExhibits = [...exhibits]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  const statItems = [
    { label: '收藏展品', value: exhibits.length, icon: Bookmark, color: 'text-mint-500', bg: 'bg-mint-100' },
    { label: '主题策展', value: exhibitions.length, icon: LayoutGrid, color: 'text-coral-500', bg: 'bg-coral-100' },
    { label: '参观天数', value: visitRecords.length, icon: Calendar, color: 'text-sky-500', bg: 'bg-sky-100' },
    { label: '挑战次数', value: challengeStats.total, icon: Star, color: 'text-lavender-500', bg: 'bg-lavender-100' },
  ];

  return (
    <div className="min-h-screen pb-28">
      {/* 顶部标题区 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 px-6 pb-8 pt-14 text-white relative overflow-hidden"
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute -bottom-20 -left-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute top-20 right-10 w-20 h-20 bg-white/5 rounded-full" />
        
        <div className="relative z-10">
          <p className="text-white/80 text-sm mb-1">{greeting}，小策展人 👋</p>
          <h1 className="text-3xl font-bold mb-1">博物馆小策展人</h1>
          <p className="text-white/70 text-sm">今天又发现了什么宝贝呀？</p>
        </div>
      </motion.div>

      {/* 数据概览卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-4 -mt-6 relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-card p-5 paper-texture">
          <div className="grid grid-cols-4 gap-2">
            {statItems.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-2`}>
                  <stat.icon size={22} className={stat.color} />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 快捷入口 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-4 mt-6"
      >
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-primary-500" />
          开始探索
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link to={link.path} className="block">
                <div className={`bg-gradient-to-br ${link.gradient} rounded-3xl p-5 text-white shadow-lg relative overflow-hidden`}>
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/20 rounded-full" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-3">
                      <link.icon size={24} />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{link.label}</h3>
                    <p className="text-xs text-white/80">{link.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 今日灵感 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-4 mt-6"
      >
        <div className="sticky-note sticky-note-yellow rounded-2xl p-5 rotate-[-1.5deg]">
          <div className="flex items-start justify-between mb-3">
            <span className="text-amber-800 font-bold handwrite text-lg">💡 今日灵感</span>
            <div className="w-6 h-6 rounded-full bg-amber-300/50 flex items-center justify-center">
              <span className="text-xs">✨</span>
            </div>
          </div>
          <p className="text-amber-900 text-base leading-relaxed handwrite">
            {dailyInspiration}
          </p>
          <Link
            to="/exhibitions/create"
            className="mt-4 inline-flex items-center gap-1 text-amber-700 text-sm font-medium hover:underline"
          >
            去创建主题 <ChevronRight size={16} />
          </Link>
        </div>
      </motion.div>

      {/* 今日参观 */}
      {todayVisits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="px-4 mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📍</span>
              今日参观
            </h2>
            <Link to="/route" className="text-primary-500 text-sm font-medium flex items-center gap-1">
              查看路线 <ChevronRight size={16} />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
            {todayVisits.map((exhibit, index) => (
              <div key={exhibit.id} className="flex-shrink-0 w-36">
                <ExhibitCard exhibit={exhibit} index={index} variant="compact" showOrder />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 最近收藏 */}
      {recentExhibits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="px-4 mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">🏺</span>
              最近收藏
            </h2>
            <Link to="/collection" className="text-primary-500 text-sm font-medium flex items-center gap-1">
              全部展品 <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentExhibits.map((exhibit, index) => (
              <ExhibitCard key={exhibit.id} exhibit={exhibit} index={index} variant="route" />
            ))}
          </div>
        </motion.div>
      )}

      {/* 添加按钮 */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 300 }}
        className="fixed bottom-24 right-5 z-40"
      >
        <Link
          to="/collection/add"
          className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all btn-bounce"
        >
          <Plus size={28} strokeWidth={2.5} />
        </Link>
      </motion.div>
    </div>
  );
}

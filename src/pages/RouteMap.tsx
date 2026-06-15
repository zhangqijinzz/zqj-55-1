import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Footprints,
  Star,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ExhibitCard from '../components/ExhibitCard';
import { useMuseumStore } from '../store/useMuseumStore';
import type { Exhibit } from '../types';

interface DayVisit {
  date: string;
  exhibits: Exhibit[];
  count: number;
}

export default function RouteMap() {
  const { exhibits, getVisitRecords } = useMuseumStore();
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  
  const visitRecords = getVisitRecords();
  
  const dayVisits: DayVisit[] = useMemo(() => {
    const dateMap = new Map<string, Exhibit[]>();
    
    exhibits.forEach(exhibit => {
      const list = dateMap.get(exhibit.visitDate) || [];
      list.push(exhibit);
      dateMap.set(exhibit.visitDate, list);
    });
    
    return Array.from(dateMap.entries())
      .map(([date, exs]) => ({
        date,
        exhibits: exs.sort((a, b) => a.visitOrder - b.visitOrder),
        count: exs.length,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [exhibits]);

  const totalVisits = exhibits.length;
  const totalDays = visitRecords.length;

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = d.toDateString() === today.toDateString();
    const isYesterday = d.toDateString() === yesterday.toDateString();
    
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[d.getDay()];
    
    if (isToday) return `今天 · ${month}月${day}日 ${weekday}`;
    if (isYesterday) return `昨天 · ${month}月${day}日 ${weekday}`;
    return `${month}月${day}日 ${weekday}`;
  };

  if (exhibits.length === 0) {
    return (
      <div className="min-h-screen pb-28">
        <PageHeader
          title="我的参观路线"
          subtitle="记录你的博物馆足迹"
          variant="sky"
        />
        <div className="px-4">
          <div className="text-center py-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-7xl mb-6"
            >
              🗺️
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">还没有参观记录</h3>
            <p className="text-gray-500 mb-6">
              开始记录你的博物馆之旅吧！
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      <PageHeader
        title="我的参观路线"
        subtitle={`共参观 ${totalVisits} 件展品 · ${totalDays} 天`}
        variant="sky"
      />

      {/* 数据概览 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 -mt-4 relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-card p-5 flex justify-around">
          <div className="text-center">
            <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Footprints size={22} className="text-sky-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{totalVisits}</p>
            <p className="text-xs text-gray-500">总展品</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-coral-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Calendar size={22} className="text-coral-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{totalDays}</p>
            <p className="text-xs text-gray-500">参观天数</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Star size={22} className="text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {Math.max(...dayVisits.map(d => d.count), 0)}
            </p>
            <p className="text-xs text-gray-500">单日最多</p>
          </div>
        </div>
      </motion.div>

      {/* 时间轴路线 */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-sky-500" />
          参观足迹
        </h2>
        
        <div className="space-y-6">
          {dayVisits.map((day, dayIndex) => {
            const isExpanded = expandedDate === day.date || dayIndex === 0;
            const bgColors = ['bg-mint-400', 'bg-coral-400', 'bg-sky-400', 'bg-lavender-400', 'bg-amber-300'];
            
            return (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: dayIndex * 0.1 }}
                className="relative"
              >
                {/* 日期标题 */}
                <button
                  onClick={() => setExpandedDate(isExpanded ? null : day.date)}
                  className="w-full flex items-center gap-3 mb-3"
                >
                  <div className="w-3 h-3 rounded-full bg-sky-400 shadow-lg ring-4 ring-sky-100" />
                  <div className="flex-1 text-left">
                    <span className="font-semibold text-gray-800">
                      {formatDateLabel(day.date)}
                    </span>
                    <span className="text-sm text-gray-400 ml-2">
                      {day.count} 件展品
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400" />
                  )}
                </button>
                
                {/* 时间轴连线 */}
                {isExpanded && (
                  <div className="absolute left-[5px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-sky-300 to-transparent" />
                )}
                
                {/* 展品列表 */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-8"
                    >
                      <div className="space-y-4 pb-2">
                        {day.exhibits.map((exhibit, index) => (
                          <motion.div
                            key={exhibit.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                          >
                            {/* 时间轴节点 */}
                            <div className={`absolute -left-5 top-5 w-4 h-4 rounded-full ${bgColors[(dayIndex + index) % bgColors.length]} border-2 border-white shadow`} />
                            
                            <ExhibitCard
                              exhibit={exhibit}
                              index={0}
                              variant="route"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 拼图地图示意 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-4 mt-8 mb-8"
      >
        <div className="bg-white rounded-3xl shadow-card p-5 overflow-hidden">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">🧩</span>
            参观拼图
          </h3>
          
          <div className="grid grid-cols-6 gap-1.5">
            {Array.from({ length: Math.min(24, totalVisits) }).map((_, index) => {
              const exhibitIndex = index % exhibits.length;
              const exhibit = exhibits[exhibitIndex];
              const colors = ['bg-mint-200', 'bg-coral-200', 'bg-sky-200', 'bg-lavender-200', 'bg-amber-200', 'bg-rose-200'];
              
              return (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4 + index * 0.05, type: 'spring', stiffness: 300 }}
                  className={`aspect-square rounded-lg ${colors[index % colors.length]} flex items-center justify-center text-sm relative`}
                >
                  <span className="text-lg">{index + 1}</span>
                  {exhibit && (
                    <span className="absolute -top-1 -right-1 text-xs">
                      🏺
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          <p className="text-center text-sm text-gray-400 mt-4">
            继续参观，填满你的博物馆拼图吧！🎨
          </p>
        </div>
      </motion.div>
    </div>
  );
}

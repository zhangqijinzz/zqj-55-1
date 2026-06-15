import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Star, Flame, Award, ChevronRight, Zap } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useMuseumStore } from '../store/useMuseumStore';

const levels = [
  {
    id: 'beginner',
    name: '新手讲解员',
    desc: '讲述 3 件展品',
    count: 3,
    time: 90,
    color: 'from-mint-400 to-mint-600',
    bg: 'bg-mint-50',
    text: 'text-mint-600',
    icon: '🌱',
    stars: 1,
  },
  {
    id: 'intermediate',
    name: '小讲解员',
    desc: '讲述 5 件展品',
    count: 5,
    time: 150,
    color: 'from-sky-400 to-sky-600',
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    icon: '🎤',
    stars: 2,
  },
  {
    id: 'expert',
    name: '策展大师',
    desc: '讲述 8 件展品',
    count: 8,
    time: 240,
    color: 'from-lavender-400 to-lavender-600',
    bg: 'bg-lavender-50',
    text: 'text-lavender-600',
    icon: '👑',
    stars: 3,
  },
];

export default function ChallengeHome() {
  const navigate = useNavigate();
  const { exhibits, challengeRecords, getChallengeStats } = useMuseumStore();
  
  const stats = getChallengeStats();
  const exhibitCount = exhibits.length;

  const startChallenge = (levelId: string, count: number, time: number) => {
    if (exhibitCount < 3) {
      alert('展品太少啦，先去收藏至少 3 件展品再来挑战吧！');
      return;
    }
    navigate(`/challenge/play?level=${levelId}&count=${Math.min(count, exhibitCount)}&time=${time}`);
  };

  return (
    <div className="min-h-screen pb-28">
      <PageHeader
        title="讲解挑战"
        subtitle="来试试当一名小讲解员吧"
        variant="lavender"
      />

      {/* 成就概览 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 -mt-4 relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-card p-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Trophy size={22} className="text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-xs text-gray-500">完成挑战</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Flame size={22} className="text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.streak}</p>
              <p className="text-xs text-gray-500">连续打卡</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Star size={22} className="text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{exhibitCount}</p>
              <p className="text-xs text-gray-500">可讲展品</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 挑战说明 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-4 mt-6"
      >
        <div className="sticky-note sticky-note-yellow rounded-2xl p-5 rotate-[-0.5deg]">
          <p className="text-amber-900 font-bold handwrite text-lg mb-2">🎯 挑战玩法</p>
          <ol className="text-amber-800 text-sm space-y-1 handwrite">
            <li>1. 系统随机抽取展品</li>
            <li>2. 看着提示讲述展品</li>
            <li>3. 讲完一件点"下一件"</li>
            <li>4. 全部讲完挑战成功！</li>
          </ol>
        </div>
      </motion.div>

      {/* 难度选择 */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Zap size={18} className="text-lavender-500" />
          选择难度
        </h2>
        
        <div className="space-y-3">
          {levels.map((level, index) => {
            const canPlay = exhibitCount >= 3;
            const actualCount = Math.min(level.count, exhibitCount);
            
            return (
              <motion.button
                key={level.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => startChallenge(level.id, level.count, level.time)}
                disabled={!canPlay}
                className={`w-full text-left ${canPlay ? '' : 'opacity-50 cursor-not-allowed'}`}
              >
                <div className={`bg-gradient-to-r ${level.color} rounded-3xl p-5 text-white shadow-lg relative overflow-hidden`}>
                  {/* 装饰 */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full" />
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full" />
                  
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl">
                      {level.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{level.name}</h3>
                        <div className="flex gap-0.5">
                          {Array.from({ length: level.stars }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className="text-yellow-300 fill-yellow-300"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-white/80 text-sm">
                        讲述 {actualCount} 件展品 · {Math.floor(level.time / 60)}分{level.time % 60}秒
                      </p>
                    </div>
                    
                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                      <ChevronRight size={22} />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 成就徽章 */}
      {challengeRecords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="px-4 mt-8"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award size={18} className="text-amber-500" />
            挑战记录
          </h2>
          
          <div className="bg-white rounded-3xl shadow-soft p-4">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {challengeRecords.slice(0, 10).reverse().map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex-shrink-0 w-24 p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl text-center border border-amber-100"
                >
                  <div className="text-3xl mb-2">🏆</div>
                  <p className="text-xs font-medium text-amber-800">
                    {record.exhibitCount} 件
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    {Math.floor(record.timeSpent / 60)}分{record.timeSpent % 60}秒
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

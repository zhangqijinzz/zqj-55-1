import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ChevronRight,
  X,
  Trophy,
  Lightbulb,
  Play,
  Pause,
  RotateCcw,
  Star,
  Sparkles,
} from 'lucide-react';
import { useMuseumStore } from '../store/useMuseumStore';
import { challengeTips } from '../utils/mockData';
import { randomPick } from '../utils/storage';
import type { Exhibit } from '../types';

export default function ChallengePlay() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { exhibits, addChallengeRecord } = useMuseumStore();
  
  const level = searchParams.get('level') || 'beginner';
  const count = parseInt(searchParams.get('count') || '3', 10);
  const totalTime = parseInt(searchParams.get('time') || '90', 10);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  const randomExhibits = useMemo(() => {
    return randomPick(exhibits, count);
  }, [exhibits, count]);
  
  const currentExhibit: Exhibit | undefined = randomExhibits[currentIndex];
  
  const currentTips = useMemo(() => {
    if (!currentExhibit) return [];
    return randomPick(challengeTips, 4);
  }, [currentExhibit]);
  
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startChallenge = () => {
    setIsRunning(true);
    setStartTime(Date.now());
  };

  const togglePause = () => {
    setIsRunning(!isRunning);
  };

  const nextExhibit = () => {
    if (currentIndex < randomExhibits.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishChallenge();
    }
  };

  const finishChallenge = () => {
    setIsRunning(false);
    setIsFinished(true);
    
    const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : totalTime - timeLeft;
    
    addChallengeRecord({
      level: level as 'beginner' | 'intermediate' | 'expert',
      exhibitCount: randomExhibits.length,
      timeSpent,
      exhibitIds: randomExhibits.map(e => e.id),
    });
  };

  const restartChallenge = () => {
    setCurrentIndex(0);
    setTimeLeft(totalTime);
    setIsRunning(false);
    setIsFinished(false);
    setStartTime(null);
    setShowTips(false);
  };

  const progress = ((currentIndex + 1) / randomExhibits.length) * 100;

  if (randomExhibits.length === 0) {
    return (
      <div className="min-h-screen bg-lavender-500 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl mb-4">展品不足，无法开始挑战</p>
          <button
            onClick={() => navigate('/challenge')}
            className="px-6 py-3 bg-white/20 rounded-full"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-500 via-lavender-400 to-lavender-600 text-white">
      {/* 顶部栏 */}
      <div className="pt-12 px-4 pb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/challenge')}
          className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center"
        >
          <X size={20} />
        </button>
        
        <div className="text-center">
          <p className="text-white/70 text-xs">讲解挑战</p>
          <p className="font-bold">
            {currentIndex + 1} / {randomExhibits.length}
          </p>
        </div>
        
        <div className="flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full">
          <Clock size={16} />
          <span className="font-mono font-bold text-sm">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* 进度条 */}
      <div className="px-6 mb-4">
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* 开始前覆盖层 */}
      <AnimatePresence>
        {!startTime && !isFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center"
            >
              <div className="text-6xl mb-4">🎤</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">准备好了吗？</h3>
              <p className="text-gray-500 mb-6">
                共 {randomExhibits.length} 件展品<br />
                限时 {Math.floor(totalTime / 60)} 分 {totalTime % 60} 秒
              </p>
              <button
                onClick={startChallenge}
                className="w-full py-4 bg-gradient-to-r from-lavender-400 to-lavender-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all btn-bounce flex items-center justify-center gap-2"
              >
                <Play size={22} fill="currentColor" />
                开始挑战
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 完成弹窗 */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center"
            >
              {/* 庆祝动画 */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                className="text-7xl mb-4"
              >
                🏆
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-1">挑战成功！</h3>
              <p className="text-gray-500 mb-6">太棒了，你完成了讲解挑战！</p>
              
              {/* 统计 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-lavender-50 rounded-2xl p-4">
                  <p className="text-3xl font-bold text-lavender-600">{randomExhibits.length}</p>
                  <p className="text-sm text-gray-500">展品数量</p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4">
                  <p className="text-3xl font-bold text-amber-500">
                    {formatTime(startTime ? Math.floor((Date.now() - startTime) / 1000) : totalTime - timeLeft)}
                  </p>
                  <p className="text-sm text-gray-500">用时</p>
                </div>
              </div>
              
              {/* 星星 */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3].map((star, i) => (
                  <motion.div
                    key={star}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 400 }}
                  >
                    <Star size={36} className="text-amber-400 fill-amber-400" />
                  </motion.div>
                ))}
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={restartChallenge}
                  className="w-full py-3 bg-lavender-500 text-white rounded-2xl font-medium hover:bg-lavender-600 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} />
                  再来一次
                </button>
                <button
                  onClick={() => navigate('/challenge')}
                  className="w-full py-3 bg-gray-100 text-gray-600 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
                >
                  返回挑战首页
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主要内容 */}
      {currentExhibit && (
        <div className="px-6 pt-4">
          {/* 展品卡片 */}
          <motion.div
            key={currentExhibit.id}
            initial={{ opacity: 0, x: 100, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -100, rotateY: -15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6"
          >
            {/* 展品图 */}
            <div className="aspect-[4/3] bg-gradient-to-br from-mint-200 to-sky-200 flex items-center justify-center relative">
              {currentExhibit.image ? (
                <img
                  src={currentExhibit.image}
                  alt={currentExhibit.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl animate-float">🏺</span>
              )}
              
              {/* 聚光灯效果 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
            </div>
            
            {/* 展品信息 */}
            <div className="p-6 text-gray-800">
              <h2 className="text-2xl font-bold mb-2">{currentExhibit.name}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>🗓️ {currentExhibit.era}</span>
                <span>🔧 {currentExhibit.material}</span>
              </div>
            </div>
          </motion.div>

          {/* 提示区域 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden">
            <button
              onClick={() => setShowTips(!showTips)}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400/30 rounded-full flex items-center justify-center">
                  <Lightbulb size={20} className="text-amber-200" />
                </div>
                <span className="font-medium">讲述提示</span>
              </div>
              <ChevronRight
                size={20}
                className={`transition-transform ${showTips ? 'rotate-90' : ''}`}
              />
            </button>
            
            <AnimatePresence>
              {showTips && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2">
                    {currentTips.map((tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 rounded-xl p-3 text-sm flex items-start gap-2"
                      >
                        <span className="text-amber-300">💡</span>
                        <span className="text-white/90">{tip}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 标签提示 */}
          {currentExhibit.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <p className="text-white/60 text-sm mb-2 flex items-center gap-1">
                <Sparkles size={14} />
                关键词
              </p>
              <div className="flex flex-wrap gap-2">
                {currentExhibit.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 safe-bottom bg-gradient-to-t from-lavender-600 via-lavender-600/80 to-transparent">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={togglePause}
            disabled={!startTime || isFinished}
            className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center disabled:opacity-50"
          >
            {isRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          
          <button
            onClick={nextExhibit}
            disabled={!startTime || isFinished}
            className="flex-1 py-4 bg-white text-lavender-600 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all btn-bounce flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {currentIndex < randomExhibits.length - 1 ? (
              <>
                下一件
                <ChevronRight size={22} />
              </>
            ) : (
              <>
                完成挑战
                <Trophy size={22} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

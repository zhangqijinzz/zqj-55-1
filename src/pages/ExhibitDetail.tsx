import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Layers,
  Tag,
  Edit2,
  Trash2,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Clock,
} from 'lucide-react';
import { useMuseumStore } from '../store/useMuseumStore';
import TagBadge from '../components/TagBadge';
import type { Exhibit } from '../types';

export default function ExhibitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getExhibitById, exhibits, deleteExhibit } = useMuseumStore();
  const [exhibit, setExhibit] = useState<Exhibit | undefined>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const bgColors = ['bg-mint-400', 'bg-coral-400', 'bg-sky-400', 'bg-lavender-400', 'bg-amber-300'];
  
  useEffect(() => {
    if (id) {
      setExhibit(getExhibitById(id));
    }
  }, [id, getExhibitById]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDeleteModal) {
        setShowDeleteModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDeleteModal]);
  
  const exhibitIndex = exhibits.findIndex(e => e.id === id);
  const prevExhibit = exhibitIndex > 0 ? exhibits[exhibitIndex - 1] : null;
  const nextExhibit = exhibitIndex < exhibits.length - 1 ? exhibits[exhibitIndex + 1] : null;
  const bgColor = bgColors[exhibitIndex % bgColors.length];

  const handleDelete = () => {
    if (id) {
      deleteExhibit(id);
      navigate('/collection');
    }
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  if (!exhibit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">展品不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* 顶部大图区域 */}
      <div className={`relative ${bgColor} min-h-[300px]`}>
        {/* 装饰圆形 */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full" />
        
        {/* 返回按钮 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-4 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white z-10"
        >
          <ArrowLeft size={22} />
        </button>
        
        {/* 编辑和删除按钮 */}
        <div className="absolute top-12 right-4 flex gap-2 z-10">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        {/* 展品图片/图标 */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="absolute inset-0 flex items-center justify-center pt-10"
        >
          {exhibit.image ? (
            <img
              src={exhibit.image}
              alt={exhibit.name}
              className="w-48 h-48 object-cover rounded-3xl shadow-2xl"
            />
          ) : (
            <div className="text-8xl animate-float">🏺</div>
          )}
        </motion.div>
        
        {/* 参观顺序徽章 */}
        <div className="absolute bottom-4 right-6 bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-medium flex items-center gap-1.5">
          <MapPin size={14} />
          第 {exhibit.visitOrder} 件
        </div>
      </div>

      {/* 内容区域 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-cream-50 rounded-t-[2rem] -mt-6 relative z-20 min-h-screen pb-10"
      >
        <div className="px-6 pt-6">
          {/* 标题 */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{exhibit.name}</h1>
          
          {/* 基本信息卡片 */}
          <div className="bg-white rounded-2xl p-5 shadow-soft mt-5 paper-texture">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-mint-100 rounded-xl flex items-center justify-center">
                  <Calendar size={18} className="text-mint-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">年代</p>
                  <p className="font-semibold text-gray-700">{exhibit.era}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-coral-100 rounded-xl flex items-center justify-center">
                  <Layers size={18} className="text-coral-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">材质</p>
                  <p className="font-semibold text-gray-700">{exhibit.material}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 印象标签 */}
          <div className="mt-5">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Tag size={16} className="text-primary-500" />
              印象标签
            </h3>
            {exhibit.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {exhibit.tags.map((tag, i) => (
                  <TagBadge
                    key={tag}
                    tag={tag}
                    size="md"
                    color={['mint', 'coral', 'sky', 'lavender', 'amber'][i % 5] as 'mint' | 'coral' | 'sky' | 'lavender' | 'amber'}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">还没有添加标签</p>
            )}
          </div>

          {/* 参观信息 */}
          <div className="mt-5 bg-white rounded-2xl p-5 shadow-soft">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Clock size={16} className="text-sky-500" />
              参观信息
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📅 参观日期：{exhibit.visitDate}</p>
              <p>🎯 参观顺序：第 {exhibit.visitOrder} 件展品</p>
              <p>📝 收录时间：{formatDate(exhibit.createdAt)}</p>
            </div>
          </div>

          {/* 我的感想 */}
          <div className="mt-5">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-lg">📝</span>
              我的感想
            </h3>
            {exhibit.notes ? (
              <div className="sticky-note sticky-note-yellow rounded-2xl p-5 rotate-[-0.5deg]">
                <p className="text-amber-900 leading-relaxed handwrite">
                  {exhibit.notes}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-5 text-center">
                <p className="text-gray-400 text-sm">还没有记录感想</p>
                <Link
                  to="#"
                  className="mt-2 text-primary-500 text-sm font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(-1);
                  }}
                >
                  返回编辑
                </Link>
              </div>
            )}
          </div>

          {/* 上下页导航 */}
          {(prevExhibit || nextExhibit) && (
            <div className="mt-8 flex gap-3">
              {prevExhibit ? (
                <Link
                  to={`/collection/${prevExhibit.id}`}
                  className="flex-1 bg-white rounded-2xl p-4 shadow-soft flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft size={18} className="text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">上一件</p>
                    <p className="text-sm font-medium text-gray-700 truncate">{prevExhibit.name}</p>
                  </div>
                </Link>
              ) : <div className="flex-1" />}
              
              {nextExhibit ? (
                <Link
                  to={`/collection/${nextExhibit.id}`}
                  className="flex-1 bg-white rounded-2xl p-4 shadow-soft flex items-center gap-3 justify-end hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-xs text-gray-400">下一件</p>
                    <p className="text-sm font-medium text-gray-700 truncate">{nextExhibit.name}</p>
                  </div>
                  <ArrowRight size={18} className="text-gray-400" />
                </Link>
              ) : <div className="flex-1" />}
            </div>
          )}
        </div>
      </motion.div>

      {/* 删除确认弹窗 */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={28} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">确认删除？</h3>
                <p className="text-gray-500 text-sm mb-6">
                  删除后无法恢复，确定要删除这件展品吗？
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-medium hover:bg-red-600 transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

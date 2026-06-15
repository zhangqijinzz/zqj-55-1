import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  Trash2,
  Share2,
  Search,
  Check,
  ChevronDown,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ExhibitCard from '../components/ExhibitCard';
import { useMuseumStore } from '../store/useMuseumStore';
import type { Exhibition, Exhibit } from '../types';

export default function ExhibitionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getExhibitionById,
    addExhibitToExhibition,
    removeExhibitFromExhibition,
    deleteExhibition,
    exhibits,
  } = useMuseumStore();
  
  const [exhibition, setExhibition] = useState<Exhibition | undefined>();
  const [exhibitList, setExhibitList] = useState<Exhibit[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      const ex = getExhibitionById(id);
      setExhibition(ex);
      if (ex) {
        const list = ex.exhibitIds
          .map(eid => exhibits.find(e => e.id === eid))
          .filter(Boolean) as Exhibit[];
        setExhibitList(list);
      }
    }
  }, [id, getExhibitionById, exhibits]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showDeleteModal) {
          setShowDeleteModal(false);
        }
        if (showAddModal) {
          setShowAddModal(false);
          setSelectedIds([]);
          setSearchQuery('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDeleteModal, showAddModal]);

  const availableExhibits = exhibits.filter(e => {
    const isInExhibition = exhibition?.exhibitIds.includes(e.id);
    const matchesSearch = searchQuery
      ? e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return !isInExhibition && matchesSearch;
  });

  const handleAddSelected = () => {
    if (id && selectedIds.length > 0) {
      selectedIds.forEach(exhibitId => {
        addExhibitToExhibition(id, exhibitId);
      });
      setSelectedIds([]);
      setShowAddModal(false);
    }
  };

  const handleRemoveExhibit = (exhibitId: string) => {
    if (id) {
      removeExhibitFromExhibition(id, exhibitId);
    }
  };

  const handleDelete = () => {
    if (id) {
      deleteExhibition(id);
      navigate('/exhibitions');
    }
  };

  const toggleSelect = (exhibitId: string) => {
    setSelectedIds(prev =>
      prev.includes(exhibitId)
        ? prev.filter(id => id !== exhibitId)
        : [...prev, exhibitId]
    );
  };

  if (!exhibition) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">主题不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 bg-cream-50">
      {/* 顶部封面 */}
      <div
        className="relative min-h-[240px] text-white overflow-hidden"
        style={{ backgroundColor: exhibition.coverColor }}
      >
        {/* 装饰 */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/15 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute top-32 right-12 w-20 h-20 bg-white/5 rounded-full" />
        
        {/* 返回和操作按钮 */}
        <div className="relative z-10 pt-12 px-4 flex justify-between items-start">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center"
          >
            <ChevronDown size={22} style={{ transform: 'rotate(90deg)' }} />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center"
            >
              <Trash2 size={18} />
            </button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <Share2 size={18} />
            </button>
          </div>
        </div>
        
        {/* 主题信息 */}
        <div className="relative z-10 px-6 pb-8 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-white/80 text-sm mb-1">主题展览</p>
            <h1 className="text-3xl font-bold mb-2 drop-shadow-sm">{exhibition.name}</h1>
            <p className="text-white/70 text-sm">
              {exhibitList.length} 件展品 · {exhibition.description || '点击查看全部展品'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* 内容区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-cream-50 rounded-t-[2rem] -mt-6 relative z-20"
      >
        <div className="px-4 pt-6">
          {exhibitList.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🎨</div>
              <p className="text-gray-500 mb-2">还没有展品</p>
              <p className="text-sm text-gray-400 mb-6">
                点击下方按钮添加展品到这个主题
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-coral-500 text-white rounded-full font-medium hover:bg-coral-600 transition-colors"
              >
                <Plus size={18} />
                添加展品
              </button>
            </div>
          ) : (
              <>
                {/* 添加按钮 */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-coral-100 text-coral-600 rounded-full text-sm font-medium hover:bg-coral-200 transition-colors"
                  >
                    <Plus size={16} />
                    添加展品
                  </button>
                </div>
                
                {/* 展品网格 */}
                <div className="grid grid-cols-2 gap-3 pb-4">
                  {exhibitList.map((exhibit, index) => (
                    <div key={exhibit.id} className="relative">
                      <ExhibitCard
                        exhibit={exhibit}
                        index={index}
                        variant="compact"
                      />
                      <button
                        onClick={() => handleRemoveExhibit(exhibit.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors z-10"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
      </motion.div>

      {/* 添加展品弹窗 */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
            onClick={() => {
              setShowAddModal(false);
              setSelectedIds([]);
              setSearchQuery('');
            }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-[2rem] max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 弹窗头部 */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">添加展品</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedIds([]);
                    setSearchQuery('');
                  }}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              
              {/* 搜索 */}
              <div className="px-5 py-3 border-b border-gray-100">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索展品..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral-400/30"
                  />
                </div>
              </div>
              
              {/* 展品列表 */}
              <div className="flex-1 overflow-y-auto p-4">
                {availableExhibits.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">🏺</div>
                    <p className="text-gray-500 text-sm">
                      {searchQuery ? '没有找到匹配的展品' : '所有展品都已添加啦'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableExhibits.map((exhibit) => (
                      <motion.div
                        key={exhibit.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedIds.includes(exhibit.id)
                            ? 'border-coral-400 bg-coral-50'
                            : 'border-transparent bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => toggleSelect(exhibit.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-mint-200 rounded-xl flex items-center justify-center text-2xl">
                            🏺
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">{exhibit.name}</p>
                            <p className="text-xs text-gray-500">{exhibit.era} · {exhibit.material}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            selectedIds.includes(exhibit.id)
                              ? 'bg-coral-500 text-white'
                              : 'bg-gray-200 text-transparent'
                          }`}>
                            <Check size={14} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 底部确认按钮 */}
              <div className="p-4 border-t border-gray-100 safe-bottom">
                <button
                  onClick={handleAddSelected}
                  disabled={selectedIds.length === 0}
                  className={`w-full py-3.5 rounded-2xl font-bold transition-all ${
                    selectedIds.length > 0
                      ? 'bg-coral-500 text-white hover:bg-coral-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  添加 {selectedIds.length > 0 ? `(${selectedIds.length})` : ''} 件展品
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <h3 className="text-lg font-bold text-gray-800 mb-2">删除主题？</h3>
                <p className="text-gray-500 text-sm mb-6">
                  删除后无法恢复，确定要删除这个主题展览吗？
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

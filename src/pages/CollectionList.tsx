import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, X, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ExhibitCard from '../components/ExhibitCard';
import TagBadge from '../components/TagBadge';
import { useMuseumStore } from '../store/useMuseumStore';
import { allTags } from '../utils/mockData';
import type { ExhibitStatus } from '../types';

type StatusFilter = 'all' | ExhibitStatus;

export default function CollectionList() {
  const navigate = useNavigate();
  const { exhibits, getAllTags, getPendingExhibitsCount } = useMuseumStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [showFilter, setShowFilter] = useState(false);
  
  const allTagsList = getAllTags();
  const displayTags = allTagsList.length > 0 ? allTagsList : allTags.slice(0, 10);
  const pendingCount = getPendingExhibitsCount();
  const completeCount = exhibits.length - pendingCount;

  const filteredExhibits = useMemo(() => {
    let result = [...exhibits];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.era.toLowerCase().includes(query) ||
        e.material.toLowerCase().includes(query) ||
        e.tags.some(t => t.toLowerCase().includes(query))
      );
    }
    
    if (selectedStatus !== 'all') {
      result = result.filter(e => e.status === selectedStatus);
    }
    
    if (selectedTag) {
      result = result.filter(e => e.tags.includes(selectedTag));
    }
    
    return result.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'pending' ? -1 : 1;
      }
      return b.createdAt - a.createdAt;
    });
  }, [exhibits, searchQuery, selectedTag, selectedStatus]);

  const handleEditExhibit = (id: string) => {
    navigate(`/collection/${id}/edit`);
  };

  return (
    <div className="min-h-screen pb-28">
      <PageHeader
        title="我的展品收藏"
        subtitle={`共收藏 ${exhibits.length} 件展品`}
        variant="mint"
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 mt-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => setSelectedStatus(selectedStatus === 'pending' ? 'all' : 'pending')}
            className={`cursor-pointer rounded-2xl p-4 transition-all ${
              selectedStatus === 'pending'
                ? 'bg-amber-400 text-white shadow-lg'
                : 'bg-white border border-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle
                size={18}
                className={selectedStatus === 'pending' ? 'text-white' : 'text-amber-500'}
              />
              <span className={`text-sm font-medium ${
                selectedStatus === 'pending' ? 'text-white' : 'text-gray-700'
              }`}>
                待完善
              </span>
            </div>
            <div className={`text-2xl font-bold ${
              selectedStatus === 'pending' ? 'text-white' : 'text-amber-600'
            }`}>
              {pendingCount}
            </div>
          </div>
          <div
            onClick={() => setSelectedStatus(selectedStatus === 'complete' ? 'all' : 'complete')}
            className={`cursor-pointer rounded-2xl p-4 transition-all ${
              selectedStatus === 'complete'
                ? 'bg-mint-500 text-white shadow-lg'
                : 'bg-white border border-mint-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2
                size={18}
                className={selectedStatus === 'complete' ? 'text-white' : 'text-mint-500'}
              />
              <span className={`text-sm font-medium ${
                selectedStatus === 'complete' ? 'text-white' : 'text-gray-700'
              }`}>
                已完善
              </span>
            </div>
            <div className={`text-2xl font-bold ${
              selectedStatus === 'complete' ? 'text-white' : 'text-mint-600'
            }`}>
              {completeCount}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-4 mt-4"
      >
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索展品名称、年代..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-primary-100 focus:outline-none focus:border-mint-400 focus:ring-2 focus:ring-mint-400/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              selectedTag || selectedStatus !== 'all'
                ? 'bg-mint-500 text-white'
                : 'bg-white border border-primary-100 text-gray-500'
            }`}
          >
            <Filter size={20} />
          </button>
        </div>
      </motion.div>

      <div className="px-4 mt-3 flex flex-wrap gap-2">
        {selectedStatus !== 'all' && (
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${
              selectedStatus === 'pending'
                ? 'bg-amber-100 text-amber-600'
                : 'bg-mint-100 text-mint-600'
            }`}
          >
            {selectedStatus === 'pending' ? (
              <><AlertCircle size={12} /> 只看待完善</>
            ) : (
              <><CheckCircle2 size={12} /> 只看已完善</>
            )}
            <X size={12} className="ml-1" />
          </button>
        )}
        {selectedTag && (
          <TagBadge
            tag={selectedTag}
            color="mint"
            onRemove={() => setSelectedTag(null)}
          />
        )}
      </div>

      {showFilter && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 mt-3 overflow-hidden"
        >
          <div className="bg-white rounded-2xl p-4 border border-primary-100 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">按完善状态</p>
              <div className="flex gap-2">
                {(['all', 'pending', 'complete'] as StatusFilter[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedStatus === status
                        ? status === 'pending'
                          ? 'bg-amber-400 text-white'
                          : status === 'complete'
                          ? 'bg-mint-500 text-white'
                          : 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? '全部' : status === 'pending' ? `待完善(${pendingCount})` : `已完善(${completeCount})`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">按标签筛选</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    !selectedTag
                      ? 'bg-mint-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  全部标签
                </button>
                {displayTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedTag === tag
                        ? 'bg-mint-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="px-4 mt-6">
        {filteredExhibits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">
              {pendingCount > 0 && selectedStatus === 'complete' ? '✅' :
               completeCount > 0 && selectedStatus === 'pending' ? '📝' : '🏺'}
            </div>
            <p className="text-gray-500 mb-2">
              {exhibits.length === 0 ? '还没有收藏展品' : '没有找到匹配的展品'}
            </p>
            <p className="text-sm text-gray-400 mb-6">
              {exhibits.length === 0
                ? '点击右下角按钮开始收藏吧！'
                : searchQuery || selectedTag || selectedStatus !== 'all'
                ? '试试调整筛选条件'
                : '开始记录你的博物馆之旅'}
            </p>
            {exhibits.length === 0 && (
              <div className="flex flex-col items-center gap-3">
                <Link
                  to="/collection/add"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-mint-500 text-white rounded-full font-medium hover:bg-mint-600 transition-colors"
                >
                  <Plus size={18} />
                  添加第一件展品
                </Link>
              </div>
            )}
          </motion.div>
        ) : (
          <>
            {pendingCount > 0 && selectedStatus === 'all' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800 mb-1">
                    有 {pendingCount} 件展品待完善
                  </p>
                  <p className="text-xs text-amber-700">
                    快速记录的展品已按优先级排列在上方，记得补充完整信息哦！
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStatus('pending')}
                  className="text-xs bg-amber-400 text-white px-3 py-1.5 rounded-full font-medium hover:bg-amber-500 transition-colors"
                >
                  去查看
                </button>
              </div>
            )}
            
            <div className="space-y-4">
              {filteredExhibits.map((exhibit, index) => (
                <ExhibitCard
                  key={exhibit.id}
                  exhibit={exhibit}
                  index={index}
                  variant="route"
                  showOrder
                  onEdit={handleEditExhibit}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-24 right-5 z-40 flex flex-col gap-3 items-end"
      >
        <button
          onClick={() => navigate('/collection/add', { state: { quickMode: true } })}
          className="group relative w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all btn-bounce"
        >
          <Zap size={28} strokeWidth={2.5} />
          <div className="absolute right-full mr-3 whitespace-nowrap bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            快速记录（拍照暂存）
          </div>
        </button>
        <Link
          to="/collection/add"
          className="group relative w-14 h-14 bg-gradient-to-br from-mint-400 to-mint-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all btn-bounce"
        >
          <Plus size={28} strokeWidth={2.5} />
          <div className="absolute right-full mr-3 whitespace-nowrap bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            完整记录
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

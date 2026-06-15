import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, X } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ExhibitCard from '../components/ExhibitCard';
import TagBadge from '../components/TagBadge';
import { useMuseumStore } from '../store/useMuseumStore';
import { allTags } from '../utils/mockData';

export default function CollectionList() {
  const { exhibits, getAllTags } = useMuseumStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  
  const allTagsList = getAllTags();
  const displayTags = allTagsList.length > 0 ? allTagsList : allTags.slice(0, 10);

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
    
    if (selectedTag) {
      result = result.filter(e => e.tags.includes(selectedTag));
    }
    
    return result.sort((a, b) => b.createdAt - a.createdAt);
  }, [exhibits, searchQuery, selectedTag]);

  return (
    <div className="min-h-screen pb-28">
      <PageHeader
        title="我的展品收藏"
        subtitle={`共收藏 ${exhibits.length} 件展品`}
        variant="mint"
      />

      {/* 搜索和筛选 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
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
              selectedTag
                ? 'bg-mint-500 text-white'
                : 'bg-white border border-primary-100 text-gray-500'
            }`}
          >
            <Filter size={20} />
          </button>
        </div>
      </motion.div>

      {/* 标签筛选 */}
      {showFilter && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 mt-3 overflow-hidden"
        >
          <div className="bg-white rounded-2xl p-4 border border-primary-100">
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
                全部
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
        </motion.div>
      )}

      {/* 选中标签提示 */}
      {selectedTag && (
        <div className="px-4 mt-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">当前筛选：</span>
            <TagBadge tag={selectedTag} color="mint" onRemove={() => setSelectedTag(null)} />
          </div>
        </div>
      )}

      {/* 展品列表 */}
      <div className="px-4 mt-6">
        {filteredExhibits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🏺</div>
            <p className="text-gray-500 mb-2">还没有收藏展品</p>
            <p className="text-sm text-gray-400 mb-6">
              {searchQuery || selectedTag ? '没有找到匹配的展品' : '点击右下角按钮开始收藏吧！'}
            </p>
            <Link
              to="/collection/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-mint-500 text-white rounded-full font-medium hover:bg-mint-600 transition-colors"
            >
              <Plus size={18} />
              添加第一件展品
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredExhibits.map((exhibit, index) => (
              <ExhibitCard
                key={exhibit.id}
                exhibit={exhibit}
                index={index}
                variant="route"
                showOrder
              />
            ))}
          </div>
        )}
      </div>

      {/* 添加按钮 */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
        className="fixed bottom-24 right-5 z-40"
      >
        <Link
          to="/collection/add"
          className="w-14 h-14 bg-gradient-to-br from-mint-400 to-mint-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all btn-bounce"
        >
          <Plus size={28} strokeWidth={2.5} />
        </Link>
      </motion.div>
    </div>
  );
}

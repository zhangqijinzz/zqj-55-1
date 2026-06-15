import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Image as ImageIcon, ChevronRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useMuseumStore } from '../store/useMuseumStore';
import { categoryOptions } from '../utils/mockData';

const categoryEmojis: Record<string, string> = {
  color: '🎨',
  animal: '🦁',
  artifact: '🏺',
  tech: '⚙️',
  custom: '✨',
};

export default function ExhibitionList() {
  const { exhibitions, exhibits } = useMuseumStore();
  
  const getCategoryLabel = (category: string) => {
    const found = categoryOptions.find(c => c.value === category);
    return found ? found.label : '自定义';
  };

  const getExhibitCount = (exhibitionId: string) => {
    const exhibition = exhibitions.find(e => e.id === exhibitionId);
    return exhibition ? exhibition.exhibitIds.length : 0;
  };

  const getExhibitionPreview = (exhibitionId: string) => {
    const exhibition = exhibitions.find(e => e.id === exhibitionId);
    if (!exhibition) return [];
    return exhibition.exhibitIds
      .slice(0, 4)
      .map(id => exhibits.find(e => e.id === id))
      .filter(Boolean);
  };

  return (
    <div className="min-h-screen pb-28">
      <PageHeader
        title="我的主题策展"
        subtitle={`共创建 ${exhibitions.length} 个主题展览`}
        variant="coral"
      />

      <div className="px-4 mt-6">
        {exhibitions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-gray-500 mb-2">还没有创建策展</p>
            <p className="text-sm text-gray-400 mb-6">
              发挥创意，打造属于你的小展览吧！
            </p>
            <Link
              to="/exhibitions/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-coral-500 text-white rounded-full font-medium hover:bg-coral-600 transition-colors"
            >
              <Plus size={18} />
              创建第一个主题
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {exhibitions.map((exhibition, index) => {
              const previewExhibits = getExhibitionPreview(exhibition.id);
              const count = getExhibitCount(exhibition.id);
              
              return (
                <motion.div
                  key={exhibition.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    to={`/exhibitions/${exhibition.id}`}
                    className="block bg-white rounded-3xl shadow-card overflow-hidden border border-primary-100"
                  >
                    {/* 封面区域 */}
                    <div
                      className="h-36 relative overflow-hidden"
                      style={{ backgroundColor: exhibition.coverColor || '#FF8A8A' }}
                    >
                      {/* 装饰圆形 */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full" />
                      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full" />
                      
                      {/* 内容 */}
                      <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <span className="text-3xl">
                            {categoryEmojis[exhibition.category] || '✨'}
                          </span>
                          <span className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium">
                            {count} 件展品
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1 drop-shadow-sm">
                            {exhibition.name}
                          </h3>
                          <p className="text-white/80 text-sm">
                            {getCategoryLabel(exhibition.category)}
                          </p>
                        </div>
                      </div>
                      
                      {/* 展品预览小图 */}
                      {previewExhibits.length > 0 && (
                        <div className="absolute right-4 bottom-16 flex -space-x-2">
                          {previewExhibits.map((exhibit, i) => (
                            <div
                              key={exhibit?.id || i}
                              className="w-10 h-10 rounded-lg border-2 border-white shadow bg-white/30 flex items-center justify-center text-xs"
                            >
                              🏺
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* 底部信息 */}
                    <div className="p-4 flex items-center justify-between">
                      <p className="text-sm text-gray-500 line-clamp-1 flex-1">
                        {exhibition.description || '点击查看这个主题展览'}
                      </p>
                      <ChevronRight size={18} className="text-gray-400 flex-shrink-0 ml-2" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
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
          to="/exhibitions/create"
          className="w-14 h-14 bg-gradient-to-br from-coral-400 to-coral-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all btn-bounce"
        >
          <Plus size={28} strokeWidth={2.5} />
        </Link>
      </motion.div>
    </div>
  );
}

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, X, ChevronDown, Check, Tag, Calendar, Layers, FileText, Image as ImageIcon } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import TagBadge from '../components/TagBadge';
import { useMuseumStore } from '../store/useMuseumStore';
import { eraOptions, materialOptions, allTags } from '../utils/mockData';
import { compressImage, getToday } from '../utils/storage';

export default function AddExhibit() {
  const navigate = useNavigate();
  const { addExhibit } = useMuseumStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [era, setEra] = useState('');
  const [material, setMaterial] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState('');
  const [showEraPicker, setShowEraPicker] = useState(false);
  const [showMaterialPicker, setShowMaterialPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const popularTags = allTags.slice(0, 12);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const compressed = await compressImage(file, 600);
      setImage(compressed);
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      setTags([...tags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('请输入展品名称');
      return;
    }
    
    setSaving(true);
    
    try {
      addExhibit({
        name: name.trim(),
        era: era || '未知',
        material: material || '未知',
        tags,
        image,
        notes: notes.trim(),
        visitDate: getToday(),
      });
      
      navigate('/collection');
    } catch (err) {
      console.error('Failed to save exhibit:', err);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const formFields = [
    {
      icon: FileText,
      label: '展品名称',
      value: name,
      onChange: (v: string) => setName(v),
      placeholder: '给这件展品起个名字',
      type: 'text',
    },
  ];

  return (
    <div className="min-h-screen pb-32 bg-cream-50">
      <PageHeader
        title="添加新展品"
        subtitle="记录你发现的宝贝"
        showBack
        variant="mint"
      />

      <div className="px-4 mt-6 space-y-4">
        {/* 图片上传 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-5 shadow-soft"
        >
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon size={18} className="text-mint-500" />
            <span className="font-semibold text-gray-800">展品照片</span>
          </div>
          
          {image ? (
            <div className="relative">
              <img
                src={image}
                alt="展品预览"
                className="w-full h-48 object-cover rounded-2xl"
              />
              <button
                onClick={() => setImage('')}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 border-2 border-dashed border-mint-300 rounded-2xl flex flex-col items-center justify-center text-mint-500 hover:bg-mint-50 transition-colors"
            >
              <Camera size={36} className="mb-2" />
              <span className="text-sm">点击拍照或上传图片</span>
            </button>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />
        </motion.div>

        {/* 基本信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-5 shadow-soft space-y-5"
        >
          {/* 展品名称 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-lg">🏷️</span>
              展品名称 *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="给这件展品起个名字"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-mint-400 focus:ring-2 focus:ring-mint-400/20 transition-all"
            />
          </div>

          {/* 年代选择 */}
          <div className="relative">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="text-mint-500" />
              年代
            </label>
            <button
              onClick={() => {
                setShowEraPicker(!showEraPicker);
                setShowMaterialPicker(false);
              }}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-left flex items-center justify-between focus:outline-none focus:border-mint-400 transition-colors"
            >
              <span className={era ? 'text-gray-800' : 'text-gray-400'}>
                {era || '选择年代'}
              </span>
              <ChevronDown size={18} className="text-gray-400" />
            </button>
            
            {showEraPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-20 max-h-60 overflow-y-auto"
              >
                {eraOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setEra(option);
                      setShowEraPicker(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-mint-50 flex items-center justify-between transition-colors ${
                      era === option ? 'text-mint-600 bg-mint-50' : 'text-gray-700'
                    }`}
                  >
                    <span>{option}</span>
                    {era === option && <Check size={16} />}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* 材质选择 */}
          <div className="relative">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Layers size={16} className="text-mint-500" />
              材质
            </label>
            <button
              onClick={() => {
                setShowMaterialPicker(!showMaterialPicker);
                setShowEraPicker(false);
              }}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-left flex items-center justify-between focus:outline-none focus:border-mint-400 transition-colors"
            >
              <span className={material ? 'text-gray-800' : 'text-gray-400'}>
                {material || '选择材质'}
              </span>
              <ChevronDown size={18} className="text-gray-400" />
            </button>
            
            {showMaterialPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-20 max-h-60 overflow-y-auto"
              >
                {materialOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setMaterial(option);
                      setShowMaterialPicker(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-mint-50 flex items-center justify-between transition-colors ${
                      material === option ? 'text-mint-600 bg-mint-50' : 'text-gray-700'
                    }`}
                  >
                    <span>{option}</span>
                    {material === option && <Check size={16} />}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* 印象标签 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-5 shadow-soft"
        >
          <div className="flex items-center gap-2 mb-4">
            <Tag size={18} className="text-mint-500" />
            <span className="font-semibold text-gray-800">印象标签</span>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  color="mint"
                  size="md"
                  onRemove={() => removeTag(tag)}
                />
              ))}
            </div>
          )}
          
          {/* 自定义标签输入 */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
              placeholder="输入自定义标签"
              className="flex-1 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-mint-400"
            />
            <button
              onClick={addCustomTag}
              className="px-4 py-2 bg-mint-500 text-white rounded-xl text-sm font-medium hover:bg-mint-600 transition-colors"
            >
              添加
            </button>
          </div>
          
          {/* 热门标签 */}
          <p className="text-xs text-gray-400 mb-2">热门标签</p>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => addTag(tag)}
                disabled={tags.includes(tag)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  tags.includes(tag)
                    ? 'bg-mint-100 text-mint-500 cursor-default'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 备注 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-5 shadow-soft"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📝</span>
            <span className="font-semibold text-gray-800">我的感想</span>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="记录你对这件展品的想法和感受..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 resize-none focus:outline-none focus:border-mint-400 focus:ring-2 focus:ring-mint-400/20 transition-all"
          />
        </motion.div>
      </div>

      {/* 底部保存按钮 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 safe-bottom z-40">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || saving}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all btn-bounce ${
              name.trim() && !saving
                ? 'bg-gradient-to-r from-mint-400 to-mint-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {saving ? '保存中...' : '✨ 收藏这件展品'}
          </button>
        </div>
      </div>
    </div>
  );
}

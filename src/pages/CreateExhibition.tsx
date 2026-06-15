import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Palette, Type, FileText, Check } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useMuseumStore } from '../store/useMuseumStore';
import { categoryOptions } from '../utils/mockData';
import type { ExhibitionCategory } from '../types';

const colorOptions = [
  { value: '#D4A574', name: '暖琥珀' },
  { value: '#7FB77E', name: '薄荷绿' },
  { value: '#FF8A8A', name: '珊瑚粉' },
  { value: '#89CFF0', name: '天空蓝' },
  { value: '#B19CD9', name: '薰衣紫' },
  { value: '#FFD93D', name: '柠檬黄' },
  { value: '#6BCB77', name: '森林绿' },
  { value: '#FF6B6B', name: '草莓红' },
  { value: '#4D96FF', name: '深海蓝' },
  { value: '#C780FA', name: '梦幻紫' },
  { value: '#FF9F43', name: '橙子橙' },
  { value: '#54A0FF', name: '冰川蓝' },
];

export default function CreateExhibition() {
  const navigate = useNavigate();
  const { addExhibition } = useMuseumStore();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExhibitionCategory>('custom');
  const [coverColor, setCoverColor] = useState('#FF8A8A');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('请输入主题名称');
      return;
    }
    
    setSaving(true);
    
    try {
      addExhibition({
        name: name.trim(),
        category,
        coverColor,
        description: description.trim(),
      });
      
      navigate('/exhibitions');
    } catch (err) {
      console.error('Failed to create exhibition:', err);
      alert('创建失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-cream-50">
      <PageHeader
        title="创建新主题"
        subtitle="打造你的专属小展览"
        showBack
        variant="coral"
      />

      <div className="px-4 mt-6 space-y-4">
        {/* 主题名称 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-5 shadow-soft"
        >
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Type size={18} className="text-coral-500" />
            主题名称 *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="给你的主题起个名字"
            maxLength={20}
            className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-400/20 transition-all text-lg"
          />
          <p className="text-xs text-gray-400 mt-2 text-right">{name.length}/20</p>
        </motion.div>

        {/* 主题分类 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-5 shadow-soft"
        >
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
            <Palette size={18} className="text-coral-500" />
            选择分类
          </label>
          <div className="grid grid-cols-5 gap-3">
            {categoryOptions.map((item) => (
              <button
                key={item.value}
                onClick={() => setCategory(item.value as ExhibitionCategory)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                  category === item.value
                    ? 'bg-coral-100 border-2 border-coral-400'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className={`text-xs font-medium ${
                  category === item.value ? 'text-coral-600' : 'text-gray-600'
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 封面颜色 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-5 shadow-soft"
        >
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span className="text-lg">🎨</span>
              封面颜色
            </label>
            <div
              className="w-8 h-8 rounded-full shadow-inner border-2 border-white"
              style={{ backgroundColor: coverColor }}
            />
          </div>
          <div className="grid grid-cols-6 gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => setCoverColor(color.value)}
                className={`aspect-square rounded-2xl transition-all relative ${
                  coverColor === color.value
                    ? 'ring-4 ring-offset-2 ring-coral-400 scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color.value }}
              >
                {coverColor === color.value && (
                  <Check size={16} className="absolute inset-0 m-auto text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 主题描述 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-5 shadow-soft"
        >
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <FileText size={18} className="text-coral-500" />
            主题介绍
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="介绍一下这个主题..."
            maxLength={100}
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 resize-none focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-400/20 transition-all"
          />
          <p className="text-xs text-gray-400 mt-2 text-right">{description.length}/100</p>
        </motion.div>

        {/* 预览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-5 shadow-soft"
        >
          <p className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
            <span className="text-lg">👀</span>
            预览效果
          </p>
          <div
            className="h-32 rounded-2xl relative overflow-hidden shadow-lg"
            style={{ backgroundColor: coverColor }}
          >
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/20 rounded-full" />
            <div className="relative z-10 p-4 h-full flex flex-col justify-between">
              <span className="text-2xl">
                {categoryOptions.find(c => c.value === category)?.emoji || '✨'}
              </span>
              <div>
                <h4 className="text-lg font-bold text-white drop-shadow-sm">
                  {name || '主题名称'}
                </h4>
                <p className="text-white/80 text-xs mt-0.5">
                  {categoryOptions.find(c => c.value === category)?.label || '自定义'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 底部创建按钮 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 safe-bottom z-40">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || saving}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all btn-bounce ${
              name.trim() && !saving
                ? 'bg-gradient-to-r from-coral-400 to-coral-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {saving ? '创建中...' : '🎨 创建主题'}
          </button>
        </div>
      </div>
    </div>
  );
}

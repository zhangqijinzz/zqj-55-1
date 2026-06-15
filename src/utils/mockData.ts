import type { Exhibit, Exhibition } from '../types';
import { generateId, getToday } from './storage';

const today = getToday();
const now = Date.now();

export const mockExhibits: Exhibit[] = [
  {
    id: generateId(),
    name: '青铜鼎',
    era: '商代晚期',
    material: '青铜',
    tags: ['礼器', '饕餮纹', '三足', '国家一级文物'],
    image: '',
    notes: '器形厚重，纹饰精美，鼎身饰有饕餮纹，是商代青铜铸造技艺的巅峰之作。',
    visitOrder: 1,
    visitDate: today,
    createdAt: now - 3600000,
    updatedAt: now - 3600000,
  },
  {
    id: generateId(),
    name: '玉猪龙',
    era: '红山文化',
    material: '岫岩玉',
    tags: ['玉器', '猪首龙身', 'C形', '史前文明'],
    image: '',
    notes: '红山文化代表性玉器，猪首龙身，蜷曲成C形，是中国龙文化的雏形。',
    visitOrder: 2,
    visitDate: today,
    createdAt: now - 3000000,
    updatedAt: now - 3000000,
  },
  {
    id: generateId(),
    name: '唐三彩骆驼',
    era: '唐代',
    material: '釉陶',
    tags: ['三彩釉', '骆驼', '丝绸之路', '陶俑'],
    image: '',
    notes: '色彩斑斓，造型生动，是唐代丝绸之路文化交流的见证。',
    visitOrder: 3,
    visitDate: today,
    createdAt: now - 2400000,
    updatedAt: now - 2400000,
  },
  {
    id: generateId(),
    name: '青花缠枝莲纹瓶',
    era: '明代永乐',
    material: '瓷器',
    tags: ['青花瓷', '缠枝莲', '官窑', '蓝色'],
    image: '',
    notes: '青花发色浓艳，缠枝莲纹流畅优美，是永乐官窑的精品。',
    visitOrder: 4,
    visitDate: today,
    createdAt: now - 1800000,
    updatedAt: now - 1800000,
  },
  {
    id: generateId(),
    name: '金缕玉衣',
    era: '西汉',
    material: '玉片 + 金线',
    tags: ['金缕', '玉衣', '丧葬', '汉代'],
    image: '',
    notes: '由两千多片玉片用金线编缀而成，是汉代贵族的殓服，体现了汉人"事死如事生"的观念。',
    visitOrder: 5,
    visitDate: today,
    createdAt: now - 1200000,
    updatedAt: now - 1200000,
  },
  {
    id: generateId(),
    name: '彩绘陶兵马俑',
    era: '秦代',
    material: '陶土',
    tags: ['兵马俑', '军队', '秦始皇', '千人千面'],
    image: '',
    notes: '每个士兵面容各异，神态逼真，再现了秦代军队的威武阵容。',
    visitOrder: 6,
    visitDate: today,
    createdAt: now - 600000,
    updatedAt: now - 600000,
  },
];

export const mockExhibitions: Exhibition[] = [
  {
    id: generateId(),
    name: '青铜时代',
    category: 'artifact',
    coverColor: '#D4A574',
    description: '探索青铜文明的辉煌，感受古人的智慧与工艺',
    exhibitIds: [],
    createdAt: now - 7200000,
    updatedAt: now - 7200000,
  },
  {
    id: generateId(),
    name: '动物世界',
    category: 'animal',
    coverColor: '#7FB77E',
    description: '文物中的动物形象，看看古人笔下的可爱生灵',
    exhibitIds: [],
    createdAt: now - 5400000,
    updatedAt: now - 5400000,
  },
];

export const inspirationThemes = [
  '寻找所有金色的展品',
  '收集有龙纹的文物',
  '办一个"唐代的一天"展览',
  '找一找陶瓷里的蓝色',
  '动物主题：从陶猪到铜马',
  '玉的故事：从石器时代到明清',
  '丝路遗珍：来自西域的宝贝',
  '小小兵器库：古代的武器',
  '书法之美：汉字的艺术',
  '吃货的博物馆：古代饮食文化',
];

export const allTags = [
  '礼器', '饕餮纹', '三足', '国家一级文物',
  '玉器', '猪首龙身', 'C形', '史前文明',
  '三彩釉', '骆驼', '丝绸之路', '陶俑',
  '青花瓷', '缠枝莲', '官窑', '蓝色',
  '金缕', '玉衣', '丧葬', '汉代',
  '兵马俑', '军队', '秦始皇', '千人千面',
  '青铜', '陶瓷', '玉石', '金银',
  '动物', '人物', '纹饰', '文字',
];

export const challengeTips = [
  '它叫什么名字？是什么朝代的？',
  '它是用什么材料做成的？',
  '你觉得它最特别的地方是什么？',
  '如果让你给这件展品起个外号，你会叫它什么？',
  '想象一下，古人用它来做什么？',
  '你最喜欢它身上的哪个纹饰？',
  '它和我们今天的什么东西很像？',
  '如果它会说话，你想问它什么问题？',
  '用三个词来形容这件展品',
  '给你的好朋友介绍一下这件宝贝吧！',
];

export const eraOptions = [
  '史前', '新石器时代', '夏代', '商代', '西周', '春秋战国',
  '秦代', '西汉', '东汉', '三国', '两晋', '南北朝',
  '隋代', '唐代', '五代', '宋代', '辽代', '金代',
  '元代', '明代', '清代', '近现代', '其他',
];

export const materialOptions = [
  '青铜', '陶瓷', '玉石', '金银', '铁器',
  '漆器', '丝织', '书画', '甲骨', '竹木',
  '玻璃', '陶土', '其他',
];

export const categoryOptions = [
  { value: 'color', label: '颜色主题', emoji: '🎨' },
  { value: 'animal', label: '动物主题', emoji: '🦁' },
  { value: 'artifact', label: '器物主题', emoji: '🏺' },
  { value: 'tech', label: '科技主题', emoji: '⚙️' },
  { value: 'custom', label: '自定义', emoji: '✨' },
];

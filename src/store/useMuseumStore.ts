import { create } from 'zustand';
import type { Exhibit, Exhibition, ChallengeRecord, AppState } from '../types';
import { loadFromStorage, saveToStorage, generateId, getToday } from '../utils/storage';
import { mockExhibits, mockExhibitions } from '../utils/mockData';

interface MuseumStore extends AppState {
  isInitialized: boolean;
  
  init: () => void;
  
  addExhibit: (exhibit: Omit<Exhibit, 'id' | 'createdAt' | 'updatedAt' | 'visitOrder'>) => void;
  updateExhibit: (id: string, updates: Partial<Exhibit>) => void;
  deleteExhibit: (id: string) => void;
  getExhibitById: (id: string) => Exhibit | undefined;
  
  addExhibition: (exhibition: Omit<Exhibition, 'id' | 'createdAt' | 'updatedAt' | 'exhibitIds'>) => void;
  updateExhibition: (id: string, updates: Partial<Exhibition>) => void;
  deleteExhibition: (id: string) => void;
  addExhibitToExhibition: (exhibitionId: string, exhibitId: string) => void;
  removeExhibitFromExhibition: (exhibitionId: string, exhibitId: string) => void;
  getExhibitionById: (id: string) => Exhibition | undefined;
  
  addChallengeRecord: (record: Omit<ChallengeRecord, 'id' | 'completedAt'>) => void;
  getChallengeStats: () => { total: number; streak: number };
  
  getVisitRecords: () => { date: string; count: number }[];
  getTodayVisits: () => Exhibit[];
  getAllTags: () => string[];
}

const STORAGE_KEY_EXHIBITS = 'exhibits';
const STORAGE_KEY_EXHIBITIONS = 'exhibitions';
const STORAGE_KEY_CHALLENGES = 'challenges';
const STORAGE_KEY_INIT = 'initialized';

export const useMuseumStore = create<MuseumStore>((set, get) => ({
  exhibits: [],
  exhibitions: [],
  challengeRecords: [],
  isInitialized: false,
  
  init: () => {
    const isInited = loadFromStorage<boolean>(STORAGE_KEY_INIT, false);
    
    let exhibits: Exhibit[];
    let exhibitions: Exhibition[];
    
    if (isInited) {
      exhibits = loadFromStorage<Exhibit[]>(STORAGE_KEY_EXHIBITS, []);
      exhibitions = loadFromStorage<Exhibition[]>(STORAGE_KEY_EXHIBITIONS, []);
    } else {
      exhibits = mockExhibits;
      exhibitions = mockExhibitions;
      
      if (exhibits.length > 0) {
        exhibitions[0].exhibitIds = [exhibits[0].id, exhibits[5].id];
        exhibitions[1].exhibitIds = [exhibits[1].id, exhibits[2].id];
      }
      
      saveToStorage(STORAGE_KEY_EXHIBITS, exhibits);
      saveToStorage(STORAGE_KEY_EXHIBITIONS, exhibitions);
      saveToStorage(STORAGE_KEY_INIT, true);
    }
    
    const challengeRecords = loadFromStorage<ChallengeRecord[]>(STORAGE_KEY_CHALLENGES, []);
    
    set({
      exhibits,
      exhibitions,
      challengeRecords,
      isInitialized: true,
    });
  },
  
  addExhibit: (exhibitData) => {
    const { exhibits } = get();
    const today = getToday();
    const todayVisits = exhibits.filter(e => e.visitDate === today);
    const visitOrder = todayVisits.length + 1;
    
    const newExhibit: Exhibit = {
      ...exhibitData,
      id: generateId(),
      visitOrder,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const updated = [...exhibits, newExhibit];
    set({ exhibits: updated });
    saveToStorage(STORAGE_KEY_EXHIBITS, updated);
  },
  
  updateExhibit: (id, updates) => {
    const { exhibits } = get();
    const updated = exhibits.map(e => 
      e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e
    );
    set({ exhibits: updated });
    saveToStorage(STORAGE_KEY_EXHIBITS, updated);
  },
  
  deleteExhibit: (id) => {
    const { exhibits, exhibitions } = get();
    const updatedExhibits = exhibits.filter(e => e.id !== id);
    
    const updatedExhibitions = exhibitions.map(ex => ({
      ...ex,
      exhibitIds: ex.exhibitIds.filter(eid => eid !== id),
    }));
    
    set({ exhibits: updatedExhibits, exhibitions: updatedExhibitions });
    saveToStorage(STORAGE_KEY_EXHIBITS, updatedExhibits);
    saveToStorage(STORAGE_KEY_EXHIBITIONS, updatedExhibitions);
  },
  
  getExhibitById: (id) => {
    return get().exhibits.find(e => e.id === id);
  },
  
  addExhibition: (exhibitionData) => {
    const { exhibitions } = get();
    const newExhibition: Exhibition = {
      ...exhibitionData,
      id: generateId(),
      exhibitIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const updated = [...exhibitions, newExhibition];
    set({ exhibitions: updated });
    saveToStorage(STORAGE_KEY_EXHIBITIONS, updated);
  },
  
  updateExhibition: (id, updates) => {
    const { exhibitions } = get();
    const updated = exhibitions.map(e => 
      e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e
    );
    set({ exhibitions: updated });
    saveToStorage(STORAGE_KEY_EXHIBITIONS, updated);
  },
  
  deleteExhibition: (id) => {
    const { exhibitions } = get();
    const updated = exhibitions.filter(e => e.id !== id);
    set({ exhibitions: updated });
    saveToStorage(STORAGE_KEY_EXHIBITIONS, updated);
  },
  
  addExhibitToExhibition: (exhibitionId, exhibitId) => {
    const { exhibitions } = get();
    const updated = exhibitions.map(e => {
      if (e.id === exhibitionId && !e.exhibitIds.includes(exhibitId)) {
        return { ...e, exhibitIds: [...e.exhibitIds, exhibitId], updatedAt: Date.now() };
      }
      return e;
    });
    set({ exhibitions: updated });
    saveToStorage(STORAGE_KEY_EXHIBITIONS, updated);
  },
  
  removeExhibitFromExhibition: (exhibitionId, exhibitId) => {
    const { exhibitions } = get();
    const updated = exhibitions.map(e => {
      if (e.id === exhibitionId) {
        return { ...e, exhibitIds: e.exhibitIds.filter(id => id !== exhibitId), updatedAt: Date.now() };
      }
      return e;
    });
    set({ exhibitions: updated });
    saveToStorage(STORAGE_KEY_EXHIBITIONS, updated);
  },
  
  getExhibitionById: (id) => {
    return get().exhibitions.find(e => e.id === id);
  },
  
  addChallengeRecord: (recordData) => {
    const { challengeRecords } = get();
    const newRecord: ChallengeRecord = {
      ...recordData,
      id: generateId(),
      completedAt: Date.now(),
    };
    
    const updated = [...challengeRecords, newRecord];
    set({ challengeRecords: updated });
    saveToStorage(STORAGE_KEY_CHALLENGES, updated);
  },
  
  getChallengeStats: () => {
    const { challengeRecords } = get();
    const total = challengeRecords.length;
    
    let streak = 0;
    if (total > 0) {
      const uniqueDates = new Set<string>();
      challengeRecords.forEach(record => {
        const d = new Date(record.completedAt);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        uniqueDates.add(dateStr);
      });
      
      const sortedDates = Array.from(uniqueDates).sort().reverse();
      const today = getToday();
      
      let currentDate = new Date();
      const todayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(currentDate.getDate()).padStart(2,'0')}`;
      
      if (sortedDates[0] === todayStr) {
        streak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          currentDate.setDate(currentDate.getDate() - 1);
          const prevDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(currentDate.getDate()).padStart(2,'0')}`;
          
          if (sortedDates[i] === prevDateStr) {
            streak++;
          } else {
            break;
          }
        }
      } else {
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;
        
        if (sortedDates[0] === yesterdayStr) {
          streak = 1;
          currentDate = yesterday;
          for (let i = 1; i < sortedDates.length; i++) {
            currentDate.setDate(currentDate.getDate() - 1);
            const prevDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(currentDate.getDate()).padStart(2,'0')}`;
            
            if (sortedDates[i] === prevDateStr) {
              streak++;
            } else {
              break;
            }
          }
        }
      }
    }
    
    return { total, streak };
  },
  
  getVisitRecords: () => {
    const { exhibits } = get();
    const dateMap = new Map<string, number>();
    
    exhibits.forEach(e => {
      const count = dateMap.get(e.visitDate) || 0;
      dateMap.set(e.visitDate, count + 1);
    });
    
    return Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => b.date.localeCompare(a.date));
  },
  
  getTodayVisits: () => {
    const { exhibits } = get();
    const today = getToday();
    return exhibits
      .filter(e => e.visitDate === today)
      .sort((a, b) => a.visitOrder - b.visitOrder);
  },
  
  getAllTags: () => {
    const { exhibits } = get();
    const tagSet = new Set<string>();
    exhibits.forEach(e => e.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet);
  },
}));

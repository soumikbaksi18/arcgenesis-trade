import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import { Strategy } from '../utils/mockStrategyData';
import { StrategyApiPayload } from '../utils/strategyToApiJson';

export interface SavedStrategy extends Strategy {
  nodes: Node[];
  edges: Edge[];
  apiPayload: StrategyApiPayload;
  createdAt: number;
  updatedAt: number;
}

interface StrategiesState {
  strategies: SavedStrategy[];
  
  // Actions
  addStrategy: (strategy: Omit<SavedStrategy, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateStrategy: (id: string, updates: Partial<SavedStrategy>) => void;
  deleteStrategy: (id: string) => void;
  getStrategy: (id: string) => SavedStrategy | undefined;
  getMyStrategies: () => SavedStrategy[];
  loadStrategies: () => void;
}

const STORAGE_KEY = 'arcgenesis-strategies-storage';

const loadFromStorage = (): SavedStrategy[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading strategies from storage:', error);
  }
  return [];
};

const saveToStorage = (strategies: SavedStrategy[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(strategies));
  } catch (error) {
    console.error('Error saving strategies to storage:', error);
  }
};

export const useStrategiesStore = create<StrategiesState>((set, get) => ({
  strategies: loadFromStorage(),

  loadStrategies: () => {
    const strategies = loadFromStorage();
    set({ strategies });
  },

  addStrategy: (strategyData) => {
    const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const newStrategy: SavedStrategy = {
      ...strategyData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    const updatedStrategies = [...get().strategies, newStrategy];
    set({ strategies: updatedStrategies });
    saveToStorage(updatedStrategies);
    return id;
  },

  updateStrategy: (id, updates) => {
    const updatedStrategies = get().strategies.map((s) =>
      s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
    );
    set({ strategies: updatedStrategies });
    saveToStorage(updatedStrategies);
  },

  deleteStrategy: (id) => {
    const updatedStrategies = get().strategies.filter((s) => s.id !== id);
    set({ strategies: updatedStrategies });
    saveToStorage(updatedStrategies);
  },

  getStrategy: (id) => {
    return get().strategies.find((s) => s.id === id);
  },

  getMyStrategies: () => {
    return get().strategies.filter((s) => s.isMyStrategy);
  },
}));


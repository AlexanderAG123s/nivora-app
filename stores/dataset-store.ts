import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Dataset, get1DArray } from '@/lib/statistics/dataset';

export interface DatasetHistoryItem {
  id: string;
  name: string;
  timestamp: number;
  dataset: Dataset;
  meanPreview: number;
  count: number;
}

interface DatasetState {
  activeId: string | null;
  activeDataset: Dataset | null;
  activeRawInput: string;
  activeData: number[]; // 1D projection for backward compatibility
  
  history: DatasetHistoryItem[];

  setDataset: (rawInput: string, dataset: Dataset, name?: string) => void;
  loadHistoryItem: (id: string) => void;
  clearDataset: () => void;
  deleteHistoryItem: (id: string) => void;
}

export const useDatasetStore = create<DatasetState>()(
  persist(
    (set, get) => ({
      activeId: null,
      activeDataset: null,
      activeData: [],
      activeRawInput: '',
      history: [],

      setDataset: (rawInput, dataset, name = "Dataset sin título") => {
        const id = crypto.randomUUID();
        const timestamp = Date.now();
        const data1D = get1DArray(dataset);
        const meanPreview = data1D.length > 0 ? data1D.reduce((a, b) => a + b, 0) / data1D.length : 0;
        
        const historyItem: DatasetHistoryItem = {
          id,
          name,
          timestamp,
          dataset,
          meanPreview,
          count: data1D.length
        };

        set((state) => ({
          activeId: id,
          activeRawInput: rawInput,
          activeDataset: dataset,
          activeData: data1D,
          history: [historyItem, ...state.history].slice(0, 10)
        }));
      },

      loadHistoryItem: (id) => {
        const { history } = get();
        const item = history.find(h => h.id === id);
        if (item) {
          set({
            activeId: item.id,
            activeDataset: item.dataset,
            activeData: get1DArray(item.dataset),
            activeRawInput: item.dataset.type === '1D' ? (item.dataset.data as number[]).join(', ') : "Data 2D importado..."
          });
        }
      },

      clearDataset: () => {
        set({
          activeId: null,
          activeDataset: null,
          activeData: [],
          activeRawInput: ''
        });
      },

      deleteHistoryItem: (id) => {
        set((state) => ({
          history: state.history.filter(h => h.id !== id),
          activeId: state.activeId === id ? null : state.activeId,
          activeDataset: state.activeId === id ? null : state.activeDataset,
          activeData: state.activeId === id ? [] : state.activeData,
          activeRawInput: state.activeId === id ? '' : state.activeRawInput
        }));
      }
    }),
    {
      name: 'nivora-dataset-storage-v2'
    }
  )
);

import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';
import { generateEmbedding, type Embedding } from './lore.embeddings';
import { indexedDBStorage } from '@/lib/indexed-db.storage';

type LoreType = 'place' | 'character';
export type LoreFact = { embedding: Embedding; content: string; type: LoreType };
export interface LoreState {
  lore: LoreFact[];
}

interface LoreActions {
  setLore: (newLore: string, type: LoreType, previousEmbedding?: Embedding) => void;
}

export const initialState: LoreState = {
  lore: [],
}

export const useDaimStore = create<LoreState & LoreActions>()(
  persist(
    (set) => ({
      ...initialState,
      setLore: async (newLore: string, type: LoreType, previousEmbedding?: Embedding) => {
        const newEmbedding = await generateEmbedding(newLore);

        set(({ lore }) => ({
          lore: [
            ...lore.filter((lore) => lore.embedding === previousEmbedding),
            { embedding: newEmbedding, content: newLore, type },
          ],
        }));
      },
    }),
    {
      name: 'daim-lore',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  ),
);

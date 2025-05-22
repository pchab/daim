import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';
import { filterRelevantContent, generateEmbedding, type Embedding, type WithEmbedding } from '../lib/embeddings';
import type { LoreFact } from '@/modules/lore/lore.model';
export interface LoreState {
  lore: WithEmbedding<LoreFact>[];
  texts: string[];
}

interface LoreActions {
  getRelevantLore: (query: string) => Promise<LoreFact[]>;
  setLore: (newLore: LoreFact[]) => Promise<void>;
  setTexts: (text: string[]) => void;
}

export const initialState: LoreState = {
  lore: [],
  texts: ['Welcome, brave adventurer, to the mystical land of Eldoria. You find yourself standing at the center of the village of Ironwood. What do you do?']
}

export const useDaimStore = create<LoreState & LoreActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      getRelevantLore: async (query: string) => {
        const { lore } = get();
        const embeddingFilter = await filterRelevantContent(query);
        return lore.filter(embeddingFilter);
      },
      setLore: async (newLore: LoreFact[]) => set({
        lore: await Promise.all(
          newLore
            .filter(({ type }) => ['location', 'character'].includes(type))
            .map(async ({ content, type }) => {
              const title = content.split(':')[0];
              const embedding = await generateEmbedding(title);
              return { content, type, embedding };
            })
        ),
      }),
      setTexts: (texts: string[]) => set(({ texts })),
    }),
    {
      name: 'daim-lore',
      storage: createJSONStorage(() => sessionStorage),
    }
  ),
);

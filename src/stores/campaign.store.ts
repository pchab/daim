import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';
import { filterRelevantContent, generateEmbedding, type Embedding, type WithEmbedding } from '../lib/embeddings';
import type { LoreFact } from '@/modules/lore/lore.model';
export interface LoreState {
  lore: WithEmbedding<LoreFact>[];
  texts: string[];
  shouldUpdateLore: boolean;
}

interface LoreActions {
  tagRelevantLore: (query: string) => Promise<void>;
  setLore: (newLore: LoreFact[]) => Promise<void>;
  setTexts: (text: string[]) => void;
  changeShouldUpdateLore: (shouldUpdateLore: boolean) => void;
}

export const initialState: LoreState = {
  lore: [],
  texts: ['Welcome, brave adventurer, to the mystical land of Eldoria. You find yourself standing at the center of the village of Ironwood. What do you do?'],
  shouldUpdateLore: false,
}

export const useDaimStore = create<LoreState & LoreActions>()(
  persist(
    (set) => ({
      ...initialState,
      tagRelevantLore: async (query: string) => {
        console.log({ query });
        const embeddingFilter = await filterRelevantContent<WithEmbedding<LoreFact>>(query);
        set(({ lore }) => ({
          lore: lore.map((loreFact) => ({ ...loreFact, relevant: embeddingFilter(loreFact) })),
        }));
      },
      setLore: async (newLore: LoreFact[]) => set({
        lore: await Promise.all(
          newLore
            .filter(({ type }) => ['location', 'character'].includes(type))
            .map(async ({ name, ...loreData }) => {
              const embedding = await generateEmbedding(name);
              return { name, embedding, ...loreData };
            })
        ),
      }),
      setTexts: (texts: string[]) => set(({ texts })),
      changeShouldUpdateLore: (shouldUpdateLore: boolean) => set(({ shouldUpdateLore })),
    }),
    {
      name: 'daim-lore',
      storage: createJSONStorage(() => sessionStorage),
    }
  ),
);

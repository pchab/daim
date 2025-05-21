import type { StateStorage } from 'zustand/middleware';
import { del, get, put, startTransaction } from './indexed-db';

const STORE_NAME = 'daim-lore-store';

export const indexedDBStorage: StateStorage = {
  getItem: async (): Promise<string | null> => {
    const transaction = await startTransaction();
    const result = await get(transaction)(STORE_NAME);
    return result ? JSON.stringify(result) : null;
  },
  setItem: async (_name: string, value: string): Promise<void> => {
    const transaction = await startTransaction();
    await put(transaction)(STORE_NAME, value);
  },
  removeItem: async (): Promise<void> => {
    const transaction = await startTransaction();
    await del(transaction)(STORE_NAME);
  },
};

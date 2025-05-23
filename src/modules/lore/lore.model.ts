import { jsonSchema } from 'ai';

export type LoreType = 'location' | 'character';
export type LoreFact = { name: string; content: string; type: LoreType, relevant?: boolean };

export const loreSchema = jsonSchema<LoreFact>({
  type: 'object',
  properties: {
    name: { type: 'string' },
    content: { type: 'string' },
    type: { type: 'string' },
  },
  required: ['name', 'content', 'type'],
});
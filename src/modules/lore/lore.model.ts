import { jsonSchema } from 'ai';

export type LoreType = 'location' | 'character';
export type LoreFact = { content: string; type: LoreType };

export const loreSchema = jsonSchema<LoreFact>({
  type: 'object',
  properties: {
    content: { type: 'string' },
    type: { type: 'string' },
  },
  required: ['content', 'type'],
});
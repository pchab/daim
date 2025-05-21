import { embed } from 'ai';
import { ollama } from 'ollama-ai-provider';
import type { LoreFact } from './lore.store';

export type Embedding = number[];

const embeddingModel = ollama.embedding('nomic-embed-text');
const RelevanceThreshold = 0.5;

function cosineDistance(a: Embedding, b: Embedding) {
  let dotProduct = 0;
  let aMagnitude = 0;
  let bMagnitude = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    aMagnitude += a[i] * a[i];
    bMagnitude += b[i] * b[i];
  }
  aMagnitude = Math.sqrt(aMagnitude);
  bMagnitude = Math.sqrt(bMagnitude);
  const cosineSimilarity = dotProduct / (aMagnitude * bMagnitude);
  return 1 - cosineSimilarity;
}

export const generateEmbedding = async (
  value: string,
): Promise<Embedding> => {
  const { embedding } = await embed({
    model: embeddingModel,
    value,
  });
  return embedding;
};

export const filterRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);

  return (lore: LoreFact) => {
    const similarity = cosineDistance(lore.embedding, userQueryEmbedded);
    return similarity < RelevanceThreshold;
  };
};
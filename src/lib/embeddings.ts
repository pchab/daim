import { embed } from 'ai';
import { ollama } from 'ollama-ai-provider';

export type Embedding = number[];
export type WithEmbedding<T> = T & { embedding: Embedding };

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
  return dotProduct / (aMagnitude * bMagnitude);
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

export async function filterRelevantContent<X extends { embedding: Embedding }>(userQuery: string) {
  const userQueryEmbedding = await generateEmbedding(userQuery);
  return (content: X) => {
    const similarity = cosineDistance(content.embedding, userQueryEmbedding);
    return similarity > RelevanceThreshold;
  };
};